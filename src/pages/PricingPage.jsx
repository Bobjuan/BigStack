import React from 'react';
import { Link } from 'react-router-dom';
import TopNavBar from '../components/layout/TopNavBar';
import Footer from '../components/layout/Footer';

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
      <TopNavBar />
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
              Pricing
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose the plan that fits your needs and start improving your poker game today.
            </p>
          </div>
          {/* Features List */}
          <ul className="max-w-2xl mx-auto text-lg text-gray-200 space-y-4 mb-12">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center">
                <span className="mr-3 text-indigo-400">&#10003;</span> {feature}
              </li>
            ))}
          </ul>
          {/* Call to Action */}
          <div className="flex justify-center gap-6">
            <Link
              to="/signup"
              className="bg-white text-[#0F1115] px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-200 hover:text-[#0F1115] transition-all duration-150"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-gray-800 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-700 transition-all duration-150"
            >
              Log In
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage; 
