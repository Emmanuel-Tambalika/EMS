
import express from "express";
import mongoose from "mongoose";
import { Event } from "../models/Event.model.js";
import { User } from "../models/User.model.js";

const router = express.Router();

import { signup2  } from "../controllers/event.controller.js";


router.post("/signup", signup2);
 
// Route to Save A new  Event
router.post( '/' , async (request,response) =>  {
  try {
       if(
        !request.body.name||
        !request.body.description||
        !request.body.ordinary||
        !request.body.vip||
        !request.body.vippremium||
        !request.body.date ||
        !request.body.venue||  
        !request.body.totalTickets)
       {
        return response.status(400).send({message:'Send all required fields:name ,description ,and Others' ,});
    
    }

     const newEvent = {
               name:request.body.name, 
               description:request.body.description,
               ordinary:request.body.ordinary,
               vip:request.body.vip,
               vippremium:request.body.vippremium,
               date:request.body.date,
               venue:request.body.venue,
               totalTickets:request.body.totalTickets,
     }; 
 
     const event = await Event.create(newEvent);
     return response.status(201).send(event);
  } 
  
  catch (error) {
    console.log(error.message);
    response.status(500).send ({message:error.message});
  }
});


// Update  An Event  With Mongoose .
router.put('/:id' , async (request , response) => {
  
  try {
      (
        !request.body.name||
        !request.body.description||
        !request.body.price||
        !request.body.date ||
        !request.body.venue||  
        !request.body.totalTickets
      )
      {
       
       return response.status(400).send({message:'Send all required fields:title ,author ,publishYear',

       });
 
      }

       const {id} = request.params;

       const result = await Event.findByIdAndUpdate(id , request.body);

       if(!result){
         return response.status(404).json({message:'Event Not Found'});
       }
         return response.status(200).send({message:'Event Updated Successfully '});

    } catch (error) {
       console.log(error.message);
       response.status(500).send({message:error.message});
  }
  
});



// Route to get all events or filter by date
router.get("/", async (req, res) => {
    try {
        const { date } = req.query;
        let events;

        if (date) {
            // Filter events by the specified date
            const  endOfDay  = new Date(date).setHours(0, 0, 0, 0);
            const  startOfDay = new Date(date).setHours(23, 59, 59, 999);

            events = await Event.find({
                date: { $gte: new Date(endOfDay), $lt: new Date(startOfDay) }
            }).sort({ date: "asc" });
         } 
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


































// Will TAke These to The Controllers . 

 
// Save a Event
router.put("/", async (req, res) => {
  const event = await Event.findById(req.body.eventId);
  const user = await User.findById(req.body.userID);
  try {
    user.bookedEvents.push(event);
    await user.save();
    res.status(201).json({  bookedEvents: user. bookedEvents });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get id of saved/Booked Events .
router.get("/bookedEvents/ids/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.status(201).json({ bookedEvents: user?.bookedEvents });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get saved/Booked Events 
router.get("/bookedEvents/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const  bookedEvents = await Event.find({
      _id: { $in: user.bookedEvents },
    });

    console.log(bookedEvents);
    res.status(201).json({ bookedEvents });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


export default router;