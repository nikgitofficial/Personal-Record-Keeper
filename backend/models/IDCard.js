import mongoose from "mongoose";

const idCardSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cardName: { type: String, required: true },
    cardNumber: { type: String, required: true },
    fullName: { type: String, required: true },
    birthdate: { type: String, required: true }, // or Date if you prefer
    address: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("IDCard", idCardSchema);
