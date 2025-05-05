import mongoose from 'mongoose';
import Chat from '../model/messageModel.js';

// Send a message (text or image)
export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;
    const image = req.file ? req.file.filename : null;

    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    const newMessage = {
      senderId,
      text,
      image,
    };

    if (!chat) {
      chat = new Chat({
        participants: [senderId, receiverId],
        messages: [newMessage],
      });
    } else {
      chat.messages.push(newMessage);
    }

    const savedChat = await chat.save();
    res.status(201).json(savedChat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Get all messages between two users
export const getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;

    const chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!chat) {
      return res.json([]);
    }

    res.json(chat.messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};
