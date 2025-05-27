import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';
import ReactMarkdown from 'react-markdown';
import { found01, found02, found03 } from './lessons/index.jsx';

const lessonComponents = {
  'found01': found01,
  'found02': found02,
  'found03': found03
};

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, module]);

  // Auto-select the first lesson if none is selected and lessons exist
  useEffect(() => {
    if (!selectedLesson && lessons.length > 0) {
      setSelectedLesson(lessons[0]);
    }
  }, [lessons, selectedLesson]);

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
  };

  const markLessonComplete = async (lessonId) => {
    if (!user || !module) return;
    try {
      const { error: lessonError } = await supabase
        .from('lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
        }, { onConflict: ['user_id', 'lesson_id'] });
      if (lessonError) throw lessonError;
      // Update local lessons state
      const updatedLessons = lessons.map(lesson =>
        lesson.id === lessonId ? { ...lesson, completed: true } : lesson
      );
      setLessons(updatedLessons);
      const completedCount = updatedLessons.filter(lesson => lesson.completed).length;
      const newProgress = Math.round((completedCount / updatedLessons.length) * 100);
      setProgress(newProgress);
      // Find the index of the current lesson
      const currentIndex = updatedLessons.findIndex(lesson => lesson.id === lessonId);
      if (currentIndex !== -1 && currentIndex < updatedLessons.length - 1) {
        setSelectedLesson(updatedLessons[currentIndex + 1]);
      } else {
        setSelectedLesson(updatedLessons[currentIndex]);
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  const getNextLesson = () => {
    if (!lessons || !selectedLesson) return null;
    const currentIndex = lessons.findIndex(lesson => lesson.id === selectedLesson.id);
    return lessons[currentIndex + 1] || null;
  };

  const handleNextLesson = () => {
    const nextLesson = getNextLesson();
    if (nextLesson) {
      handleLessonClick(nextLesson);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className={`bg-[#1a1a1a] w-80 min-h-screen fixed left-0 top-0 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{module?.title}</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-300 font-semibold">Progress</span>
              <span className="text-xs text-gray-400">{progress}%</span>
            </div>
            <div className="h-2 bg-[#2a2d36] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            {lessons?.map((lesson) => (
              <div key={lesson.id} className="mb-2">
                <button
                  type="button"
                  onClick={() => setSelectedLesson(lesson)}
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
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-80' : 'ml-0'}`}>
        {/* Top Navigation Bar */}
        <div className="bg-[#1a1a1a] border-b border-gray-800 p-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {!isSidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="bg-[#1a1a1a] p-2 rounded-lg hover:bg-[#2a2d36] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <h1 className="text-2xl font-bold text-white">BigStack</h1>
          </div>
          <button
            onClick={() => navigate(`/learn/course/${courseId}`)}
            className="flex items-center bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Modules
          </button>
        </div>

        <div className="max-w-4xl mx-auto p-8">
          {selectedLesson ? (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">{selectedLesson.title}</h1>
                {lessonComponents[selectedLesson.id] ? (
                  React.createElement(lessonComponents[selectedLesson.id], { lesson: selectedLesson })
                ) : (
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown>{selectedLesson.content}</ReactMarkdown>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-700">
                {!selectedLesson.completed && (
                  <button
                    onClick={async () => {
                      await markLessonComplete(selectedLesson.id);
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Mark as Complete
                  </button>
                )}
                {getNextLesson() && (
                  <button
                    onClick={handleNextLesson}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Next Lesson
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Welcome to {module?.title}</h2>
              <p className="text-gray-400 mb-8">{module?.description}</p>
              <p className="text-gray-500">Select a lesson from the sidebar to begin learning</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePage; 