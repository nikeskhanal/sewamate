// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home.jsx"
import Login from "./Components/Login.jsx";
import Signup from "./Components/Signup.jsx";

import CustomerDashboard from "./Components/Customerdashboard.jsx";
import ForgotPassword from "./Components/Forgotpassword.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={< Login/>} />
        <Route path="/signup" element={< Signup/>} />
        <Route path="customer-dashboard" element={< CustomerDashboard/>} />
        <Route path="forgot-password" element={< ForgotPassword/>} />
       
      </Routes>
    </Router>
  );
};

export default App;
