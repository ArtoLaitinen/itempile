const items = require('../models/items.js');

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
    const userId = parseInt(req.params.userId, 10);

    const response = await items.findItemsByUserId(userId);

    if (response.length === 0) {
      return res.status(404).json({ message: 'Items not found' });
    }

    return res.json(response);
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = {
  getItems,
  getItemById,
  getItemsByUserId,
};
