const express = require('express');
const { getItems, getItemById } = require('../controllers/items.js');

const router = express.Router();

router.get('/', getItems);
router.get('/:id', getItemById);

module.exports = router;
