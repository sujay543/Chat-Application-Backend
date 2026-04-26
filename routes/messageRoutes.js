const express = require('express');
const messageController = require('../controllers/messageController');
const authController = require('../controllers/authController');
const messageRouter = express.Router();

messageRouter.route('/').post(authController.protect,messageController.sendMessage);
messageRouter.route('/latest/:id').get(authController.protect,messageController.getlatestMessage);
messageRouter.route('/all/:id').get(authController.protect,messageController.getAllMessage);


module.exports = messageRouter;