import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';

const PlayPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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

  const handleLogout = () => {
    navigate('/');
  };

  const cashGames = [
    {
      title: 'Heads Up',
      description: 'One-on-one matches to sharpen your postflop tactics and reads.',
      href: '/heads-up'
    },
    {
      title: '6-Max',
      description: 'Fast-paced 6-player table. Great for practicing range reading and aggression.',
      href: '/cash-game'
    },
    {
      title: '9-Max',
      description: 'Full ring games with more players and complex dynamics.',
      href: '/nine-max'
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
    <div className="min-h-screen bg-black text-white flex">
      {/* Collapsible Sidebar */}
      <div className={`bg-[#1a1a1a] transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'} min-h-screen flex flex-col fixed left-0 top-0 z-10`}>
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
            className={`flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'} mb-6 py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors text-xl font-bold hover:shadow-lg hover:shadow-indigo-500/40`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`ml-3 ${!isSidebarOpen && 'hidden'}`}>Play</span>
          </Link>
          
          <Link 
            to="/learn" 
            className={`flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'} mb-6 py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors text-xl font-bold border-2 border-white hover:shadow-lg hover:shadow-indigo-500/40`}
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
            to="/dashboard"
            className={`flex items-center ${isSidebarOpen ? 'justify-start w-full' : 'justify-center w-full'} py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors text-xl font-bold hover:shadow-lg hover:shadow-indigo-500/40`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className={`ml-3 ${!isSidebarOpen && 'hidden'}`}>Home</span>
          </Link>

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

        {/* Play Header - Always visible and sticky */}
        <div className="bg-black py-8 px-8 border-b-2 border-white sticky top-0 z-20">
          <h2 className="text-3xl font-bold text-white mt-4 -mb-4">
            Play Poker
          </h2>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto py-8 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
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
                  Cash Games
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
                <Link
                  to="/play-with-friends"
                  className="px-6 py-2 rounded-full text-base font-semibold text-gray-400 hover:text-white transition-all duration-200"
                >
                  Play with Friends
                </Link>
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
      </div>
    </div>
  );
};

export default PlayPage; 