import React, { useState, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

const API_URL = 'http://127.0.0.1:5000/ask';

const DEFAULT_FLOATING_PROMPT = 'Can you review my stats and leaks and give me advice?';
const STARTER_MESSAGE = "Hi! I'm P.H.I.L., your Poker AI Coach. I can explain your stats, leaks, and give you advice on how to improve. Click on any 'Ask P.H.I.L.' button for tailored help, or just ask me anything about your game!";

function summarizeContext(context) {
  if (!context) return '';
  let summary = '';
  if (context.vpip !== undefined && context.pfr !== undefined) {
    summary += `My VPIP is ${context.vpip.toFixed(1)}% and my PFR is ${context.pfr.toFixed(1)}%. `;
  }
  if (context.leaks && context.leaks.length > 0) {
    summary += `My main leak is '${context.leaks[0].name}'. `;
  }
  if (context.playerType) {
    summary += `My primary style is '${context.playerType}'. `;
  }
  return summary.trim();
}

export default function CoachPanel({ open, onClose, context, initialQuestion }) {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I\'m P.H.I.L. (Poker Hands Intuitive Language), your AI Poker Coach. Ask me anything about your stats, leaks, or how to improve your game!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSentInitial, setHasSentInitial] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
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

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  // Send initial question with context if provided
  useEffect(() => {
    if (open && !hasSentInitial) {
      // Floating button: show starter message
      if (initialQuestion === DEFAULT_FLOATING_PROMPT) {
        setMessages([
          { sender: 'bot', text: STARTER_MESSAGE }
        ]);
        setHasSentInitial(true);
        return;
      }
      // Contextual Ask PHIL: summarize context
      if (initialQuestion && context) {
        const summary = summarizeContext(context);
        sendMessage(summary ? `${summary} ${initialQuestion}` : initialQuestion, true);
        setHasSentInitial(true);
        return;
      }
      // Fallback: just send the initial question
      if (initialQuestion) {
        sendMessage(initialQuestion, true);
        setHasSentInitial(true);
      }
    }
    if (!open) {
      setHasSentInitial(false);
      setMessages([
        { sender: 'bot', text: 'Hi! I\'m P.H.I.L. (Poker Hands Intuitive Language), your AI Poker Coach. Ask me anything about your stats, leaks, or how to improve your game!' }
      ]);
      setInput('');
    }
  }, [open, initialQuestion]);

  const sendMessage = async (msg, isInitial = false) => {
    if (!msg.trim()) return;
    let fullMessage = msg.trim();
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
    if (!isInitial) setInput('');
  };

  const handleSend = () => {
    if (!loading && input.trim()) {
      sendMessage(input);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !loading && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-end bg-black/40">
      <div className="w-full max-w-md bg-[#181c23] rounded-t-2xl md:rounded-2xl shadow-2xl p-4 flex flex-col h-[70vh] md:h-[80vh] border-2 border-green-700 relative">
        <div className="flex items-center mb-2">
          <img src="/images/shark.png" alt="P.H.I.L." className="w-10 h-10 rounded-full mr-3 border-2 border-green-400 bg-black" />
          <div>
            <div className="font-bold text-green-300 text-lg">P.H.I.L.</div>
            <div className="text-xs text-gray-400">Poker Hands Intuitive Language</div>
          </div>
          <button onClick={onClose} className="ml-auto text-gray-400 hover:text-red-400 text-2xl font-bold px-2">&times;</button>
        </div>
        <div className="flex-1 overflow-y-auto bg-[#1b1f2b] rounded-lg p-3 border border-gray-700 mb-2">
          {messages.map((msg, i) => (
            <div key={i} className={
              'flex items-end mb-2 ' + (msg.sender === 'user' ? 'justify-end' : 'justify-start')
            }>
              {msg.sender === 'bot' && (
                <span className="mr-2 flex-shrink-0" title="P.H.I.L.">
                  {/* Coach SVG or avatar */}
                  <img src="/images/shark.png" alt="P.H.I.L." className="w-8 h-8 rounded-full border border-green-400 bg-black" />
                </span>
              )}
              <div className={
                msg.sender === 'user'
                  ? 'bg-green-700 text-white rounded-lg p-3 max-w-[80%] text-right'
                  : 'bg-[#2f3542] text-white rounded-lg p-3 max-w-[80%]'
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
                <span className="ml-2 flex-shrink-0" title="You">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="28" height="28" className="text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" /></svg>
                </span>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-end mb-2 justify-start">
              <span className="mr-2 flex-shrink-0" title="P.H.I.L.">
                <img src="/images/shark.png" alt="P.H.I.L." className="w-8 h-8 rounded-full border border-green-400 bg-black" />
              </span>
              <div className="bg-[#2f3542] text-white rounded-lg p-3 max-w-[80%] flex gap-1 items-center">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-bounce mr-1"></span>
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-bounce mr-1"></span>
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="flex gap-3 items-center mt-2">
          <textarea
            className="flex-1 px-5 py-3 rounded-lg border border-gray-700 !bg-[#23273a] !text-white !placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 text-base resize-none min-h-[48px] max-h-[120px] scrollbar-thin scrollbar-thumb-[#4b5563] scrollbar-track-[#23273a]"
            placeholder="Ask P.H.I.L. anything about your poker stats, leaks, or improvement..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            rows={Math.min(6, Math.max(2, input.split('\n').length))}
            style={{overflowY: 'auto'}}
          />
          <button
            className="h-[48px] px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 border border-green-700 disabled:opacity-50 flex items-center justify-center"
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{ minWidth: 48 }}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
} 