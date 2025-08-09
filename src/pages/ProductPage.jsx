import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PublicNavBar from '../components/marketing/PublicNavBar';
import Footer from '../components/layout/Footer';
import EmailWaitlistForm from '../components/marketing/EmailWaitlistForm';
import AnimatedStatCard from '../components/marketing/AnimatedStatCard';
import InteractiveLeakCard from '../components/marketing/InteractiveLeakCard';
import FeatureTabsShowcase from '../components/marketing/FeatureTabsShowcase';
import HandReviewExample from '../components/marketing/HandReviewExample';
import FloatingTechBadge from '../components/marketing/FloatingTechBadge';

export default function ProductPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0B0F] text-white font-inter overflow-x-hidden">
      {/* Animated background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ transform: `translateY(${scrollY * 0.2}px)` }} />
        <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s', transform: `translateY(${scrollY * -0.1}px)` }} />
        <div className="absolute bottom-0 left-1/2 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <PublicNavBar />
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            {/* Floating tech badges */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* <FloatingTechBadge text="AI-Powered" delay={0} />
              <FloatingTechBadge text="Solver-Backed" delay={2} />
              <FloatingTechBadge text="Real-Time" delay={4} />
              <FloatingTechBadge text="30+ Stats" delay={6} /> */}
            </div>

            <div id="hero-content" data-animate className={`transition-all duration-1000 ${isVisible['hero-content'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600/20 to-fuchsia-600/20 border border-white/10 backdrop-blur-sm mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                </span>
                <span className="text-sm font-medium">Closed Beta • Limited Access</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6">
                <span className="bg-gradient-to-r from-white via-indigo-200 to-white bg-clip-text text-transparent">
                  Data-Driven AI Poker Coach
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                Just play poker, live or vs bots. We automatically track
                <span className="text-white font-semibold"> 50+ stats</span> in real-time, identify 
                <span className="text-white font-semibold"> 30+ leaks</span>, and our AI coach delivers 
                <span className="text-white font-semibold"> personalized feedback</span> in plain English.
              </p>

              {/* Animated stat counters */}
              <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
                <AnimatedStatCard number={50} label="Stats Tracked" suffix="+" />
                <AnimatedStatCard number={30} label="Identifable Leaks" suffix="+" />
                <AnimatedStatCard number={1000} label="Analyzed Hands" suffix="+" />
              </div>

              <div className="max-w-xl mx-auto">
                <EmailWaitlistForm />
                <p className="text-xs text-gray-400 mt-3">Limited beta access, spots opening soon</p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Feature Showcase - Tabbed */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div id="features-header" data-animate className={`text-center mb-16 transition-all duration-1000 ${isVisible['features-header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Everything You Need to Win More
                </span>
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Professional-grade poker intelligence that works while you play.
              </p>
            </div>

            <FeatureTabsShowcase />
          </div>
        </section>

        {/* Live Leak Finder Demo */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div id="leaks-content" data-animate className={`transition-all duration-1000 ${isVisible['leaks-content'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  We Find Your Leaks.
                  <span className="block text-3xl md:text-4xl mt-2 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                    You Fix Them. Win More.
                  </span>
                </h2>
                <p className="text-lg text-gray-300 mb-8">
                  Our AI analyzes your play across thousands of hands to identify exactly where you're bleeding chips. 
                  Each leak comes with personalized, actionable fixes based on solver-backed strategy.
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">20+ Specific Leaks Tracked</h4>
                      <p className="text-gray-400 text-sm">From preflop to river, we catch everything</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Severity Classification</h4>
                      <p className="text-gray-400 text-sm">Know which leaks to fix first for maximum impact</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Expected Win Rate Impact</h4>
                      <p className="text-gray-400 text-sm">See the bb/100 improvement for each fix</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div id="leaks-examples" data-animate className={`space-y-4 transition-all duration-1000 ${isVisible['leaks-examples'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <InteractiveLeakCard 
                  title="Folds Too Much vs C-Bet"
                  severity="High"
                  stat="Fold vs C-bet: 72%"
                  description="You're folding to continuation bets 72% of the time (optimal: 45-55%)"
                  why="Opponents can print money by c-betting any two cards against you."
                  fix="Defend more with top pair, middle pair, and backdoor draws. Float in position with ace-high and backdoor equity."
                />
                <InteractiveLeakCard 
                  title="Never 3-Betting"
                  severity="High"
                  stat="3-bet: 2.1%"
                  description="Your 3-bet frequency is only 2.1% (optimal: 7-10%)"
                  why="You're leaving value on the table and becoming too predictable."
                  fix="3-bet QQ+/AK for value. Add A5s-A2s and suited broadways as bluffs. Increase from the button."
                />
                <InteractiveLeakCard 
                  title="Spewy River Barrels"
                  severity="Medium"
                  stat="River C-bet: 68%"
                  description="River c-bet frequency way too high at 68% (optimal: 35-45%)"
                  why="You're turning your hand face-up and bleeding chips with bluffs."
                  fix="Only barrel rivers that improve your range. Give up on blank runouts. Use blockers wisely."
                />
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-400">+ 30 more leaks automatically detected</p>
                  <p className="text-xs text-gray-500 mt-1">View all in the app</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hand Review Example */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div id="replay-preview" data-animate className={`transition-all duration-1000 ${isVisible['replay-preview'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                <HandReviewExample />
              </div>
              <div id="replay-content" data-animate className={`transition-all duration-1000 ${isVisible['replay-content'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Street-by-Street
                  <span className="block text-3xl md:text-4xl mt-2 bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
                    AI Hand Analysis
                  </span>
                </h2>
                <p className="text-lg text-gray-300 mb-8">
                  Every hand you play gets broken down by our AI coach. Get instant feedback on your decisions with 
                  solver-backed logic explained in terms you actually understand.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Spot-Specific Advice</h4>
                      <p className="text-gray-400 text-sm">BTN vs BB, 3-bet pots, multiway—we cover it all</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Range-Based Thinking</h4>
                      <p className="text-gray-400 text-sm">Learn to think in ranges, not just your hand</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Interactive Q&A</h4>
                      <p className="text-gray-400 text-sm">Ask why, explore alternatives, understand concepts</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div id="how-it-works" data-animate className={`text-center transition-all duration-1000 ${isVisible['how-it-works'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl md:text-4xl font-bold mb-12">How BigStack Works</h2>
              <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-600/20 to-fuchsia-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">1. Play Poker</h3>
                  <p className="text-gray-400 text-sm">Live games or vs bots—just play normally</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-600/20 to-fuchsia-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">2. We Track</h3>
                  <p className="text-gray-400 text-sm">30+ stats tracked automatically in real-time</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-600/20 to-fuchsia-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">3. AI Analyzes</h3>
                  <p className="text-gray-400 text-sm">Identify leaks and review hands with P.H.I.L.</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-600/20 to-fuchsia-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">4. You Improve</h3>
                  <p className="text-gray-400 text-sm">Fix leaks, make better decisions, win more</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div id="cta-content" data-animate className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600/20 via-fuchsia-600/20 to-transparent border border-white/10 p-8 md:p-12 backdrop-blur-sm transition-all duration-1000 ${isVisible['cta-content'] ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-fuchsia-600/10 animate-pulse" />
              <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  Ready to Level Up Your Game?
                </h2>
                <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join the closed beta and be among the first to experience poker coaching reimagined. 
                  Limited spots available.
                </p>
                <div className="max-w-md mx-auto">
                  <EmailWaitlistForm size="lg" />
                  <p className="text-xs text-gray-400 mt-3">
                    No credit card required • Instant access when spots open
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}