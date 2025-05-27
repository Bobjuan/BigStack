import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';

const LearnPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [profile, setProfile] = useState(null);
  const [dailyChallenge, setDailyChallenge] = useState({
    title: "Position Play Challenge",
    description: "You're in the cutoff with A♠K♦. UTG raises 3x. What's your best play?",
    options: ["Fold", "Call", "3-bet", "All-in"],
    completed: false
  });
  const [learningGoals, setLearningGoals] = useState({
    weekly: { target: 5, completed: 2, description: "Complete 5 lessons this week" },
    monthly: { target: 20, completed: 8, description: "Master 20 concepts this month" }
  });

  // Course structure
  const [courses, setCourses] = useState([
    {
      id: 'fundamentals',
      title: 'Poker Fundamentals',
      level: 'Beginner',
      description: 'Master the basics of Texas Hold\'em',
      progress: 65,
      totalLessons: 12,
      completedLessons: 8,
      estimatedTime: '2-3 hours',
      color: 'from-green-500 to-green-700'
    },
    {
      id: 'position-play',
      title: 'Position-Based Strategy',
      level: 'Intermediate',
      description: 'Learn how position affects every decision',
      progress: 30,
      totalLessons: 8,
      completedLessons: 2,
      estimatedTime: '1-2 hours',
      color: 'from-blue-500 to-blue-700'
    },
    {
      id: 'player-profiling',
      title: 'Player Profiling',
      level: 'Intermediate',
      description: 'Identify and exploit opponent tendencies',
      progress: 0,
      totalLessons: 6,
      completedLessons: 0,
      estimatedTime: '1 hour',
      color: 'from-purple-500 to-purple-700'
    },
    {
      id: 'gto-concepts',
      title: 'GTO Fundamentals',
      level: 'Advanced',
      description: 'Game theory optimal play concepts',
      progress: 10,
      totalLessons: 10,
      completedLessons: 1,
      estimatedTime: '3-4 hours',
      color: 'from-red-500 to-red-700'
    }
  ]);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (user) {
      getProfile();
    }
  }, [user]);

  const handleCourseClick = (course) => {
    console.log('Navigating to course:', course.id);
    console.log('Full course object:', course);
    navigate(`/learn/course/${course.id}`);
  };

  const completeDailyChallenge = () => {
    setDailyChallenge(prev => ({ ...prev, completed: true }));
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'text-green-400 bg-green-900/20';
      case 'Intermediate': return 'text-blue-400 bg-blue-900/20';
      case 'Advanced': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Collapsible Sidebar - EXACT SAME as Dashboard */}
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
            <span className={`ml-3 ${!isSidebarOpen && 'hidden'}`}>Play</span>
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

          <button
            onClick={handleLogout}
            className={`flex items-center ${isSidebarOpen ? 'justify-start w-full' : 'justify-center w-full'} py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors text-xl font-bold hover:shadow-lg hover:shadow-indigo-500/40`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className={`ml-3 ${!isSidebarOpen && 'hidden'}`}>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Right Menu (visible when sidebar is collapsed) */}
        {!isSidebarOpen && (
          <div className="fixed top-4 right-4 flex items-center space-x-4">
            <Link
              to="/profile"
              className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors hover:shadow-lg hover:shadow-indigo-500/40"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors hover:shadow-lg hover:shadow-indigo-500/40"
            >
              Logout
            </button>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="bg-black py-8 px-8 border-b-2 border-white">
          <h2 className="text-3xl font-bold text-white mt-4 -mb-4">
            {profile?.username || 'Anonymous Player'}'s {!isSidebarOpen && 'BigStack '}Learning Dashboard
          </h2>
        </div>

        <div className="py-8 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Daily Challenge & Learning Goals Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
              {/* Daily Challenge */}
              <div className="bg-[#1F2127] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Daily Challenge
                  </h3>
                  {dailyChallenge.completed && (
                    <span className="text-green-400 text-sm font-medium">✓ Completed</span>
                  )}
                </div>
                <h4 className="text-lg font-semibold text-indigo-300 mb-2">{dailyChallenge.title}</h4>
                <p className="text-gray-300 mb-4">{dailyChallenge.description}</p>
                <div className="space-y-2 mb-4">
                  {dailyChallenge.options.map((option, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-3 rounded-lg bg-[#2a2d36] hover:bg-gray-700 transition-colors text-gray-300"
                      disabled={dailyChallenge.completed}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {!dailyChallenge.completed && (
                  <button
                    onClick={completeDailyChallenge}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Submit Answer
                  </button>
                )}
              </div>

              {/* Learning Goals */}
              <div className="bg-[#1F2127] rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  Learning Goals
                </h3>
                
                {/* Weekly Goal */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Weekly Goal</span>
                    <span className="text-sm text-gray-400">{learningGoals.weekly.completed}/{learningGoals.weekly.target}</span>
                  </div>
                  <div className="h-3 bg-[#2a2d36] rounded-full overflow-hidden border border-gray-700">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700 transition-all duration-500"
                      style={{ width: `${(learningGoals.weekly.completed / learningGoals.weekly.target) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{learningGoals.weekly.description}</p>
                </div>

                {/* Monthly Goal */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Monthly Goal</span>
                    <span className="text-sm text-gray-400">{learningGoals.monthly.completed}/{learningGoals.monthly.target}</span>
                  </div>
                  <div className="h-3 bg-[#2a2d36] rounded-full overflow-hidden border border-gray-700">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-700 transition-all duration-500"
                      style={{ width: `${(learningGoals.monthly.completed / learningGoals.monthly.target) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{learningGoals.monthly.description}</p>
                </div>
              </div>
            </div>

            {/* Courses Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Poker Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course) => (
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
                        <div className="text-2xl font-bold text-white">{course.progress}%</div>
                        <div className="text-sm text-gray-400">Complete</div>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-4">{course.description}</p>
                    
                    <div className="mb-4">
                      <div className="h-2 bg-[#2a2d36] rounded-full overflow-hidden border border-gray-700">
                        <div 
                          className={`h-full bg-gradient-to-r ${course.color} transition-all duration-500`}
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                      <span>{course.estimatedTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;