import { put } from "@vercel/blob";
import User from "../models/User.js";

export const uploadProfilePic = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const blob = await put(`profile-pics/${req.user.id}`, file.buffer, {
      access: "public",
      contentType: file.mimetype,
      allowOverwrite: true,
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePic: blob.url },
      { new: true }
    );

    res.status(200).json({ message: "Profile picture uploaded", url: blob.url });
  } catch (err) {
    console.error("Profile picture upload error:", err.message);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};
