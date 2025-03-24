
import express from "express";
import mongoose from "mongoose";
import { Venue } from "../models/Venue.model.js";
import { User } from "../models/User.model.js";

const router = express.Router();


router.get("/", async (req, res) => {
    try {
      const result = await Venue.find({});
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  // Create a new Venue 
router.post("/",  async (req, res) => {
    const venue = new Venue({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      description: req.body. description,
      Price : req.body.Price,
      Capacity:req.body.Capacity,
      Venue: req.body.Venue,
      userOwner: req.body.userOwner,
    });
    console.log(venue);
  
    try {
      const result = await venue.save();
      res.status(201).json({
        createdVenue: {
          name: result.name,
          _id: result._id,
        },
      });
    } catch (err) {
      // console.log(err);
      res.status(500).json(err);
    }
  });
  
  // Get an Venue by ID
router.get("/:venueId", async (req, res) => {
  try {
    const result = await Venue.findById(req.params.venueId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Save a Venue
router.put("/", async (req, res) => {
  const venue = await Venue.findById(req.body.venueId);
  const user = await User.findById(req.body.userID);
  try {
    user.bookedVenues.push(venue);
    await user.save();
    res.status(201).json({  bookedVenues: user. bookedVenues });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get id of saved/Booked Events .
router.get("/bookedVenues/ids/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.status(201).json({ bookedVenues: user?.bookedVenues });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get saved/Booked Venues 
router.get("/bookedVenues/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const  bookedVenues = await Venue.find({
      _id: { $in: user.bookedVenues},
    });

    console.log(bookedVenues);
    res.status(201).json({bookedVenues});
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export { router as  venuesRouter };