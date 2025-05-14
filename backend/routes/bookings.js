import express from "express";
import Stripe from "stripe";
import { User } from "../models/User.model.js";
import { sendEmail } from "../utils/email.js";
import { Email } from "../models/Email.model.js";
import { Booking } from "../models/Booking.model.js";
import { Event } from "../models/Event.model.js";
import { verifyToken } from "../middleware/verifyToken.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a booking
router.post("/", verifyToken, async (req, res) => {
  const userId = req.userId;
  const { event: eventId, ticketsCount, ticketAmount, ticketDetails } = req.body;

  if (!eventId || !ticketsCount || !ticketAmount || !ticketDetails) {
    return res.status(400).json({ message: "Missing booking data" });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.totalTickets < ticketsCount) {
      return res.status(400).json({ message: "Not enough tickets available" });
    }

    const booking = new Booking({
      user: userId,
      event: eventId,
      ticketsCount,
      ticketAmount,
      ticketDetails,
      isPaymentPending: true,
      paymentTimeout: new Date(Date.now() + 2 * 60 * 1000),
      isPaid: false,
    });

    await Event.findByIdAndUpdate(
      eventId,
      { $inc: { totalTickets: -ticketsCount } },
      { new: true }
    );

    await booking.save();
    const populatedBooking = await Booking.findById(booking._id).populate('event');
    res.status(201).json(populatedBooking);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get bookings for logged-in user
router.get("/my", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate({
        path: "event",
        select: "name venue date"
      })
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete booking endpoint
router.delete("/:bookingId", verifyToken, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.bookingId)) {
      return res.status(400).json({ message: "Invalid booking ID format" });
    }

    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.user.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
 
    if (booking.isPaid) {
      await Booking.deleteOne({ _id: booking._id });
      return res.status(200).json({ message: "Paid booking deleted" });
    }

    if (booking.isPaymentPending && booking.paymentTimeout > new Date()) {
      return res.status(400).json({ 
        message: "Cannot delete active pending booking" 
      });
    }

    await Booking.deleteOne({ _id: booking._id });
    res.status(200).json({ message: "Booking deleted successfully" });

  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ 
      message: "Failed to delete booking",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Background ticket expiration job
setInterval(async () => {
  try {
    const now = new Date();
    const expiredBookings = await Booking.find({
      isPaymentPending: true,
      paymentTimeout: { $lt: now },
    });

    for (const booking of expiredBookings) {
      if (booking.isPaymentPending && !booking.isPaid) {
        await Event.findByIdAndUpdate(
          booking.event,
          { $inc: { totalTickets: booking.ticketsCount } },
          { new: true }
        );  

        booking.isPaymentPending = false;
        booking.paymentTimeout = null;
        await booking.save();
      }
    }
  } catch (err) {
    console.error("Error expiring bookings:", err);
  }
}, 5000);

// Payment intent creation
router.post("/:id/create-payment-intent", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!booking) {
      return res.status(404).json({ 
        error: "Booking not found",
        code: "BOOKING_NOT_FOUND" 
      });
    }

    const amount = Math.round(booking.ticketAmount * 100);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      metadata: { 
        bookingId: booking._id.toString(),
        userId: req.userId.toString()
      },
      automatic_payment_methods: { enabled: true }
    });

    booking.paymentIntentId = paymentIntent.id;
    await booking.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    });

  } catch (err) {
    console.error("Payment intent error:", err);
    res.status(500).json({ 
      error: "Payment system error",
      code: "PAYMENT_SYSTEM_ERROR" 
    });
  }
});

// Payment confirmation endpoint
router.post("/:id/pay", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.userId
    }).populate("event user");

    if (!booking) {
      return res.status(404).json({ 
        error: "Booking not found",
        code: "BOOKING_NOT_FOUND" 
      });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(
      booking.paymentIntentId
    );

    if (paymentIntent.status !== "succeeded") {
      return res.status(402).json({ 
        error: "Payment not completed",
        code: "PAYMENT_INCOMPLETE" 
      });
    }

    // Update booking status
    booking.isPaid = true;
    booking.isPaymentPending = false;
    booking.paymentDate = new Date();
    await booking.save();

  // Update soldTickets count on event
    const event = await Event.findById(booking.event._id);

    if (!event.soldTickets) event.soldTickets = 0;
    event.soldTickets += booking.ticketsCount;
    await event.save();



    // Send confirmation email
   
    // 1. Send emails
    try {
      // Attendee email
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

      

    
    } catch (emailError) {
      console.error('Email error:', emailError);
    }

    // 2. Create database notifications
    try {
      // Attendee notification
      await Email.create({
        recipient: booking.user,
        message: `Payment confirmed for ${booking.event.name}`,
        type: "payment" 
      });

      
    } catch (notificationError) {
      console.error('Notification error:', notificationError);
    }

    res.json({ success: true });

  } catch (error) {
    console.error("Payment confirmation error:", error);
    res.status(500).json({ 
      error: "Payment confirmation failed",
      code: "PAYMENT_CONFIRMATION_ERROR" 
    });
  }   
} );   


// GET /emails/my - get all emails/notifications for logged-in user
router.get("/emails/my", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    // Find emails where recipient is the logged-in user
    const emails = await Email.find({ recipient: userId })
      .sort({ createdAt: -1 }); // newest first

    // Format emails for frontend
    const formattedEmails = emails.map(email => ({
      id: email._id,
      type: email.type,
      message: email.message,
      createdAt: email.createdAt.toISOString()
    }));

    res.status(200).json({ emails: formattedEmails });
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).json({ message: "Failed to fetch emails" });
  }
});
export default router;


