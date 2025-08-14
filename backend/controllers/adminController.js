import File from "../models/File.js";
import PersonalDetail from "../models/PersonalDetail.js";
import User from "../models/User.js";

// 📊 Dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalFiles = await File.countDocuments();
    const totalDetails = await PersonalDetail.countDocuments();

    res.json({ totalUsers, totalFiles, totalDetails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

// 👤 Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// 📁 Get all files
export const getAllFiles = async (req, res) => {
  try {
    const files = await File.find().populate("userId", "username email").sort({ createdAt: -1 });
    const filesWithUser = files.map(f => ({
      _id: f._id,
      filename: f.filename,
      url: f.url,
      uploadedBy: f.userId ? f.userId.username : "Unknown",
      createdAt: f.createdAt,
    }));
    res.json(filesWithUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch files" });
  }
};

// 📝 Get all personal details
export const getAllPersonalDetails = async (req, res) => {
  try {
    const details = await PersonalDetail.find().populate("userId", "username email").sort({ createdAt: -1 });
    const detailsWithUser = details.map(d => ({
      _id: d._id,
      fullName: d.fullName,
      birthdate: d.birthdate,
      address: d.address,
      email: d.email || "",
      phoneNumber: d.phoneNumber || "",
      user: d.userId ? d.userId.username : "Unknown",
      createdAt: d.createdAt,
    }));
    res.json(detailsWithUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch personal details" });
  }
};
