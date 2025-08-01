import express from "express";
import multer from "multer";
import { uploadProfilePic } from "../controllers/profileController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/profile-pic/upload", verifyToken, upload.single("profilePic"), uploadProfilePic);

export default router;
