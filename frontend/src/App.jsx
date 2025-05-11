import React from 'react'
import { Routes,Route } from 'react-router-dom';


//Unproctected Routes

import LandingPage from './pages/LandingPage.jsx';
import FAQ from './pages/FAQ.jsx';
import Blog from './pages/Blog.jsx';
import AboutUs from './pages/AboutUs.jsx'
import SignUpPage from './pages/SignUpPage.jsx';


//Log In For Our 3 Different Stakeholders .  Ist One iS For Organizers
import LogInPage from './pages/LogInPage.jsx';
import VenueManagerLogIn from './pages/Log/VenueManagerLogIn.jsx';
import AttendeeLogIn from './pages/Log/AttendeeLogIn.jsx';


//Home Pages For Venue MANAGER  AND eVENT ATTENDEE 
import VenueManagerHome from './pages/VenueManagerHome.jsx';
import AttendeeHome from './pages/AttendeeHome.jsx'



//Proctected Routes 
import Events from './pages/Events.jsx';
import AllEvents from './pages/AllEvents.jsx';
import Venues from './pages/Venues.jsx';
import  MyBookings from './pages/MyBookings.jsx';
import AllVenues from './pages/AllVenues.jsx';
import AllVenues1 from './pages/AllVenues1.jsx';
import MyVenues from './pages/MyVenues.jsx';
import Venue1 from './pages/venue1.jsx';

import EmailNotificationList from './components/EmailNotificationList.jsx';
import Mail from './pages/Mail.jsx';
import EmailsSentToMe from './pages/EmailsSentToMe.jsx';

import Profile from './pages/Profile.jsx'

//Others Within To Create
import CreateEvent from './pages/CreateEvent.jsx' 
import VenueModal from './pages/VenueModal.jsx';

//Payments Mate !
import CheckoutPage from './pages/CheckoutPage.jsx';
import SucessCheckout from './pages/SucessCheckout.jsx';

//Tickets Payments . 
import BookingCheckout from './pages/BookingCheckout.jsx';


const App = () => {


  
  return (

    
      <Routes>
       <Route path='/'  element={<LandingPage/>}/>
       <Route path='/emsFAQ'  element={<FAQ/>}/>
       <Route path='/emsBlog'  element={<Blog/>}/>
       <Route path='/About-us'  element={<AboutUs/>}/>


       <Route path='/Sign-Up'  element={<SignUpPage/>}/>
       <Route path='/Log-In'  element={<LogInPage/>}/>
       <Route path='/Log-InVenueManager'  element={<VenueManagerLogIn/>}/>
       <Route path='/Log-InAttendee'  element={<AttendeeLogIn/>}/>

       <Route path='/VenueManager'  element={<VenueManagerHome/>}/>
       <Route path='/AttendeePage'  element={<AttendeeHome/>}/>
   

       <Route path='/EventsPage'  element={<Events/>}/>
       <Route path='/All-events'  element={<AllEvents/>}/>
       <Route path='/create-Events' element={<CreateEvent/>}/>
       <Route path='/my-Bookings'  element={<MyBookings/>}/>
       <Route path='/check-out'  element={<CheckoutPage/>}/>
       <Route path='/Success-check-out'  element={<SucessCheckout/>}/>
       <Route path='/booking-checkout'element={<BookingCheckout/>}/>

       <Route path='/venues'element={<Venues/>}/>
       <Route path='/venues1'element={<Venue1/>}/> 
       <Route path='/ALL-Venues'  element={<AllVenues/>}/>
       <Route path='/ALL-Venues1'  element={<AllVenues1/>}/>
       <Route path='/Create-Venue'  element={<VenueModal/>}/>
       <Route path='/my-Venues'  element={<MyVenues/>}/>
       <Route path='/profilePage'  element={<Profile/>}/>
       <Route path='/MailPage'  element={<EmailNotificationList/>}/>
       <Route path='/emails'  element={<EmailsSentToMe/>}/>
 
       

      </Routes>
    
    
  )
}

export default App