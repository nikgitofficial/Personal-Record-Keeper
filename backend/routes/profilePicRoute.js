// backend/routes/profilePicRoute.js
import express from 'express';
import multer from 'multer';
import { uploadProfilePic } from '../controllers/profilePicController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', verifyToken, upload.single('image'), uploadProfilePic);

export default router;
