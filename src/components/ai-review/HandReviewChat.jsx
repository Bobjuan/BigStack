import React, { useState, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

const API_URL = 'http://127.0.0.1:5000/ask';

const fieldList = [
  'hand', 'position', 'villain_position', 'stack', 'game_type', 'preflop_action',
  'flop', 'flop_action', 'turn', 'turn_action', 'river', 'river_action', 'other_notes'
];

const HandReviewChat = () => {
  const [form, setForm] = useState({
    hand: '', position: '', villain_position: '', stack: '', game_type: '', preflop_action: '',
    flop: '', flop_action: '', turn: '', turn_action: '', river: '', river_action: '', other_notes: ''
  });
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Welcome to Hand Review mode! Fill out the form below to analyze a specific hand.' }
  ]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState({});
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Removed scrollIntoView to prevent auto-scrolling to chatbot area
  }, [messages]);

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

  // LocalStorage helpers
  const getRecentInputs = (field) => {
    const key = 'recent_' + field;
    const items = localStorage.getItem(key);
    return items ? JSON.parse(items) : [];
  };
  const addRecentInput = (field, value) => {
    if (!value.trim()) return;
    const key = 'recent_' + field;
    const items = getRecentInputs(field);
    const uniqueItems = items.filter(item => item.toLowerCase() !== value.toLowerCase());
    uniqueItems.unshift(value);
    localStorage.setItem(key, JSON.stringify(uniqueItems.slice(0, 5)));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name !== 'other_notes') showSuggestions(name, value);
  };

  const showSuggestions = (field, value) => {
    const recents = getRecentInputs(field);
    const filtered = value ? recents.filter(item => item.toLowerCase().includes(value.toLowerCase())) : recents;
    setSuggestions(s => ({ ...s, [field]: filtered }));
  };

  const selectSuggestion = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setSuggestions(s => ({ ...s, [field]: [] }));
    addRecentInput(field, value);
  };

  const sendHandReview = async () => {
    // Save all fields except notes to recents
    Object.entries(form).forEach(([field, value]) => {
      if (field !== 'other_notes') addRecentInput(field, value);
    });
    setMessages(msgs => [...msgs, { sender: 'user', text: 'Hand Review Request:\n' + JSON.stringify(form, null, 2) }]);
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: form, mode: 'hand-review' })
      });
      const data = await res.json();
      setMessages(msgs => [...msgs, { sender: 'bot', text: data.response }]);
      setForm({
        hand: '', position: '', villain_position: '', stack: '', game_type: '', preflop_action: '',
        flop: '', flop_action: '', turn: '', turn_action: '', river: '', river_action: '', other_notes: ''
      });
    } catch (e) {
      setMessages(msgs => [...msgs, { sender: 'bot', text: 'Sorry, there was an error processing your hand review request.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#1b1f2b] min-h-screen w-full px-6">
      <div className="max-w-3xl mx-auto py-8">
        {/* <a href="/" className="inline-block bg-[#2f3542] text-white rounded px-6 py-3 hover:bg-[#3a4052] border border-gray-700 mb-8 mt-8 mx-0 md:mx-6">2190 Back to Home</a> */}
        <div className="chat-container overflow-y-auto mb-4 bg-[#1b1f2b] rounded-lg p-4 border border-gray-700" style={{ minHeight: 300, maxHeight: 400 }}>
          {messages.map((msg, i) => (
            <div key={i} className={
              'flex items-end mb-2 ' + (msg.sender === 'user' ? 'justify-end' : 'justify-start')
            }>
              {msg.sender === 'bot' && (
                <span className="mr-2 flex-shrink-0" title="Bot">
                  {/* Robot SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="36" height="36" className="text-blue-400"><circle cx="12" cy="12" r="10" fill="#23273a"/><rect x="7" y="9" width="10" height="6" rx="3" fill="#60a5fa"/><circle cx="9" cy="12" r="1" fill="#fff"/><circle cx="15" cy="12" r="1" fill="#fff"/><rect x="11" y="6" width="2" height="3" rx="1" fill="#60a5fa"/></svg>
                </span>
              )}
              <div className={
                msg.sender === 'user'
                  ? 'bg-blue-700 text-white rounded-lg p-3 max-w-[80%] text-right'
                  : 'bg-[#2f3542] text-white rounded-lg p-3 max-w-[80%]'
              }>
                {msg.sender === 'bot' ? (
                  <span dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(marked.parse(msg.text))
                  }} />
                ) : (
                  <pre className="whitespace-pre-wrap">{msg.text}</pre>
                )}
              </div>
              {msg.sender === 'user' && (
                <span className="ml-2 flex-shrink-0" title="User">
                  {/* Human outline SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" width="28" height="28" className="text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" /></svg>
                </span>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-end mb-2 justify-start">
              <span className="mr-2 flex-shrink-0" title="Bot">
                {/* Robot SVG (36px) */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="36" height="36" className="text-blue-400"><circle cx="12" cy="12" r="10" fill="#23273a"/><rect x="7" y="9" width="10" height="6" rx="3" fill="#60a5fa"/><circle cx="9" cy="12" r="1" fill="#fff"/><circle cx="15" cy="12" r="1" fill="#fff"/><rect x="11" y="6" width="2" height="3" rx="1" fill="#60a5fa"/></svg>
              </span>
              <div className="bg-[#2f3542] text-white rounded-lg p-3 max-w-[80%] flex gap-1 items-center">
                <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-bounce mr-1"></span>
                <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-bounce mr-1"></span>
                <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <form className="grid grid-cols-2 gap-3 mb-4" onSubmit={e => { e.preventDefault(); sendHandReview(); }}>
          {fieldList.slice(0, 12).map(field => (
            <div key={field} className="relative">
              <input
                type="text"
                name={field}
                value={form[field]}
                onChange={handleInputChange}
                onFocus={() => showSuggestions(field, form[field])}
                placeholder={field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                className="px-6 py-4 border border-gray-700 rounded-lg w-full mb-1 !bg-[#23273a] !text-white !placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
                autoComplete="off"
                disabled={loading}
              />
              {suggestions[field] && suggestions[field].length > 0 && (
                <div className="absolute left-0 right-0 bg-[#23273a] border border-gray-700 rounded-lg z-10 max-h-40 overflow-y-auto">
                  <div className="px-2 py-1 text-xs text-gray-400 border-b border-gray-700">Recent {field.replace(/_/g, ' ')}</div>
                  {suggestions[field].map((item, idx) => (
                    <div key={idx} className="px-2 py-1 cursor-pointer hover:bg-blue-900 text-white" onClick={() => selectSuggestion(field, item)}>
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="col-span-2">
            <textarea
              name="other_notes"
              value={form.other_notes}
              onChange={handleInputChange}
              placeholder="Reads or other notes / context..."
              rows={3}
              className="w-full px-6 py-4 border border-gray-700 rounded-lg mb-2 !bg-[#23273a] !text-white !placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
              disabled={loading}
            />
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full h-[56px] px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors border border-blue-700 flex items-center justify-center text-base font-semibold"
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Analyze Hand'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HandReviewChat; 