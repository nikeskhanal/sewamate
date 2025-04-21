import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, Loader } from "lucide-react";

const ApproveEmployee = () => {
  const [pendingWorkers, setPendingWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingWorkers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/workers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const workersArray = Array.isArray(res.data)
        ? res.data
        : res.data.workers || [];

      setPendingWorkers(workersArray);
    } catch (err) {
      console.error("❌ Error fetching pending workers:", err);
      setPendingWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (workerId) => {
    try {
      await axios.put(`http://localhost:5000/api/users/approve/${workerId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setPendingWorkers((prev) =>
        prev.filter((worker) => worker._id !== workerId)
      );
      alert("Worker approved successfully!");
    } catch (err) {
      console.error("❌ Failed to approve worker:", err);
      alert("Failed to approve worker");
    }
  };

  useEffect(() => {
    fetchPendingWorkers();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Pending Workers for Approval</h2>

      {loading ? (
        <div className="flex justify-center items-center">
          <Loader className="animate-spin w-6 h-6 text-blue-500" />
          <span className="ml-2">Loading...</span>
        </div>
      ) : pendingWorkers.length === 0 ? (
        <p className="text-center text-gray-500">No pending workers to approve.</p>
      ) : (
        <div className="grid gap-4">
          {pendingWorkers.map((worker) => (
            <div
              key={worker._id}
              className="bg-white p-5 rounded-xl shadow-md border border-gray-200"
            >
              <p className="text-lg font-semibold text-gray-700">👤 {worker.name}</p>
              <p className="text-gray-600">📧 {worker.email}</p>
              <p className="text-gray-600">📞 {worker.contact}</p>

              <button
                onClick={() => handleApprove(worker._id)}
                className="mt-4 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Approve
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApproveEmployee;
