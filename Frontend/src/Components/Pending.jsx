import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Hourglass, Info, ArrowLeft, Mail, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const Pending = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "CV Submitted | Approval Pending";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 via-yellow-100 to-orange-50 px-4 py-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-yellow-200 opacity-30 blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-amber-200 opacity-30 blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-orange-200 opacity-20 blur-3xl"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative bg-white backdrop-blur-sm bg-opacity-80 shadow-xl rounded-3xl w-full max-w-lg overflow-hidden border border-white/30"
      >
        {/* Decorative header */}
        <div className="bg-gradient-to-r from-amber-400 to-yellow-500 h-3 w-full"></div>
        
        {/* Content */}
        <div className="p-8 md:p-10">
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "reverse"
              }}
              className="relative"
            >
              <div className="absolute inset-0 bg-yellow-100 rounded-full animate-ping opacity-30"></div>
              <Hourglass size={64} className="text-yellow-600 relative z-10" />
            </motion.div>
          </div>
          
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"
          >
            Your CV has been submitted!
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p className="text-lg text-gray-700 text-center mb-8 leading-relaxed">
              Your application is being reviewed by our team. We've sent your CV to the admin for approval. 
              Please visit the admin office to complete the approval process.
            </p>
            
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 mb-8 border border-amber-100 shadow-sm">
              <h3 className="font-semibold text-amber-800 flex items-center mb-3">
                <Info size={20} className="mr-2" />
                Next Steps
              </h3>
              
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-3 w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  </div>
                  <span className="text-gray-700">Visit the admin office with your documents</span>
                </li>
                
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-3 w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  </div>
                  <span className="text-gray-700">Complete the verification process</span>
                </li>
                
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-3 w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  </div>
                  <span className="text-gray-700">Your account will be activated within 24 hours after verification</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm mb-8">
              <h3 className="font-semibold text-gray-800 flex items-center mb-3">
                <Mail size={20} className="mr-2 text-indigo-600" />
                Contact Information
              </h3>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-indigo-50 rounded-xl p-4">
                <div>
                  <p className="text-sm text-gray-600">Admin Email</p>
                  <p className="font-medium text-indigo-700">sewamate@gmail.com</p>
                </div>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="mailto:sewamate@gmail.com" 
                  className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Send Email
                  <ChevronRight size={16} className="ml-1" />
                </motion.a>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-6"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/")}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium flex items-center justify-center hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-amber-300/40"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back to Home
            </motion.button>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-center text-sm text-gray-500 mt-6 flex items-center justify-center"
          >
            <Info size={14} className="mr-1.5 text-amber-500" />
            We appreciate your patience and cooperation!
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Pending;