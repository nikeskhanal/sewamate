import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/userModel.js";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const createUser = async (req, res) => {
  try {
    const { password, ...otherFields } = req.body;

    if (
      !password ||
      !otherFields.email ||
      !otherFields.name ||
      !otherFields.contact
    ) {
      return res.status(400).json({ error: "Required fields are missing" });
    }

    const existingUser = await User.findOne({
      $or: [{ email: otherFields.email }, { contact: otherFields.contact }],
    });
    if (existingUser) {
      return res.status(409).json({ error: "Email or contact already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Add experience and cv if worker
    let userData = { ...otherFields, password: hashedPassword };
    if (otherFields.role === "worker") {
      let exp = req.body.experience;
      if (Array.isArray(exp)) exp = exp[0];
      userData.experience = Number(exp);
      if (req.file) userData.cv = req.file.filename;
    }
    const user = new User(userData);
    const savedUser = await user.save();

    const { password: _, ...userWithoutPassword } = savedUser._doc;
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const findNearbyWorkers = async (req, res) => {
  try {
    const { lat, lng, maxDistance = 5000 } = req.query;

    const workers = await User.find({
      role: "worker",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(maxDistance),
        },
      },
    });

    res.json(workers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Received email:", email);
    console.log("Received password:", password);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found.");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password does not match.");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Password matched.");

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      "iamnikesh", // Replace with your secret key in production
      { expiresIn: "1h" }
    );

    console.log("Token generated:", token);

    // Return token and user data (without password)
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        contact: user.contact,
        address: user.address,
        role: user.role,
        servicesOffered: user.servicesOffered,
        photo: user.photo,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Something went wrong during login." });
  }
};

export const verifyworker = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role !== "worker" || user.status !== "approved") {
      return res
        .status(403)
        .json({ message: "You are not an approved worker" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error in verifyworker:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const approveWorker = async (req, res) => {
  try {
    const worker = await User.findById(req.params.id);
    if (!worker || worker.role !== "worker") {
      return res
        .status(404)
        .json({ message: "Worker not found or invalid role" });
    }
    worker.status = "approved";
    await worker.save();

    res.status(200).json({
      message: "Worker approved successfully",
      worker,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getWorkers = async (req, res) => {
  try {
    const pendingWorkers = await User.find({
      role: "worker",
      status: "pending",
    });
    res.status(200).json(pendingWorkers);
  } catch (err) {
    console.error("Error fetching pending workers:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    user.resetOTP = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    console.log("OTP sent to email:", otp);
    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
export const verifyOtp = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ message: "Email, OTP, and new password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.resetOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOTP = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("verifyOtp error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getNearbyApprovedWorkers = async (req, res) => {
  try {
    const { service, lng, lat } = req.query;

    if (!service || !lng || !lat) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const workers = await User.find({
      role: "worker",
      status: "approved",
      servicesOffered: { $in: [service] },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: 100000,
        },
      },
    });

    res.status(200).json(workers);
  } catch (error) {
    console.error("Error fetching filtered workers:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getApprovedWorkers = async (req, res) => {
  try {
    const approvedWorkers = await User.find({
      role: "worker",
      status: "approved",
    });

    res.status(200).json(approvedWorkers);
  } catch (error) {
    console.error("Error fetching approved workers:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No photo uploaded" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const photo = req.file.filename;

    user.photo = photo;
    await user.save();

    res.status(200).json({ message: "Profile photo updated", photo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update photo" });
  }
};
export const getEmployeeProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "worker") {
      return res
        .status(403)
        .json({ message: "This user is not a service provider" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const updateWorkerRate = async (req, res) => {
  try {
    const worker = await User.findById(req.params.id);
    if (!worker || worker.role !== "worker") {
      return res.status(404).json({ message: "Worker not found" });
    }
    worker.ratePerHour = req.body.ratePerHour;
    await worker.save();
    res.status(200).json({ message: "Rate updated", worker });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
