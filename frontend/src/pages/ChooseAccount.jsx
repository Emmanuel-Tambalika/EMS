import React, { useState } from 'react';
import { Link ,useNavigate } from 'react-router-dom';
import react from '../assets/react.svg';

import {  MdPerson } from 'react-icons/md';
import '../ChooseAccount.css';


const ChooseAccount = () => {



    return (

        <div className="Account-form">

       
                <label htmlFor="EMS_Roles" className='profile-label'> Choose Account Type </label>


                <Link    to='/Log-In'>
           
           <div  className='person_div'>

<MdPerson
className='account-profile'

/>
    <button
    className='profile-button'
    
    >
      Event  Organizer
    </button>

          </div>
           
                </Link>

           <Link    to='/Log-InAttendee'>
           
           <div  className='person_div1'>

<MdPerson
className='account-profile'

/>
    <button
    className='profile-button'
    
    >
      Event  Attendeee 
    </button>

          </div>
           
           </Link>
               
                <Link to='/Log-InVenueManager'>
                
                <div  className='person_div2'>


<MdPerson
className='account-profile'

/>
    <button
       className='profile-button'
    
    >
 Venue Manager 
    </button>

</div>
                
                </Link>


        </div>
    )
}

export default ChooseAccount