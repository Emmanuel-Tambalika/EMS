import React from 'react'
import { Link } from 'react-router-dom';
import react from '../assets/react.svg'

import IntroCard from '../components/introCard.jsx'
import ChooseAccount from './ChooseAccount.jsx';

const LandingPage = () => {

  return (     

    <div >
       
       <div>
        <h1 className='landing-h1'>
          <img className='logo-img'  src={react} alt="Company-logo"/> EMS</h1>
        </div>

        <nav className='Nav-bar'>

        <li className='link-li'> <Link to='/emsFAQ'> FAQ</Link></li>
        <li className='link-li'> <Link to='/emsBlog'>Blog</Link></li>
         <li className='link-li'><Link to='/events'> Events</Link></li>
        <li className='link-li'><Link to='/About-us'>AboutUs </Link></li>  

       </nav>
       
       <IntroCard
       heading="Welcome to EMS "
       EMSRole1="1) We Help you Uncover Upcoming Events ."
       EMSRole2="2) Book Events And Venues Seamlessly . "
       EMSRole3="3) Handle Online Payments With Ease .."
       EMSRole4="4) Get Notified about All Events ,  related Information and News . "
       />

        <ChooseAccount/>
 
    </div>
  )
}

export default LandingPage