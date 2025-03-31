

  import { Event } from "../models/Event.model.js"; 
 import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
 


 export const signup2  = async (req, res) => {
	const { name, description,  price , venue ,totalTickets} = req.body;


	      try {    
		if ( !name || !description || !price || !venue || !totalTickets) {
			throw new Error("All fields are required");
		}


		const event = new Event({
			name,
			description,
			price,
            venue,
			totalTickets
		});

		await event.save();

			
		res.status(201).json({
			success: true,
			message: " Event created successfully",
			event: {
			...event._doc
				
			},
		});

	} 
	
	catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
 };