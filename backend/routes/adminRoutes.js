import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import {
  getDashboardStats,
  getAllUsers,
  getAllFiles,
  getAllPersonalDetails,
} from "../controllers/adminController.js";

const router = express.Router();

// 📊 Dashboard stats
router.get("/dashboard-stats", authenticate);

// 👤 Admin tables
router.get("/all-users", authenticate, getAllUsers);
router.get("/all-files", authenticate, getAllFiles);
router.get("/all-personal-details", authenticate, getAllPersonalDetails);

export default router;
