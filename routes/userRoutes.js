const express = require('express');
const userController = require('../controllers/authController');
const userRoter = express.Router();

userRoter.route('/').post(userController.registerUser);

module.exports = userRoter;
