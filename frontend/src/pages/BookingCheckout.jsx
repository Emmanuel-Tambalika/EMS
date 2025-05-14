import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import BookingCheckoutForm from './BookingCheckoutForm';
import { useNavigate, useLocation } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51HP6GwKzoxkKrQNZgUJcBm6yfEvua3cwpwPKJBySmzEl2xLznX5YFLecRlVvTJ2MQcHkZMFh1b4JsL6ceEN8mzVk00SLssI3ux');
    
  const BookingCheckout = () => {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const bookingId = location.state?.bookingId;

  useEffect(() => {
    const fetchClientSecret = async () => {
      if (!bookingId) {
        setError('Missing booking ID');
        setLoading(false);
        enqueueSnackbar('Invalid booking reference', { variant: 'error' });
        navigate('/my-bookings', { replace: true });
        return;
      }

      try {
        const { data } = await axios.post(
          `http://localhost:5001/api/bookings/${bookingId}/create-payment-intent`,
          {},
          {    
            withCredentials: true,
            validateStatus: (status) => status < 500
          }
        );

        if (!data.clientSecret) {
          throw new Error('Payment setup failed - no client secret received');
        }

        setClientSecret(data.clientSecret);
        setError('');
      } catch (err) {
        console.error('Payment Setup Error:', err);
        
        const errorMessage = err.response?.data?.error || 
                          err.message || 
                          'Check NetWork Connectivity';
        
        enqueueSnackbar(`Payment error: ${errorMessage}`, {
          variant: 'error',
          autoHideDuration: 5000
        });
        
        setError(errorMessage);
        navigate('/my-bookings', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchClientSecret();
  }, [bookingId, navigate]);

  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#4f46e5',
      colorBackground: '#ffffff',
      colorText: '#30313d',
      borderRadius: '8px'
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-lg font-medium">Setting up secure payment...</div>
        </div>
      </div>
    );
  }

  if (error || !clientSecret) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center p-6 max-w-md">
          <div className="text-red-500 text-lg font-medium mb-4">
            {error || 'Payment setup failed'}
          </div>
          <button 
            onClick={() => navigate('/my-bookings')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 my-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Complete Payment</h2>
        <Elements 
          stripe={stripePromise} 
          options={{ 
            clientSecret,
            appearance,
            loader: 'always'
          }}
        >
          <BookingCheckoutForm 
            bookingId={bookingId}
            onPaymentSuccess={() => {
              enqueueSnackbar('Payment completed successfully!', {
                variant: 'success',
                autoHideDuration: 3000
              });
              navigate('/my-bookings', { replace: true });
            }}
            onPaymentFailure={() => {
              enqueueSnackbar('Payment failed. Please try again.', {
                variant: 'error',
                autoHideDuration: 5000
              });
            }}
          />
        </Elements>
      </div>
    </div>
  );
};

export default BookingCheckout;

