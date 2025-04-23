
import express from "express";
import { Event } from "../models/Event.model.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();


// CREATE: Add a new event
router.post('/', async (req, res) => {
  try {
    const requiredFields = [
      'name', 'description', 'ordinary', 'vip', 'vippremium', 'date', 'venue', 'totalTickets'
    ];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { date } = req.query;
    let events;
    
    if (date) {
      // Parse input date (YYYY-MM-DD format expected)
      const targetDate = new Date(date);
      
      // Ensure valid date parsing
      if (isNaN(targetDate.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }
      
      // Match exact date (ignoring time)
      events = await Event.find({
        date: {
          $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
          $lte: new Date(targetDate.setHours(23, 59, 59, 999))
        }
      }).sort({ date: "asc" });
    } else {
      events = await Event.find().sort({ date: "asc" });
    }
    
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// READ: Get a single event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// UPDATE: Modify event
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE: Remove event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router;
