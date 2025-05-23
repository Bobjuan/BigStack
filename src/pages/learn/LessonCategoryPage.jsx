import React from 'react';
import { Link, useParams } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';

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
    title: 'What is Texas Hold\'em?', 
    description: 'Learn the basic rules and structure of the most popular poker variant.', 
    icon: '🎮' 
  },
  { 
    id: 'hand-rankings', 
    title: 'Hand Rankings', 
    description: 'Master the hierarchy of poker hands from high card to royal flush.', 
    icon: '🃏' 
  },
  { 
    id: 'positions-and-blinds', 
    title: 'Positions and Blinds', 
    description: 'Understand table positions and the role of blinds in poker.', 
    icon: '🎯' 
  },
  { 
    id: 'basic-strategy', 
    title: 'Basic Strategy', 
    description: 'Learn fundamental concepts to start winning at poker.', 
    icon: '📚' 
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
  const { categoryId } = useParams();
  const lessons = getLessonsForCategory(categoryId);

  const formatCategoryName = (name) => {
    return name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <PageLayout showProfile={true} showNavigation={true}>
      <div className="max-w-6xl mx-auto px-4 py-12 bg-black">
        <div className="mb-8">
          <Link
            to="/learn"
            className="inline-flex items-center px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Lesson Library
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight mb-6 text-white">{formatCategoryName(categoryId)}</h1>
          {lessons.length === 0 && (
            <p className="text-xl text-gray-400">Lessons for this category are coming soon!</p>
          )}
        </div>

        {lessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {lessons.map(lesson => (
              <Link
                key={lesson.id}
                to={`/learn/${categoryId}/${lesson.id}`}
                className="group bg-black rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div className="flex items-start mb-4">
                  <span className="text-3xl mr-4">{lesson.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors duration-200">{lesson.title}</h2>
                    <p className="text-gray-300 mt-2 group-hover:text-gray-200 transition-colors duration-200">{lesson.description}</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-sm font-medium">Start Lesson</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <div className="animate-pulse text-6xl mb-8">🚧</div>
            <Link
              to="/learn"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/20 text-lg font-medium"
            >
              Back to Lesson Library
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default LessonCategoryPage; 