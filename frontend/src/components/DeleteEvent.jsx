import React, { useState } from 'react';


const DeleteEvent = ({ isOpen, onClose, event }) => {
  return  isOpen ? (
    <div>

<div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className='yourTicket'> Delete Event </h2>
          <div className='event_Name '>
            <p> Event Name : {event.name}</p>

          </div>


          <div className='event_Name1'>
            <p> Event Venue : {event.venue}</p>

          </div>
          <button className="close-btn " onClick={onClose}>×</button>
        </div>
        

           <button 
          className="submit-btn">
            
            Confirm Delete
            
            </button>
       
      </div>
    </div>


    </div>
  ):null;
}

export default DeleteEvent;