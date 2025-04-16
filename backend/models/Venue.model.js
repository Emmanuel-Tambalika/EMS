import express from "express";
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
      

            isPaymentPending: {
		       	type: Boolean,
			      default: false,
		    },
   
        isBooked: {
			  type: Boolean,
			  default: false,
		},
 
// Must Add Booked Venue Payment Timer .

        userOwner: {type: mongoose.Schema.Types.ObjectId ,ref: "User"},

    },
    { timestamps: true }
);

export const Venue = mongoose.model("Venue", venueSchema);
