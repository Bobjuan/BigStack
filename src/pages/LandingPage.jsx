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
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);

  const productDropdownTimeout = useRef();
  const resourcesDropdownTimeout = useRef();

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

  const navItems = [
    { name: 'Product', href: '/product' },
    { name: 'Resources', href: '/resources' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Customers', href: '/customers' },
    { name: 'Contact', href: '/contact' },
  ];

  // Dropdown content for Product
  const productDropdown = [
    {
      title: "Live Play",
      description: "Practice your skills in real-time against other players.",
      link: "/play"
    },
    {
      title: "Interactive Lessons",
      description: "Learn poker fundamentals and advanced strategies through our comprehensive lesson library.",
      link: "/learn"
    },
    {
      title: "AI Review",
      description: "Get instant feedback on your play with our advanced AI analysis.",
      link: "/gto-trainer"
    },
    {
      title: "Poker Solver",
      description: "Access an open-source, powerful WASM-based poker solver for GTO analysis.",
      link: "https://wasm-postflop.pages.dev/"
    }
  ];

  // Dropdown content for Resources
  const resourcesDropdown = [
    {
      title: "Poker Strategy Guides",
      description: "Comprehensive guides covering everything from basic rules to advanced strategies.",
      link: "/learn"
    },
    {
      title: "Hand Analysis Tools",
      description: "Use our AI-powered tools to analyze your play and improve your game.",
      link: "/gto-trainer"
    },
    {
      title: "Practice Games",
      description: "Test your skills in various game formats and scenarios.",
      link: "/play"
    }
  ];

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
          <div className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex space-x-2 max-w-xl mx-auto">
              {navItems.map((item) => (
                <div key={item.name} className="relative">
                  <Link
                    to={item.href}
                    className="text-sm text-gray-300 hover:text-white hover:bg-indigo-600 transition-colors duration-150 px-3 py-2 leading-normal rounded-full"
                    onMouseEnter={() => {
                      if (item.name === 'Product') {
                        clearTimeout(productDropdownTimeout.current);
                        setIsProductDropdownOpen(true);
                      }
                      if (item.name === 'Resources') {
                        clearTimeout(resourcesDropdownTimeout.current);
                        setIsResourcesDropdownOpen(true);
                      }
                    }}
                    onMouseLeave={() => {
                      if (item.name === 'Product') {
                        productDropdownTimeout.current = setTimeout(() => setIsProductDropdownOpen(false), 120);
                      }
                      if (item.name === 'Resources') {
                        resourcesDropdownTimeout.current = setTimeout(() => setIsResourcesDropdownOpen(false), 120);
                      }
                    }}
                  >
                    {item.name}
                  </Link>
                  {/* Product Dropdown */}
                  {item.name === 'Product' && isProductDropdownOpen && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[540px] max-w-[90vw] bg-[#181A1B] border border-white/10 rounded-2xl shadow-2xl z-50 p-6 flex justify-between overflow-hidden"
                      style={{minWidth: 400}}
                      onMouseEnter={() => {
                        clearTimeout(productDropdownTimeout.current);
                        setIsProductDropdownOpen(true);
                      }}
                      onMouseLeave={() => {
                        productDropdownTimeout.current = setTimeout(() => setIsProductDropdownOpen(false), 120);
                      }}
                    >
                      {productDropdown.map((feature, idx) => (
                        feature.link.startsWith('http') ? (
                          <a
                            key={feature.title}
                            href={feature.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 min-w-[0] max-w-[180px] px-3 py-2 rounded-lg hover:bg-white/5 transition-colors duration-150"
                          >
                            <div className="mb-1 text-base font-semibold text-white whitespace-normal break-words">{feature.title}</div>
                            <div className="text-gray-400 text-xs leading-snug whitespace-normal break-words">{feature.description}</div>
                          </a>
                        ) : (
                          <Link
                            key={feature.title}
                            to={feature.link}
                            className="flex-1 min-w-[0] max-w-[180px] px-3 py-2 rounded-lg hover:bg-white/5 transition-colors duration-150"
                          >
                            <div className="mb-1 text-base font-semibold text-white whitespace-normal break-words">{feature.title}</div>
                            <div className="text-gray-400 text-xs leading-snug whitespace-normal break-words">{feature.description}</div>
                          </Link>
                        )
                      ))}
                    </div>
                  )}
                  {/* Resources Dropdown */}
                  {item.name === 'Resources' && isResourcesDropdownOpen && (
                    <div
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[540px] max-w-[90vw] bg-[#181A1B] border border-white/10 rounded-2xl shadow-2xl z-50 p-6 flex justify-between overflow-hidden"
                      style={{minWidth: 400}}
                      onMouseEnter={() => {
                        clearTimeout(resourcesDropdownTimeout.current);
                        setIsResourcesDropdownOpen(true);
                      }}
                      onMouseLeave={() => {
                        resourcesDropdownTimeout.current = setTimeout(() => setIsResourcesDropdownOpen(false), 120);
                      }}
                    >
                      {resourcesDropdown.map((resource, idx) => (
                        <Link
                          key={resource.title}
                          to={resource.link}
                          className="flex-1 min-w-[0] max-w-[180px] px-3 py-2 rounded-lg hover:bg-white/5 transition-colors duration-150"
                        >
                          <div className="mb-1 text-base font-semibold text-white whitespace-normal break-words">{resource.title}</div>
                          <div className="text-gray-400 text-xs leading-snug whitespace-normal break-words">{resource.description}</div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Auth buttons and mobile menu */}
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="text-sm text-gray-300 transition-colors duration-150 px-3 py-2 leading-normal rounded-full hover:bg-gray-800 hover:text-white whitespace-nowrap"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="text-sm bg-white text-[#0F1115] px-4 py-2 leading-normal rounded-full transition-all duration-150 hover:-translate-y-0.5 hover:bg-gray-200 hover:text-[#0F1115] whitespace-nowrap"
            >
              Sign Up
            </Link>
            {/* Hamburger menu icon for mobile (shows below lg) */}
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-colors duration-150 lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Open main menu"
            >
              <svg className="block h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Simple mobile menu (no hover, no dropdown) */}
        {isMobileMenuOpen && (
          <div className="fixed top-20 right-4 bg-[#181A1B] border border-white/10 rounded-xl shadow-2xl p-4 z-50 flex flex-col space-y-2 w-56 lg:hidden">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block w-full text-left text-gray-200 bg-transparent px-4 py-2 rounded-md text-base font-medium focus:outline-none focus:bg-gray-800 hover:bg-indigo-600 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
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
                  className="relative z-30 inline-block cursor-pointer px-8 py-4 text-lg font-medium text-[#0F1115] bg-white rounded-full transition-all duration-150 hover:-translate-y-0.5 hover:bg-gray-200 hover:text-[#0F1115] hover:shadow-2xl hover:shadow-indigo-500/80"
                  aria-label="Play Now"
                >
                  Play Now
                </Link>
                <button
                  onClick={handleStartLearning}
                  className="relative z-30 inline-block cursor-pointer px-8 py-4 text-lg font-medium text-[#0F1115] bg-white rounded-full transition-all duration-150 hover:-translate-y-0.5 hover:bg-gray-200 hover:text-[#0F1115] hover:shadow-2xl hover:shadow-indigo-500/80"
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