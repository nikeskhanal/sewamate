import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  Loader,
  Wrench,
  Home,
  Baby,
  ChefHat,
  PawPrint,
  Sparkles,
  Check,
} from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    address: "",
    role: "customer",
    experience: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationFetching, setLocationFetching] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [phoneValid, setPhoneValid] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [selectedService, setSelectedService] = useState("");

  const availableServices = [
    { name: "Plumbing", icon: <Wrench className="w-5 h-5" /> },
    { name: "Electrical", icon: <Sparkles className="w-5 h-5" /> },
    { name: "Cleaning", icon: <Home className="w-5 h-5" /> },
    { name: "Painting", icon: <Sparkles className="w-5 h-5" /> },
    { name: "Carpentry", icon: <Wrench className="w-5 h-5" /> },
    { name: "Gardening", icon: <Sparkles className="w-5 h-5" /> },
    { name: "Baby Sitter", icon: <Baby className="w-5 h-5" /> },
    { name: "Cook", icon: <ChefHat className="w-5 h-5" /> },
    { name: "Pet Sitter", icon: <PawPrint className="w-5 h-5" /> },
  ];

  useEffect(() => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    setEmailValid(emailRegex.test(form.email));

    setPasswordValid(form.password.length >= 6);

    setPhoneValid(/^\d{10}$/.test(form.contact));
  }, [form.email, form.password, form.contact]);

  const handleChange = (e) => {
    // Prevent numbers in name field
    if (e.target.name === "name") {
      const value = e.target.value;
      // Only allow letters, spaces, and basic punctuation
      if (/^[a-zA-Z\s.'-]*$/.test(value)) {
        setForm({ ...form, name: value });
      }
      return;
    }
    // For experience field, only allow numbers and limit to 2 digits
    if (e.target.name === "experience") {
      const value = e.target.value;

      // Only allow numbers and empty string
      if (value === "" || /^\d{0,2}$/.test(value)) {
        // Convert to number and validate range
        const numValue = parseInt(value);
        if (value === "" || (numValue >= 0 && numValue <= 40)) {
          setForm({ ...form, experience: value });
        }
      }
      return;
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCvChange = (e) => {
    setCvFile(e.target.files[0]);
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service === selectedService ? "" : service);
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      setErrorMessage("Name is required.");
      return false;
    }

    if (!form.email.trim()) {
      setErrorMessage("Email is required.");
      return false;
    }

    if (!emailValid) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    if (!form.password || form.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return false;
    }

    if (!phoneValid) {
      setErrorMessage("Please enter a valid 10-digit phone number.");
      return false;
    }

    if (!form.address.trim()) {
      setErrorMessage("Address is required.");
      return false;
    }

    if (form.role === "worker") {
      if (!selectedService) {
        setErrorMessage("Please select a service.");
        return false;
      }

      // Experience validation
      const expNum = parseInt(form.experience);
      if (!form.experience || isNaN(expNum) || expNum < 0 || expNum > 40) {
        setErrorMessage("Please enter valid experience (0-40 years).");
        return false;
      }

      if (!cvFile) {
        setErrorMessage("Please upload your CV.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setLocationFetching(true);
    setLocationStatus("Fetching your location...");
    setSuccessMessage("");
    setErrorMessage("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coordinates = [
          position.coords.longitude,
          position.coords.latitude,
        ];
        setLocationStatus("Location found! Creating account...");

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
          formData.append(key, value);
        });

        formData.append("location[type]", "Point");
        formData.append("location[coordinates][]", coordinates[0]);
        formData.append("location[coordinates][]", coordinates[1]);
        formData.append(
          "status",
          form.role === "worker" ? "pending" : "approved"
        );

        if (form.role === "worker") {
          formData.append("experience", form.experience);
          formData.append("servicesOffered", selectedService);
          if (cvFile) formData.append("cv", cvFile);
        }

        try {
          const response = await fetch(
            "http://localhost:5000/api/users/create",
            {
              method: "POST",
              body: formData,
            }
          );

          const result = await response.json();
          if (!response.ok) throw new Error(result.error || "Signup failed.");

          setSuccessMessage("Account created! Redirecting to login...");
          setTimeout(() => navigate("/login"), 1500);
        } catch (error) {
          setErrorMessage(error.message || "Signup error. Please try again.");
        } finally {
          setLoading(false);
          setLocationFetching(false);
        }
      },
      () => {
        setErrorMessage("Please allow location access to continue.");
        setLoading(false);
        setLocationFetching(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
        <div className="p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-2xl">
          <div className="bg-white p-6 md:p-8 rounded-xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Create Your Account
              </h1>
              <p className="text-gray-600 font-medium">
                Fill in your details to create an account
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

            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100 flex items-start animate-fadeIn">
                <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-green-700">{successMessage}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Name */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <User className="h-5 w-5" />
                    </div>
                    <input
                      name="name"
                      placeholder="Full Name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all shadow-sm focus:shadow-md"
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      name="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-10 py-3 bg-gray-50 border ${
                        form.email
                          ? emailValid
                            ? "border-green-300"
                            : "border-red-300"
                          : "border-gray-200"
                      } rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all shadow-sm focus:shadow-md`}
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

                  {/* Password */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      name="password"
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-12 py-3 bg-gray-50 border ${
                        form.password
                          ? passwordValid
                            ? "border-green-300"
                            : "border-red-300"
                          : "border-gray-200"
                      } rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all shadow-sm focus:shadow-md`}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
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
                    {form.password && (
                      <div className="text-xs mt-1 ml-1 text-gray-500 flex items-center">
                        {passwordValid ? (
                          <span className="text-green-500 flex items-center">
                            <Check className="h-3 w-3 mr-1" /> Password is
                            strong
                          </span>
                        ) : (
                          <span className="text-red-500">
                            Password must be at least 6 characters
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Phone className="h-5 w-5" />
                    </div>
                    <input
                      name="contact"
                      placeholder="Phone Number"
                      value={form.contact}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-10 py-3 bg-gray-50 border ${
                        form.contact
                          ? phoneValid
                            ? "border-green-300"
                            : "border-red-300"
                          : "border-gray-200"
                      } rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all shadow-sm focus:shadow-md`}
                    />
                    {form.contact && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {phoneValid ? (
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
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Address */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-40">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <input
                      name="address"
                      placeholder="Full Address"
                      value={form.address}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all shadow-sm focus:shadow-md"
                    />
                  </div>

                  {/* Role Selection */}
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">
                      I am a:
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, role: "customer" })}
                        className={`py-3 px-4 rounded-xl border transition-all flex items-center justify-center ${
                          form.role === "customer"
                            ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-300 text-indigo-600 shadow-inner ring-2 ring-indigo-100"
                            : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <User className="h-5 w-5 mr-2" />
                        Customer
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, role: "worker" })}
                        className={`py-3 px-4 rounded-xl border transition-all flex items-center justify-center ${
                          form.role === "worker"
                            ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-300 text-indigo-600 shadow-inner ring-2 ring-indigo-100"
                            : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <Wrench className="h-5 w-5 mr-2" />
                        Service Worker
                      </button>
                    </div>
                  </div>

                  {/* Worker Fields */}
                  {form.role === "worker" && (
                    <>
                      {/* Service Selection */}
                      <div>
                        <label className="block text-gray-700 mb-2 font-medium">
                          Select your service:
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {availableServices.map((service) => (
                            <button
                              key={service.name}
                              type="button"
                              onClick={() => handleServiceSelect(service.name)}
                              className={`p-2 rounded-lg border flex flex-col items-center justify-center transition-all relative ${
                                selectedService === service.name
                                  ? "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-300 text-indigo-600 shadow-inner ring-2 ring-indigo-100"
                                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              <div className="mb-1">{service.icon}</div>
                              <span className="text-xs font-medium">
                                {service.name}
                              </span>
                              {selectedService === service.name && (
                                <div className="absolute top-1 right-1 bg-indigo-500 rounded-full p-1">
                                  <Check className="h-3 w-3 text-white" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                        {selectedService && (
                          <div className="mt-2 text-xs text-indigo-600 flex items-center">
                            <Check className="h-3 w-3 mr-1" />
                            Selected: {selectedService}
                          </div>
                        )}
                      </div>

                      {/* Experience and CV */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 mb-2 font-medium">
                            Experience (years):
                            <span className="text-xs text-gray-500 ml-1">
                              (0-40)
                            </span>
                          </label>
                          <input
                            type="text"
                            name="experience"
                            value={form.experience}
                            onChange={handleChange}
                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-300 focus:border-transparent shadow-sm focus:shadow-md"
                            placeholder="Enter years (0-40)"
                            inputMode="numeric"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 mb-2 font-medium">
                            Upload CV:
                          </label>
                          <div className="relative">
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleCvChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              id="cv-upload"
                            />
                            <label
                              htmlFor="cv-upload"
                              className="block w-full p-3 rounded-xl border border-gray-200 bg-gray-50 text-center cursor-pointer hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex items-center justify-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 mr-2 text-gray-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                  />
                                </svg>
                                <span className="text-gray-600 font-medium">
                                  Choose File
                                </span>
                              </div>
                            </label>
                          </div>
                          {cvFile && (
                            <div className="text-xs text-gray-500 mt-1 flex items-center">
                              <Check className="h-3 w-3 text-green-500 mr-1" />
                              Selected: {cvFile.name}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Location Access */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100 shadow-sm">
                <div className="flex items-start">
                  <div className="bg-white p-2 rounded-xl mr-3 flex-shrink-0 shadow-sm">
                    <MapPin className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">
                      Location Access
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      We need your location to provide localized services. Your
                      location data is secure and will not be shared.
                    </p>
                  </div>
                </div>

                {locationFetching && (
                  <div className="mt-4 flex items-center bg-white p-3 rounded-lg shadow-sm">
                    <Loader className="h-5 w-5 text-indigo-600 animate-spin mr-2" />
                    <span className="text-gray-700 font-medium">
                      {locationStatus}
                    </span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading || locationFetching}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all font-medium shadow-lg shadow-indigo-100 hover:shadow-indigo-200 disabled:opacity-70 flex items-center justify-center transform hover:-translate-y-0.5 disabled:transform-none"
                >
                  {loading || locationFetching ? (
                    <>
                      <Loader className="h-5 w-5 animate-spin mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>

              <div className="mt-6 text-center pt-4 border-t border-gray-100">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-indigo-600 font-medium hover:underline hover:text-indigo-700"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
