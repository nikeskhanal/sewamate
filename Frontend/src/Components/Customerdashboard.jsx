import React, { useEffect, useState } from "react";
import axios from "axios";

const CustomerDashboard = () => {
  const [workers, setWorkers] = useState([]);
  const [selectedService, setSelectedService] = useState("all");

  const fetchWorkers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/workers");
      setWorkers(response.data);
    } catch (err) {
      console.error("Failed to fetch workers", err);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const filteredWorkers = selectedService === "all"
    ? workers
    : workers.filter(worker => worker.servicesOffered.includes(selectedService));

  const handleHire = (worker) => {
    alert(`You hired ${worker.name} for ${worker.servicesOffered.join(", ")}`);
    // Later you can connect this to actual booking API
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6 text-pink-600">
        Hire a Worker
      </h1>

      <div className="mb-6 flex justify-center">
        <select
          className="px-4 py-2 border rounded-xl shadow-sm"
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
        >
          <option value="all">All Services</option>
          <option value="Electrician">Electrician</option>
          <option value="Plumber">Plumber</option>
          <option value="Carpenter">Carpenter</option>
          <option value="Painter">Painter</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredWorkers.map((worker) => (
          <div key={worker._id} className="bg-white p-4 rounded-xl shadow-md">
            <img
              src={worker.photo || "https://via.placeholder.com/150"}
              alt={worker.name}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800">{worker.name}</h2>
            <p className="text-gray-600 mb-1">📞 {worker.contact}</p>
            <p className="text-gray-600 mb-1">📍 {worker.address}</p>
            <p className="text-gray-600 mb-2">🛠️ {worker.servicesOffered.join(", ")}</p>
            <button
              onClick={() => handleHire(worker)}
              className="bg-pink-600 text-white w-full py-2 rounded-xl hover:bg-pink-700 transition"
            >
              Hire Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerDashboard;
