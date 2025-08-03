import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import StreetReviewPanel from '../components/ai-review/StreetReviewPanel';
import TextHandReplayer from '../components/hand-review/TextHandReplayer';

import useHandHistory from '../hooks/useHandHistory';
import { useAuth } from '../context/AuthContext';

export default function HandReviewPage() {
  const { handId } = useParams();
  const { user } = useAuth();
  const { hand, loading, error } = useHandHistory(handId);
  const [streetIndex, setStreetIndex] = useState(0);

  const nextStreet = () => setStreetIndex((i) => Math.min(i + 1, 4));
  const prevStreet = () => setStreetIndex((i) => Math.max(i - 1, 0));

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-11/12 lg:w-10/12">
        <h1 className="col-span-full text-2xl font-bold text-center text-white mb-2">AI Hand Review <span className="text-sm font-normal text-gray-400">powered by P.H.I.L.</span></h1>

        {/* Replayer */}
        <div className="lg:col-span-7 bg-gray-800/60 rounded-xl p-6 border border-gray-700 flex flex-col min-h-[400px]">
          <h2 className="text-xl font-bold text-white mb-4">Hand #{handId}</h2>
          {loading && <p className="text-gray-400">Loading hand...</p>}
          {error && <p className="text-red-400">Error: {error.message}</p>}
          {!loading && !error && (
            <TextHandReplayer history={hand?.history} streetIndex={streetIndex} setStreetIndex={setStreetIndex} />
          )}
        </div>

        {/* PHIL Analysis */}
        <div className="lg:col-span-5 bg-gray-800/60 rounded-xl p-4 border border-gray-700 overflow-hidden flex flex-col">
          <StreetReviewPanel history={hand?.history} heroId={user?.id || ''} />
        </div>
        </div>
      </div>
    </MainLayout>
  );
}
