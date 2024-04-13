const items = require('../models/items.js');

const getItems = async (req, res) => {
  try {
    const response = await items.findItems();
    if (response) {
      res.json(response);
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

module.exports = {
  getItems,
};
