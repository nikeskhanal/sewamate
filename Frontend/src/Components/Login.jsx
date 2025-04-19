import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react"; // Importing the necessary icons

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // Store token in localStorage
      localStorage.setItem("token", data.token);

      // Redirect based on role
      if (data.user.role === "worker") {
        navigate("/worker-dashboard");
      } else if (data.user.role === "customer") {
        navigate("/customer-dashboard");
      } else {
        alert("Unknown user role");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong. Try again.");
    }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 px-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Welcome Back 👋
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <div
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl font-semibold transition-all"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-indigo-600 hover:underline font-medium"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
