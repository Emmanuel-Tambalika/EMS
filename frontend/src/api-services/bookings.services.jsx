// api-services/bookings.services.js
import axios from "axios";

export const createBooking = (data) => {
  return axios.post("http://localhost:5001/api/bookings", data, {
    withCredentials: true,
  });
};
