const mongoose = require('mongoose');
const { encrypt } = require('../utils/encryption.js');

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
         },
         iv: {
         type: String,  // 👈 add this
      }
    },
    {
        timestamps: true
    }
)

messageSchema.pre(/^find/, function(){
   this.select('-__v');
})

messageSchema.pre('save', async function(){
  if (!this.isModified('content') || !this.content) return;

    const encrypted = encrypt(this.content);

    if (!encrypted || !encrypted.content || !encrypted.iv) {
        throw new Error("Encryption failed");
    }

    this.content = encrypted.content;
    this.iv = encrypted.iv;
});


const Message = mongoose.model('Message',messageSchema);

module.exports = Message;