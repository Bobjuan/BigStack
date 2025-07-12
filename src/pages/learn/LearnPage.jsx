import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { supabase } from '../../config/supabase';

const LearnPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState(location.state?.activeSection || 'courses');
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
            },
            {
              id: 'post-4',
              title: 'Multiway Pots & Adjustments',
              content: 'See lesson page for details.',
              completed: false
            },
            {
              id: 'post-5',
              title: 'Turn & River Play: Probing and Overbets',
              content: 'See lesson page for details.',
              completed: false
            },
            {
              id: 'post-6',
              title: 'Bluffing and Blockers in Practice',
              content: 'See lesson page for details.',
              completed: false
            }
          ]
        },
        {
          id: 'module-4',
          title: 'Tournament Play',
          description: 'Specialized strategies for tournament poker, including ICM, bubble play, and pay jumps.',
          lessons: [
            {
              id: 'tourn-1',
              title: 'ICM Bubble Play',
              content: 'See lesson page for details.',
              completed: false
            },
            {
              id: 'tourn-2',
              title: 'Short Stack Play',
              content: 'See lesson page for details.',
              completed: false
            },
            {
              id: 'tourn-3',
              title: 'Final Table Adjustments',
              content: 'See lesson page for details.',
              completed: false
            }
          ]
        },
        {
          id: 'module-5',
          title: 'Deep Stack Play',
          description: 'How to play deep-stacked poker, including leverage and overbets.',
          lessons: [
            {
              id: 'deep-1',
              title: 'Deep Stack Preflop',
              content: 'See lesson page for details.',
              completed: false
            },
            {
              id: 'deep-2',
              title: 'Deep Stack Postflop',
              content: 'See lesson page for details.',
              completed: false
            },
            {
              id: 'deep-3',
              title: 'Overbets & Leverage',
              content: 'See lesson page for details.',
              completed: false
            }
          ]
        },
        {
          id: 'module-7',
          title: 'Mental Game',
          description: 'Develop the psychological resilience needed for poker, including tilt control, focus, and emotional regulation.',
          lessons: [
            {
              id: 'mental-1',
              title: 'Understanding Tilt & Emotional Triggers',
              content: 'See lesson page for details.',
              completed: false
            },
            {
              id: 'mental-2',
              title: 'Spotting Tilt in Yourself and Others',
              content: 'See lesson page for details.',
              completed: false
            },
            {
              id: 'mental-3',
              title: 'Anger, Focus, and Recovery Routines',
              content: 'See lesson page for details.',
              completed: false
            }
          ]
        }
      ]
    }
  ]);

  // Add local completion state for lessons
  const [lessonCompletion, setLessonCompletion] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [openModule, setOpenModule] = useState(null);

  // Fetch lesson progress from Supabase on mount
  useEffect(() => {
    const fetchLessonProgress = async () => {
      if (!user) return;
      setLoadingProgress(true);
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('lesson_id, completed')
        .eq('user_id', user.id);
      if (error) {
        setLoadingProgress(false);
        return;
      }
      const progressMap = {};
      data.forEach(row => {
        progressMap[row.lesson_id] = row.completed;
      });
      setLessonCompletion(progressMap);
      setLoadingProgress(false);
    };
    fetchLessonProgress();
  }, [user]);

  const toggleLessonCompletion = async (lessonId) => {
    if (!user) return;
    const newValue = !lessonCompletion[lessonId];
    setLessonCompletion((prev) => ({
      ...prev,
      [lessonId]: newValue,
    }));
    // Upsert to Supabase
    await supabase.from('lesson_progress').upsert({
      user_id: user.id,
      lesson_id: lessonId,
      completed: newValue,
      completed_at: newValue ? new Date().toISOString() : null,
    }, { onConflict: ['user_id', 'lesson_id'] });
  };

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

  // Calculate completed lessons for dashboard tally
  const allLessonIds = courses.flatMap(course => course.modules.flatMap(module => module.lessons.map(lesson => lesson.id)));
  const completedLessonsCount = allLessonIds.filter(id => lessonCompletion[id]).length;
  const totalLessonsCount = allLessonIds.length;

  return (
    <div className="p-8">
      {/* Dashboard Header */}
      <div className="bg-[#1F2127] rounded-xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Learning Dashboard</h2>
        
        {/* Learning Goals Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weekly Goal */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-300 text-sm">Weekly Goal</span>
              <span className="text-xs text-gray-400">{completedLessonsCount}/{learningGoals.weekly.target}</span>
            </div>
            <div className="h-2 bg-[#2a2d36] rounded-full overflow-hidden border border-gray-700">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700 transition-all duration-500"
                style={{ width: `${(completedLessonsCount / learningGoals.weekly.target) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1 mb-2">{learningGoals.weekly.description}</p>
            {completedLessonsCount >= learningGoals.weekly.target && (
              <span className="text-green-400 text-xs font-medium">✓ Weekly Goal Completed!</span>
            )}
          </div>

          {/* Monthly Goal */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-300 text-sm">Monthly Goal</span>
              <span className="text-xs text-gray-400">{completedLessonsCount}/{learningGoals.monthly.target}</span>
            </div>
            <div className="h-2 bg-[#2a2d36] rounded-full overflow-hidden border border-gray-700">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-purple-700 transition-all duration-500"
                style={{ width: `${(completedLessonsCount / learningGoals.monthly.target) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1 mb-2">{learningGoals.monthly.description}</p>
            {completedLessonsCount >= learningGoals.monthly.target && (
              <span className="text-green-400 text-xs font-medium">✓ Monthly Goal Completed!</span>
            )}
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="mb-8 border-b border-gray-700">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveSection('courses')}
            className={`pb-4 text-sm font-medium transition-colors ${
              activeSection === 'courses'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Courses
          </button>
          <button
            onClick={() => setActiveSection('lessons')}
            className={`pb-4 text-sm font-medium transition-colors ${
              activeSection === 'lessons'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Individual Lessons
          </button>
        </div>
      </div>

      {activeSection === 'courses' ? (
        // Courses section
        <div className="grid grid-cols-1 gap-6">
          {courses.map((course) => {
            // Get all lesson IDs for this course
            const courseLessonIds = course.modules.flatMap(module => module.lessons.map(lesson => lesson.id));
            const completedLessons = courseLessonIds.filter(id => lessonCompletion[id]).length;
            const totalLessons = courseLessonIds.length;
            const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

            return (
              <div
                key={course.id}
                onClick={() => handleCourseClick(course)}
                className="bg-[#1F2127] rounded-xl p-6 hover:bg-[#252831] transition-all cursor-pointer transform hover:scale-105"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">{course.title}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>{course.level}</span>
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
      ) : (
        // Individual lessons section
        <div className="space-y-6">
          {loadingProgress ? (
            <div className="text-center text-gray-400 py-12">Loading lesson progress...</div>
          ) : (
            courses.map(course =>
              course.modules.map(module => {
                const isOpen = openModule === module.id;
                // Calculate module progress
                const moduleLessonIds = module.lessons.map(lesson => lesson.id);
                const moduleCompleted = moduleLessonIds.filter(id => lessonCompletion[id]).length;
                const moduleTotal = moduleLessonIds.length;
                const modulePercent = moduleTotal > 0 ? Math.round((moduleCompleted / moduleTotal) * 100) : 0;
                return (
                  <div key={module.id} className="bg-[#1F2127] rounded-xl">
                    <button
                      className="w-full flex justify-between items-center px-6 py-5 text-left text-white text-xl font-bold focus:outline-none hover:bg-[#23273a] transition-colors rounded-xl"
                      onClick={() => setOpenModule(isOpen ? null : module.id)}
                    >
                      <span className="flex items-center gap-5">
                        {module.title}
                        <span className="text-base font-normal text-gray-400">{moduleTotal} lesson{moduleTotal !== 1 ? 's' : ''}</span>
                      </span>
                      <div className="flex flex-col items-end min-w-[80px]">
                        <span className="text-sm text-gray-400">{moduleCompleted}/{moduleTotal} lessons</span>
                        <span className="text-xs text-gray-400">{modulePercent}% complete</span>
                        <div className="w-20 h-1 bg-[#2a2d36] rounded-full overflow-hidden border border-gray-700 mt-1">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-500" style={{ width: `${modulePercent}%` }} />
                        </div>
                      </div>
                      <svg className={`ml-4 w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 pt-2">
                        <p className="text-gray-400 mb-4">{module.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {module.lessons.map(lesson => {
                            const isComplete = lessonCompletion[lesson.id] || lesson.completed;
                            return (
                              <div
                                key={lesson.id}
                                className="bg-[#23273a] rounded-xl p-6 hover:bg-[#252831] transition-all cursor-pointer transform hover:scale-105 relative"
                                onClick={() => {
                                  window.dispatchEvent(new Event('minimizeSidebar'));
                                  navigate(`/learn/lessons/${lesson.id}`, {
                                    state: { module, course }
                                  });
                                }}
                              >
                                <h3 className="text-lg font-bold text-white mb-2">{lesson.title}</h3>
                                <p className="text-gray-400 mb-4">{lesson.content.split('\n')[0]}</p>
                                <div className="flex justify-between items-center text-sm text-gray-400">
                                  <span>{module.title}</span>
                                </div>
                                {/* Completion Icon */}
                                <button
                                  type="button"
                                  aria-label={isComplete ? 'Mark as incomplete' : 'Mark as complete'}
                                  onClick={e => {
                                    e.stopPropagation();
                                    toggleLessonCompletion(lesson.id);
                                  }}
                                  className="absolute bottom-4 right-4 text-2xl focus:outline-none"
                                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                                >
                                  {isComplete ? (
                                    <CheckCircleIcon style={{ color: '#22c55e', fontSize: 32 }} />
                                  ) : (
                                    <RadioButtonUncheckedIcon style={{ color: '#64748b', fontSize: 32 }} />
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )
          )}
        </div>
      )}
    </div>
  );
};

export default LearnPage;