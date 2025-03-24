import React , {useEffect, useState}from 'react';
import { Link } from 'react-router-dom';

import react from '../assets/react.svg'
import '../App.css'


import IntroCard from '../components/introCard';

const Profile = () => {
  return (

    <div>
                               <div>
                                    <h1 className='landing-h1'><img className='logo-img' 
                                    src={react} alt="Company-logo" />EMS</h1>
                               </div>

                 <p className='View-Para'>This Page Contains All The Profile  Fuctions controllers </p>

                               <IntroCard
                               
                               heading="Hello Manex"
                               EMSRole1="1) Last Log-In plus Edit Profile  "
                               EMSRole2="2) History  Plus Settings"
                               EMSRole3="3) Payment Details "
                               EMSRole4="4) log Out  "
                               
                               />
       
    </div>
  )
}

export default Profile