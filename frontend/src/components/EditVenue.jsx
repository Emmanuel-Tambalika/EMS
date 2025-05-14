import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useAuthStore } from '../store/authStore'; // Adjust path as needed

const EditVenue = ({ isOpen, onClose, venue, onUpdate }) => {
  const { user } = useAuthStore();
  const { enqueueSnackbar } = useSnackbar();

  // Initialize formData with empty or default values
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    city: '',
    capacity: 0,
  });

  const [isUpdating, setIsUpdating] = useState(false);

  // Update formData whenever modal opens or venue changes
  useEffect(() => {
    if (isOpen && venue) {
      setFormData({
        name: venue.name || '',
        description: venue.description  ||'',
        price: venue.price || 0,
        city: venue.city || '',
        capacity: venue.capacity || 0,
      });
    } 
  }, [isOpen, venue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['price', 'capacity'].includes(name) ? Number(value) : value,
    }));
  };

  const validate = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.city.trim()) return 'City is required';
    if (formData.price < 0) return 'Price must be zero or positive';
    if (formData.capacity <= 0) return 'Capacity must be greater than zero';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      if (!venue) {
        throw new Error('No venue selected for editing');
      }
      if (!venue._id) {
        throw new Error('Invalid venue ID');
      }

      const validationError = validate();
      if (validationError) {
        enqueueSnackbar(validationError, { variant: 'error' });
        setIsUpdating(false);
        return;
      }

      const response = await fetch(`http://localhost:5001/api/venues/${venue._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'User-ID': user?._id || '',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Update failed');
      }

      enqueueSnackbar('Venue updated successfully!', {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });

      onUpdate();
      onClose();
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      console.error('Update error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="edit-venue-title"
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-4 border-b">
          <h2 id="edit-venue-title" className="text-xl font-bold">
            Edit Venue
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-600 hover:text-gray-900 text-2xl leading-none"
          >
            &times;
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block font-medium mb-1">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              minLength={3}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              minLength={10}
              rows={4}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="city" className="block font-medium mb-1">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              required
              minLength={2}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="capacity" className="block font-medium mb-1">
                Capacity
              </label>
              <input
                id="capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="price" className="block font-medium mb-1">
                Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isUpdating}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isUpdating ? 'Updating...' : 'Update Venue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVenue;
