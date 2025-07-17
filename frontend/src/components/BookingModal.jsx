import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../api-services/bookings.services";

const BookingModal = ({ isOpen, onClose, event, onBookingSuccess }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [orientation, setOrientation] = useState(
    window.innerWidth > window.innerHeight ? "landscape" : "portrait"
  );

  // Maintain original individual quantity states
  const [ordinaryQuantity, setOrdinaryQuantity] = useState(0);
  const [vipQuantity, setVipQuantity] = useState(0);
  const [vippremiumQuantity, setVippremiumQuantity] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setOrientation(
        window.innerWidth > window.innerHeight ? "landscape" : "portrait"
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setOrdinaryQuantity(0);
      setVipQuantity(0);
      setVippremiumQuantity(0);
      setLoading(false);
    }
  }, [isOpen]);

  if (!event) return null;

  // Calculate total using the original method
  const totalCost = (
    ordinaryQuantity * event.ordinary +
    vipQuantity * event.vip +
    vippremiumQuantity * event.vippremium
  ).toFixed(2);

  const handleBooking = async (e) => {
    e.preventDefault();
  
    const totalTickets = ordinaryQuantity + vipQuantity + vippremiumQuantity;
    
    if (totalTickets === 0) {
      enqueueSnackbar("Please select at least one ticket", { variant: "warning" });
      return;
    }
  
    // Validate against available tickets
    if (event.totalTickets < totalTickets) {
      enqueueSnackbar(`Not enough tickets available! Only ${event.totalTickets} remaining`, { variant: "error" });
      return;
    }
  
    setLoading(true);
  
    try {
      const bookingData = {
        event: event._id,
        ticketsCount: totalTickets,
        ticketAmount: totalCost,
        ticketDetails: {
          ordinary: ordinaryQuantity,
          vip: vipQuantity,
          premium: vippremiumQuantity
        }
      };
  
      await createBooking(bookingData);
  
      // Update local event data (assuming parent component handles this)
      onBookingSuccess({
        ...event,
        totalTickets: event.totalTickets - totalTickets
      });
  
      enqueueSnackbar("Booking successful!", { variant: "success" });
      onClose();
      
      setTimeout(() => navigate("/my-bookings"), 1000);
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || "Booking failed. Please try again.", 
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  };
  
  const ticketTypes = [
    {
      type: "ordinary",
      label: "Ordinary",
      quantity: ordinaryQuantity,
      setter: setOrdinaryQuantity,
      color: "bg-blue-100 text-blue-800",
      price: event.ordinary
    },
    {
      type: "vip",
      label: "VIP",
      quantity: vipQuantity,
      setter: setVipQuantity,
      color: "bg-purple-100 text-purple-800",
      price: event.vip
    },
    {
      type: "premium",
      label: "Premium",
      quantity: vippremiumQuantity,
      setter: setVippremiumQuantity,
      color: "bg-amber-100 text-amber-800",
      price: event.vippremium
    }
  ];

  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray bg-opacity-5 backdrop-blur-sm p-4">
      <div className={`
        bg-white rounded-xl shadow-2xl overflow-hidden
        ${orientation === "landscape" ? "max-w-3xl flex" : "max-w-md"}
        transform transition-all duration-300 scale-95 opacity-0 animate-fadeInScale
      `}>
        <div className={`p-6 ${orientation === "landscape" ? "flex-1" : ""}`}>
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Book Tickets</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl focus:outline-none"
            >
              &times;
            </button>
              </div>   

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-medium text-gray-600 w-20">Event:</span>
                <span className="text-gray-800">{event.name}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-600 w-20">Venue:</span>
                <span className="text-gray-800">{event.venue}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-600 w-20">Date:</span>
                <span className="text-gray-800">
                  {new Date(event.date).toLocaleDateString()}
                </span>
              </div>
            </div>

            {orientation === "landscape" && (
              <div className="flex items-center justify-center">
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Available Tickets</p>
                  <p className="text-xl font-bold">{event.totalTickets}</p>
                </div>
              </div>
            )}
          </div>

          <div className={`${orientation === "landscape" ? "grid grid-cols-3 gap-4" : "space-y-4"}`}>
            {ticketTypes.map(({ type, label, quantity, setter, color, price }) => (
              <div key={type} className="flex flex-col">
                <div className={`px-3 py-1 rounded-full text-xs mb-2 ${color} w-fit`}>
                  {label}: ${price}
                </div>
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={quantity}
                  onChange={(e) => setter(Number(e.target.value))}
                >
                  {[0, 1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">Total:</span>
              <span className="text-xl font-bold text-gray-800">${totalCost}</span>
            </div>
          </div>

          <button
            type="submit"
            onClick={handleBooking}
            disabled={loading || totalCost === "0.00"}
            className={`w-full mt-6 py-3 rounded-lg text-white font-semibold transition-colors ${
              loading || totalCost === "0.00"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <span className="flex justify-center items-center">
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Confirm Booking"
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.3s ease forwards;
        }
      `}</style>
    </div>
  ) : null;
};

export default BookingModal;
