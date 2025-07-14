import React from 'react';
import IndLessLayout from '../../../components/layout/IndLessLayout';

const LessonContent = () => (
  <div className="space-y-8">
    <section>
      <h2 className="text-2xl font-bold mb-2">Tilt Triggers & Control</h2>
      <p className="mb-4">Tilt is one of the most common and costly mental game leaks in poker. Recognizing your triggers and learning to control your emotions is essential for long-term success.</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Common tilt triggers: bad beats, coolers, losing to weaker players, or making mistakes.</li>
        <li>Recognize when you are tilting—physical signs include tension, frustration, or impulsive decisions.</li>
        <li>Take breaks, breathe, and reset your mindset when you feel tilt coming on.</li>
        <li>Remember: poker is a long-term game—one session or hand does not define your skill.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Advanced Tilt Management</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>Keep a tilt journal: after each session, write down what triggered tilt and how you responded.</li>
        <li>Develop a pre-session routine: meditation, breathing exercises, or positive visualization can help set your mindset.</li>
        <li>Use anchor words or physical cues (like squeezing a stress ball) to interrupt negative thought patterns.</li>
        <li>Talk to other players or a coach about your tilt experiences—community support helps.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Practical Exercise: Tilt Awareness</h3>
      <p>During your next session, rate your emotional state every 30 minutes. If you notice frustration or anger, take a 5-minute break and reset. Over time, this builds self-awareness and control.</p>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Example: Handling a Bad Beat</h3>
      <p>You get all-in with AA vs. 99 and lose to a rivered set. Instead of chasing losses, take a break, remind yourself you played well, and focus on making good decisions going forward.</p>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Key Takeaways</h3>
      <ul className="list-disc ml-6">
        <li>Self-awareness is the first step to controlling tilt.</li>
        <li>Develop routines to reset your mindset after tough hands.</li>
        <li>Long-term success comes from discipline, not short-term results.</li>
        <li>Every player experiences tilt—what matters is how you respond.</li>
      </ul>
    </section>
  </div>
);

export default function Mental1TiltTriggers() {
  return (
    <IndLessLayout lessonId="mental-1">
      <LessonContent />
    </IndLessLayout>
  );
} 