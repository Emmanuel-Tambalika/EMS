import React  ,{useState,useEffect}from 'react'
import { Link } from 'react-router-dom';
import { MdOutlineAddBox,MdMail ,MdPerson } from 'react-icons/md';

import '../App.css'
import react from '../assets/react.svg'

const VenueManagerHome = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <div>
      <div>
              <h1 className='landing-h1'><img className='logo-img'
                src={react} alt="Company-logo" />EMS</h1>
            </div>
      
            <nav className='Nav-bar'>
      
              
              <li className='link-li'> <Link to='/MailPage'> <MdMail size={40} color="blue" /> Mail</Link></li>
              <li className='link-li'><Link to='/profilePage'> <MdPerson size={40} color="blue" /> Profile</Link></li>
      
            </nav>

        <div>

        <Link to='/Create-Venue'>
          <MdOutlineAddBox className='create-venue-button1' /> Create  Venue
        </Link>

      </div>

      <div className="container mx-auto mt-2">
        {loading ? (
          <p className="text-center text-lg text-gray-700">Loading venues...</p>
        ) : error ? (
          <p className="text-center text-lg text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {venues.length > 0 ? (
              venues.map((venue) => (
                <div key={venue._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{venue.name}</h3>
                  <p className="text-gray-600 mb-4"><strong>Capacity:</strong> {venue.capacity}</p>
                  <p className="text-gray-600 mb-4"><strong>Capacity:</strong> {venue.capacity}</p>
                  <p className="text-gray-600 mb-4"><strong>Price:</strong> {venue.price}</p>
                  <p className="text-gray-600 mb-4"><strong>City:</strong> {venue.city}</p>
                  <p className="text-gray-600 mb-4"><strong>Description:</strong> {venue.description}</p>
                  <button
                   className="bg-blue-500 text-white mb-10  mt-10 py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                  
                   >
                   Edit
                  </button>

                  <button
                   className="bg-blue-500 text-white py-2 px-4 ml-10 rounded hover:bg-blue-600 transition-colors"
                  
                   >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-lg text-gray-700">No venues available</p>
            )}
          </div>
        )}
      </div>

    </div>
  )
}

export default VenueManagerHome