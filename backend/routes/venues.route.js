import express from "express";
import { Venue } from "../models/Venue.model.js";
import { User } from "../models/User.model.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.post('/', async (request, response) => {
  try {
    if (!request.body.name || !request.body.description || 
        !request.body.price || !request.body.city || !request.body.capacity) {
      return response.status(400).send({
        message: 'Send all required fields: name, description, price, city, capacity',
      });
    }

    const newVenue = {
      name: request.body.name,
      description: request.body.description,
      price: request.body.price,
      city: request.body.city,
      capacity: request.body.capacity,
    };

    const venue = await Venue.create(newVenue);
    return response.status(201).send(venue);
  } catch (error) {
    console.log(error.message);
    response.status(500).send({ message: error.message });
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

router.put('/:venueID', verifyToken, async (req, res) => {
  const { venueID } = req.params;
  const userID = req.userId;

  try {
    const venue = await Venue.findById(venueID);
    const user = await User.findById(userID);

    if (!venue || !user) {
      return res.status(404).json({ message: "Venue or user not found" });
    }

    if (venue.isBooked && !venue.paymentExpired) {
      return res.status(400).json({ message: "Venue is already booked" });
    }

    venue.isBooked = true;
    venue.isPaymentPending = true;
    venue.venuePaidFor = false;
    venue.paymentExpired = false;
    venue.paymentTimeout = new Date(Date.now() + 2 * 60 * 1000);
    venue.userOwner = user._id;
    venue.bookedAt = new Date();

    await venue.save();

    if (!user.bookedVenues.some(id => id.toString() === venue._id.toString())) {
      user.bookedVenues.push(venue._id);
      await user.save();
    }

    res.status(201).json({ bookedVenues: user.bookedVenues });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

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
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

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
    res.status(500).json({ message: "Verification failed", error: err });
  }
});

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
    res.status(500).json({ message: "Payment failed", error: err });
  }
});

router.delete("/:venueID", verifyToken, async (req, res) => {
  const { venueID } = req.params;
  const userID = req.userId;

  try {
    const venue = await Venue.findById(venueID);
    const user = await User.findById(userID);

    if (!venue || !user) {
      return res.status(404).json({ message: "Venue or user not found" });
    }

    venue.isBooked = false;
    venue.isPaymentPending = false;
    venue.paymentExpired = false;
    await venue.save();

    user.bookedVenues = user.bookedVenues.filter(id => id.toString() !== venue._id.toString());
    await user.save();

    res.status(200).json({ message: "Venue unbooked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

setInterval(async () => {
  try {
    const now = new Date();
    const expiredVenues = await Venue.find({
      $or: [
        { paymentTimeout: { $lt: now }, isPaymentPending: true },
        { bookedAt: { $lt: new Date(now - 5*60*1000) }, venuePaidFor: true }
      ]
    });

    for (const venue of expiredVenues) {
      if (venue.isPaymentPending) {
        venue.isBooked = false;
        venue.isPaymentPending = false;
        venue.paymentExpired = true;
        venue.userOwner = null;
      } else {
        venue.isBooked = false;
        venue.venuePaidFor = false;
        venue.userOwner = null;
      }
      
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
