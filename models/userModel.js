const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true,'username is required']
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'email is reqired'],
            lowercase: true,
            validate: [validator.isEmail,'please provide a valid email']
        },
        photo: {
            type: String,
        },
        password: {
            type: String,
            required: [true,'password is required'],
            minlength: 8
        },
        confirmPassword: {
            type: String,
            required: [true, 'confirmpassword is required'],
            validate: {
                validator: function(el)
                {
                   return el === this.password;
                },
                message: 'passoword should be same'
            }
        },
        role: {
            type: String,
            enum: ['user','admin'],
            default: 'user'
        }
    },
    {
        timestamps: true
    }
)

const User = mongoose.model('User',userSchema);

module.exports = User;

