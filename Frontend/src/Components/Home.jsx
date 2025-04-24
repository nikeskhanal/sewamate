// No changes to imports
import React from "react";
import plumber from "../assets/plumber.jpg";
import electrician from "../assets/electrician.jpg";
import cleaner from "../assets/cleaner.jpg";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const handleHireServiceClick = () => {
    navigate("/login");
  };
  const handlejoin = () => {
    navigate("/signup");
  };

  return (
    <div className="font-sans">
      <section
        className="relative bg-cover bg-center py-16 px-6 text-center"
        style={{ backgroundImage: "url(../src/assets/sewacover.jpg)" }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative z-10 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to SewaMate
          </h1>
          <p className="text-lg md:text-xl mb-6">
            Your one-stop solution for trusted home services at your doorstep
          </p>
          <button
            onClick={handleHireServiceClick}
            className="bg-blue-600 hover:bg-blue-700 transition duration-300 px-6 py-2 rounded-xl"
          >
            Hire a Service
          </button>
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-10">Popular Services</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Plumber", img: plumber },
            { name: "Electrician", img: electrician },
            { name: "Cleaner", img: cleaner },
          ].map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 transform hover:scale-105"
            >
              <div className="mb-4">
                <img
                  src={service.img}
                  alt={service.name}
                  className="mx-auto h-40 w-full object-cover rounded-2xl border-4 border-blue-600"
                />
              </div>
              <button
                onClick={handleHireServiceClick}
                className="text-xl font-semibold text-blue-600 hover:text-blue-800 transition duration-200"
              >
                {service.name}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-white text-center px-6">
        <h2 className="text-3xl font-semibold mb-10">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="hover:bg-blue-50 p-4 rounded-lg transition duration-200">
            <h3 className="text-xl font-bold mb-2">1. Choose Service</h3>
            <p>Browse services and pick what you need</p>
          </div>
          <div className="hover:bg-blue-50 p-4 rounded-lg transition duration-200">
            <h3 className="text-xl font-bold mb-2">2. Book a Provider</h3>
            <p>Schedule the service as per your convenience</p>
          </div>
          <div className="hover:bg-blue-50 p-4 rounded-lg transition duration-200">
            <h3 className="text-xl font-bold mb-2">3. Get It Done</h3>
            <p>Our trusted pro comes to your place</p>
          </div>
        </div>
      </section>

      <section className="bg-blue-600 text-white py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="mb-6">
          Hire a trusted professional or join us as a service provider today.
        </p>
        <div className="space-x-4">
          <button
            onClick={handlejoin}
            className="bg-white text-blue-600 hover:bg-gray-100 transition duration-300 px-6 py-2 rounded-xl"
          >
            Hire Now
          </button>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-6 text-center">
        <p>
          &copy; {new Date().getFullYear()} Visit the Admin Office to join as a
          Service Provider.
        </p>
      </footer>
    </div>
  );
};

export default Home;
