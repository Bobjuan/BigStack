import React from 'react';
import { Link } from 'react-router-dom';

const CustomersPage = () => {
  const institutionalClients = [
    {
      title: "College Poker Clubs",
      description: "Empower your university's poker community with professional training tools and resources. Perfect for both casual players and competitive teams.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      title: "Adult Poker Clubs",
      description: "Elevate your club's training program with our comprehensive platform. From beginner workshops to advanced strategy sessions.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];

  const individualClients = [
    {
      title: "Beginner Players",
      description: "Start your poker journey with structured learning paths and interactive lessons designed for new players.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: "Intermediate Players",
      description: "Take your game to the next level with advanced strategy training and detailed hand analysis.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Advanced Players",
      description: "Fine-tune your strategy with GTO training and expert-level analysis tools.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#0F1115] text-white font-inter">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0F1115]/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 md:px-12 h-20">
          <Link to="/" className="text-xl font-semibold tracking-tight flex-shrink-0">
            BigStack Poker
          </Link>
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-base text-gray-300 hover:text-white transition-colors duration-150 px-4 py-3 leading-normal rounded-full hover:bg-white/5 whitespace-nowrap"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="text-base bg-white text-[#0F1115] px-6 py-3 leading-normal rounded-full hover:bg-gray-100 transition-all duration-150 hover:-translate-y-0.5 whitespace-nowrap"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
              Our Customers
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              From individual players to university poker clubs, we're helping everyone improve their game.
            </p>
          </div>

          {/* Individual Clients Section */}
          <div className="mb-32">
            <h2 className="text-3xl font-bold mb-12 text-center">Individual Players</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {individualClients.map((client, index) => (
                <div key={index} className="bg-white/5 rounded-2xl p-8 hover:bg-white/10 transition-colors duration-150">
                  <div className="text-white mb-4">
                    {client.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{client.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{client.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Institutional Clients Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-12 text-center">Institutional Clients</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {institutionalClients.map((client, index) => (
                <div key={index} className="bg-white/5 rounded-2xl p-8 hover:bg-white/10 transition-colors duration-150">
                  <div className="text-white mb-4">
                    {client.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{client.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{client.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center space-x-4">
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-4 bg-white text-[#0F1115] rounded-full hover:bg-gray-100 transition-all duration-150 hover:-translate-y-0.5 text-lg font-medium"
            >
              Join Our Community
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-white text-[#0F1115] rounded-full hover:bg-gray-100 transition-all duration-150 hover:-translate-y-0.5 text-lg font-medium"
            >
              Contact Sales
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomersPage; 