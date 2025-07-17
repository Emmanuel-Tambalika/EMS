
import React from 'react';
import react from '../assets/react.svg';

const Blog = () => {
  // Blog posts relevant to Zimbabwe event space and music management
  const blogPosts = [
    {
      id: 1,
      title: "Growth of Zimbabwe's Music Festivals",
      excerpt: "Zimbabwe’s music festivals are gaining momentum, attracting attention and supporting local artists. The Music Management Forum plays a vital role in organizing and promoting these events.",
      date: "May 25, 2025",
      category: "Event Spotlight",
    },
    {
      id: 2,
      title: "Supporting Local Artists Through Events",
      excerpt: "Modern event management helps Zimbabwean musicians by simplifying bookings, payments, and promotions, thanks to initiatives led by the Music Management Forum.",
      date: "May 18, 2025",
      category: "Industry Insights",
    },
    {
      id: 3,
      title: "Building a Strong Music Scene",
      excerpt: "The Music Management Forum is working to create a sustainable music industry in Zimbabwe, focusing on event planning and artist support.",
      date: "May 10, 2025",
      category: "Sustainability",
    },
  ];

  return (
    <div className="min-h-screen bg-blue-150">
      <div>
        <h1 className='landing-h1'><img className='logo-img'
          src={react} alt="Company-logo" />EMS</h1>
      </div>

      {/* Blog Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Blog: Zimbabwe Event Space</h2>
        <p className="text-gray-600 mb-6">
          Stay updated with the latest news and insights from the Music Management Forum of Zimbabwe.
        </p>

        {/* Blog Posts */}
        <div className="space-y-5">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all">
              <div className="p-4">
                <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full mb-2">
                  {post.category}
                </span>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-2">{post.excerpt}</p>
                <div className="text-sm text-gray-500">
                  {post.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;

