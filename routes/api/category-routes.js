const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  const data = await Category.findAll({ include: Product });
  res.json(data);

});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  const id = req.params.id;
  const data = await Category.findByPk(id, { include: Product });
  res.json(data);
});

router.post('/', async (req, res) => {
  // create a new category
  const { category_name } = req.body;

  if(category_name) {
    const newData = {
      category_name: category_name
    };

  const addData = await Category.create(newData);

  res.json(addData);
  }
  else {
    res.send(`Incorrect fields in post request`)
  };

});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  const id = req.params.id;
  const { category_name } = req.body;

  const update = await Category.update({ category_name: category_name }, {
    where: {
      id: id
    }
  });

  res.json(await Category.findByPk(id));

});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  const id = req.params.id;

  const destroy = await Category.destroy({
    where: {
      id: id
    }
  });

  res.sendStatus(200);

});

module.exports = router;
