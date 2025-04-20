import express from "express";
import { jwtAuth } from "../middleware/jwtAuth.js";
import { adminAuth } from "../middleware/adminAuth.js";
import {
  createUser,
  forgotPassword,
  getAllUsers,
  getUserById,
  loginUser,
  verifyOtp,
 
} from "../controllers/userController.js"




const router = express.Router();


router.post("/create", createUser);

router.post("/login",  loginUser );

router.get("/", adminAuth, getAllUsers);

router.get("/:id", getUserById);

router.post("/forgot-password", forgotPassword)

router.post("/verify-otp", verifyOtp)


export default router;
