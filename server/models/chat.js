const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến mô hình User (người dùng)
    required: true,
  },
  
  messages: [
    {
      text: String,
      sender: {
        type: String,
        enum: ['user', 'admin'],
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
