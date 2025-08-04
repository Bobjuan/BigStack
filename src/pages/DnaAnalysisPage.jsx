import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import PlayerStyleGraph from '../components/ai-review/PlayerStyleGraph';
import { useNavigate } from 'react-router-dom';
import CoachPanel from '../components/ai-review/CoachPanel';
import { leakTexts } from '../leakTexts';

// --- Helper Functions for Stat Calculation ---
import { thresholds, classify } from '../utils/pokerThresholds';
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
  const pct = (actions, opps) => opps ? (actions / opps) * 100 : 0;
  const vpip = calculateStat(stats.vpip_actions, stats.vpip_opportunities);
  const pfr  = calculateStat(stats.pfr_actions,  stats.pfr_opportunities);
  const threeBetPct = calculateStat(stats["3bet_actions"], stats["3bet_opportunities"]);
  const foldVs3Pct  = calculateStat(stats.fold_vs_3bet_actions, stats.fold_vs_3bet_opportunities);

  const leaks = [];
  const add = (id, severity) => leaks.push({ id, severity });

  // VPIP buckets
  const vpipClass = classify(vpip / 100, thresholds.vpip, 'twoSided'); // convert to proportion
  if (vpipClass.severity === 'High' && vpip > 50) {
    leaks.push({
      id: 'maniac',
      name: 'Ultra-Loose Pre-flop',
      severity: 'High',
      description: 'Playing more than half of all hands dealt.',
      why: 'You enter too many pots with weak holdings, forcing tough spots post-flop.',
      fix: 'Tighten your starting hand range, especially from early positions.'
    });
  } else if (vpipClass.severity === 'Medium' && vpip > 35) {
    leaks.push({
      id: 'loose',
      name: 'Overly Loose Pre-flop',
      severity: 'Medium',
      description: 'VPIP above population norm.',
      why: 'Weak range disadvantage leads to tough decisions and red-line bleed.',
      fix: 'Fold marginal offsuit hands; use charts as baseline.'
    });
  } else if (vpip < thresholds.vpip[0] && stats.hands_played > 100) {
    leaks.push({
      id: 'nit',
      name: 'Too Tight / Predictable',
      severity: 'Medium',
      description: 'VPIP below 15 %.',
      why: 'Opponents can safely fold when you enter a pot, killing your value.',
      fix: 'Open up suited connectors and broadways on the BTN/CO.'
    });
  }

  // Passivity ratio
  if (pfr > 0 && (vpip / pfr) > thresholds.vpipPfr[1]) {
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

    /* ---------- Additional leaks Phase 1 ---------- */
  // 5. Spewy aggression – PFR much higher than recommended
  if (pfr > thresholds.pfr[2] && (vpip - pfr) < 5) {
    leaks.push({
      id: 'spewyOpen',
      name: 'Overly Aggressive Opens',
      severity: 'Medium',
      description: 'Raising pre-flop with a very wide range.',
      why: 'Loose opens can be exploited by 3-bets and puts you OOP with weak hands.',
      fix: 'Tighten your opening range especially from EP/MP.'
    });
  }

  // 6. Button / CO RFI
  const btnRfi = pct(stats.btn_rfi_actions, stats.btn_rfi_opportunities);
  if (stats.btn_rfi_opportunities > 30 && btnRfi < 35) {
    leaks.push({
      id: 'btnTight',
      name: 'Under-Opening Button',
      severity: 'Medium',
      description: 'Button raise-first-in < 35 %',
      why: 'You forfeit the most profitable position at the table.',
      fix: 'Open at least top 45-50 % of hands on the BTN.'
    });
  }
  const coRfi = pct(stats.co_rfi_actions, stats.co_rfi_opportunities);
  if (stats.co_rfi_opportunities > 30 && coRfi < 25) {
    leaks.push({
      id: 'coTight',
      name: 'Under-Opening Cut-off',
      severity: 'Medium',
      description: 'CO raise-first-in < 25 %',
      why: 'You miss many profitable steal spots.',
      fix: 'Aim for 28-32 % opening frequency from CO.'
    });
  }

  // 7. Limp habit
  const openLimpPct = pct(stats.open_limp_actions, stats.open_limp_opportunities);
  if (stats.open_limp_opportunities > 30 && openLimpPct > thresholds.openLimp[0]*100) {
    leaks.push({
      id: 'openLimp',
      name: 'Open-Limping',
      severity: 'Medium',
      description: 'You limp first into the pot too often.',
      why: 'Open-limping gives up initiative and makes pots multi-way.',
      fix: 'Raise or fold; avoid limping except in special live games.'
    });
  }

  // 8/9. SB & BB over-fold vs steal
  const sbFoldSteal = pct(stats.sb_fold_vs_steal_actions, stats.sb_fold_vs_steal_opportunities);
  if (stats.sb_fold_vs_steal_opportunities > 20 && sbFoldSteal > 80) {
    leaks.push({
      id: 'sbOverFold',
      name: 'SB Over-Folds vs Steal',
      severity: 'High',
      description: 'Small blind defends less than 20 % of the time.',
      why: 'BB collects dead money; you lose blinds uncontested.',
      fix: 'Defend by 3-betting or calling with top 25 % vs BTN steals.'
    });
  }
  const bbFoldSteal = pct(stats.bb_fold_vs_steal_actions, stats.bb_fold_vs_steal_opportunities);
  if (stats.bb_fold_vs_steal_opportunities > 20 && bbFoldSteal > 70) {
    leaks.push({
      id: 'bbOverFold',
      name: 'BB Over-Folds vs Steal',
      severity: 'High',
      description: 'Big blind defence < 30 %.',
      why: 'You give up the 2.5 BB pot too easily.',
      fix: 'Defend with suited hands and 3-bet more against late-position opens.'
    });
  }

  // 10-12 Post-flop C-bet leaks
  const cbetFlop = pct(stats.cbet_flop_actions, stats.cbet_flop_opportunities);
  if (stats.cbet_flop_opportunities > 30 && cbetFlop > 70) {
    leaks.push({ id:'overCbet', name:'Over-C-Bet Flop', severity:'Medium', description:'Flop C-bet > 70 %', why:'You barrel every board, opponents float/raise light.', fix:'Check more on wet boards and multi-way pots.' });
  }
  if (stats.cbet_flop_opportunities > 30 && cbetFlop < 40) {
    leaks.push({ id:'underCbet', name:'Under-C-Bet Flop', severity:'Medium', description:'Flop C-bet < 40 %', why:'You miss value and let opponents realise equity for free.', fix:'C-bet more on dry boards heads-up.' });
  }
  // Turn & River continuation
  const cbetTurn = pct(stats.cbet_turn_actions, stats.cbet_turn_opportunities);
  if (stats.cbet_turn_opportunities > 20 && cbetTurn < 35 && cbetFlop > 40) {
    leaks.push({ id:'rareDouble', name:'Rare Double-Barrel', severity:'Medium', description:'Turn C-bet < 35 % after flop C-bet.', why:'You give up too often on turn, allowing opponents to realise equity.', fix:'Barrel more favourable turns, especially heads-up.' });
  }
  const cbetRiver = pct(stats.cbet_river_actions, stats.cbet_river_opportunities);
  if (stats.cbet_river_opportunities > 15 && cbetRiver > 45) {
    leaks.push({ id:'spewTriple', name:'Spewy Triple-Barrel', severity:'Medium', description:'River C-bet > 45 %.', why:'High river fire frequency without nutted range can be exploited.', fix:'Select river bluffs carefully; give up more often on blank rivers.' });
  }
  const foldVsCbetFlop = pct(stats.fold_vs_cbet_flop_actions, stats.fold_vs_cbet_flop_opportunities);
  if (stats.fold_vs_cbet_flop_opportunities > 30 && foldVsCbetFlop > 70) {
    leaks.push({ id:'foldVsCbet', name:'Folds Too Much vs Flop C-Bet', severity:'High', description:'Fold > 70 % when facing flop C-bet.', why:'Opponents profit by auto-barreling you.', fix:'Defend with top-pair+, back-door equity and occasional raises.' });
  }

  // 13. 3-Bet / 4-Bet leaks
  const threeBetOverall = pct(stats["3bet_actions"], stats["3bet_opportunities"]);
  if (stats["3bet_opportunities"] > 50 && threeBetOverall < 3) {
    leaks.push({ id:'no3bet', name:'Never 3-Betting', severity:'High', description:'Overall 3-bet frequency below 3 %.', why:'You rarely contest pots aggressively, letting open-raisers realise equity.', fix:'Add value 3-bets with QQ+/AK and mix a few suited wheel aces as bluffs.'});
  }

  const foldVs3 = pct(stats.fold_vs_3bet_actions, stats.fold_vs_3bet_opportunities);
  if (stats.fold_vs_3bet_opportunities > 30 && foldVs3 > 70) {
    leaks.push({ id:'fold3bet', name:'Folds Too Much vs 3-Bet', severity:'High', description:'Fold vs 3-bet over 70 %.', why:'Aggressive players can 3-bet you with impunity.', fix:'4-bet or call more with strong hands that opened.'});
  }

  const fourBetOverall = pct(stats["4bet_actions"], stats["4bet_opportunities"]);
  if (stats["4bet_opportunities"] > 20 && fourBetOverall < 2) {
    leaks.push({ id:'no4bet', name:'Never 4-Betting', severity:'High', description:'4-bet frequency below 2 %.', why:'You surrender initiative and leave money on the table with premiums.', fix:'4-bet for value with KK+, and include some A5s/A4s bluffs.'});
  }

  const foldVs4 = pct(stats.fold_vs_4bet_actions, stats.fold_vs_4bet_opportunities);
  if (stats.fold_vs_4bet_opportunities > 20 && foldVs4 > 75) {
    leaks.push({ id:'fold4bet', name:'Folds Too Much vs 4-Bet', severity:'High', description:'Fold vs 4-bet over 75 %.', why:'Observant opponents will 4-bet bluff you.', fix:'Tighten 3-bet range or continue with value portion against 4-bets.'});
  }

// 17-19 Post-flop barrel leaks
  const af = calculateAggFactor(stats);
  if (af < thresholds.af[0]) {
    leaks.push({ id:'passivePost', severity:'High' });
  } else if (af > thresholds.af[1] && vpip > 30) {
    leaks.push({ id:'maniacPost', severity:'Medium' });
  }

  /* ---------- Showdown Leaks ---------- */
  const wtsd = pct(stats.wtsd_actions, stats.wtsd_opportunities); // Went to Showdown %
  if (stats.wtsd_opportunities > 30 && (wtsd/100) > thresholds.wtsd[1]) {
    leaks.push({ id: 'wtsdHigh', severity: 'Medium' });
  } else if (stats.wtsd_opportunities > 30 && (wtsd/100) < thresholds.wtsd[0]) {
    leaks.push({ id: 'wtsdLow', severity: 'Medium' });
  }

  const wsd = pct(stats.wsd_actions, stats.wsd_opportunities); // Won Showdown %
  if (stats.wsd_opportunities > 30 && (wsd/100) < thresholds.wsd[0]) {
    leaks.push({ id: 'wsdLow', severity: 'High' });
  }

  const wwsf = pct(stats.wwsf_actions, stats.wwsf_opportunities); // Won When Saw Flop %
  if (stats.wwsf_opportunities > 30 && (wwsf/100) < thresholds.wwsf[0]) {
    leaks.push({ id: 'wwsfLow', severity: 'Medium' });
  }

  /* ---------- Special Lines: Donk / Check-Raise ---------- */
  const donkFlop = pct(stats.donk_flop_actions, stats.donk_flop_opportunities);
  if (stats.donk_flop_opportunities > 30 && donkFlop < 2) {
    leaks.push({ id: 'noDonk', severity: 'Medium' });
  }
  const xrFlop = pct(stats.ch_raise_flop_actions, stats.ch_raise_flop_opportunities);
  if (stats.ch_raise_flop_opportunities > 30 && xrFlop < 2) {
    leaks.push({ id: 'noCheckRaise', severity: 'Medium' });
  }

  /* ---------- Meta ---------- */
  if (stats.hands_played > 200 && typeof stats.total_bb_won === 'number') {
    const bb100 = (stats.total_bb_won / stats.hands_played) * 100;
    if (bb100 < -2) {
      leaks.push({ id: 'losingBB', severity: 'High' });
    }
  }

  // Personalise text copy with user metrics
  const metrics = {
    vpip: vpip.toFixed(1),
    pfr: pfr.toFixed(1),
    af: af.toFixed(2),
    btnRfi: btnRfi.toFixed(1),
    coRfi: coRfi.toFixed(1),
    openLimp: openLimpPct.toFixed(1),
    sbFoldSteal: sbFoldSteal.toFixed(1),
    bbFoldSteal: bbFoldSteal.toFixed(1),
    cbetFlop: cbetFlop.toFixed(1),
    cbetTurn: cbetTurn.toFixed(1),
    cbetRiver: cbetRiver.toFixed(1),
    foldVsCbetFlop: foldVsCbetFlop.toFixed(1),
    threeBetOverall: threeBetOverall.toFixed(1),
    foldVs3: foldVs3.toFixed(1),
    fourBetOverall: fourBetOverall.toFixed(1),
    foldVs4: foldVs4.toFixed(1),
    donkFlop: donkFlop.toFixed(1),
    xrFlop: xrFlop.toFixed(1),
    wtsd: wtsd.toFixed(1),
    wsd: wsd.toFixed(1),
    wwsf: wwsf.toFixed(1),
    bb100: (stats.total_bb_won && stats.hands_played ? ((stats.total_bb_won / stats.hands_played) * 100).toFixed(2) : '0')
  };

  const personalise = str => str && str.replace(/\{(\w+)\}/g, (_, key) => metrics[key] !== undefined ? metrics[key] : `{${key}}`);

  return leaks.map(l => {
    const copy = leakTexts[l.id] || {};
    return {
      ...l,
      ...copy,
      description: personalise(copy.description),
      why: personalise(copy.why),
      fix: personalise(copy.fix),
    };
  });
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
              style={{
                backgroundColor: '#232032',
                border: '2px solid #1a1420',
                boxShadow: '0 4px 24px 0 rgba(40,34,58,0.15)',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0.5rem 1.25rem',
                color: 'white',
                fontWeight: 700,
                fontSize: '1.1rem',
                transition: 'transform 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.backgroundColor = '#2d2942'; e.currentTarget.style.transform = 'scale(1.07)'; }}
              onMouseOut={e => { e.currentTarget.style.backgroundColor = '#232032'; e.currentTarget.style.transform = 'scale(1)'; }}
              onClick={() => openCoachPanel(`Explain the leak: ${leak.name}. Why is it a problem and how can I fix it?`)}
              title={`Ask P.H.I.L. about ${leak.name}`}
            >
              <span style={{
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                overflow: 'hidden',
                background: 'transparent'
              }}>
                <img
                  src="/images/shark.png"
                  alt="P.H.I.L."
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    display: 'block'
                  }}
                />
              </span>
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Ask P.H.I.L. about this leak</span>
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
  const [showSpinner, setShowSpinner] = useState(false); // debounce spinner
  const [sessions, setSessions] = useState([]); // All sessions with >= 150 hands
  const [selectedSessions, setSelectedSessions] = useState([DEFAULT_SESSION_ID]); // Array of selected session IDs
  const [coachOpen, setCoachOpen] = useState(false);
  const [coachInitialQuestion, setCoachInitialQuestion] = useState('');

  const openCoachPanel = (question = '') => {
    setCoachInitialQuestion(question);
    setCoachOpen(true);
  };

  // Debounce spinner: only show if loading > 300ms
  useEffect(() => {
    let timeout;
    if (loading) {
      timeout = setTimeout(() => setShowSpinner(true), 300);
    } else {
      setShowSpinner(false);
    }
    return () => clearTimeout(timeout);
  }, [loading]);

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

  if (loading && showSpinner) {
    return (
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50" style={{ background: 'rgba(15,17,21,0.4)' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white/80"></div>
      </div>
    );
  }

  const vpip = calculateStat(playerStats?.vpip_actions, playerStats?.vpip_opportunities);
  const pfr = calculateStat(playerStats?.pfr_actions, playerStats?.pfr_opportunities);
  const aggression = calculateAggFactor(playerStats);
  // Helper pct function for component scope
  const pct = (actions, opps) => opps ? (actions / opps) * 100 : 0;

  // Build metrics object used for placeholder substitution
  const stats = playerStats || {};
  const btnRfi        = pct(stats.btn_rfi_actions, stats.btn_rfi_opportunities);
  const coRfi         = pct(stats.co_rfi_actions, stats.co_rfi_opportunities);
  const openLimpPct   = pct(stats.open_limp_actions, stats.open_limp_opportunities);
  const sbFoldSteal   = pct(stats.sb_fold_vs_steal_actions, stats.sb_fold_vs_steal_opportunities);
  const bbFoldSteal   = pct(stats.bb_fold_vs_steal_actions, stats.bb_fold_vs_steal_opportunities);
  const cbetFlop      = pct(stats.cbet_flop_actions, stats.cbet_flop_opportunities);
  const cbetTurn      = pct(stats.cbet_turn_actions, stats.cbet_turn_opportunities);
  const cbetRiver     = pct(stats.cbet_river_actions, stats.cbet_river_opportunities);
  const foldVsCbetFlop= pct(stats.fold_vs_cbet_flop_actions, stats.fold_vs_cbet_flop_opportunities);
  const threeBetOverall = pct(stats["3bet_actions"], stats["3bet_opportunities"]);
  const foldVs3       = pct(stats.fold_vs_3bet_actions, stats.fold_vs_3bet_opportunities);
  const fourBetOverall = pct(stats["4bet_actions"], stats["4bet_opportunities"]);
  const foldVs4       = pct(stats.fold_vs_4bet_actions, stats.fold_vs_4bet_opportunities);
  const donkFlop      = pct(stats.donk_flop_actions, stats.donk_flop_opportunities);
  const xrFlop        = pct(stats.ch_raise_flop_actions, stats.ch_raise_flop_opportunities);
  const wtsd          = pct(stats.wtsd_actions, stats.wtsd_opportunities);
  const wsd           = pct(stats.wsd_actions, stats.wsd_opportunities);
  const wwsf          = pct(stats.wwsf_actions, stats.wwsf_opportunities);
  const bb100         = (stats.total_bb_won && stats.hands_played ? ((stats.total_bb_won / stats.hands_played) * 100) : 0);

  const metrics = {
    vpip: vpip.toFixed(1),
    pfr: pfr.toFixed(1),
    af: aggression.toFixed(2),
    btnRfi: btnRfi.toFixed(1),
    coRfi: coRfi.toFixed(1),
    openLimp: openLimpPct.toFixed(1),
    sbFoldSteal: sbFoldSteal.toFixed(1),
    bbFoldSteal: bbFoldSteal.toFixed(1),
    cbetFlop: cbetFlop.toFixed(1),
    cbetTurn: cbetTurn.toFixed(1),
    cbetRiver: cbetRiver.toFixed(1),
    foldVsCbetFlop: foldVsCbetFlop.toFixed(1),
    threeBetOverall: threeBetOverall.toFixed(1),
    foldVs3: foldVs3.toFixed(1),
    fourBetOverall: fourBetOverall.toFixed(1),
    foldVs4: foldVs4.toFixed(1),
    donkFlop: donkFlop.toFixed(1),
    xrFlop: xrFlop.toFixed(1),
    wtsd: wtsd.toFixed(1),
    wsd: wsd.toFixed(1),
    wwsf: wwsf.toFixed(1),
    bb100: bb100.toFixed(2)
  };

  const personalise = (str) => str?.replace(/\{(\w+)\}/g, (_, key) => metrics[key] ?? `{${key}}`);

  // Dev/test flag: show all leaks regardless of stats
  const SHOW_ALL_LEAKS = true;
  const identifiedLeaks = SHOW_ALL_LEAKS
    ? Object.entries(leakTexts).map(([id, copy]) => ({
        id,
        severity: copy.defaultSeverity || 'Low',
        ...copy,
        description: personalise(copy.description),
        why: personalise(copy.why),
        fix: personalise(copy.fix),
      }))
    : (playerStats ? analyzeLeaks(playerStats) : []);

  // --- DEBUG LOG ---
  if (playerStats) {
    // eslint-disable-next-line no-console
    console.log('[PokerDNA Debug] Stats snapshot', {
      selectedSessions,
      rawStats: playerStats,
      metrics,
      identifiedLeaks,
    });
  }

  const playerType = getPlayerType(vpip, aggression, playerStats?.hands_played || 0);

  // In the main DNA graph/stats area, if the combined hands_played across all selected sessions >= 150, show analysis; otherwise, show 'Not Enough Hands'.
  const selectedSessionObjs = sessions.filter(s => selectedSessions.includes(s.id));
  const totalHands = selectedSessionObjs.reduce((sum, s) => sum + (s.hands_played || 0), 0);
  const notEnoughHands = totalHands < 150;

  return (
    <div 
      className="min-h-screen w-full h-screen bg-[#0F1115] text-white overflow-y-auto"
    >
      {/* Floating Ask P.H.I.L. Button (pill style, png) */}
      <button
        className="fixed bottom-6 right-6 z-50 text-white rounded-full shadow-lg border-2 flex items-center gap-2 px-4 py-2 transition-transform duration-200"
        style={{ backgroundColor: '#232032', borderColor: '#1a1420', boxShadow: '0 4px 24px 0 rgba(40,34,58,0.15)' }}
        onMouseOver={e => { e.currentTarget.style.backgroundColor = '#2d2942'; e.currentTarget.style.transform = 'scale(1.07)'; }}
        onMouseOut={e => { e.currentTarget.style.backgroundColor = '#232032'; e.currentTarget.style.transform = 'scale(1)'; }}
        onClick={() => openCoachPanel('Can you review my stats and leaks and give me advice?')}
      >
        <span className="w-14 h-14 flex items-center justify-center rounded-full overflow-hidden">
          <img src="/images/shark.png" alt="P.H.I.L." className="w-full h-full object-cover rounded-full" style={{ display: 'block' }} />
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
              <div className="lg:col-span-1 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl h-fit">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-100">Core Metrics</h3>
                  <button
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      boxShadow: 'none',
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.07)'; }}
                    onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                    onClick={() => openCoachPanel('Can you explain what the core metrics mean and how I can improve them?')}
                    title="Ask P.H.I.L. about Core Metrics"
                  >
                    <img
                      src="/images/shark.png"
                      alt="P.H.I.L."
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '50%',
                        display: 'block'
                      }}
                    />
                  </button>
                </div>
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
              {/* Leaks section header Ask P.H.I.L. button (make 64x64) */}
              <button
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.07)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                onClick={() => openCoachPanel('Can you explain my leaks and how to fix them?')}
                title="Ask P.H.I.L. about Leaks"
              >
                <img
                  src="/images/shark.png"
                  alt="P.H.I.L."
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    display: 'block'
                  }}
                />
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