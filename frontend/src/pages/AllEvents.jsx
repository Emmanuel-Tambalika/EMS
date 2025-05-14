import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { Link } from 'react-router-dom';
import { MdOutlineAddBox } from 'react-icons/md';
import { useAuthStore } from "../store/authStore";
import EditEvent from '../components/EditEvent.jsx';
import DeleteEvent from '../components/DeleteEvent.jsx';
import 'react-calendar/dist/Calendar.css';

const AllEvents = () => {
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

     const [soldTickets,setSoldTickets]=useState(0)
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [expandedDescriptions, setExpandedDescriptions] = useState({});
    const { user } = useAuthStore();
 
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

    const handleUpdateSuccess = () => {
        fetchEvents(selectedDate);
        setIsEditModalOpen(false);
    };

    const handleDeleteSuccess = () => {
        fetchEvents(selectedDate);
        setIsDeleteModalOpen(false);
    };

    useEffect(() => {
        fetchEvents(new Date());
        
    }, []);
   
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Calendar Section */}
            <div className="mb-10  mt-1 space-y-6">
                <div className="flex flex-col items-center mr-100 mt-30 mb-2 space-y-2">
                    <Calendar
                        onChange={handleDateChange}
                        value={selectedDate}
                       className="ml-70 shadow-lg rounded-lg"
                    />
                </div>
                
                <div className="text-center">
                    <Link to='/create-Events' className="inline-flex flex-col items-center group">
                        <MdOutlineAddBox className="text-5xl mt-2 mr-100 text-blue-600 group-hover:text-blue-800 transition-all group-hover:scale-110" />
                        <p className="mt-2 mr-100 font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                            Create Event
                        </p>
                    </Link>
                </div>
            </div>

            {/* Events Section */}
            <div>
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
                                            <p className="flex items-start">
                                            <span className="font-semibold min-w-[70px]">Tickets Sold :</span>
                                            <span>{event.soldTickets}  </span>
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
                                        className={`text-gray-600 mb-3 transition-all duration-300 ${
                                            expandedDescriptions[event._id] 
                                                ? 'max-h-screen' 
                                                : 'max-h-20 overflow-hidden'
                                        }`}
                                    >
                                    <p className='text-green-500 lg-50'> Description and Take Aways : </p>  {event.description}
                                    </div>
                                    
                                    {event.description.length > 100 && (
                                        <button 
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm mb-4"
                                            onClick={() => toggleDescription(event._id)}
                                        >
                                            {expandedDescriptions[event._id] ? 'Show Less' : 'Read More'}
                                        </button>
                                    )}

                                    <div className="flex gap-3 mt-auto">
                                        <button
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-1 text-center"
                                            onClick={() => {
                                                setSelectedEvent(event);
                                                setIsEditModalOpen(true);
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex-1 text-center"
                                            onClick={() => {
                                                setSelectedEvent(event);
                                                setIsDeleteModalOpen(true);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-16 text-gray-500">
                                <p className="text-xl bg-yellow-300">No events found</p>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Modals */}
            <EditEvent
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                event={selectedEvent}
                onUpdate={handleUpdateSuccess}
            />
            <DeleteEvent
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                event={selectedEvent}
                onDeleteSuccess={handleDeleteSuccess}
            />
        </div>  
    );
};

export default AllEvents;
