import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  image: String,
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [messageSchema],
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
