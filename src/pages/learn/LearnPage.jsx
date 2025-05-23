import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';

const LearnPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [profile, setProfile] = useState(null);
  const [expandedSection, setExpandedSection] = useState('beginner');
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [skillLevel, setSkillLevel] = useState('beginner');
  const [lessonPlan, setLessonPlan] = useState([
    {
      id: 'beginner',
      title: 'Beginner',
      lessons: [
        { 
          id: 'what-is-texas-holdem', 
          title: "What is Texas Hold'em?", 
          completed: false,
          content: "Texas Hold'em is a community card poker game where each player is dealt two private cards and five community cards are dealt face-up in the center of the table. Players make the best possible five-card hand using any combination of their two private cards and the five community cards."
        },
        { 
          id: 'hand-rankings', 
          title: 'Hand Rankings', 
          completed: false,
          content: "Poker hand rankings from highest to lowest: Royal Flush, Straight Flush, Four of a Kind, Full House, Flush, Straight, Three of a Kind, Two Pair, One Pair, High Card."
        },
        { 
          id: 'positions-and-blinds', 
          title: 'Positions and Blinds', 
          completed: false,
          content: "The positions in poker are: Small Blind (SB), Big Blind (BB), Under the Gun (UTG), Middle Position (MP), Cutoff (CO), and Button (BTN). The blinds are forced bets that rotate around the table to ensure action."
        },
        { 
          id: 'basic-strategy', 
          title: 'Basic Strategy', 
          completed: false,
          content: "Basic poker strategy involves understanding position, starting hand selection, pot odds, and basic betting patterns. Always consider your position relative to the blinds and other players when making decisions."
        }
      ]
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      lessons: [
        { 
          id: 'starting-hands', 
          title: 'Starting Hand Selection', 
          completed: false,
          content: "Starting hand selection is crucial in poker. Premium hands like AA, KK, QQ, AK should be played aggressively. Suited connectors and small pairs can be played in position with proper stack sizes."
        },
        { 
          id: 'position-play', 
          title: 'Position-Based Play', 
          completed: false,
          content: "Position is power in poker. Play more hands in late position and fewer in early position. Use your position to control the size of the pot and extract value from your opponents."
        },
        { 
          id: 'stack-sizes', 
          title: 'Stack Size Considerations', 
          completed: false,
          content: "Stack sizes affect how you should play your hands. Deep stacks allow for more post-flop play, while short stacks require more preflop action. Adjust your strategy based on effective stack sizes."
        },
        { 
          id: 'board-texture', 
          title: 'Board Texture Analysis', 
          completed: false,
          content: "Board texture refers to the characteristics of the community cards. Consider factors like connectedness, flush potential, and paired boards when making decisions. Adjust your strategy based on how the board interacts with your range."
        },
        { 
          id: 'bet-sizing', 
          title: 'Bet Sizing', 
          completed: false,
          content: "Bet sizing is crucial for maximizing value and protecting your hand. Use larger bets for value with strong hands and smaller bets for draws and bluffs. Consider pot size, stack sizes, and opponent tendencies."
        }
      ]
    },
    {
      id: 'advanced',
      title: 'Advanced',
      lessons: [
        { 
          id: '3bet-strategy', 
          title: '3-Bet Strategy', 
          completed: false,
          content: "3-bets are re-raising after an initial raise. Use 3-bets to build pots with strong hands, protect your range, and apply pressure. Consider position, stack sizes, and opponent tendencies when 3-betting."
        },
        { 
          id: 'pot-control', 
          title: 'Pot Control', 
          completed: false,
          content: "Pot control involves managing the size of the pot based on your hand strength and position. Use check-calls and smaller bets to keep pots small with medium-strength hands. Build larger pots with strong hands."
        },
        { 
          id: 'bluffing', 
          title: 'Bluffing and Semi-Bluffing', 
          completed: false,
          content: "Bluffing is betting with a weak hand to make opponents fold. Semi-bluffing is betting with a drawing hand that can improve. Choose good spots to bluff based on board texture, position, and opponent tendencies."
        },
        { 
          id: 'gto-basics', 
          title: 'GTO Fundamentals', 
          completed: false,
          content: "Game Theory Optimal (GTO) play involves making unexploitable decisions. Understand basic GTO concepts like balanced ranges, mixed strategies, and optimal frequencies. Use GTO as a baseline and adjust based on opponent tendencies."
        },
        { 
          id: 'range-construction', 
          title: 'Range Construction', 
          completed: false,
          content: "Range construction involves selecting hands to play in different situations. Build ranges based on position, stack sizes, and opponent tendencies. Consider how your range interacts with the board and your opponent's range."
        },
        { 
          id: 'equity-realization', 
          title: 'Equity Realization', 
          completed: false,
          content: "Equity realization is the ability to win your fair share of the pot. Consider factors like position, stack sizes, and opponent tendencies when calculating equity realization. Play hands that can realize their equity effectively."
        },
        { 
          id: 'icm', 
          title: 'ICM Considerations', 
          completed: false,
          content: "Independent Chip Model (ICM) is a mathematical model used in tournament poker. Understand how ICM affects your decisions in different tournament situations. Adjust your strategy based on payout structures and stack sizes."
        }
      ]
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

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/');
  };

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
  };

  const handleSkillLevelChange = (level) => {
    setSkillLevel(level);
    setExpandedSection(level);
    setSelectedLesson(null);
  };

  const getCurrentSection = () => {
    return lessonPlan.find(section => section.id === skillLevel);
  };

  const getCurrentLessonIndex = () => {
    const section = getCurrentSection();
    return section.lessons.findIndex(lesson => lesson.id === selectedLesson?.id);
  };

  const handlePreviousLesson = () => {
    const section = getCurrentSection();
    const currentIndex = getCurrentLessonIndex();
    if (currentIndex > 0) {
      setSelectedLesson(section.lessons[currentIndex - 1]);
    }
  };

  const handleNextLesson = () => {
    const section = getCurrentSection();
    const currentIndex = getCurrentLessonIndex();
    if (currentIndex < section.lessons.length - 1) {
      setSelectedLesson(section.lessons[currentIndex + 1]);
    }
  };

  const handleCompleteLesson = () => {
    const section = getCurrentSection();
    const currentIndex = getCurrentLessonIndex();
    
    // Update the lesson as completed
    const updatedLesson = { ...selectedLesson, completed: true };
    setSelectedLesson(updatedLesson);
    
    // Update the lesson in the lessonPlan
    const updatedLessons = [...section.lessons];
    updatedLessons[currentIndex] = updatedLesson;
    
    // Find the section index and update it
    const sectionIndex = lessonPlan.findIndex(s => s.id === skillLevel);
    const updatedLessonPlan = [...lessonPlan];
    updatedLessonPlan[sectionIndex] = {
      ...section,
      lessons: updatedLessons
    };
    
    // Update the lessonPlan state
    setLessonPlan(updatedLessonPlan);
    
    // If there's a next lesson, navigate to it
    if (currentIndex < section.lessons.length - 1) {
      setTimeout(() => {
        setSelectedLesson(section.lessons[currentIndex + 1]);
      }, 500); // Small delay to show completion
    }
  };

  const getProgressPercentage = () => {
    const section = getCurrentSection();
    const completedLessons = section.lessons.filter(lesson => lesson.completed).length;
    return (completedLessons / section.lessons.length) * 100;
  };

  return (
    <div className="min-h-screen bg-white text-black flex">
      {/* Collapsible Sidebar */}
      <div className={`bg-gray-50 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-80' : 'w-20'} min-h-screen flex flex-col fixed left-0 top-0 border-r border-gray-200 overflow-y-auto`}>
        <div className="pt-10">
          <div className={`px-4 ${!isSidebarOpen && 'flex justify-center'}`}>
            <div className={`flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'} mb-6`}>
              <h1 className={`text-3xl md:text-4xl font-bold text-black ${!isSidebarOpen && 'hidden'}`}>BigStack</h1>
              <button 
                onClick={() => setSidebarOpen(!isSidebarOpen)} 
                className="text-gray-600 hover:text-black transition-colors"
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
          
          <div className={`border-t-2 border-gray-200 ${isSidebarOpen ? '-mt-1' : 'mt-3'}`}></div>
        </div>

        <nav className="flex-1 p-4">
          {/* Skill Level Toggle */}
          <div className={`mb-6 ${!isSidebarOpen && 'hidden'}`}>
            <div className="flex space-x-2 mb-2">
              {['beginner', 'intermediate', 'advanced'].map((level) => (
                <button
                  key={level}
                  onClick={() => handleSkillLevelChange(level)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    skillLevel === level
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className={`mb-6 ${!isSidebarOpen && 'hidden'}`}>
            <div className="h-3 bg-gray-100 rounded-full border-2 border-black overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700 transition-all duration-500 ease-in-out"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            <div className="text-sm text-gray-600 mt-2 text-center">
              {Math.round(getProgressPercentage())}% Complete
            </div>
          </div>

          {/* Filtered Lessons */}
          {lessonPlan
            .filter(section => section.id === skillLevel)
            .map((section) => (
              <div key={section.id} className="mb-4">
                <button
                  onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                  className={`w-full flex items-center justify-between text-left mb-2 ${isSidebarOpen ? 'px-4' : 'px-2'}`}
                >
                  <span className={`font-semibold text-black ${!isSidebarOpen && 'hidden'}`}>{section.title}</span>
                  {isSidebarOpen && (
                    <svg
                      className={`w-5 h-5 transform transition-transform ${
                        expandedSection === section.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
                
                {expandedSection === section.id && isSidebarOpen && (
                  <div className="space-y-1 pl-4">
                    {section.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => handleLessonClick(lesson)}
                        className={`w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors ${
                          selectedLesson?.id === lesson.id ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                        }`}
                      >
                        <span>{lesson.title}</span>
                        <div className="flex items-center">
                          {lesson.completed ? (
                            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-700" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </nav>

        <div className="p-4 space-y-3 border-t border-gray-200">
          {/* Remove profile and logout buttons from here */}
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-80' : 'ml-20'}`}>
        {/* Top Right Menu (always visible) */}
        <div className="fixed top-12 right-4 flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="bg-white text-black px-4 py-1.5 rounded-full hover:bg-gray-100 transition-colors border border-gray-200 text-sm font-medium"
          >
            Back
          </button>
          <Link
            to="/dashboard"
            className="bg-white text-black p-1.5 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
          <Link
            to="/profile"
            className="bg-white text-black p-1.5 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
        </div>

        {/* Dashboard Header */}
        <div className="bg-white py-8 px-8 border-b-2 border-gray-200">
          <h2 className="text-3xl font-bold text-black mt-4 -mb-4">
            {profile?.username || 'Anonymous Player'}'s {!isSidebarOpen && 'BigStack '}Learning Center
          </h2>
        </div>

        <div className="py-8 px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            {selectedLesson ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                <h2 className="text-3xl font-bold text-black mb-6">{selectedLesson.title}</h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed">{selectedLesson.content}</p>
                </div>
                <div className="mt-8 flex justify-between items-center">
                  <button
                    onClick={handlePreviousLesson}
                    className="text-gray-600 hover:text-gray-800 transition-colors flex items-center"
                    disabled={getCurrentLessonIndex() === 0}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous Lesson
                  </button>
                  <button
                    onClick={handleCompleteLesson}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Mark as Complete
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-2xl font-bold text-black mb-4">Welcome to BigStack Learning</h2>
                <p className="text-gray-600 mb-8">
                  Select a lesson from the menu to begin your poker education journey. Each lesson builds upon the previous ones,
                  so we recommend following them in order.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => handleSkillLevelChange('beginner')}
                    className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white py-4 px-6 rounded-lg hover:from-indigo-600 hover:to-indigo-800 transition-all transform hover:scale-105 shadow-md"
                  >
                    <h3 className="text-xl font-semibold mb-2">Beginner</h3>
                    <p className="text-indigo-100 text-sm">Start with the basics of poker strategy and fundamentals</p>
                  </button>
                  <button 
                    onClick={() => handleSkillLevelChange('intermediate')}
                    className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white py-4 px-6 rounded-lg hover:from-indigo-600 hover:to-indigo-800 transition-all transform hover:scale-105 shadow-md"
                  >
                    <h3 className="text-xl font-semibold mb-2">Intermediate</h3>
                    <p className="text-indigo-100 text-sm">Dive deeper into advanced concepts and strategies</p>
                  </button>
                  <button 
                    onClick={() => handleSkillLevelChange('advanced')}
                    className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white py-4 px-6 rounded-lg hover:from-indigo-600 hover:to-indigo-800 transition-all transform hover:scale-105 shadow-md"
                  >
                    <h3 className="text-xl font-semibold mb-2">Advanced</h3>
                    <p className="text-indigo-100 text-sm">Master complex strategies and GTO concepts</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnPage; 