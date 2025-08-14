import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import { getDashboardStats, getTotalFiles, getTotalPersonalDetails } from "../controllers/adminController.js";

const router = express.Router();

// Combined dashboard stats
router.get("/dashboard-stats", authenticate, getDashboardStats);

// Individual stats (optional, can keep them)
router.get("/files-uploaded", authenticate, getTotalFiles);
router.get("/personal-details", authenticate, getTotalPersonalDetails);

export default router;
