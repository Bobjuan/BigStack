import React from 'react';
import { Link } from 'react-router-dom';

const ResourcesPage = () => {
  const resources = [
    {
      title: "Poker Strategy Guides",
      description: "Comprehensive guides covering everything from basic rules to advanced strategies.",
      link: "/learn",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      title: "Hand Analysis Tools",
      description: "Use our AI-powered tools to analyze your play and improve your game.",
      link: "/gto-trainer",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Practice Games",
      description: "Test your skills in various game formats and scenarios.",
      link: "/play",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
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
              Poker Resources
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to improve your poker game, all in one place.
            </p>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {resources.map((resource, index) => (
              <Link
                key={index}
                to={resource.link}
                className="bg-white/5 rounded-2xl p-8 hover:bg-white/10 transition-colors duration-150"
              >
                <div className="text-white mb-4">
                  {resource.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{resource.title}</h3>
                <p className="text-gray-300 leading-relaxed">{resource.description}</p>
              </Link>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-4 bg-white text-[#0F1115] rounded-full hover:bg-gray-100 transition-all duration-150 hover:-translate-y-0.5 text-lg font-medium"
            >
              Start Learning for Free
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResourcesPage; 