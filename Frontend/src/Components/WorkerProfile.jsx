import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Mail, Phone, MapPin, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const API_BASE_URL = "http://localhost:5000";

const WorkerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/users/worker/${id}`);
        setWorker(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };
    fetchWorker();
  }, [id]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 max-w-md w-full bg-white rounded-xl shadow-md text-center">
          <div className="text-red-500 text-lg font-medium mb-4">{error}</div>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 transition-colors"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </motion.button>

        {/* Main Profile Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {loading ? (
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3 flex flex-col items-center">
                  <Skeleton circle height={150} width={150} />
                  <Skeleton width={120} height={20} className="mt-4" />
                  <Skeleton width={80} height={16} className="mt-2" />
                </div>
                <div className="w-full md:w-2/3 space-y-4">
                  <Skeleton height={24} width="60%" />
                  <Skeleton count={4} />
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img
                      src={
                        worker.photo
                          ? `${API_BASE_URL}/uploads/${worker.photo}`
                          : "https://avatars.dicebear.com/api/initials/" +
                            worker.name +
                            ".svg?background=rgba(255,255,255,0.5)"
                      }
                      alt={worker.name}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white/30 shadow-lg"
                    />
                  </motion.div>

                  <div className="text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-bold">
                      {worker.name}
                    </h1>
                    {worker.profession && (
                      <p className="mt-2 text-sm text-white/90">
                        {worker.profession}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Content */}
              <div className="p-6">
                <motion.div
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6"
                >
                  {/* Contact Information */}
                  {(worker.email || worker.contact) && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-indigo-500" />
                        Contact Information
                      </h3>
                      <ul className="space-y-2">
                        {worker.email && (
                          <li className="text-sm text-gray-600">
                            <span className="font-medium">Email:</span>{" "}
                            {worker.email}
                          </li>
                        )}
                        {worker.contact && (
                          <li className="text-sm text-gray-600 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span className="font-medium">Phone:</span>{" "}
                            {worker.contact}
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Address */}
                  {worker.address && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-indigo-500" />
                        Location
                      </h3>
                      <p className="text-sm text-gray-600">{worker.address}</p>
                    </div>
                  )}

                  {/* Services */}
                  {(() => {
                    let services = Array.isArray(worker.servicesOffered)
                      ? worker.servicesOffered
                      : worker.servicesOffered
                      ? [worker.servicesOffered]
                      : [];
                    return services.length > 0 ? (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-indigo-500" />
                          Services Offered
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {services.map((service, index) => (
                            <span
                              key={index}
                              className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null;
                  })()}

                  {/* Experience & Rate */}
                  {(worker.experience !== undefined ||
                    worker.ratePerHour !== undefined) && (
                    <div className="bg-gray-50 p-4 rounded-lg flex gap-6">
                      {worker.experience !== undefined &&
                        worker.experience !== null && (
                          <div>
                            <h3 className="font-medium text-gray-700 mb-1 flex items-center gap-2">
                              <Briefcase className="w-4 h-4 text-green-500" />
                              Experience
                            </h3>
                            <span className="text-green-700 font-semibold text-sm">
                              {worker.experience} yrs
                            </span>
                          </div>
                        )}
                      {worker.ratePerHour !== undefined &&
                        worker.ratePerHour !== null && (
                          <div>
                            <h3 className="font-medium text-gray-700 mb-1 flex items-center gap-2">
                              <Briefcase className="w-4 h-4 text-yellow-500" />
                              Rate per Hour
                            </h3>
                            <span className="text-yellow-700 font-semibold text-sm">
                              ₹{worker.ratePerHour}/hr
                            </span>
                          </div>
                        )}
                    </div>
                  )}

                  {/* About Me */}
                  {worker.aboutMe && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-700 mb-3">
                        About Me
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {worker.aboutMe}
                      </p>
                    </div>
                  )}
                </motion.div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default WorkerProfile;
