import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const SucessCheckout = () => {
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
    const intervalId = setInterval(fetchBookedVenues, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {loading && <p className="text-center text-lg text-gray-700">Loading...</p>}
      {error && <p className="text-center text-lg text-red-500">{error}</p>}
      
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">  Paid Venues   </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookedVenues.map((venue) => (
            <li key={venue._id} className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{venue.name}</h3>
              <p className="text-gray-600 mb-1">City: {venue.city}</p>
              <p className="text-gray-600 mb-1">Price: ${venue.price}</p>
              
              {venue.isPaymentPending ? (
                <>
                  <p className="text-yellow-600 mb-1">
                    Payment due: {getTimeLeft(venue.paymentTimeout) || 'Expired'}
                  </p>
                  <button
                    onClick={() => navigate('/check-out', { state: { venueId: venue._id } })}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-2"
                  >
                    Pay For Venue .
                  </button>
                </>
              ) : (
                <p className="text-green-600 mb-1">Payment Completed</p>
              )}
              
              <button
                onClick={() => handleUnbook(venue._id)}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mt-2"
              >
               UnBook Venue 
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SucessCheckout;
