import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Calendar from 'react-calendar';
import { MdBook, MdMail, MdPerson, MdHome } from 'react-icons/md';
import { useAuthStore } from "../store/authStore";
import BookingModal from "../components/BookingModal.jsx";
import 'react-calendar/dist/Calendar.css';
import react from '../assets/react.svg';

const AttendeeHome = () => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedDescriptions, setExpandedDescriptions] = useState({});
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: "/AttendeePage", icon: MdHome, label: "Home" },
        { path: "/my-Bookings", icon: MdBook, label: "My Bookings" },
        { path: "/emails", icon: MdMail, label: "Mail" },
        { path: "/profilePage", icon: MdPerson, label: "Profile" }
    ];

    const formatDateToLocalISO = (date) => {
        if (!date) return null;
        const offset = date.getTimezoneOffset() * 60000;
        return new Date(date - offset).toISOString().split('T')[0];
    };

    const fetchEvents = async (date) => {
        setLoading(true);
        setError(null);
        try {
            const formattedDate = formatDateToLocalISO(date);
            const url = formattedDate
                ? `http://localhost:5001/api/events?date=${formattedDate}`
                : `http://localhost:5001/api/events`;

            const response = await fetch(url);
            if (!response.ok) throw new Error('Server error');
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            setError(error.message || 'Failed to load events');
        } finally {
            setLoading(false);
        } 
    };
  
    const handleDateChange = (date) => {
        setSelectedDate(date);
        fetchEvents(date);
    };

    const toggleDescription = (eventId) => {
        setExpandedDescriptions(prev => ({
            ...prev,
            [eventId]: !prev[eventId]
        }));
    };

    const handleBooking = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    //  helper function to check if event date has passed
    const isEventPassed = (eventDate) => {
        const currentDate = new Date();
        const eventDateObj = new Date(eventDate);
        // Remove time components for date-only comparison
        return eventDateObj.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0);
    };


    // Update event tickets after booking
    const handleBookingSuccess = (updatedEvent) => {
        setEvents(prevEvents =>
            prevEvents.map(event =>
                event._id === updatedEvent._id
                    ? { ...event, totalTickets: updatedEvent.totalTickets }
                    : event
            )
        );
        setIsModalOpen(false);
    };

    useEffect(() => {
       
        fetchEvents(new Date());
        // eslint-disable-next-line
    }, []);

    return (
        <div className="flex min-h-screen">
            <Sidebar navLinks={navLinks} isActive={isActive} />

            <div className="ml-56 flex-1 p-6">
                {/* Calendar Section */}
                <div className="flex flex-col items-center mr-40 mt-0 mb-2 space-y-6">
                    <Calendar
                        onChange={handleDateChange}
                        value={selectedDate}
                        className="border-none rounded-xl shadow-lg p-5 w-full bg-white"
                        showWeekNumbers
                    />
                </div>

                {/* Events Section */}
                {loading && (
                    <div className="text-center py-8 bg-blue-50 rounded-xl ">
                        <p className="text-lg text-blue-600">Loading events...</p>
                    </div>
                )}

                {error && (
                    <div className="text-center py-8 bg-red-50 rounded-xl mb-6">
                        <p className="text-lg text-red-600">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {!loading && !error && (
                        events.length > 0 ? (
                            events.map(event => (
                                <div
                                    key={event._id}
                                    className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all bg-white"
                                >
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">{event.name}</h3>

                                    <div className="space-y-2 mb-4">
                                        <p className="flex items-start">
                                            <span className="font-semibold min-w-[70px]">Date:</span>
                                            <span>{new Date(event.date).toLocaleDateString()}</span>
                                        </p>
                                        <p className="flex items-start">
                                            <span className="font-semibold min-w-[70px]">Venue:</span>
                                            <span>{event.venue}</span>
                                        </p>
                                        <p className="flex items-start">
                                            <span className="font-semibold min-w-[70px]">Tickets:</span>
                                            <span>{event.totalTickets} available</span>
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full text-center">
                                            Ordinary: ${event.ordinary}
                                        </span>
                                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full text-center">
                                            VIP: ${event.vip}
                                        </span>
                                        <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full text-center">
                                            Premium: ${event.vippremium}
                                        </span>
                                    </div>

                                    <div
                                        className={`text-gray-600 mb-3 transition-all duration-300 ${expandedDescriptions[event._id]
                                                ? 'max-h-screen'
                                                : 'max-h-20 overflow-hidden'
                                            }`}
                                    >
                                        <p className='text-green-500 lg-50'>Description and Take Aways:</p>
                                        {event.description}
                                    </div>

                                    {event.description.length > 100 && (
                                        <button
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm mb-4"
                                            onClick={() => toggleDescription(event._id)}
                                        >
                                            {expandedDescriptions[event._id] ? 'Show Less' : 'Read More'}
                                        </button>
                                    )}

                                    <button
                                        className={`w-full px-4 py-2 rounded-lg transition-colors text-center ${isEventPassed(event.date) || event.totalTickets <= 0
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                            }`}
                                        onClick={() => handleBooking(event)}
                                        disabled={isEventPassed(event.date) || event.totalTickets <= 0}
                                    >
                                        {isEventPassed(event.date)
                                            ? 'Event Ended'
                                            : event.totalTickets <= 0
                                                ? 'Sold Out'
                                                : 'Book Ticket'}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-16 text-gray-500">
                                <p className="text-xl">No events found for selected date</p>
                            </div>
                        )
                    )}
                </div>

                <BookingModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    event={selectedEvent}
                    onBookingSuccess={handleBookingSuccess}
                />
            </div>
        </div>
    );
};

const Sidebar = ({ navLinks, isActive }) => (
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
                                className={`flex items-center p-3 rounded-lg transition-colors ${isActive(link.path)
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'hover:bg-gray-100 hover:text-blue-600 text-gray-600'
                                    }`}
                            >
                                <Icon className={`text-2xl mr-3 ${isActive(link.path) ? 'text-blue-500' : 'text-gray-500'
                                    }`} />
                                <span>{link.label}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    </div>
);

export default AttendeeHome;

