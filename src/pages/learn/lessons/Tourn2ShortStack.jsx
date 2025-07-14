import React from 'react';
import IndLessLayout from '../../../components/layout/IndLessLayout';

const LessonContent = () => (
  <div className="space-y-8">
    <section>
      <h2 className="text-2xl font-bold mb-2">Short Stack Play & Shoving</h2>
      <p className="mb-4">Playing a short stack in tournaments requires discipline and aggression. Your main weapons are the all-in shove and the re-shove. Understanding push/fold ranges is critical to maximizing your chances of survival and chip accumulation.</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Use push/fold charts to know which hands to shove from each position and stack size.</li>
        <li>Don’t be afraid to go all-in with the correct hands—waiting too long can be a bigger mistake.</li>
        <li>Look for spots to re-shove over loose openers, especially when you have fold equity.</li>
        <li>As your stack gets shorter, your range to call all-ins should tighten up.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Push/Fold Charts & Ranges</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>At 10bb, shove any pair, most suited aces, and broadways from late position.</li>
        <li>At 15bb, you can add suited connectors and some suited kings to your shoving range.</li>
        <li>Use online tools like SnapShove or ICMizer to practice push/fold spots.</li>
        <li>Remember: calling ranges are much tighter than shoving ranges—don’t call off light.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Advanced Short Stack Tactics</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>Re-shove over loose openers with hands that have blockers (e.g., A-x, K-x suited).</li>
        <li>Pay attention to stack sizes behind you—avoid shoving into big stacks who can call wide.</li>
        <li>Don’t be afraid to take a stand with the right hand—timid play is punished.</li>
        <li>Use fold equity to your advantage: sometimes the threat of elimination is enough to get folds.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Example: 8 Big Blinds in the Cutoff</h3>
      <p>With 8bb in the cutoff, you should be shoving a wide range—any pair, most suited aces, and many suited connectors. If you wait for a premium hand, the blinds will eat you up.</p>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Key Takeaways</h3>
      <ul className="list-disc ml-6">
        <li>Don’t be scared to shove—timid play is punished in tournaments.</li>
        <li>Study push/fold charts and practice your ranges away from the table.</li>
        <li>Survival is important, but so is building a stack for a deep run.</li>
      </ul>
    </section>
  </div>
);

export default function Tourn2ShortStack() {
  return (
    <IndLessLayout lessonId="tourn-2">
      <LessonContent />
    </IndLessLayout>
  );
} 