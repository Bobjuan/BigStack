import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';

const statFields = [
  { key: 'hands_played', label: 'Hands Played' },
  { key: 'vpip', label: 'VPIP' },
  { key: 'pfr', label: 'PFR' },
  { key: 'vpip_actions', label: 'VPIP Actions' },
  { key: 'vpip_opportunities', label: 'VPIP Opportunities' },
  { key: 'pfr_actions', label: 'PFR Actions' },
  { key: 'pfr_opportunities', label: 'PFR Opportunities' },
];

const PlayerStatsChat = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Ask about your stats!' }
  ]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [selectedStats, setSelectedStats] = useState({
    hands_played: true,
    vpip: true,
    pfr: true,
    vpip_actions: false,
    vpip_opportunities: false,
    pfr_actions: false,
    pfr_opportunities: false,
  });

  React.useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('player_stats')
        .select('*')
        .eq('player_id', user.id)
        .single();
      if (!error && data) {
        setStats(data);
      } else {
        setStats(null);
      }
      setLoading(false);
    };
    fetchStats();
  }, [user]);

  // Calculate derived stats
  const vpip = stats && stats.vpip_opportunities ? Math.round((stats.vpip_actions / stats.vpip_opportunities) * 100) : null;
  const pfr = stats && stats.pfr_opportunities ? Math.round((stats.pfr_actions / stats.pfr_opportunities) * 100) : null;

  const handleToggle = (key) => {
    setSelectedStats((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleInputSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    // Build selected stats object
    const statData = {};
    statFields.forEach(({ key }) => {
      if (selectedStats[key]) {
        if (key === 'vpip') statData.vpip = vpip !== null ? vpip : 'N/A';
        else if (key === 'pfr') statData.pfr = pfr !== null ? pfr : 'N/A';
        else statData[key] = stats ? stats[key] : 'N/A';
      }
    });
    const formatted = `question: ${input.trim()}\nstats: ${JSON.stringify(statData, null, 2)}`;
    setMessages(msgs => [
      ...msgs,
      { sender: 'user', text: input.trim() },
      { sender: 'bot', text: `You asked: ${input.trim()}\nHere are the selected stats for analysis:\n${JSON.stringify(statData, null, 2)}` }
    ]);
    setInput('');
  };

  return (
    <div className="bg-[#1b1f2b] w-full h-full flex flex-col px-4 py-4">
      <div className="chat-container bg-[#1b1f2b] rounded-xl p-4 border border-gray-700 shadow-md flex-1 overflow-y-auto mb-2">
        {messages.map((msg, i) => (
          <div key={i} className={'flex items-end mb-2 ' + (msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={msg.sender === 'user' ? 'bg-blue-700 text-white rounded-lg p-3 max-w-[80%] text-right' : 'bg-[#2f3542] text-white rounded-lg p-3 max-w-[80%]'}>
              <pre className="whitespace-pre-wrap">{msg.text}</pre>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-end mb-2 justify-start">
            <div className="bg-[#2f3542] text-white rounded-lg p-3 max-w-[80%] flex gap-1 items-center">
              <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-bounce mr-1"></span>
              <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-bounce mr-1"></span>
              <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
      </div>
      {/* Stat toggles */}
      <div className="flex flex-wrap gap-2 mb-2">
        {statFields.map(({ key, label }) => (
          <label key={key} className="flex items-center gap-1 bg-[#23273a] px-3 py-1 rounded-lg border border-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={selectedStats[key]}
              onChange={() => handleToggle(key)}
              className="accent-blue-600"
            />
            <span className="text-white text-sm">{label}</span>
            {key === 'vpip' && stats && stats.vpip_opportunities ? <span className="text-blue-300 ml-1">{vpip}%</span> : null}
            {key === 'pfr' && stats && stats.pfr_opportunities ? <span className="text-blue-300 ml-1">{pfr}%</span> : null}
            {key !== 'vpip' && key !== 'pfr' && stats ? <span className="text-blue-300 ml-1">{stats[key]}</span> : null}
          </label>
        ))}
      </div>
      <form className="flex flex-col gap-2" onSubmit={handleInputSend}>
        <div className="flex gap-2">
          <input
            className="flex-1 px-4 py-2 rounded-lg border border-gray-700 !bg-[#23273a] !text-white !placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
            placeholder="Type your question about your stats..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 border border-blue-700 disabled:opacity-50 flex items-center justify-center"
            disabled={loading || !input.trim()}
          >
            Send
          </button>
        </div>
        {stats && (
          <button
            className="h-[40px] px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 border border-green-700 disabled:opacity-50 flex items-center justify-center"
            onClick={e => { e.preventDefault(); evaluateStats(); }}
            type="button"
            disabled={loading}
          >
            Evaluate My Stats
          </button>
        )}
      </form>
    </div>
  );
};

export default PlayerStatsChat; 