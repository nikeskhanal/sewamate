import express from "express";
import userModel from "../model/userModel.js";
import { jwtAuth } from "../middleware/jwtAuth.js";
import { adminAuth } from "../middleware/adminAuth.js";
import upload from "../multer/multer.js";
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
  getApprovedWorkers,
  getNearbyApprovedWorkers,
  getMyProfile,
  updateProfilePhoto,
} from "../controllers/userController.js";


const router = express.Router();


router.post("/create", createUser);


router.post("/login", loginUser);


router.get("/searchworkers", getNearbyApprovedWorkers);

router.get("/admin",  getAllUsers); 


router.get("/me",  jwtAuth, getMyProfile);

router.put("/me/photo", jwtAuth, upload.single("photo"), updateProfilePhoto);

router.get("/workers", jwtAuth, getWorkers);

router.get("/hiredworkers", getApprovedWorkers)

router.post("/forgot-password", forgotPassword);


router.post("/verify-otp", verifyOtp);

router.put("/approve/:id", jwtAuth,  approveWorker); 

router.get("/:id", jwtAuth, getUserById); 


router.get("/verifyworker/:id", jwtAuth, verifyworker);


router.delete("/:id", jwtAuth, deleteUser); 

export default router;


