import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/userModel.js"; 

export const createUser = async (req, res) => {
  try {
    const { password, ...otherFields } = req.body;
    
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ ...otherFields, password: hashedPassword });
    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user by ID
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete user by ID
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Find nearby workers by location
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

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found.");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user);

    // Compare entered password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password does not match.");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Password matched.");

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      "iamnikesh",  // Replace with your secret key in production
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
