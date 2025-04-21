import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const WorkerDashboard = () => {
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      
      console.log("userId:", userId);
      console.log("token:", token);
      
      if (!userId || !token) {
        setErrorMessage("Unauthorized. Please log in again.");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 p-8">
      <div className="bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Welcome, {user.name}
        </h2>

        {/* Worker Dashboard Content */}
        <div className="space-y-5">
          <div>
            <h3 className="text-xl font-semibold">Profile</h3>
            <p>Email: {user.email}</p>
            <p>Contact: {user.contact}</p>
            <p>Address: {user.address}</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Services Offered</h3>
            {user.servicesOffered && user.servicesOffered.length > 0 ? (
              <ul>
                {user.servicesOffered.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            ) : (
              <p>No services offered yet.</p>
            )}
          </div>

          <div>
            <h3 className="text-xl font-semibold">Job Requests</h3>
            <p>Here you can view and accept job requests.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
