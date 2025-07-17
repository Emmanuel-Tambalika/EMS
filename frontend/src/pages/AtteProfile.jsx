import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import { MdLocationOn,MdBook, MdHome, MdMail, MdPerson } from 'react-icons/md';
import react from '../assets/react.svg';

const AtteProfile = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/'); // Redirect to login after logout
    };

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { path: "/AttendeePage", icon: MdHome, label: "Home" },
        { path: "/my-Bookings", icon: MdBook, label: "My Bookings" },
        { path: "/emails", icon: MdMail, label: "Mail" },
        { path: "/AtteProfile", icon: MdPerson, label: "Profile" }
    ];

    // If user is not logged in, redirect to login
    React.useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    // If user is null (not logged in), show nothing (will redirect)
    if (!user) {
        return null;
    }

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
                                        <Icon className={`text-2xl mr-3 ${isActive(link.path) ? 'text-blue-500' : 'text-gray-500'
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
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
                >
                    <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
                        Profile Page
                    </h2>

                    <div className="space-y-6">
                        <motion.div
                            className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h3 className="text-xl font-semibold text-green-400 mb-3">Attendee Details</h3>
                            <p className="text-gray-300">Name: {user.name}</p>
                            <p className="text-gray-300">Email: {user.email}</p>
                        </motion.div>
                        <motion.div
                            className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <h3 className="text-xl font-semibold text-green-400 mb-3">Account Activity</h3>
                            <p className="text-gray-300">
                                <span className="font-bold">Joined: </span>
                                {new Date(user.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                            <p className="text-gray-300">
                                <span className="font-bold">Last Login: </span>
                                {formatDate(user.lastLogin)}
                            </p>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
              font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            Logout
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}

export default AtteProfile;
