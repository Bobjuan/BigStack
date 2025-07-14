import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
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
    <div className="w-full min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">
            {profile?.username || 'Anonymous Player'}'s Dashboard
          </h2>
        </div>

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
  );
};

export default DashboardPage; 