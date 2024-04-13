const express = require('express');
const {
  getItems, getItemById, getItemsByUserId, createItem, updateItem, deleteItem,
} = require('../controllers/items.js');
const verifyToken = require('../middleware/verifyToken.js');

const router = express.Router();

router.get('/', getItems);
router.get('/:id', getItemById);

router.use(verifyToken);

router.get('/user/:userId', getItemsByUserId);
router.post('/', createItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

module.exports = router;
