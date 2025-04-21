import React from "react";
import { Hourglass, Info } from "lucide-react";

const Pending = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-yellow-400 to-yellow-600 px-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <Hourglass size={48} className="text-yellow-600" />
        </div>
        <h2 className="text-3xl font-bold text-indigo-600 mb-4">
          Your approval is pending
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Please visit the admin office to get approved. Your account will be activated once approved.
        </p>
        <div className="flex justify-center">
          <Info size={24} className="text-indigo-600 mr-2" />
          <p className="text-sm text-gray-500">We appreciate your cooperation!</p>
        </div>
      </div>
    </div>
  );
};

export default Pending;
