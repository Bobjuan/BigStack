import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import StreetReviewPanel from '../components/ai-review/StreetReviewPanel';
import TextHandReplayer from '../components/hand-review/TextHandReplayer';

import useHandHistory from '../hooks/useHandHistory';
import { useAuth } from '../context/AuthContext';

export default function HandReviewPage() {
  const { handId } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { hand, loading, error } = useHandHistory(handId);
  const [streetIndex, setStreetIndex] = useState(0);
  const [analysisTriggered, setAnalysisTriggered] = useState(false);

  // Check if analysis should be auto-triggered
  useEffect(() => {
    if (searchParams.get('analyze') === 'true') {
      setAnalysisTriggered(true);
    }
  }, [searchParams]);

  const nextStreet = () => setStreetIndex((i) => Math.min(i + 1, 4));
  const prevStreet = () => setStreetIndex((i) => Math.max(i - 1, 0));

  const handleAnalyzeHand = () => {
    setAnalysisTriggered(true);
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-11/12 lg:w-10/12">
        <h1 className="col-span-full text-2xl font-bold text-center text-white mb-2">AI Hand Review <span className="text-sm font-normal text-gray-400">powered by P.H.I.L.</span></h1>

        {/* Replayer */}
        <div className="lg:col-span-7 bg-gray-800/60 rounded-xl p-6 border border-gray-700 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">Hand #{handId}</h2>
            {!analysisTriggered && (
              <button
                onClick={handleAnalyzeHand}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Analyze Hand
              </button>
            )}
          </div>
          {loading && <p className="text-gray-400">Loading hand...</p>}
          {error && <p className="text-red-400">Error: {error.message}</p>}
          {!loading && !error && (
            <TextHandReplayer history={hand?.history} streetIndex={streetIndex} setStreetIndex={setStreetIndex} />
          )}
        </div>

        {/* PHIL Analysis */}
        <div className="lg:col-span-5 bg-gray-800/60 rounded-xl p-4 border border-gray-700 overflow-hidden flex flex-col">
          {analysisTriggered ? (
            <StreetReviewPanel history={hand?.history} heroId={user?.id || ''} streetIndex={streetIndex} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-gray-400 mb-4">
                <p className="text-lg font-semibold mb-2">Ready for AI Analysis</p>
                <p className="text-sm">
                  Click "Analyze Hand" to get detailed AI commentary on each street of this hand.
                </p>
              </div>
              <div className="text-xs text-gray-500 max-w-md">
                <p className="mb-2">The AI will analyze:</p>
                <ul className="text-left space-y-1">
                  <li>• Preflop action and position</li>
                  <li>• Flop texture and betting patterns</li>
                  <li>• Turn and river decisions</li>
                  <li>• Overall hand strategy</li>
                </ul>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>
    </MainLayout>
  );
}
