import React, { useEffect, useState } from "react";
import axios from "axios";
import { Camera, Loader, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPhoto, setNewPhoto] = useState(null);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/users/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProfile(data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    setNewPhoto(e.target.files[0]);
  };

  const handleUpdatePhoto = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (newPhoto) {
      formData.append("photo", newPhoto);
    }

    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/users/me/photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProfile((prevProfile) => ({
        ...prevProfile,
        photo: data.photo,
      }));
    } catch (error) {
      console.error("Failed to update photo", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin w-8 h-8 text-blue-500" />
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center mt-10 text-red-500 text-lg font-medium">
        Failed to load profile
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-6 px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
        >
          ← Back
        </button>

        <div className="p-6 bg-white rounded-2xl shadow-lg space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {profile.photo ? (
                <img
                  src={`http://localhost:5000/uploads/${profile.photo}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 flex items-center justify-center rounded-full bg-gray-300 text-gray-600">
                  <UserCircle size={64} />
                </div>
              )}
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {profile.name || "Unnamed"}
            </h2>
            <p className="text-sm text-gray-500 uppercase tracking-wider">
              {profile.role || "Role not set"}
            </p>
          </div>

          <div className="grid gap-3 text-gray-700 text-sm">
            <div><strong>Email:</strong> {profile.email || "Not provided"}</div>
            <div><strong>Contact:</strong> {profile.contact || "Not provided"}</div>
            <div><strong>Address:</strong> {profile.address || "Not provided"}</div>
            <div><strong>Services:</strong> {profile.servicesOffered?.join(", ") || "None"}</div>
            <div><strong>Location:</strong> {profile.location?.coordinates?.join(", ") || "Unknown"}</div>
            <div><strong>Joined:</strong> {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}</div>
          </div>

          <form onSubmit={handleUpdatePhoto} className="space-y-4">
            <div>
              <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                Upload New Profile Photo
              </label>
              <div className="mt-2 flex items-center gap-3">
                <Camera className="text-gray-400" />
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  onChange={handleFileChange}
                  className="block w-full text-sm file:px-4 file:py-2 file:rounded-md file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200"
            >
              Update Photo
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
