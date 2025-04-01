
// This file Saves  As our Support For MongoDb Local Instance .
// Must change this When We Are in Production Mode Mate 

import express from "express";
import mongoose from 'mongoose';
import cors from "cors";
import cookieParser from "cookie-parser";
import  path from "path";
import dotenv from "dotenv";

dotenv.config();
import authRoutes from "./routes/auth.route.js";
 import eventRoutes from "./routes/events.route.js";
 import venueRoutes from "./routes/venues.route.js"

const app = express();
const PORT = process.env.PORT || 5001;


app.use(cors({ origin: "http://localhost:5174", credentials: true }));
app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies


app.use("/api/Log-In", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/venues", venueRoutes);


const __dirname = path.resolve();

app.listen(PORT, () => {
	console.log("Server is running on port: ", PORT);
});


mongoose.connect('mongodb://localhost:27017/EMS_db');
const db = mongoose.connection;

db.on('error',(err)=>{
    console.error(err)
})
db.once('open', ()=> {
    console.log('Connected to MongoDb')
});

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}