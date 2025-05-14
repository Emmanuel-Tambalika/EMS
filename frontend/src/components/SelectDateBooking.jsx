// components/SelectDateBooking.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

const formatDateKey = (year, month, day) => {
  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
};
  
const SelectDateBooking = ({ isOpen, onClose, venue, onBooked }) => {
  const navigate = useNavigate();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const bookedDates = venue?.bookedDates || [];

  useEffect(() => {
    setSelectedDate(null);
    setError(null);
  }, [venue, isOpen]);

  if (!isOpen || !venue) return null;

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const isBooked = (day) => {
    if (!day) return false;
    const key = formatDateKey(currentYear, currentMonth, day);
    return bookedDates.includes(key);
  };

  const isPastDate = (day) => {
    if (!day) return false;
    const date = new Date(currentYear, currentMonth, day);
    return date < new Date(today.setHours(0, 0, 0, 0));
  };

  const onDateClick = (day) => {
    if (!day) return;
    if (isBooked(day) || isPastDate(day)) return;
    const key = formatDateKey(currentYear, currentMonth, day);
    setSelectedDate(key);
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', {
    month: 'long',
  });

  const handleBook = async () => {
    if (!selectedDate) {
      setError('Please select a date to book.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.put(
        `http://localhost:5001/api/venues/${venue._id}/book`,
        { date: selectedDate }, // send selected date in body
        { withCredentials: true }
      );

      onBooked(selectedDate);
      onClose();
      navigate('/my-venues');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
      console.error('Booking error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="select-date-booking-title"
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center mb-4">
          <h2 id="select-date-booking-title" className="text-xl font-bold">
            Book Venue: {venue.name}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-600 hover:text-gray-900 text-2xl leading-none"
          >
            &times;
          </button>
        </header>

        {error && (
          <div className="mb-4 text-red-600 font-semibold">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <button
            onClick={prevMonth}
            className="text-gray-600 hover:text-gray-800 font-bold"
            aria-label="Previous Month"
          >
            &#8592;
          </button>
          <h3 className="text-lg font-semibold">
            {monthName} {currentYear}
          </h3>
          <button
            onClick={nextMonth}
            className="text-gray-600 hover:text-gray-800 font-bold"
            aria-label="Next Month"
          >
            &#8594;
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500 mb-2">
          {WEEK_DAYS.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {calendarDays.map((day, idx) => {
            if (!day) return <div key={idx} className="py-2" />;

            const booked = isBooked(day);
            const past = isPastDate(day);
            const selected = selectedDate === formatDateKey(currentYear, currentMonth, day);

            let bgColor = 'cursor-pointer hover:bg-blue-100';
            let textColor = 'text-gray-900';

            if (past) {
              bgColor = 'bg-gray-200 cursor-not-allowed';
              textColor = 'text-gray-400';
            } else if (booked) {
              bgColor = 'bg-red-500 cursor-not-allowed';
              textColor = 'text-white font-bold';
            } else if (selected) {
              bgColor = 'bg-green-600';
              textColor = 'text-white font-bold';
            } else {
              bgColor = 'bg-green-200 hover:bg-green-300 cursor-pointer';
              textColor = 'text-gray-900';
            }

            return (
              <div
                key={idx}
                className={`py-2 rounded ${bgColor} ${textColor}`}
                title={
                  past
                    ? 'Past Date'
                    : booked
                    ? 'Booked'
                    : selected
                    ? 'Selected'
                    : 'Available'
                }
                onClick={() => onDateClick(day)}
              >
                {day}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleBook}
            className={`px-4 py-2 rounded text-white ${
              selectedDate && !loading ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'
            }`}
            disabled={!selectedDate || loading}
          >
            {loading ? 'Booking...' : 'Book'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectDateBooking;
