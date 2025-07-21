import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';

const PlayPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [profile, setProfile] = useState(null);
  const [gameType, setGameType] = useState('cash'); // Default to cash games

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

  const cashGames = [
    {
      title: 'Heads Up',
      description: 'One-on-one matches to sharpen your postflop tactics and reads.',
      href: '/play/heads-up-bot'
    },
    {
      title: '6-Max',
      description: 'Fast-paced 6-player table. Great for practicing range reading and aggression.',
      href: '/play/6-max-bot'
    },
    {
      title: '9-Max',
      description: 'Full ring games with more players and complex dynamics.',
      href: '/play/9-max-bot'
    }
  ];

  const tournamentGames = [
    {
      title: 'Turbo Tournament',
      description: 'High blinds and quick action. Perfect for ICM and shove/fold training.',
      href: '/tournament'
    },
    {
      title: 'Sit & Go',
      description: 'Single table tournaments. Great for practicing final table play.',
      href: '/sng'
    },
    {
      title: 'MTT',
      description: 'Multi-table tournaments with varying stack depths.',
      href: '/mtt'
    }
  ];

  const renderGameOptions = (games) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {games.map((game, index) => (
        <Link 
          key={index}
          to={game.href}
          className="bg-[#1F2127] rounded-xl p-6 hover:bg-gray-700 transition-all duration-200 hover:-translate-y-1 shadow-lg border border-gray-700"
        >
          <h2 className="text-xl font-bold mb-2 text-white">{game.title}</h2>
          <p className="text-sm text-gray-300">{game.description}</p>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Play Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white">
            Play Poker
          </h2>
        </div>

        {/* Game Type Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#1F2127] rounded-full p-1 inline-flex border border-gray-700">
            <button
              onClick={() => setGameType('cash')}
              className={`px-6 py-2 rounded-full text-base font-semibold transition-all duration-200 ${
                gameType === 'cash'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Play a Bot
            </button>
            <button
              onClick={() => setGameType('tournament')}
              className={`px-6 py-2 rounded-full text-base font-semibold transition-all duration-200 ${
                gameType === 'tournament'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Tournaments
            </button>
            <button
              onClick={() => navigate('/play/friends')}
              className={`px-6 py-2 rounded-full text-base font-semibold transition-all duration-200 ${
                gameType === 'friends'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Play with Friends
            </button>
          </div>
        </div>

        {/* Game Options */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight text-center mb-8 text-white">
            {gameType === 'cash' ? 'Choose Your Cash Game Format' : 'Choose Your Tournament Format'}
          </h1>
          {gameType === 'cash' ? renderGameOptions(cashGames) : renderGameOptions(tournamentGames)}
        </div>
      </div>
    </div>
  );
};

export default PlayPage; 