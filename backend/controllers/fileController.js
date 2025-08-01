import File from '../models/File.js';
import { cloudinary } from '../config/cloudinaryFile.js';

export const uploadFile = async (req, res) => {
  try {
    const { description } = req.body;

    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const newFile = new File({
      userId: req.user.id,
      fileUrl: req.file.path,
      fileName: req.file.originalname,
      description,
      publicId: req.file.filename,
    });

    await newFile.save();
    res.status(201).json(newFile);
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error });
  }
};

export const getFiles = async (req, res) => {
  const files = await File.find({ userId: req.user.id });
  res.json(files);
};

export const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: 'File not found' });

    await cloudinary.uploader.destroy(file.publicId, {
      resource_type: 'raw', // or 'auto'
    });

    await File.findByIdAndDelete(req.params.id);
    res.json({ message: 'File deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', err });
  }
};
