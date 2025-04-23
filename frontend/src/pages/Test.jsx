import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useGetUserID } from "../hooks/useGetUserID";
import { motion } from "framer-motion";
import { MdEventAvailable, MdTimer } from "react-icons/md";
import { useLocation, useNavigate } from 'react-router-dom';

const AllVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userID = useGetUserID();
  const [unbookTimers, setUnbookTimers] = useState({});
 const navigate = useNavigate();


  // Filter states
   const [city, setCity] = useState('');
   const [capacityRange, setCapacityRange] = useState([0, 1000]);
   const [priceRange, setPriceRange] = useState([0, 10000]);
 
  
  const saveVenue = async (venueID) => {
    try {
      const response = await axios.put(
        `http://localhost:5001/api/venues/${venueID}`,
        {},
        { withCredentials: true }
      );
      
      const updatedVenues = venues.map(venue => 
        venue._id === venueID ? {
          ...venue,
          isBooked: true,
          isPaymentPending: true,
          venuePaidFor: false,
          paymentTimeout: new Date(Date.now() + 2 * 60 * 1000)
        } : venue
      );
      setVenues(updatedVenues);
      navigate('/My-venues')
      fetchVenues();
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    }
  };

  const fetchVenues = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5001/api/venues",
        { withCredentials: true }
      );
      
      const newTimers = {};
      response.data.forEach(venue => {
        if (venue.venuePaidFor && venue.bookedAt) {
          const unbookTimeout = new Date(venue.bookedAt).getTime() + 5 * 60 * 1000;
          const timeLeft = unbookTimeout - Date.now();
          if (timeLeft > 0) {
            newTimers[venue._id] = timeLeft;
          }
        }
      });
      setUnbookTimers(newTimers);
      
      setVenues(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch venues");
    } finally {
      setLoading(false);
    }
  };


   // Client-side filtering
   const filteredVenues = venues.filter(venue => {
    const matchesCity = city
      ? venue.city.toLowerCase().includes(city.toLowerCase())
      : true;
    const matchesCapacity =
      venue.capacity >= capacityRange[0] &&
      venue.capacity <= capacityRange[1];
    const matchesPrice =
      venue.price >= priceRange[0] &&
      venue.price <= priceRange[1];
    return matchesCity && matchesCapacity && matchesPrice;
  });


  const handleUnbook = async (venueID) => {
    try {
      await axios.delete(
        `http://localhost:5001/api/venues/${venueID}`,
        { withCredentials: true }
      );
      setUnbookTimers(prev => {
        const newTimers = {...prev};
        delete newTimers[venueID];
        return newTimers;
      });
      fetchVenues();
    } catch (err) {
      console.error("Unbooking Error:", err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setUnbookTimers(prev => {
        const updated = {};
        let needsUpdate = false;
        
        Object.entries(prev).forEach(([id, timeLeft]) => {
          const newTime = timeLeft - 1000;
          if (newTime <= 0) {
            handleUnbook(id);
            needsUpdate = true;
          } else {
            updated[id] = newTime;
          }
        });
        
        return needsUpdate ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getPaymentTimeLeft = (paymentTimeout) => {
    if (!paymentTimeout) return null;
    const timeout = new Date(paymentTimeout).getTime();
    const now = Date.now();
    return Math.max(0, timeout - now);
  };

  useEffect(() => {
    fetchVenues();
    const intervalId = setInterval(fetchVenues, 15000);
    return () => clearInterval(intervalId);
  }, []);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Available Venues</h2>
          <p className="text-gray-600">Find and book your perfect event space</p>
        </motion.div>


         {/* Filter Controls */}
         <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Filter Venues</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                placeholder="Any city"
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={capacityRange[0]}
                  onChange={e => setCapacityRange([Number(e.target.value), capacityRange[1]])}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={capacityRange[1]}
                  onChange={e => setCapacityRange([capacityRange[0], Number(e.target.value)])}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
          >
            <p>{error}</p>
          </motion.div>
        )}

        <motion.ul
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {venues.map((venue) => {
            const paymentTimeLeft = getPaymentTimeLeft(venue.paymentTimeout);
            const showPaymentTimer = venue.isPaymentPending && paymentTimeLeft > 0;
            const showUnbookTimer = venue.venuePaidFor && unbookTimers[venue._id] > 0;
            const isAvailable = !venue.isBooked && !venue.venuePaidFor;

            return (
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
                                <div className="space-y-2 mb-4">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Capacity:</span>
                                    <span className="font-semibold">{venue.capacity} people</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Price:</span>
                                    <span className="font-semibold">${venue.price}/day</span>
                                  </div>
                                </div>
              
                                {venue.isBooked ? (
                                  <div className="mb-4">
                                    {venue.isPaymentPending ? (
                                      <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r mb-3">
                                        <div className="flex items-center gap-2 text-blue-700">
                                          <MdTimer className="text-lg" />
                                          <span className="font-medium">
                                            Pay in: {formatTime(paymentTimeLeft)}
                                          </span>
                                        </div>
                                        <p className="text-sm text-blue-600 mt-1">Payment Pending</p>
                                      </div>
                                    ) : (
                                      <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r mb-3">
                                        <div className="flex items-center gap-2 text-green-700">
                                          <MdEventAvailable className="text-lg" />
                                          <span className="font-medium">
                                            {venue.venuePaidFor ? 'Booked' : 'Reserved'}
                                          </span>
                                        </div>
                                        {showUnbookTimer && (
                                          <p className="text-sm text-yellow-600 mt-1">
                                            Available in: {formatTime(unbookTimers[venue._id])}
                                          </p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  isAvailable && (
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => saveVenue(venue._id)}
                                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                                    >
                                      Book Now
                                    </motion.button>
                                  )
                                )}
                              </div>
                </motion.li>
            );
          })}

        </motion.ul>

        {filteredVenues.length === 0 && !loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <h3 className="text-xl font-medium text-gray-600">
                      No venues match your filters
                    </h3>
                    <button
                      onClick={() => {
                        setCity('');
                        setCapacityRange([0, 1000]);
                        setPriceRange([0, 10000]);
                      }}
                      className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Reset Filters
                    </button>
                  </motion.div>
                )}
      </div>
    </div>
  );
};

export default AllVenues;