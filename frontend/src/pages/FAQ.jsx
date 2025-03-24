//This Page Will Hold Our Events Contents For Now .

import React , {useEffect, useState}from 'react';
import { Link } from 'react-router-dom';


import '../App.css'
import react from '../assets/react.svg'

import AllEvents from './AllEvents.jsx'
import MyBookings from './MyBookings.jsx';
  

const FAQ = () => {

const [showType ,setShowType]=useState('View1');

  return (


    <div>
                 <div>
                        <h1 className='landing-h1'><img className='logo-img' 
                        src={react} alt="Company-logo" />EMS</h1>
                </div>

          <nav className='Nav-bar'>

        <li className='link-li'> <Link to='/Venues'>Venues</Link></li>
        <li className='link-li'> <Link to='/MailPage'> Mail</Link></li>
        <li className='link-li'><Link to='/profilePage'>Profile</Link></li>  

         </nav>

                <div className='flex justify-center  items-center gap-x-4 '>
      
      <button className='View1'
      onClick={() => setShowType('View1')}
      >
       Events
      </button>
           
      <button
      
      className='View2'
      onClick={()=> setShowType('View2')}
      >
     My Bookings
      </button>
    
      </div>

      {
        
       showType ==='View1' ? (<AllEvents/> ): (<MyBookings/>) 
      
       
      }


    </div>
  )
}

export default FAQ