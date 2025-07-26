import React, { useState, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

const API_URL = 'http://127.0.0.1:5000/ask';

const RandomQuestionsChat = ({ isWidget, inputValue, setInputValue, lessonsMode }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: lessonsMode
      ? 'Hey Poker Player! I\'m P.H.I.L. - your Poker Hands Intuitive Language assistant. Ask me anything about the highlighted text!'
      : 'Welcome! I\'m P.H.I.L. - your Poker Hands Intuitive Language assistant. Ask me any poker-related question and I\'ll help you improve your game!' }
  ]);
  const [questionInput, setQuestionInput] = useState('');
  const [internalInput, setInternalInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Use controlled input if props provided, else fallback to internal state
  const highlightedText = typeof inputValue === 'string' ? inputValue : internalInput;
  const setHighlightedText = typeof setInputValue === 'function' ? setInputValue : setInternalInput;

  useEffect(() => {
    // Configure marked for syntax highlighting
    marked.setOptions({
      gfm: true,
      breaks: true,
      highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(code, { language: lang }).value;
          } catch (err) {}
        }
        try {
          return hljs.highlightAuto(code).value;
        } catch (err) {}
        return code;
      }
    });
  }, []);

  const sendMessage = async (customQuestion) => {
    const question = typeof customQuestion === 'string' ? customQuestion : questionInput;
    if (!question.trim() && !(lessonsMode && highlightedText)) return;
    let fullMessage = question.trim();
    if (lessonsMode && highlightedText) {
      // Compose a mini prompt for the lessons page
      fullMessage = `This question is about a lesson. The highlighted text from the lesson is: "${highlightedText}". The user's question about the text is: ${question.trim()}`;
    }
    setMessages(msgs => [...msgs, { sender: 'user', text: fullMessage }]);
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: fullMessage, mode: 'random' })
      });
      const data = await res.json();
      setMessages(msgs => [...msgs, { sender: 'bot', text: data.response }]);
    } catch (e) {
      setMessages(msgs => [...msgs, { sender: 'bot', text: 'Sorry, there was an error processing your request. Please try again!' }]);
    }
    setLoading(false);
    setQuestionInput('');
    // Do not clear highlighted text, so user can ask multiple questions about the same highlight
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const EXAMPLE_QUESTIONS = [
    "What's the optimal 3-betting range from the cutoff?",
    "How should I play AK suited on a dry flop?",
    "What are the key differences between cash games and tournaments?"
  ];

  return (
    <div className={isWidget ? "w-full h-full flex flex-col" : "w-full"}>
      <div className={isWidget ? "p-0 flex flex-col h-full" : "w-full"}>
        {/* Chat messages and example questions inside chat area */}
        <div
          className="chat-container clean-chat-bubble"
          style={isWidget ? { flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' } : { maxHeight: 500, minHeight: 300, overflowY: 'auto' }}
        >
          {/* Render the first bot message */}
          {messages.length > 0 && (
            <div
              className={
                messages[0].sender === 'bot'
                  ? 'chat-row-bot flex items-center gap-5 mb-4 ml-0 mr-16'
                  : 'chat-row-user flex flex-row items-center gap-2 mb-4 mr-0 ml-16 justify-end'
              }
            >
              {messages[0].sender === 'bot' && (
                <div className="flex-shrink-0 flex items-center justify-center" title="P.H.I.L.">
                  <div className="chip-circle w-20 h-20 rounded-full flex items-center justify-center">
                    <img
                      src="/images/shark.png"
                      alt="P.H.I.L."
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                </div>
              )}
              <div className={
                messages[0].sender === 'user'
                  ? 'user-message'
                  : 'bot-message'
              }>
                {messages[0].sender === 'bot' ? (
                  <span dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(marked.parse(messages[0].text))
                  }} />
                ) : (
                  messages[0].text
                )}
              </div>
              {messages[0].sender === 'user' && (
                <div className="flex-shrink-0 flex items-center justify-center" title="You">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Example Questions Suggestions (under bot message, only if no user messages yet) */}
          {messages.length === 1 && messages[0].sender === 'bot' && (
            <div className="suggested-questions">
              {EXAMPLE_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  className="suggestion-chip"
                  onClick={() => {
                    setQuestionInput(q);
                    setTimeout(() => {
                      sendMessage(q);
                    }, 0);
                  }}
                  tabIndex={0}
                  type="button"
                >
                  {q}
                </button>
              ))}
            </div>
          )}
          {/* Render the rest of the messages (if any) */}
          {messages.slice(1).map((msg, i) => (
            <div
              key={i + 1}
              className={
                msg.sender === 'bot'
                  ? 'chat-row-bot flex items-center gap-5 mb-4 ml-0 mr-16'
                  : 'chat-row-user flex flex-row items-center gap-2 mb-4 mr-0 ml-16 justify-end'
              }
            >
              {msg.sender === 'bot' && (
                <div className="flex-shrink-0 flex items-center justify-center" title="P.H.I.L.">
                  <div className="chip-circle w-20 h-20 rounded-full flex items-center justify-center">
                    <img
                      src="/images/shark.png"
                      alt="P.H.I.L."
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                </div>
              )}
              <div className={
                msg.sender === 'user'
                  ? 'user-message'
                  : 'bot-message'
              }>
                {msg.sender === 'bot' ? (
                  <span dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(marked.parse(msg.text))
                  }} />
                ) : (
                  msg.text
                )}
              </div>
              {msg.sender === 'user' && (
                <div className="flex-shrink-0 flex items-center justify-center" title="You">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-4 mb-4 ml-2 mr-8">
              <div className="flex-shrink-0 flex items-center justify-center" title="P.H.I.L.">
                <div className="chip-circle w-20 h-20 rounded-full flex items-center justify-center">
                  <img
                    src="/images/shark.png"
                    alt="P.H.I.L."
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
              </div>
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        
        <div className={isWidget ? "flex flex-col gap-3 p-3 mt-0" : "flex flex-col gap-3 mt-4"}>
          {/* Highlighted text area (read-only, always visible in lessonsMode) */}
          {lessonsMode && (
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Highlighted Text:</label>
              <textarea
                className="w-full px-4 py-3 rounded-xl border border-gray-700/50 bg-gray-800/50 text-white text-sm resize-none min-h-[40px] max-h-[120px] cursor-not-allowed opacity-80 backdrop-blur-sm"
                value={highlightedText}
                placeholder="Highlighted text will appear here!"
                readOnly
                tabIndex={-1}
                style={{overflowY: 'auto'}} />
            </div>
          )}
          
          {/* User question input */}
          <div className="flex gap-3 items-center">
            <div className="input-wrapper flex-1">
              <textarea
                className="w-full px-4 py-3 rounded-xl border border-gray-700/50 bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base resize-none min-h-[56px] max-h-[220px] backdrop-blur-sm transition-all duration-300"
                placeholder={lessonsMode ? "Ask a question about the highlighted text above..." : "Ask P.H.I.L. any poker question..."}
                value={questionInput}
                onChange={e => setQuestionInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                rows={Math.min(8, Math.max(2, questionInput.split('\n').length))}
                style={{overflowY: 'auto'}} />
            </div>
            <button
              className="send-button h-[56px] px-6 py-3 rounded-xl disabled:opacity-50 flex items-center justify-center transition-all duration-300"
              onClick={sendMessage}
              disabled={loading || (!questionInput.trim() && !(lessonsMode && highlightedText))}
              style={{ minWidth: 56 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RandomQuestionsChat; 