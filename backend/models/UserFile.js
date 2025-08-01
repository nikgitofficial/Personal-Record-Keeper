import mongoose from "mongoose";

const userFileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  filename: String,
  description: String,
  cloudinaryUrl: String,
  cloudinaryPublicId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("UserFile", userFileSchema);
