import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  role: {
    type: String,
    enum: ['customer', 'worker'],
    required: true
  },
  servicesOffered: [{
    type: String
  }],
  photo: {
    type: String, 
    default: ""  
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.index({ location: "2dsphere" });

export default mongoose.model("SewaMateUser", userSchema);
