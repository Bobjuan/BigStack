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
  const [sessions, setSessions] = useState([]); // All sessions (default + user)
  const [selectedSession, setSelectedSession] = useState({ id: null, name: 'All Stats' });
  const [sessionNameInput, setSessionNameInput] = useState('');
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionError, setSessionError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, session: null, input: '', error: '' });

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
    if (!user?.id) return;
    setHandsLoading(true);
    try {
      const { data, error } = await supabase
        .from('hand_histories_v2')
        .select('hand_id, hand_number, played_at, history')
        .contains('player_ids', [user.id]) // server-side filter for this player
        .order('played_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching hands:', error);
        return;
      }

      const formattedHands = (data || []).map(hand => {
                const playerData = hand.history?.players?.find(p => p.playerId === user.id);
        let delta = 0;
        const seat = (hand.history?.players || []).find(p => p.playerId === user.id);
        if (seat && typeof seat.finalStack === 'number' && typeof seat.startingStack === 'number') {
          delta = seat.finalStack - seat.startingStack;
        } else {
          const winEntry = hand.history?.winners?.find(w => w.playerId === user.id || w.id === user.id);
          if (winEntry) delta = winEntry.amountWon || 0;
        }

        return {
          handId: hand.hand_id,
          handNumber: hand.hand_number,
          startedAt: hand.played_at,
          cards: playerData?.cards || [],
          position: playerData?.position || 'Unknown',
          potSize: hand.history?.potSize || 0,
          delta
        };
      });

      setRecentHands(formattedHands);
    } catch (error) {
      console.error('Error fetching recent hands:', error);
    } finally {
      setHandsLoading(false);
    }
  };

  // Fetch all sessions for the user
  const fetchSessions = async () => {
    if (!user?.id) return;
    setSessionLoading(true);
    setSessionError('');
    const { data, error } = await supabase
      .from('stat_sessions')
      .select('*')
      .eq('player_id', user.id)
      .order('created_at', { ascending: true });
    let sessionList = [{ id: null, name: 'All Stats', is_active: true }];
    if (data) sessionList = sessionList.concat(data);
    setSessions(sessionList);
    setSessionLoading(false);
  };

  // Create a new session
  const handleCreateSession = async () => {
    if (!sessionNameInput.trim()) return;
    setSessionLoading(true);
    setSessionError('');
    try {
      const { error } = await supabase.from('stat_sessions').insert({
        player_id: user.id,
        name: sessionNameInput.trim(),
        is_active: true,
      });
      if (error) {
        if (error.code === '23505' || error.message?.includes('duplicate')) {
          setSessionError('Session name already exists.');
        } else {
          setSessionError('Failed to create session.');
        }
      } else {
        setSessionNameInput('');
        await fetchSessions();
      }
    } catch (e) {
      setSessionError('Failed to create session.');
    }
    setSessionLoading(false);
  };

  // Delete a session and its associated player_stats, with logging and type safety
  const handleDeleteSession = async (sessionId) => {
    if (!sessionId) return; // Don't delete default
    setSessionLoading(true);
    setSessionError('');

    // Log the sessionId being used
    console.log('Attempting to delete player_stats for sessionId:', sessionId, typeof sessionId);

    // 1. Delete all related player_stats (ensure sessionId is a string)
    const { error: statsError } = await supabase
      .from('player_stats')
      .delete()
      .eq('session_id', sessionId);
    console.log('Deleted player_stats error:', statsError);

    if (statsError) {
      setSessionError('Failed to delete session stats: ' + statsError.message);
      setSessionLoading(false);
      return false;
    }

    // 2. Delete the session itself
    const { error: sessionError } = await supabase
      .from('stat_sessions')
      .delete()
      .eq('id', sessionId);
    console.log('Deleted stat_sessions error:', sessionError);

    if (sessionError) {
      setSessionError('Failed to delete session: ' + sessionError.message);
      setSessionLoading(false);
      return false;
    }

    // Remove from UI state immediately
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (selectedSession.id === sessionId) setSelectedSession({ id: null, name: 'All Stats' });
    await fetchSessions();
    setSessionLoading(false);
    return true;
  };

  // Toggle session active/inactive
  const handleToggleSession = async (sessionId, isActive) => {
    if (!sessionId) return;
    setSessionLoading(true);
    setSessionError('');
    await supabase.from('stat_sessions').update({ is_active: !isActive }).eq('id', sessionId);
    await fetchSessions();
    setSessionLoading(false);
    // If toggled off, select All Stats
    if (isActive) {
      setSelectedSession({ id: null, name: 'All Stats' });
    }
  };

  // Select session for stats display
  const handleSelectSession = async (session) => {
    setSelectedSession(session);
    // If the session is not active, activate it
    if (session.id && !session.is_active) {
      await handleToggleSession(session.id, false); // false means it will be set to true
    }
  };

  // Fetch sessions on mount/user change
  useEffect(() => {
    if (user) fetchSessions();
  }, [user]);

  // Fetch stats for selected session
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
        // Fetch player stats for selected session
        let statsQuery = supabase
          .from('player_stats')
          .select('*')
          .eq('player_id', user.id);
        const DEFAULT_SESSION_ID = '00000000-0000-0000-0000-000000000000';
        const sessionIdToQuery = selectedSession.id || DEFAULT_SESSION_ID;
        statsQuery = statsQuery.eq('session_id', sessionIdToQuery);
        const { data: statsData, error: statsError } = await statsQuery.single();
        if (statsError && statsError.code !== 'PGRST116') throw statsError;
        setPlayerStats(statsData);
        // Fetch recent hands (unchanged)
        await fetchRecentHands();
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user, selectedSession]);

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
    if (!handId) return;
    navigate(`/hand/${handId}`);
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
      className="w-full min-h-screen relative"
      style={{
        backgroundImage: `url(${profBack})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Modal for delete confirmation */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-gray-900 rounded-xl p-6 shadow-2xl border border-gray-700 w-full max-w-sm relative">
            <h2 className="text-lg font-bold text-red-400 mb-2">Delete Session</h2>
            <p className="text-gray-300 mb-3 text-sm">Please type <span className="font-bold text-white">{deleteModal.session?.name}</span> to delete. Deletions cannot be undone.</p>
            <input
              className="w-full px-3 py-2 rounded border border-gray-700 bg-gray-800 text-white mb-2 focus:ring-2 focus:ring-red-500"
              placeholder="Type session name to confirm"
              value={deleteModal.input}
              onChange={e => setDeleteModal({ ...deleteModal, input: e.target.value, error: '' })}
              autoFocus
            />
            {deleteModal.error && <div className="text-red-400 text-xs mb-2">{deleteModal.error}</div>}
            <div className="flex justify-end gap-2 mt-2">
              <button
                className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600"
                onClick={() => setDeleteModal({ open: false, session: null, input: '', error: '' })}
              >Cancel</button>
              <button
                className="px-4 py-2 rounded bg-red-700 text-white font-bold hover:bg-red-800 disabled:opacity-50"
                disabled={deleteModal.input !== (deleteModal.session?.name || '')}
                onClick={async () => {
                  if (deleteModal.input === (deleteModal.session?.name || '')) {
                    // If the deleted session is selected, reset to default
                    const isSelected = selectedSession.id === deleteModal.session.id;
                    await handleDeleteSession(deleteModal.session.id);
                    if (isSelected) setSelectedSession({ id: null, name: 'All Stats' });
                    await fetchSessions();
                    setDeleteModal({ open: false, session: null, input: '', error: '' });
                  } else {
                    setDeleteModal({ ...deleteModal, error: 'Session name does not match.' });
                  }
                }}
              >Delete</button>
            </div>
          </div>
        </div>
      )}
      {/* Background overlay for better contrast */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>

      {/* Background decoration */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[30vw] h-[30vw] max-w-[500px] max-h-[500px] bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[25vw] h-[25vw] max-w-[400px] max-h-[400px] bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Profile Content */}
      <div className="relative z-30 p-8">
        <div className="w-full max-w-5xl mx-auto">
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
                  {/* Session Dropdown */}
                  <div className="mb-3">
                    <select
                      className="w-full px-2 py-1 rounded border border-gray-600 bg-gray-900 text-white"
                      value={selectedSession.id || ''}
                      onChange={e => {
                        const session = sessions.find(s => (s.id || '') === e.target.value);
                        if (session) handleSelectSession(session);
                      }}
                      disabled={sessionLoading}
                    >
                      {sessions.map(session => (
                        <option key={session.id || 'default'} value={session.id || ''}>{session.name}</option>
                      ))}
                    </select>
                  </div>
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
                    className="w-full mt-6 mb-2 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
                    onClick={handleEvaluatePlay}
                  >
                    Take me to analyser
                  </button>
                </div>

                {/* Edit Profile Button */}
                <button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
                  Edit Profile
                </button>
              </div>
              {/* Session Management UI */}
              <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl mb-4 mt-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
                  {/* Stat/session icon (bar chart) */}
                  <svg className="w-4 h-4 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="13" width="4" height="8" rx="1" fill="currentColor" className="text-green-400" />
                    <rect x="9" y="9" width="4" height="12" rx="1" fill="currentColor" className="text-green-400" />
                    <rect x="15" y="5" width="4" height="16" rx="1" fill="currentColor" className="text-green-400" />
                  </svg>
                  Stat Sessions
                </h3>
                <div className="flex flex-col gap-2">
                  {/* Session Creation Row */}
                  <div className="flex gap-2 mb-2 items-center bg-gray-900/60 border border-gray-700 rounded-full px-3 py-2 shadow-sm">
                    <input
                      className="flex-1 bg-transparent px-2 py-1 rounded-full text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 border-none outline-none placeholder-gray-400"
                      placeholder="New session name"
                      value={sessionNameInput}
                      onChange={e => setSessionNameInput(e.target.value)}
                      disabled={sessionLoading}
                      onKeyDown={e => { if (e.key === 'Enter') handleCreateSession(); }}
                    />
                    <button
                      className="flex items-center justify-center px-3 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold shadow-md hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-150 disabled:opacity-50"
                      onClick={handleCreateSession}
                      disabled={sessionLoading || !sessionNameInput.trim()}
                      title="Create Session"
                    >
                      {sessionLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                      )}
                    </button>
                  </div>
                  {sessionError && <div className="text-red-400 text-xs mb-1 px-2 py-1 bg-red-900/30 rounded">{sessionError}</div>}
                  {/* Session Pills */}
                  <div className="flex flex-wrap gap-2">
                    {sessions.map(session => (
                      <div
                        key={session.id || 'default'}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-150 shadow-sm text-sm font-semibold
                          ${session.is_active ? 'border-green-500' : 'border-gray-700'} bg-gray-900/60 text-gray-200 hover:bg-gray-800/80 hover:border-green-400'
                          ${sessionLoading ? 'opacity-60 pointer-events-none' : ''}`}
                        style={{ minWidth: 0 }}
                      >
                        {/* Session Name */}
                        <span className="truncate max-w-[120px]">{session.name}</span>
                        {/* Toggle (for All Stats, always on and disabled) */}
                        {session.id == null ? (
                          <button
                            className="ml-1 relative w-10 h-6 flex items-center rounded-full border bg-green-500 border-green-400 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-400"
                            disabled
                            tabIndex={-1}
                            title="All Stats is always active"
                          >
                            <span
                              className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 translate-x-4"
                            />
                          </button>
                        ) : (
                          <button
                            className={`ml-1 relative w-10 h-6 flex items-center rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400
                              ${session.is_active ? 'bg-green-500 border-green-400' : 'bg-gray-600 border-gray-500'}`}
                            onClick={e => { e.stopPropagation(); handleToggleSession(session.id, session.is_active); }}
                            disabled={sessionLoading}
                            title={session.is_active ? 'Set Inactive' : 'Set Active'}
                          >
                            <span
                              className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200
                                ${session.is_active ? 'translate-x-4' : 'translate-x-0'}`}
                            />
                          </button>
                        )}
                        {/* Delete Button (not for default) */}
                        {session.id && (
                          <button
                            className="ml-1 flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-700 border border-red-500 text-white hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-100"
                            onClick={e => {
                              e.stopPropagation();
                              setDeleteModal({ open: true, session, input: '', error: '' });
                            }}
                            disabled={sessionLoading}
                            title="Delete Session"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* DNA Analysis & Hand Evaluation */}
            <div className="xl:col-span-2 space-y-6">
              {/* Poker DNA Analysis Tool */}
              <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <span className="text-2xl mr-3"></span>
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
                      Get comprehensive analysis of your poker strategy
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
                    <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-gray-300 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Recent Hands
                    </h3>
                    <button onClick={() => navigate('/hands')} className="text-xs text-blue-400 hover:underline">
                      View all
                    </button>
                    </div>
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
                              <span className={`text-sm font-semibold ${hand.delta > 0 ? 'text-green-400' : hand.delta < 0 ? 'text-red-400' : 'text-gray-400'}`}>{hand.delta > 0 ? '+' + hand.delta : hand.delta}</span>
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
                      <div className="text-center py-8">
                        <div className="text-gray-400 mb-4">
                          <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="text-gray-400 mb-4">No hands played yet</p>
                        <button
                          onClick={handleEnterHand}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-150"
                        >
                          Enter Your First Hand
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {/* Quick Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={handleEnterHand}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Enter New Hand
                  </button>
                  <button
                    onClick={() => navigate('/ai-review?tab=hand-review')}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Review Hands
                  </button>
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