import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';

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
    <div className="min-h-screen bg-black py-12 px-6">
      <div className="max-w-2xl mx-auto bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">{profile?.username || 'Anonymous Player'}</h1>
          <p className="text-gray-200">Member since {new Date(user?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-600 to-gray-700 p-4 rounded-xl text-center">
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <Button variant="primary" className="w-full py-3 bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white">
            Edit Profile
          </Button>
          <Button variant="secondary" className="w-full py-3 bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white">
            View Game History
          </Button>
          <Button variant="danger" className="w-full py-3 bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white">
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 