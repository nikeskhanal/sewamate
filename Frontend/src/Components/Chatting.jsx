import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, Image as ImageIcon, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";

const Chatting = () => {
  const navigate = useNavigate();
  const { receiverId } = useParams();
  const [input, setInput] = useState("");
  const [photo, setPhoto] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const messageEndRef = useRef(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) navigate("/login");
  }, [userId, navigate]);

  const socket = useRef(io("http://localhost:5000"));

  useEffect(() => {
    if (userId) {
      socket.current.emit("joinRoom", { userId });
      return () => socket.current.disconnect();
    }
  }, [userId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!userId || !receiverId) return;
        const res = await axios.get(
          `http://localhost:5000/api/chat/${userId}/${receiverId}`
        );
        setMessages(res.data || []);
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchMessages();
  }, [userId, receiverId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.current.on("newMessage", (data) => {
      if (
        (data.senderId === userId && data.receiverId === receiverId) ||
        (data.senderId === receiverId && data.receiverId === userId)
      ) {
        setMessages((prev) => [...prev, data]);
      }
    });
    return () => socket.current.off("newMessage");
  }, [userId, receiverId]);

  const handleInputChange = (e) => setInput(e.target.value);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5000000) {
      alert("File size should not exceed 5MB");
      return;
    }
    setPhoto(file);
  };

  const sendMessage = async () => {
    if (!input && !photo) return;
    setLoading(true);
    const messageData = new FormData();
    messageData.append("senderId", userId);
    messageData.append("receiverId", receiverId);
    messageData.append("text", input);
    if (photo) messageData.append("image", photo);
    try {
      await axios.post("http://localhost:5000/api/chat", messageData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setInput("");
      setPhoto(null);
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      {/* Chat Header */}
      <div className="py-4 px-6 bg-gray-800/50 backdrop-blur-md border-b border-gray-700 flex items-center">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
          {receiverId?.charAt(0).toUpperCase()}
        </div>
        <div className="ml-3">
          <h3 className="font-medium">Chat with User {receiverId}</h3>
          <p className="text-xs text-gray-400">Online</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-800/30 to-gray-900/50">
        {fetching ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="bg-gray-800/50 p-6 rounded-full mb-4">
              <Send className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-medium">No messages yet</h3>
            <p>Start a conversation by sending your first message</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.senderId === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md p-4 rounded-2xl shadow-lg transition-all duration-200 ${
                  message.senderId === userId
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none"
                    : "bg-gray-700 text-gray-100 rounded-bl-none"
                }`}
              >
                {message.text && (
                  <p className="whitespace-pre-wrap">{message.text}</p>
                )}
                {message.image && (
                  <div className="mt-3 overflow-hidden rounded-lg border border-gray-600/50 shadow-md">
                    <img
                      src={`http://localhost:5000${message.image}`}
                      alt="Message content"
                      className="w-full max-h-64 object-cover"
                    />
                  </div>
                )}
                <div className="text-xs mt-2 opacity-70 text-right">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Image Preview */}
      {photo && (
        <div className="px-4 py-2 bg-gray-800/50 backdrop-blur-md border-t border-gray-700 relative">
          <div className="flex items-center">
            <div className="relative">
              <img
                src={URL.createObjectURL(photo)}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-lg"
              />
              <button
                onClick={() => setPhoto(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <span className="ml-3 text-sm text-gray-300">{photo.name}</span>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-gray-800/50 backdrop-blur-md border-t border-gray-700">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="w-full p-3 pr-12 bg-gray-700/80 backdrop-blur-sm rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none min-h-[50px] max-h-32"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <div className="absolute right-3 bottom-3 flex gap-2">
              <input
                type="file"
                onChange={handlePhotoChange}
                className="hidden"
                id="photo-upload"
                accept="image/*"
              />
              <label
                htmlFor="photo-upload"
                className="p-2 rounded-full bg-gray-600 hover:bg-gray-500 transition-colors cursor-pointer"
              >
                <ImageIcon size={18} />
              </label>
            </div>
          </div>

          <button
            onClick={sendMessage}
            disabled={loading || (!input && !photo)}
            className={`p-3 rounded-full flex items-center justify-center shadow-lg transition-all ${
              loading || (!input && !photo)
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-95"
            }`}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatting;
