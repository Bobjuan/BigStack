import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';

const playerProfilingLessons = [
  { id: 'straightforward-loose-passive', title: 'Straightforward Loose Passive', description: 'Identify and exploit players who call too often and rarely bet or raise.', icon: '🎣' },
  { id: 'maniacal-loose-aggressive', title: 'Maniacal Loose Aggressive (LAG)', description: 'Learn to counter players who play many hands aggressively.', icon: '💥' },
  { id: 'weak-tight-passive', title: 'Weak Tight Passive (Nit)', description: 'Understand how to play against overly cautious and passive opponents.', icon: '🛡️' },
  { id: 'straightforward-tight-aggressive', title: 'Straightforward Tight Aggressive (TAG)', description: 'Strategies for playing against solid, aggressive regulars.', icon: '⚖️' },
  { id: 'good-tight-aggressive', title: 'Good Tight Aggressive (Good TAG)', description: 'Face intelligent TAGs who understand relative hand values and apply pressure smartly.', icon: '🎓' },
  { id: 'calling-station', title: 'Calling Station', description: 'Exploit players who rarely fold and call down with a wide range of hands.', icon: '💰' },
];

// Placeholder for other categories' lessons
const getLessonsForCategory = (categoryName) => {
  if (categoryName === 'player-profiling') {
    return playerProfilingLessons;
  }
  return []; // Return empty array for other categories for now
};

const LessonCategoryPage = () => {
  const { categoryName } = useParams();
  const lessons = getLessonsForCategory(categoryName);

  const formattedCategoryName = categoryName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <PageLayout showProfile={true} showNavigation={true}>
      <div className="mb-6">
        <Link 
          to="/learn"
          className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Lesson Library
        </Link>
      </div>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-white">{formattedCategoryName}</h1>
        {lessons.length === 0 && (
          <p className="text-lg text-gray-400 mt-2">Lessons for this category are coming soon!</p>
        )}
      </div>

      {lessons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {lessons.map(lesson => (
            <Link
              key={lesson.id}
              to={`/learn/${categoryName}/${lesson.id}`}
              className="block p-6 bg-gray-800 rounded-xl shadow-md hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">{lesson.icon}</span>
                <h2 className="text-xl font-semibold text-white">{lesson.title}</h2>
              </div>
              <p className="text-gray-400 text-sm">{lesson.description}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center">
            <div className="animate-pulse text-6xl mb-8">🚧</div>
            <Link 
              to="/learn"
              className="inline-block px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Back to Lesson Library
            </Link>
        </div>
      )}
    </PageLayout>
  );
};

export default LessonCategoryPage; 