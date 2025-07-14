import React from 'react';
import IndLessLayout from '../../../components/layout/IndLessLayout';

const LessonContent = () => (
  <div className="space-y-8">
    <section>
      <h2 className="text-2xl font-bold mb-2">Final Table & Pay Jumps</h2>
      <p className="mb-4">The final table of a tournament is where the biggest prizes are decided. Pay jumps become significant, and every decision can have a huge impact on your earnings. Understanding how to adjust your play for pay jumps and stack sizes is crucial.</p>
      <ul className="list-disc ml-6 mb-4">
        <li>Be aware of pay jumps—sometimes survival is more important than chip accumulation.</li>
        <li>Short stacks should look for good spots to double up, but avoid unnecessary risks.</li>
        <li>Big stacks can apply pressure on medium stacks who are trying to ladder up.</li>
        <li>Medium stacks are often handcuffed by ICM and should play tighter, especially when covered.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">ICM Laddering & Pay Jump Strategy</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>Pay attention to payout structure—sometimes folding a strong hand is correct if it means moving up a pay jump.</li>
        <li>Short stacks should be patient, but not passive—look for good spots to double up, especially when others are stalling.</li>
        <li>Big stacks should attack medium stacks relentlessly, especially when pay jumps are large.</li>
        <li>Medium stacks should avoid confrontations with big stacks and focus on outlasting shorter stacks.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Advanced Final Table Examples</h3>
      <p>With 5 left and a big pay jump coming, a medium stack should avoid marginal spots against the chip leader, but can open up against shorter stacks. Big stacks should attack the medium stacks relentlessly.</p>
      <p>Suppose you are 3rd in chips with 6 left. The chip leader is on your left and is opening every hand. Tighten up, avoid marginal spots, and look for opportunities to 3-bet all-in when you have fold equity and a strong hand.</p>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Key Takeaways</h3>
      <ul className="list-disc ml-6">
        <li>Pay attention to stack sizes and payouts at the final table.</li>
        <li>Adjust your aggression based on your position and the stacks around you.</li>
        <li>ICM mistakes at the final table are the most costly in all of poker.</li>
        <li>Survival and laddering can be more valuable than chip accumulation in some spots.</li>
      </ul>
    </section>
  </div>
);

export default function Tourn3FinalTable() {
  return (
    <IndLessLayout lessonId="tourn-3">
      <LessonContent />
    </IndLessLayout>
  );
} 