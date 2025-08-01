import express from "express";
import multer from "multer";
import { uploadProfilePic } from "../controllers/profilePicController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload-profile-pic", verifyToken, upload.single("image"), uploadProfilePic);

export default router;
