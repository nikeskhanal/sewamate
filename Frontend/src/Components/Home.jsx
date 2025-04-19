import React from "react";
import { Wrench, Zap, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  const handleHireServiceClick = () => {
    navigate("/login");
  };
  return (
    <div className="font-sans">
     <section
  className="relative bg-cover bg-center py-16 px-6 text-center"
  style={{ backgroundImage: "url(../src/assets/sewacover.jpg)" }}
>
  {/* Overlay */}
  <div className="absolute inset-0  bg-black/70"></div>

  {/* Content */}
  <div className="relative z-10 text-white">
    <h1 className="text-4xl md:text-5xl font-bold mb-4">
      Welcome to SewaMate
    </h1>
    <p className="text-lg md:text-xl mb-6">
      Your one-stop solution for trusted home services at your doorstep
    </p>
    <button
      onClick={handleHireServiceClick}
      className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl"
    >
      Hire a Service
    </button>
  </div>
</section>

      {/* How It Works */}
      <section className="py-16 bg-white text-center px-6">
        <h2 className="text-3xl font-semibold mb-10">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-2">1. Choose Service</h3>
            <p>Browse services and pick what you need</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">2. Book a Provider</h3>
            <p>Schedule the service as per your convenience</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">3. Get It Done</h3>
            <p>Our trusted pro comes to your place</p>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="bg-gray-50 py-16 px-6 text-center">
      <h2 className="text-3xl font-semibold mb-10">Popular Services</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { name: 'Plumber', icon: <Wrench size={40} /> },
          { name: 'Electrician', icon: <Zap size={40} /> },
          { name: 'Cleaner', icon: <ShieldCheck size={40} /> },
        ].map((service, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-md">
            <div className="mb-4">{service.icon}</div>
            <button
              onClick={handleHireServiceClick} // Call the navigate function on click
              className="text-xl font-semibold text-blue-600 hover:text-blue-800"
            >
              {service.name}
            </button>
          </div>
        ))}
      </div>
    </section>

      {/* Call to Action */}
      <section className="bg-blue-600 text-white py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="mb-6">
          Hire a trusted professional or join us as a service provider today.
        </p>
        <div className="space-x-4">
          <button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-2 rounded-xl">
            Hire Now
          </button>
          <button className="bg-blue-800 hover:bg-blue-900 px-6 py-2 rounded-xl">
            Join as Provider
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <p>&copy; {new Date().getFullYear()} SewaMate. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
