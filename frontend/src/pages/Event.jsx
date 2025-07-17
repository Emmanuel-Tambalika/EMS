import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import react from "../assets/react.svg";

const Event = () => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expandedDescriptions, setExpandedDescriptions] = useState({});
    const navigate = useNavigate();

    const formatDateToLocalISO = (date) => {
        if (!date) return null;
        const offset = date.getTimezoneOffset() * 60000;
        return new Date(date - offset).toISOString().split("T")[0];
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
            if (!response.ok) throw new Error("Server error");
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            setError(error.message || "Failed to load events");
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        fetchEvents(date);
    };

    const toggleDescription = (eventId) => {
        setExpandedDescriptions((prev) => ({
            ...prev,
            [eventId]: !prev[eventId],
        }));
    };

    const handleBook = (eventId) => {
        // Always redirect to login
        navigate("/Log-InAttendee", { state: { fromEvent: eventId } });
    };

    const isEventPassed = (eventDate) => {
        const currentDate = new Date();
        const eventDateObj = new Date(eventDate);
        return eventDateObj.setHours(0, 0, 0, 0) < currentDate.setHours(0, 0, 0, 0);
    };

    useEffect(() => {
        fetchEvents(new Date());
    }, []);

    return (
        <div className="min-h-screen bg-blue-150">
            <div>
                <h1 className='landing-h1'><img className='logo-img'
                    src={react} alt="Company-logo" />EMS</h1>
            </div>

            {/* Event Content */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Events</h2>


                <div className="mb-30 mt-1 space-y-6">
                    <div className="flex flex-col items-center mr-100 mt-30 mb-2 space-y-2">
                        <Calendar
                            onChange={handleDateChange}
                            value={selectedDate}
                            className="ml-70 shadow-lg rounded-lg"
                        />
                    </div>
                </div>

                {/* Events Section */}
                {loading && (
                    <div className="text-center py-8 bg-blue-50 rounded-xl mb-6">
                        <p className="text-lg text-blue-600">Loading events...</p>
                    </div>
                )}
                {error && (
                    <div className="text-center py-8 bg-red-50 rounded-xl mb-6">
                        <p className="text-lg text-red-600">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {!loading && !error && (
                        events.length > 0 ? (
                            events.map((event) => (
                                <div
                                    key={event._id}
                                    className="border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all bg-white"
                                >
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        {event.name}
                                    </h3>

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
                                            <span className="font-semibold min-w-[70px]">
                                                Tickets:
                                            </span>
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
                                                ? "max-h-screen"
                                                : "max-h-20 overflow-hidden"
                                            }`}
                                    >
                                        <p className="text-green-500 lg-50">
                                            Description and Take Aways:
                                        </p>
                                        {event.description}
                                    </div>
                                    {event.description.length > 100 && (
                                        <button
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm mb-4"
                                            onClick={() => toggleDescription(event._id)}
                                        >
                                            {expandedDescriptions[event._id]
                                                ? "Show Less"
                                                : "Read More"}
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleBook(event._id)}
                                        className={`w-full px-4 py-2 rounded-lg transition-colors text-center ${isEventPassed(event.date) || event.totalTickets <= 0
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-blue-600 hover:bg-blue-700 text-white"
                                            }`}
                                        disabled={isEventPassed(event.date) || event.totalTickets <= 0}
                                    >
                                        {isEventPassed(event.date)
                                            ? "Event Ended"
                                            : event.totalTickets <= 0
                                                ? "Sold Out"
                                                : "Book Ticket"}
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
            </div>
        </div>
    );
};

export default Event;
