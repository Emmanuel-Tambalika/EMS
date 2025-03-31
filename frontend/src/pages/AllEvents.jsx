import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { Link } from 'react-router-dom';
import { MdInbox, MdOutlineAddBox, MdOutlineDelete, MdOutlineSearch } from 'react-icons/md';


import BookingModal from "../components/BookingModal.jsx"
 

import 'react-calendar/dist/Calendar.css';
import '../eMailVerification.css';

const AllEvents = () => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

     const [isModalOpen, setIsModalOpen] = useState(false);

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
            setError('No Events Found');
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
       />


            <div>
            <Link to='/create-Events'>
                  <MdOutlineAddBox className='create-event-button'/>
                  </Link>
              </div>
          

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
                                    <p><strong>Price:</strong> ${event.price}</p>
                                    <p><strong>Tickets:</strong> {event.totalTickets - event.bookedTickets} available</p>
                                </div>
                                <p className="event-description">{event.description}</p>
                                {/* Button to trigger modal */}
          <button 
                className="book-ticket" 
              onClick={() => setIsModalOpen(true)}>
                  Book Ticket
         </button>

                                
                            </div>
                        ))
                    ) : (
                        <div className="no-events">
                            <p >No events found</p>
                        </div>
                    )}
                </div>
            )
            
            }
                
            </div>

            {/* Events List */}

          
        </div>
    );
};

export default AllEvents;
