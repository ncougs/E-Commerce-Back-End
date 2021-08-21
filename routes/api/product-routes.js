const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const data = await Product.findAll({ include: [Category, Tag] });
    res.status(200).json(data);
  } 
  catch (err) {
    res.status(500).json(err);
  }

});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data

  try {
    const id = req.params.id;
    const data = await Product.findByPk(id, { include: [Category, Tag] });
    res.status(200).json(data);
  } 
  catch (err) {
    res.status(500).json(err);
  }

});

// create new product
  /* req.body should look like this...
    {
      "product_name": "Basketball",
      "price": 250.25,
      "stock": 1,
      "category_id": 1,
      "tagIds": [3,1]
    }

  */
router.post('/', async (req, res) => {
  try{

    const { product_name, price, stock, category_id } = req.body;

    if (product_name && price && stock && category_id) {

      const productOut = {
        product_name: product_name,
        price: price,
        stock: stock,
        category_id: category_id
      };

      const product = await Product.create(productOut);

      //if tagIDs are included in the body
      if (req.body.tagIds) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
  
        const addTags = await ProductTag.bulkCreate(productTagIdArr);
      };
      //else return new product
      const result = await Product.findByPk(product.id, { include: [Category, Tag] });
  
      res.status(200).status(200).json(result);
    }
    else {
      res.status(400).send(`Incorrect field in body request`)
    }
    
  }
  catch(err){
    res.status(500).json(err);
  };
});

// update product
router.put('/:id', async (req, res) => {
  // update product data

  try {
    const id = req.params.id;

    const productUpdate = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
  
    if (req.body.tagIds) {
  
      const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });
  
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);
  
      // run both actions
      const updatedProductTags = await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
  
      };
  
      const result = await Product.findByPk(id, { include: [Category, Tag] });
  
      res.status(200).json(result);
  } 
  catch (err) {
    res.status(500).json(err);
  }

});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const id = req.params.id;

    const destroy = await Product.destroy({
      where: {
        id: id
      }
    });
  
    res.status(200).send(`${id} successfully deleted`);
  } 
  catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
