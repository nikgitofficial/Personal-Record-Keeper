import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: String,
  fileName: String,
  description: String,
  publicId: String,
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model('File', fileSchema);
