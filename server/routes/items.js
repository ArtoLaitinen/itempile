const express = require('express');
const { getItems } = require('../controllers/items.js');

const router = express.Router();

router.get('/', getItems);

module.exports = router;
