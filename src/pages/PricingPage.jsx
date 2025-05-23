import React from 'react';
import { Link } from 'react-router-dom';

const PricingPage = () => {
  const features = [
    'Unlimited access to all poker lessons',
    'Real-time play against other players',
    'AI-powered hand analysis',
    'Interactive quizzes and exercises',
    'Progress tracking and statistics',
    'Community forums and discussions',
    'Regular strategy updates',
    'Mobile-friendly platform'
  ];

  return (
    <div className="min-h-screen bg-[#0F1115] text-white font-inter">
      {/* Navigation - Reusing the same nav as landing page */}
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
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We believe in making poker education accessible to everyone. That's why BigStack is completely free.
            </p>
          </div>

          {/* Pricing Card */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 rounded-2xl p-8 md:p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Everything you need</h2>
                <div className="flex items-center justify-center">
                  <span className="text-5xl font-bold">$0</span>
                </div>
              </div>

              {/* Features List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <svg className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <Link
                  to="/signup"
                  className="inline-flex items-center px-8 py-4 bg-white text-[#0F1115] rounded-full hover:bg-gray-100 transition-all duration-150 hover:-translate-y-0.5 text-lg font-medium"
                >
                  Get Started for Free
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PricingPage; 