import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useAuthStore } from "../store/authStore";

const EditEvent = ({ isOpen, onClose, event, onUpdate }) => {
    const { user } = useAuthStore();
    const { enqueueSnackbar } = useSnackbar();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        ordinary: 0,
        vip: 0,
        vippremium: 0,
        date: '',
        venue: '',
        totalTickets: 0
    });
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (isOpen && event) {
            setFormData({
                name: event.name || '',
                description: event.description || '',
                ordinary: event.ordinary || 0,
                vip: event.vip || 0,
                vippremium: event.vippremium || 0,
                date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
                venue: event.venue || '',
                totalTickets: event.totalTickets || 0
            });
        }
    }, [isOpen, event]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name.includes('ordinary') || name.includes('vip') || name.includes('totalTickets') 
                ? parseFloat(value) || 0 
                : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);

        try {
            // First-level null check
            if (!event) {
                throw new Error('No event selected for editing');
            }

            // Second-level ID verification
            if (!event._id) {
                throw new Error('Invalid event ID');
            }

            const response = await fetch(`http://localhost:5001/api/events/${event._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'User-ID': user?._id || ''
                },
                body: JSON.stringify({
                    ...formData,
                    date: new Date(formData.date).toISOString()
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Update failed');
            }

            enqueueSnackbar('Event updated successfully!', { 
                variant: 'success',
                anchorOrigin: { vertical: 'top', horizontal: 'right' }
            });
            
            onUpdate();
            onClose();
        } catch (error) {
            enqueueSnackbar(error.message, { 
                variant: 'error',
                anchorOrigin: { vertical: 'top', horizontal: 'right' }
            });
            console.error('Update error:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    // Early return pattern
    if (!isOpen || !event) return null;

    return (
        <div className="fixed inset-0 bg-grey bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">Edit Event</h2>
                    <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>×</button>
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

                        <div>
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
                                    min={event.availableTickets || 0}
                                    required
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                />
                                {event.availableTickets && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        Available: {event.availableTickets} tickets
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isUpdating}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                         <button
                            type="submit"
                            disabled={isUpdating}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {isUpdating ? 'Updating...' : 'Update Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditEvent;
