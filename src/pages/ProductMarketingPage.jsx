import React from 'react';
import TopNavBar from '../components/layout/TopNavBar';
import Footer from '../components/layout/Footer';
import EmailWaitlistForm from '../components/marketing/EmailWaitlistForm';
import ScreenshotTabsCard from '../components/marketing/ScreenshotTabsCard';
import LeakTeaserRow from '../components/marketing/LeakTeaserRow';

// Placeholder images; replace with real screenshots in public/images
const tabs = [
  { id: 'review', label: 'AI Hand Review', imageSrc: '/images/shot-hand-review.png', alt: 'AI Hand Review', caption: 'Street-by-street breakdowns with solver-backed reasoning in plain English.', highlights: ['Preflop → River', 'Hero-centric', 'Instant insights'] },
  { id: 'dna', label: 'Poker DNA', imageSrc: '/images/shot-dna.png', alt: 'Poker DNA', caption: 'Your playing style mapped with 30+ stats and personalized recommendations.', highlights: ['VPIP/PFR/AF', 'Style map', 'Session filters'] },
  { id: 'leaks', label: 'Leak Finder', imageSrc: '/images/shot-leaks.png', alt: 'Leak Finder', caption: '20+ leaks auto-identified with clear fixes.', highlights: ['Fold vs C-bet', '3-bet/4-bet', 'Donk / Check-raise'] },
  { id: 'tracking', label: 'Auto Tracking', imageSrc: '/images/shot-tracking.png', alt: 'Auto Tracking', caption: 'Just play poker. We track advanced stats in the background.', highlights: ['Live & Bot hands', 'Position splits', 'Sessionized'] },
];

export default function ProductMarketingPage() {
  return (
    <div className="min-h-screen bg-[#0F1115] text-white font-inter">
      <TopNavBar />
      <main className="pt-28 md:pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Data-Driven AI Poker Coaching
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Street-by-street feedback. Personalized leaks. Stats that actually teach you.
            </p>
            <div className="mt-8 max-w-2xl mx-auto">
              <EmailWaitlistForm />
            </div>
            <div className="mt-3 text-xs text-gray-400">Closed beta. Limited invites rolling out.</div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-white/80 bg-white/10 border border-white/10 rounded-full px-3 py-1">30+ stats tracked</span>
              <span className="text-white/80 bg-white/10 border border-white/10 rounded-full px-3 py-1">20+ leaks identified</span>
              <span className="text-white/80 bg-white/10 border border-white/10 rounded-full px-3 py-1">Live & Bot hands</span>
            </div>
          </div>

          {/* Screenshot Tabs */}
          <div className="mb-16">
            <ScreenshotTabsCard tabs={tabs} initialTabId="review" />
          </div>

          {/* Why it works better */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold mb-2">Coach-like feedback at scale</h3>
              <p className="text-gray-300 text-sm">Identify leaks you can’t see alone. Get clear fixes instead of vague charts.</p>
            </div>
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold mb-2">Solvers, translated</h3>
              <p className="text-gray-300 text-sm">We turn solver-backed logic into human language and concepts.</p>
            </div>
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-semibold mb-2">Just play, we track</h3>
              <p className="text-gray-300 text-sm">Hands with friends or bots—stats track in the background.</p>
            </div>
          </div>

          {/* Teaser of Leaks & Metrics */}
          <div className="grid lg:grid-cols-3 gap-6 items-start mb-16">
            <div className="lg:col-span-2 space-y-3">
              <LeakTeaserRow title="Folds Too Much vs Flop C‑Bet" severity="High" description="Fold > 70% when facing flop c‑bets." why="Opponents auto‑profit by barreling you." fix="Defend with top‑pair+, back‑door equity, and occasional raises." />
              <LeakTeaserRow title="Never 3‑Betting" severity="High" description="Overall 3‑bet frequency below 3%." why="You rarely contest pots aggressively." fix="Add value 3‑bets with QQ+/AK and mix suited wheel Aces as bluffs." />
              <LeakTeaserRow title="Spewy Triple‑Barrel" severity="Medium" description="River c‑bet frequency very high." why="Exploitable without nutted range coverage." fix="Select river bluffs carefully; give up on blank rivers." />
            </div>
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold mb-3">Core Metrics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-black/30 rounded-xl border border-white/10 p-3">
                  <span className="text-gray-300 text-sm">VPIP</span>
                  <span className="text-white font-mono">— How often you enter pots</span>
                </div>
                <div className="flex items-center justify-between bg-black/30 rounded-xl border border-white/10 p-3">
                  <span className="text-gray-300 text-sm">PFR</span>
                  <span className="text-white font-mono">— How often you take initiative</span>
                </div>
                <div className="flex items-center justify-between bg-black/30 rounded-xl border border-white/10 p-3">
                  <span className="text-gray-300 text-sm">Aggression Factor</span>
                  <span className="text-white font-mono">— Bets/Raises vs Calls</span>
                </div>
                <div className="flex items-center justify-between bg-black/30 rounded-xl border border-white/10 p-3">
                  <span className="text-gray-300 text-sm">C‑bet (Flop/Turn/River)</span>
                  <span className="text-white font-mono">— Are you balanced?</span>
                </div>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-6">How it works</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                <div className="text-sm text-gray-400 mb-1">Step 1</div>
                <div className="font-semibold">Play Poker</div>
                <div className="text-sm text-gray-300">Live or vs bots</div>
              </div>
              <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                <div className="text-sm text-gray-400 mb-1">Step 2</div>
                <div className="font-semibold">Auto-Track 30+ Stats</div>
                <div className="text-sm text-gray-300">Position & session aware</div>
              </div>
              <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                <div className="text-sm text-gray-400 mb-1">Step 3</div>
                <div className="font-semibold">Review Hands & DNA</div>
                <div className="text-sm text-gray-300">Plain-English insights</div>
              </div>
              <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                <div className="text-sm text-gray-400 mb-1">Step 4</div>
                <div className="font-semibold">Fix Leaks</div>
                <div className="text-sm text-gray-300">Actionable coaching</div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-r from-indigo-600/20 via-fuchsia-600/10 to-transparent rounded-2xl border border-white/10 p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-4 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-2">Closed Beta Access</h3>
                <p className="text-gray-300 text-sm">Join the waitlist to secure an invite as slots open.</p>
              </div>
              <EmailWaitlistForm size="md" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

