import cloudinary from "../utils/cloudinary.js";
import User from "../models/User.js";

// Profile picture upload controller
export const uploadProfilePic = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
      {
        folder: "profile-pics",
        resource_type: "image",
        public_id: req.user.id,
        overwrite: true,
      }
    );

    // Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicUrl: result.secure_url },
      { new: true }
    );

    res.status(200).json({ profilePicUrl: updatedUser.profilePicUrl });
  } catch (err) {
    console.error("Profile pic upload error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
