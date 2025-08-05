import React, { useEffect, useState } from "react";
import axios from "axios";
import { Camera, Loader, UserCircle, ArrowLeft, Mail, Phone, MapPin, Calendar, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPhoto, setNewPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
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
    if (e.target.files && e.target.files[0]) {
      setNewPhoto(e.target.files[0]);
    }
  };

  const handleUpdatePhoto = async (e) => {
    e.preventDefault();
    if (!newPhoto) return;
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append("photo", newPhoto);

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
      setNewPhoto(null);
    } catch (error) {
      console.error("Failed to update photo", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4">
        {/* Floating particles background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 50 + 10}px`,
                height: `${Math.random() * 50 + 10}px`,
                background: `radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)`,
                animationDuration: `${Math.random() * 10 + 10}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-indigo-700/20 animate-pulse"></div>
            <div className="absolute -inset-2 border-2 border-dashed border-white/20 rounded-full animate-spin"></div>
          </div>
          <div className="h-4 w-48 bg-indigo-700/20 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4">
        {/* Floating particles background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 50 + 10}px`,
                height: `${Math.random() * 50 + 10}px`,
                background: `radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)`,
                animationDuration: `${Math.random() * 10 + 10}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
        
        <div className="text-center p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Settings className="text-red-400" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Profile Error</h2>
          <p className="text-indigo-200 mb-6">We couldn't load your profile information.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 50 + 10}px`,
              height: `${Math.random() * 50 + 10}px`,
              background: `radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Glassmorphism profile card */}
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl w-full max-w-2xl overflow-hidden border border-white/20 shadow-2xl">
        {/* Decorative header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 relative">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full filter blur-xl"></div>
            <div className="absolute top-20 right-0 w-32 h-32 bg-indigo-500/20 rounded-full filter blur-xl"></div>
          </div>
          
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 flex items-center gap-2 text-indigo-100 hover:text-white font-medium transition-colors group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          
          <h1 className="text-3xl font-bold text-center text-white">
            Your Profile
          </h1>
          <p className="text-center text-indigo-100 mt-2">
            Manage your account information
          </p>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Profile Header */}
          <div className="flex flex-col items-center space-y-6">
            <div className="relative group">
              <div className="relative rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-purple-500">
                {profile.photo ? (
                  <img
                    src={`http://localhost:5000/uploads/${profile.photo}`}
                    alt="Profile"
                    className="w-36 h-36 rounded-full object-cover border-4 border-white/30 shadow-lg"
                  />
                ) : (
                  <div className="w-36 h-36 flex items-center justify-center rounded-full bg-indigo-700/30 text-indigo-300 border-4 border-white/30">
                    <UserCircle size={72} />
                  </div>
                )}
                <label 
                  htmlFor="photo" 
                  className="absolute -bottom-2 -right-2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg cursor-pointer hover:scale-105 transition-transform"
                >
                  <Camera size={20} className="text-indigo-600" />
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </div>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-white">
                {profile.name || "Unnamed"}
              </h2>
              <p className="text-indigo-300 bg-indigo-700/30 px-4 py-1.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 backdrop-blur-sm">
                <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                {profile.role || "Role not set"}
              </p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-5 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-700/30 flex items-center justify-center backdrop-blur-sm">
                    <UserCircle size={16} className="text-indigo-300" />
                  </div>
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail size={18} className="text-indigo-300 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-indigo-300">Email</p>
                      <p className="font-medium text-white">{profile.email || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-indigo-300 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-indigo-300">Contact</p>
                      <p className="font-medium text-white">{profile.contact || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar size={18} className="text-indigo-300 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-indigo-300">Joined</p>
                      <p className="font-medium text-white">
                        {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-5 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-700/30 flex items-center justify-center backdrop-blur-sm">
                    <MapPin size={16} className="text-indigo-300" />
                  </div>
                  Location & Services
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-indigo-300 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-indigo-300">Address</p>
                      <p className="font-medium text-white">{profile.address || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-300 mt-0.5 flex-shrink-0">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <div>
                      <p className="text-xs text-indigo-300">Location</p>
                      <p className="font-medium text-white">
                        {profile.location?.coordinates?.join(", ") || "Unknown"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-300 mt-0.5 flex-shrink-0">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    <div>
                      <p className="text-xs text-indigo-300">Services</p>
                      <p className="font-medium text-white">
                        {(() => {
                          const services = Array.isArray(profile.servicesOffered)
                            ? profile.servicesOffered
                            : profile.servicesOffered
                            ? [profile.servicesOffered]
                            : [];
                          return services.length > 0 ? services.join(", ") : "None";
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Upload Form */}
          {newPhoto && (
            <form onSubmit={handleUpdatePhoto} className="animate-fade-in">
              <div className="p-5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10">
                <h3 className="text-sm font-semibold text-indigo-300 uppercase tracking-wider mb-4">
                  New Photo Preview
                </h3>
                <div className="flex flex-col items-center space-y-5">
                  <div className="relative rounded-full p-1 bg-gradient-to-tr from-indigo-500 to-purple-500">
                    <img 
                      src={URL.createObjectURL(newPhoto)} 
                      alt="Preview" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-white/30"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className={`w-full max-w-xs flex justify-center items-center py-3 px-6 rounded-xl text-white font-medium transition-all ${
                      isUploading 
                        ? 'bg-indigo-700/50 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 shadow-lg'
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <Loader className="animate-spin mr-2" size={18} />
                        Uploading...
                      </>
                    ) : (
                      "Update Profile Picture"
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;