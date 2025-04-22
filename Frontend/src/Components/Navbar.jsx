import React from "react";
import { Bell, UserCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      navigate("/login");
    
  };
  
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600">SewaMate</h1>
      <div className="flex items-center gap-6">
        <button
          className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
          title="Notifications"
        >
          <Bell size={20} />
          <span>Notifications</span>
        </button>

        <button
          className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
          title="Profile"
          onClick={() => navigate("/profile")}
        >
          <UserCircle size={20} />
          <span>Profile</span>
        </button>

        <button
          className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
          title="Logout"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
