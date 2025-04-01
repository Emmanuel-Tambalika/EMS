import express from "express";
import mongoose from "mongoose";
import { Venue } from "../models/Venue.model.js";
import { User } from "../models/User.model.js";

const router = express.Router();


 
// Route to Save A new  Event
router.post( '/' , async (request,response) =>  {
  try {
       if(
         //Must Add City and Use that To Filter the Venues .
        !request.body.name||
        !request.body.description||
        !request.body.price||
        !request.body.capacity
        
        )
       {
        return response.status(400).send({message:'Send all required fields:name ,description ,and Others' ,});
    
    }

     const newVenue = {
               name:request.body.name, 
               description:request.body.description,
               price:request.body.price, 
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

// Route to get all events or filter by City
router.get("/", async (req, res) => {
  try {
  
      let venues;
    
      venues = await Venue.find({});
      
      res.status(200).json(venues);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});




//Some Lessons 

// Update  An Event  With Mongoose .
router.put('/:id' , async (request , response) => {
  
  try {
      (
        
        !request.body.name||
        !request.body.description||
        !request.body.totalTickets
      )
      {
       
       return response.status(400).send({message:'Send all required fields'});
 
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
router.get("/Venues", async (req, res) => {
    try {
    
        let venues;
      
        venues = await Event.find({});
        
        res.status(200).json(venues);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;