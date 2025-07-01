import React, { useState, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

const API_URL = 'http://127.0.0.1:5000/ask';

const RandomQuestionsChat = ({ isWidget, inputValue, setInputValue, lessonsMode }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: lessonsMode
      ? 'Hey! Highlighted text will appear here. Just ask a question about a highlighted area!'
      : 'Welcome to Random Questions mode! Ask any poker-related question.' }
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

  const sendMessage = async () => {
    if (!questionInput.trim() && !(lessonsMode && highlightedText)) return;
    let fullMessage = questionInput.trim();
    if (lessonsMode && highlightedText) {
      // Compose a mini prompt for the lessons page
      fullMessage = `This question is about a lesson. The highlighted text from the lesson is: "${highlightedText}". The user's question about the text is: ${questionInput.trim()}`;
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
      setMessages(msgs => [...msgs, { sender: 'bot', text: 'Sorry, there was an error processing your request.' }]);
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

  return (
    <div className={isWidget ? "w-full h-full flex flex-col" : "bg-[#1b1f2b] w-full px-6"}>
      <div className={isWidget ? "p-0 flex flex-col h-full" : "max-w-3xl mx-auto py-8"}>
        {/* Back to Home button removed */}
        <div
          className={`chat-container ${isWidget ? 'flex-1 flex flex-col overflow-y-auto' : 'overflow-y-auto'} bg-[#1b1f2b] ${isWidget ? '' : 'rounded-lg'} p-4 border border-gray-700`}
          style={isWidget ? { ...(isWidget ? { borderLeft: 'none', borderRight: 'none' } : {}) } : { maxHeight: 400, ...(isWidget ? { borderLeft: 'none', borderRight: 'none' } : {}) }}
        >
          {messages.map((msg, i) => (
            <div key={i} className={
              msg.sender === 'user'
                ? 'bg-blue-700 text-white rounded-lg p-3 mb-2 ml-auto max-w-[80%] text-right'
                : 'bg-[#2f3542] text-white rounded-lg p-3 mb-2 max-w-[80%]'
            }>
              {msg.sender === 'bot' ? (
                <span dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(marked.parse(msg.text))
                }} />
              ) : (
                msg.text
              )}
            </div>
          ))}
          {loading && (
            <div className="bg-[#2f3542] text-white rounded-lg p-3 mb-2 max-w-[80%] flex gap-1 items-center">
              <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-bounce mr-1"></span>
              <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-bounce mr-1"></span>
              <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className={isWidget ? "flex flex-col gap-2 p-3 mt-0" : "flex flex-col gap-2"}>
          {/* Highlighted text area (read-only) */}
          {lessonsMode && highlightedText && (
            <div className="mb-1">
              <textarea
                className="w-full px-4 py-2 rounded-lg border border-gray-700 !bg-[#23273a] !text-white text-xs resize-none min-h-[40px] max-h-[120px] mb-1 cursor-not-allowed opacity-80"
                value={highlightedText}
                readOnly
                tabIndex={-1}
                style={{overflowY: 'auto'}} />
            </div>
          )}
          {/* User question input */}
          <div className="flex gap-3 items-center">
            <textarea
              className="flex-1 px-5 py-3 rounded-lg border border-gray-700 !bg-[#23273a] !text-white !placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-base resize-none min-h-[56px] max-h-[220px] scrollbar-thin scrollbar-thumb-[#4b5563] scrollbar-track-[#23273a]"
              placeholder={lessonsMode ? "Ask a question about the highlighted text..." : "Ask any poker question..."}
              value={questionInput}
              onChange={e => setQuestionInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
              rows={Math.min(8, Math.max(2, questionInput.split('\n').length))}
              style={{overflowY: 'auto'}} />
            <button
              className="h-[56px] px-6 py-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 border border-blue-700 disabled:opacity-50 flex items-center justify-center"
              onClick={sendMessage}
              disabled={loading || (!questionInput.trim() && !(lessonsMode && highlightedText))}
              style={{ minWidth: 56 }}
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RandomQuestionsChat; 