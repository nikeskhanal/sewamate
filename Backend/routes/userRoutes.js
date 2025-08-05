import express from "express";

import { jwtAuth } from "../middleware/jwtAuth.js";

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
  getEmployeeProfile,
  updateWorkerRate,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/create", upload.single("cv"), createUser);

router.post("/login", loginUser);

router.get("/searchworkers", getNearbyApprovedWorkers);

router.get("/admin", getAllUsers);

router.get("/me", jwtAuth, getMyProfile);

router.put("/me/photo", jwtAuth, upload.single("photo"), updateProfilePhoto);

router.get("/workers", jwtAuth, getWorkers);

router.get("/hiredworkers", getApprovedWorkers);

router.post("/forgot-password", forgotPassword);

router.post("/verify-otp", verifyOtp);

router.put("/approve/:id", jwtAuth, approveWorker);

router.get("/:id", jwtAuth, getUserById);

router.get("/verifyworker/:id", jwtAuth, verifyworker);

router.get("/worker/:id", getEmployeeProfile);

router.delete("/:id", jwtAuth, deleteUser);

router.put("/rate/:id", jwtAuth, updateWorkerRate);

export default router;
