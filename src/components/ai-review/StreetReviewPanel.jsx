import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

const API_URL = 'http://127.0.0.1:5000/ask';

const STREETS = ['Preflop', 'Flop', 'Turn', 'River', 'Showdown'];

export default function StreetReviewPanel({ history, heroId, streetIndex = 0 }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!history || !heroId) return;

    const fetchAnalysis = async () => {
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
        console.log('AI Response received:', data.response);
        console.log('Full response data:', data);
        setAnalysis(data.response); // expecting markdown string keyed by street headings
      } catch (err) {
        console.error('Error fetching analysis:', err);
        setError(err.message || 'Failed to load analysis');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [history, heroId]);

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
    <div className="h-full overflow-y-auto pr-2">
      <div className="bg-[#2f3542] rounded-lg p-4 border border-gray-700">
        <h3 className="text-lg font-bold text-green-300 mb-2">{currentStreet}</h3>
        <div
          className="prose prose-invert text-gray-200 max-w-none"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(currentSection)) }}
        />
      </div>
    </div>
  );
}
