import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const PageLayout = ({ children, showProfile = true, showNavigation = true }) => {
  return (
    <div className="bg-[#1b1f2b] text-white min-h-screen flex flex-col items-center p-6">
      {showProfile && (
        <div className="absolute top-6 right-6 z-10">
          <Link to="/profile" className="group">
            <div className="w-10 h-10 rounded-full bg-[#2f3542] flex items-center justify-center hover:bg-[#3a4052] transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </Link>
        </div>
      )}

      <div className="w-full max-w-4xl">
        {children}
      </div>

      {showNavigation && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex justify-center gap-4">
          <Link to="/dashboard" className="nav-button secondary">
            Back to Dashboard
          </Link>
          <Link to="/quiz" className="nav-button primary">
            Try a Quiz
          </Link>
        </div>
      )}
    </div>
  );
};

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  showProfile: PropTypes.bool,
  showNavigation: PropTypes.bool,
};

export default PageLayout; 