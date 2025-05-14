import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useGetUserID } from "../hooks/useGetUserID";
import { motion } from "framer-motion";
import { MdEventAvailable, MdTimer, MdLocationOn, MdHome, MdMail, MdPerson } from "react-icons/md";
import { Link, useLocation } from 'react-router-dom';
import react from '../assets/react.svg';
import VenueCalendar from '../components/VenueCalendar.jsx';

const CITY_OPTIONS = [
  "Mutare", "Harare", "Bulawayo", "Chegutu", "Hwange", "Kadoma",
  "Masvingo", "Bindura", "Gweru", "Kariba", "BeitBridge", "Rusape", "Marondera", "Hwedza"
];

const MIN_CAPACITY = 0;
const MAX_CAPACITY = 1000;
const MIN_PRICE = 0;
const MAX_PRICE = 10000;

const AllVenues = () => {
  const location = useLocation();
  const userID = useGetUserID();

    
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [venues, setVenues] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentTimers, setPaymentTimers] = useState({}); // payment countdown timers keyed by venue ID
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [filters, setFilters] = useState({
    minCapacity: '',
    maxCapacity: '',
    minPrice: '',
    maxPrice: '',
    city: ''
  });

  // Fetch venues from API
  const fetchVenues = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/api/venues", { withCredentials: true });

      // Calculate payment timers for venues with payment pending
      const timers = {};
      response.data.forEach(venue => {
        if (venue.isPaymentPending && venue.paymentTimeout) {
          const timeoutMs = new Date(venue.paymentTimeout).getTime();
          const now = Date.now();
          const diff = timeoutMs - now;
          if (diff > 0) {
            timers[venue._id] = diff;
          }
        }
      });

      setPaymentTimers(timers);
      setVenues(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch venues");
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer update every second
  useEffect(() => {
    const interval = setInterval(() => {
      setPaymentTimers(prevTimers => {
        const updatedTimers = {};
        let changed = false;
        Object.entries(prevTimers).forEach(([venueId, timeLeft]) => {
          const newTimeLeft = timeLeft - 1000;
          if (newTimeLeft > 0) {
            updatedTimers[venueId] = newTimeLeft;
          } else {
            changed = true; // timer expired, remove it
          }
        });
        return changed ? updatedTimers : prevTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);
 const toggleDescription = (eventId) => {
        setExpandedDescriptions(prev => ({
            ...prev,
            [eventId]: !prev[eventId]
        }));
    };

  // Refresh venues regularly to keep data fresh
  useEffect(() => {
    fetchVenues();
    const intervalId = setInterval(fetchVenues, 15000);
    return () => clearInterval(intervalId);
  }, []);

  // Filters
  useEffect(() => {
    let result = venues;
    if (filters.minCapacity) result = result.filter(v => v.capacity >= Number(filters.minCapacity));
    if (filters.maxCapacity) result = result.filter(v => v.capacity <= Number(filters.maxCapacity));
    if (filters.minPrice) result = result.filter(v => v.price >= Number(filters.minPrice));
    if (filters.maxPrice) result = result.filter(v => v.price <= Number(filters.maxPrice));
    if (filters.city) result = result.filter(v => v.city.toLowerCase().includes(filters.city.toLowerCase()));
    setFilteredVenues(result);
  }, [venues, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ minCapacity: '', maxCapacity: '', minPrice: '', maxPrice: '', city: '' });
  };

  // Format ms to mm:ss
  const formatTime = (ms) => {
    if (ms <= 0) return null;
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
            {[
              { path: "/EventsPage", icon: MdHome, label: "Home" },
              { path: "/ALL-Venues", icon: MdLocationOn, label: "All Venues" },
              { path: "/my-Venues", icon: MdLocationOn, label: "Booked Venues" },
              { path: "/MailPage", icon: MdMail, label: "Mail" },
              { path: "/profilePage", icon: MdPerson, label: "Profile" }
            ].map(link => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`flex items-center p-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 hover:text-blue-600 text-gray-600'}`}
                  >
                    <Icon className={`text-2xl mr-3 ${isActive ? 'text-blue-500' : 'text-gray-500'}`} />
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
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Available Venues</h2>
          <p className="text-gray-600">Find and book your perfect event space</p>
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div className="bg-white p-6 rounded-xl shadow-md mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <div className="flex items-center gap-2">
                <input type="number" min={MIN_CAPACITY} max={filters.maxCapacity || MAX_CAPACITY} name="minCapacity" placeholder="Min" className="w-full p-2 border rounded" value={filters.minCapacity} onChange={handleFilterChange} />
                <span className="text-gray-400">-</span>
                <input type="number" min={filters.minCapacity || MIN_CAPACITY} max={MAX_CAPACITY} name="maxCapacity" placeholder="Max" className="w-full p-2 border rounded" value={filters.maxCapacity} onChange={handleFilterChange} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($/day)</label>
              <div className="flex items-center gap-2">
                <input type="number" min={MIN_PRICE} max={filters.maxPrice || MAX_PRICE} name="minPrice" placeholder="Min" className="w-full p-2 border rounded" value={filters.minPrice} onChange={handleFilterChange} />
                <span className="text-gray-400">-</span>
                <input type="number" min={filters.minPrice || MIN_PRICE} max={MAX_PRICE} name="maxPrice" placeholder="Max" className="w-full p-2 border rounded" value={filters.maxPrice} onChange={handleFilterChange} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select name="city" className="w-full p-2 border rounded" value={filters.city} onChange={handleFilterChange}>
                <option value=""> Zimbabwe's Cities</option>
                {CITY_OPTIONS.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button onClick={clearFilters} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg transition">Clear Filters</button>
            </div>
          </div>
        </motion.div>

        {/* Venue Cards */}
        <motion.ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}>
          {filteredVenues.map(venue => {
            const isAvailable = !venue.isBooked && !venue.venuePaidFor;
            const paymentTimeLeft = paymentTimers[venue._id] || 0;

            return (
              <motion.li key={venue._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300" whileHover={{ y: -5 }}>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800 truncate">{venue.name}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{venue.city}</span>
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

                  <div
                    className={`text-gray-600 mb-1 transition-all duration-300 ${expandedDescriptions[venue._id]
                      ? 'max-h-screen'
                      : 'max-h-20 overflow-hidden'
                      }`}
                  >
                    <p className='text-green-500 lg-50'>Description and Takeaways:</p> {venue.description}
                  </div>


                  {venue.description.length > 100 && (
                    <button
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm mb-4"
                      onClick={() => toggleDescription(venue._id)}
                    >
                      {expandedDescriptions[venue._id] ? 'Show Less' : 'Read More'}
                    </button>
                  )}

                  <button
                    className="mb-2 w-full bg-gradient-to-r from-green-600 to-green-500 text-black py-2 px-4 rounded-lg hover:from-gray-300 hover:to-gray-700 transition-all"
                    onClick={() => {
                      setSelectedVenue(venue);
                      setIsCalendarOpen(true);
                    }}
                  >
                    Venue Calendar
                  </button>

                  {/* Payment Pending Timer 
                  {venue.isPaymentPending && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded-r mb-3">
                      {paymentTimeLeft > 0 ? (
                        <p className="text-yellow-700 font-medium flex items-center gap-2">
                          <MdTimer className="text-xl" />
                          Booked  : Available  in: {formatTime(paymentTimeLeft)}
                        </p>
                      ) : (
                        <p className="text-red-600 font-semibold">Payment Expired</p>
                      )}
                    </div>
                  )}

                    Booking status 
                  {venue.isBooked && !venue.isPaymentPending && (
                    <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r mb-3 flex items-center gap-2 text-green-700">
                      <MdEventAvailable className="text-lg" />
                      <span className="font-medium">{venue.venuePaidFor ? 'Booked' : 'Reserved'}</span>
                    </div>
                  )}

                         */} 
                </div>
              </motion.li>
            );
          })}
        </motion.ul>

        {/* Venue Calendar Modal */}
        {isCalendarOpen && selectedVenue && (
          <VenueCalendar
            isOpen={isCalendarOpen}
            onClose={() => setIsCalendarOpen(false)}
            venue={selectedVenue}
            onBookingSuccess={() => {
              setIsCalendarOpen(false);
              fetchVenues();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AllVenues;
