import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const Admindashboard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [rateEdit, setRateEdit] = useState({});
  const [rateStatus, setRateStatus] = useState({});

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/users/admin",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(
        Array.isArray(response.data) ? response.data : response.data.users || []
      );
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <a
            href="/worker-request"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Worker Request
          </a>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {users.length > 0 ? (
          <>
            {/* Worker Table */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-2">Workers</h2>
              <table className="w-full border-collapse mb-8">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Service</th>
                    <th className="border p-2">Experience (years)</th>
                    <th className="border p-2">Rate/hr</th>
                    <th className="border p-2">Update Rate</th>
                    <th className="border p-2">Delete Worker</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter((u) => u.role === "worker")
                    .map((worker) => (
                      <tr key={worker._id}>
                        <td className="border p-2">{worker.name}</td>
                        <td className="border p-2">{worker.email}</td>
                        <td className="border p-2">
                          {worker.servicesOffered || "-"}
                        </td>
                        <td className="border p-2">
                          {worker.experience || "-"}
                        </td>
                        <td className="border p-2">
                          {worker.ratePerHour !== null
                            ? `₹${worker.ratePerHour}`
                            : "-"}
                        </td>
                        <td className="border p-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              value={
                                rateEdit[worker._id] !== undefined
                                  ? rateEdit[worker._id]
                                  : worker.ratePerHour || ""
                              }
                              onChange={(e) =>
                                setRateEdit({ ...rateEdit, [worker._id]: e.target.value })
                              }
                              className="border rounded px-2 py-1 w-24"
                              placeholder="Set rate"
                            />
                            <button
                              className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm"
                              onClick={async () => {
                                const newRate = Number(rateEdit[worker._id]);
                                if (isNaN(newRate) || newRate < 0) {
                                  setRateStatus({ ...rateStatus, [worker._id]: "error" });
                                  return;
                                }
                                try {
                                  const token = localStorage.getItem("token");
                                  await axios.put(
                                    `http://localhost:5000/api/users/rate/${worker._id}`,
                                    JSON.stringify({ ratePerHour: newRate }),
                                    {
                                      headers: {
                                        Authorization: `Bearer ${token}`,
                                        "Content-Type": "application/json"
                                      }
                                    }
                                  );
                                  setRateStatus({ ...rateStatus, [worker._id]: "success" });
                                  fetchUsers();
                                } catch {
                                  setRateStatus({ ...rateStatus, [worker._id]: "error" });
                                }
                                setTimeout(() => setRateStatus({ ...rateStatus, [worker._id]: undefined }), 2000);
                              }}
                            >
                              Done
                            </button>
                          </div>
                        </td>
                        <td className="border p-2">
                          <button
                            onClick={() => deleteUser(worker._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                          >
                            Delete Worker
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {/* User Table */}
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-2">Users</h2>
              <table className="w-full border-collapse mb-8">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Role</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter((u) => u.role !== "worker")
                    .map((user) => (
                      <tr key={user._id}>
                        <td className="border p-2">{user.name}</td>
                        <td className="border p-2">{user.email}</td>
                        <td className="border p-2">{user.role}</td>
                        <td className="border p-2">
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p>No users found.</p>
        )}

        
      </div>
    </div>
  );
};

export default Admindashboard;
