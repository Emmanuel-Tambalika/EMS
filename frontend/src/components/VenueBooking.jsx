import React ,{useState} from 'react'

const VenueBooking = ({ isOpen, onClose ,venue}) => {


  return isOpen ?(


    <div>
<div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className='yourTicket'>Book Your  Venue </h2>
          <div className='event_Name '>
            <p> Venue Name : {venue.name}</p>

          </div>
  

          <div className='event_Name1'>
            <p>  Venue Capacity : {venue.capacity}</p>

          </div>
          <button className="close-btn " onClick={onClose}>×</button>
        </div>
        <form className="booking-form" >



          <div className="price-summary">
            <p>
              <strong>Total Price:</strong> ${venue.price}
            </p>
          </div>


          <button 
          className="submit-btn"
          
          
          >
            
            Confirm Booking
            
            </button>
        </form>
      </div>
    </div>

    </div>
  ):null
}

export default VenueBooking