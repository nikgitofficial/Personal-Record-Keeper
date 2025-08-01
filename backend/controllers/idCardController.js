import IDCard from "../models/IDCard.js";

export const addCard = async (req, res) => {
  const { cardName, cardNumber, fullName, birthdate, address } = req.body;
  const userId = req.userId;

  if (!cardName || !cardNumber || !fullName || !birthdate || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newCard = await IDCard.create({
      userId,
      cardName,
      cardNumber,
      fullName,
      birthdate,
      address,
    });
    res.status(201).json(newCard);
  } catch (error) {
    res.status(500).json({ message: "Failed to add card", error: error.message });
  }
};


export const getCards = async (req, res) => {
  const userId = req.userId;

  try {
    const cards = await IDCard.find({ userId });
    res.status(200).json(cards);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve cards", error: error.message });
  }
};

export const deleteCard = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const card = await IDCard.findOneAndDelete({ _id: id, userId });
    if (!card) {
      return res.status(404).json({ message: "Card not found or unauthorized" });
    }
    res.status(200).json({ message: "Card deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete card", error: error.message });
  }
};

export const updateCard = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const { cardName, cardNumber, fullName, birthdate, address } = req.body;

  if (!cardName || !cardNumber || !fullName || !birthdate || !address) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const updatedCard = await IDCard.findOneAndUpdate(
      { _id: id, userId },
      { cardName, cardNumber, fullName, birthdate, address },
      { new: true } // return updated document
    );

    if (!updatedCard) {
      return res.status(404).json({ message: "Card not found or unauthorized" });
    }

    res.status(200).json(updatedCard);
  } catch (error) {
    res.status(500).json({ message: "Failed to update card", error: error.message });
  }
};
