import React, { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const servicesList = ["Plumbing", "Electrician", "Cleaning", "Carpentry", "AC Repair"];

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
  
  const getLocationAndSearch = async () => {
    setErrorMessage("");
  
    if (!selectedService) {
      setErrorMessage("Please select a service.");
      return;
    }
  
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by your browser.");
      return;
    }
  
    setLoading(true);
  
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        console.log(`Latitude: ${latitude}, Longitude: ${longitude}, Accuracy: ${accuracy} meters`);
  
        console.log("Searching with coords:", latitude, longitude);
        console.log("Selected service:", selectedService);
  
        try {
          const res = await axios.get(
            `http://localhost:5000/api/users/searchworkers?service=${selectedService}&lat=${latitude}&lng=${longitude}`
          );
  
          console.log("API Response:", res.data);
  
          const data = Array.isArray(res.data)
            ? res.data
            : Array.isArray(res.data.data)
            ? res.data.data
            : [];
  
        
          const workersWithDistance = data.map((worker) => {
            const workerLat = worker.location?.coordinates[1]; // Latitude at index 1
            const workerLng = worker.location?.coordinates[0]; // Longitude at index 0
  
            if (workerLat && workerLng) {
              const distance = calculateDistance(
                latitude,
                longitude,
                workerLat,
                workerLng
              );
              return { ...worker, distance };
            } else {
              console.warn(`Worker ${worker.name} has invalid location data.`);
              return worker; 
            }
          });
  
          setWorkers(workersWithDistance);
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
  
  return (<div>
    <Navbar/>
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Find Nearby Services</h2>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
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
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Searching..." : "Search Nearby"}
        </button>
      </div>

      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      <div>
        {Array.isArray(workers) && workers.length > 0 ? (
          <ul className="space-y-4">
            {workers.map((worker) => (
              <li
                key={worker._id}
                className="p-4 bg-white shadow-md rounded border border-gray-200"
              >
                <h3 className="text-lg font-semibold">{worker.name}</h3>
                <p>Email: {worker.email}</p>
                <p>Contact: {worker.contact}</p>
                <p>Services: {worker.servicesOffered?.join(", ")}</p>
                {worker.distance && (
                  <p className="text-sm text-gray-500">
                    Distance: {worker.distance.toFixed(2)} m
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p>No workers found.</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default CustomerDashboard;
