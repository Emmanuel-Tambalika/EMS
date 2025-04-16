// routes/bookings.js
import express from "express";
import { Booking } from "../models/Booking.model.js";
import { Event } from "../models/Event.model.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Create a booking
router.post("/", verifyToken, async (req, res) => {
  const userId = req.userId;
  const { event: eventId, ticketsCount, ticketAmount } = req.body;

  if (!eventId || !ticketsCount || !ticketAmount) {
    return res.status(400).json({ message: "Missing booking data" });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Optional: Check if enough tickets available (implement as needed)

    const booking = new Booking({
      user: userId,
      event: eventId,
      ticketsCount,
      ticketAmount,
      isPaymentPending: true,
      paymentTimeout: new Date(Date.now() + 2 * 60 * 1000), // 2 min from now
      isPaid: false,
    });

    await booking.save();

    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get bookings for logged-in user
router.get("/my", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate("event")
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Pay for a booking
router.post("/:bookingId/pay", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.isPaid) {
      return res.status(400).json({ message: "Booking already paid" });
    }

    booking.isPaid = true;
    booking.isPaymentPending = false;
    booking.paymentTimeout = null;
    await booking.save();

    res.status(200).json({ message: "Payment successful", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Background job to expire unpaid bookings after timeout
setInterval(async () => {
  try {
    const now = new Date();
    const expiredBookings = await Booking.find({
      isPaymentPending: true,
      paymentTimeout: { $lt: now },
    });

    for (const booking of expiredBookings) {
      booking.isPaymentPending = false;
      booking.isPaid = false;
      booking.paymentTimeout = null;
      await booking.save();
      // Optionally notify user or free tickets
    }
  } catch (err) {
    console.error("Error expiring bookings:", err);
  }
}, 10000);
// Delete a booking by ID (only by owner)
// Delete a booking by ID (only owner can delete)
router.delete("/:bookingId", verifyToken, async (req, res) => {
    try {
      const booking = await Booking.findById(req.params.bookingId);
      if (!booking) return res.status(404).json({ message: "Booking not found" });
  
      if (booking.user.toString() !== req.userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
  
      await booking.remove();
      res.status(200).json({ message: "Booking deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
export default router;
