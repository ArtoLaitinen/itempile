const Joi = require('joi');
const items = require('../models/items.js');

const itemSchema = Joi.object({
  title: Joi.string().required().min(1),
  description: Joi.string().required().min(5),
  image: Joi.string().required().min(1),
  category: Joi.string().required().min(3),
  price: Joi.string().required().min(1),
  owner_id: Joi.string().uuid(),
});

const putItemSchema = Joi.object({
  title: Joi.string().min(1),
  description: Joi.string().min(5),
  image: Joi.string().min(1),
  category: Joi.string().min(3),
  price: Joi.string().min(1),
});

const getItems = async (req, res) => {
  try {
    const response = await items.findItems();
    if (response) {
      return res.json(response);
    }

    return res.status(500).json({ message: 'Something went wrong' });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

const getItemById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const response = await items.findItemById(id);

    if (response.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.json(response[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

const getItemsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const response = await items.findItemsByUserId(userId);

    if (response.length === 0) {
      return res.status(404).json({ message: 'Items not found' });
    }

    return res.json(response);
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

const createItem = async (req, res) => {
  try {
    const { error: validateError } = itemSchema.validate(req.body);

    if (validateError) {
      return res.status(400).json({ message: validateError.details[0].message });
    }

    const item = {
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      category: req.body.category,
      price: req.body.price,
      owner_id: req.body.owner_id,
    };

    const response = await items.createNewItem(item);

    if (response.affectedRows === 1) {
      const id = response.insertId;
      const addedItem = await items.findItemById(id);
      return res.json(addedItem[0]);
    }

    return res.status(500).json({ message: 'Couldnt add the item' });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

const updateItem = async (req, res) => {
  try {
    const { error: validateError } = putItemSchema.validate(req.body);

    if (validateError) {
      return res.status(400).json({ message: validateError.details[0].message });
    }

    const id = parseInt(req.params.id, 10);

    const updatedValues = {
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
      category: req.body.category,
      price: req.body.price,
    };

    // Removing all keys that are null so everything that wasnt specified in the given put request
    Object.keys(updatedValues)
      .forEach((key) => updatedValues[key] == null && delete updatedValues[key]);

    const response = await items.updateItem(id, updatedValues);

    if (response.affectedRows === 1) {
      const updatedMenuitem = await items.findItemById(id);
      return res.json(updatedMenuitem[0]);
    }
    return res.status(404).json({ message: 'Item not found' });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

const deleteItem = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const response = await items.deleteItem(id);

    if (response.affectedRows === 1) {
      return res.json({ message: 'Item deleted successfully' });
    }
    return res.status(404).json({ message: 'Item not found' });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = {
  getItems,
  getItemById,
  getItemsByUserId,
  createItem,
  updateItem,
  deleteItem,
};
