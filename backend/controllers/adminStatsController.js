import UserFile from "../models/UserFile.js";
import PersonalDetail from "../models/PersonalDetail.js";

export const getTotalFilesUploaded = async (req, res) => {
  try {
    const totalFiles = await UserFile.countDocuments();
    res.json({ totalFiles });
  } catch (err) {
    console.error("Error fetching total files:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getTotalPersonalDetails = async (req, res) => {
  try {
    const totalDetails = await PersonalDetail.countDocuments();
    res.json({ totalDetails });
  } catch (err) {
    console.error("Error fetching personal details:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
