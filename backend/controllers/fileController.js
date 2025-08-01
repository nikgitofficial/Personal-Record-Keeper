import multer from "multer";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";
import UserFile from "../models/UserFile.js";

// Multer setup (memory storage)
const upload = multer({ storage: multer.memoryStorage() });

export const uploadMiddleware = upload.single("file");

// Upload file
export const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const { description } = req.body;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "user_files" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const result = await streamUpload(file.buffer);

    const newFile = new UserFile({
      userId: req.user.id,
      filename: file.originalname,
      description,
      cloudinaryUrl: result.secure_url,
      cloudinaryPublicId: result.public_id,
    });

    await newFile.save();
    res.status(201).json(newFile);
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

// Get all files
export const getFiles = async (req, res) => {
  try {
    const files = await UserFile.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch files" });
  }
};

// Delete file
export const deleteFile = async (req, res) => {
  try {
    const file = await UserFile.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    await cloudinary.uploader.destroy(file.cloudinaryPublicId);
    await file.deleteOne();

    res.json({ message: "File deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};
