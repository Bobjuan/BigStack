import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EmailWaitlistForm from './EmailWaitlistForm';
import AccessCodeModal from './AccessCodeModal';

export default function PublicNavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0F1115]/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 md:px-12 h-20">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight flex-shrink-0">
          BigStack Poker
        </Link>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="max-w-sm">
            <EmailWaitlistForm size="sm" />
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsAccessModalOpen(true)}
              className="text-base font-medium bg-white text-[#0F1115] px-4 py-2 leading-normal rounded-full transition-all duration-150 hover:-translate-y-0.5 hover:bg-gray-200 hover:text-[#0F1115] whitespace-nowrap"
            >
              Access Code
            </button>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-colors duration-150 md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Open main menu"
        >
          <svg className="block h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-20 right-4 bg-[#181A1B] border border-white/10 rounded-xl shadow-2xl p-4 z-50 w-72 md:hidden">
          <div className="space-y-4">
            <div>
              <EmailWaitlistForm />
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsAccessModalOpen(true);
                }}
                className="block w-full text-center text-base font-medium bg-white text-[#0F1115] px-4 py-2 rounded-md hover:bg-gray-200"
              >
                Access Code
              </button>
            </div>
          </div>
        </div>
      )}
      
      <AccessCodeModal 
        isOpen={isAccessModalOpen} 
        onClose={() => setIsAccessModalOpen(false)} 
      />
    </nav>
  );
}