import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';

// Course data structure - moved outside component to prevent re-creation
const courseData = {
  'fundamentals': {
    id: 'fundamentals',
    title: 'Poker Fundamentals',
    level: 'Beginner',
    description: 'Master the basics of Texas Hold\'em poker. This comprehensive course covers everything from basic rules to fundamental strategy concepts.',
    progress: 65,
    totalLessons: 12,
    completedLessons: 8,
    estimatedTime: '2-3 hours',
    color: 'from-green-500 to-green-700',
    lessons: [
      {
        id: 'what-is-texas-holdem',
        title: "What is Texas Hold'em?",
        description: "Learn the basic rules and structure of Texas Hold'em poker",
        duration: '15 min',
        completed: true,
        content: `Texas Hold'em is the most popular form of poker today. Each player receives two private cards (hole cards) and shares five community cards to make the best five-card hand.

The game consists of four betting rounds:
1. **Preflop**: After receiving your hole cards
2. **Flop**: After the first three community cards
3. **Turn**: After the fourth community card  
4. **River**: After the fifth and final community card

The goal is simple: make the best five-card poker hand using any combination of your two hole cards and the five community cards.`,
        keyPoints: [
          "Two private cards dealt to each player",
          "Five community cards shared by all players", 
          "Four betting rounds: preflop, flop, turn, and river",
          "Best five-card hand wins the pot"
        ]
      },
      {
        id: 'hand-rankings',
        title: 'Hand Rankings',
        description: 'Master the hierarchy of poker hands from high card to royal flush',
        duration: '20 min',
        completed: true,
        content: `Understanding hand rankings is fundamental to poker success. Here's the complete hierarchy from highest to lowest:

1. **Royal Flush**: A, K, Q, J, 10 of the same suit
2. **Straight Flush**: Five consecutive cards of the same suit
3. **Four of a Kind**: Four cards of the same rank
4. **Full House**: Three of a kind plus a pair
5. **Flush**: Five cards of the same suit
6. **Straight**: Five consecutive cards of any suit
7. **Three of a Kind**: Three cards of the same rank
8. **Two Pair**: Two different pairs
9. **One Pair**: Two cards of the same rank
10. **High Card**: Highest card when no other hand is made`,
        keyPoints: [
          "Ten distinct hand rankings from royal flush to high card",
          "Suits are equal in value",
          "Aces can be high or low in straights",
          "Highest card breaks ties"
        ]
      },
      {
        id: 'positions-and-blinds',
        title: 'Positions and Blinds',
        description: 'Understand table positions and how they affect your strategy',
        duration: '25 min',
        completed: true,
        content: `Position is one of the most important concepts in poker. It determines when you act in each betting round and significantly impacts your strategy.

**Key positions** (from earliest to latest):
1. Small Blind (SB)
2. Big Blind (BB)
3. Under the Gun (UTG)
4. UTG+1
5. Middle Position (MP)
6. Hijack (HJ)
7. Cutoff (CO)
8. Button (BTN)

**The blinds** are forced bets that drive the action:
- Small Blind: Half the minimum bet
- Big Blind: Full minimum bet`,
        keyPoints: [
          "Eight distinct positions at a full table",
          "Blinds rotate clockwise each hand",
          "Later positions have more information",
          "Button is the most profitable position"
        ]
      },
      {
        id: 'basic-strategy',
        title: 'Basic Strategy',
        description: 'Learn fundamental poker strategy concepts',
        duration: '30 min',
        completed: false,
        content: `Mastering basic strategy is the foundation of winning poker. Here are the key concepts every player should understand:

**1. Starting Hand Selection**
- Play fewer hands, but play them aggressively
- Position matters: play tighter in early position
- Premium hands (AA, KK, QQ, AK) are always playable
- Suited connectors and small pairs need proper odds

**2. Betting Strategy**
- Bet for value when you have a strong hand
- Use position to control the pot size
- Don't chase draws without proper odds
- Fold when you're likely behind`,
        keyPoints: [
          "Tight-aggressive play is most profitable",
          "Position determines hand selection",
          "Proper bankroll management is crucial",
          "Value betting is key to winning"
        ]
      }
    ]
  },
  'position-play': {
    id: 'position-play',
    title: 'Position-Based Strategy',
    level: 'Intermediate',
    description: 'Learn how position affects every decision in poker and develop advanced positional strategies.',
    progress: 30,
    totalLessons: 8,
    completedLessons: 2,
    estimatedTime: '1-2 hours',
    color: 'from-blue-500 to-blue-700',
    lessons: [
      {
        id: 'early-position-play',
        title: 'Early Position Play',
        description: 'Master the art of playing from early positions',
        duration: '20 min',
        completed: true,
        content: `Early position play requires discipline and tight hand selection. When you're first to act, you have the least information and must be more selective.

**Early Position Strategy:**
- Play only premium hands (AA, KK, QQ, AK, AQ)
- Avoid speculative hands like suited connectors
- Bet for value with strong hands
- Fold marginal hands that play poorly out of position`,
        keyPoints: [
          "Tightest range of all positions",
          "Focus on premium hands only",
          "Avoid speculative holdings",
          "Information disadvantage requires caution"
        ]
      },
      {
        id: 'late-position-advantages',
        title: 'Late Position Advantages',
        description: 'Exploit the benefits of acting last',
        duration: '25 min',
        completed: true,
        content: `Late position is the most profitable in poker. Acting last gives you maximum information to make optimal decisions.

**Late Position Benefits:**
- See all opponents' actions before deciding
- Control pot size more effectively
- Bluff more profitably
- Extract maximum value from strong hands
- Play wider range of hands profitably`,
        keyPoints: [
          "Maximum information advantage",
          "Can play wider range of hands",
          "Better bluffing opportunities",
          "Easier to control pot size"
        ]
      },
      {
        id: 'blind-defense',
        title: 'Blind Defense',
        description: 'Learn when and how to defend your blinds',
        duration: '30 min',
        completed: false,
        content: `Defending your blinds is crucial for maintaining a profitable win rate. You've already invested money in the pot, so you need to defend appropriately.

**Blind Defense Strategy:**
- Defend wider against late position raises
- Consider pot odds when deciding to call
- 3-bet with strong hands and some bluffs
- Don't defend too wide against early position`,
        keyPoints: [
          "Already invested money in the pot",
          "Defend wider vs late position",
          "Consider pot odds in decisions",
          "Mix of calls and 3-bets"
        ]
      }
    ]
  },
  'player-profiling': {
    id: 'player-profiling',
    title: 'Player Profiling',
    level: 'Intermediate',
    description: 'Identify and exploit opponent tendencies to maximize your edge at the table.',
    progress: 0,
    totalLessons: 6,
    completedLessons: 0,
    estimatedTime: '1 hour',
    color: 'from-purple-500 to-purple-700',
    lessons: [
      {
        id: 'tight-vs-loose',
        title: 'Tight vs Loose Players',
        description: 'Identify and exploit tight and loose playing styles',
        duration: '15 min',
        completed: false,
        content: `Understanding player types is crucial for profitable play. Tight and loose players require different strategies.

**Tight Players:**
- Play few hands but play them strongly
- Rarely bluff
- Fold to aggression easily
- Exploit by bluffing more and value betting thinner

**Loose Players:**
- Play many hands
- Often call with weak holdings
- Harder to bluff
- Exploit by value betting wider and bluffing less`,
        keyPoints: [
          "Tight players fold to aggression",
          "Loose players call with weak hands",
          "Adjust bluffing frequency accordingly",
          "Value bet wider against loose players"
        ]
      }
    ]
  },
  'gto-concepts': {
    id: 'gto-concepts',
    title: 'GTO Fundamentals',
    level: 'Advanced',
    description: 'Learn Game Theory Optimal concepts and how to apply them in real games.',
    progress: 10,
    totalLessons: 10,
    completedLessons: 1,
    estimatedTime: '3-4 hours',
    color: 'from-red-500 to-red-700',
    lessons: [
      {
        id: 'what-is-gto',
        title: 'What is GTO?',
        description: 'Introduction to Game Theory Optimal play',
        duration: '25 min',
        completed: true,
        content: `Game Theory Optimal (GTO) play represents the mathematically perfect strategy that cannot be exploited by opponents.

**Key GTO Concepts:**
- Balanced ranges that are unexploitable
- Mixed strategies using randomization
- Indifference principles
- Nash equilibrium solutions

**When to Use GTO:**
- Against unknown opponents
- In high-stakes games
- When opponents are skilled
- As a baseline strategy`,
        keyPoints: [
          "Mathematically unexploitable strategy",
          "Uses balanced ranges and mixed strategies",
          "Best against skilled opponents",
          "Provides solid baseline approach"
        ]
      }
    ]
  }
};

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isCourseSidebarOpen, setCourseSidebarOpen] = useState(true);

  const course = courseData[courseId];

  useEffect(() => {
    // Don't auto-select first lesson - let user choose
    // if (course && course.lessons.length > 0) {
    //   setSelectedLesson(course.lessons[0]);
    //   // Auto-collapse main sidebar when lesson is selected
    //   setSidebarOpen(false);
    // }
  }, [courseId, course]);

  // Auto-collapse sidebar when lesson is selected
  useEffect(() => {
    // Don't auto-collapse - keep header visible
    // if (selectedLesson) {
    //   setSidebarOpen(false);
    // }
    
    // Remove scroll effect - fix layout instead
    // if (selectedLesson) {
    //   window.scrollTo({ top: 0, behavior: 'smooth' });
    // }
  }, [selectedLesson]);

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

  if (!course) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <p className="text-gray-400 mb-4">Course ID: {courseId}</p>
          <Link to="/learn" className="text-indigo-400 hover:text-indigo-300">
            Return to Learn Page
          </Link>
        </div>
      </div>
    );
  }

  // Add loading state for when user is not available yet
  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Main BigStack Sidebar - Always visible, auto-collapsed when lesson selected */}
      <div className={`bg-[#1a1a1a] transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-20'} min-h-screen flex flex-col fixed left-0 top-0 z-10`}>
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
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} flex flex-col h-screen`}>
        {/* Dashboard Header - Always visible and sticky */}
        <div className="bg-black py-8 px-8 border-b-2 border-white sticky top-0 z-20">
          <h2 className="text-3xl font-bold text-white mt-4 -mb-4">
            {selectedLesson ? `${course.title} -- ${selectedLesson.title}` : course.title}
          </h2>
        </div>

        {/* Top Right Menu (visible when main sidebar is collapsed and no lesson selected) */}
        {!isSidebarOpen && !selectedLesson && (
          <div className="fixed top-4 right-4 flex items-center space-x-4 z-10">
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

        {/* Content Area */}
        <div className="flex-1 flex">
          {selectedLesson ? (
            // Lesson Content View with Course Sidebar
            <>
              {/* Course Sidebar - Always visible */}
              <div className={`bg-[#1F2127] border-r border-gray-700 overflow-y-auto transition-all duration-300 ${isCourseSidebarOpen ? 'w-80' : 'w-16'} flex-shrink-0`}>
                {/* Back to Courses Header */}
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <Link 
                      to="/learn" 
                      className={`flex items-center text-indigo-400 hover:text-indigo-300 transition-colors ${!isCourseSidebarOpen && 'hidden'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to Courses
                    </Link>
                    
                    <button 
                      onClick={() => setCourseSidebarOpen(!isCourseSidebarOpen)} 
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {isCourseSidebarOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  {isCourseSidebarOpen && (
                    <>
                      <h1 className="text-2xl font-bold text-white mb-2">{course.title}</h1>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)} mb-3 inline-block`}>
                        {course.level}
                      </span>
                      
                      <p className="text-gray-300 text-sm mb-4">{course.description}</p>
                      
                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-400">Progress</span>
                          <span className="text-sm text-gray-400">{course.completedLessons}/{course.totalLessons} lessons</span>
                        </div>
                        <div className="h-2 bg-[#2a2d36] rounded-full overflow-hidden border border-gray-700">
                          <div 
                            className={`h-full bg-gradient-to-r ${course.color} transition-all duration-500`}
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Lessons List */}
                <div className="p-4">
                  {isCourseSidebarOpen && <h3 className="text-lg font-semibold text-white mb-4">Lessons</h3>}
                  <div className="space-y-2">
                    {course.lessons.map((lesson, index) => (
                      <button
                        key={lesson.id}
                        onClick={() => setSelectedLesson(lesson)}
                        className={`w-full text-left rounded-lg transition-all bg-[#2a2d36] hover:bg-gray-700 text-gray-300 ${isCourseSidebarOpen ? 'p-4' : 'p-2'}`}
                      >
                        {isCourseSidebarOpen ? (
                          <>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center text-xs font-bold ${
                                  lesson.completed ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                                }`}>
                                  {lesson.completed ? '✓' : index + 1}
                                </div>
                                <span className="font-medium">{lesson.title}</span>
                              </div>
                              <span className="text-xs text-gray-400">{lesson.duration}</span>
                            </div>
                            <p className="text-sm text-gray-400 ml-9">{lesson.description}</p>
                          </>
                        ) : (
                          <div className="flex justify-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              lesson.completed ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                            }`}>
                              {lesson.completed ? '✓' : index + 1}
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lesson Content Area */}
              <div className="flex-1 overflow-y-auto p-8">
                {/* Lesson Header */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-400">{selectedLesson.duration}</span>
                      {selectedLesson.completed && (
                        <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-300 text-lg">{selectedLesson.description}</p>
                </div>

                {/* Lesson Content */}
                <div className="bg-[#1F2127] rounded-xl p-8 mb-8">
                  <div className="prose prose-invert max-w-none">
                    {selectedLesson.content.split('\n\n').map((paragraph, index) => (
                      <div key={index} className="mb-4">
                        {paragraph.includes('**') ? (
                          <div dangerouslySetInnerHTML={{
                            __html: paragraph
                              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                              .replace(/\n/g, '<br />')
                          }} className="text-gray-300 leading-relaxed" />
                        ) : (
                          <p className="text-gray-300 leading-relaxed">{paragraph}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Points */}
                <div className="bg-[#1F2127] rounded-xl p-8 mb-8">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Key Points
                  </h3>
                  <ul className="space-y-3">
                    {selectedLesson.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-300">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => {
                      const currentIndex = course.lessons.findIndex(l => l.id === selectedLesson.id);
                      if (currentIndex > 0) {
                        setSelectedLesson(course.lessons[currentIndex - 1]);
                      }
                    }}
                    disabled={course.lessons.findIndex(l => l.id === selectedLesson.id) === 0}
                    className="flex items-center px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous Lesson
                  </button>

                  <div className="flex space-x-4">
                    {!selectedLesson.completed && (
                      <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Mark as Complete
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        const currentIndex = course.lessons.findIndex(l => l.id === selectedLesson.id);
                        if (currentIndex < course.lessons.length - 1) {
                          setSelectedLesson(course.lessons[currentIndex + 1]);
                        }
                      }}
                      disabled={course.lessons.findIndex(l => l.id === selectedLesson.id) === course.lessons.length - 1}
                      className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next Lesson
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Course Overview with Lesson Selection - Integrated Layout
            <>
              {/* Course Sidebar */}
              <div className={`bg-[#1F2127] border-r border-gray-700 overflow-y-auto transition-all duration-300 ${isCourseSidebarOpen ? 'w-80' : 'w-16'} flex-shrink-0`}>
                {/* Back to Courses Header */}
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <Link 
                      to="/learn" 
                      className={`flex items-center text-indigo-400 hover:text-indigo-300 transition-colors ${!isCourseSidebarOpen && 'hidden'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back to Courses
                    </Link>
                    
                    <button 
                      onClick={() => setCourseSidebarOpen(!isCourseSidebarOpen)} 
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {isCourseSidebarOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  {isCourseSidebarOpen && (
                    <>
                      <h1 className="text-2xl font-bold text-white mb-2">{course.title}</h1>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)} mb-3 inline-block`}>
                        {course.level}
                      </span>
                      
                      <p className="text-gray-300 text-sm mb-4">{course.description}</p>
                      
                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-400">Progress</span>
                          <span className="text-sm text-gray-400">{course.completedLessons}/{course.totalLessons} lessons</span>
                        </div>
                        <div className="h-2 bg-[#2a2d36] rounded-full overflow-hidden border border-gray-700">
                          <div 
                            className={`h-full bg-gradient-to-r ${course.color} transition-all duration-500`}
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Lessons List */}
                <div className="p-4">
                  {isCourseSidebarOpen && <h3 className="text-lg font-semibold text-white mb-4">Lessons</h3>}
                  <div className="space-y-2">
                    {course.lessons.map((lesson, index) => (
                      <button
                        key={lesson.id}
                        onClick={() => setSelectedLesson(lesson)}
                        className={`w-full text-left rounded-lg transition-all bg-[#2a2d36] hover:bg-gray-700 text-gray-300 ${isCourseSidebarOpen ? 'p-4' : 'p-2'}`}
                      >
                        {isCourseSidebarOpen ? (
                          <>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center text-xs font-bold ${
                                  lesson.completed ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                                }`}>
                                  {lesson.completed ? '✓' : index + 1}
                                </div>
                                <span className="font-medium">{lesson.title}</span>
                              </div>
                              <span className="text-xs text-gray-400">{lesson.duration}</span>
                            </div>
                            <p className="text-sm text-gray-400 ml-9">{lesson.description}</p>
                          </>
                        ) : (
                          <div className="flex justify-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              lesson.completed ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'
                            }`}>
                              {lesson.completed ? '✓' : index + 1}
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Course Content Area */}
              <div className="flex-1 overflow-y-auto">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Select a Lesson</h2>
                    <p className="text-gray-400">Choose a lesson from the sidebar to begin learning</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePage; 