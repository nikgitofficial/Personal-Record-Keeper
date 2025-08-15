import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import { getDashboardStats, getTotalFiles, getTotalPersonalDetails, getAllFiles, getAllPersonalDetails } from "../controllers/adminController.js";
import adminOnly from "../middleware/adminMiddleware.js";
const router = express.Router();

// Combined dashboard stats
router.get("/dashboard-stats", authenticate, getDashboardStats);

// Individual stats (optional, can keep them)
router.get("/files-uploaded", authenticate, getTotalFiles);
router.get("/personal-details", authenticate, getTotalPersonalDetails);
router.get("/files-list", authenticate,getAllFiles);
router.get("/personal-details-list", authenticate, getAllPersonalDetails);

export default router;
