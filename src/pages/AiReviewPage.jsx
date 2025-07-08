import React, { useState, useEffect } from 'react';
import RandomQuestionsChat from '../components/ai-review/RandomQuestionsChat';
import HandReviewChat from '../components/ai-review/HandReviewChat';
import PlayerStatsChat from '../components/ai-review/PlayerStatsChat';
import '../components/ai-review/PokerChatbot.css';
import TopNavBar from '../components/layout/TopNavBar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';

const statFields = [
  { key: 'hands_played', label: 'Hands Played' },
  { key: 'vpip', label: 'VPIP' },
  { key: 'pfr', label: 'PFR' },
  { key: 'vpip_actions', label: 'VPIP Actions' },
  { key: 'vpip_opportunities', label: 'VPIP Opportunities' },
  { key: 'pfr_actions', label: 'PFR Actions' },
  { key: 'pfr_opportunities', label: 'PFR Opportunities' },
];

const PlayerStatsDisplay = ({ stats }) => {
  // Calculate derived stats
  const vpip = stats && stats.vpip_opportunities ? Math.round((stats.vpip_actions / stats.vpip_opportunities) * 100) : null;
  const pfr = stats && stats.pfr_opportunities ? Math.round((stats.pfr_actions / stats.pfr_opportunities) * 100) : null;
  return (
    <div className="bg-[#181c27] rounded-xl shadow-lg p-6 border border-gray-700 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-white text-center">Your Poker Stats</h2>
      <table className="w-full text-left text-white">
        <tbody>
          {statFields.map(({ key, label }) => (
            <tr key={key}>
              <td className="py-2 font-semibold">{label}</td>
              <td>
                {key === 'vpip'
                  ? (vpip !== null ? `${vpip}%` : 'N/A')
                  : key === 'pfr'
                  ? (pfr !== null ? `${pfr}%` : 'N/A')
                  : stats && stats[key] !== undefined && stats[key] !== null
                  ? stats[key]
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AiReviewPage = () => {
  const [activeTab, setActiveTab] = useState('random');
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('player_stats')
        .select('*')
        .eq('player_id', user.id)
        .single();
      if (!error && data) setStats(data);
      else setStats(null);
      setLoading(false);
    };
    if (activeTab === 'player-stats' && user?.id) {
      fetchStats();
    }
  }, [activeTab, user]);

  return (
    <div className="min-h-screen w-full bg-[#0F1115] text-white font-inter">
      <TopNavBar />
      <div className="max-w-3xl mx-auto w-full pt-28 pb-12">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-8 text-white text-center">
          ♠️ Poker Chatbot
        </h1>
        {/* Tabs */}
        <div className="flex justify-center mb-4 bg-[#23273a] rounded-lg shadow-sm border border-gray-700 pt-0 pb-3 px-0">
          <div
            className={`tab flex items-center gap-2 px-6 ${activeTab === 'random' ? 'active' : ''}`}
            onClick={() => setActiveTab('random')}
            style={{ cursor: 'pointer' }}
          >
            <i className="fas fa-comments"></i>
            <span className="text-lg font-medium text-white">Random Questions</span>
          </div>
          <div
            className={`tab flex items-center gap-2 px-6 ${activeTab === 'hand-review' ? 'active' : ''}`}
            onClick={() => setActiveTab('hand-review')}
            style={{ cursor: 'pointer' }}
          >
            <i className="fas fa-chart-line"></i>
            <span className="text-lg font-medium text-white">Hand Review</span>
          </div>
          <div
            className={`tab flex items-center gap-2 px-6 ${activeTab === 'player-stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('player-stats')}
            style={{ cursor: 'pointer' }}
          >
            <i className="fas fa-user"></i>
            <span className="text-lg font-medium text-white">Player Stats</span>
          </div>
        </div>
        <div className="bg-[#23273a] rounded-lg shadow-lg p-4 border border-gray-700">
          {activeTab === 'random' && <RandomQuestionsChat />}
          {activeTab === 'hand-review' && <HandReviewChat />}
          {activeTab === 'player-stats' && (
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2 w-full"><PlayerStatsChat /></div>
              <div className="md:w-1/2 w-full flex items-center justify-center">
                {loading ? <div className="text-gray-400">Loading stats...</div> : <PlayerStatsDisplay stats={stats} />}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AiReviewPage; 