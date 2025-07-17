 
import React, { useState } from 'react';
import { motion } from "framer-motion";
import axios from 'axios'; 
import { Link, useNavigate ,useSearchParams } from "react-router-dom";
import {SnackbarProvider, useSnackbar} from 'notistack';
import BackButton from "../components/BackButton.jsx";
import '../eMailVerification.css';

 
  const CreateEventModal = ({ isOpen, onClose }) => {

  const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [ordinary, setOrdinary] = useState("");
  const [vip, setVip] = useState("");
  const [vippremium, setVipPremium] = useState("");
	const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
	const [totalTickets, setTotalTickets] = useState("");
	const [loading,setLoading]=useState('');
	const {enqueueSnackbar} = useSnackbar();
	const navigate = useNavigate();
  

  const handleSaveEvent=()=>{
    const data ={
          name,
          description,
          ordinary,
          vip,
          vippremium,
          date,
          venue,
         totalTickets,
  }; 
  setLoading(true); 
  axios 
  .post('http://localhost:5001/api/events', data)
  .then(() =>{
    setLoading(false);
    enqueueSnackbar('Event Created Successfully' , {variant :'success'});
    navigate('/EventsPage');
  })
  
  .catch((error) => {
    setLoading(false);
    enqueueSnackbar('Error : Check Connection ' , {variant:'error'});
    console.log(error);
  });
  
  
  };

    return  isOpen ?  (

      <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

      <div className="modal-header">
          <h2> Create Event </h2>
          <button className="close-btn" onClick={onClose}>×</button>
       </div>

       <div className=' flex flex-col border-2 border-green-800 rounded-xl w-[600px] p-8 mx-auto'>
		   
       <div className='my-4'>
           <label className='text-xl mr-4 text-blue-500'>Event Name</label>
           <input
            type='text'
            value ={name}
            onChange={(e) => setName(e.target.value)}
           className='border-2 border--gray-500 px-4 py-2 w-full'
           />
       </div>


       <div className='my-4'>
           <label className='text-xl mr-4 text-blue-500'>Description</label>
           <input
            type='text'
            value ={description}
            onChange={(e) => setDescription(e.target.value)}
           className='border-2 border--gray-500 px-4 py-2 w-full'
           />
       </div>


       <div className='my-4'>
       <label className='text-xl mr-4 text-blue-500'>Tickets Prices  :</label>
       <div className='my-4'>
           <label className='text-xl mr-4 text-blue-500'>Ordinary $ :</label>
           <input
            type='number'
            value ={ordinary}
            onChange={(e) => setOrdinary(e.target.value)}
           className='border-2 border--gray-500 px-4 py-2 w-full'
           />
       </div>
           
       <div className='my-4'>
           <label className='text-xl mr-4 text-blue-500'>VIP  $ :</label>
           <input
            type='number'
            value ={vip}
            onChange={(e) => setVip(e.target.value)}
           className='border-2 border--gray-500 px-4 py-2 w-full'
           />
       </div>


       <div className='my-4'>
           <label className='text-xl mr-4 text-blue-500'>Vip Premium $ :</label>
           <input
            type='number'
            value ={vippremium}
            onChange={(e) => setVipPremium(e.target.value)}
           className='border-2 border--gray-500 px-4 py-2 w-full'
           />
       </div>

       </div >

<div className='my-4'>
           <label className='text-xl mr-4 text-blue-500'>Date</label>
           <input
            type='date'
            value ={date}
            onChange={(e) => setDate(e.target.value)}
           className='border-2 border--gray-500 px-4 py-2 w-full'
           />
       </div>

        <div className='my-4'>
           <label className='text-xl mr-4 text-blue-500'>Venue</label>
           <input
            type='text'
            value ={venue}
            onChange={(e) => setVenue(e.target.value)}
           className='border-2 border--gray-500 px-4 py-2 w-full'
           />
       </div>

<div className='my-4'>
           <label className='text-xl mr-4 text-blue-500'>Total Tickets</label>
           <input
            type='number'
            value ={totalTickets}
            onChange={(e) => setTotalTickets(e.target.value)}
           className='border-2 border--gray-500 px-4 py-2 w-full'
           />
       </div>


       <button className='p-2 bg-emerald-500 m-8' onClick={handleSaveEvent}> 
                  Save
       </button>
       
</div>




       </div>
      </div>
    ) :null;
  }
  
  export default CreateEventModal