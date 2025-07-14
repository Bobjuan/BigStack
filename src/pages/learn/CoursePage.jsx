import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';
import LessonComponents from './lessons/indexForLessons';

const CoursePage = () => {
  const navigate = useNavigate();
  const { courseId, moduleId } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const { module, course } = location.state || {};
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [progress, setProgress] = useState(0);
  const [lessons, setLessons] = useState(module?.lessons || []);
  const [loadingProgress, setLoadingProgress] = useState(false);

  // Fetch user-specific lesson progress from Supabase
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user || !module?.lessons) return;
      setLoadingProgress(true);
      try {
        const lessonIds = module.lessons.map(l => l.id);
        const { data, error } = await supabase
          .from('lesson_progress')
          .select('lesson_id, completed')
          .eq('user_id', user.id)
          .in('lesson_id', lessonIds);
        if (error) throw error;
        // Map lesson_id to completed
        const completedMap = {};
        data?.forEach(row => {
          completedMap[row.lesson_id] = row.completed;
        });
        // Merge into lessons
        const updatedLessons = module.lessons.map(lesson => ({
          ...lesson,
          completed: !!completedMap[lesson.id],
        }));
        setLessons(updatedLessons);
        const completedCount = updatedLessons.filter(l => l.completed).length;
        setProgress(Math.round((completedCount / updatedLessons.length) * 100));
      } catch (err) {
        console.error('Error loading lesson progress:', err);
      } finally {
        setLoadingProgress(false);
      }
    };
    fetchProgress();
  }, [user, module]);

  // Auto-select the first lesson if none is selected and lessons exist
  useEffect(() => {
    if (!selectedLesson && lessons.length > 0) {
      setSelectedLesson(lessons[0]);
    } else if (selectedLesson && lessons.length > 0) {
      // Sync selectedLesson with updated lessons array
      const updated = lessons.find(l => l.id === selectedLesson.id);
      if (updated && updated.completed !== selectedLesson.completed) {
        setSelectedLesson(updated);
      }
    }
  }, [lessons, selectedLesson]);

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
  };

  const toggleLessonCompletion = async (lessonId, currentCompleted) => {
    if (!user || !module) return;
    const newCompleted = !currentCompleted;
    try {
      const { error: lessonError } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          completed: newCompleted,
          completed_at: newCompleted ? new Date().toISOString() : null,
        }, { onConflict: ['user_id', 'lesson_id'] });
      if (lessonError) throw lessonError;
      // Update local lessons state
      const updatedLessons = lessons.map(lesson =>
        lesson.id === lessonId ? { ...lesson, completed: newCompleted } : lesson
      );
      setLessons(updatedLessons);
      const completedCount = updatedLessons.filter(lesson => lesson.completed).length;
      const newProgress = Math.round((completedCount / updatedLessons.length) * 100);
      setProgress(newProgress);
      // Keep selected lesson in sync
      const updatedSelected = updatedLessons.find(l => l.id === lessonId);
      if (updatedSelected) setSelectedLesson(updatedSelected);
    } catch (error) {
      console.error('Error toggling lesson completion:', error);
    }
  };

  const getNextLesson = () => {
    if (!lessons || !selectedLesson) return null;
    const currentIndex = lessons.findIndex(lesson => lesson.id === selectedLesson.id);
    return lessons[currentIndex + 1] || null;
  };

  const getPreviousLesson = () => {
    if (!lessons || !selectedLesson) return null;
    const currentIndex = lessons.findIndex(lesson => lesson.id === selectedLesson.id);
    return lessons[currentIndex - 1] || null;
  };

  const handleNextLesson = () => {
    const nextLesson = getNextLesson();
    if (nextLesson) {
      handleLessonClick(nextLesson);
    }
  };

  const handlePreviousLesson = () => {
    const prevLesson = getPreviousLesson();
    if (prevLesson) {
      handleLessonClick(prevLesson);
    }
  };

  // Get the lesson component based on lessonId
  const LessonComponent = selectedLesson ? LessonComponents[selectedLesson.id] : null;

  // Calculate progress and tally using real completion state
  const completedCount = lessons.filter(l => l.completed).length;
  const totalCount = lessons.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="flex h-screen  bg-0F1115">
      {/* Sidebar */}
      <div className={`bg-[#1F2127] ${isSidebarOpen ? 'w-80' : 'w-20'} flex-shrink-0 transition-all duration-300 flex flex-col`}>
        <div className="p-4">
          <div className="flex items-center mb-6">
            {isSidebarOpen && (
              <h2 className="text-xl font-bold text-white transition-all duration-300 flex-1">{module?.title}</h2>
            )}
            <div className={`flex ${isSidebarOpen ? 'flex-1 justify-end' : 'w-full justify-center mt-6'}`}>
              <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          {isSidebarOpen && (
            <div className="space-y-2">
              {lessons?.map((lesson) => (
                <div key={lesson.id} className="mb-2">
                  <button
                    type="button"
                    onClick={() => {
                      window.dispatchEvent(new Event('minimizeSidebar'));
                      setSelectedLesson(lesson);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors cursor-pointer ${
                      selectedLesson?.id === lesson.id
                        ? 'bg-blue-600 text-white border-2 border-white'
                        : 'hover:bg-[#2a2d36] text-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{lesson.title}</span>
                      {lesson.completed && (
                        <span className="ml-2 text-green-400" title="Completed">✔</span>
                      )}
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(`/learn/course/${course.id}`)}
            className="flex items-center bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Modules
          </button>
          {/* Progress Bar and Tally at the top */}
          <div className="mb-8 bg-[#1F2127] rounded-xl p-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-white">{course?.title}</h2>
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{percent}%</div>
                <div className="text-sm text-gray-400">Complete</div>
              </div>
            </div>
            <p className="text-gray-300 mb-4">{course?.description}</p>
            <div className="h-2 bg-[#2a2d36] rounded-full overflow-hidden border border-gray-700 mb-2">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>{completedCount}/{totalCount} lessons</span>
              <span>{course?.estimatedTime}</span>
            </div>
          </div>
          {LessonComponent ? (
            <div>
              <LessonComponent />
              <div className="mt-8 flex justify-between items-center">
                <button
                  onClick={() => toggleLessonCompletion(selectedLesson.id, selectedLesson.completed)}
                  className={`px-6 py-2 rounded-lg transition-colors ${selectedLesson.completed ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-green-600 text-white hover:bg-green-700'}`}
                >
                  {selectedLesson.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
                <div className="flex gap-4">
                  {getPreviousLesson() && (
                    <button
                      onClick={handlePreviousLesson}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Previous Lesson
                    </button>
                  )}
                  {getNextLesson() && (
                    <button
                      onClick={handleNextLesson}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Next Lesson
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400">
              Select a lesson to begin
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePage; 