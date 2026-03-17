const jwt = require('jsonwebtoken');

const sendCookie = (user,statusCode,res) => {
    const token = jwt.sign({id: user._id},process.env.SECRETKEY,{expiresIn: process.env.TOKENEXPIRES});
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000,  
        ),
        httpOnly: true
    }
    if(process.env.NODE_ENV == 'production')
    {
        cookieOptions.secure = true;
    }
    res.cookie('jwt',token,cookieOptions)
    user.password = undefined;
    res.status(statusCode).json(
        {
            status: 'success',
            token,
            data: {
                user
            }
        }
    )
}

module.exports = sendCookie;