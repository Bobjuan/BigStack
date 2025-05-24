import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import profBack from '../assets/images/profback.png';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const stats = [
    { label: 'Hands Played', value: '10,234' },
    { label: 'Win Rate', value: '5.2 BB/100' },
    { label: 'Total Profit', value: '$2,345' },
    { label: 'Tournaments Won', value: '3' }
  ];

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      getProfile();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-black p-6 relative overflow-hidden"
      style={{
        backgroundImage: `url(${profBack})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Background decoration (no overlay) */}
      <div className="absolute top-0 left-0 w-full h-full z-20">
        <div className="absolute top-[10%] left-[5%] w-[40rem] h-[40rem] bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[30rem] h-[30rem] bg-white/5 rounded-full blur-3xl"></div>
      </div>
      <div className="w-full max-w-md relative z-30">
        <div className="bg-white rounded-2xl shadow-2xl shadow-black/30 p-8 lg:p-10">
          <div className="text-center mb-4 mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 bg-clip-text text-transparent leading-relaxed py-1 whitespace-nowrap">
              {profile?.username || 'Anonymous Player'}
            </h1>
            <p className="text-gray-500 text-sm mb-4">Member since {new Date(user?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/10 p-4 rounded-xl text-center">
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <button className="w-full py-3 rounded-full bg-black text-white font-semibold hover:bg-gray-900 transition-all">Edit Profile</button>
            <button className="w-full py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all">View Game History</button>
            <button className="w-full py-3 rounded-full bg-white text-indigo-600 font-semibold hover:bg-gray-100 transition-all">Log Out</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 