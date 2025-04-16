import express from "express";
import { Venue } from "../models/Venue.model.js";
import { User } from "../models/User.model.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

  
 
     // Route to Save A new  Venue 
router.post( '/' , async (request,response) =>  {
  try {
       if(
         //Must Add City and Use that To Filter the Venues .
        !request.body.name||
        !request.body.description||
        !request.body.price||
        !request.body.city||
        !request.body.capacity
        
        )
       {
        return response.status(400).send({message:'Send all required fields:name ,description ,and Others' ,});
    
    }

     const newVenue = {
               name:request.body.name, 
               description:request.body.description,
               price:request.body.price, 
               city:request.body.city, 
               capacity:request.body.capacity, 
              

     }; 
 
     const venue = await Venue.create(newVenue);
     return response.status(201).send(venue);
  } 
  
  catch (error) {
    console.log(error.message);
    response.status(500).send ({message:error.message});
  }
});


// venues = await Venue.find({isBooked:false});  -----> Remove all Booled In the All Venues Section .
// Route to get all Venues , Must Filter By City ,  Price and Capacity
router.get("/", async (req, res) => {
  try {
  
      let venues;
      venues = await Venue.find({});
      
      res.status(200).json(venues);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});



//Save/Book Venue    Route .
//Use authentication middleware to get user ID
// Book a venue - avoid duplicates, reset expired flag
router.put('/:venueID', verifyToken, async (req, res) => {
  const { venueID } = req.params;
  const userID = req.userId;

  try {
    const venue = await Venue.findById(venueID);
    const user = await User.findById(userID);

    if (!venue || !user) {
      return res.status(404).json({ message: "Venue or user not found" });
    }

    if (venue.isBooked && !venue.isExpired) {
      return res.status(400).json({ message: "Venue is already booked and active" });
    }

    // Book venue
    venue.isBooked = true;
    venue.isPaymentPending = true;
    venue.isExpired = false; // reset expired flag on new booking
    venue.paymentTimeout = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now
    venue.userOwner = user._id;

    await venue.save();

    // Add venue to user's bookedVenues if not already present
    if (!user.bookedVenues.some(id => id.toString() === venue._id.toString())) {
      user.bookedVenues.push(venue._id);
      await user.save();
    }

    res.status(201).json({ bookedVenues: user.bookedVenues });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});


  router.get("/booked", verifyToken, async (req, res) => {
  try {
    const userID = req.userId;
    const user = await User.findById(userID).populate("bookedVenues");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const bookedVenues = user.bookedVenues;
    res.status(200).json(bookedVenues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

// Background task to mark expired bookings but keep them in user's bookedVenues
// Background task to clear expired bookings every 10 seconds
setInterval(async () => {
  try {
    const now = new Date();
    // Find venues where paymentTimeout passed and payment is still pending
    const expiredVenues = await Venue.find({ paymentTimeout: { $lt: now }, isPaymentPending: true });

    for (const venue of expiredVenues) {
      // Reset venue booking/payment status
      venue.isBooked = false;
      venue.isPaymentPending = false;
      venue.paymentTimeout = null;
      venue.userOwner = null;

      // Remove venue from user's bookedVenues array
      const user = await User.findById(venue.userOwner);
      if (user) {
        user.bookedVenues = user.bookedVenues.filter(id => id.toString() !== venue._id.toString());
        await user.save();
      }

      await venue.save();
    }
  } catch (err) {
    console.error("Error processing expired bookings:", err);
  }
}, 10000);


//UnBook A Venue
router.delete("/:venueID", verifyToken, async (req, res) => {
  const { venueID } = req.params;
  const userID = req.userId;

  try {
    const venue = await Venue.findById(venueID);
    const user = await User.findById(userID);

    if (!venue || !user) {
      return res.status(404).json({ message: "Venue or user not found" });
    }
    venue.isBooked = false;
    venue.isPaymentPending = false;
    await venue.save();

    if (venue.isBooked || venue.isPaymentPending) {
      return res.status(400).json({ message: "Venue is not booked or payment is not pending" });
    }

   
         await venue.save();

    user.bookedVenues = user.bookedVenues.filter(id => id.toString() !== venue._id.toString());
    await user.save();

    res.status(200).json({ message: "Venue unbooked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});


// Payment endpoint - mark payment as done and clear expired flag
router.post('/:venueID/pay', verifyToken, async (req, res) => {
  const { venueID } = req.params;

  try {
    const venue = await Venue.findById(venueID);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    if (!venue.isPaymentPending) {
      return res.status(400).json({ message: "Payment is not pending for this venue" });
    }

    venue.isPaymentPending = false;
    venue.paymentTimeout = null;
    venue.isExpired = false;
    await venue.save();

    res.status(200).json({ message: "Payment successful", venue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
});


export default router;