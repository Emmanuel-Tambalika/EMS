import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";

export const MyBookings = () => {
  const [events, setEvents] = useState([]);
  const [bookedEvents, setBookedEvents] = useState([]);

  const userID = useGetUserID();

  const saveEvents = async (eventID) => {
    try {
      const response = await axios.put("http://localhost:5001/events", {
        eventID,
        userID,
      });
      setBookedEvents(response.data.saveEvents);
    } catch (err) {
      console.log(err);
    }
  };

  const isEventSaved = (id) => bookedEvents.includes(id);

  return (
    <div>
      <h1> Booked Events </h1>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <div>
              <h2>{event.name}</h2>
              <button
                onClick={() => saveEvents(event._id)}
                disabled={isEventSaved(event._id)}
              >
                {isEventSaved(event._id) ? "Saved" : "Save"}
              </button>
            </div>
            
          </li>
        ))}
      </ul>
    </div>
  );
};


export default MyBookings