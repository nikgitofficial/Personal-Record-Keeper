// backend/controllers/personalDetailController.js
import PersonalDetail from "../models/PersonalDetail.js";

// Create new personal detail
export const createPersonalDetail = async (req, res) => {
  try {
    const { fullName, birthdate, address } = req.body;
    const userId = req.user.id;  // assuming user id is from authenticated token

    const newDetail = new PersonalDetail({ userId, fullName, birthdate, address });
    await newDetail.save();

    res.status(201).json(newDetail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while creating personal detail." });
  }
};

// Get all personal details for logged-in user
export const getPersonalDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const details = await PersonalDetail.find({ userId }).sort({ createdAt: -1 });
    res.json(details);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching personal details." });
  }
};

// Update personal detail by ID
export const updatePersonalDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, birthdate, address } = req.body;
    const userId = req.user.id;

    // Make sure the personal detail belongs to the user
    const detail = await PersonalDetail.findOne({ _id: id, userId });
    if (!detail) return res.status(404).json({ message: "Personal detail not found." });

    detail.fullName = fullName || detail.fullName;
    detail.birthdate = birthdate || detail.birthdate;
    detail.address = address || detail.address;

    await detail.save();
    res.json(detail);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while updating personal detail." });
  }
};

// Delete personal detail by ID
export const deletePersonalDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const detail = await PersonalDetail.findOneAndDelete({ _id: id, userId });
    if (!detail) return res.status(404).json({ message: "Personal detail not found." });

    res.json({ message: "Personal detail deleted." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while deleting personal detail." });
  }
};
