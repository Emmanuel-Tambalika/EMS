import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdOutlineAddBox, MdMail, MdPerson, MdHome } from 'react-icons/md';
import DeleteVenue from '../components/DeleteVenue.jsx';
import EditVenue from '../components/EditVenue.jsx';
import VenueManage from '../components/VenueManage.jsx'; // Import new modal
import '../App.css';
import react from '../assets/react.svg';

  const VenueManagerHome = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const navLinks = [   
    { path: "/VenueManager", icon: MdHome, label: "Home" },
    { path: "/Manager-emails", icon: MdMail, label: "Mail" },
    { path: "/Veprofile", icon: MdPerson, label: "  Profile" }
];
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false); // New modal state
  const [selectedVenue, setSelectedVenue] = useState(null);
  
  const fetchVenues = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5001/api/venues", {
        method: "GET",
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setVenues(data);
    } catch (err) {
      setError(err.message || "Failed to fetch venues");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleDeleteSuccess = () => {
    fetchVenues();
    setIsDeleteModalOpen(false);
  };

   const handleUpdateSuccess = () => {
    fetchVenues();
    setIsEditModalOpen(false);
  };

  const toggleDescription = (venueId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [venueId]: !prev[venueId]
    }));
  };

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
                    className={`flex items-center p-3 rounded-lg transition-colors ${isActive(link.path)
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-100 hover:text-blue-600 text-gray-600'
                      }`}
                  >
                    <Icon className={`text-2xl mr-3 ${isActive(link.path) ? 'text-blue-500' : 'text-gray-500'}`} />
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="ml-56 flex-1 p-6">
        <div className="mt-10 ml-80 mb-5">
          <Link to='/Create-Venue'>
            <MdOutlineAddBox className='create-venue-button1' /> Create Venue
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-lg text-gray-700">Loading venues...</p>
        ) : error ? (
          <p className="text-center text-lg text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.length > 0 ? (
              venues.map((venue) => (
                <div key={venue._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{venue.name}</h3>
                  <p className="text-gray-600 mb-4"><strong>Capacity:</strong> {venue.capacity}</p>
                  <p className="text-gray-600 mb-4"><strong>Price:</strong> {venue.price}</p>
                  <p className="text-gray-600 mb-4"><strong>City:</strong> {venue.city}</p>

                  <div
                    className={`text-gray-600 mb-1 transition-all duration-300 ${expandedDescriptions[venue._id]
                      ? 'max-h-screen'
                      : 'max-h-20 overflow-hidden'
                      }`}
                  >
                    <p className='text-green-500 lg-50'>Description and Takeaways:</p> {venue.description}
                  </div>

                  {venue.description.length > 80 && (
                    <button
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm mb-4"
                      onClick={() => toggleDescription(venue._id)}
                    >
                      {expandedDescriptions[venue._id] ? 'Show Less' : 'Read More'}
                    </button>
                  )}

                  <div className="flex flex-wrap gap-2 mt-4">
                    <button
                      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                      onClick={() => {
                        setSelectedVenue(venue);
                        setIsEditModalOpen(true);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      onClick={() => {
                        setSelectedVenue(venue);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      Delete
                    </button>

                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                      onClick={() => {
                        setSelectedVenue(venue);
                        setIsManageModalOpen(true);
                      }}
                    >
                      Manage
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-lg text-gray-700">No venues available</p>
            )}
          </div>
        )}

        {/* Modals */}
        <DeleteVenue
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          venue={selectedVenue}
          onDeleteSuccess={handleDeleteSuccess}
        />

        <EditVenue
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          venue={selectedVenue}
          onUpdate={handleUpdateSuccess}
        />

        <VenueManage
          isOpen={isManageModalOpen}
          onClose={() => setIsManageModalOpen(false)}
          venue={selectedVenue}
        />
      </div>
    </div>
  );
};

export default VenueManagerHome;
