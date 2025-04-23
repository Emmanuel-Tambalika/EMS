import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  venue: { type: mongoose.Schema.Types.ObjectId, ref: "Venue", required: true },
  type: { 
    type: String, 
    enum: ['payment_success', 'payment_failed', 'expired'], 
    required: true 
  },
  message: { type: String, required: true },  
  read: { type: Boolean, default: false }
}, 

{ timestamps: true });

export const Notification = mongoose.model("Notification", notificationSchema);
