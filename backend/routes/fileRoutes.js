import express from "express";
import  verifyToken  from "../middleware/verifyToken.js";
import {
  uploadFile,
  uploadMiddleware,
  getFiles,
  deleteFile,
} from "../controllers/fileController.js";

const router = express.Router();

router.post("/", verifyToken, uploadMiddleware, uploadFile);
router.get("/", verifyToken, getFiles);
router.delete("/:id", verifyToken, deleteFile);

export default router;
