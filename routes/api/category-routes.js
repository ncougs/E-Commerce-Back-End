const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // and associated Products
  try {
    const data = await Category.findAll({ include: Product });
    res.status(200).json(data);
  }
  catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const id = req.params.id;
    const data = await Category.findByPk(id, { include: Product });
    res.status(200).json(data);
  } 
  catch (err) {
    res.status(500).json(err);
  }

});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const { category_name } = req.body;

  if(category_name) {
    const newData = {
      category_name: category_name
    };

  const addData = await Category.create(newData);

  res.status(200).json(addData);
  }
  else {
    res.status(400).send(`Incorrect field in body request`)
  };
  } 
  catch (err) {
    res.status(500).json(err);
  }  

});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const id = req.params.id;
    const { category_name } = req.body;

    if (category_name) {
      const update = await Category.update({ category_name: category_name }, {
        where: {
          id: id
        }
      });
    
      res.status(200).json(await Category.findByPk(id));
    }
    else {
      res.status(400).send(`Incorrect field in body request`)
    }
  
  } 
  catch (err) {
    res.status(500).json(err);
  }


});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const id = req.params.id;

    const destroy = await Category.destroy({
      where: {
        id: id
      }
    });

    res.status(200).send(`${id} deleted successfully`);

  } 
  catch (err) {
    res.status(500).json(err);
  }
  
});

module.exports = router;
