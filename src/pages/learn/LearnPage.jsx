import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';

const LearnPage = () => {
  const categories = [
    {
      title: "Poker Fundamentals",
      description: "Master the basics of poker, from hand rankings to basic strategy.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      link: "/learn/fundamentals"
    },
    {
      title: "Advanced Strategy",
      description: "Take your game to the next level with advanced concepts and techniques.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      link: "/learn/advanced"
    },
    {
      title: "Game Theory",
      description: "Learn the mathematical foundations of optimal poker play.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      link: "/learn/game-theory"
    }
  ];

  return (
    <PageLayout showProfile={true} showNavigation={true}>
      <div className="min-h-screen bg-[#0F1115] text-white font-inter">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold tracking-tight mb-6 text-white">Learn Poker</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Master the game through our comprehensive learning modules, from basic concepts to advanced strategies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.title}
                to={category.link}
                className="group bg-black rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-white/10"
              >
                <div className="flex items-start mb-4">
                  <span className="text-white mr-4">{category.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors duration-200">{category.title}</h2>
                    <p className="text-gray-300 mt-2 group-hover:text-gray-200 transition-colors duration-200">{category.description}</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-sm font-medium">Start Learning</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default LearnPage; 