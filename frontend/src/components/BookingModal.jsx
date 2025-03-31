// BookingModal.js
import React, { useState } from 'react';

const BookingModal = ({ isOpen, onClose }) => {
  const [ticketType, setTicketType] = useState('ordinary');
  const [quantity, setQuantity] = useState(1);

  // Price configuration
  const prices = {
    ordinary: 50,
    vip: 150,
    premium_vip: 300
  };

  // Calculate total price
  const totalPrice = prices[ticketType] * quantity;

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    const bookingData = {
      
      ticketType,
      quantity,
      totalPrice
    };
    console.log('Booking Data:', bookingData);
    // Add your API call or form submission logic here
    onClose();
  };

  return isOpen ? (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Book Your Ticket</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form className="booking-form" onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Ticket Type:</label>
            <select 
              value={ticketType}
              onChange={(e) => setTicketType(e.target.value)}
            >
              <option value="ordinary">Ordinary ($50)</option>
              <option value="vip">VIP ($150)</option>
              <option value="premium_vip">Premium VIP ($300)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Quantity:</label>
            <select 
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <div className="price-summary">
            <p>
              <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
            </p>
          </div>
          <button type="submit" className="submit-btn">Confirm Booking</button>
        </form>
      </div>
    </div>
  ) : null;
};

export default BookingModal;
