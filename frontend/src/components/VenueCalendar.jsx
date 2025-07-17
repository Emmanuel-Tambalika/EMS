import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { MdClose } from 'react-icons/md';
import axios from 'axios';
// Helper: format a Date object to 'YYYY-MM-DD' (local time)
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0'); // Months are 0-based
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};
// Helper: parse ISO string or date string to local 'YYYY-MM-DD'
const normalizeDateString = (dateStr) => {
  // Create Date object and format to local date string
  const date = new Date(dateStr);
  return formatDate(date);
};
const VenueCalendar = ({ isOpen, onClose, venue, onBookingSuccess }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookedDates, setBookedDates] = useState([]); // array of 'YYYY-MM-DD' strings
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // Normalize booked dates on venue change
  useEffect(() => {
    if (venue) {
      const normalizedBookedDates = (venue.bookedDates || []).map(normalizeDateString);
      setBookedDates(normalizedBookedDates);
      setSelectedDate(null);
      setError(null);
    }
  }, [venue]);
  if (!isOpen) return null;
  // Check if date is before today (local)
  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };
  // Check if date is booked
  const isBookedDate = (date) => {
    const dateStr = formatDate(date);
    return bookedDates.includes(dateStr);
  };
  // Calendar tile class based on date status
  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return '';
    if (isBookedDate(date)) return 'calendar-day-booked';
    if (isPastDate(date)) return 'calendar-day-past';
    return 'calendar-day-available';
  };
  // Disable past and booked dates
  const tileDisabled = ({ date, view }) => {
    if (view !== 'month') return false;
    return isPastDate(date) || isBookedDate(date);
  };

  // Handle booking request
  const handleBooking = async () => {
    if (!selectedDate) return;
    setLoading(true);
    setError(null);
    try {
      const bookingDateStr = formatDate(selectedDate);

      if (bookedDates.includes(bookingDateStr)) {
        setError('Selected date is already booked.');
        setLoading(false);
        return;
      }

      await axios.put(
        `http://localhost:5001/api/venues/${venue._id}/book`,
        { date: bookingDateStr },
        { withCredentials: true }
      );

      setBookedDates(prev => [...prev, bookingDateStr]);
      setSelectedDate(null);
      onBookingSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-6"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      }}
    >
      <div
        className="relative w-full max-w-4xl bg-white bg-opacity-40 rounded-3xl shadow-lg p-8"
        style={{
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          color: '#111827',
          maxHeight: '90vh',
          overflowY: 'auto',
          zIndex: 60,
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-700 hover:text-gray-900 transition"
          aria-label="Close modal"
        >
          <MdClose size={28} />
        </button>

        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-900 bg-sky-100 px-25 mr-80">
          Venue Calendar
        </h1>
        <h2 className="text-3xl font-semibold text-center text-blue-500 mr-85">
          Venue name: {venue.name}
        </h2>

        {/* Details & Booking Section */}
        <div className="mr-80 md:w-1/2 flex flex-col justify-start max-w-md mx-auto">
          <div>
            <p className="text-lg">
              <span className="font-semibold">Price:</span> ${venue.price}/day
            </p>

            <p className="text-lg">
              <span className="font-semibold">Selected Date:</span>{' '}
              {selectedDate ? selectedDate.toDateString() : <span className="italic text-gray-600">None</span>}
            </p>
            <p className="text-lg">
              <span className="font-semibold">Status:</span>{' '}
              {!selectedDate && <span className="text-gray-600">Select a date</span>}
              {selectedDate && isPastDate(selectedDate) && (
                <span className="text-gray-500">Past Date (Unavailable)</span>
              )}
              {selectedDate && isBookedDate(selectedDate) && (
                <span className="text-red-700 font-semibold">Booked</span>
              )}
              {selectedDate && !isPastDate(selectedDate) && !isBookedDate(selectedDate) && (
                <span className="text-green-700 font-semibold">Available</span>
              )}
            </p>

            {error && <p className="text-red-700 mt-4 font-medium">{error}</p>}
          </div>

          {/* Calendar Section */}
          <div className="ml-40 md:w-1/2 flex justify-center">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileClassName={tileClassName}
              tileDisabled={tileDisabled}
              minDate={new Date()}
              className="ml-70 shadow-lg rounded-lg"
            />
          </div>

          <button
            disabled={
              !selectedDate ||
              isPastDate(selectedDate) ||
              isBookedDate(selectedDate) ||
              loading
            }
            onClick={handleBooking}
            className={`mt-6 py-3 rounded-lg font-semibold transition w-full ${
              !selectedDate ||
              isPastDate(selectedDate) ||
              isBookedDate(selectedDate) ||
              loading
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Booking...' : 'Book Now'}
          </button>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 mt-10 text-sm text-gray-900 select-none">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-green-400 rounded-sm border border-gray-300"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-red-600 rounded-sm border border-gray-300"></div>
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-400 rounded-sm border border-gray-300"></div>
            <span>Past (Unavailable)</span>
          </div>
        </div>

        {/* Custom calendar day styles */}
        <style>{`
          .calendar-day-past {
            background-color: #e2e8f0 !important; /* gray-300 */
            color: #94a3b8 !important; /* gray-400 */
            cursor: not-allowed !important;
          }
          .calendar-day-booked {
            background-color: #dc2626 !important; /* red-600 */
            color: white !important;
            cursor: not-allowed !important;
          }
          .calendar-day-available {
            background-color: #4ade80 !important; /* green-400 */
            color: black !important;
            cursor: pointer !important;
          }
          .react-calendar__tile--active {
            background-color: #2563eb !important; /* blue-600 */
            color: white !important;
          }
          /* Override for booked dates when disabled */
          .react-calendar__tile--disabled.calendar-day-booked {
            background-color: #dc2626 !important;
            color: white !important;
          }
          /* Override for past dates when disabled */
          .react-calendar__tile--disabled.calendar-day-past {
            background-color: #e2e8f0 !important;
            color: #94a3b8 !important;
          }
          /* Prevent active state from overriding booked dates */
          .calendar-day-booked.react-calendar__tile--active {
            background-color: #dc2626 !important;
            color: white !important;
          }
          .react-calendar {
            background: rgba(255, 255, 255, 0.85);
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .react-calendar__month-view__weekdays {
            font-weight: 600;
            color: #2563eb;
            border-bottom: 1px solid #cbd5e1;
            margin-bottom: 8px;
          }
          .react-calendar__tile {
            font-weight: 600;
            border-radius: 8px;
            transition: background-color 0.3s ease;
          }
          .react-calendar__tile:enabled:hover,
          .react-calendar__tile:enabled:focus {
            background-color: #93c5fd;
            color: #1e40af;
            outline: none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default VenueCalendar;

