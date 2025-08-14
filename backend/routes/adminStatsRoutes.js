import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import { getTotalFilesUploaded, getTotalPersonalDetails, getTotalUsers } from "../controllers/adminStatsController.js";

const router = express.Router();

// Admin-only stats
router.get("/user-count", authenticate, getTotalUsers);
router.get("/files-uploaded", authenticate, getTotalFilesUploaded);
router.get("/personal-details", authenticate, getTotalPersonalDetails);

export default router;
