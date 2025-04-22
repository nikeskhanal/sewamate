import React, { useEffect, useState } from "react";
import axios from "axios";

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPhoto, setNewPhoto] = useState(null); // State to hold the new photo

  // Fetch user profile
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

  // Handle file input change for photo
  const handleFileChange = (e) => {
    setNewPhoto(e.target.files[0]); // Store the new photo
  };

  // Handle form submission to update photo
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
            "Content-Type": "multipart/form-data", // Shouldn't be manually set in axios if using FormData
          },
        }
      );
      
      setProfile((prevProfile) => ({
        ...prevProfile, // Keep the previous profile data
        photo: data.photo, // Only update the photo field
      }));
    } catch (error) {
      console.error("Failed to update photo", error);
    }
  };

  if (loading) return <div className="text-center mt-10 text-xl">Loading...</div>;
  if (!profile) return <div className="text-center mt-10 text-red-500">Failed to load profile</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-2xl rounded-2xl mt-10">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          {profile.photo ? (
            <img
              src={`http://localhost:5000/uploads/${profile.photo}`}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-md object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm">
              No Photo
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{profile.name || "Unnamed"}</h2>
        <p className="text-gray-500">{profile.role || "Role not set"}</p>
      </div>

      <div className="mt-6 space-y-3 text-gray-700">
        <div><strong>Email:</strong> {profile.email || "Not provided"}</div>
        <div><strong>Contact:</strong> {profile.contact || "Not provided"}</div>
        <div><strong>Address:</strong> {profile.address || "Not provided"}</div>
        <div><strong>Services:</strong> {profile.servicesOffered?.join(", ") || "None"}</div>
        <div><strong>Location:</strong> {profile.location?.coordinates?.join(", ") || "Unknown"}</div>
        <div><strong>Joined:</strong> {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}</div>
      </div>

      <form onSubmit={handleUpdatePhoto} className="mt-6 space-y-4">
        <div>
          <label htmlFor="photo" className="block text-gray-700">Update Profile Photo</label>
          <input
            type="file"
            id="photo"
            name="photo"
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Update Photo
        </button>
      </form>
    </div>
  );
};

export default MyProfile;
