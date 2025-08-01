import express from 'express';
import upload from '../middleware/cloudinaryStorage.js';
import { uploadProfilePic } from '../controllers/profilePicController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/upload-profile-pic', verifyToken, upload.single('profilePic'), uploadProfilePic);

export default router;
