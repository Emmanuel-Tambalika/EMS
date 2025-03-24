
import express from "express";
import mongoose from "mongoose";
import { Event } from "../models/Event.model.js";
import { User } from "../models/User.model.js";

const router = express.Router();


router.get("/", async (req, res) => {
    try {
      const result = await Event.find({});
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  // Create a new Event 
router.post("/",  async (req, res) => {
    const event = new Event({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      description: req.body. description,
      Price : req.body.Price,
      Venue: req.body.Venue,
      TotalTickets :req.bodyTotalTickets,
      userOwner: req.body.userOwner,
    });
    console.log(event);
  
    try {
      const result = await event.save();
      res.status(201).json({
        createdEvent: {
          name: result.name,
          _id: result._id,
        },
      });
    } catch (err) {
      // console.log(err);
      res.status(500).json(err);
    }
  });
  
  // Get an Event by ID
router.get("/:eventId", async (req, res) => {
  try {
    const result = await Event.findById(req.params.eventId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Save a Event
router.put("/", async (req, res) => {
  const event = await Event.findById(req.body.eventId);
  const user = await User.findById(req.body.userID);
  try {
    user.bookedEvents.push(event);
    await user.save();
    res.status(201).json({  bookedEvents: user. bookedEvents });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get id of saved/Booked Events .
router.get("/bookedEvents/ids/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.status(201).json({ bookedEvents: user?.bookedEvents });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get saved/Booked Events 
router.get("/bookedEvents/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const  bookedEvents = await Event.find({
      _id: { $in: user.bookedEvents },
    });

    console.log(bookedEvents);
    res.status(201).json({ bookedEvents });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export { router as eventsRouter };