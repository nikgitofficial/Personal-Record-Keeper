import express from "express";
import multer from "multer";
import { uploadFile, getFiles } from "../controllers/fileController.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("file"), uploadFile);
router.get("/", getFiles);

export default router;
