import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const BookingCheckoutForm = ({ bookingId, onPaymentSuccess, onPaymentFailure }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    try {
      // Submit payment details to Stripe
      const { error: submitError } = await elements.submit();
      if (submitError) throw submitError;

      // Confirm payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: window.location.origin + '/my-bookings' },
        redirect: 'if_required',
      });

      if (stripeError) throw stripeError;

      if (paymentIntent?.status !== 'succeeded') {
        throw new Error('Payment processing failed');
      }

      // Confirm payment with backend and trigger emails/notifications
      await axios.post(
        `http://localhost:5001/api/bookings/${bookingId}/pay`,
        { paymentIntentId: paymentIntent.id },
        { withCredentials: true }
      );

      onPaymentSuccess();

    } catch (err) {
      console.error('Payment error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Payment processing failed';

      setError(errorMessage);
      onPaymentFailure();

      enqueueSnackbar(`Payment failed: ${errorMessage}`, {
        variant: 'error',
        autoHideDuration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement className="border border-gray-200 rounded-lg p-4" />

      {error && (
        <div className="p-3 bg-red-50 text-red-500 rounded-lg flex items-start">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 mt-0.5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-3 rounded-lg transition-colors ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
        } text-white font-medium flex justify-center items-center`}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </>
        ) : (
          'Pay Now'
        )}
      </button>
    </form>
  );
};

export default BookingCheckoutForm;
