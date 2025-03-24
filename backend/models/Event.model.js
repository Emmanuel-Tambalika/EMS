import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true, 
        }, 

        description: {
            type: String,
            required: true,
          },
        Price: { 
            type: Number,
            required: true,
        },
       Venue: { 
            type: String,
            required: true,
        },

        //Show All Tickets Available On Event Creation Number Is Subject To change
      TotalTickets: {
            type: Number,
            required: true,
        },
        
        bookedTickets:{
           type:Number, 
        },

        SoldTickets:{
            type:Number, 
         },

        userOwner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },

    },
    // Must Add Booked Event Payment Timer .

    { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
