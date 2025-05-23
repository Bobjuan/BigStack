import React from 'react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[#0F1115] text-white font-inter">
      {/* Navigation - Reusing the same nav as landing page */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0F1115]/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 md:px-12 h-20">
          <a href="/" className="text-xl font-semibold tracking-tight flex-shrink-0">
            BigStack Poker
          </a>
          <div className="flex items-center space-x-4">
            <a
              href="/login"
              className="text-base text-gray-300 hover:text-white transition-colors duration-150 px-4 py-3 leading-normal rounded-full hover:bg-white/5 whitespace-nowrap"
            >
              Log In
            </a>
            <a
              href="/signup"
              className="text-base bg-white text-[#0F1115] px-6 py-3 leading-normal rounded-full hover:bg-gray-100 transition-all duration-150 hover:-translate-y-0.5 whitespace-nowrap"
            >
              Sign Up
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
              BigStack is here to make learning poker easy.
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get in touch with our team. We're here to help you improve your poker game.
            </p>
          </div>

          {/* Contact Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Sales Section */}
            <div className="bg-white/5 rounded-2xl p-8 hover:bg-white/10 transition-colors duration-200">
              <h2 className="text-2xl font-semibold mb-4">Sales</h2>
              <p className="text-gray-300 mb-6">
                Interested in our enterprise solutions or have questions about our pricing? Our sales team is here to help.
              </p>
              <button
                className="inline-flex items-center px-6 py-3 bg-white text-[#0F1115] rounded-full hover:bg-gray-100 transition-all duration-150 hover:-translate-y-0.5"
              >
                Talk to Sales
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Support Section */}
            <div className="bg-white/5 rounded-2xl p-8 hover:bg-white/10 transition-colors duration-200">
              <h2 className="text-2xl font-semibold mb-4">Help & Support</h2>
              <p className="text-gray-300 mb-6">
                Need help with your account or have technical questions? Our support team is ready to assist you.
              </p>
              <button
                className="inline-flex items-center px-6 py-3 bg-white text-[#0F1115] rounded-full hover:bg-gray-100 transition-all duration-150 hover:-translate-y-0.5"
              >
                Contact Support
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-20 text-center">
            <p className="text-gray-400">
              We typically respond within 24 hours during business days.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage; 