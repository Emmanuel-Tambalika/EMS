import mongoose from "mongoose";

const venueSchema = new mongoose.Schema(
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

       capacity: { 
            type:Number,
            required: true,
            Min:5,
        },
      
        isAvailable: {
			type: Boolean,
			default: true,
		},

        ispaymentPending: {
			type: Boolean,
			default: false,
		},

        isBooked: {
			type: Boolean,
			 default: false,
		},
 
// Must Add Booked Venue Payment Timer .

        userOwner: {type: mongoose.Schema.Types.ObjectId,ref: "User",
          },

    },
    { timestamps: true }
);

export const Venue = mongoose.model("Venue", venueSchema);
