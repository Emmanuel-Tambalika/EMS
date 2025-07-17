 import express from "express";
import { Venue } from "../models/Venue.model.js";
import { User } from "../models/User.model.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, description, price, city, capacity } = req.body;
    if (!name || !description || !price || !city || !capacity) {
      return res.status(400).send({
        message: 'Send all required fields: name, description, price, city, capacity',
      });
    }

    const newVenue = {
      name,
      description,
      price,
      city,
      capacity,
      bookedDates: [] // initialize bookedDates array
    };

    const venue = await Venue.create(newVenue);
    return res.status(201).send(venue);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const venues = await Venue.find({});
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Booking route: book venue for a specific date
router.put("/:venueID/book", verifyToken, async (req, res) => {
  const { venueID } = req.params;
  const userID = req.userId;
  let { date } = req.body; // expect date string in YYYY-MM-DD format

  if (!date) {
    return res.status(400).json({ message: "Booking date is required" });
  }

  // Normalize date string to YYYY-MM-DD (remove time if present)
  date = date.split('T')[0];

  try {
    const venue = await Venue.findById(venueID);
    const user = await User.findById(userID);

    if (!venue || !user) {
      return res.status(404).json({ message: "Venue or user not found" });
    }

    // Check if date is already booked
    if (venue.bookedDates && venue.bookedDates.includes(date)) {
      return res.status(400).json({ message: "Venue already booked for this date" });
    }

    // Add date to bookedDates array as string (no Date object)
    venue.bookedDates.push(date);

    // Mark venue as booked and payment pending for this booking
    venue.isBooked = true;
    venue.isPaymentPending = true;
    venue.venuePaidFor = false;
    venue.paymentExpired = false;
    venue.paymentTimeout = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes payment timeout
    venue.userOwner = user._id;
    venue.bookedAt = new Date();

    await venue.save();

    // Add venue to user's bookedVenues if not already there
    if (!user.bookedVenues.some(id => id.toString() === venue._id.toString())) {
      user.bookedVenues.push(venue._id);
      await user.save();
    }

    res.status(201).json({ message: "Venue booked successfully", bookedVenues: user.bookedVenues });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// Update venue details route
router.put("/:venueID", verifyToken, async (req, res) => {
  const { venueID } = req.params;
  const { name, description, price, city, capacity } = req.body;

  if (!name || !description || price === undefined || price === null || !city || capacity === undefined || capacity === null) {
    return res.status(400).json({
      message: "Missing required fields: name, description, price, city, capacity",
    });
  }

  try {
    const updatedVenue = await Venue.findByIdAndUpdate(
      venueID,
      {
        name: name.trim(),
        description: description.trim(),
        price,
        city: city.trim(),
        capacity,
      },
      { new: true, runValidators: true }
    );

    if (!updatedVenue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    res.status(200).json(updatedVenue);
  } catch (error) {
    console.error("Error updating venue:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// Get booked venues for user
router.get("/booked", verifyToken, async (req, res) => {
  try {
    const userID = req.userId;
    const user = await User.findById(userID).populate("bookedVenues");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.bookedVenues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// Verify payment status for a venue
router.get('/:venueID/verify-payment', verifyToken, async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.venueID);
    if (!venue) return res.status(404).json({ message: "Venue not found" });

    res.json({
      isBooked: venue.isBooked,
      isPaymentPending: venue.isPaymentPending,
      venuePaidFor: venue.venuePaidFor
    });
  } catch (err) {
    res.status(500).json({ message: "Verification failed", error: err.message });
  }
});

// Mark payment as successful
router.post('/:venueID/pay', verifyToken, async (req, res) => {
  const { venueID } = req.params;

  try {
    const venue = await Venue.findById(venueID);
    if (!venue) return res.status(404).json({ message: "Venue not found" });
    if (!venue.isPaymentPending) return res.status(400).json({ message: "No pending payment" });

    venue.isPaymentPending = false;
    venue.venuePaidFor = true;
    venue.paymentExpired = false;
    venue.paymentTimeout = null;
    venue.bookedAt = new Date();

    await venue.save();

    res.status(200).json({ message: "Payment successful", venue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment failed", error: err.message });
  }
});

// Delete venue route
router.delete("/:venueID", verifyToken, async (req, res) => {
  const { venueID } = req.params;

  try {
    const venue = await Venue.findById(venueID);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    await Venue.findByIdAndDelete(venueID);

    await User.updateMany(
      { bookedVenues: venueID },
      { $pull: { bookedVenues: venueID } }
    );

    res.status(200).json({ message: "Venue deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

// Periodic cleanup: expire unpaid bookings and clear old paid bookings after 5 minutes
setInterval(async () => {
  try {
    const now = new Date();

    // Expire unpaid bookings past paymentTimeout
    const expiredUnpaidVenues = await Venue.find({
      isPaymentPending: true,
      paymentTimeout: { $lt: now }
    });

    for (const venue of expiredUnpaidVenues) {
      venue.isBooked = false;
      venue.isPaymentPending = false;
      venue.paymentExpired = true;
      venue.userOwner = null;
      venue.paymentTimeout = null;
      venue.bookedDates = []; // clear all booked dates on expiration
      await venue.save();

      await User.updateMany(
        { bookedVenues: venue._id },
        { $pull: { bookedVenues: venue._id } }
      );
    }

    // Clear paid bookings older than 5 minutes (release venue)
    const expiredPaidVenues = await Venue.find({
      venuePaidFor: true,
      bookedAt: { $lt: new Date(now.getTime() - 5 * 60 * 1000) }
    });

    for (const venue of expiredPaidVenues) {
      venue.isBooked = false;
      venue.venuePaidFor = false;
      venue.userOwner = null;
      venue.bookedDates = []; // clear all booked dates on release
      await venue.save();

      await User.updateMany(
        { bookedVenues: venue._id },
        { $pull: { bookedVenues: venue._id } }
      );
    }
  } catch (err) {
    console.error("Error processing expired bookings:", err);
  }
}, 10000);

export default router;
