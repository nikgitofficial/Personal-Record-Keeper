import mongoose from "mongoose";

const personalDetailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: { type: String, required: true },
  birthdate: { type: String, required: true },
  address: { type: String, required: true },
  age: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("PersonalDetail", personalDetailSchema);
