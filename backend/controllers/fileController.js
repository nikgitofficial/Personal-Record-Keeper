import cloudinary from "cloudinary";
import streamifier from "streamifier";
import UserFile from "../models/UserFile.js";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.v2.uploader.upload_stream(
          {
            resource_type: "auto",
            folder: "user-files",
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req);

    const newFile = new UserFile({
      public_id: result.public_id,
      secure_url: result.secure_url,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    await newFile.save();
    res.status(201).json(newFile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFiles = async (req, res) => {
  try {
    const files = await UserFile.find().sort({ createdAt: -1 });
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
