import express from "express";
import { Email } from "../models/Email.model.js";
import { sendEmail } from "../utils/email.js";
import { Booking } from "../models/Booking.model.js";

import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Send booking confirmation email
router.post("/booking-confirmation/:bookingId", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate("user", "name email")
      .populate({
        path: "event",
        populate: { path: "organizer", select: "name email" }
      });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Send customer email
    await sendEmail(
      { email: booking.user.email },
      "paymentSuccess",
      {
        user: booking.user,
        booking: {
          price: booking.ticketAmount,
          event: {
            name: booking.event.name,
            date: booking.event.date
          },
          quantity: booking.ticketsCount,
          ticketType: booking.ticketDetails?.type || "General"
        }
      }
    );

    // Send organizer email
    await sendEmail(
      { email: booking.event.userOwner.email },
      "newBookingAlert",
      {
        creator: booking.event.userOwner,
        booking: {
          event: {
            name: booking.event.name,
            date: booking.event.date
          },
          quantity: booking.ticketsCount,
          price: booking.ticketAmount,
          ticketType: booking.ticketDetails?.type || "General"
        },
        user: booking.user
      }
    );

    // Create notifications
    await Email.create([
      {
        recipient: booking.user._id,
        message: `Booking confirmed for ${booking.event.name}`,
        type: "payment"
      },
      {
        recipient: booking.event.organizer._id,
        message: `New booking from ${booking.user.name}`,
        type: "booking"
      }
    ]);

    res.json({ success: true });

  } catch (error) {
    console.error("Email notification error:", error);
    res.status(500).json({ 
      error: "Failed to send notifications",
      code: "EMAIL_NOTIFICATION_FAILED"
    });
  }
});

// Resend email notification
router.post("/resend/:notificationId", verifyToken, async (req, res) => {
  try {
    const notification = await Email.findById(req.params.notificationId)
      .populate("recipient", "email");

    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }

    // Implementation depends on your notification types
    // This is a generic example - you'll need to adjust
    const emailContent = {
      subject: "Reminder: " + notification.message,
      text: notification.message
    };

    await sendEmail(
      { email: notification.recipient.email },
      "genericNotification",
      { message: notification.message }
    );

    res.json({ success: true });

  } catch (error) {
    console.error("Resend error:", error);
    res.status(500).json({ error: "Failed to resend notification" });
  }
}); 


// GET /api/email-notifications/my
router.get('/my', verifyToken, async (req, res) => {
  try {
    const notifications = await Email.find({ recipient: req.userId })
      .sort({ createdAt: -1 });
      
    res.json({
      success: true,
      data: notifications.map(n => ({
        _id: n._id,
        subject: `Booking Notification - ${n.type}`,
        message: n.message,
        read: n.read,
        createdAt: n.createdAt
      }))
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// PATCH /api/emails/:id/read
router.patch('/:id/read', verifyToken, async (req, res) => {
  try {
    const email = await Email.findByIdAndUpdate(
      req.params.id,
      { $set: { read: true } },
      { new: true }
    );
    res.json({ success: true, data: email });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/emails/:id
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await Email.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


export default router;

