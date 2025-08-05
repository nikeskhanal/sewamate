import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import {
  LocateIcon,
  SearchIcon,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SERVICES = [
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Painting",
  "Carpentry",
  "Gardening",
  "Baby Sitter",
  "Cook",
  "Pet Sitter",
];
const API_BASE_URL = "http://localhost:5000";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const WorkerCard = React.memo(({ worker, onMessage, onViewProfile }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex-shrink-0">
          <div className="relative">
            <img
              src={
                !imageError && worker.photo
                  ? `${API_BASE_URL}/uploads/${worker.photo}`
                  : "https://via.placeholder.com/100?text=👤"
              }
              alt={worker.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
              onError={() => setImageError(true)}
            />
            {worker.isAvailable === false && (
              <div className="absolute bottom-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                Busy
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg font-semibold text-gray-800">
            {worker.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {(() => {
              let services = Array.isArray(worker.servicesOffered)
                ? worker.servicesOffered
                : worker.servicesOffered
                ? [worker.servicesOffered]
                : [];
              return (
                <>
                  {services.slice(0, 3).join(" • ")}
                  {services.length > 3 && " • ..."}
                </>
              );
            })()}
          </p>
          <div className="mt-2 flex flex-wrap gap-2 items-center justify-center sm:justify-start">
            {worker.distance !== undefined && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {(worker.distance / 1000).toFixed(1)} km away
              </span>
            )}
            {worker.experience !== undefined && worker.experience !== null && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                {worker.experience} yrs exp
              </span>
            )}
            {worker.ratePerHour !== undefined && worker.ratePerHour !== null && (
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                ₹{worker.ratePerHour}/hr
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => onMessage(worker._id)}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            disabled={worker.isAvailable === false}
          >
            <MessageCircle className="w-4 h-4" />
            Message
          </button>

          <button
            onClick={() => onViewProfile(worker._id)}
            className="flex items-center gap-1 border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
});

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState("");
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Location error:", error);
          setErrorMessage(
            "Please enable location services to find nearby workers"
          );
        }
      );
    } else {
      setErrorMessage("Geolocation is not supported by your browser.");
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchWorkers("/api/users/hiredworkers");
    }
  }, [userLocation]);

  const fetchWorkers = useCallback(async (url, params = {}) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await axios.get(`${API_BASE_URL}${url}`, { params });
      const data = res.data?.data || res.data || [];
      setWorkers(data);
    } catch (err) {
      console.error("Error fetching workers:", err);
      setErrorMessage(err.response?.data?.message || "Failed to fetch workers");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = () => {
    if (!selectedService) {
      return setErrorMessage("Please select a service first");
    }
    if (!userLocation) {
      return setErrorMessage(
        "Please enable location services to find nearby workers"
      );
    }

    fetchWorkers("/api/users/searchworkers", {
      service: selectedService,
      lat: userLocation.latitude,
      lng: userLocation.longitude,
    });
  };

  const processedWorkers = useMemo(() => {
    if (!userLocation) return workers;
    return workers.map((worker) => {
      if (!worker.location?.coordinates) return worker;
      const [lng, lat] = worker.location.coordinates;
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        lat,
        lng
      );
      return { ...worker, distance };
    });
  }, [workers, userLocation]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="p-4 max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <LocateIcon className="w-8 h-8" />
                Find Local Service Professionals
              </h1>
              <p className="mt-2 opacity-90">
                Connect with skilled workers in your neighborhood
              </p>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 w-full md:w-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 rounded-lg bg-white/90 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                  >
                    <option value="">Select Service</option>
                    {SERVICES.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-3 text-gray-400 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all ${
                    loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-white text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <SearchIcon className="w-5 h-5" />
                  )}
                  {loading ? "Searching..." : "Find Workers"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            {errorMessage}
          </div>
        )}

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedService
                ? `${processedWorkers.length} ${selectedService} Professionals Nearby`
                : "Available Service Providers"}
            </h2>
            {processedWorkers.length > 0 && (
              <div className="text-sm text-gray-500">
                Sorted by {selectedService ? "distance" : "availability"}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              </div>
            ) : processedWorkers.length > 0 ? (
              processedWorkers.map((worker) => (
                <WorkerCard
                  key={worker._id}
                  worker={worker}
                  onMessage={(id) => navigate(`/chat/${id}`)}
                  onViewProfile={(id) => navigate(`/worker/${id}`)}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <SearchIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No professionals found
                </h3>
                <p className="mt-2 text-gray-500">
                  {selectedService
                    ? `We couldn't find any ${selectedService.toLowerCase()} professionals near you`
                    : "No service providers are currently available"}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default CustomerDashboard;
