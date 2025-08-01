import express from 'express';
import multer from 'multer';
import { uploadFile, getFiles, deleteFile } from '../controllers/fileController.js';
import { storage } from '../config/cloudinaryFile.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();
const upload = multer({ storage });

router.post('/upload', verifyToken, upload.single('file'), uploadFile);
router.get('/', verifyToken, getFiles);
router.delete('/:id', verifyToken, deleteFile);

export default router;
