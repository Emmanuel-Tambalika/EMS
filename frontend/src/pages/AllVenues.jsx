import React , {useState, useEffect}from 'react'
import { MdInbox, MdOutlineAddBox, MdOutlineDelete, MdOutlineSearch } from 'react-icons/md';
import { Link } from 'react-router-dom';
import BackButton from "../components/BackButton.jsx";
   
import '../eMailVerification.css';

const AllVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


    // Fetch all events or filter by city
    const fetchVenues = async () => {
      setLoading(true);
      setError(null);

      try {
         
          const data = await response.json();
          setVenues(data);
      } catch (error) {
          setError(' No Venues ');
      } finally {
          setLoading(false);
      }
  };


// Initial fetch
useEffect(() => {
  fetchVenues();
}, []);

  return (
    <div>
           
                {/* Events List */}
                {loading ? (
                    <div className="loading-state">
                        <p>Loading  Venues...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <p>{error}</p>
                    </div>
                ) :

                    (
                        <div className="events-list">
                            {venues.length > 0 ? (
                                venues.map(venue => (
                                    <div key={venue._id} className="event-card">
                                        <h3 className="event-title">{venue.name}</h3>
                                        <div className="event-meta">
                                           
                                            <p><strong>Capacity:</strong> {venue.capacity}</p>

                                            <p><strong>Description:</strong> {venue.description}</p>

                                        </div>
                                       
                                        {/* Button to trigger modal */}
                                        <button
                                            className="book-ticket"
                                            >
                                            Book Ticket
                                        </button>


                                    </div>
                                ))
                            ) : (
                                <div  className="no-events1">
                                    <p className="no-events" >No events yet!</p>
                                </div>
                            )}
                        </div>
                    )

                }


    </div>
  )
};

export default AllVenues;