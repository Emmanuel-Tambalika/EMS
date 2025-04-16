import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
      setError(err.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (bookingId) => {
    try {
      await axios.post(
        `http://localhost:5001/api/bookings/${bookingId}/pay`,
        {},
        { withCredentials: true }
      );
      enqueueSnackbar("Payment successful", { variant: "success" });
      fetchBookings();
    } catch (err) {
      enqueueSnackbar("Payment failed", { variant: "error" });
    }
  };

  const handleDelete = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      await axios.delete(`http://localhost:5001/api/bookings/${bookingId}`, {
        withCredentials: true,
      });
      enqueueSnackbar("Booking deleted", { variant: "info" });
      fetchBookings();
    } catch (err) {
      enqueueSnackbar("Failed to delete booking", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getTimeLeft = (paymentTimeout) => {
    if (!paymentTimeout) return null;
    const diff = new Date(paymentTimeout).getTime() - Date.now();
    if (diff <= 0) return null;
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h2 className="text-3xl mb-6">My Bookings</h2>
      {loading && <p>Loading bookings...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <ul className="space-y-4">
        {bookings.map((booking) => {
          const { event } = booking;
          const paymentDue =
            booking.isPaymentPending && booking.paymentTimeout
              ? new Date(booking.paymentTimeout).getTime() - Date.now()
              : 0;
          const isExpired = paymentDue <= 0 && booking.isPaymentPending;

          return (
            <li
              key={booking._id}
              className="bg-white p-4 rounded shadow flex flex-col md:flex-row md:justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold">{event.name}</h3>
                <p>Venue: {event.venue}</p>
                <p>
                  Tickets: {booking.ticketsCount} | Total: ${booking.ticketAmount}
                </p>
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                {isExpired && (
                  <p className="text-red-600 font-bold">Booking expired (payment overdue)</p>
                )}
                {!booking.isPaymentPending && booking.isPaid && (
                  <p className="text-green-600 font-bold">Payment Completed</p>
                )}
                {booking.isPaymentPending && !isExpired && (
                  <p>
                    Payment due in:{" "}
                    {Math.floor(paymentDue / 60000)}:
                    {Math.floor((paymentDue % 60000) / 1000)
                      .toString()
                      .padStart(2, "0")}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                {booking.isPaymentPending && !isExpired && (
                  <button
                    onClick={() => handlePay(booking._id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Pay
                  </button>
                )}
                <button
                  onClick={() => handleDelete(booking._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MyBookings;
