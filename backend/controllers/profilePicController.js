import { put } from "@vercel/blob";
import User from "../models/User.js";

export const uploadProfilePic = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const blob = await put(`profile-pics/${req.user.id}-${Date.now()}`, file.buffer, {
      access: "public",
      contentType: file.mimetype,
      addRandomSuffix: true,
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePic: blob.url },
      { new: true }
    );

    res.status(200).json({ message: "Profile picture updated", profilePic: blob.url, user });
  } catch (err) {
    console.error("Upload failed:", err.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};
