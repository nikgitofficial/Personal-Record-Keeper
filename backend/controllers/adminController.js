import File from "../models/File.js";
import PersonalDetail from "../models/PersonalDetail.js";
import User from "../models/User.js";

// Dashboard stats
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

// Optional individual stats
export const getTotalFiles = async (req, res) => {
  try {
    const totalFiles = await File.countDocuments();
    res.json({ totalFiles });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch total files" });
  }
};

export const getTotalPersonalDetails = async (req, res) => {
  try {
    const totalDetails = await PersonalDetail.countDocuments();
    res.json({ totalDetails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch total personal details" });
  }
};


// Get all files
export const getAllFiles = async (req, res) => {
  try {
    const files = await File.find().sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch files" });
  }
};

// Get all personal details
export const getAllPersonalDetails = async (req, res) => {
  try {
    const details = await PersonalDetail.find().sort({ createdAt: -1 });
    res.json(details);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch personal details" });
  }
};
