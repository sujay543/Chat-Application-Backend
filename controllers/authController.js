const User = require('../models/userModel.js');
const createToken = require('../utils/createToken.js');
const AppError = require('../utils/appError.js');

exports.registerUser = async(req,res,next) => {
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
}

// exports.loginUser = async(req,res) => {
//     const user = await User.find({email: req.email});
//     const isExist = user.checkPassword(user.password,req.password);

//     if(!isExist) return 
//     const token = getToken(user.id);
    
//     res.status(201).json(
//         {
//             status:'success',
//             message: 'user has been created',
//             token
//         }
//     )
// }


