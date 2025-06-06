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

  // Get the lesson component based on lessonId
  const LessonComponent = selectedLesson ? LessonComponents[selectedLesson.id] : null;

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className={`bg-[#1F2127] w-80 flex-shrink-0 transition-all duration-300 ${isSidebarOpen ? '' : '-ml-80'}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">{module?.title}</h2>
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
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
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {LessonComponent ? (
            <div>
              <LessonComponent />
              <div className="mt-8 flex justify-between items-center">
                <button
                  onClick={() => markLessonComplete(selectedLesson.id)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Mark Complete
                </button>
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