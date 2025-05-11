import React, {useEffect, useState} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdInbox,MdHome, MdOutlineDelete, MdOutlineSearch, MdLocationOn, MdMail, MdPerson } from 'react-icons/md';
import react from '../assets/react.svg';
import AllVenues from './AllVenues';
import MyVenues from './MyVenues';
import Test from './Test'

const Venues = () => {
  
  const location = useLocation();

  

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      
      {/* Main Content */}
      <div className="ml-56 flex-1 p-6">
        {/* View Toggle Buttons */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <button
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              showType === 'View1'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setShowType('View1')}
          >
            All Venues
          </button>
          
          <button
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              showType === 'View2'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => setShowType('View2')}
          >
             Booked Venues 
          </button>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {showType === 'View1' ? <AllVenues /> : <Test/>}
        </div>
      </div>
    </div>
  );
};

export default Venues;
