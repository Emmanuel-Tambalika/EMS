//Zustand Is  for our Global state Management of all our components and functions  .
import { create } from "zustand";
import axios from "axios"; 

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api/All-events" : "/api/All-events";

axios.defaults.withCredentials = true;


export   const useEventStore =  create((set) => ({
	    
    event: null,
    error: null,
    message: null, 
    isLoading:false, 

   signup2: async ( name,description,price,venue,totalTickets) => {

       // Convert numeric fields
  const numericPrice = Number(price);
  const numericTotalTickets = Number(totalTickets);

      set({ error: null });
      try {
          const response = await axios.post(`${API_URL}/create-Events`, {
            name,
            description,
             price :numericPrice,
             venue,
             totalTickets:numericTotalTickets,
             
              });
          set({ event: response.data.event , isLoading: false});
      } catch (error) {
          set({ error: error.response.data.message || "Error Creating Event", isLoading: false });
          throw error;
      }
  },
  
 



}));