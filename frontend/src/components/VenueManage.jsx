// components/VenueManage.jsx
import React from 'react';
import InteractiveTailwindCalendar from './InteractiveTailwindCalendar';

const VenueManage = ({ isOpen, onClose, venue }) => {
  if (!isOpen || !venue) return null;

  // Example: Pass booked dates array to calendar if available
  // For demo, we assume venue.bookedDates is an array of ISO date strings
  const bookedDates = venue.bookedDates || [];

  return (  
    <div
      className="fixed mt-10 ml-30 inset-0 bg-white-200 bg-opacity- flex items-center justify-center z-50"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="venue-manage-title"
    >
      <div
        className="bg-white ml-40  rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center mb-4">
          <h2 id="venue-manage-title" className="text-xl font-bold">
            Manage Venue: {venue.name}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-600 hover:text-gray-900 text-2xl leading-none"
          >
            &times;
          </button>
        </header>

        <section className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Booking Status</h3>
          {venue.isBooked ? (
            <p className="text-red-600 font-semibold">
              This venue is currently <span className="uppercase">BOOKED</span>.
            </p>
          ) : (
            <p className="text-green-600 font-semibold">
              This venue is <span className="uppercase">available</span>.
            </p>
          )}


          
      
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Booking Calendar</h3>
          
          <InteractiveTailwindCalendar 
          bookedDates={bookedDates} 
          />
        </section>
        
      </div>
    </div>
  );
};

export default VenueManage;
