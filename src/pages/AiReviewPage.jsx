import React, { useState, useEffect } from 'react';
import RandomQuestionsChat from '../components/ai-review/RandomQuestionsChat';
import '../components/ai-review/PokerChatbot.css';
import TopNavBar from '../components/layout/TopNavBar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AiReviewPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <TopNavBar />
      
      <div className="min-h-screen w-full bg-[#0F1115] text-white relative overflow-y-auto pt-20">
        {/* Background gradient effects */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[5%] left-[5%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[5%] right-[5%] w-[25vw] h-[25vw] max-w-[350px] max-h-[350px] bg-fuchsia-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 w-full px-2 md:px-20 pb-8 pt-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center" style={{paddingLeft: '0.5rem', paddingRight: '0.5rem'}}>
            <div className="chip-circle w-24 h-24 rounded-full chip-3d flex items-center justify-center">
              <img 
                src="/images/shark.png" 
                alt="P.H.I.L." 
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">
              P.H.I.L.
            </h1>
            <p className="text-gray-400 text-lg">
              Poker Hands Intuitive Language
            </p>
          </div>
        </div>

        {/* Main Chat Section with Quick Tips on the right */}
        <div className="flex flex-col md:flex-row gap-5 mb-8 px-1 md:px-2">
          {/* Chat Bot area (left) */}
          <div className="flex-1 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden">
            <div className="p-3 md:p-4 lg:p-5 xl:p-6">
              <RandomQuestionsChat />
            </div>
          </div>
          {/* Quick Tips Card (right) */}
          <div className="hidden md:block self-start" style={{minWidth: '260px', maxWidth: '340px'}}>
            <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm rounded-2xl border border-gray-700/50 shadow-2xl p-4">
              <h3 className="text-xl font-semibold text-white mb-4">
                Quick Tips from P.H.I.L.
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300 text-sm">Be specific with your questions for better, more actionable advice.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300 text-sm">Include context like position, stack sizes, and opponent tendencies.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300 text-sm">Ask follow-up questions to dive deeper into specific concepts.</p>
                </div>
              </div>
            </div>
          </div>
        </div>





        {/* Additional P.H.I.L. Integration Info */}
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            P.H.I.L. is Everywhere in BigStack
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
              <h4 className="font-semibold text-blue-400 mb-2">🎮 Game Tables</h4>
              <p className="text-gray-300 text-sm">Get real-time coaching and hand analysis while playing at our poker tables.</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
              <h4 className="font-semibold text-purple-400 mb-2">📚 Learning Modules</h4>
              <p className="text-gray-300 text-sm">P.H.I.L. provides personalized explanations and examples throughout your learning journey.</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
              <h4 className="font-semibold text-emerald-400 mb-2">🎯 Practice Scenarios</h4>
              <p className="text-gray-300 text-sm">Receive detailed feedback and strategy tips on practice hands and scenarios.</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
              <h4 className="font-semibold text-amber-400 mb-2">📊 Progress Tracking</h4>
              <p className="text-gray-300 text-sm">P.H.I.L. analyzes your progress and suggests targeted improvements based on your stats.</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
    </>
  );
};

export default AiReviewPage; 