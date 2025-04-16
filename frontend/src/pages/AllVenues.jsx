import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdInbox, MdOutlineAddBox, MdOutlineDelete, MdOutlineSearch } from 'react-icons/md';
import { useGetUserID } from "../hooks/useGetUserID";
import axios from 'axios';

import '../Venues.css'

import VenueBooking from '../components/VenueBooking';

const AllVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState([]);
  const [bookedEvents, setBookedEvents] = useState([]);
  const userID = useGetUserID();

  const saveVenue = async (venueID) => {
    try {
      console.log("Booking venue with ID:", venueID);
      const response = await axios.put(`http://localhost:5001/api/venues/${venueID}`, {}, {
        withCredentials: true, // Ensure cookies are sent for authentication
      });
      console.log("Response data:", response.data);

      // Update the venue state locally to reflect booking
      const updatedVenues = [...venues];
      const bookedVenue = updatedVenues.find(venue => venue._id.toString() === venueID);
      if (bookedVenue) {
        bookedVenue.isBooked = true;
        bookedVenue.isPaymentPending = true;
        bookedVenue.paymentTimeout = new Date(Date.now() + 2 * 60 * 1000); // Simulate payment timeout
      }
      setVenues(updatedVenues);

      fetchVenues(); // Refresh venues list after booking
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Internal server error");
        console.error("Server Error:", err.response.data);
      } else {
        setError("Network error, please try again later");
        console.error("Network Error:", err.message);
      }
    }
  };

  const fetchVenues = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5001/api/venues", {
        method: "GET",
        credentials: "include"
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setVenues(data);
    } catch (err) {
      setError(err.message || "Failed to fetch venues");
    } finally {
      setLoading(false);
    }
  };
  const handleUnbook = async (venueID) => {
    try {
      const response = await axios.delete(`http://localhost:5001/api/venues/${venueID}`, {
        withCredentials: true,
      });
      console.log("Venue unbooked successfully:", response.data);

    } catch (err) {
      console.error("Error unbooking venue:", err.response?.data || err.message);
    }

  };
  useEffect(() => {
    fetchVenues();
  }, []);

  const handleBooking = (venue) => {
    setSelectedEvent(venue);
    setIsModalOpen(true);
  };

  function getTimeLeft(paymentTimeout) {
    if (!paymentTimeout) return null;
    const timeout = new Date(paymentTimeout).getTime();
    const now = Date.now();
    const diff = timeout - now;
    if (diff <= 0) return null;
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }




  const handlePay = async (venueID) => {
    try {
      const response = await axios.post(`http://localhost:5001/api/venues/${venueID}/pay`, {}, {
        withCredentials: true,
      });
      console.log("Payment successful:", response.data);
      fetchVenues(); // Refresh venues list after payment
    } catch (err) {
      console.error("Error paying:", err.response?.data || err.message);
    }
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchVenues();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(intervalId);
  }, []);


  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {loading ? (
        <p className="text-center text-lg text-gray-700">Loading venues...</p>
      ) : error ? (
        <p className="text-center text-lg text-red-500">{error}</p>
      ) : (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Available Venues</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <li key={venue._id} className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{venue.name}</h3>
                <p className="text-gray-600 mb-1">
                  <span className="font-bold">City:</span> {venue.city}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-bold">Capacity:</span> {venue.capacity}
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-bold">Price:</span> ${venue.price}
                </p>



                {venue.isBooked && !venue.ispaymentPending && (
                  <div>

                    <p className=" bg-sky-100 text-blue mb-1"> Booked : Payment Pending</p>

                    <p className="text-gray-600 mb-1">
                      Payment due in: {getTimeLeft(venue.paymentTimeout) || "Expired"}
                    </p>

                  </div>

                )}


                {!venue.isBooked && (
                  <button
                    onClick={() => saveVenue(venue._id)}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors mt-2"
                  >
                    Book
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AllVenues;
