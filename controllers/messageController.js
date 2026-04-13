const User = require('../models/userModel');
const Message = require('../models/messageModel.js')
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/appError.js');
const Chat = require('../models/conversationModel.js');


exports.sendMessage = catchAsync(async(req,res,next) => {
    const {chatId, content} = req.body;

    if(!chatId || !content)
    {
        return next(new AppError('you need chatId and content for sending message',404));
    }
    const chat = await Chat.findById(chatId);
    if(!chat)
    {
        return next(new AppError('no conversation exist',400));
    }

    if (!chat.users.includes(req.user._id)) {
            return next(new AppError("You are not part of this chat", 403));
   }

    const message = await Message.create({
        sender: req.user._id,
        chatId: chatId,
        content: content
    })

    await Chat.findByIdAndUpdate(chatId,{latestMessage: message._id});
    const io = req.app.get("io");
    io.emit("receiveMessage", message);
    res.status(201).json(
    {
        status: 'success',
        data: {
            message
        }
    }
    )
})

exports.getlatestMessage = catchAsync(async (req,res,next) => {
    const chatId = req.params.id;
     if(!chatId){ return next(new AppError('chatId not found',404)); }
    const chat = await Chat.findById(chatId).populate('latestMessage'); 
    if (!chat) {
    return next(new AppError('Chat not found', 404));
    }
    if(!chat.users.includes(req.user.id))
    {
        return next(new AppError('Invalid user',403));
    }
    res.status(200).json(
        {
            status: 'success',
            message: chat.latestMessage.content
        }
    )
})

exports.getAllMessage = catchAsync( async (req,res,next) => {
    const chatId = req.params.id;
    if(!chatId){return next(new AppError('chat Id not found',404)); }
    const chat = await Chat.findById(chatId);
    if(!chat){ return next(new AppError('chat not found',404)); }
     if(!chat.users.includes(req.user.id))
    {
        return next(new AppError('Invalid user',403));
    }
    const messages = await Message.find({chatId: req.params.id}).populate('sender','username email').sort(
{createdAt: 1});
    res.status(200).json(
        {
            status: 'success',
            messages
        }
    )
})

