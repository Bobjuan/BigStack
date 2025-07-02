import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { name: 'Product', href: '/product' },
  { name: 'Resources', href: '/resources' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Customers', href: '/customers' },
  { name: 'Contact', href: '/contact' },
  { name: 'Chatbot', href: '/ai-review' },
];

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
    title: "Poker Solver",
    description: "Access an open-source, powerful WASM-based poker solver for GTO analysis.",
    link: "https://wasm-postflop.pages.dev/"
  }
];

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

const TopNavBar = () => {
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [isResourcesDropdownOpen, setIsResourcesDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const productDropdownTimeout = useRef();
  const resourcesDropdownTimeout = useRef();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0F1115]/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 md:px-12 h-20">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight flex-shrink-0">
          BigStack Poker
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-center flex-1">
          <div className="flex space-x-2 max-w-xl mx-auto">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                <Link
                  to={item.href}
                  className="text-base font-medium text-gray-300 hover:text-white hover:bg-indigo-600 transition-colors duration-150 px-3 py-2 leading-normal rounded-full"
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
          {user ? (
            <>
              <Link
                to="/profile"
                className="text-base font-medium text-gray-300 transition-colors duration-150 px-3 py-2 leading-normal rounded-full hover:bg-gray-800 hover:text-white whitespace-nowrap"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-base font-medium bg-white text-[#0F1115] px-4 py-2 leading-normal rounded-full transition-all duration-150 hover:-translate-y-0.5 hover:bg-gray-200 hover:text-[#0F1115] whitespace-nowrap"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-base font-medium text-gray-300 transition-colors duration-150 px-3 py-2 leading-normal rounded-full hover:bg-gray-800 hover:text-white whitespace-nowrap"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="text-base font-medium bg-white text-[#0F1115] px-4 py-2 leading-normal rounded-full transition-all duration-150 hover:-translate-y-0.5 hover:bg-gray-200 hover:text-[#0F1115] whitespace-nowrap"
              >
                Sign Up
              </Link>
            </>
          )}
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
              className="block w-full text-left text-base font-medium text-gray-200 bg-transparent px-4 py-2 rounded-md text-base font-medium focus:outline-none focus:bg-gray-800 hover:bg-indigo-600 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default TopNavBar; 