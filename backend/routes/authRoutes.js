import express from "express";
import multer from "multer";
import {
  register,
  login,
  refresh,
  me,
  logout,
  updateUsername,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { uploadProfilePic } from "../controllers/profileController.js";

const router = express.Router();
const upload = multer(); // handles multipart/form-data

// ✅ Auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/refresh", refresh);
router.get("/me", authenticate, me);
router.post("/logout", logout);
router.patch("/update-username", authenticate, updateUsername);

// ✅ Profile pic upload (make it PUT to match frontend)
router.put("/profile-pic", authenticate, upload.single("file"), uploadProfilePic);

export default router;
