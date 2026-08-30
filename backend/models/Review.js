import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  worker: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: "", trim: true, maxlength: 1000 },
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);
