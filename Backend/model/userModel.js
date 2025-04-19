import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
  contact: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
  },

  address: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  
  
  role: {
    type: String,
    enum: ["customer", "worker"],
    required: true,
  },
  servicesOffered: [
    {
      type: String,
    },
  ],
  photo: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  password: {
    type: String,
    required: true,
  },
  resetOTP: {
    type: String,
    default: null,
  },
  otpExpiry: {
    type: Date,
    default: null,
  }
});

userSchema.index({ location: "2dsphere" });

export default mongoose.model("SewaMateUser", userSchema);
