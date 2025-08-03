import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

const API_URL = 'http://127.0.0.1:5000/ask';

const STREETS = ['Preflop', 'Flop', 'Turn', 'River', 'Showdown'];

export default function StreetReviewPanel({ history, heroId }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!history || !heroId) return;

    const fetchAnalysis = async () => {
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
        setAnalysis(data.response); // expecting markdown string keyed by street headings
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [history, heroId]);

  if (loading) return <p className="text-gray-400">Loading analysis...</p>;
  if (error) return <p className="text-red-400">Failed to load analysis.</p>;
  if (!analysis) return null;

  // naive: split by street headings provided as ### Preflop etc.
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

  return (
    <div className="space-y-4 overflow-y-auto pr-2" style={{ maxHeight: '75vh' }}>
      {STREETS.map(street => (
        sections[street] ? (
          <div key={street} className="bg-[#2f3542] rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-bold text-green-300 mb-2">{street}</h3>
            <div
              className="prose prose-invert text-gray-200 max-w-none"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(sections[street])) }}
            />
          </div>
        ) : null
      ))}
    </div>
  );
}
