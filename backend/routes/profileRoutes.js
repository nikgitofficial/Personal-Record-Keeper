import express from "express";
import multer from "multer";
import verifyToken from "../middleware/verifyToken.js";
import { uploadProfilePic } from "../controllers/profilePicController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload-profile-pic", verifyToken, upload.single("file"), uploadProfilePic);

export default router;
