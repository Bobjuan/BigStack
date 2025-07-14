import React from 'react';
import IndLessLayout from '../../../components/layout/IndLessLayout';

const LessonContent = () => (
  <div className="space-y-8">
    <section>
      <h2 className="text-2xl font-bold mb-2">Anger, Focus & Recovery</h2>
      <p className="mb-4">Poker can be an emotional rollercoaster. Learning to manage anger, maintain focus, and recover from setbacks is crucial for peak performance.</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Anger often leads to poor decisions—recognize it early and take steps to cool down.</li>
        <li>Develop routines: deep breathing, stepping away, or reviewing hands after sessions.</li>
        <li>Focus on the process, not just results—good decisions lead to long-term success.</li>
        <li>Recovery is a skill: after a tough session, review, learn, and come back stronger.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Example: Regaining Focus</h3>
      <p>After a string of bad beats, take a break, review your play, and set a goal for your next session. Focus on making the best decisions, not chasing losses.</p>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Key Takeaways</h3>
      <ul className="list-disc ml-6">
        <li>Emotional control is a major edge in poker.</li>
        <li>Develop habits to reset and refocus after setbacks.</li>
        <li>Every session is a new opportunity to improve and succeed.</li>
      </ul>
    </section>
  </div>
);

export default function Mental3AngerFocus() {
  return (
    <IndLessLayout lessonId="mental-3">
      <LessonContent />
    </IndLessLayout>
  );
} 