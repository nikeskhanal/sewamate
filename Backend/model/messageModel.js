
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'SewaMateUser', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'SewaMateUser', required: true },
  
  text: { type: String },
  image: { type: String }, 
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
