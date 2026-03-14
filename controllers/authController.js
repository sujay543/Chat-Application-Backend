const User = require('../models/userModel.js');
const jwtToken = require('jsonwebtoken');

function getToken(userId){
    const token = jwtToken.sign({id: userId},process.env.SECRETKEY,{expiresIn: process.env.TOKENEXPIRES});
    return token;
}

exports.registerUser = async(req,res) => {
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

    const token = getToken(user.id);
    
    res.status(201).json(
        {
            status:'success',
            message: 'user has been created',
            token
        }
    )
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


