import mongoose from "mongoose";

const EmailSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  message: {
    type: String, 
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ["payment", "booking", "system"],
    default: "payment"
  }
}, { timestamps: true });

export const Email = mongoose.model("Email", EmailSchema);

