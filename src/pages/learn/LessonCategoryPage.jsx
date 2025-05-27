import React from 'react';
import { Link, useParams } from 'react-router-dom';

const playerProfilingLessons = [
  { id: 'straightforward-loose-passive', title: 'Straightforward Loose Passive', description: 'Identify and exploit players who call too often and rarely bet or raise.', icon: '🎣' },
  { id: 'maniacal-loose-aggressive', title: 'Maniacal Loose Aggressive (LAG)', description: 'Learn to counter players who play many hands aggressively.', icon: '💥' },
  { id: 'weak-tight-passive', title: 'Weak Tight Passive (Nit)', description: 'Understand how to play against overly cautious and passive opponents.', icon: '🛡️' },
  { id: 'straightforward-tight-aggressive', title: 'Straightforward Tight Aggressive (TAG)', description: 'Strategies for playing against solid, aggressive regulars.', icon: '⚖️' },
  { id: 'good-tight-aggressive', title: 'Good Tight Aggressive (Good TAG)', description: 'Face intelligent TAGs who understand relative hand values and apply pressure smartly.', icon: '🎓' },
  { id: 'calling-station', title: 'Calling Station', description: 'Exploit players who rarely fold and call down with a wide range of hands.', icon: '💰' },
];

const fundamentalsLessons = [
  {
    id: 'what-is-texas-holdem',
    title: "What is Texas Hold'em?",
    description: "Learn the basic rules and structure of the most popular poker variant.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  {
    id: 'hand-rankings',
    title: "Hand Rankings",
    description: "Master the hierarchy of poker hands from high card to royal flush.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: 'positions-and-blinds',
    title: "Positions and Blinds",
    description: "Understand the importance of position and how blinds work in poker.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    id: 'basic-strategy',
    title: "Basic Strategy",
    description: "Learn fundamental strategies for playing winning poker.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  }
];

const advancedStrategyLessons = [
  { 
    id: 'preflop-strategy', 
    title: 'Preflop Strategy', 
    description: 'Master the art of hand selection and preflop play.', 
    icon: '🎲' 
  },
  { 
    id: 'postflop-play', 
    title: 'Postflop Play', 
    description: 'Learn advanced concepts for playing after the flop.', 
    icon: '🎯' 
  },
  { 
    id: 'bet-sizing', 
    title: 'Bet Sizing', 
    description: 'Understand how to size your bets for maximum value.', 
    icon: '💰' 
  },
  { 
    id: 'board-texture', 
    title: 'Board Texture', 
    description: 'Learn to read and exploit different board textures.', 
    icon: '🎨' 
  }
];

const gameTheoryLessons = [
  { 
    id: 'what-is-gto', 
    title: 'What is GTO?', 
    description: 'Introduction to Game Theory Optimal poker strategy.', 
    icon: '🧮' 
  },
  { 
    id: 'range-construction', 
    title: 'Range Construction', 
    description: 'Learn how to build balanced ranges for different situations.', 
    icon: '📊' 
  },
  { 
    id: 'equity-realization', 
    title: 'Equity Realization', 
    description: 'Understand how to maximize your hand\'s equity.', 
    icon: '📈' 
  },
  { 
    id: 'icm-considerations', 
    title: 'ICM Considerations', 
    description: 'Learn about Independent Chip Model in tournament play.', 
    icon: '🎯' 
  }
];

// Get lessons for the specified category
const getLessonsForCategory = (categoryName) => {
  switch (categoryName) {
    case 'fundamentals':
      return fundamentalsLessons;
    case 'advanced':
      return advancedStrategyLessons;
    case 'game-theory':
      return gameTheoryLessons;
    case 'player-profiling':
    return playerProfilingLessons;
    default:
      return [];
  }
};

const LessonCategoryPage = () => {
  const { categoryName } = useParams();
  const lessons = getLessonsForCategory(categoryName);

  const formatCategoryName = (name) => {
    return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/learn" className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Lesson Library
        </Link>
      </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-white">{formatCategoryName(categoryName)}</h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Master the essential concepts and strategies to improve your game.
          </p>
      </div>

      {lessons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {lessons.map((lesson) => (
            <Link
              key={lesson.id}
              to={`/learn/${categoryName}/${lesson.id}`}
                className="group bg-white rounded-xl p-5 sm:p-6 border border-white/10 hover:border-indigo-400/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-400/10"
            >
                <div className="flex items-start mb-3">
                  <span className="text-[#0F1115] mr-3">{lesson.icon}</span>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#0F1115] group-hover:text-indigo-600 transition-colors duration-200">{lesson.title}</h2>
                    <p className="text-gray-600 mt-1 text-sm group-hover:text-gray-700 transition-colors duration-200">{lesson.description}</p>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 flex items-center text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-sm font-medium">Start Lesson</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
              </div>
            </Link>
          ))}
        </div>
      ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🚧</div>
            <h2 className="text-2xl font-bold text-white mb-2">Coming Soon!</h2>
            <p className="text-gray-400">We're working hard to bring you more lessons. Check back soon!</p>
        </div>
      )}
      </div>
    </div>
  );
};

export default LessonCategoryPage; 