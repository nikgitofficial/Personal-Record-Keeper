import mongoose from "mongoose";

const userFileSchema = new mongoose.Schema({
  public_id: String,
  secure_url: String,
  originalname: String,
  mimetype: String,
  size: Number,
}, { timestamps: true });

export default mongoose.model("UserFile", userFileSchema);
