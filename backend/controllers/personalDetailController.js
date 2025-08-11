import PersonalDetail from "../models/PersonalDetail.js";

export const addPersonalDetail = async (req, res) => {
  const { fullName, birthdate, address, phoneNumber, email } = req.body;
  const userId = req.userId;

  if (!fullName || !birthdate || !address) {
    return res.status(400).json({ message: "Full name, birthdate, and address are required" });
  }

  try {
    const newDetail = await PersonalDetail.create({
      userId,
      fullName,
      birthdate,
      address,
      phoneNumber,
      email,
    });
    res.status(201).json(newDetail);
  } catch (error) {
    res.status(500).json({ message: "Failed to add personal detail", error: error.message });
  }
};

export const getPersonalDetails = async (req, res) => {
  const userId = req.userId;

  try {
    const details = await PersonalDetail.find({ userId });
    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve personal details", error: error.message });
  }
};

export const deletePersonalDetail = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const detail = await PersonalDetail.findOneAndDelete({ _id: id, userId });
    if (!detail) {
      return res.status(404).json({ message: "Personal detail not found or unauthorized" });
    }
    res.status(200).json({ message: "Personal detail deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete personal detail", error: error.message });
  }
};

export const updatePersonalDetail = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const { fullName, birthdate, address, phoneNumber, email } = req.body;

  if (!fullName || !birthdate || !address) {
    return res.status(400).json({ message: "Full name, birthdate, and address are required" });
  }

  try {
    const updatedDetail = await PersonalDetail.findOneAndUpdate(
      { _id: id, userId },
      { fullName, birthdate, address, phoneNumber, email },
      { new: true }
    );

    if (!updatedDetail) {
      return res.status(404).json({ message: "Personal detail not found or unauthorized" });
    }

    res.status(200).json(updatedDetail);
  } catch (error) {
    res.status(500).json({ message: "Failed to update personal detail", error: error.message });
  }
};
