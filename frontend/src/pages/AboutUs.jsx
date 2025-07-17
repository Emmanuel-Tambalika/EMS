import React from 'react';
import react from '../assets/react.svg';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact top area */}
      <div className="bg-white shadow-sm py-2">
        <div className="max-w-4xl mx-auto px-4 flex items-center">
          <img className="w-8 h-8 mr-2" src={react} alt="Company-logo" />
          <h1 className="text-xl font-bold text-blue-600">EMS</h1>
        </div>
      </div>

      {/* About Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">About Us</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 mb-4">
            EMS is the leading event management platform supporting the Music Management Forum of Zimbabwe and the wider event industry.
          </p>
          <p className="text-gray-600 mb-4">
            Our mission is to empower promoters, artists, and attendees by providing easy online booking, secure payments, and efficient event management tools.
          </p>
          <p className="text-gray-600">
            We are committed to fostering growth in Zimbabwe’s music and event spaces, making it easier for everyone to discover, organize, and enjoy events.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
