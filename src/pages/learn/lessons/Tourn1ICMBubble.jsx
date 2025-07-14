import React from 'react';
import IndLessLayout from '../../../components/layout/IndLessLayout';

const LessonContent = () => (
  <div className="space-y-8">
    <section>
      <h2 className="text-2xl font-bold mb-2">ICM & Bubble Pressure</h2>
      <p className="mb-4">The Independent Chip Model (ICM) is a fundamental concept in tournament poker. It changes the value of your chips based on payout structure and stack sizes, especially near the bubble and pay jumps.</p>
      <ul className="list-disc ml-6 mb-4">
        <li>ICM means chips lost are worth more than chips won—survival is key.</li>
        <li>On the bubble, play tighter when covered and apply pressure when you cover others.</li>
        <li>Use ICM calculators to study close spots and understand risk/reward.</li>
        <li>Fold marginal hands that could bust you before the money, unless you have a clear edge.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Advanced ICM Concepts</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>ICMizer and similar tools can help you analyze real hand histories and improve your bubble play.</li>
        <li>Pay attention to stack sizes at your table—ICM pressure is highest when there are several short stacks.</li>
        <li>Sometimes, folding a strong hand (like AQ) is correct if calling risks your tournament life and there are shorter stacks still to act.</li>
        <li>As the bubble approaches, avoid confrontations with big stacks unless you have a premium hand.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Practical Example</h3>
      <p>You're on the bubble of a tournament. You have a medium stack, and a big stack shoves into you. Even with a decent hand, you should fold more often than in a cash game, because busting now is a disaster for your expected value.</p>
      <p>Suppose you have 20bb and the big stack covers you. You hold AJs in the cutoff, and the big stack shoves from the button. If there are two short stacks at the table, folding is often correct—even though AJs is strong—because you can ladder up if they bust first.</p>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Bubble Aggression</h3>
      <ul className="list-disc ml-6 mb-4">
        <li>As a big stack, open wider and 3-bet more often to pressure medium stacks.</li>
        <li>Short stacks should avoid unnecessary risks and look for spots to double up when they have fold equity.</li>
        <li>Medium stacks are often the most handcuffed—use this to your advantage if you cover them.</li>
      </ul>
    </section>
    <section>
      <h3 className="text-xl font-semibold mb-2">Key Takeaways</h3>
      <ul className="list-disc ml-6">
        <li>ICM pressure increases as you approach the money and final table.</li>
        <li>Be aggressive as a big stack, but cautious as a short or medium stack.</li>
        <li>Study ICM spots away from the table to improve your intuition.</li>
        <li>Survival is often more important than chip accumulation near the bubble.</li>
      </ul>
    </section>
  </div>
);

export default function Tourn1ICMBubble() {
  return (
    <IndLessLayout lessonId="tourn-1">
      <LessonContent />
    </IndLessLayout>
  );
} 