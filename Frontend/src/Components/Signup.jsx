
import React, { useState } from "react";
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import login from "../assets/bgg.jpg";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    address: "",
    role: "customer",
    servicesOffered: [],
  });

  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const availableServices = [
    "Plumbing",
    "Electrical",
    "Cleaning",
    "Painting",
    "Carpentry",
    "Gardening",
    "Baby Sitter",
    "cook",
    "pet sitter",
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.role === "worker" && form.servicesOffered.length === 0) {
      setErrorMessage("Please select at least one service you offer.");
      return;
    }

    if (!/^\d{10}$/.test(form.contact)) {
      setErrorMessage("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setSuccessMessage("Fetching your location, please wait...");
    setErrorMessage("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coordinates = [
          position.coords.longitude,
          position.coords.latitude,
        ];

        const formData = {
          ...form,
          location: {
            type: "Point",
            coordinates: coordinates,
          },
          status: form.role === "worker" ? "pending" : "approved",
        };

        try {
          const response = await axios.post(
            "http://localhost:5000/api/users/create",
            formData
          );
          setSuccessMessage("Account created successfully! You can now log in.");
          setErrorMessage("");
        } catch (error) {
          if (error.response && error.response.status === 409) {
            setErrorMessage("Email or contact already in use.");
          } else {
            setErrorMessage("Error creating user. Please try again.");
          }
          setSuccessMessage("");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        alert("Unable to fetch your location. Please allow location access.");
        setLoading(false);
        setSuccessMessage("");
      }
    );
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 z-0"
        style={{
          backgroundImage: `url(${login})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      <div className="relative z-10 bg-white/80 backdrop-blur-lg shadow-[0_10px_40px_rgba(0,0,0,0.3)] border border-white/30 rounded-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Create Your Account
        </h2>

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
          <div className="relative">
            <User className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="name"
              className="pl-10 pr-4 py-2 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Mail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              className="pl-10 pr-4 py-2 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Lock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
              className="pl-10 pr-10 py-2 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          <div className="relative">
            <Phone className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="contact"
              placeholder="Phone Number"
              value={form.contact}
              onChange={handleChange}
              required
              autoComplete="tel"
              className="pl-10 pr-4 py-2 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <MapPin className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              required
              autoComplete="street-address"
              className="pl-10 pr-4 py-2 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="pl-4 pr-4 py-2 w-full border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="customer">Customer</option>
              <option value="worker">Worker</option>
            </select>
          </div>

          {form.role === "worker" && (
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Services Offered:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableServices.map((service) => (
                  <label key={service} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={service}
                      checked={form.servicesOffered.includes(service)}
                      onChange={(e) => {
                        const value = e.target.value;
                        setForm((prevForm) => ({
                          ...prevForm,
                          servicesOffered: prevForm.servicesOffered.includes(value)
                            ? prevForm.servicesOffered.filter((s) => s !== value)
                            : [...prevForm.servicesOffered, value],
                        }));
                      }}
                      className="text-blue-600"
                    />
                    <span>{service}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white py-2 rounded-xl font-semibold transition-all`}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
