import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { createBooking } from "../api-services/bookings.services";

const BookingModal = ({ isOpen, onClose, event, onBookingSuccess }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [ordinaryQuantity, setOrdinaryQuantity] = useState(0);
  const [vipQuantity, setVipQuantity] = useState(0);
  const [vippremiumQuantity, setVippremiumQuantity] = useState(0);
  const [loading, setLoading] = useState(false);

  // Reset quantities when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setOrdinaryQuantity(0);
      setVipQuantity(0);
      setVippremiumQuantity(0);
      setLoading(false);
    }
  }, [isOpen]);

  if (!event) return null;

  const totalCost =
    ordinaryQuantity * event.ordinary +
    vipQuantity * event.vip +
    vippremiumQuantity * event.vippremium;

  const handleBooking = async (e) => {
    e.preventDefault();

    if (ordinaryQuantity + vipQuantity + vippremiumQuantity === 0) {
      enqueueSnackbar("Please select at least one ticket", { variant: "warning" });
      return;
    }

    setLoading(true);

    const data = {
      event: event._id,
      ticketsCount: ordinaryQuantity + vipQuantity + vippremiumQuantity,
      ticketAmount: totalCost,
    };

    await createBooking(data);
    enqueueSnackbar("Booking successful!", { variant: "success" });

    onBookingSuccess();
    onClose();

    // Navigate after a short delay to allow snackbar to show
    setTimeout(() => {
      navigate("/my-bookings"); // Adjust path if needed
    }, 300);

    setLoading(false);
  };

  return isOpen ? (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      aria-labelledby="booking-modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative
          transform transition-all duration-300 ease-out scale-95 opacity-0
          animate-fadeInScale"
        style={{ animationFillMode: "forwards" }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-3xl font-bold focus:outline-none"
          aria-label="Close modal"
        >
          &times;
        </button>

        <h2
          id="booking-modal-title"
          className="text-3xl font-semibold mb-6 text-center text-gray-900"
        >
          Book Your Tickets
        </h2>

        <div className="mb-6 space-y-1 text-gray-700">
          <p>
            <span className="font-semibold">Event:</span> {event.name}
          </p>
          <p>
            <span className="font-semibold">Venue:</span> {event.venue}
          </p>
          <p>
            <span className="font-semibold">Date:</span>{" "}
            {new Date(event.date).toLocaleDateString()}
          </p>
        </div>

        <form onSubmit={handleBooking} className="space-y-5">
          {[
            {
              label: "Ordinary Ticket",
              price: event.ordinary,
              value: ordinaryQuantity, 
              setter: setOrdinaryQuantity,
            },
            {
              label: "VIP Ticket",
              price: event.vip,
              value: vipQuantity,
              setter: setVipQuantity,
            },
            {
              label: "VIP Premium Ticket",
              price: event.vippremium,
              value: vippremiumQuantity,
              setter: setVippremiumQuantity,
            },
          ].map(({ label, price, value, setter }) => (
            <div key={label} className="flex items-center justify-between">
              <label className="text-gray-800 font-medium">{label}: ${price}</label>
              <select
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={value}
                onChange={(e) => setter(Number(e.target.value))}
              >
                {[0, 1, 2, 3, 4].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <div className="text-right font-semibold text-xl text-gray-900">
            Total Price: ${totalCost}
          </div>

          <button
            type="submit"
            disabled={loading || totalCost === 0}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-colors duration-300 ${
              loading || totalCost === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.3s ease forwards;
        }
      `}</style>
    </div>
  ) : null;
};

export default BookingModal;
