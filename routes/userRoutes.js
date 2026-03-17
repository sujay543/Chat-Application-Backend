const express = require('express');
const userController = require('../controllers/authController');
const userRouter = express.Router();

userRouter.route('/').post(userController.registerUser);
userRouter.route('/login').post(userController.loginUser);

module.exports = userRouter;
