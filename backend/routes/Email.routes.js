import express from "express";
import { Email } from "../models/Email.model.js";
import { Booking } from "../models/Booking.model.js";
import { verifyToken } from "../middleware/verifyToken.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();
const router = express.Router();

// Enhanced email retrieval with pagination
router.get('/', verifyToken, async (req, res) => {
  try {
    const { limit = 20, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const [emails, total] = await Promise.all([
      Email.find({ recipient: req.userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('recipient', 'name email')
        .populate({
          path: 'booking',
          select: 'event',
          populate: {
            path: 'event',
            select: 'name'
          }
        }),
      Email.countDocuments({ recipient: req.userId })
    ]);

    res.json({
      success: true,
      data: emails.map(email => ({
        id: email._id,
        subject: email.subject || `Booking Update - ${email.type}`,
        message: email.message,
        read: email.read,
        createdAt: email.createdAt,
        bookingId: email.booking?._id,
        eventName: email.booking?.event?.name
      })),
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page
      }
    });
  } catch (err) {
    console.error('Email retrieval error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to retrieve emails',
      code: 'EMAIL_RETRIEVAL_FAILED'
    });
  }
});

// Secure email update with ownership check
router.patch('/:id/read', verifyToken, async (req, res) => {
  try {
    const email = await Email.findOneAndUpdate(
      { 
        _id: req.params.id,
        recipient: req.userId 
      },
      { $set: { read: true } },
      { 
        new: true,
        runValidators: true 
      }
    );

    if (!email) {
      return res.status(404).json({
        success: false,
        error: 'Email not found or unauthorized',
        code: 'EMAIL_NOT_FOUND'
      });
    }

    res.json({ 
      success: true,
      data: {
        id: email._id,
        read: email.read
      }
    });
  } catch (err) {
    console.error('Mark as read error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update email status',
      code: 'EMAIL_UPDATE_FAILED'
    });
  }
});

// Secure deletion with ownership verification
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const email = await Email.findOneAndDelete({
      _id: req.params.id,
      recipient: req.userId
    });

    if (!email) {
      return res.status(404).json({
        success: false,
        error: 'Email not found or unauthorized',
        code: 'EMAIL_NOT_FOUND'
      });
    }

    res.json({ 
      success: true,
      data: {
        id: email._id,
        deleted: true
      }
    });
  } catch (err) {
    console.error('Delete email error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete email',
      code: 'EMAIL_DELETION_FAILED'
    });
  }
});

export default router;


