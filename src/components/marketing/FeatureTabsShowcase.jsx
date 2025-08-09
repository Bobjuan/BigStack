import React, { useState } from 'react';
import leaksImage from '../../assets/leaks.png';
import dnaImage from '../../assets/dna.png';

export default function FeatureTabsShowcase() {
  const [activeTab, setActiveTab] = useState('leaks');
  const [expandedImage, setExpandedImage] = useState(null);

  const tabs = [
    { id: 'leaks', label: 'Leak Detection' },
    { id: 'dna', label: 'Poker DNA' },
    { id: 'tracking', label: 'Live Tracking' },
    { id: 'review', label: 'AI Hand Review' },
    { id: 'coach', label: 'P.H.I.L. Chatbot' }
  ];

  const features = {
    leaks: {
      title: 'Advanced Leak Detection',
      description: 'AI identifies exactly where you\'re losing money.',
      image: leaksImage,
      highlights: [
        '30+ specific leaks automatically identified',
        'Severity classification (High/Medium/Low)',
        'Personalized fixes for each leak',
        'Clear explanations in plain English'
      ]
    },
    dna: {
      title: 'Poker DNA Analysis',
      description: 'Visualize your complete playing style across all dimensions.',
      image: dnaImage,
      highlights: [
        'Complete player profile mapping',
        'VPIP vs Aggression Factor visualization',
        'Playing style classification and insights',
        'Session filtering and comparison'
      ]
    },
    tracking: {
      title: 'Some Stats We Track',
      description: 'Just play poker. We capture everything automatically.',
      highlights: [
        '50+ poker statistics tracked automatically',
        'Works with live play and bot practice',
        'Position-aware and session-based tracking',
        'No manual entry required'
      ],
      isStatExample: true,
      statExamples: [
        'VPIP (Voluntarily Put $ In Pot)',
        'PFR (Pre-Flop Raise)',
        '3-bet Frequency',
        'Fold vs C-bet (Flop)',
        'Aggression Factor',
        'WTSD (Went to Showdown)',
      ]
    },
    review: {
      title: 'Street-by-Street Hand Review',
      description: 'Every decision analyzed with solver-backed AI.',
      image: '/images/feature-review.png',
      highlights: [
        'Hero-centric hand analysis',
        'Street-by-street decision breakdown',
        'Plain English explanations',
        'Interactive Q&A with AI coach'
      ]
    },
    coach: {
      title: 'P.H.I.L. AI Coach',
      description: 'Your personal poker coach available 24/7.',
      image: '/images/feature-coach.png',
      highlights: [
        'Natural language poker coaching',
        'Solver-backed strategy advice',
        'Contextual hand discussions',
        'Concept explanations and theory'
      ]
    }
  };

  const currentFeature = features[activeTab];

  const handleImageClick = (imageSrc) => {
    setExpandedImage(imageSrc);
  };

  const closeExpandedImage = () => {
    setExpandedImage(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-indigo-600/20 to-fuchsia-600/20 text-white border border-white/20 backdrop-blur-sm'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:border-white/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feature Content */}
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className={`transition-all duration-500 ${activeTab ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
          <h3 className="text-3xl font-bold mb-4">{currentFeature.title}</h3>
          <p className="text-lg text-gray-300 mb-8">{currentFeature.description}</p>
          
          <ul className="space-y-3">
            {currentFeature.highlights.map((highlight, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-gray-300">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`transition-all duration-500 ${activeTab ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
          {currentFeature.isStatExample ? (
            // Stat examples for tracking tab
            <div className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-6 backdrop-blur-sm">
              <h4 className="text-lg font-semibold mb-4 text-center">Key Stats Tracked</h4>
              <div className="grid grid-cols-2 gap-3">
                {currentFeature.statExamples.map((stat, i) => (
                  <div key={i} className="bg-black/30 rounded-lg p-3 text-center">
                    <div className="font-semibold text-sm text-gray-200">{stat}</div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <span className="text-sm text-gray-400">+ 40 more stats tracked automatically</span>
              </div>
            </div>
          ) : (
            // Screenshot for other tabs
            <div 
              className="relative bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10 p-6 backdrop-blur-sm overflow-hidden cursor-pointer group"
              onClick={() => currentFeature.image && handleImageClick(currentFeature.image)}
            >
              <div className="aspect-video bg-black/30 rounded-xl flex items-center justify-center group-hover:ring-2 group-hover:ring-indigo-500/50 transition-all">
                {currentFeature.image ? (
                  <img 
                    src={currentFeature.image} 
                    alt={currentFeature.title}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-[1.02] transition-transform"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`${currentFeature.image ? 'hidden' : 'flex'} w-full h-full items-center justify-center text-gray-500 text-sm`}>
                  Screenshot: {currentFeature.title}
                </div>
              </div>
              {currentFeature.image && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-2xl">
                  <div className="bg-white/10 backdrop-blur-sm rounded-full p-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Expanded Image Modal */}
      {expandedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={closeExpandedImage}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative max-w-5xl max-h-[90vh] p-4">
            <img 
              src={expandedImage} 
              alt="Expanded view"
              className="w-full h-full object-contain rounded-xl shadow-2xl"
            />
            <button
              onClick={closeExpandedImage}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}