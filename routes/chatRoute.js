const express = require('express');
const chatRouter = express.Router();
const chatController = require('../controllers/conversationController');
const authController = require('../controllers/authController');
chatRouter.route('/').post(authController.protect,chatController.createChat);
chatRouter.route('/getChat').post(authController.protect,chatController.getChats);

// chatRouter.route('/').post(chatController.createChat);
// chatRouter.route('/getChat').post(chatController.getChats);
module.exports = chatRouter;