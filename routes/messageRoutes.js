const express = require('express');
const messageController = require('../controllers/messageController');
const authController = require('../controllers/authController');
const messageRouter = express.Router();

messageRouter.route('/').post(authController.protect,messageController.sendMessage);


module.exports = messageRouter;