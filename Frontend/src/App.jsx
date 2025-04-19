// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home.jsx"
import Login from "./Components/Login.jsx";
import Signup from "./Components/Signup.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={< Login/>} />
        <Route path="/signup" element={< Signup/>} />
       
      </Routes>
    </Router>
  );
};

export default App;
