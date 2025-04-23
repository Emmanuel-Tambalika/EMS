// models/Booking.model.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  ticketsCount: { type: Number, required: true },
  ticketDetails: {
    ordinary: { type: Number, default: 0 },
    vip: { type: Number, default: 0 },
    premium: { type: Number, default: 0 }
  },
  ticketAmount: { type: Number, required: true },
  isPaymentPending: { type: Boolean, default: true },
  paymentIntentId: String,
  paymentDate: Date,
  paymentTimeout: { type: Date, default: () => new Date(Date.now() + 2 * 60 * 1000) }, // 2 min timeout
  isPaid: { type: Boolean, default: false },
}, { timestamps: true });

export const Booking = mongoose.model("Booking", bookingSchema);
 