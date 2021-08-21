const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  const data = await Tag.findAll({ include: Product });
  res.json(data);
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  const id = req.params.id;
  const data = await Tag.findByPk(id, { include: Product });
  res.json(data);
});

router.post('/', async (req, res) => {
  // create a new tag
  const { tag_name } = req.body;

  if(tag_name) {
    const newData = {
      tag_name: tag_name
    };

  const newTag = await Tag.create(newData);

  res.json(newTag);
  }
  else {
    res.send(`Incorrect fields in post request`)
  };

});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  const id = req.params.id;
  const { tag_name } = req.body;

  const update = await Tag.update({ tag_name: tag_name }, {
    where: {
      id: id
    }
  });

  res.json(await Tag.findByPk(id));

});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  const id = req.params.id;

  const destroy = await Tag.destroy({
    where: {
      id: id
    }
  });

  res.sendStatus(200);
});

module.exports = router;
