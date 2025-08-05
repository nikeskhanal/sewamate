import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader, Check } from "lucide-react";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    setEmailValid(emailRegex.test(form.email));
  }, [form.email]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim()) {
      setErrorMessage("Email is required.");
      return;
    }
    if (!emailValid) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!form.password) {
      setErrorMessage("Password is required.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || "Login failed");
        setIsLoading(false);
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user._id);
      if (data.user.role === "worker") {
        navigate("/worker-dashboard");
      } else if (data.user.role === "customer") {
        navigate("/customer-dashboard");
      } else if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        setErrorMessage("Unknown user role");
      }
    } catch (err) {
      setErrorMessage("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <div className="bg-white p-6 md:p-8 rounded-xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h1>
              <p className="text-gray-600">
                Welcome back! Please login to your account.
              </p>
            </div>
            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100 flex items-start animate-fadeIn">
                <div className="bg-red-100 p-2 rounded-full mr-3 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-red-700">{errorMessage}</div>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-3 bg-gray-50 border ${
                    form.email
                      ? emailValid
                        ? "border-green-300"
                        : "border-red-300"
                      : "border-gray-200"
                  } rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all`}
                />
                {form.email && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {emailValid ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all"
                />
                <div className="absolute inset-y-0 right-0 flex">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="px-3 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <a
                  href="/forgot-password"
                  className="text-sm text-indigo-500 hover:text-indigo-700 transition-colors hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader className="animate-spin mr-2" size={20} />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>
            <div className="mt-6 text-center pt-4 border-t border-gray-100">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Create Account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;