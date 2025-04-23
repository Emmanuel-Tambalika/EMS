import React, {useEffect, useState} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdInbox,MdHome, MdOutlineDelete, MdOutlineSearch, MdLocationOn, MdMail, MdPerson } from 'react-icons/md';
import react from '../assets/react.svg';
import AllVenues from './AllVenues';
import MyVenues from './MyVenues';

const Venues = () => {
  const [showType, setShowType] = useState('View1');
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/EventsPage", icon: MdHome, label: "Home" },
    { path: "/Venues", icon: MdLocationOn, label: "Venues" },
    { path: "/MailPage", icon: MdMail, label: "Mail" },
    { path: "/profilePage", icon: MdPerson, label: "Profile" }
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="fixed w-56 h-full bg-white shadow-lg z-10">
        <div className="flex items-center p-4 border-b border-gray-200">
          <img src={react} alt="Company Logo" className="w-8 h-8 mr-3" />
          <h1 className="text-xl font-bold text-blue-600">EMS</h1>
        </div>
        
        <nav className="p-2">
          <ul className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      isActive(link.path)
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-100 hover:text-blue-600 text-gray-600'
                    }`}
                  >
                    <Icon className={`text-2xl mr-3 ${
                      isActive(link.path) ? 'text-blue-500' : 'text-gray-500'
                    }`} />
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

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
            My Venues
          </button>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {showType === 'View1' ? <AllVenues /> : <MyVenues />}
        </div>
      </div>
    </div>
  );
};

export default Venues;
