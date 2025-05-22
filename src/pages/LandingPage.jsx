import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleStartLearning = (e) => {
    e.preventDefault();
    console.log('Start Learning button clicked');
    try {
      navigate('/signup');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const navItems = [
    { name: 'Product', href: '/product' },
    { name: 'Resources', href: '/resources' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Customers', href: '/customers' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <div className="min-h-screen bg-[#0F1115] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0F1115]/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 md:px-12 h-16">
          {/* Logo */}
          <Link to="/" className="text-lg font-semibold tracking-tight flex-shrink-0">
            BigStack Poker
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center">
            <div className="flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-sm text-gray-300 hover:text-white transition-colors duration-150 px-3 py-3 leading-normal rounded-full hover:bg-white/5"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Auth Buttons - Always visible */}
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-sm text-gray-300 hover:text-white transition-colors duration-150 px-3 py-3 leading-normal rounded-full hover:bg-white/5 whitespace-nowrap"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="text-sm bg-white text-[#0F1115] px-4 py-3 leading-normal rounded-full hover:bg-gray-100 transition-all duration-150 hover:-translate-y-0.5 whitespace-nowrap"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile menu button - Only for nav items */}
          <div className="md:hidden ml-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-colors duration-150"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu - Only for nav items */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block text-gray-300 hover:text-white hover:bg-white/5 px-3 py-3 leading-normal rounded-md text-base font-medium transition-colors duration-150"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-start min-h-screen px-4 sm:px-6 lg:px-8 pt-32 relative z-20">
        <div className="max-w-4xl mx-auto text-center relative z-30">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-8 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent relative z-30 leading-relaxed py-1">
            BigStack Poker: Master Poker Strategy
          </h1>
          <div className={`transform transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} relative z-30`}>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Interactive lessons, real-time stats, and the training you need to go all-in.
            </p>
            <button
              onClick={handleStartLearning}
              className="relative z-30 inline-block cursor-pointer px-6 py-3 text-base font-medium text-[#0F1115] bg-white rounded-full hover:bg-gray-100 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/10"
              aria-label="Start Learning for Free"
            >
              Start Learning for Free
            </button>
          </div>
        </div>

        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden z-10">
          <div className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[10%] right-[5%] w-[30rem] h-[30rem] bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage; 