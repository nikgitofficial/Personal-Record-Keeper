// backend/routes/authRoutes.js
import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import {
  register,
  login,
  refresh,
  me,
  logout,
  updateUsername,
  getAllUsers,
  getUserCount,
} from "../controllers/authController.js";
import {
  sendOTP,
  verifyOTPAndResetPassword,
} from "../controllers/forgotPasswordController.js";

const router = express.Router();

// ✅ Public auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/refresh", refresh);
router.post("/forgot-password", sendOTP);
router.post("/reset-password", verifyOTPAndResetPassword);

// ✅ Authenticated user routes
router.get("/me", authenticate, me);
router.post("/logout", authenticate, logout);
router.patch("/update-username", authenticate, updateUsername);

// ✅ Admin-only routes
router.get("/user-count", authenticate, getUserCount);
router.get("/all-users", authenticate, getAllUsers);

export default router;
