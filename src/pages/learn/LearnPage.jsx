import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LearnPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [learningGoals] = useState({
    weekly: { target: 5, completed: 0, description: "Complete 5 lessons this week" },
    monthly: { target: 20, completed: 0, description: "Master 20 concepts this month" }
  });

  // Course structure with lessons
  const [courses] = useState([
    {
      id: 'cash-game-foundations',
      title: 'Foundations for Winning Cash Games',
      level: 'Beginner to Intermediate',
      description: 'Master the essential concepts and strategies needed to become a winning cash game player. This comprehensive course covers everything from basic fundamentals to advanced concepts.',
      totalLessons: 27,
      completedLessons: 0,
      estimatedTime: '8-10 hours',
      color: 'from-blue-500 to-blue-700',
      modules: [
        {
          id: 'module-0',
          title: 'Foundations for Winning Poker',
          description: 'Build a strong foundation for your poker journey with essential concepts and mindset',
          lessons: [
            {
              id: 'found-0-1',
              title: 'Course Introduction & Your Poker Development',
              content: `Target Audience & Course Goals:
• This course is designed for players with some poker experience who want to improve their small stakes cash game results
• Primary aim: Develop skills to beat small stakes cash games and progress to middle stakes
• Focus on practical strategies that work in real games

The Core Philosophy - How You Win in Small Stakes:
• Profit comes from exploiting opponents' mistakes
• Small stakes games are highly profitable due to weak average players
• Focus on exploitative play rather than GTO strategies

Unlearning Bad Habits & Adopting Effective Strategies:
• Move beyond overly tight play
• Learn to adapt your strategy based on opponents
• Example: A-J on the button
  - Against tight players: Fold
  - Against active players: Call
  - Against wild players: Reraise for value`,
              completed: false
            },
            {
              id: 'found-0-2',
              title: 'Self-Assessment: Your Current Cash Game Understanding',
              content: `Purpose of Self-Assessment:
• Quick evaluation of your current knowledge
• Identify areas needing improvement
• Track progress throughout the course

Interactive Quiz Features:
• 10 questions covering key concepts
• Immediate feedback on answers
• Links to relevant course sections
• Topics include:
  - Opponent categorization
  - Preflop strategy
  - Postflop play
  - Bankroll management
  - Mental game

Take the quiz before starting the course and retake it after completion to measure your improvement.`,
              completed: false
            },
            {
              id: 'found-0-3',
              title: 'Essential Mindset & Bankroll Prerequisites',
              content: `Bankroll Requirements:
• Minimum 2,500 big blinds for stability
• Example: $5,000 for $1/$2 games
• Proper bankroll management is crucial for long-term success

The Critical Role of Mindset:
• Develop a strong mental game
• Handle variance and bad beats
• Maintain focus and discipline

Source of Profit:
• Primary profit comes from exploiting opponents' mistakes
• "If you ever hear someone say 'I would win if my opponents would stop making bad plays,' they are clearly unaware of this most basic concept."
• Focus on identifying and capitalizing on opponent errors`,
              completed: false
            }
          ]
        },
        {
          id: 'module-1',
          title: 'Cash Game Fundamentals',
          description: 'Learn the core concepts that separate winning players from losing ones',
          lessons: [
            {
              id: 'fund-1',
              title: 'Understanding Cash Games vs Tournaments',
              content: 'Learn the key differences between cash games and tournaments, and why cash games require a different mindset...',
              completed: false
            },
            {
              id: 'fund-2',
              title: 'Bankroll Management',
              content: 'Master proper bankroll management techniques to ensure long-term success...',
              completed: false
            },
            {
              id: 'fund-3',
              title: 'Table Selection',
              content: 'Learn how to identify profitable tables and avoid tough games...',
              completed: false
            }
          ]
        },
        {
          id: 'module-2',
          title: 'Preflop Strategy',
          description: 'Develop a solid preflop game plan',
          lessons: [
            {
              id: 'pre-1',
              title: 'Starting Hand Selection',
              content: 'Learn which hands to play from different positions...',
              completed: false
            },
            {
              id: 'pre-2',
              title: 'Position and Hand Ranges',
              content: 'Understand how position affects your hand ranges...',
              completed: false
            },
            {
              id: 'pre-3',
              title: '3-Betting Strategy',
              content: 'Master the art of 3-betting for value and as a bluff...',
              completed: false
            }
          ]
        },
        {
          id: 'module-3',
          title: 'Postflop Play',
          description: 'Learn to navigate complex postflop situations',
          lessons: [
            {
              id: 'post-1',
              title: 'Board Texture Analysis',
              content: 'Learn to read board textures and their implications...',
              completed: false
            },
            {
              id: 'post-2',
              title: 'Bet Sizing',
              content: 'Master optimal bet sizing for different situations...',
              completed: false
            },
            {
              id: 'post-3',
              title: 'Hand Reading',
              content: 'Develop your hand reading skills to make better decisions...',
              completed: false
            }
          ]
        },
        {
          id: 'module-4',
          title: 'Advanced Concepts',
          description: 'Take your game to the next level',
          lessons: [
            {
              id: 'adv-1',
              title: 'Exploitative Play',
              content: 'Learn to identify and exploit opponent weaknesses...',
              completed: false
            },
            {
              id: 'adv-2',
              title: 'Multi-Street Planning',
              content: 'Develop strategies that span multiple betting rounds...',
              completed: false
            },
            {
              id: 'adv-3',
              title: 'Mental Game',
              content: 'Master the psychological aspects of poker...',
              completed: false
            }
          ]
        }
      ]
    }
  ]);

  const handleCourseClick = (course) => {
    navigate(`/learn/course/${course.id}`);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'text-green-400 bg-green-900/20';
      case 'Intermediate': return 'text-blue-400 bg-blue-900/20';
      case 'Advanced': return 'text-red-400 bg-red-900/20';
      case 'Beginner to Intermediate': return 'text-blue-400 bg-blue-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className={`bg-[#1a1a1a] transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'} min-h-screen flex flex-col fixed left-0 top-0`}>
        <div className="pt-10">
          <div className={`px-4 ${!isSidebarOpen && 'flex justify-center'}`}>
            <div className={`flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'} mb-6`}>
              <h1 className={`text-3xl md:text-4xl font-bold text-white ${!isSidebarOpen && 'hidden'}`}>BigStack</h1>
              <button 
                onClick={() => setSidebarOpen(!isSidebarOpen)} 
                className="text-gray-400 hover:text-white transition-colors"
              >
                {isSidebarOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div className={`border-t-2 border-gray-600 ${isSidebarOpen ? '-mt-1' : 'mt-3'}`}></div>
        </div>

        <nav className="flex-1 p-4">
          <Link 
            to="/play" 
            className={`flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'} mb-6 py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors text-xl font-bold border-2 border-white hover:shadow-lg hover:shadow-indigo-500/40`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {isSidebarOpen && <span className="ml-3">Play</span>}
          </Link>
          
          <Link 
            to="/learn/practice" 
            className={`flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'} mb-6 py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors text-xl font-bold text-green-400 border-2 border-green-400 hover:shadow-lg hover:shadow-green-500/40`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            {isSidebarOpen && <span className="ml-3">Practice</span>}
          </Link>
          
          <Link 
            to="/learn" 
            className={`flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'} mb-6 py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors text-xl font-bold hover:shadow-lg hover:shadow-indigo-500/40`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className={`ml-3 ${!isSidebarOpen && 'hidden'}`}>Learn</span>
          </Link>
          
          <Link 
            to="/quiz" 
            className={`flex items-center ${isSidebarOpen ? 'justify-start' : 'justify-center'} mb-6 py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors text-xl font-bold hover:shadow-lg hover:shadow-indigo-500/40`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`ml-3 ${!isSidebarOpen && 'hidden'}`}>Quiz</span>
          </Link>
        </nav>

        <div className="p-4 space-y-3">
          <Link
            to="/dashboard"
            className={`flex items-center ${isSidebarOpen ? 'justify-start w-full' : 'justify-center w-full'} py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors text-xl font-bold hover:shadow-lg hover:shadow-indigo-500/40`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className={`ml-3 ${!isSidebarOpen && 'hidden'}`}>Home</span>
          </Link>

          <Link
            to="/profile"
            className={`flex items-center ${isSidebarOpen ? 'justify-start w-full' : 'justify-center w-full'} py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors text-xl font-bold hover:shadow-lg hover:shadow-indigo-500/40`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className={`ml-3 ${!isSidebarOpen && 'hidden'}`}>Profile</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Dashboard Header */}
        <div className="bg-black py-8 px-8 border-b-2 border-white">
          <h2 className="text-3xl font-bold text-white mt-4 -mb-4">
            Learning Dashboard
          </h2>
        </div>

        <div className="py-8 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Learning Goals Section */}
            <div className="mb-8">
              <div className="bg-[#1F2127] rounded-xl p-4">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  Learning Goals
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Weekly Goal */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-300 text-sm">Weekly Goal</span>
                      <span className="text-xs text-gray-400">{learningGoals.weekly.completed}/{learningGoals.weekly.target}</span>
                    </div>
                    <div className="h-2 bg-[#2a2d36] rounded-full overflow-hidden border border-gray-700">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700 transition-all duration-500"
                        style={{ width: `${(learningGoals.weekly.completed / learningGoals.weekly.target) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1 mb-2">{learningGoals.weekly.description}</p>
                    {learningGoals.weekly.completed >= learningGoals.weekly.target && (
                      <span className="text-green-400 text-xs font-medium">✓ Weekly Goal Completed!</span>
                    )}
                  </div>

                  {/* Monthly Goal */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-300 text-sm">Monthly Goal</span>
                      <span className="text-xs text-gray-400">{learningGoals.monthly.completed}/{learningGoals.monthly.target}</span>
                    </div>
                    <div className="h-2 bg-[#2a2d36] rounded-full overflow-hidden border border-gray-700">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-700 transition-all duration-500"
                        style={{ width: `${(learningGoals.monthly.completed / learningGoals.monthly.target) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1 mb-2">{learningGoals.monthly.description}</p>
                    {learningGoals.monthly.completed >= learningGoals.monthly.target && (
                      <span className="text-green-400 text-xs font-medium">✓ Monthly Goal Completed!</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Courses Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Poker Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course) => {
                  const totalLessons = course.modules.reduce((sum, module) => sum + module.lessons.length, 0);
                  const completedLessons = course.modules.reduce((sum, module) => 
                    sum + module.lessons.filter(lesson => lesson.completed).length, 0
                  );
                  const progress = Math.round((completedLessons / totalLessons) * 100) || 0;

                  return (
                    <div
                      key={course.id}
                      onClick={() => handleCourseClick(course)}
                      className="bg-[#1F2127] rounded-xl p-6 hover:bg-[#252831] transition-all cursor-pointer transform hover:scale-105"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-white mb-2">{course.title}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                            {course.level}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">{progress}%</div>
                          <div className="text-sm text-gray-400">Complete</div>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mb-4">{course.description}</p>
                      
                      <div className="mb-4">
                        <div className="h-2 bg-[#2a2d36] rounded-full overflow-hidden border border-gray-700">
                          <div 
                            className={`h-full bg-gradient-to-r ${course.color} transition-all duration-500`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>{completedLessons}/{totalLessons} lessons</span>
                        <span>{course.estimatedTime}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;