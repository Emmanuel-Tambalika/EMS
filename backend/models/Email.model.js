import mongoose from "mongoose";

const EmailSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userOwner",
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
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking"
  }
}, { timestamps: true });

export const Email = mongoose.model("Email", EmailSchema);


