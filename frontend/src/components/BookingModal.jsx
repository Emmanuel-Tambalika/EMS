// BookingModal.js
import React, { useState } from 'react';

const BookingModal = ({ isOpen, onClose, event }) => {
  const [ordinaryQuantity, setOrdinaryQuantity] = useState(0);
  const [vipQuantity, setVipQuantity] = useState(0);
  const [vippremiumQuantity, setVippremiumQuantity] = useState(0);



  const totalCost = (ordinaryQuantity * event.ordinary) + (vipQuantity * event.vip) + (vippremiumQuantity * event.vippremium);

 // Handle Booking Conformation .

 //Save Event 

 
  //Update TotalTickets for the Booked Event .
 
  return isOpen ? (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className='yourTicket'>Book Your Ticket/s</h2>
          <div className='event_Name '>
            <p> Event Name : {event.name}</p>

          </div>


          <div className='event_Name1'>
            <p> Event Venue : {event.venue}</p>

          </div>
          <button className="close-btn " onClick={onClose}>×</button>
        </div>
        <form className="booking-form" >



          <div className="form-group">
            <label>Ordinary Ticket: ${event.ordinary}</label>
            <select
              value={ordinaryQuantity}
              onChange={(e) => setOrdinaryQuantity(e.target.value)}
            >
              {[0, 1, 2, 3, 4].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Vip Ticket: ${event.vip}</label>
            <select
              value={vipQuantity}
              onChange={(e) => setVipQuantity(e.target.value)}
            >
              {[0, 1, 2, 3, 4].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>


          <div className="form-group">
            <label>Vip Premium Ticket: ${event.vippremium}</label>
            <select
              value={vippremiumQuantity}
              onChange={(e) => setVippremiumQuantity(e.target.value)}
            >
              {[0, 1, 2, 3, 4].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>


          <div className="price-summary">
            <p>
              <strong>Total Price:</strong> ${totalCost}
            </p>
          </div>


          <button 
          className="submit-btn">
            
            Confirm Booking
            
            </button>
        </form>
      </div>
    </div>
  ) : null;
};

export default BookingModal;
