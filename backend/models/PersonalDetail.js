// backend/models/PersonalDetail.js
import mongoose from "mongoose";

const PersonalDetailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: { type: String, required: true },
  birthdate: { type: Date, required: true },
  address: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("PersonalDetail", PersonalDetailSchema);
