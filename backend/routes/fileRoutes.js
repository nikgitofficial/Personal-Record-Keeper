import express from 'express';
import {
  uploadFile,
  getUserFiles,
  deleteFile,
  updateFileName,
  getFileById,
  downloadFile
  
} from '../controllers/fileController.js';
import authenticate from "../middleware/authMiddleware.js";
import { upload } from '../middleware/upload.js';

const router = express.Router();

// ✅ Upload file
router.post('/upload', authenticate, upload.single('file'), uploadFile);

// ✅ Download file — must be BEFORE '/:id'
router.get('/download/:id',authenticate, downloadFile); // ← Optional: remove verifyToken for public download

// ✅ List user's files
router.get('/', authenticate, getUserFiles);

// ✅ Get file by ID (for preview)
router.get('/:id', authenticate, getFileById);

// ✅ Delete file
router.delete('/:id', authenticate, deleteFile);

// ✅ Update filename
router.put('/:id', authenticate, updateFileName);


export default router;