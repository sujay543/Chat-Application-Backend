const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const express = require('express');
const http = require('http');
const userRouter = require('./routes/userRoutes');
const chatRouter = require('./routes/chatRoute.js');
const messageRouter = require('./routes/messageRoutes.js');
const mongoose = require('mongoose');
const appError = require('./utils/appError.js');
const morgan = require('morgan');
const {Server} = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.set("io", io);
app.use(express.json());
const globalErrorHandler = require('./utils/errorControl.js');
const AppError = require('./utils/appError.js');
// all routes above this



io.on("connection", (socket) => {
    console.log('a new user has connected',socket.id);
})





if(process.env.NODE_ENV === 'development')
{
    app.use(morgan('dev'));
}



app.use('/api/v1/users',userRouter);
app.use('/api/v1/chat',chatRouter);
app.use('/api/v1/message',messageRouter);
app.use(express.static('public'));


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
server.listen(port,() => {
    console.log('app is running on port ',port);
})