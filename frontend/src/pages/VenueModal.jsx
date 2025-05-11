import React, { useState } from 'react';
import { motion } from "framer-motion";
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import { SnackbarProvider, useSnackbar } from 'notistack';
import VenueBackButton from '../components/VenueBackButton';
import BackButton from '../components/BackButton';


import '../eMailVerification.css';

const  VenueModal =  () => {
    const [name, setName] = useState();
    const [description, setDescription] = useState("");
    const [capacity, setCapacity] = useState("");
    const [price, setPrice] = useState("");
    const [city, setCity] = useState("");
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();


    const handleSaveEvent = () => {
        const data = {
            name,
            description,
            price,
            capacity,
            city,
        };
       
        axios
            .post('http://localhost:5001/api/venues', data)
            .then(() => {
                
                enqueueSnackbar('Event Created Successfully', { variant: 'success' });
                navigate('/VenueManager');
            })

            .catch((error) => {
              
                enqueueSnackbar('Error :Check Connection ', { variant: 'error' });
                console.log(error);
            });


    };





    return (
        <div className="fixed inset-0 bg-grey bg-opacity-50 flex items-center justify-center z-50">
              <motion.div 
                              initial={{ opacity: 0, y: -20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                              onClick={(e) => e.stopPropagation()}
                          >
        <div className=' flex flex-col border-2 border-green-800 rounded-xl w-[600px] p-8 mx-auto'>

            
            <div className="flex justify-between items-center p-4 border-b">
                    <div className="flex items-center space-x-4">
                        <VenueBackButton 
                            className="hover:bg-gray-100 p-2 rounded-full transition-colors duration-200"
                            onClick={() => navigate('/VenueManager')}
                        />
                        <h2 className="text-xl font-bold">Create Venue</h2>
                    </div>
                    <button 
                        className="text-black-800   hover:text-red-700 p-2 bg-red-400"
                        onClick={() => navigate('/VenueManager')}
                    >
                          Cancel (X)
                    </button>
                </div>


                <div className='p-6 space-y-6'>
                <div className="space-y-4">
                <label className='text-xl mr-4 text-blue-500'>Venue Name</label>
                <input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={18}
                    className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500'
                />
            </div>

            <div className='my-4'>
                <label className='text-xl mr-4 text-blue-500'>City</label>
                <input
                    type='text'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className='border-2 border--gray-500 px-4 py-2 w-full'
                  
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className='my-4'>
                <label className='text-xl mr-4 text-blue-500'>Capacity</label>
                <input
                    type='Number'
                    value={capacity}
                    min={10}
                    onChange={(e) => setCapacity(e.target.value)}
                    className='border-2 border--gray-500 px-4 py-2 w-full'
                  
                />
            </div>

            <div className='my-4'>
                <label className='text-xl mr-4 text-blue-500'>Price</label>
                <input
                    type='Number'
                    value={price}
                    min={10}
                    onChange={(e) => setPrice(e.target.value)}
                    className='w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500'
                  
                />
            </div>
              </div>

            <div className='my-4'>
                <label className='text-xl mr-4 text-blue-500'>Description</label>
                <input
                    type='text'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={70}
                    className='w-full p-2 border rounded-md h-32 focus:ring-2 focus:ring-blue-500'
                />
            </div>
 

            <button className=' ml-41 px-14 py-2 bg-blue-500 text-g-600 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500'
             onClick={handleSaveEvent}>
                Save
            </button>  
           </div>
        </div>
        </motion.div>
    </div>
     
    );
};

export default VenueModal;
