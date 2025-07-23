import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import PlayerStyleGraph from '../components/ai-review/PlayerStyleGraph';
import { useNavigate } from 'react-router-dom';
import CoachPanel from '../components/ai-review/CoachPanel';

// --- Helper Functions for Stat Calculation ---
const calculateStat = (actions, opportunities) => {
  if (!opportunities || opportunities === 0) return 0;
  return (actions / opportunities) * 100;
};

const calculateAggFactor = (stats) => {
  if (!stats) return 0;
  const { agg_bets, agg_raises, agg_calls } = stats;
  const aggressiveActions = (agg_bets || 0) + (agg_raises || 0);
  const passiveActions = agg_calls || 0;
  if (passiveActions === 0) {
    return aggressiveActions > 0 ? 99 : 1; // Return a high number for pure aggression, or 1 for neutral
  }
  return aggressiveActions / passiveActions;
};

const getPlayerType = (vpip, aggression, hands) => {
  if (hands < 50) return 'Analyzing...';
  
  const y = 100 - Math.min((vpip || 0) * 2, 100);
  const x = Math.min(((aggression || 0) / 4) * 100, 100);

  if (y > 50) {
    return x > 50 ? 'Tight-Aggressive (TAG)' : 'Tight-Passive (Rock)';
  } else {
    return x > 50 ? 'Loose-Aggressive (LAG)' : 'Loose-Passive (Calling Station)';
  }
};

// --- Leak Analysis Logic ---
const analyzeLeaks = (stats) => {
  const vpip = calculateStat(stats.vpip_actions, stats.vpip_opportunities);
  const pfr = calculateStat(stats.pfr_actions, stats.pfr_opportunities);

  const leaks = [];

  // 1. Excessive Pre-flop Passivity
  if (pfr > 0 && (vpip / pfr) > 3.5) {
    leaks.push({
      id: 'passivity',
      name: 'Excessive Pre-flop Passivity',
      severity: 'High',
      description: 'You call raises far more often than you re-raise, letting opponents control the hand.',
      why: 'This makes you predictable and easy to play against. Aggressive opponents will raise you with a wide range of hands, knowing you will likely just call and let them see a cheap flop. You lose value with your strong hands and get put in tough spots with your marginal ones.',
      fix: 'Start 3-betting (re-raising) more with your premium hands (AA, KK, QQ, AK). Also, incorporate some "bluff" 3-bets with hands that have good potential, like suited Aces (A5s, A4s), to balance your range.'
    });
  }

  // 2. Overly Loose Pre-flop
  if (vpip > 35) {
    leaks.push({
      id: 'loose',
      name: 'Overly Loose Pre-flop',
      severity: 'Medium',
      description: 'You are playing too many weak and speculative hands before the flop.',
      why: 'Playing too many hands means you often enter the pot with a weaker range than your opponents. This forces you to play defensively post-flop and makes it difficult to win pots without hitting a very strong hand.',
      fix: 'Tighten up your starting hand ranges from all positions. Focus on playing stronger hands from early position and gradually widen your range as you get closer to the button. Use standard pre-flop charts as a baseline.'
    });
  }

  // 3. Overly Tight Pre-flop
  if (vpip < 15 && stats.hands_played > 100) {
    leaks.push({
      id: 'tight',
      name: 'Overly Tight Pre-flop',
      severity: 'Medium',
      description: 'You are folding too often pre-flop, likely playing only premium hands.',
      why: 'While playing strong hands is good, being too tight makes you extremely predictable. Observant opponents will know you only have a monster hand when you enter the pot and will easily fold unless they have a monster themselves, preventing you from getting paid.',
      fix: 'Start by adding more hands to your button and cutoff opening ranges. Hands like suited connectors (89s, 78s) and suited gappers (J9s, T8s) are great candidates to start opening up your game.'
    });
  }
  
  // Note: More leak analyses can be added here once their corresponding stats are tracked.
  // Examples: "Fit-or-Fold Tendency", "Brittle Pre-flop Aggression", etc.

  // --- Hardcoded Incomplete Leaks for UI preview ---
  leaks.push({
    id: 'fitorfold',
    name: 'Fit-or-Fold Tendency (INCOMPLETE)',
    severity: 'Medium',
    description: 'Giving up on the flop too often if you don\'t hit a strong hand.',
    why: 'Opponents can exploit this by frequently making small "continuation bets" on the flop. They know you will fold unless you have a strong hand, allowing them to win many small pots without resistance.',
    fix: 'Start "floating" more often. This means calling a flop bet with the intention of bluffing on a later street. Also, learn to recognize boards where your opponent is unlikely to have a strong hand and bluff them more often.'
  });

  leaks.push({
    id: 'brittle',
    name: 'Brittle Pre-flop Aggression (INCOMPLETE)',
    severity: 'High',
    description: 'Raising first but then folding too easily when someone re-raises you (3-bets).',
    why: 'This signals to aggressive players that your initial raises are not always strong. They can 3-bet you with a wider range of hands, forcing you to fold and give up the pot pre-flop, which is a very effective counter-strategy.',
    fix: 'Develop a "4-betting" range. This means re-raising their 3-bet, both with your premium hands for value and occasionally as a bluff with hands that have good blocking potential (like an Ace).'
  });
  
  leaks.push({
    id: 'stubborn',
    name: 'Showdown Stubbornness (INCOMPLETE)',
    severity: 'High',
    description: 'Taking weak or marginal hands all the way to the end of the hand, only to lose.',
    why: 'This is one of the fastest ways to lose money in poker. Continuing with a weak hand when facing significant aggression post-flop often means you are "pot committed" to a losing situation. You lose big pots and only win small ones.',
    fix: 'Practice folding. When an opponent shows significant aggression on the turn or river, re-evaluate the strength of your hand. Unless you have a very strong hand, folding is often the most profitable play, saving you from larger losses.'
  });

  return leaks;
};


// --- Sub-component for each leak ---
const LeakAnalysisRow = ({ leak, openCoachPanel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const severityColor = {
    High: 'text-red-400',
    Medium: 'text-amber-400',
    Low: 'text-green-400',
  };

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-gray-700/50"
      >
        <span className="text-lg font-semibold text-white">{leak.name}</span>
        <div className="flex items-center space-x-4">
          <span className={`font-semibold ${severityColor[leak.severity]}`}>{leak.severity}</span>
          <svg className={`w-6 h-6 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {isOpen && (
        <div className="px-6 pb-6 pt-2 border-t border-gray-700/50">
          <p className="text-gray-300 mb-4">{leak.description}</p>
          <h4 className="font-semibold text-fuchsia-400 mb-2">Why this is a leak:</h4>
          <p className="text-gray-400 mb-4 text-sm leading-relaxed">{leak.why}</p>
          <h4 className="font-semibold text-emerald-400 mb-2">How to fix it:</h4>
          <p className="text-gray-400 text-sm leading-relaxed">{leak.fix}</p>
          <div className="flex justify-start mt-4">
            <button
              className="bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg border-2 border-green-400 flex items-center gap-2 px-3 py-2 text-base"
              onClick={() => openCoachPanel(`Explain the leak: ${leak.name}. Why is it a problem and how can I fix it?`)}
              title={`Ask P.H.I.L. about ${leak.name}`}
            >
              <span className="w-12 h-12 flex items-center justify-center rounded-full overflow-hidden">
                <img src="/images/shark.png" alt="P.H.I.L." className="w-full h-full object-cover" />
              </span>
              <span className="font-semibold">Ask P.H.I.L. about this leak</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Custom MultiSelectDropdown for sessions
 */
function MultiSelectDropdown({ options, selected, onChange, label }) {
  const [open, setOpen] = useState(false);
  const handleToggle = () => setOpen(o => !o);
  // Do not close dropdown on select
  const handleSelect = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter(sid => sid !== id));
    } else {
      onChange([...selected, id]);
    }
    // Do NOT close dropdown here
  };
  const selectedLabels = options.filter(opt => selected.includes(opt.id)).map(opt => opt.name);
  return (
    <div className="relative w-full max-w-md">
      <label className="block text-gray-300 font-semibold mb-2">{label}</label>
      <button
        type="button"
        className={`w-full flex justify-between items-center px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${open ? 'ring-2 ring-indigo-500' : ''}`}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`truncate ${selectedLabels.length === 0 ? 'text-gray-400' : ''}`}>
          {selectedLabels.length > 0 ? selectedLabels.join(', ') : 'Select sessions...'}
        </span>
        <svg className={`w-5 h-5 ml-2 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-20 mt-2 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto animate-fadeIn">
          {options.map(opt => {
            const handsPlayed = opt.hands_played || 0;
            const needsMore = typeof handsPlayed === 'number' && handsPlayed < 150;
            const handsNeeded = 150 - handsPlayed;
            return (
              <label
                key={opt.id}
                className={`flex items-center px-4 py-2 cursor-pointer transition-colors ${selected.includes(opt.id) ? 'bg-gray-800/60' : 'hover:bg-gray-800'}`}
              >
                <span className="flex items-center justify-center relative inline-block w-6 h-6 mr-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(opt.id)}
                    onChange={() => handleSelect(opt.id)}
                    className="appearance-none w-6 h-6 rounded-md border-2 border-gray-500 bg-gray-800 checked:bg-indigo-600 checked:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all"
                    style={{ verticalAlign: 'middle' }}
                  />
                  {selected.includes(opt.id) && (
                    <svg className="absolute left-0 top-0 w-6 h-6 text-white pointer-events-none" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="5 11 9 15 15 7" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  )}
                </span>
                <span className="text-white text-sm flex items-center">
                  {opt.name}
                  {needsMore && (
                    <span className="ml-2 text-xs text-yellow-400 bg-yellow-900/40 px-2 py-0.5 rounded-full">
                      You need {handsNeeded} more hands
                    </span>
                  )}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}


// --- Main Page Component ---
const DEFAULT_SESSION_ID = '00000000-0000-0000-0000-000000000000';

const DnaAnalysisPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [playerStats, setPlayerStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]); // All sessions with >= 150 hands
  const [selectedSessions, setSelectedSessions] = useState([DEFAULT_SESSION_ID]); // Array of selected session IDs
  const [coachOpen, setCoachOpen] = useState(false);
  const [coachInitialQuestion, setCoachInitialQuestion] = useState('');

  const openCoachPanel = (question = '') => {
    setCoachInitialQuestion(question);
    setCoachOpen(true);
  };

  // Fetch all sessions for the user, but only include those with >= 150 hands
  useEffect(() => {
    if (!user) return;
    const fetchSessions = async () => {
      // Get all sessions
      const { data: sessionData, error: sessionError } = await supabase
        .from('stat_sessions')
        .select('*')
        .eq('player_id', user.id)
        .order('created_at', { ascending: true });
      let sessionList = [{ id: DEFAULT_SESSION_ID, name: 'All Stats', is_active: true }];
      if (sessionError) {
        setSessions(sessionList);
        return;
      }
      // Get hands_played for each session
      const sessionIds = sessionData ? sessionData.map(s => s.id) : [];
      const { data: statsData, error: statsError } = await supabase
        .from('player_stats')
        .select('session_id, hands_played')
        .eq('player_id', user.id)
        .in('session_id', [DEFAULT_SESSION_ID, ...sessionIds]);
      // Map session_id to hands_played
      const handsMap = {};
      if (statsData) {
        for (const row of statsData) {
          handsMap[row.session_id] = row.hands_played;
        }
      }
      // Attach hands_played to each session
      const allSessions = sessionList.concat((sessionData || []).map(s => ({ ...s, hands_played: handsMap[s.id] || 0 })));
      // Attach hands_played to All Stats
      allSessions[0].hands_played = handsMap[DEFAULT_SESSION_ID] || 0;
      setSessions(allSessions);
      // If selectedSessions contains any that are now missing, remove them
      setSelectedSessions(sel => sel.filter(id => allSessions.some(s => s.id === id)));
    };
    fetchSessions();
  }, [user]);

  // Fetch and combine stats for selected sessions
  useEffect(() => {
    if (!user || selectedSessions.length === 0) return;
    setLoading(true);
    const fetchStats = async () => {
      try {
        // Fetch stats for all selected sessions
        const { data, error } = await supabase
          .from('player_stats')
          .select('*')
          .eq('player_id', user.id)
          .in('session_id', selectedSessions);
        if (error) throw error;
        // Combine stats (sum numeric fields)
        if (!data || data.length === 0) {
          setPlayerStats(null);
        } else if (data.length === 1) {
          setPlayerStats(data[0]);
        } else {
          // Sum all numeric fields
          const combined = { ...data[0] };
          for (let i = 1; i < data.length; i++) {
            for (const key in data[i]) {
              if (typeof data[i][key] === 'number' && typeof combined[key] === 'number') {
                combined[key] += data[i][key];
              }
            }
          }
          setPlayerStats(combined);
        }
      } catch (error) {
        console.error('Error fetching/combining stats:', error);
        setPlayerStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user, selectedSessions]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  const vpip = calculateStat(playerStats?.vpip_actions, playerStats?.vpip_opportunities);
  const pfr = calculateStat(playerStats?.pfr_actions, playerStats?.pfr_opportunities);
  const aggression = calculateAggFactor(playerStats);
  const identifiedLeaks = playerStats ? analyzeLeaks(playerStats) : [];
  const playerType = getPlayerType(vpip, aggression, playerStats?.hands_played || 0);

  // In the main DNA graph/stats area, if the combined hands_played across all selected sessions >= 150, show analysis; otherwise, show 'Not Enough Hands'.
  const selectedSessionObjs = sessions.filter(s => selectedSessions.includes(s.id));
  const totalHands = selectedSessionObjs.reduce((sum, s) => sum + (s.hands_played || 0), 0);
  const notEnoughHands = totalHands < 150;

  return (
    <div 
      className="min-h-screen w-full bg-[#0F1115] text-white relative overflow-y-auto"
    >
      {/* Floating Ask P.H.I.L. Button (pill style, png) */}
      <button
        className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg border-2 border-green-400 flex items-center gap-2 px-4 py-2"
        onClick={() => openCoachPanel('Can you review my stats and leaks and give me advice?')}
        style={{ boxShadow: '0 4px 24px 0 rgba(0,255,128,0.15)' }}
      >
        <span className="w-14 h-14 flex items-center justify-center rounded-full overflow-hidden">
          <img src="/images/shark.png" alt="P.H.I.L." className="w-full h-full object-cover" />
        </span>
        <span className="font-bold text-lg ml-2">Ask P.H.I.L.</span>
      </button>
      {/* CoachPanel Modal */}
      <CoachPanel
        open={coachOpen}
        onClose={() => setCoachOpen(false)}
        context={{
          stats: playerStats,
          leaks: identifiedLeaks,
          playerType,
          vpip,
          pfr,
          aggression
        }}
        initialQuestion={coachInitialQuestion}
      />
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[5%] left-[5%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[5%] right-[5%] w-[25vw] h-[25vw] max-w-[350px] max-h-[350px] bg-fuchsia-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white flex items-center">
                <span className="text-4xl mr-4">🧬</span>
                Poker DNA Analysis
            </h1>
            <button
                onClick={() => navigate('/profile')}
                className="px-6 py-2 bg-gray-700/50 text-white rounded-full font-medium hover:bg-gray-600/50 transition-colors duration-200 border border-gray-600"
            >
                Back to Profile
            </button>
        </div>

        {/* Session Multi-Select Dropdown */}
        <div className="mb-8">
          <MultiSelectDropdown
            options={sessions}
            selected={selectedSessions}
            onChange={setSelectedSessions}
            label="Select Stat Sessions to Analyze:"
          />
          <div className="text-xs text-gray-400 mt-1">You can select multiple sessions to combine stats.</div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* If combined selected sessions have <150 hands, show message instead of stats/graph */}
          {notEnoughHands ? (
            <div className="lg:col-span-3 flex flex-col items-center justify-center py-16 bg-gray-800/30 rounded-2xl border border-gray-700/30">
              <div className="text-yellow-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Not Enough Hands</h2>
              <p className="text-gray-300 text-lg">You need at least 150 total hands across selected sessions to view DNA analysis.</p>
              <ul className="mt-4 text-sm text-gray-400">
                <li>
                  <span className="font-semibold text-white">Total Selected:</span> {totalHands} / 150 hands
                </li>
                {selectedSessionObjs.map(s => (
                  <li key={s.id}>
                    <span className="font-semibold text-white">{s.name}:</span> {s.hands_played || 0} hands
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <>
              {/* Left Column: Player Stats */}
              <div className="lg:col-span-1 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl h-fit relative">
                {/* Core Metrics Ask P.H.I.L. button */}
                <button
                  className="absolute top-4 right-4 z-20 bg-white/10 hover:bg-green-600 transition-colors rounded-full shadow-lg border-2 border-green-400 flex items-center justify-center w-10 h-10"
                  style={{ boxShadow: '0 2px 8px 0 rgba(0,255,128,0.10)' }}
                  onClick={() => openCoachPanel('Can you explain what the core metrics mean and how I can improve them?')}
                  title="Ask P.H.I.L. about Core Metrics"
                >
                  <img src="/images/shark.png" alt="P.H.I.L." className="w-full h-full rounded-full object-cover" />
                </button>
                <h3 className="text-xl font-semibold text-gray-100 mb-4">Core Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-green-500/10 p-3 rounded-lg border border-green-500/30">
                    <span className="text-gray-300">Primary Style</span>
                    <span className="text-green-300 font-semibold font-mono">{playerType}</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg">
                    <span className="text-gray-300">Hands Played</span>
                    <span className="text-white font-semibold font-mono">{playerStats?.hands_played || 0}</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg">
                    <span className="text-gray-300">VPIP</span>
                    <span className="text-white font-semibold font-mono">{vpip.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg">
                    <span className="text-gray-300">PFR</span>
                    <span className="text-white font-semibold font-mono">{pfr.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg">
                    <span className="text-gray-300">Aggression Factor</span>
                    <span className="text-white font-semibold font-mono">{aggression.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              {/* Right Column: Graph */}
              <div className="lg:col-span-2 min-h-[400px]">
                <PlayerStyleGraph vpip={vpip} aggression={aggression} hands={playerStats?.hands_played || 0} />
              </div>
            </>
          )}
        </div>

        {/* Leaks Analysis Section */}
        <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-white">Identified Leaks & Recommendations</h2>
              {/* Leaks section header Ask P.H.I.L. button */}
              <button
                className="bg-white/10 hover:bg-green-600 transition-colors rounded-full shadow-lg border-2 border-green-400 flex items-center justify-center w-10 h-10"
                style={{ boxShadow: '0 2px 8px 0 rgba(0,255,128,0.10)' }}
                onClick={() => openCoachPanel('Can you explain my leaks and how to fix them?')}
                title="Ask P.H.I.L. about Leaks"
              >
                <img src="/images/shark.png" alt="P.H.I.L." className="w-full h-full rounded-full object-cover" />
              </button>
            </div>
            {identifiedLeaks.length > 0 ? (
                <div className="space-y-4">
                    {identifiedLeaks.map(leak => (
                      <div key={leak.id} className="relative">
                        <LeakAnalysisRow leak={leak} openCoachPanel={openCoachPanel} />
                      </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-gray-800/30 rounded-2xl border border-gray-700/30">
                    <div className="text-green-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white">No major leaks detected!</h3>
                    <p className="text-gray-400 mt-2 max-w-md mx-auto">Based on your current stats, you're playing a solid, balanced game. Keep up the great work and play more hands to uncover deeper insights.</p>
                </div>
            )}
             <p className="text-xs text-gray-500 text-center mt-6">
                Note: Analysis is based on stats tracked so far. More advanced leak detection for C-betting and 3-bet situations will become available as we gather more data.
            </p>
        </div>
      </div>
    </div>
  );
};

export default DnaAnalysisPage; 