import mongoose from "mongoose";

const personalDetailSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true },
    birthdate: { type: String, required: true }, // or Date if you prefer
    address: { type: String, required: true },
    phoneNumber: { type: String, required: false }, // optional extra field example
    email: { type: String, required: false },       // optional extra field example
  },
  { timestamps: true }
);

export default mongoose.model("PersonalDetail", personalDetailSchema);
