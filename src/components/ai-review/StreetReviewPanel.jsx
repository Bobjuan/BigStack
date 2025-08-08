import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

const API_URL = 'http://127.0.0.1:5000/ask';

const STREETS = ['Preflop', 'Flop', 'Turn', 'River', 'Showdown'];

export default function StreetReviewPanel({ history, heroId, streetIndex = 0 }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);

  const requestAnalysis = async () => {
    if (!history || !heroId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'hand-review',
          message: { heroId, history }
        })
      });
      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setAnalysis(data.response);
    } catch (err) {
      setError(err.message || 'Failed to load analysis');
    } finally {
      setLoading(false);
    }
  };

  // Only show call-to-action until user clicks
  useEffect(() => {
    if (history && heroId) setReady(true);
  }, [history, heroId]);

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Game Review</h3>
          <p className="text-sm text-gray-400">Have P.H.I.L. analyze each street and highlight leaks.</p>
        </div>
        <button
          onClick={requestAnalysis}
          disabled={!ready || loading}
          className="px-4 py-2 rounded-lg font-semibold bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50"
        >
          {loading ? 'Analyzing…' : 'Analyze This Hand'}
        </button>
        <div className="text-xs text-gray-500 max-w-sm">
          <p className="mb-1">The AI will analyze:</p>
          <ul className="list-disc list-inside text-left space-y-1">
            <li>Preflop action and position</li>
            <li>Flop texture and betting patterns</li>
            <li>Turn and river decisions</li>
            <li>Overall hand strategy</li>
          </ul>
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mb-4"></div>
        <p className="text-gray-400 text-center">
          Analyzing hand with AI...<br />
          <span className="text-xs text-gray-500">This may take a few seconds</span>
        </p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="text-red-400 mb-2">Failed to load analysis</p>
        <p className="text-xs text-gray-500">{error}</p>
      </div>
    );
  }
  
  if (!analysis) return null;

  // Parse the markdown to extract sections by street
  const sections = {};
  let current = 'Preflop';
  analysis.split(/\n+/).forEach(line => {
    const match = line.match(/^##+\s*(.+)/i);
    if (match) {
      current = match[1];
      sections[current] = '';
    } else {
      sections[current] = (sections[current] || '') + line + '\n';
    }
  });

  // Get the current street name based on streetIndex
  const currentStreet = STREETS[streetIndex];
  
  // Find the section that matches the current street (handling card info in street names)
  const currentSection = Object.keys(sections).find(sectionName => {
    // Extract just the base street name (e.g., "Flop" from "Flop (9♦3♣Q♠)")
    const baseStreetName = sectionName.split(' ')[0];
    return baseStreetName === currentStreet;
  }) ? sections[Object.keys(sections).find(sectionName => {
    const baseStreetName = sectionName.split(' ')[0];
    return baseStreetName === currentStreet;
  })] : undefined;

  console.log('Current street:', currentStreet);
  console.log('Available sections:', Object.keys(sections));
  console.log('Current section content:', currentSection);

  if (!currentSection) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="text-gray-400 mb-2">No analysis available for {currentStreet}</p>
        <p className="text-xs text-gray-500">Available sections: {Object.keys(sections).join(', ')}</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pr-1">
      <div className="rounded-xl p-4 border border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-emerald-300">{currentStreet}</h3>
        </div>
        <div
          className="prose prose-invert text-gray-200 max-w-none prose-headings:text-gray-100 prose-p:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(currentSection)) }}
        />
      </div>
    </div>
  );
}
