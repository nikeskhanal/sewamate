import Message from '../model/messageModel.js';

export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId,  text } = req.body;
    const image = req.file ? req.file.path : null;

    const message = new Message({ senderId, receiverId, text, image });
    await message.save();

    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getMessages = async (req, res) => {
    const { receiverId } = req.params;
    try {
        const messages = await Message.find({ receiverId })
          .populate('senderId', 'name email') 
          .sort({ timestamp: 1 }); 
    
        if (messages.length === 0) {
          return res.status(404).json({ message: 'No messages found for this receiver.' });
        }
    
        res.status(200).json(messages);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    };
    
