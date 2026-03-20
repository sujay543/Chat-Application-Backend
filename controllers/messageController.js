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

    res.status(201).json(
    {
        status: 'success',
        data: {
            message
        }
    }
    )
})