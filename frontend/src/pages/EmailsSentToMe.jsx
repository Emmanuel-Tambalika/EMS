import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { MdEmail, MdHome, MdMarkEmailRead, MdDelete, MdLocationOn,MdBook, MdMail, MdPerson } from 'react-icons/md';
import react from '../assets/react.svg';

const EmailsSentToMe = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
     { path: "/AttendeePage", icon: MdHome, label: "Home" },
     { path: "/my-Bookings", icon: MdBook, label: "My Bookings" },
    { path: "/emails", icon: MdMail, label: "Mail" },
    { path: "/profilePage", icon: MdPerson, label: "Profile" }
  ];

  const fetchEmails = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        'http://localhost:5001/api/my',
        { withCredentials: true }
      );
      setEmails(data.data || []); // Ensure array format
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5001/api/emails/${id}/read`,
        {},
        { withCredentials: true }
      );
      fetchEmails();
    } catch (err) {
      console.error('Mark as read failed:', err);
    }
  };

  const deleteEmail = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5001/api/emails/${id}`,
        { withCredentials: true }
      );
      fetchEmails();
      if (selectedEmail?._id === id) setSelectedEmail(null);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  useEffect(() => {
    fetchEmails();
    const interval = setInterval(fetchEmails, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="flex min-h-screen">
      <Sidebar navLinks={navLinks} isActive={isActive} />
      <div className="ml-56 flex-1 p-6">
        <div className="p-4 text-center">Loading emails...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex min-h-screen">
      <Sidebar navLinks={navLinks} isActive={isActive} />
      <div className="ml-56 flex-1 p-6">
        <div className="p-4 text-red-500 text-center">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar navLinks={navLinks} isActive={isActive} />
      
      <div className="ml-56 flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex h-[70vh] border rounded-lg overflow-hidden">
            {/* Email List */}
            <div className="w-1/3 border-r bg-gray-50 overflow-y-auto">
              <div className="p-4 border-b bg-white sticky top-0 z-10">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <MdEmail className="text-blue-500" />
                  Email Notifications
                </h3>
              </div>
              <ul>
                {emails.map((email) => (
                  <li
                    key={email._id}
                    className={`border-b hover:bg-gray-100 cursor-pointer ${
                      selectedEmail?._id === email._id ? 'bg-blue-50' : ''
                    } ${!email.read ? 'bg-white' : 'bg-gray-50'}`}
                    onClick={() => setSelectedEmail(email)}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h4 className={`font-medium ${
                          !email.read ? 'text-black' : 'text-gray-600'
                        }`}>
                          {email.subject}
                        </h4>
                        <div className="flex gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(email._id);
                            }}
                            className="text-gray-400 hover:text-blue-500"
                          >
                            <MdMarkEmailRead />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteEmail(email._id);
                            }}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {email.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(email.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Email Viewer */}
            <div className="w-2/3 bg-white p-6 overflow-y-auto">
              {selectedEmail ? (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">
                      {selectedEmail.subject}
                    </h2>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => markAsRead(selectedEmail._id)}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded"
                      >
                        <MdMarkEmailRead /> Mark Read
                      </button>
                      <button
                        onClick={() => deleteEmail(selectedEmail._id)}
                        className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 rounded"
                      >
                        <MdDelete /> Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-600 mb-2">
                      <strong>Date:</strong> {new Date(selectedEmail.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="prose max-w-none">
                    {selectedEmail.message.split('\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <MdEmail className="mx-auto text-4xl mb-2" />
                    <p>Select an email to read</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ navLinks, isActive }) => (
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
);

export default  EmailsSentToMe ;
