const Chat = require('../models/conversationModel.js');
const catchAsync = require('../utils/catchAsync.js');
const AppError = require('../utils/appError.js');

exports.createChat = catchAsync(async(req,res,next) => {
   const {userId} = req.body;
   if(!req.user){return next(new AppError('user must need to be login',400))}
   if(!userId){ return next(new AppError('Invalid request',400)); }
   if(userId === req.user._id.toString()){return next(new AppError('you can not create conversation with yourself',400))}
    let chat = await Chat.findOne( {isGroupChat: false, users: { $all: [userId,req.user._id]}}).populate('users','-password').populate('latestMessage');
    if(chat)
    {
        return res.status(200).json(
            {
                status: 'success',
                data: {
                    chat
                }
            }
        )
    }

    chat = await Chat.create(
        {
            users: [req.user._id,userId],
            isGroupChat: false
        }
    )
     chat = await Chat.findById(chat._id).populate('users', '-password').populate('latestMessage');
    res.status(201).json(
        {
            status: 'success',
            data: {
                chat
            }
        }
    )
})
exports.getChats = catchAsync(async(req,res,next) => {
    const chats = await Chat.find({
    users: req.user._id
    }).populate('users','-password').populate('latestMessage').sort({updatedAt: -1});
    res.status(200).json({
    status: "success",
    results: chats.length,
    data: {
      chats: chats,
    },
  });
})