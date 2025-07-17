  import { motion } from "framer-motion";
  import axios from 'axios';
  import React, { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { useSnackbar } from 'notistack';
  import BackButton from "../components/BackButton.jsx";
  
  const CreateEvent = () => {
      const [formData, setFormData] = useState({
          name: "",
          description: "",
          ordinary: 0,
          vip: 0,
          vippremium: 0,
          date: "",
          venue: "",
          totalTickets: 0
      });
      
      const [loading, setLoading] = useState(false);
      const { enqueueSnackbar } = useSnackbar();
      const navigate = useNavigate();
  
      const handleChange = (e) => {
          const { name, value } = e.target;
          setFormData(prev => ({
              ...prev,
              [name]: ['ordinary', 'vip', 'vippremium', 'totalTickets'].includes(name)
                  ? parseFloat(value) || 0
                  : value
          }));
      };
  
      const handleSubmit = async (e) => {
          e.preventDefault();
          try {
              setLoading(true);
              await axios.post('http://localhost:5001/api/events', formData);
              enqueueSnackbar('Event Created Successfully', { 
                  variant: 'success',
                  anchorOrigin: { vertical: 'top', horizontal: 'right' }
              });
              navigate('/EventsPage');
          } catch (error) {
              enqueueSnackbar(error.response?.data?.message || 'Error creating event', { 
                  variant: 'error',
                  anchorOrigin: { vertical: 'top', horizontal: 'right' }
              });
              console.error('Creation error:', error);
          } finally {
              setLoading(false);
          }
      };
  
      return (
          <div className="fixed inset-0 bg-grey bg-opacity-50 flex items-center justify-center z-50">
              <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
              >
                  <div className="flex justify-between items-center p-4 border-b">
                      <div className="flex items-center space-x-4">
                          <BackButton 
                              className="hover:bg-gray-100 p-2 rounded-full transition-colors duration-200"
                              onClick={() => navigate('/EventsPage')}
                          />
                          <h2 className="text-xl font-bold">Create Event</h2>
                      </div>
                      <button 
                          className="text-gray-500 hover:text-gray-700 p-2"
                          onClick={() => navigate('/EventsPage')}
                      >
                          ×
                      </button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="p-6 space-y-6">
                      <div className="space-y-4">
                          <div> 
                              <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                              <input
                                  type="text"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleChange}
                                  required
                                  minLength={3}
                                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                              />
                          </div>
  
                          <div className="form-group full-width">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                              <textarea
                                  name="description"
                                  value={formData.description}
                                  onChange={handleChange}
                                  required
                                  minLength={10}
                                  className="w-full p-2 border rounded-md h-32 focus:ring-2 focus:ring-blue-500"
                              />
                          </div>
                      </div>
  
                      <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold mb-4">Ticket Prices</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Ordinary ($)</label>
                                  <input
                                      type="number"
                                      name="ordinary"
                                      value={formData.ordinary}
                                      onChange={handleChange}
                                      min="0"
                                      step="1"
                                      required
                                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                  />
                              </div>
  
                              <div> 
                                  <label className="block text-sm font-medium text-gray-700 mb-1">VIP ($)</label>
                                  <input
                                      type="number"
                                      name="vip"
                                      value={formData.vip}
                                      onChange={handleChange}
                                      min={formData.ordinary}
                                      step="1"
                                      required
                                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                  />
                              </div>
  
                              <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">VIP Premium ($)</label>
                                  <input
                                      type="number"
                                      name="vippremium"
                                      value={formData.vippremium}
                                      onChange={handleChange}
                                      min={formData.vip}
                                      step="1"
                                      required
                                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                  />
                              </div>
                          </div>
                      </div>
  
                      <div className="bg-gray-50 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold mb-4">Event Details</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                  <input
                                      type="date"
                                      name="date"
                                      value={formData.date}
                                      onChange={handleChange}
                                      min={new Date().toISOString().split('T')[0]}
                                      required
                                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                  />
                              </div>
  
                              <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                                  <input
                                      type="text"
                                      name="venue"
                                      value={formData.venue}
                                      onChange={handleChange}
                                      required
                                      minLength={3}
                                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                  />
                              </div>
  
                              <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Tickets</label>
                                  <input
                                      type="number"
                                      name="totalTickets"
                                      value={formData.totalTickets}
                                      onChange={handleChange}
                                      min="1"
                                      required
                                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                  />
                              </div>
                          </div>
                      </div>
  
                      <div className="flex justify-end space-x-3 pt-4">
                          <button
                              type="button"
                              onClick={() => navigate('/EventsPage')}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          >
                              Cancel
                          </button>
                          <motion.button
                              type="submit"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.98 }}
                              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  loading ? 'opacity-75 cursor-not-allowed' : ''
                              }`}
                              disabled={loading}
                          >
                              {loading ? (
                                  <span className="flex items-center justify-center">
                                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      Creating...
                                  </span>
                              ) : 'Create Event'}
                          </motion.button>
                      </div>
                  </form>
              </motion.div>
          </div>
      );
  };
  
  export default CreateEvent;
  

   