import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import image1 from '../assets/images/image1.png';
import image2 from '../assets/images/image2.png';
import image3 from '../assets/images/image3.png';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showImage1, setShowImage1] = useState(false);
  const [showImage2, setShowImage2] = useState(false);
  const [showImage3, setShowImage3] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownTimeoutRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    // Sequential fade-in for images
    setTimeout(() => setShowImage1(true), 500);
    setTimeout(() => setShowImage2(true), 1000);
    setTimeout(() => setShowImage3(true), 1500);
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

  const productMenuItems = [
    {
      section: 'Product',
      items: [
        { name: 'Live Play', href: '/play', description: 'Practice with real players in a competitive environment' },
        { name: 'Interactive Lessons', href: '/learn', description: 'Learn poker strategy through hands-on lessons' },
        { name: 'AI Review', href: '/ai-review', description: 'Get personalized feedback on your gameplay' },
      ],
    },
  ];

  const resourcesMenuItems = [
    {
      section: 'Company',
      items: [
        { name: 'About', href: '/about', description: 'Meet the team' },
        { name: 'Careers', href: '/careers', description: "We're hiring" },
      ],
    },
    {
      section: 'Explore',
      items: [
        { name: 'Blog', href: '/blog', description: 'Latest articles and strategy guides' },
        { name: 'Documentation', href: '/docs', description: 'Detailed guides and API references' },
        { name: 'Community', href: '/community', description: 'Join our growing poker community' },
      ],
    },
  ];

  const navItems = [
    { name: 'Product', href: '/product', hasDropdown: true, items: productMenuItems },
    { name: 'Resources', href: '/resources', hasDropdown: true, items: resourcesMenuItems },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Customers', href: '/customers' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleDropdownEnter = (itemName) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(itemName);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200); // 200ms delay before closing
  };

  return (
    <div className="min-h-screen bg-[#0F1115] text-white font-inter">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0F1115]/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 md:px-12 h-20">
          {/* Logo */}
          <Link to="/" className="text-xl font-semibold tracking-tight flex-shrink-0">
            BigStack Poker
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center">
            <div className="flex space-x-4">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.hasDropdown && handleDropdownEnter(item.name)}
                  onMouseLeave={() => item.hasDropdown && handleDropdownLeave()}
                >
                  <Link
                    to={item.href}
                    className="text-base text-gray-300 hover:text-white transition-colors duration-150 px-4 py-3 leading-normal rounded-full hover:bg-white/5 flex items-center"
                  >
                    {item.name}
                    {item.hasDropdown && (
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {item.hasDropdown && item.name === 'Resources' && activeDropdown === item.name && (
                    <div
                      className="absolute left-0 mt-2 w-[600px] rounded-2xl bg-[#181A1B] border border-white/10 shadow-2xl p-6 flex text-left z-50"
                      onMouseEnter={() => handleDropdownEnter(item.name)}
                      onMouseLeave={() => handleDropdownLeave()}
                      style={{ minHeight: '220px' }}
                    >
                      {resourcesMenuItems.map((section, idx) => (
                        <div key={section.section} className={idx === 0 ? 'w-1/3 pr-8 border-r border-white/10' : 'w-2/3 pl-8'}>
                          <div className="text-gray-500 text-sm font-semibold mb-4 tracking-wide">{section.section}</div>
                          <div className="space-y-6">
                            {section.items.map((subItem) => (
                              <Link
                                key={subItem.name}
                                to={subItem.href}
                                className="block group"
                              >
                                <div className="font-semibold text-white group-hover:underline text-base mb-0.5">{subItem.name}</div>
                                <div className="text-gray-400 text-sm leading-tight">{subItem.description}</div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {item.hasDropdown && item.name === 'Product' && activeDropdown === item.name && (
                    <div
                      className="absolute left-0 mt-2 w-[400px] rounded-2xl bg-[#181A1B] border border-white/10 shadow-2xl p-6 flex text-left z-50"
                      onMouseEnter={() => handleDropdownEnter(item.name)}
                      onMouseLeave={() => handleDropdownLeave()}
                      style={{ minHeight: '180px' }}
                    >
                      {productMenuItems.map((section) => (
                        <div key={section.section} className="w-full">
                          <div className="text-gray-500 text-sm font-semibold mb-4 tracking-wide">{section.section}</div>
                          <div className="space-y-6">
                            {section.items.map((subItem) => (
                              <Link
                                key={subItem.name}
                                to={subItem.href}
                                className="block group"
                              >
                                <div className="font-semibold text-white group-hover:underline text-base mb-0.5">{subItem.name}</div>
                                <div className="text-gray-400 text-sm leading-tight">{subItem.description}</div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Auth Buttons - Always visible */}
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

          {/* Mobile menu button - Only for nav items */}
          <div className="md:hidden ml-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-colors duration-150"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              ) : (
                <svg className="block h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
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
                <div key={item.name}>
                  <Link
                    to={item.href}
                    className="block text-gray-300 hover:text-white hover:bg-white/5 px-3 py-3 leading-normal rounded-md text-lg font-medium transition-colors duration-150"
                  >
                    {item.name}
                  </Link>
                  {item.hasDropdown && (
                    <div className="pl-4 space-y-1">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          className="block text-gray-400 hover:text-white hover:bg-white/5 px-3 py-2 rounded-md text-base transition-colors duration-150"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-start min-h-screen px-4 sm:px-6 lg:px-8 pt-40 relative z-20">
        <div className="max-w-4xl mx-auto text-center relative z-30">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-8 text-white relative z-30 leading-relaxed py-1">
            BigStack: Dynamic Poker Training
          </h1>
          <div className={`transform transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} relative z-30`}>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Live Play, Interactive Lessons, and AI Review to provide all the training you need to go all-in.
            </p>
            <div className="relative z-30">
              <div className="flex gap-4 justify-center">
                <Link
                  to="/login"
                  className="relative z-30 inline-block cursor-pointer px-8 py-4 text-lg font-medium text-[#0F1115] bg-white rounded-full hover:bg-gray-100 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/10"
                  aria-label="Play Now"
                >
                  Play Now
                </Link>
                <button
                  onClick={handleStartLearning}
                  className="relative z-30 inline-block cursor-pointer px-8 py-4 text-lg font-medium text-[#0F1115] bg-white rounded-full hover:bg-gray-100 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/10"
                  aria-label="Start Learning"
                >
                  Start Learning
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Image Grid Section */}
        <div className="w-full max-w-7xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className={`relative w-full md:w-1/3 transition-opacity duration-1000 ${showImage1 ? 'opacity-100' : 'opacity-0'} md:mt-8`}>
              <img
                src={image1}
                alt="Poker Training"
                className="w-full h-auto object-contain rounded-2xl"
              />
            </div>
            <div className={`relative w-full md:w-1/4 transition-opacity duration-1000 ${showImage2 ? 'opacity-100' : 'opacity-0'} md:mt-12`}>
              <img
                src={image3}
                alt="AI Analysis"
                className="w-full h-auto object-contain rounded-2xl"
              />
            </div>
            <div className={`relative w-full md:w-1/3 transition-opacity duration-1000 ${showImage3 ? 'opacity-100' : 'opacity-0'}`}>
              <img
                src={image2}
                alt="Live Play"
                className="w-full h-auto object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl font-bold text-white leading-tight">
                BigStack is here to make learning poker easy.
              </h2>
            </div>
            <div className="pt-2">
              <p className="text-xl text-gray-300 leading-relaxed">
                Say goodbye to scouring the internet looking for information to help you level up your game. Whether you're just starting out or looking to refine your strategy, BigStack offers everything you are looking for: competitive play, comprehensive lessons, and in-depth review with BigStack AI.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gray-800 my-24"></div>

          {/* Second Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div className="pt-2">
              <p className="text-xl text-gray-300 leading-relaxed">
                As college students passionate about poker, we're committed to democratizing poker education. We understand that traditional training platforms can be prohibitively expensive, which is why we've created an accessible alternative that delivers high-quality training without the premium price tag.
              </p>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-white leading-tight">
                For poker players, by poker players.
              </h2>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Spacing */}
      <div className="h-32"></div>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-[#0F1115]/80 backdrop-blur-xl py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              © 2025 BigStake. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-400 hover:text-white transition-colors duration-150"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 