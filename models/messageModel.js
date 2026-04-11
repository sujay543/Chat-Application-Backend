const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
    {
         sender: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
         },
         chatId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Chat',
            required: true,
         },
         content: {
            type: String,
         },
         messageType: {
            type: String,
            enum: ["music","text","video","file"],
            default: "text"
         },
         fileUrl: {
            type: String,
         },
         status: {
            type: String,
            enum: ['sent','delivered','seen'],
            default: 'sent'
         }
    },
    {
        timestamps: true
    }
)

messageSchema.pre(/^find/, function(){
   this.select('-__v');
})


const Message = mongoose.model('Message',messageSchema);

module.exports = Message;