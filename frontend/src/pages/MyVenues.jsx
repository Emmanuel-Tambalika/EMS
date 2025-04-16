import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyVenues = () => {
  const [bookedVenues, setBookedVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate time left for payment timeout
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
    setError(null);
    try {
      const response = await axios.get("http://localhost:5001/api/venues/booked", { withCredentials: true });
      setBookedVenues(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch booked venues");
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (venueID) => {
    try {
      await axios.post(`http://localhost:5001/api/venues/${venueID}/pay`, {}, { withCredentials: true });
      fetchBookedVenues();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Payment failed");
    }
  };

  const handleUnbook = async (venueID) => {
    try {
      await axios.delete(`http://localhost:5001/api/venues/${venueID}`, { withCredentials: true });
      fetchBookedVenues();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unbooking failed");
    }
  };

  useEffect(() => {
    fetchBookedVenues();
    const intervalId = setInterval(fetchBookedVenues, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {loading ? (
        <p className="text-center text-lg text-gray-700">Loading booked venues...</p>
      ) : error ? (
        <p className="text-center text-lg text-red-500">{error}</p>
      ) : (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">My Booked Venues</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookedVenues.map((venue) => {
              const timeLeft = getTimeLeft(venue.paymentTimeout);
              const isExpired = !timeLeft && venue.isPaymentPending; // expired if no time left but payment still pending

              return (
                <li key={venue._id} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{venue.name}</h3>
                  <p className="text-gray-600 mb-1"><strong>City:</strong> {venue.city}</p>
                  <p className="text-gray-600 mb-1"><strong>Capacity:</strong> {venue.capacity}</p>
                  <p className="text-gray-600 mb-1"><strong>Price:</strong> ${venue.price}</p>

                  {isExpired ? (
                    <>
                      <p className="text-red-600 font-bold mb-1">Expired</p>
                      <button
                        onClick={() => handleUnbook(venue._id)}
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors mt-2"
                      >
                        Unbook
                      </button>
                    </>
                  ) : venue.isPaymentPending ? (
                    <div>
                      <p className="text-gray-600 mb-1">
                        Payment due in: {timeLeft}
                      </p>
                      <button
                        onClick={() => handlePay(venue._id)}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors mt-2"
                      >
                        Pay
                      </button>
                      <button
                        onClick={() => handleUnbook(venue._id)}
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors mt-2 ml-2"
                      >
                        Unbook
                      </button>
                    </div>
                  ) : (
                    <>
                     
                      <button
                        onClick={() => handleUnbook(venue._id)}
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors mt-2"
                      >
                       Remove Venue
                      </button>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyVenues;
