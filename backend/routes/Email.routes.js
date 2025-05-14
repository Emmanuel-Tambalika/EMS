// routes/emails.js

import express from "express";
import { Email } from "../models/Email.model.js";
import { verifyToken } from "../middleware/verifyToken.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.get('/my', verifyToken, async (req, res) => {
  try {
    const emails = await Email.find({ recipient: req.userId }).sort({ createdAt: -1 });
    res.json(emails);
  } catch (err) {
    console.error('Failed to fetch emails:', err);
    res.status(500).json({ message: 'Failed to fetch emails' });
  }
});
/**
 * PATCH /api/emails/:id/read
 * Mark an email as read if owned by the user
 */
router.patch('/:id/read', verifyToken, async (req, res) => {
  try {
    const email = await Email.findOneAndUpdate(
      { _id: req.params.id, recipient: req.userId },
      { $set: { read: true } },
      { new: true, runValidators: true }
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
      data: { id: email._id, read: email.read }
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

/**
 * DELETE /api/emails/:id
 * Delete an email if owned by the user
 */
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
      data: { id: email._id, deleted: true }
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



