const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const userRouter = express.Router();

userRouter.route('/').post(authController.registerUser);
userRouter.route('/login').post(authController.loginUser);
userRouter.route('/Me').get(authController.protect,userController.getMe);
userRouter.route('/getAllUser').get(authController.protect,authController.restrictTo('admin'),userController.getUsers);
module.exports = userRouter;
