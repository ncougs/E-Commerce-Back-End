const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const data = await Tag.findAll({ include: Product });
    res.status(200).json(data);
  } 
  catch (err) {
    res.status(500).json(err);
  }

});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const id = req.params.id;
    const data = await Tag.findByPk(id, { include: Product });
    res.status(200).json(data);
  } 
  catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const { tag_name } = req.body;

    if(tag_name) {
      const newData = {
        tag_name: tag_name
      };
  
    const newTag = await Tag.create(newData);
  
    res.status(200).json(newTag);
    }
    else {
      res.status(400).send(`Incorrect field in post body`)
    };
  } 
  catch (err) {
    res.status(500).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const id = req.params.id;
    const { tag_name } = req.body;
  
    if (tag_name) {
      const update = await Tag.update({ tag_name: tag_name }, {
        where: {
          id: id
        }
      });
    
      res.status(200).json(await Tag.findByPk(id));
    }
    else {
      res.status(400).send(`Incorrect field in post body`)
    }
  } 
  catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const id = req.params.id;

    const destroy = await Tag.destroy({
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
