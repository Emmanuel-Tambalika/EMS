import React from 'react'
import { Routes,Route } from 'react-router-dom';

//Unproctected Routes

import LandingPage from './pages/LandingPage.jsx';
import FAQ from './pages/FAQ.jsx';
import Blog from './pages/Blog.jsx';
import AboutUs from './pages/AboutUs.jsx'
import SignUpPage from './pages/SignUpPage.jsx';
import LogInPage from './pages/LogInPage.jsx';

//Proctected Routes 
import Events from './pages/Events.jsx';
import AllEvents from './pages/AllEvents.jsx';
import Venues from './pages/Venues.jsx';
import  MyBookings from './pages/MyBookings.jsx';
import AllVenues from './pages/AllVenues.jsx';
import MyVenues from './pages/MyVenues.jsx';
import Mail from './pages/Mail.jsx';
import Profile from './pages/Profile.jsx'

const App = () => {


  
  return (

    
      <Routes>
       <Route path='/'  element={<LandingPage/>}/>
       <Route path='/emsFAQ'  element={<FAQ/>}/>
       <Route path='/emsBlog'  element={<Blog/>}/>
       <Route path='/About-us'  element={<AboutUs/>}/>
       <Route path='/Sign-Up'  element={<SignUpPage/>}/>
       <Route path='/Log-In'  element={<LogInPage/>}/>


       <Route path='/EventsPage'  element={<Events/>}/>
       <Route path='/All-events'  element={<AllEvents/>}/>
       <Route path='/my-Bookings'  element={<MyBookings/>}/>

       <Route path='/Venues'  element={<Venues/>}/>
       <Route path='/ALL-Venues'  element={<AllVenues/>}/>
       <Route path='/my-Venues'  element={<MyVenues/>}/>
       <Route path='/profilePage'  element={<Profile/>}/>
       <Route path='/MailPage'  element={<Mail/>}/>
       

      </Routes>
    
    
  )
}

export default App