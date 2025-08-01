import PersonalDetail from "../models/PersonalDetail.js";

// CREATE
export const createPersonalDetail = async (req, res) => {
  try {
    const { fullName, birthdate, address } = req.body;
    const userId = req.userId;

    if (!fullName || !birthdate || !address || !userId) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const detail = await PersonalDetail.create({ userId, fullName, birthdate, address });
    res.status(201).json(detail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// READ ALL
export const getPersonalDetails = async (req, res) => {
  try {
    const details = await PersonalDetail.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updatePersonalDetail = async (req, res) => {
  try {
    const detail = await PersonalDetail.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(detail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
export const deletePersonalDetail = async (req, res) => {
  try {
    await PersonalDetail.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
