import mongoose from "mongoose";
 
const eventSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,

        },  

           description: {
            type: String,
            required: true,
        },
         ordinary: {
            type: Number,
            required: true,
        },

        vip: {
            type: Number,
            required: true,
        },


        vippremium: {
            type: Number,
            required: true,
        },

        date: {
            type: Date,
            required: true,
        },
        venue: {
            type: String,
            required: true,  
        },

        //Show All Tickets Available On Event Creation Number Is Subject To change
        totalTickets: {
            type: Number,
            required: true,
        },

       
          isBooked: {
            type: Boolean,
            default: false,
      },

          userOwner: {
            type: mongoose.Schema.Types.ObjectId, ref: "User",
        },
       


    },
    // Must Add Booked Event Payment Timer .

    { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);
