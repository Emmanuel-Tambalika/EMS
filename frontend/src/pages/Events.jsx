import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MdInbox, MdOutlineAddBox, MdOutlineDelete, MdOutlineSearch, MdEvent, MdBook, MdMail, MdLocationOn, MdPerson } from 'react-icons/md';


import '../App.css'
import react from '../assets/react.svg'

import AllEvents from './AllEvents.jsx'
import MyBookings from './MyBookings.jsx';

const Events = () => {

  const [showType, setShowType] = useState('View1');


  return (

    <div>
      <div>
        <h1 className='landing-h1'><img className='logo-img'
          src={react} alt="Company-logo" />EMS</h1>
      </div>

      <nav className='Nav-bar'>

        <li className='link-li'> <Link to='/Venues'> <MdLocationOn size={40} color="blue" /> Venue</Link></li>
        <li className='link-li'> <Link to='/MailPage'> <MdMail size={40} color="blue" /> Mail</Link></li>
        <li className='link-li'><Link to='/profilePage'> <MdPerson size={40} color="blue" /> Profile</Link></li>

      </nav>



      <div className='flex justify-center  items-center gap-x-4 '>

        <button className='View1'
          onClick={() => setShowType('View1')}
        >
          <div>

            Events  <MdEvent className='create-event-button' />

          </div>
        </button>

        <button

          className='View2'
          onClick={() => setShowType('View2')}
        >
          <div>

            Bookings <MdBook className='create-event-button' />

          </div>
        </button>

      </div>

      {

        showType === 'View1' ? (<AllEvents />) : (<MyBookings />)


      }


    </div>
  )
}

export default Events;