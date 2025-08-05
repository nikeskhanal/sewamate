import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, Image as ImageIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";

const ChatComponent = ({ isSender = true }) => {
  const navigate = useNavigate();
  const { receiverId } = useParams();
  const [input, setInput] = useState("");
  const [photo, setPhoto] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [receiverInfo, setReceiverInfo] = useState(null);
  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);

  let userId = localStorage.getItem("userId");
  if (!userId) {
    const userObj = localStorage.getItem("user");
    if (userObj) {
      try {
        userId = JSON.parse(userObj)._id;
      } catch (e) {
        userId = null;
      }
    }
  }

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const socket = io("http://localhost:5000", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.emit("joinRoom", { userId });

    socket.on("newMessage", (message) => {
      if (
        (message.senderId === userId && message.receiverId === receiverId) ||
        (message.senderId === receiverId && message.receiverId === userId)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on("connect_error", (err) => {
      console.log("Socket connection error:", err);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, receiverId, navigate]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
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

    if (userId && receiverId) {
      fetchMessages();
    }
  }, [userId, receiverId]);

  useEffect(() => {
    const fetchReceiverInfo = async () => {
      if (!receiverId) return;
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/users/${receiverId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReceiverInfo(res.data);
      } catch (err) {
        setReceiverInfo(null);
      }
    };
    fetchReceiverInfo();
  }, [receiverId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e) => setInput(e.target.value);

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const sendMessage = async () => {
    if ((!input && !photo) || !isSender) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("senderId", userId);
    formData.append("receiverId", receiverId);
    formData.append("text", input);
    if (photo) {
      formData.append("image", photo);
    }

    // Add this for debugging
    console.log("Sending message with:", {
      senderId: userId,
      receiverId,
      text: input,
      photo,
    });

    try {
      await axios.post("http://localhost:5000/api/chat", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setInput("");
      setPhoto(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      {/* Debug Info removed as requested */}

      {/* Chat header with receiver photo and name */}
      {receiverInfo && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-lg shadow">
          <img
            src={`http://localhost:5000/uploads/${receiverInfo.photo}`}
            alt={receiverInfo.name}
            className="w-12 h-12 rounded-full object-cover border"
          />
          <div>
            <div className="font-semibold text-lg">{receiverInfo.name}</div>
            <div className="text-xs text-gray-500">{receiverInfo.email}</div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto mb-4 p-4 bg-white rounded-lg shadow-inner">
        {fetching ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex mb-4 ${
                message.senderId === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md p-3 rounded-lg shadow ${
                  message.senderId === userId
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                {message.text && <p className="break-words">{message.text}</p>}
                {message.image && (
                  <img
                    src={`http://localhost:5000${message.image}`}
                    alt="Message content"
                    className="mt-2 max-w-full h-auto rounded-lg"
                  />
                )}
                <div
                  className={`text-xs mt-1 ${
                    message.senderId === userId
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}
                >
                  {new Date(message.timestamp).toLocaleTimeString([], {
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

      {isSender && (
        <div className="flex items-center space-x-2 p-2 bg-white rounded-lg shadow">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoChange}
            className="hidden"
            accept="image/*"
          />
          <button
            onClick={triggerFileInput}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            <ImageIcon size={20} />
          </button>

          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={1}
            />
            {photo && (
              <div className="absolute top-1 right-2 flex items-center">
                <span className="text-xs text-gray-500 mr-1">
                  {photo.name.substring(0, 10) +
                    (photo.name.length > 10 ? "..." : "")}
                </span>
                <button
                  onClick={() => {
                    setPhoto(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <button
            onClick={sendMessage}
            disabled={loading || (!input && !photo)}
            className={`p-3 rounded-full flex items-center justify-center ${
              loading || (!input && !photo)
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
