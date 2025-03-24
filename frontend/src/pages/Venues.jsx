import React , {useEffect,useState} from 'react'
import { Link } from 'react-router-dom';

import '../App.css'
import react from '../assets/react.svg'

import AllVenues from './AllVenues';
import MyVenues from './MyVenues';

const Venues = () => {

   const [showType,setShowType]=useState('View1');

  return (

    <div>

           <div>
        <h1 className='landing-h1'><img className='logo-img' 
        src={react} alt="Company-logo" />EMS</h1>
           </div>

           <div className='flex justify-center  items-center gap-x-4 '>
      
      <button className='View1'
      onClick={() => setShowType('View1')}
      >
       Venues
      </button>
           
      <button
      
      className='View2'
      onClick={()=> setShowType('View2')}
      >
     My Venues
      </button>
    
      </div>

      {
        
       showType ==='View1' ? (<AllVenues/> ): (<MyVenues/>) 
      
       
      }

          

    </div>
  )
}

export default Venues