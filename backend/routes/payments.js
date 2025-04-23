import express from "express";
import Stripe from "stripe";
import mongoose from "mongoose";
import { Venue } from "../models/Venue.model.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-payment-intent', async (req, res) => {
  // Enhanced validation
  if (!req.body || !req.body.venueId) {
    console.error('Missing venueId in request body');
    return res.status(400).json({ 
      error: 'Venue ID is required',
      details: 'Request body must contain {venueId: "valid_id"}' 
    });
  }

  const { venueId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(venueId)) {
    return res.status(400).json({ 
      error: 'Invalid Venue ID format',
      details: `Received: ${venueId} (expected 24-character hex string)`
    });
  }

  try {
    const venue = await Venue.findById(venueId);
    if (!venue) {
      console.error(`Venue ${venueId} not found in database`);
      return res.status(404).json({ 
        error: 'Venue not found',
        details: `No venue exists with ID: ${venueId}`
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(venue.price * 100),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { venueId: venue._id.toString() },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      venue: {
        _id: venue._id,
        name: venue.name,
        city: venue.city,
        capacity: venue.capacity,
        description: venue.description,
        price: venue.price
      }
    });

  } catch (err) {
    console.error('Stripe Error:', err.type, err.message);
    res.status(500).json({ 
      error: 'Payment processing failed',
      details: err.message 
    });
  }
});



export default router;
