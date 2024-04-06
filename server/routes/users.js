const express = require('express');

const router = express.Router();
const { signUpUser } = require('../controllers/users.js');

router.post('/signup', signUpUser);

module.exports = router;
