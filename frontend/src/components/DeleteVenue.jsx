import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useAuthStore } from '../store/authStore'; // Adjust path as needed

const DeleteVenue = ({ isOpen, onClose, venue, onDeleteSuccess }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);

  // Early return if modal closed or no venue selected
  if (!isOpen || !venue) return null;

  const handleDelete = async () => {
    if (!venue) {
      enqueueSnackbar('No venue selected', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      return;
    }

    if (!venue._id) {
      enqueueSnackbar('Invalid venue ID', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`http://localhost:5001/api/venues/${venue._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Pass user ID header if your backend expects it; else remove this line
          'User-ID': user?._id || '',
        },
        credentials: 'include', // important if using cookies for auth
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Deletion failed');
      }

      enqueueSnackbar('Venue deleted successfully!', {
        variant: 'success',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });

      onClose();
      onDeleteSuccess();
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
      });
      console.error('Deletion error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="delete-venue-title"
    >
      <div
        className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center mb-4">
          <h2 id="delete-venue-title" className="text-xl font-semibold text-red-600">
            Confirm Deletion
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            &times;
          </button>
        </header>

        <section className="mb-4">
          <p>
            Are you sure you want to delete/unbook the following venue? This action cannot be undone.
          </p>
        </section>

        <section className="mb-6 border p-4 rounded bg-gray-50">
          <h3 className="text-lg font-bold mb-2">{venue.name || 'N/A'}</h3>
          <p><strong>Description:</strong> {venue.description || 'N/A'}</p>
          <p><strong>City:</strong> {venue.city || 'N/A'}</p>
          <p><strong>Capacity:</strong> {venue.capacity ?? 'N/A'}</p>
          <p><strong>Price:</strong> {venue.price ?? 'N/A'}</p>
          <p><strong>Booked:</strong> {venue.isBooked ? 'Yes' : 'No'}</p>
          <p><strong>Payment Pending:</strong> {venue.isPaymentPending ? 'Yes' : 'No'}</p>
        </section>

        <section className="mb-6 text-red-700 font-medium">
          <p>This action cannot be undone. All associated data will be permanently deleted.</p>
        </section>

        <footer className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition"
            aria-disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition flex items-center justify-center"
            aria-disabled={isDeleting}
            aria-busy={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="spinner mr-2" aria-hidden="true" />
                Deleting...
              </>
            ) : (
              'Delete Venue'
            )}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default DeleteVenue;
