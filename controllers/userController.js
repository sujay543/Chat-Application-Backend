const User = require('../models/userModel.js');

exports.createUser = async(req,res) => {
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
    res.status(201).json(
        {
            status:'success',
            data: {
                user
            }
        }
    )

}