import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PreLaunchPage = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleAccessProduct = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === 'bigstackcool!') {
      localStorage.setItem('bigstack_access', 'granted');
      navigate('/welcome');
    } else {
      setPasswordError('Incorrect password');
      setPassword('');
    }
  };

  const ProductCard = ({ title, description, features, comingSoon = false, delay = 0 }) => (
    <div 
      className={`transform transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} bg-[#2f3542] rounded-2xl p-8 hover:bg-[#3a4052] hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {comingSoon && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          COMING SOON
        </div>
      )}
      
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
        <p className="text-gray-300 mb-6 leading-relaxed">{description}</p>
        
        {/* Placeholder for GIF */}
        <div className="w-full h-48 bg-[#1b1f2b] rounded-lg mb-6 border-2 border-dashed border-gray-600 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Product Demo GIF</span>
        </div>
        
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-300">
              <svg className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F1115] text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-blue-500/10 to-cyan-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="flex justify-between items-center p-6 md:p-8">
          <div className="text-2xl font-bold">BigStack</div>
          <button
            onClick={handleAccessProduct}
            className="px-6 py-2 bg-white text-[#0F1115] rounded-full font-medium hover:bg-gray-200 transition-colors duration-200"
          >
            Access Product
          </button>
        </header>

        {/* Hero Section */}
        <section className="px-6 md:px-8 py-20 md:py-32 text-center">
          <div className={`transform transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} max-w-6xl mx-auto`}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent leading-tight">
              The Future of Poker Training is Here
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              The first-ever poker training platform powered by advanced AI. No more antiquated study methods. 
              Learn by doing with intelligent, readable feedback that actually makes sense.
            </p>
            
            {/* Value Proposition */}
            <div className="bg-[#2f3542]/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 mb-16 border border-gray-700/50">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">Why BigStack Changes Everything</h2>
              <div className="grid md:grid-cols-3 gap-8 text-left">
                <div>
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Learn by Doing</h3>
                  <p className="text-gray-300">Solvers don't tell the full story. Get hands-on experience with real-time AI coaching that explains the 'why' behind every decision.</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Intelligent Feedback</h3>
                  <p className="text-gray-300">Our LLM doesn't just show you charts. It translates complex solver data into clear, actionable English that you can actually understand and apply.</p>
                </div>
                <div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Track Everything</h3>
                  <p className="text-gray-300">30+ advanced metrics tracked automatically. No manual input required. Get insights that even the pros use to improve their game.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={handleAccessProduct}
                className="px-8 py-4 text-lg font-medium text-[#0F1115] bg-white rounded-full transition-all duration-200 hover:-translate-y-1 hover:bg-gray-200 hover:shadow-2xl hover:shadow-indigo-500/30"
              >
                Get Early Access
              </button>
              <button className="px-8 py-4 text-lg font-medium text-white border-2 border-white rounded-full transition-all duration-200 hover:-translate-y-1 hover:bg-white hover:text-[#0F1115] hover:shadow-2xl hover:shadow-indigo-500/30">
                Watch Demo
              </button>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="px-6 md:px-8 py-20">
          <div className="max-w-7xl mx-auto">
            <div className={`transform transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} text-center mb-16`}>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Revolutionary Training Tools</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Four cutting-edge products that will transform how you learn and master poker.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <ProductCard
                title="AI Player Type Evaluation"
                description="Our specialized LLM analyzes your playing style with unprecedented accuracy. Get personalized insights that go beyond basic stats to understand your poker DNA."
                features={[
                  "Advanced behavioral pattern recognition",
                  "Personalized leak detection and fixes",
                  "Style classification with improvement paths",
                  "Custom training recommendations"
                ]}
                delay={200}
              />

              <ProductCard
                title="Hand & Spot Analysis"
                description="Deep-dive into every decision with AI-powered hand reviews. Like having a world-class coach explain each spot in plain English."
                features={[
                  "Street-by-street breakdown analysis",
                  "30+ advanced metrics tracking",
                  "Solver-backed recommendations",
                  "Interactive hand replayer"
                ]}
                delay={400}
              />

              <ProductCard
                title="Social Poker Platform"
                description="Play with friends like never before. See real-time stats, track games, and compete in a social environment designed for improvement."
                features={[
                  "Real-time friend stats visibility",
                  "Game history and progress tracking",
                  "Social leaderboards and achievements",
                  "Enhanced multiplayer experience"
                ]}
                delay={600}
              />

              <ProductCard
                title="Advanced Training Modules"
                description="Comprehensive learning system with interactive lessons, practice scenarios, and progressive skill building."
                features={[
                  "Interactive scenario training",
                  "Progressive difficulty adjustment",
                  "Video lessons with AI integration",
                  "Comprehensive progress tracking"
                ]}
                comingSoon={true}
                delay={800}
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 md:px-8 py-20 text-center">
          <div className={`transform transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} max-w-4xl mx-auto`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Revolutionize Your Game?</h2>
            <p className="text-xl text-gray-300 mb-12">
              Join the future of poker training. Get early access and be among the first to experience AI-powered poker coaching.
            </p>
            <button
              onClick={handleAccessProduct}
              className="px-12 py-6 text-xl font-medium text-[#0F1115] bg-gradient-to-r from-indigo-400 to-purple-500 hover:from-indigo-500 hover:to-purple-600 rounded-full transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/30"
            >
              Request Early Access
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 md:px-8 py-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold mb-4 md:mb-0">BigStack</div>
            <div className="text-gray-400 text-center md:text-right">
              <p>© 2024 BigStack Poker. All rights reserved.</p>
              <p className="mt-2">The future of poker training starts here.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#2f3542] rounded-2xl p-8 max-w-md w-full border border-gray-700">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Early Access</h3>
              <p className="text-gray-300">Enter the access code to continue</p>
            </div>
            
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                placeholder="Enter access code"
                className="w-full px-4 py-3 bg-[#1b1f2b] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 mb-4"
                autoFocus
              />
              
              {passwordError && (
                <p className="text-red-400 text-sm mb-4">{passwordError}</p>
              )}
              
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPassword('');
                    setPasswordError('');
                  }}
                  className="flex-1 px-4 py-3 text-gray-300 border border-gray-600 rounded-lg hover:bg-[#1b1f2b] transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-colors duration-200"
                >
                  Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreLaunchPage; 