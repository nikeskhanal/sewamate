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

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    console.log("Decoded token:", decoded);

    
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("Authenticated User:", user);

    
    if (!user.isAdmin) {
      return res.status(403).json({ error: "Access denied: Admins only" });
    }

    req.user = user; 
    next();
  } catch (error) {
    console.error("AdminAuth Middleware Error:", error);
    return res.status(401).json({ error: "Unauthorized: " + error.message });
  }
};
