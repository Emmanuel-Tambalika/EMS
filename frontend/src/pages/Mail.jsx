import React , {useEffect, useState}from 'react';
import { Link } from 'react-router-dom';

import react from '../assets/react.svg'
import '../App.css'

const Mail = () => {


  return (

    <div>

 <div>
                 <h1 className='landing-h1'><img className='logo-img' 
                        src={react} alt="Company-logo" />EMS</h1>
                </div>


                <p className='View-Para'>Receive All Mail Notifications Related to Events <em>Here</em> </p>
    </div>
  )
}

export default Mail