const express = require('express');
const {
  getItems, getItemById, getItemsByUserId, createItem,
} = require('../controllers/items.js');

const router = express.Router();

router.get('/', getItems);
router.get('/:id', getItemById);

// this should also require token
router.get('/user/:userId', getItemsByUserId);

router.post('/', createItem);

module.exports = router;
