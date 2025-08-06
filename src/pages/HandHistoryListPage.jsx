import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { useAuth } from '../context/AuthContext';

export default function HandHistoryListPage() {
  const { user } = useAuth();
  const [hands, setHands] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHands = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('hand_histories_v2')
        .select('hand_id, hand_number, played_at, history, player_ids')
        .contains('player_ids', [user.id])
        .order('played_at', { ascending: false })
        .limit(20);
      if (!error) setHands(data || []);
      setLoading(false);
    };
    if (user) fetchHands();
  }, [user]);

  const formatCards = (cards=[]) => cards.join(' ');

  const handleAnalyzeHand = (handId) => {
    navigate(`/hand/${handId}?analyze=true`);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6">Your Recent Hands</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-2">
          {hands.map(hand => {
            const player = hand.history?.players?.find(p=>p.playerId===user.id) || {};
            const delta = (player.finalStack??0) - (player.startingStack??0);
            return (
              <div key={hand.hand_id} className="flex justify-between items-center bg-gray-800/60 p-3 rounded border border-gray-700 hover:bg-gray-700/50">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-400 font-mono">#{hand.hand_number}</span>
                  <span className="font-mono">{formatCards(player.cards)}</span>
                  <span className="text-gray-400">{player.position}</span>
                  <span className={delta>0?'text-green-400':delta<0?'text-red-400':'text-gray-400'}>{delta>0?`+${delta}`:delta}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={()=>navigate(`/hand/${hand.hand_id}`)} 
                    className="bg-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Review
                  </button>
                  <button 
                    onClick={()=>handleAnalyzeHand(hand.hand_id)} 
                    className="bg-green-600 px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    Analyze
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CTA */}
      <div className="mt-10 p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-center">
        <h2 className="text-xl font-bold mb-2">Want to see your entire history?</h2>
        <p className="mb-4">Upgrade to <span className="font-bold">BigStack Pro</span> for unlimited hand tracking and deep analysis.</p>
        <button onClick={()=>navigate('/pricing')} className="bg-black/20 px-5 py-2 rounded-lg font-semibold hover:bg-black/30">See Plans</button>
      </div>
    </div>
  );
}
