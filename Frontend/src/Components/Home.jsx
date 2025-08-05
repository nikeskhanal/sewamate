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
    <div className="font-sans bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800">
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center py-24 px-6 text-center"
        style={{ backgroundImage: "url(../src/assets/sewacover.jpg)" }}
      >
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800/70 to-gray-900/80"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
            Welcome to <span className="text-indigo-300">SewaMate</span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Your one-stop solution for trusted home services at your doorstep
          </p>
          <button
            onClick={handleHireServiceClick}
            className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 px-8 py-3 rounded-xl font-bold text-white shadow-lg hover:shadow-xl"
          >
            Hire a Service
          </button>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-16 px-6 text-center bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">
            Popular Services
          </h2>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
            Trusted professionals for all your home service needs
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Plumber", img: plumber },
              { name: "Electrician", img: electrician },
              { name: "Cleaner", img: cleaner },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="mb-4 overflow-hidden rounded-xl">
                  <img
                    src={service.img}
                    alt={service.name}
                    className="mx-auto h-48 w-full object-cover rounded-xl transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <button
                  onClick={handleHireServiceClick}
                  className="text-xl font-semibold text-indigo-600 hover:text-indigo-800 transition duration-200"
                >
                  {service.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-indigo-50 text-center px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">
            How It Works
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            Simple steps to get your home services done
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Choose Service</h3>
              <p className="text-gray-600">Browse services and pick what you need</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Book a Provider</h3>
              <p className="text-gray-600">Schedule the service as per your convenience</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Get It Done</h3>
              <p className="text-gray-600">Our trusted pro comes to your place</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Hire a trusted professional or join us as a service provider today.
          </p>
          <button
            onClick={handlejoin}
            className="bg-white text-indigo-600 hover:bg-gray-100 transition-all duration-300 px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl"
          >
            Hire Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-200 py-8 text-center">
        <p>
          &copy; {new Date().getFullYear()} Visit the Admin Office to join as a
          Service Provider.
        </p>
      </footer>
    </div>
  );
};

export default Home;