import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { LocateIcon, SearchIcon } from "lucide-react";

const servicesList = [
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

const CustomerDashboard = () => {
  const [selectedService, setSelectedService] = useState("");
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function calculateDistance(lat1, lon1, lat2, lon2) {
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
  }

  useEffect(() => {
    const fetchAllWorkers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/hiredworkers");
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];
        setWorkers(data);
      } catch (err) {
        console.error("Error fetching all workers:", err);
      }
    };

    fetchAllWorkers();
  }, []);

  const getLocationAndSearch = async () => {
    setErrorMessage("");
    if (!selectedService) return setErrorMessage("Please select a service.");

    if (!navigator.geolocation)
      return setErrorMessage("Geolocation not supported.");

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await axios.get(
            `http://localhost:5000/api/users/searchworkers?service=${selectedService}&lat=${latitude}&lng=${longitude}`
          );

          const data = Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data.data)
            ? res.data.data
            : [];

          const workersWithDistance = data.map((worker) => {
            const [lng, lat] = worker.location?.coordinates || [];
            if (lat && lng) {
              const distance = calculateDistance(latitude, longitude, lat, lng);
              return { ...worker, distance };
            }
            return worker;
          });

          const sortedByDistance = workersWithDistance.sort((a, b) => a.distance - b.distance);

          setWorkers(sortedByDistance);
        } catch (err) {
          console.error("Error fetching workers:", err);
          setErrorMessage("Something went wrong while fetching workers.");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setErrorMessage("Failed to get your location.");
        setLoading(false);
      }
    );
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
          <LocateIcon className="w-6 h-6" />
          Find Nearby Services
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-6">
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full sm:w-64"
          >
            <option value="">-- Select a Service --</option>
            {servicesList.map((service, index) => (
              <option key={index} value={service}>
                {service}
              </option>
            ))}
          </select>

          <button
            onClick={getLocationAndSearch}
            disabled={loading}
            className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <SearchIcon className="w-5 h-5" />
            {loading ? "Searching..." : "Search Nearby"}
          </button>
        </div>

        {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}

        {workers.length > 0 && !selectedService && (
          <h4 className="mt-6 text-lg font-semibold text-gray-600">All Available Workers</h4>
        )}

        <div className="mt-6">
          {Array.isArray(workers) && workers.length > 0 ? (
            <ul className="space-y-6">
              {workers.map((worker) => (
                <li
                  key={worker._id}
                  className="p-4 bg-white shadow-md rounded-xl border border-gray-200 flex items-center gap-6"
                >
                  <img
                    src={
                      worker.photo
                        ? `http://localhost:5000/uploads/${worker.photo}`
                        : "https://via.placeholder.com/80"
                    }
                    alt={worker.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                  />

                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {worker.name}
                    </h3>
                    <p className="text-sm text-gray-600">Email: {worker.email}</p>
                    <p className="text-sm text-gray-600">Contact: {worker.contact}</p>
                    <p className="text-sm text-gray-600">
                      Services: {worker.servicesOffered?.join(", ")}
                    </p>
                    {worker.distance && (
                      <p className="text-sm text-gray-500">
                        Distance: {(worker.distance / 1000).toFixed(2)} km
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => alert(`Booked ${worker.name}`)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all"
                  >
                    Book Now
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            !loading && (
              <p className="text-gray-500 mt-6">
                No workers available at the moment.
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
