
import express from "express";
import mongoose from 'mongoose'; 
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

import authRoutes from "./routes/auth.route.js";
import eventRoutes from "./routes/events.route.js"; 
import venueRoutes from "./routes/venues.route.js";
import bookingsRouter from "./routes/bookings.js";
import paymentsRouter from './routes/payments.js';
import notificationsRouter from "./routes/notifications.route.js";
import emailRouter from "./routes/Email.routes.js"

  

const app = express();
const PORT = process.env.PORT || 5001;


// Middleware
app.use(cors({ 
  origin: "http://localhost:5174", 
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/Log-In", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/bookings", bookingsRouter);  
app.use("/api/payments", paymentsRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/emails",emailRouter);
 
// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    code: 'SERVER_ERROR' 
  });
});

// 404 Handler (Must be after all routes)
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    code: 'ENDPOINT_NOT_FOUND' 
  });
});

// Database Connection
const __dirname = path.resolve();
mongoose.connect('mongodb://localhost:27017/EMS_db');
const db = mongoose.connection;
 
db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

db.once('open', () => {
  console.log('Connected to MongoDB');   
});
  
// Production Configuration   
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
