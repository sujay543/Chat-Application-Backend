const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync.js');


exports.getUsers = catchAsync(async (req,res,next) => {
    const users = await User.find();
    if(!users){return next(new AppError('users not found')); }
    res.status(200).json(
        {
            status:  'success',
            length: users.length,
            data: {
                users
            }
        }
    )
})

exports.getMe = (req, res) => {
    res.status(200).json({
        status: "success",
        user: req.user
    });
};