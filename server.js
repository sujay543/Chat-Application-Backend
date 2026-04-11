const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const express = require('express');
const userRouter = require('./routes/userRoutes');
const chatRouter = require('./routes/chatRoute.js');
const messageRouter = require('./routes/messageRoutes.js');
const mongoose = require('mongoose');
const appError = require('./utils/appError.js');
const morgan = require('morgan');
const app = express();
app.use(express.json());
const globalErrorHandler = require('./utils/errorControl.js');
const AppError = require('./utils/appError.js');

// all routes above this



if(process.env.NODE_ENV === 'development')
{
    app.use(morgan('dev'));
}



app.use('/api/v1/users',userRouter);
app.use('/api/v1/chat',chatRouter);
app.use('/api/v1/message',messageRouter);



app.all(/.*/,(req,res,next) => {
  next(new AppError(`cannot find this ${req.originalUrl}`,404));
})

app.use(globalErrorHandler);

mongoose.connect(process.env.PASSWORDSTRING).then(() => {
    console.log('database successfully connected');
}).catch((err)=> {
    console.log(err);
})

const port = process.env.PORT || 3000;
app.listen(port,() => {
    console.log('app is running on port ',port);
})