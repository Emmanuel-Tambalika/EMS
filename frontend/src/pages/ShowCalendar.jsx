import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { Link } from 'react-router-dom';
import { MdOutlineAddBox } from 'react-icons/md';
import { useAuthStore } from "../store/authStore";
import EditEvent from '../components/EditEvent.jsx';
import DeleteEvent from '../components/DeleteEvent.jsx';
import 'react-calendar/dist/Calendar.css';


const ShowCalendar = () => {
const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [selectedEvent, setSelectedEvent] = useState(null);


  return (


    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Calendar Section */}
                <div className="mb-10 mt-1 space-y-6">
                    <div className="flex flex-col items-center mr-40 mt-40 mb-2 space-y-6">
                        <Calendar
                            onChange={handleDateChange}
                            value={selectedDate}
                            className="border-none rounded-xl shadow-lg p-5 w-full bg-white"
                        />
                    </div>


   </div>

    </div>
  )
}

export default ShowCalendar