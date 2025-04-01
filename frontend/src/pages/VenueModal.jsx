import React, { useState } from 'react';
import { motion } from "framer-motion";
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import { SnackbarProvider, useSnackbar } from 'notistack';
import BackButton from "../components/BackButton.jsx";

import '../eMailVerification.css';

const VenueModal = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [capacity, setCapacity] = useState("0");
    const [price, setPrice] = useState("");
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();


    const handleSaveEvent = () => {
        const data = {
            name,
            description,
            price,
            capacity,
        };
       
        axios
            .post('http://localhost:5001/api/venues', data)
            .then(() => {
                
                enqueueSnackbar('Event Created Successfully', { variant: 'success' });
                navigate('/Venues');
            })

            .catch((error) => {
              
                enqueueSnackbar('Error :Check Connection ', { variant: 'error' });
                console.log(error);
            });


    };





    return (
        <div className="create-Event">

        <BackButton />

        <h1 className='text-2xl my-2 '>  Create  venue </h1>
        <div className=' flex flex-col border-2 border-green-800 rounded-xl w-[600px] p-8 mx-auto'>

            <div className='my-4'>
                <label className='text-xl mr-4 text-blue-500'>Venue Name</label>
                <input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={18}
                    className='border-2 border--gray-500 px-4 py-2 w-full'
                />
            </div>


            <div className='my-4'>
                <label className='text-xl mr-4 text-blue-500'>Price</label>
                <input
                    type='number'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className='border-2 border--gray-500 px-4 py-2 w-full'
                />
            </div>
            <div className='my-4'>
                <label className='text-xl mr-4 text-blue-500'>Capacity</label>
                <input
                    type='number'
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className='border-2 border--gray-500 px-4 py-2 w-full'
                />
            </div>


            <div className='my-4'>
                <label className='text-xl mr-4 text-blue-500'>Description</label>
                <input
                    type='text'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={70}
                    className='border-2 border--gray-500 px-4 py-2 w-full'
                />
            </div>
 

            <button className='p-2 bg-emerald-500 m-8' onClick={handleSaveEvent}>
                Save
            </button>

        </div>
    </div>
     
    );
};

export default VenueModal;
