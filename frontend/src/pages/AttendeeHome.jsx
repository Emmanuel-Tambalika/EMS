
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { Link } from 'react-router-dom';
import { MdInbox,MdMail,MdPerson, MdOutlineAddBox, MdOutlineDelete, MdBook, MdOutlineSearch } from 'react-icons/md';
import { useAuthStore } from "../store/authStore";
import BookingModal from "../components/BookingModal.jsx"
import MyBookings from './MyBookings.jsx';

import '../App.css'
import react from '../assets/react.svg'

//Deal Wit Styling 
import 'react-calendar/dist/Calendar.css';
import '../eMailVerification.css';

import '../Events.css'

const AttendeeHome = () => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);

 //   const { user } = useAuthStore();
// <p className=' ml-10 md-20 mt-(-50) text-3xl font-bold'> Welcome {user.name}!</p>

     const handleBooking = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true)
    };




    // Fetch all events or filter by date
    const fetchEvents = async (date) => {
        setLoading(true);
        setError(null);

        try {
            const formattedDate = date ? date.toISOString().split('T')[0] : null;
            const url = formattedDate
                ? `http://localhost:5001/api/events?date=${formattedDate}`
                : `http://localhost:5001/api/events`;

            const response = await fetch(url);
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            setError('Select date To view Events');
        } finally {
            setLoading(false);
        }
    };


    // Handle date change
    const handleDateChange = (date) => {
        setSelectedDate(date);
        fetchEvents(date);
    };

    // Initial fetch
    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className="events-container">
            {/* Render modal */}
            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                event={selectedEvent}
            />
      
           <div>
                   <h1 className='landing-h1'><img className='logo-img'
                     src={react} alt="Company-logo" />EMS</h1>
                 </div>
           
                 <nav className='Nav-bar'>
           
                   <li className='link-li'> <Link to='/my-Bookings'> <MdBook size={40} color="blue" /> My Bookings</Link></li>
                   <li className='link-li'> <Link to='/MailPage'> <MdMail size={40} color="blue" /> Mail</Link></li>
                   <li className='link-li'><Link to='/profilePage'> <MdPerson size={40} color="blue" /> Profile</Link></li>
           
                 </nav>


            {/* Calendar Section */}
            <div className="calendar-section">
               

                <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                    className="react-calendar"
                />

                {/* Events List */}
                {loading ? (
                    <div className="loading-state">
                        <p>Loading events...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <p>{error}</p>
                    </div>
                ) :

                    (
                        <div className="events-list">
                            {events.length > 0 ? (
                                events.map(event => (
                                    <div key={event._id} className="event-card">
                                        <h3 className="event-title">{event.name}</h3>
                                        <div className="event-meta">
                                            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                                            <p><strong>Venue:</strong> {event.venue}</p>

                                            <label>Ticket  Prices :</label>

                                            <p><strong>Ordinary:</strong> ${event.ordinary}</p>
                                            <p><strong>Vip :</strong> ${event.vip}</p>
                                            <p><strong>Vip Premium:</strong> ${event.vippremium}</p>

                                            <p><strong>Tickets:</strong> {event.totalTickets} available</p>
                                        </div>
                                        <p className="event-description">{event.description}</p>
                                        {/* Button to trigger modal */}
                                        
                                      
                                        <button
                                            className="book-ticket"
                                            onClick={() => handleBooking(event)}>
                                      Book Ticket
                                        </button>

                                    </div>
                                ))
                            ) : (
                                <div  className="no-events1">
                                    <p className="no-events" >No events yet!</p>
                                </div>
                            )} 
                           
                        </div>
                    )

                }

            </div>



        </div>
    );
};

export default AttendeeHome;