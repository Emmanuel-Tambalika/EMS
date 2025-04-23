import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useGetUserID } from "../hooks/useGetUserID";
import { motion } from "framer-motion";
import { MdEventAvailable, MdTimer } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const CITY_OPTIONS = [
  "Mutare", "Harare", "Bulawayo", "Chegutu", "Hwange", "Kadoma",
  "Masvingo", "Bindura", "Gweru", "Kariba", "BeitBridge", "Rusape","Marondera","Hwedza"
];

const MIN_CAPACITY = 0;
const MAX_CAPACITY = 1000;
const MIN_PRICE = 0;
const MAX_PRICE = 10000;

const AllVenues = () => {
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userID = useGetUserID();
  const [unbookTimers, setUnbookTimers] = useState({});
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    minCapacity: '',
    maxCapacity: '',
    minPrice: '',
    maxPrice: '',
    city: ''
  });

  const saveVenue = async (venueID) => {
    try {
      await axios.put(
        `http://localhost:5001/api/venues/${venueID}`,
        {},
        { withCredentials: true }
      );
      fetchVenues();
      navigate('/My-venues');
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

  useEffect(() => {
    let result = venues;
    if (filters.minCapacity) {
      result = result.filter(v => v.capacity >= Number(filters.minCapacity));
    }
    if (filters.maxCapacity) {
      result = result.filter(v => v.capacity <= Number(filters.maxCapacity));
    }
    if (filters.minPrice) {
      result = result.filter(v => v.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(v => v.price <= Number(filters.maxPrice));
    }
    if (filters.city) {
      result = result.filter(v => v.city.toLowerCase().includes(filters.city.toLowerCase()));
    }
    setFilteredVenues(result);
  }, [venues, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      minCapacity: '',
      maxCapacity: '',
      minPrice: '',
      maxPrice: '',
      city: ''
    });
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

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
          >
            <p>{error}</p>
          </motion.div>
        )}

        {/* Improved Filter Controls */}
        <motion.div 
          className="bg-white p-6 rounded-xl shadow-md mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={MIN_CAPACITY}
                  max={filters.maxCapacity || MAX_CAPACITY}
                  name="minCapacity"
                  placeholder="Min"
                  className="w-full p-2 border rounded"
                  value={filters.minCapacity}
                  onChange={handleFilterChange}
                />
                <span className="text-gray-400">—</span>
                <input
                  type="number"
                  min={filters.minCapacity || MIN_CAPACITY}
                  max={MAX_CAPACITY}
                  name="maxCapacity"
                  placeholder="Max"
                  className="w-full p-2 border rounded"
                  value={filters.maxCapacity}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($/day)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={MIN_PRICE}
                  max={filters.maxPrice || MAX_PRICE}
                  name="minPrice"
                  placeholder="Min"
                  className="w-full p-2 border rounded"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
                <span className="text-gray-400">—</span>
                <input
                  type="number"
                  min={filters.minPrice || MIN_PRICE}
                  max={MAX_PRICE}
                  name="maxPrice"
                  placeholder="Max"
                  className="w-full p-2 border rounded"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select
                name="city"  
                className="w-full p-2 border rounded"
                value={filters.city}
                onChange={handleFilterChange}
              >
                <option value=""> Zimbabwe's Cities</option>
                {CITY_OPTIONS.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </motion.div>

        <motion.ul
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredVenues.map((venue) => {
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
      </div>
    </div>
  );
};

export default AllVenues;

