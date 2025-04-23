import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_51HP6GwKzoxkKrQNZgUJcBm6yfEvua3cwpwPKJBySmzEl2xLznX5YFLecRlVvTJ2MQcHkZMFh1b4JsL6ceEN8mzVk00SLssI3ux');

const CheckoutForm = ({ onPaymentSuccess, venueId }) => {
  const stripe = useStripe();
  const elements = useElements();    
  const navigate = useNavigate(); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);
    setPaymentStatus(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) throw submitError;

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: window.location.origin + '/payment-success' },
        redirect: 'if_required',
      });

      if (error) throw error;

      if (paymentIntent?.status === 'succeeded') {
        // 1. Update backend payment status
        await axios.post(
          `http://localhost:5001/api/venues/${venueId}/pay`,
          {},
          { withCredentials: true }
        );

        // 2. Create notification
        await axios.post(
          'http://localhost:5001/api/notifications',
          {
            venueId,
            type: 'payment_success',
            message: `Payment of $${(paymentIntent.amount/100).toFixed(2)} completed successfully.`
          },
          { withCredentials: true }
        );

        setPaymentStatus('succeeded');
        onPaymentSuccess?.(paymentIntent);
        setTimeout(() => navigate('/venues'), 1500);
      }
    } catch (err) {
      console.error('Payment Error:', err);
      setError(err.response?.data?.message || err.message || 'Payment failed');
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      
      {error && (
        <div className="text-red-500 mt-2 p-2 bg-red-50 rounded">
          {error}
        </div>
      )}

      {paymentStatus === 'succeeded' && (
        <div className="text-green-500 mt-2 p-2 bg-green-50 rounded">
          Payment successful! Redirecting...
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-2 rounded mt-4 transition ${
          loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const venueId = location.state?.venueId;
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!venueId) {
      setError('No venue selected');
      setLoading(false);
      return;
    }

    const createPaymentIntent = async () => {
      try {
        const { data } = await axios.post(
          'http://localhost:5001/api/payments/create-payment-intent',
          { venueId },
          { withCredentials: true }
        );
        
        if (!data.clientSecret) throw new Error('Missing client secret');
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error('Payment Intent Error:', err);
        setError(err.response?.data?.message || 'Payment setup failed check Network Connectivity');
        if (err.response?.status === 404) {
          navigate('/venues', { state: { error: 'Venue not found' } });
        }
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [venueId, navigate]);

  const appearance = {
    theme: 'stripe',
    variables: { colorPrimary: '#0570de', borderRadius: '4px' }
  };

  const options = { clientSecret, appearance };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded shadow">
      {loading && <div className="text-center p-4">Loading payment gateway...</div>}
      
      {error && (
        <div className="text-red-500 p-3 bg-red-50 rounded mb-4">
          {error}
          <button
            onClick={() => navigate(-1)}
            className="block mt-2 text-blue-600 hover:underline"
          >
            ← Back to venues 
          </button>
        </div>
      )}

      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm 
            onPaymentSuccess={(paymentIntent) => {
              console.log('Payment completed:', paymentIntent);
              // Optional: Add any post-payment logic here
            }}
            venueId={venueId}
          />
        </Elements> 
      )}
    </div>
  );
};

export default CheckoutPage;
