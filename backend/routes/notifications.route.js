import express from "express";
import { Venue } from "../models/Venue.model.js";
import { User } from "../models/User.model.js";
import { Notification } from "../models/Notification.js";
import nodemailer from "nodemailer";
import { verifyToken } from "../middleware/verifyToken.js";
import dotenv from "dotenv";

dotenv.config();

  const router = express.Router();

// Email Configuration with App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',   
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // MUST be app password if 2FA enabled
  }
});

// POST Notification
router.post('/', verifyToken, async (req, res) => {
  const { venueId, type, message } = req.body;

  try {
    // Validate input
    if (!venueId || !type || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const venue = await Venue.findById(venueId).populate('userOwner');
    const user = await User.findById(req.userId);

    if (!venue || !user) {
      return res.status(404).json({ message: "Venue or user not found" });
    }

    // Create notifications
    const usersToNotify = [user, venue.userOwner].filter(u => u);
    const notifications = [];

    for (const notifyUser of usersToNotify) {
      const notification = await Notification.create({
        user: notifyUser._id,
        venue: venue._id,
        type,
        message
      });
      
      notifications.push(notification);
      notifyUser.notifications.push(notification._id);
      await notifyUser.save();
    }

    // Send emails with silent error handling
    try {
      const mailOptions = {
        from: `"Event Management" <${process.env.EMAIL_USER}>`,
        to: usersToNotify.map(u => u.email).join(', '),
        subject: `Venue ${type.replace('_', ' ')}`,
        text: message,
        html: `<p>${message}</p>`
      };

      await transporter.sendMail(mailOptions)
        .catch(emailError => {
          console.warn('Email send warning (suppressed):', emailError.message); // Changed to console.warn
        });
    } catch (emailError) {
      console.warn('Email processing warning (suppressed):', emailError.message); // Changed to console.warn
      // Continue without failing the request
    }

    res.status(200).json({ notifications });

  } catch (err) {
    console.error('Notification error:', err);
    res.status(500).json({ 
      message: "Notification failed",
      error: err.message
    });
  }
});

// GET Notifications
router.get('/', verifyToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.userId })
      .populate('venue')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ 
      message: "Failed to fetch notifications",
      error: err.message
    });
  }
});

// Mark as Read
router.patch('/:id/read', verifyToken, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    console.error('Read error:', err);
    res.status(500).json({ 
      message: "Failed to mark as read",
      error: err.message
    });
  }
});

// Delete Notification
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.userId,
      { $pull: { notifications: req.params.id } }
    );
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted" });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ 
      message: "Delete failed",
      error: err.message
    });
  }
});

export default router;
  