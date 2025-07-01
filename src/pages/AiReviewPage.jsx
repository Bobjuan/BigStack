import React, { useState } from 'react';
import RandomQuestionsChat from '../components/ai-review/RandomQuestionsChat';
import HandReviewChat from '../components/ai-review/HandReviewChat';
import '../components/ai-review/PokerChatbot.css';
import TopNavBar from '../components/layout/TopNavBar';
import Footer from '../components/layout/Footer';

const AiReviewPage = () => {
  const [activeTab, setActiveTab] = useState('random');

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
        </div>
        <div className="bg-[#23273a] rounded-lg shadow-lg p-4 border border-gray-700">
          {activeTab === 'random' ? <RandomQuestionsChat /> : <HandReviewChat />}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AiReviewPage; 