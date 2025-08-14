import User from "../models/User.js";
import UserFile from "../models/UserFile.js";
import PersonalDetail from "../models/PersonalDetail.js";

// Total Users
export const getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.json({ totalUsers });
  } catch (err) {
    console.error("Error fetching total users:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Total files uploaded
export const getTotalFilesUploaded = async (req, res) => {
  try {
    const totalFiles = await UserFile.countDocuments();
    res.json({ totalFiles });
  } catch (err) {
    console.error("Error fetching files:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Total personal details
export const getTotalPersonalDetails = async (req, res) => {
  try {
    const totalDetails = await PersonalDetail.countDocuments();
    res.json({ totalDetails });
  } catch (err) {
    console.error("Error fetching personal details:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
