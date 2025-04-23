import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true, 
		}, 
		password: { 
			type: String,
			required: true,
		},
		name: { 
			type: String,
			required: true,
		},
		 lastLogin: { 
			type: Date,
			default: Date.now,
		},
		
       // Booked Events .
       bookedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],

       // Booked Venue.
       bookedVenues: [{ type: mongoose.Schema.Types.ObjectId, ref: "Venue" }],

	    userOwner:{type: mongoose.Schema.Types.ObjectId ,ref: "User"},

	notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }]

	},
	{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);
