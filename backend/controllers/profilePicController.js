import { put } from "@vercel/blob";
import User from "../models/User.js";

export const uploadProfilePic = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    // Upload to Vercel Blob
    const blob = await put(`profile-pics/${req.userId}-${Date.now()}`, file.buffer, {
      access: "public",
      contentType: file.mimetype,
    });

    // Save to user in DB
    const user = await User.findByIdAndUpdate(
      req.userId,
      { profilePic: blob.url },
      { new: true }
    );

    res.status(200).json({ message: "Profile picture uploaded", profilePic: blob.url });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Failed to upload profile picture" });
  }
};
