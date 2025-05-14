import React, { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({ venueId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [venue, setVenue] = useState(null);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/venues/${venueId}`,
          { withCredentials: true }
        );
        setVenue(response.data);
      } catch (err) {
        setError('Failed to load venue details');
      }
    };
    fetchVenue();
  }, [venueId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) throw submitError;

      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: window.location.origin + '/payment-success' },
        redirect: 'if_required',
      });

      if (stripeError) throw stripeError;
      if (paymentIntent?.status !== 'succeeded') throw new Error('Payment failed');

      await axios.post(
        `http://localhost:5001/api/venues/${venueId}/pay`,
        {},
        { withCredentials: true, timeout: 5000 }
      );

      // Verify payment status
      const { data: updatedVenue } = await axios.get(
        `http://localhost:5001/api/venues/${venueId}`,
        { withCredentials: true }
      );

      if (!updatedVenue.venuePaidFor) {
        throw new Error('Payment verification failed');
      }

      try {
        await axios.post(
          'http://localhost:5001/api/notifications',
          {
            venueId,
            type: 'payment_success',
            message: `Payment of $${(paymentIntent.amount/100).toFixed(2)} completed successfully.`
          },
          { withCredentials: true, timeout: 5000 }
        );
      } catch (notificationError) {
        setError('Payment succeeded, but notification failed');
      }

        setPaymentStatus('succeeded');
      setTimeout(() => navigate('/my-Venues'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Payment failed');
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        <div className="md:w-1/3 bg-blue-700 text-white p-6">
          {venue ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Selected Venue</h2>
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="text-xl font-semibold">{venue.name}</h3>
                <p className="text-blue-200">{venue.city}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-sm text-blue-200">Capacity</p>
                  <p className="text-lg font-bold">{venue.capacity}</p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <p className="text-sm text-blue-200">Price</p>
                  <p className="text-lg font-bold">${venue.price}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-white/20">
                <p className="text-sm">Secure booking process</p>
              </div>
            </div>
          ) : (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-blue-600/50 rounded w-3/4"></div>
              <div className="h-20 bg-blue-600/50 rounded"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-16 bg-blue-600/50 rounded"></div>
                <div className="h-16 bg-blue-600/50 rounded"></div>
              </div>
            </div>
          )}
        </div>

        <div className="md:w-2/3 p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Payment Details</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement className="border border-gray-200 rounded-lg p-4" />
            
            {error && (
              <div className="p-3 bg-red-50 text-red-500 rounded-lg flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {paymentStatus === 'succeeded' && (
              <div className="p-3 bg-green-50 text-green-600 rounded-lg flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Payment successful! Redirecting...</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!stripe || loading}
              className={`w-full py-3 rounded-lg transition-colors ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-medium flex justify-center items-center`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Pay Now'
              )}
            </button>  
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;

