const User = require('../models/userModel.js');
const createToken = require('../utils/createToken.js');
const AppError = require('../utils/appError.js');
const catchAsync = require('../utils/catchAsync.js');

exports.registerUser = catchAsync(async(req,res,next) => {
    const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            return next(new AppError('User already exists', 400));
        }
    const user = await User.create(
        {
            username: req.body.username,
            email: req.body.email,
            photo: req.body.photo,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
            role: req.body.role,
        }
    )
    createToken(user,200,res);
})

exports.loginUser = catchAsync(async(req,res,next) => {
    if(!req.body.email || !req.body.password)
    {
        return next(new AppError('please provide email and password for login',404));
    }
    const user = await User.findOne({email: req.body.email});
    const isExist = await user.correctPassword(req.body.password);
    if(!isExist) return next(new AppError('user does not exist',403));
    createToken(user,200,res);
})

exports.protect = async(req,res,next) => {
    console.log(req.headers.authorization);
}
