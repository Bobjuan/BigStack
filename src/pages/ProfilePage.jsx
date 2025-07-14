import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import profBack from '../assets/images/profback.png';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [playerStats, setPlayerStats] = useState(null);
  const [recentHands, setRecentHands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [handsLoading, setHandsLoading] = useState(false);

  // Progress bar goals for hands played
  const BASIC_EVALUATION_HANDS = 150; // First goal - basic understanding
  const ADVANCED_EVALUATION_HANDS = 500; // Second goal - comprehensive analysis

  // Calculate stats display values
  const calculateStat = (actions, opportunities) => {
    if (!opportunities || opportunities === 0) return '–';
    return `${Math.round((actions / opportunities) * 100)}%`;
  };

  const getProgressPercentage = (current, goal) => {
    return Math.min((current / goal) * 100, 100);
  };

  const canEvaluate = playerStats && playerStats.hands_played >= BASIC_EVALUATION_HANDS;

  // Format card display
  const formatCards = (cards) => {
    if (!cards || cards.length === 0) return '--';
    return cards.map(card => {
      // Convert card format from server (e.g., "As" -> "A♠")
      const rank = card.slice(0, -1);
      const suit = card.slice(-1);
      const suitSymbol = {
        'h': '♥', 'd': '♦', 'c': '♣', 's': '♠'
      }[suit.toLowerCase()] || suit;
      return `${rank}${suitSymbol}`;
    }).join(' ');
  };

  // Fetch recent hands for the player
  const fetchRecentHands = async () => {
    setHandsLoading(true);
    try {
      console.log('Fetching recent hands for user:', user.id);
      
      // Try different approaches to find hands
      const { data, error } = await supabase
        .from('hand_histories')
        .select('hand_id, hand_number, played_at, history, player_ids')
        .order('played_at', { ascending: false })
        .limit(50); // Get more to filter client-side

      if (error) {
        console.error('Error fetching hands:', error);
        return;
      }

      console.log('Raw hand data:', data);

      // Filter hands that include this player
      const playerHands = (data || []).filter(hand => {
        const playerIds = hand.player_ids || [];
        const includesPlayer = playerIds.includes(user.id);
        console.log('Hand', hand.hand_number, 'player_ids:', playerIds, 'includes user:', includesPlayer);
        return includesPlayer;
      });

      console.log('Filtered player hands:', playerHands);

      const formattedHands = playerHands.slice(0, 5).map(hand => {
        const playerData = hand.history?.players?.find(p => p.playerId === user.id);
        const result = hand.history?.winners?.some(w => w.playerId === user.id || w.id === user.id) ? 'Won' : 'Lost';
        
        return {
          handId: hand.hand_id,
          handNumber: hand.hand_number,
          startedAt: hand.played_at,
          cards: playerData?.cards || [],
          position: playerData?.position || 'Unknown',
          potSize: hand.history?.potSize || 0,
          result
        };
      });

      console.log('Formatted hands:', formattedHands);
      setRecentHands(formattedHands);
    } catch (error) {
      console.error('Error fetching recent hands:', error);
    } finally {
      setHandsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch player stats
        const { data: statsData, error: statsError } = await supabase
          .from('player_stats')
          .select('*')
          .eq('player_id', user.id)
          .single();

        if (statsError && statsError.code !== 'PGRST116') {
          // PGRST116 is "no rows returned" - not an error for new players
          throw statsError;
        }

        setPlayerStats(statsData);

        // Fetch recent hands
        await fetchRecentHands();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
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

  const handleEvaluatePlay = () => {
    if (canEvaluate) {
      navigate('/dna-analysis');
    }
  };

  const handleLearnMore = () => {
    // TODO: Navigate to learn more page
    console.log('Learn more about DNA analysis...');
  };

  const handleReviewHand = (handId) => {
    // TODO: Open hand review modal or navigate to review page
    console.log('Reviewing hand:', handId);
  };

  const handleEnterHand = () => {
    // TODO: Navigate to hand entry page
    console.log('Navigate to hand entry page...');
    navigate('/hand-entry');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        backgroundImage: `url(${profBack})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Background overlay for better contrast */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>

      {/* Background decoration */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[30vw] h-[30vw] max-w-[500px] max-h-[500px] bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[25vw] h-[25vw] max-w-[400px] max-h-[400px] bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Scrollable Profile Content */}
      <div className="relative z-30 h-screen overflow-y-auto">
        <div className="w-full max-w-5xl mx-auto p-4 pb-8">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="xl:col-span-1">
              <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
                {/* Profile Avatar */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center ring-4 ring-white/10">
                    <span className="text-2xl font-bold text-white">
                      {(profile?.username || 'A').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h1 className="text-xl font-bold text-white mb-2">
                    {profile?.username || 'Anonymous Player'}
                  </h1>
                  <p className="text-gray-400 text-sm mb-3">
                    Member since {new Date(user?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                  <div className="flex justify-center space-x-2 flex-wrap">
                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm border border-indigo-500/30">
                      Level 12
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/30">
                      Pro Member
                    </span>
                  </div>
                </div>

                {/* Live Play Stats */}
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 mb-4">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Live Play Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Hands Played</span>
                      <span className="text-white font-semibold">{playerStats?.hands_played || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">VPIP</span>
                      <span className="text-white font-semibold">
                        {playerStats ? calculateStat(playerStats.vpip_actions, playerStats.vpip_opportunities) : '–'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">PFR</span>
                      <span className="text-white font-semibold">
                        {playerStats ? calculateStat(playerStats.pfr_actions, playerStats.pfr_opportunities) : '–'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Win Rate</span>
                      <span className="text-amber-400 font-semibold">Coming Soon</span>
                    </div>
                  </div>
                  <button
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-150 border border-blue-700 shadow"
                    onClick={() => navigate('/ai-review?tab=player-stats')}
                  >
                    Take me to analyser
                  </button>
                </div>

                {/* Edit Profile Button */}
                <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
                  Edit Profile
                </button>
              </div>
            </div>

            {/* DNA Analysis & Hand Evaluation */}
            <div className="xl:col-span-2 space-y-6">
              {/* Poker DNA Analysis Tool */}
              <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <span className="text-2xl mr-3">🧬</span>
                    Poker DNA Analysis
                  </h2>
                  <div className="text-sm text-gray-400">
                    Unlock your playing style insights
                  </div>
                </div>
                
                {/* Progress Bars */}
                <div className="space-y-4 mb-6">
                  {/* Basic Analysis Progress */}
                  <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-300">Basic Analysis</span>
                      <span className="text-sm text-gray-400">
                        {playerStats?.hands_played || 0} / {BASIC_EVALUATION_HANDS} hands
                      </span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2 mb-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(playerStats?.hands_played || 0, BASIC_EVALUATION_HANDS)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Get initial insights into your playing style
                    </p>
                  </div>

                  {/* Advanced Analysis Progress */}
                  <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-300">Advanced Analysis</span>
                      <span className="text-sm text-gray-400">
                        {playerStats?.hands_played || 0} / {ADVANCED_EVALUATION_HANDS} hands
                      </span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2 mb-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(playerStats?.hands_played || 0, ADVANCED_EVALUATION_HANDS)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Comprehensive analysis with detailed recommendations
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleEvaluatePlay}
                    disabled={!canEvaluate}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                      canEvaluate
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {canEvaluate ? 'Analyze My DNA' : `Play ${BASIC_EVALUATION_HANDS - (playerStats?.hands_played || 0)} More Hands`}
                  </button>
                  <button
                    onClick={handleLearnMore}
                    className="bg-gray-600/50 hover:bg-gray-500/50 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 border border-gray-600/50"
                  >
                    Learn More
                  </button>
                </div>
                {!canEvaluate && (
                  <p className="text-xs text-gray-500 text-center mt-3">
                    We need at least {BASIC_EVALUATION_HANDS} hands to provide meaningful analysis
                  </p>
                )}
              </div>

              {/* Hand Evaluation Section */}
              <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <span className="text-2xl mr-3">🎯</span>
                  Hand Evaluation
                </h2>
                
                {/* Recent Hands */}
                <div className="mb-6">
                  <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                    <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Recent Hands
                    </h3>
                    
                    {handsLoading ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-400"></div>
                      </div>
                    ) : recentHands.length > 0 ? (
                      <div className="space-y-2">
                        {recentHands.map((hand) => (
                          <div key={hand.handId} className="flex items-center justify-between bg-gray-800/50 p-3 rounded-lg border border-gray-700/30 hover:bg-gray-700/50 transition-colors">
                            <div className="flex items-center space-x-3">
                              <span className="text-gray-400 text-sm font-mono">#{hand.handNumber}</span>
                              <span className="font-mono text-white font-semibold">{formatCards(hand.cards)}</span>
                              <span className="text-gray-400 text-sm">{hand.position}</span>
                              <span className={`text-sm font-semibold ${hand.result === 'Won' ? 'text-green-400' : 'text-red-400'}`}>
                                {hand.result}
                              </span>
                            </div>
                            <button 
                              onClick={() => handleReviewHand(hand.handId)}
                              className="bg-blue-600/80 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                            >
                              Review
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <div className="text-gray-500 mb-2">
                          <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <p className="text-gray-400 text-sm">No hands played yet.</p>
                        <p className="text-gray-500 text-xs">Start playing to see your hand history!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Enter a Hand */}
                <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                  <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Enter a Hand for Analysis
                  </h3>
                  
                  <div className="text-center py-4">
                    <p className="text-gray-400 text-sm mb-4">
                      Enter a hand from memory and get AI-powered analysis
                    </p>
                    <button
                      onClick={handleEnterHand}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Enter Hand Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 