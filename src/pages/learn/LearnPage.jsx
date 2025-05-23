import React from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout'; // Assuming this is the correct path

const lessonCategories = [
  { name: 'Fundamentals', description: 'Grasp the basics: rules, hand rankings, and core concepts.', path: 'fundamentals', icon: '📚' },
  { name: 'Plays & Tactics', description: 'Learn specific maneuvers for preflop and postflop.', path: 'plays-tactics', icon: '♟️' },
  { name: 'Poker Math', description: 'Understand odds, equity, and expected value.', path: 'math', icon: '📊' },
  { name: 'Core Concepts', description: 'Explore broader strategic principles and theories.', path: 'concepts', icon: '💡' },
  { name: 'Player Profiling', description: 'Adapt your strategy against different opponent types.', path: 'player-profiling', icon: '🕵️' },
  { name: 'Tournaments', description: 'Master MTTs and SNGs, from early to final table.', path: 'tournaments', icon: '🏆' },
  { name: 'Mental Game', description: 'Conquer tilt, build discipline, and stay focused.', path: 'mental-game', icon: '🧠' },
];

const LearnPage = () => {
  return (
    <PageLayout showNavigation={false}> {/* Assuming we don't want default bottom nav here */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-white">Poker Lesson Library</h1>
        <p className="text-lg text-gray-400 mt-2">Select a category to start your learning journey.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {lessonCategories.map((category) => (
          <Link
            key={category.path}
            to={`/learn/${category.path}`}
            className="block p-6 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-4">{category.icon}</span>
              <h2 className="text-2xl font-bold text-white">{category.name}</h2>
            </div>
            <p className="text-gray-300">{category.description}</p>
          </Link>
        ))}
      </div>
    </PageLayout>
  );
};

export default LearnPage; 