import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useNavigate ,useLocation ,Link} from "react-router-dom";
import { motion } from "framer-motion";
import { MdPayment, MdEmail, MdCancel  , MdBook, MdMail, MdPerson, MdHome } from "react-icons/md";
import react from '../assets/react.svg';

const MyBookings = () => {

  const location = useLocation();

  const isActive = (path) => location.pathname === path;

 const navLinks = [
      { path: "/AttendeePage", icon: MdHome, label: "Home" },
      { path: "/my-Bookings", icon: MdBook, label: "My Bookings" },
      { path: "/emails", icon: MdMail, label: "Mail" },
      { path: "/profilePage", icon: MdPerson, label: "Profile" }
   ];  



  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:5001/api/bookings/my", {
        withCredentials: true,
      });
      setBookings(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to fetch bookings");
      enqueueSnackbar("Failed to load bookings", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handlePay = (bookingId) => {
    
    navigate('/booking-checkout', { state: { bookingId } });
  };

  const handleDelete = async (bookingId) => {
    if (!bookingId || !/^[0-9a-fA-F]{24}$/.test(bookingId)) {
      enqueueSnackbar("Invalid booking ID format", { variant: "error" });
      return;
    }

    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    setDeletingId(bookingId);

    try {
      const res = await axios.delete(
        `http://localhost:5001/api/bookings/${bookingId}`,
        { 
          withCredentials: true,
          validateStatus: (status) => status < 500
        }
      );

      if (res.status === 404) {
        throw new Error("Booking not found - it may have already been deleted");
      }
      
      if (res.status === 403) {
        throw new Error("You don't have permission to delete this booking");
      }

      if (res.status === 200) {
        enqueueSnackbar("Booking deleted successfully", { 
          variant: "success",
          autoHideDuration: 3000,
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
        
        setBookings(prev => prev.filter(b => b._id !== bookingId));
        return;
      }

      throw new Error(res.data?.message || "Unexpected response");
    } catch (err) {
      console.error("Delete Error:", {
        error: err.response?.data || err.message,
        status: err.response?.status
      });

      const errorMessage = err.response?.data?.message || 
        err.message || 
        "Failed to delete booking. Please try again later.";

      enqueueSnackbar(errorMessage, { 
        variant: "error",
        autoHideDuration: 5000,
        anchorOrigin: { vertical: 'top', horizontal: 'center' }
      });
    } finally {
      setDeletingId(null);
    }
  };

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
 
  const MailNav = () => {
    navigate('/emails');
  };  

  useEffect(() => {
    fetchBookings();
    const intervalId = setInterval(fetchBookings, 10000);
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

  const renderTicketDetails = (ticketDetails) => {
    if (!ticketDetails) return null;
    
    return (
      <div className="flex gap-2 mt-2 flex-wrap">
        {Object.entries(ticketDetails).map(([type, count]) => (
          count > 0 && (
            <span 
              key={type}
              className="px-3 py-1 rounded-full text-xs font-medium
                bg-blue-100 text-blue-800 border border-blue-200"
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}: {count}
            </span>
          )
        ))}
      </div>
    );
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
      
      <div className=" ml-56 max-w-6xl mx-auto p-3">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className=" ml-100 text-3xl font-bold text-gray-800 mb-2">My Bookings</h2>
          <p className=" ml-100  text-gray-600">Manage your event bookings and payments</p>
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

        {bookings.length === 0 && !loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className=" ml-100 text-gray-500 text-lg">No bookings found</p>
            <p className="ml-100 text-gray-400 mt-2">Your upcoming events will appear here</p>
          </motion.div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {bookings.map((booking) => {
              if (!booking.event) {
                return (
                  <motion.li 
                    key={booking._id} 
                    variants={itemVariants}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-red-600 font-medium">Event data missing</p>
                        <p className="text-sm text-gray-500 mt-1">Booking ID: {booking._id}</p>
                      </div>
                      <button
                        onClick={() => booking._id && handleDelete(booking._id)}
                        disabled={deletingId === booking._id}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 
                          transition-colors text-sm disabled:bg-red-400"
                      >
                        {deletingId === booking._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </motion.li>
                );
              }

              const { event } = booking;
              const paymentDue =
                booking.isPaymentPending && booking.paymentTimeout
                  ? new Date(booking.paymentTimeout).getTime() - Date.now()
                  : 0;
              const isExpired = paymentDue <= 0 && booking.isPaymentPending;

              return (
                <motion.li
                  key={booking._id}
                  variants={itemVariants}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="md:flex justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {event.name || "Unnamed Event"}
                        </h3>
                        <span className=" ml-10 text-sm text-gray-500">
                          {event.date ? new Date(event.date).toLocaleDateString() : "N/A"}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <p className="text-gray-600">
                          <span className="font-medium">Venue:</span> {event.venue || "Unknown venue"}
                        </p>

                        <div className="pt-2">
                          <div className="flex items-baseline gap-4">
                            <p className="font-medium text-gray-700">
                              Total: <span className="text-blue-600">${booking.ticketAmount}</span>
                            </p>
                            <p className="text-sm text-gray-500">
                              {booking.ticketsCount} {booking.ticketsCount === 1 ? "ticket" : "tickets"}
                            </p>
                          </div>
                          {renderTicketDetails(booking.ticketDetails)}
                        </div>

                        <div className="pt-2">
                          {isExpired && (
                            <p className="text-red-600 font-medium">
                              <span className="inline-block w-3 h-3 bg-red-600 rounded-full mr-2"></span>
                              Booking expired (payment overdue)
                            </p>
                          )}
                          {!booking.isPaymentPending && booking.isPaid && (
                            <p className="text-green-600 font-medium">
                              <span className="inline-block w-3 h-3 bg-green-600 rounded-full mr-2"></span>
                              Payment Completed
                            </p>
                          )}
                          {booking.isPaymentPending && !isExpired && (
                            <p className="text-yellow-600 font-medium">
                              <span className="inline-block w-3 h-3 bg-yellow-600 rounded-full mr-2"></span>
                              Payment due in: {getTimeLeft(booking.paymentTimeout)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 flex md:flex-col gap-2 justify-end">
                      {booking.isPaymentPending && !isExpired && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePay(booking._id)}
                          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm whitespace-nowrap"
                          disabled={!getTimeLeft(booking.paymentTimeout)}
                        >
                          <MdPayment className="text-lg" />
                          Pay Now
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(booking._id)}
                        disabled={(!isExpired && booking.isPaymentPending) || deletingId === booking._id}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm whitespace-nowrap ${
                          isExpired 
                            ? 'bg-red-500 hover:bg-red-600 text-white' 
                            : booking.isPaymentPending 
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        } ${deletingId === booking._id ? 'opacity-75' : ''}`}
                      >  
                        <MdCancel className="text-lg " />
                        {deletingId === booking._id ? 'Deleting...' : 
                          isExpired ? 'Delete Expired' : 'Booking Expired (Delete)'}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={MailNav}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors text-sm whitespace-nowrap"
                      >
                        <MdEmail className="text-lg" />
                        Email
                      </motion.button>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
