// models/EmployeeFile.js
import mongoose from "mongoose";

const userFileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    originalname: String,
    filename: String,
    mimetype: String,
    size: Number,
    url: String,
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

const UserFile = mongoose.model("UserFile", userFileSchema);
export default UserFile;
