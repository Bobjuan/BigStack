import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (user) {
      getProfile();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Collapsible Sidebar */}
      <div className={`bg-[#1a1a1a] transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'} min-h-screen flex flex-col fixed left-0 top-0`}>
        <div className="pt-10">
          <div className={`px-4 ${!isSidebarOpen && 'flex justify-center'}`}>
            <div className={`flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'} mb-6`}>
              <h1 className={`text-3xl md:text-4xl font-bold text-white ${!isSidebarOpen && 'hidden'}`}>BigStack</h1>
              <button 
                onClick={() => setSidebarOpen(!isSidebarOpen)} 
                className="text-gray-400 hover:text-white transition-colors"
              >
                {isSidebarOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div className={`border-t-2 border-gray-600 ${isSidebarOpen ? '-mt-1' : 'mt-3'}`}></div>
        </div>

        <nav className="flex-1 p-4">
          <Link 
            to="/play" 
            className={`flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'} mb-6 py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors text-xl font-bold border-2 border-white hover:shadow-lg hover:shadow-indigo-500/40`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`ml-3 ${!isSidebarOpen && 'hidden'}`}>Play</span>
          </Link>
          
          <Link 
            to="/learn" 
            className={`flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'} mb-6 py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors text-xl font-bold hover:shadow-lg hover:shadow-indigo-500/40`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className={`ml-3 ${!isSidebarOpen && 'hidden'}`}>Learn</span>
          </Link>
          
          <Link 
            to="/quiz" 
            className={`flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'} mb-6 py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors text-xl font-bold hover:shadow-lg hover:shadow-indigo-500/40`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`ml-3 ${!isSidebarOpen && 'hidden'}`}>Quiz</span>
          </Link>
        </nav>

        <div className="p-4 space-y-3">
          <Link
            to="/profile"
            className={`flex items-center ${isSidebarOpen ? 'justify-start w-full' : 'justify-center w-full'} py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors text-xl font-bold hover:shadow-lg hover:shadow-indigo-500/40`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className={`ml-3 ${!isSidebarOpen && 'hidden'}`}>Profile</span>
          </Link>

          <button
            onClick={handleLogout}
            className={`flex items-center ${isSidebarOpen ? 'justify-start w-full' : 'justify-center w-full'} py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors text-xl font-bold hover:shadow-lg hover:shadow-indigo-500/40`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className={`ml-3 ${!isSidebarOpen && 'hidden'}`}>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} flex flex-col h-screen`}>
        {/* Top Right Menu (visible when sidebar is collapsed) */}
        {!isSidebarOpen && (
          <div className="fixed top-4 right-4 flex items-center space-x-4 z-10">
            <Link
              to="/profile"
              className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors hover:shadow-lg hover:shadow-indigo-500/40"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors hover:shadow-lg hover:shadow-indigo-500/40"
            >
              Logout
            </button>
          </div>
        )}

        {/* Dashboard Header - Always visible and sticky */}
        <div className="bg-black py-8 px-8 border-b-2 border-white sticky top-0 z-20">
          <h2 className="text-3xl font-bold text-white mt-4 -mb-4">
            {profile?.username || 'Anonymous Player'}'s {!isSidebarOpen && 'BigStack '}Dashboard
          </h2>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto py-8 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Upcoming Events Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {/* Tournament Card */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-4 md:p-6 hover:from-indigo-700 hover:to-indigo-900 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <h3 className="text-lg md:text-xl font-bold">Tournament</h3>
                  </div>
                  <p className="text-gray-200 text-sm md:text-base">March 15, 2024</p>
                </div>

                {/* Workshop Card */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-4 md:p-6 hover:from-indigo-700 hover:to-indigo-900 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <h3 className="text-lg md:text-xl font-bold">Workshop</h3>
                  </div>
                  <p className="text-gray-200 text-sm md:text-base">March 20, 2024</p>
                </div>

                {/* Live Session Card */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-4 md:p-6 hover:from-indigo-700 hover:to-indigo-900 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <h3 className="text-lg md:text-xl font-bold">Live Session</h3>
                  </div>
                  <p className="text-gray-200 text-sm md:text-base">March 25, 2024</p>
                </div>

                {/* Community Event Card */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-4 md:p-6 hover:from-indigo-700 hover:to-indigo-900 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <h3 className="text-lg md:text-xl font-bold">Community Event</h3>
                  </div>
                  <p className="text-gray-200 text-sm md:text-base">March 30, 2024</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-8">Stats Overview</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* ELO Tracker Card */}
              <div className="w-full bg-[#1F2127] rounded-xl p-6">
                <div className="text-xl font-bold mb-4">
                  ELO: <span id="elo-value" className="text-white">1200</span>
                </div>
                <div className="w-full h-64 rounded-lg bg-[#2a2d36] border border-gray-700 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">Embed graphs here</span>
                  </div>
                  <canvas 
                    id="elo-chart" 
                    className="w-full h-full"
                  ></canvas>
                </div>
              </div>

              {/* Bankroll Tracker Card */}
              <div className="w-full bg-[#1F2127] rounded-xl p-6">
                <div className="text-xl font-bold mb-4">
                  Bankroll: $<span id="bankroll-value" className="text-white">0</span>
                </div>
                <div className="w-full h-64 rounded-lg bg-[#2a2d36] border border-gray-700 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">Embed graphs here</span>
                  </div>
                  <canvas 
                    id="bankroll-chart" 
                    className="w-full h-full"
                  ></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 