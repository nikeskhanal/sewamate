import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const WorkerDashboard = () => {
  const [user, setUser] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const messageEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        setErrorMessage("Unauthorized. Please log in again.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = response.data;
        if (userData.role === "worker" && userData.status !== "approved") {
          navigate("/pending");
        } else {
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setErrorMessage("Error fetching user data.");
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Fetch chat participants (customers)
  useEffect(() => {
    const fetchParticipants = async () => {
      if (!user) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/chat/participants/${user._id}`
        );
        setParticipants(res.data);
      } catch (err) {
        setParticipants([]);
      }
    };
    fetchParticipants();
  }, [user]);

  const fetchMessages = async (userId, receiverId) => {
    if (!receiverId) {
      console.log("Receiver ID is missing");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/messages/${userId}/${receiverId}`
      );
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Polling to fetch new messages every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (user && selectedReceiver) {
        fetchMessages(user._id, selectedReceiver);
      }
    }, 3000); // Adjust polling interval as needed

    // Clear interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [user, selectedReceiver]);

  useEffect(() => {
    // Scroll to the bottom whenever new messages are added
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (errorMessage) {
    return (
      <div className="text-center text-red-600">
        <p>{errorMessage}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-gray-600">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 p-8">
        <div className="bg-white shadow-2xl rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
            Welcome, {user?.name}
          </h2>
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-semibold">Profile</h3>
              <p>Email: {user.email}</p>
              <p>Contact: {user.contact}</p>
              <p>Address: {user.address}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Services Offered</h3>
              {(() => {
                const services = Array.isArray(user.servicesOffered)
                  ? user.servicesOffered
                  : user.servicesOffered
                  ? [user.servicesOffered]
                  : [];
                return services.length > 0 ? (
                  <ul>
                    {services.map((service, index) => (
                      <li key={index}>{service}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No services offered yet.</p>
                );
              })()}
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Chats</h3>
              {participants.length === 0 ? (
                <p>No messages yet.</p>
              ) : (
                <div className="space-y-4">
                  {participants.map((p) => (
                    <div
                      key={p._id}
                      className="flex items-center gap-4 bg-gray-100 p-3 rounded-lg shadow"
                    >
                      <img
                        src={`http://localhost:5000/uploads/${p.photo}`}
                        alt={p.name}
                        className="w-12 h-12 rounded-full object-cover border"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-xs text-gray-500">{p.email}</div>
                      </div>
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
                        onClick={() => navigate(`/chat/${p._id}`)}
                      >
                        Message
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
