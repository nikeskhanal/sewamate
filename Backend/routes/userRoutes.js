import express from "express";
import { jwtAuth } from "../middleware/jwtAuth.js";
import { adminAuth } from "../middleware/adminAuth.js";
import {
  createUser,
  getAllUsers,
  getUserById,
  loginUser
} from "../controllers/userController.js"




const router = express.Router();


router.post("/create", createUser);

router.post("/login",  loginUser );

router.get("/", adminAuth, getAllUsers);

router.get("/:id", getUserById);

export default router;
