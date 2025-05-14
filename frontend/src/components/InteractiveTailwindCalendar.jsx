import React, { useState, useEffect } from 'react';

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

const formatDateKey = (year, month, day) => {
  // Format as YYYY-MM-DD with leading zeros
  const mm = String(month + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
};

const InteractiveTailwindCalendar = ({ bookedDates = [], onSelectedDatesChange }) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  // Selected dates stored as array of ISO strings YYYY-MM-DD
  const [selectedDates, setSelectedDates] = useState([]);

  useEffect(() => {
    if (onSelectedDatesChange) {
      onSelectedDatesChange(selectedDates);
    }
  }, [selectedDates, onSelectedDatesChange]);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  // Build calendar grid with blanks for offset
  const calendarDays = [];
  for (let i = 0; i < firstDayIndex; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const isBooked = (day) => {
    if (!day) return false;
    const key = formatDateKey(currentYear, currentMonth, day);
    return bookedDates.includes(key);
  };

  const isSelected = (day) => {
    if (!day) return false;
    const key = formatDateKey(currentYear, currentMonth, day);
    return selectedDates.includes(key);
  };

  const toggleDate = (day) => {
    if (!day) return;
    const key = formatDateKey(currentYear, currentMonth, day);
    if (isBooked(day)) return; // Cannot select booked dates
    setSelectedDates((prev) =>
      prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key]
    );
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

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-4 select-none">
      <header className="flex justify-between items-center mb-4">
        <button
          onClick={prevMonth}
          className="text-gray-600 hover:text-gray-800 font-bold"
          aria-label="Previous Month"
        >
          &#8592;
        </button>
        <h2 className="text-lg font-semibold">
          {monthName} {currentYear}
        </h2>
        <button
          onClick={nextMonth}
          className="text-gray-600 hover:text-gray-800 font-bold"
          aria-label="Next Month"
        >
          &#8594;
        </button>
      </header>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500">
        {WEEK_DAYS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mt-1">
        {calendarDays.map((day, idx) => {
          if (!day) return <div key={idx} className="py-2" />; // empty cell

          const booked = isBooked(day);
          const selected = isSelected(day);

          // Determine colors
          let bgColor = 'cursor-pointer hover:bg-blue-100';
          let textColor = 'text-gray-900';

          if (booked) {
            bgColor = 'bg-red-500 cursor-not-allowed';
            textColor = 'text-white font-bold';
          } else if (selected) {
            bgColor = 'bg-green-500';
            textColor = 'text-white font-bold';
          } else {
            bgColor = 'bg-green-200 hover:bg-green-300 cursor-pointer';
            textColor = 'text-gray-900';
          }

          return (
            <div
              key={idx}
              className={`py-2 rounded ${bgColor} ${textColor}`}
              title={booked ? 'Booked' : selected ? 'Selected' : 'Available'}
              onClick={() => toggleDate(day)}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center space-x-6 text-sm select-none">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded" />
          <span>Booked</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded" />
          <span>Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-200 rounded border border-green-400" />
          <span>Available</span>
        </div>
      </div>
    </div>
  );
};

export default InteractiveTailwindCalendar;
