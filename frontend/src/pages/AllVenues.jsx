import React from 'react'
import { MdInbox, MdOutlineAddBox, MdOutlineDelete, MdOutlineSearch } from 'react-icons/md';
import { Link } from 'react-router-dom';
import BackButton from "../components/BackButton.jsx";

   
import '../eMailVerification.css';
const AllVenues = () => {
  return (
    <div>

                  <Link to='/create-Venue'>
                  <MdOutlineAddBox className='create-event-button'/>
                  </Link>
    </div>
  )
};

export default AllVenues;