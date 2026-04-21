const User = require('../models/userModel.js');
const createToken = require('../utils/createToken.js');
const AppError = require('../utils/appError.js');
const jwt = require('jsonwebtoken');
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
    if(!user)
    {
        return next(new AppError('User not found', 404));
    }
    const isExist = await user.correctPassword(req.body.password);
    if(!isExist) return next(new AppError('Invalid password',403));
    createToken(user,200,res);
})

exports.protect = catchAsync(async(req,res,next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    {
         token = req.headers.authorization.split(' ')[1];
    }
    if(!token)
    {
        return next(new AppError('user must need to logIn',403));
    }
    const decoded = jwt.verify(token,process.env.SECRETKEY);
    const user = await User.findById(decoded.id);
    if(!user)
    {
        return next(new AppError('no user found',404));
    }
    if(await user.changePasswordAfter(decoded.iat))
    {
        return next(new AppError('You must login now',401));
    }
    req.user = user;
    next()
})

exports.restrictTo = (...roles) =>
{
    return (req,res,next) => {
        if(!roles.includes(req.user.role))
        {
            return next(new AppError('you are not allowed to perform this action',401));
        }
        next();
    }
}
