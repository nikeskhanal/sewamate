import jwt from "jsonwebtoken";
import userModel from "../model/userModel.js";

export const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access denied: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, "iamnikesh");

    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure the user is an admin
    if (user.role !== "admin" || !user.isAdmin) {
      return res.status(403).json({ error: "Access denied: Admins only" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("AdminAuth Middleware Error:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token or something went wrong" });
  }
};