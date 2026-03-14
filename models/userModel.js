const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
        },
        passwordChangeAt: Date
    },
    {
        timestamps: true
    }
)

userSchema.pre('save', async function(){
    if(!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password,Number(process.env.SALTROUND));
    this.confirmPassword = undefined;
});

userSchema.pre('save', function(){
    if (!this.isModified('password') || this.isNew) {
        return;
    }
    this.passwordChangeAt = Date.now() - 1000;
});

userSchema.methods.checkPassowrd = function(userpassword,reqestedPassword){
    return bcrypt.compare(reqestedPassword,userpassword);
}
const User = mongoose.model('User',userSchema);





module.exports = User;

