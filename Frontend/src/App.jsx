// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home.jsx"
import Login from "./Components/Login.jsx";
import Signup from "./Components/Signup.jsx";

import CustomerDashboard from "./Components/Customerdashboard.jsx";
import ForgotPassword from "./Components/Forgotpassword.jsx";
import Admindashboard from "./Components/Admindashboard.jsx";
import CreateEmployee from "./Components/CreateEmployee.jsx";
import WorkerDashboard from "./Components/Workerdashboard.jsx";
import Pending from "./Components/Pending.jsx";
import ApproveEmployee from "./Components/ApproveEmployee.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={< Login/>} />
        <Route path="/signup" element={< Signup/>} />
        <Route path="customer-dashboard" element={< CustomerDashboard/>} />
        <Route path="forgot-password" element={< ForgotPassword/>} />
        <Route path="/admin" element={< Admindashboard/>} />
        <Route path="/create-employee" element={< CreateEmployee/>} />
        <Route path="/worker-dashboard" element={< WorkerDashboard/>} />
        <Route path="/pending" element={< Pending/>} />
        <Route path="/worker-request" element={< ApproveEmployee/>} />

       
      </Routes>
    </Router>
  );
};

export default App;
