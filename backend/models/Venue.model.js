import mongoose from "mongoose";

const venueSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 1 },
    capacity: { type: Number, required: true },
    city: { type: String },
    isPaymentPending: { type: Boolean, default: false },
    paymentTimeout: { type: Date },
    isBooked: { type: Boolean, default: false },
    bookedAt: { type: Date },
    venuePaidFor: { type: Boolean, default: false },
    paymentExpired: { type: Boolean, default: false },
    userOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

export const Venue = mongoose.model("Venue", venueSchema);





















/*import express from "express";
import mongoose from "mongoose";

const venueSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
           
        }, 

          description: {
            type: String,
            required: true,
          },
        price: { 
            type: Number,
            required: true,
            Min:1,
        },

       capacity: { 
            type:Number,
            required: true,
           
        },

         city: { 
            type:String,
          
        },
        isExpired: { type: Boolean, default: false }, // NEW FIELD
        isPaymentPending: { type: Boolean, default: false },

        paymentTimeout: {
            type: Date,
          },
      
          isBooked: {
			  type: Boolean,
			  default: false,
		},
    bookedAt: Date,  // New field for unbook timer
// Must Add Booked Venue Payment Timer .

        userOwner: {type: mongoose.Schema.Types.ObjectId ,ref: "User"},

    },
    { timestamps: true }
);

export const Venue = mongoose.model("Venue", venueSchema); */
