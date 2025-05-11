import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useAuthStore } from "../store/authStore";

const DeleteVenue = ({ isOpen, onClose, venue, onDeleteSuccess }) => {
    const { enqueueSnackbar } = useSnackbar();
    const { user } = useAuthStore();
    const [isDeleting, setIsDeleting] = useState(false);

       const handleDelete = async () => {
        // First-level null check
        if (!venue) {
            enqueueSnackbar('No venue selected', {
                variant: 'error',
                anchorOrigin: { vertical: 'top', horizontal: 'right' }
            });
            return;
        }

        // Second-level ID verification
        if (!venue._id) {
            enqueueSnackbar('Invalid venue ID', {
                variant: 'error',
                anchorOrigin: { vertical: 'top', horizontal: 'right' }
            });
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch(`http://localhost:5001/api/venues/${venue._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'User-ID': user?._id || ''  // Fallback empty string
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Deletion failed');
            }

            enqueueSnackbar('Event deleted successfully!', { 
                variant: 'success',
                anchorOrigin: { vertical: 'top', horizontal: 'right' }
            });
            
            onClose();
            onDeleteSuccess();
        } catch (error) {
            enqueueSnackbar(error.message, {
                variant: 'error',
                anchorOrigin: { vertical: 'top', horizontal: 'right' }
            });
            console.error('Deletion error:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    // Early return pattern for cleaner code
    if (!isOpen || !venue) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Confirm Deletion</h2>
                    <button 
                        className="close-btn" 
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>

                <div className="event-details">
                    <p className="event-detail">
                        <strong>Venue:</strong> {venue.name || 'N/A'}
                    </p>
                    <p className="event-detail">
                        <strong>Capacity:</strong> {venue.capacity || 'N/A'}
                    </p>
                    <p className="event-detail">
                    <strong>City:</strong> {venue.city || 'N/A'}
                    </p>
                </div>

                <div className="warning-message">
                    <p>This action cannot be undone. All associated data will be permanently deleted.</p>
                </div>

                <div className="button-group">
                    <button 
                        className="cancel-btn" 
                        onClick={onClose}
                        disabled={isDeleting}
                        aria-busy={isDeleting}
                    >
                        Cancel
                    </button>
                    <button 
                        className="delete-btn" 
                        onClick={handleDelete}
                        disabled={isDeleting}
                        aria-busy={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <span className="spinner" aria-hidden="true" />
                                Deleting...
                            </>
                        ) : 'Delete Venue'}
                    </button>
                </div>
            </div>
        </div>
    );
};
      
export default DeleteVenue;

