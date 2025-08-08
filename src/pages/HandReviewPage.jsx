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
  // Sidebar: minimize on entry to reduce large left padding from expanded sidebar
  useEffect(() => {
    try { window.dispatchEvent(new Event('minimizeSidebar')); } catch (_) {}
  }, []);

  // Note: StreetReviewPanel now owns the Analyze CTA; this hook kept for future params
  useEffect(() => {
    // reserved for ?street / ?analyze
  }, [searchParams]);

  const nextStreet = () => setStreetIndex((i) => Math.min(i + 1, 4));
  const prevStreet = () => setStreetIndex((i) => Math.max(i - 1, 0));

  // Analyze is handled within StreetReviewPanel

  return (
    <MainLayout>
      <div className="relative min-h-screen">
        {/* Subtle layered background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 -left-24 h-[36vw] w-[36vw] max-h-[520px] max-w-[520px] rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[28vw] w-[28vw] max-h-[420px] max-w-[420px] rounded-full bg-fuchsia-500/10 blur-3xl" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 lg:px-8 py-8">
          {/* Title row */}
          <div className="mb-4 flex flex-col items-center">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              AI Hand Review <span className="text-sm font-normal text-gray-400">powered by P.H.I.L.</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Replayer */}
            <div className="xl:col-span-8 bg-slate-900/70 backdrop-blur rounded-2xl p-6 border border-slate-800 shadow-xl min-h-[460px]">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-white">Hand #{handId}</h2>
                  {hand?.history?.blinds && (
                    <span className="text-xs text-gray-400 bg-slate-800/80 border border-slate-700 rounded-md px-2 py-1">SB {hand.history.blinds.SB} / BB {hand.history.blinds.BB}</span>
                  )}
                </div>
                {/* Analyze action moved to the right panel */}
              </div>

              {loading && <p className="text-gray-400">Loading hand...</p>}
              {error && <p className="text-red-400">Error: {error.message}</p>}
              {!loading && !error && (
                <TextHandReplayer
                  history={hand?.history}
                  streetIndex={streetIndex}
                  setStreetIndex={setStreetIndex}
                  heroId={user?.id || hand?.heroId || ''}
                />
              )}
            </div>

            {/* PHIL Analysis */}
            <div className="xl:col-span-4 bg-slate-900/70 backdrop-blur rounded-2xl p-4 border border-slate-800 shadow-xl overflow-hidden flex flex-col xl:sticky xl:top-24">
              <StreetReviewPanel history={hand?.history} heroId={user?.id || ''} streetIndex={streetIndex} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
