import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: String,
  image: String,
  timestamp: { type: Date, default: Date.now },
});
const chatSchema = new mongoose.Schema({
  participants: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    validate: [arrayLimit, '{PATH} exceeds the limit of 2']
  },
  messages: [messageSchema],
});


function arrayLimit(val) {
  return val.length <= 2;
}

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
