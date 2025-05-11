import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import {Link , useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MdPayment, MdEmail, MdCancel ,MdHome,MdLocationOn, MdLocationPin, MdMail, MdPerson} from "react-icons/md";
import react from '../assets/react.svg';


const MyVenues = () => {

  const location = useLocation(); 

  const isActive = (path) => {
 return location.pathname === path;
};

const navLinks = [
 { path: "/EventsPage", icon: MdHome, label: "Home" },
 { path: "/ALL-Venues", icon: MdLocationOn, label: " All Venues" },
 { path: "/my-Venues", icon: MdLocationPin, label: " Booked Venues" },
 { path: "/MailPage", icon: MdMail, label: "Mail" },
 { path: "/profilePage", icon: MdPerson, label: "Profile" }
];




  const [bookedVenues, setBookedVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
   
  const getTimeLeft = (paymentTimeout) => {
    if (!paymentTimeout) return null;
    const timeout = new Date(paymentTimeout).getTime();
    const now = Date.now();
    const diff = timeout - now;
    if (diff <= 0) return null;
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const fetchBookedVenues = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5001/api/venues/booked", 
        { withCredentials: true }
      );
      setBookedVenues(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnbook = async (venueId) => {
    try {
      await axios.delete(
        `http://localhost:5001/api/venues/${venueId}`, 
        { withCredentials: true }
      );
      fetchBookedVenues();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchBookedVenues();
    const intervalId = setInterval(fetchBookedVenues, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const MailNav = async() => {
    navigate('/MailPage');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="flex min-h-screen">
     
      
      {/* Sidebar */}
      <div className="fixed w-56 h-full bg-white shadow-lg z-10">
        <div className="flex items-center p-4 border-b border-gray-200">
          <img src={react} alt="Company Logo" className="w-8 h-8 mr-3" />
          <h1 className="text-xl font-bold text-blue-600">EMS</h1>
        </div>
        
        <nav className="p-2">
          <ul className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      isActive(link.path)
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-100 hover:text-blue-600 text-gray-600'
                    }`}
                  >
                    <Icon className={`text-2xl mr-3 ${
                      isActive(link.path) ? 'text-blue-500' : 'text-gray-500'
                    }`} />
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>


      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      <div className="ml-56 flex-1 p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}  
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className='  bg-sky-200 p-1 ml-60 mr-50 text-3xl font-bold text-gray-800 mb-2'>Booked Venues</h2>
          <p className="text-gray-600">Manage your current bookings and payments</p>
        </motion.div>

        

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
          >
            <p>{error}</p>
          </motion.div>
        )}

        {bookedVenues.length === 0 && !loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            
          </motion.div>
        ) : (
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {bookedVenues.map((venue) => (
              <motion.li
                key={venue._id}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800 truncate">{venue.name}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {venue.city}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-semibold">${venue.price}/day</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-semibold ${
                        venue.isPaymentPending 
                          ? 'text-yellow-600' 
                          : 'text-green-600'
                      }`}>
                        {venue.isPaymentPending ? 'Pending Payment' : 'Confirmed'}
                      </span>
                    </div>
                  </div>

                  {venue.isPaymentPending && (
                    <div className="mb-4">
                      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded-r">
                        {getTimeLeft(venue.paymentTimeout) ? (
                          <p className="text-yellow-700">
                            <span className="font-medium">Payment due:</span> {getTimeLeft(venue.paymentTimeout)}
                          </p>
                        ) : (
                          <p className="text-red-600 font-medium">Payment Expired</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/check-out', { state: { venueId: venue._id } })}
                      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex-1 min-w-[120px] justify-center"
                      disabled={!getTimeLeft(venue.paymentTimeout)}
                    >
                      <MdPayment className="text-lg" />
                      Pay
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleUnbook(venue._id)}
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <MdCancel className="text-lg" />
                      Unbook
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={MailNav}
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <MdEmail className="text-lg" />
                      Mail
                    </motion.button>
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </div>
  );
};

export default MyVenues;
  