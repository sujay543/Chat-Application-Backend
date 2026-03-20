const express = require('express');
const chatRouter = express.Router();
const chatController = require('../controllers/conversationController');
const authController = require('../controllers/authController');
chatRouter.route('/').post(authController.protect,chatController.createChat);

module.exports = chatRouter;