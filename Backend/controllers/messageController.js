import mongoose from "mongoose";
import Chat from "../model/messageModel.js";
import User from "../model/userModel.js";

export const sendMessage = async (req, res) => {
  try {
    console.log("Received sendMessage:", req.body);
    console.log("Received file:", req.file);

    if (
      !mongoose.Types.ObjectId.isValid(req.body.senderId) ||
      !mongoose.Types.ObjectId.isValid(req.body.receiverId)
    ) {
      return res.status(400).json({ error: "Invalid sender or receiver ID" });
    }

    const senderId = new mongoose.Types.ObjectId(req.body.senderId);
    const receiverId = new mongoose.Types.ObjectId(req.body.receiverId);
    const text = req.body.text || "";
    const image = req.file ? req.file.filename : null;

    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId], $size: 2 },
    });

    const newMessage = {
      senderId,
      receiverId,
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
    const lastMessage = savedChat.messages[savedChat.messages.length - 1];

    req.io
      .to(String(senderId))
      .to(String(receiverId))
      .emit("newMessage", {
        ...lastMessage.toObject(),
        image: lastMessage.image ? `/uploads/${lastMessage.image}` : null,
      });

    res.status(201).json(savedChat);
  } catch (err) {
    console.error("SendMessage error:", err);
    res
      .status(500)
      .json({ error: "Failed to send message", details: err.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { userId, receiverId } = req.params;

    const chat = await Chat.findOne({
      participants: { $all: [userId, receiverId], $size: 2 },
    }).sort({ "messages.timestamp": 1 });

    if (!chat) {
      return res.json([]);
    }

    const messages = chat.messages.map((msg) => ({
      ...msg.toObject(),
      image: msg.image ? `/uploads/${msg.image}` : null,
    }));

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const getChatParticipants = async (req, res) => {
  try {
    const { userId } = req.params;
    // Find all chats where this user is a participant
    const chats = await Chat.find({ participants: userId });
    // Collect all other participant IDs
    const participantIds = new Set();
    chats.forEach((chat) => {
      chat.participants.forEach((pid) => {
        if (pid.toString() !== userId) participantIds.add(pid.toString());
      });
    });
    // Fetch user details for these participants
    const users = await User.find(
      { _id: { $in: Array.from(participantIds) } },
      "name photo email"
    );
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chat participants" });
  }
};
