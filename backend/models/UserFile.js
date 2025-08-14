// backend/models/UserFile.js
import mongoose from "mongoose";

const UserFileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  filename: { type: String, required: true },   // original filename
  url: { type: String, required: true },        // Cloudinary URL
  publicId: { type: String, required: true },   // Cloudinary public_id
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("UserFile", UserFileSchema);
