import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home.jsx";
import Login from "./Components/Login.jsx";
import Signup from "./Components/Signup.jsx";
import CustomerDashboard from "./Components/Customerdashboard.jsx";
import Admindashboard from "./Components/Admindashboard.jsx";
import CreateEmployee from "./Components/CreateEmployee.jsx";
import WorkerDashboard from "./Components/Workerdashboard.jsx";
import Pending from "./Components/Pending.jsx";
import ApproveEmployee from "./Components/ApproveEmployee.jsx";
import MyProfile from "./Components/MyProfile.jsx";
import ForgotPassword from "./Components/ForgotPassword.jsx";
import ChatComponent from "./Components/ChatComponent.jsx";
import WorkerProfile from "./Components/WorkerProfile.jsx";

const App = () => {
  const loggedInUser = JSON.parse(localStorage.getItem('user'));
  const userId = loggedInUser?._id;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin" element={<Admindashboard />} />
        <Route path="/create-employee" element={<CreateEmployee />} />
        <Route path="/worker-dashboard" element={<WorkerDashboard />} />
        <Route path="/pending" element={<Pending />} />
        <Route path="/worker-request" element={<ApproveEmployee />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/worker/:id" element={<WorkerProfile />} />

        {/* Unified Chat Route */}
        <Route 
          path="/chat/:receiverId" 
          element={<ChatComponent isSender={true} />} 
        />
      </Routes>
    </Router>
  );
};

export default App;