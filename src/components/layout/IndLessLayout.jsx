import React, { useRef, useState } from 'react';
import RandomQuestionsChat from '../ai-review/RandomQuestionsChat';
import styles from './IndLessLayout.module.css';

const MIN_LESSON_WIDTH = 300;
const MIN_CHAT_WIDTH = 300;

const IndLessLayout = ({ children }) => {
  const [chatInput, setChatInput] = useState('');
  const lessonRef = useRef(null);
  const [lessonWidth, setLessonWidth] = useState(0.55); // percent of container (default 55% for lesson, 45% for bot)
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  // Listen for text selection in the lesson content
  React.useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection) return;
      const selectedText = selection.toString();
      // Only auto-copy if selection is inside the lesson content
      if (
        selectedText &&
        lessonRef.current &&
        selection.anchorNode &&
        lessonRef.current.contains(selection.anchorNode)
      ) {
        setChatInput(selectedText);
      }
    };
    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('keyup', handleSelection);
    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('keyup', handleSelection);
    };
  }, []);

  // Drag logic for resizer
  React.useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let x = e.clientX - rect.left;
      // Clamp min/max widths
      const minLesson = MIN_LESSON_WIDTH;
      const minChat = MIN_CHAT_WIDTH;
      const maxLesson = rect.width - minChat;
      x = Math.max(minLesson, Math.min(x, maxLesson));
      setLessonWidth(x / rect.width);
    };
    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const startDrag = (e) => {
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    e.preventDefault();
  };

  return (
    <div className={styles.indLessLayout}>
      <div className={styles.mainContent} ref={containerRef} style={{flexDirection: 'row', position: 'relative'}}>
        {/* Lesson Content */}
        <div
          className={styles.lessonContent}
          ref={lessonRef}
          style={{
            flexBasis: `calc(${lessonWidth * 100}% - 8px)`,
            minWidth: MIN_LESSON_WIDTH,
            maxWidth: `calc(100% - ${MIN_CHAT_WIDTH + 16}px)`
          }}
        >
          {children}
        </div>
        {/* Resizer Bar */}
        <div
          className={styles.resizer}
          onMouseDown={startDrag}
          title="Drag to resize"
        />
        {/* Chatbot Section */}
        <div
          className={styles.chatbotSection}
          style={{
            flexBasis: `calc(${(1 - lessonWidth) * 100}% - 8px)`,
            minWidth: MIN_CHAT_WIDTH,
            maxWidth: `calc(100% - ${MIN_LESSON_WIDTH + 16}px)`
          }}
        >
          {/* Explanation area above chatbot */}
          <div className={styles.chatbotExplanation}>
            <span>
              <b>How to use the Chatbot:</b> Highlight any text in the lesson to ask a question about it, or type your own question below. The chatbot can help clarify concepts, explain strategies, or answer anything about the lesson content!
            </span>
          </div>
          <div style={{flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflowY: 'auto'}}>
            <h2 className={styles.chatbotTitle}>Ask the Poker Chatbot</h2>
            <RandomQuestionsChat isWidget inputValue={chatInput} setInputValue={setChatInput} lessonsMode={true} hideExampleQuestions={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndLessLayout; 