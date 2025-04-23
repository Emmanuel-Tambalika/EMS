// utils/email.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();


// Configure transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  const templates = {
    paymentSuccess: (user, booking) => ({
      subject: `Payment Confirmation - ${booking.event.name}`,
      text: `Hi ${user.name}, your payment of $${booking.price} was successful!`,
      html: `
        <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4CAF50;">Payment Successful!</h1>
          <p>Event: ${booking.event.name}</p>
          <p>Tickets: ${booking.quantity} × ${booking.ticketType}</p>
          <p>Amount: $${booking.price}</p>
        </div>
      `
    }),

    genericNotification: (data) => ({
        subject: "Notification Update",
        text: data.message,
        html: `
          <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Notification</h1>
            <p>${data.message}</p>
          </div>
        `
      }),
  
      newBookingAlert: (creator, booking, user) => ({
        subject: `New Booking - ${booking.event.name}`,
        text: `New booking from ${user.name}`,
        html: `
          <div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2196F3;">New Booking</h1>
            <p>Event: ${booking.event.name}</p>
            <p>Date: ${new Date(booking.event.date).toLocaleDateString()}</p>
            <p>Venue: ${booking.event.venue}</p>
            <h3>Attendee Details</h3>
            <ul>
              <li>Name: ${user.name}</li>
              <li>Email: ${user.email}</li>
              <li>Tickets: ${booking.quantity} × ${booking.ticketType}</li>
              <li>Amount: $${booking.price}</li>
            </ul>
          </div>
        `
      })
    };
  
  // Send email function
  export const sendEmail = async (recipient, templateName, data) => {
    try {
      // Pass data.user and data.booking directly
      const template = templates[templateName](data.user, data.booking);
  
      await transporter.sendMail({
        from: `Event Manager <${process.env.EMAIL_USER}>`,
        to: recipient.email,
        subject: template.subject,
        text: template.text,
        html: template.html
      });
  
      console.log(`Email sent to ${recipient.email}`);
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send email');
    }
  };
  