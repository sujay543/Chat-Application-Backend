const express = require('express');
const userController = require('../controllers/userController');
const userRoter = express.Router();

userRoter.route('/').post(userController.createUser);

module.exports = userRoter;
