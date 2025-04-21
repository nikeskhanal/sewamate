import express from "express";
import userModel from "../model/userModel.js";
import { jwtAuth } from "../middleware/jwtAuth.js";
import { adminAuth } from "../middleware/adminAuth.js";
import {
  verifyworker,
  createUser,
  deleteUser,
  forgotPassword,
  getAllUsers,
  getUserById,
  loginUser,
  verifyOtp,
  approveWorker,
  getWorkers,
} from "../controllers/userController.js";


const router = express.Router();


router.post("/create", createUser);


router.post("/login", loginUser);


router.get("/admin", adminAuth, getAllUsers); 

router.put("/approve/:id", jwtAuth, adminAuth, approveWorker); 


router.get("/workers", jwtAuth, getWorkers);


router.post("/forgot-password", forgotPassword);


router.post("/verify-otp", verifyOtp);


router.get("/:id", jwtAuth, getUserById); 


router.get("/verifyworker/:id", jwtAuth, verifyworker);


router.delete("/:id", jwtAuth, adminAuth, deleteUser); 

export default router;


