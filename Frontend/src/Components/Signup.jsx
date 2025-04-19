import React, { useState } from "react";
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff } from "lucide-react";
import axios from "axios"; // Import axios

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    address: "",
    role: "customer"
  });

  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // Success message state
  const [errorMessage, setErrorMessage] = useState(""); // Error message state

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coordinates = [
          position.coords.longitude,
          position.coords.latitude
        ];

        const formData = {
          ...form,
          location: {
            type: "Point",
            coordinates: coordinates
          }
        };

        try {
          const response = await axios.post("http://localhost:5000/api/users/create", formData);
          console.log("User created:", response.data);
          setSuccessMessage("Account created successfully! You can now log in."); // Set success message
          setErrorMessage(""); // Clear any previous error messages
        } catch (error) {
          console.error("Error creating user:", error);
          setErrorMessage("Error creating user. Please try again."); // Set error message
          setSuccessMessage(""); // Clear any previous success messages
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to fetch your location. Please allow location access.");
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 px-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-lg p-8">
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
          Create Your Account
        </h2>

        {/* Success/Error Message */}
        {successMessage && (
          <div className="bg-green-100 text-green-800 p-3 rounded-lg text-center mb-4">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-100 text-red-800 p-3 rounded-lg text-center mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="relative">
            <User className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="pl-10 pr-4 py-2 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="pl-10 pr-4 py-2 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="pl-10 pr-10 py-2 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <div
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          {/* Contact */}
          <div className="relative">
            <Phone className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="contact"
              placeholder="Phone Number"
              value={form.contact}
              onChange={handleChange}
              required
              className="pl-10 pr-4 py-2 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Address */}
          <div className="relative">
            <MapPin className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              required
              className="pl-10 pr-4 py-2 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-xl font-semibold transition-all"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-pink-600 hover:underline font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
