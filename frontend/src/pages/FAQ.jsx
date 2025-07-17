
import React, { useState } from 'react';
import { MdOutlineSearch } from 'react-icons/md';
import react from '../assets/react.svg';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqs = [
    {
      question: 'How do I book an event as a promoter?',
      answer: 'Log in to your promoter account, select "Create Event", fill in the details, and submit. You will receive a confirmation notification once approved.',
    },
    {
      question: 'How do I book an event as an attendee?',
      answer: 'Browse the event calendar, select your event, click "Book Ticket", and proceed to checkout. Online payment is required to confirm your booking.',
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit and debit cards, as well as online payment platforms. You will receive a payment confirmation notification.',
    },
    {
      question: 'How do I view my booked events?',
      answer: 'Go to your dashboard and select "MyBookings". Here you can manage your bookings and view event details.',
    },

    {
      question: 'How do I generate a calendar of events?',
      answer: 'Visit the "Event Calendar" page to view all upcoming events. Promoters can manage their event schedules from their dashboard.',
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel your booking from your dashboard.',
    },
    {
      question: 'How do I contact support?',
      answer: 'You can contact support via the "Contact Us" page or by emailing support@ems.com. Our team will respond within 24 hours.',
    },


  ];

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index); 
  };

  return (
    <div className="min-h-screen bg-blue-150">

      <div >
        <h1 className='landing-h1'><img className='logo-img'
          src={react} alt="Company-logo" />EMS</h1>
      </div>


      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">


        {/* FAQ List */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200"
              >
                <button
                  className="w-full flex items-center justify-between p-3 focus:outline-none"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={activeIndex === index}
                >
                  <span className="text-base font-medium text-gray-800">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${activeIndex === index ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {activeIndex === index && (
                  <div className="px-3 pb-3 pt-0 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">No FAQs found matching your search.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
