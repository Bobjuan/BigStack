import React from 'react';
import IndLessLayout from '../../../components/layout/IndLessLayout';

const LessonContent = () => (
  <div className="space-y-8">
    <h4 className="text-2xl font-bold mb-4">
      Playing Against Limpers
    </h4>

    <h5 className="text-xl font-bold mb-4 mt-6">
      Understanding Limper Types
    </h5>
    <p>
      Before developing a strategy against limpers, it's crucial to understand the different types of players who limp:
    </p>
    <ul className="list-disc pl-6">
      <li>
        <strong>Common Limper</strong>
        <span className="text-sm text-gray-500">
          Raises premium hands, limps marginal/junky hands, folds trash. When they limp, you can often remove top 10% of hands from their range. They'll often fold to a sizable preflop raise, or at best flop a marginal hand.
        </span>
      </li>
      <li>
        <strong>Trappy Limper</strong>
        <span className="text-sm text-gray-500">
          Limps their entire playable range, including premium hands. More dangerous as they can have strong hands in their limping range.
        </span>
      </li>
      <li>
        <strong>Position-Based Limper</strong>
        <span className="text-sm text-gray-500">
          Limps a mix of monsters and speculative hands from early position, but a wide range from late position.
        </span>
      </li>
    </ul>

    <h5 className="text-xl font-bold mb-4 mt-6">
      Strategy Against One Limper
    </h5>
    
    <h6 className="text-lg font-bold mb-4">
      Early Position Limper (Wide Range)
    </h6>
    <ul className="list-disc pl-6">
      <li>
        <strong>When You're Also in Early Position</strong>
        <span className="text-sm text-gray-500">
          • Raise with strong hands (9-9+, A-J+, K-Q+)
          • Call with drawing hands (small pairs, suited connectors)
          • Fold junk hands (weak Ax, unconnected low cards)
          • With marginal hands like K-J or J-T, either raise or fold if players behind might squeeze
        </span>
      </li>
      <li>
        <strong>When You're in Middle/Late Position</strong>
        <span className="text-sm text-gray-500">
          • More inclined to raise a wider range (including Ax, suited connectors)
          • Raising for heads-up in position is often better than limping behind with draws
        </span>
      </li>
    </ul>

    <h6 className="text-lg font-bold mb-4 mt-4">
      Early Position Limper (Tight Range)
    </h6>
    <ul className="list-disc pl-6">
      <li>
        <strong>Adjusting to Tight Limpers</strong>
        <span className="text-sm text-gray-500">
          • Only raise premium hands
          • Call with drawing hands
          • Fold marginal hands (A-9, K-T)
          • With hands like A-J or K-Q, limp along if they're truly only limping premiums
        </span>
      </li>
    </ul>

    <h5 className="text-xl font-bold mb-4 mt-6">
      Strategy Against Multiple Limpers
    </h5>
    <ul className="list-disc">
      <li>
        <strong>Premium Hands</strong>
        <span className="text-sm text-gray-500">
          • Raise for value
          • If limpers are wide, your value range widens (can raise 7-7, A-T, K-J)
          • Adjust bet size (larger to make them fold, pot-sized or less to get calls)
        </span>
      </li>
      <li>
        <strong>Marginal Hands</strong>
        <span className="text-sm text-gray-500">
          • Feel free to limp along with hands like Q-J, J-T
          • Profitable if you play well postflop
          • Be cautious with weaker hands like Q-9, J-8, T-9
        </span>
      </li>
      <li>
        <strong>Drawing Hands</strong>
        <span className="text-sm text-gray-500">
          • More willing to see flops
          • Avoid raising small pairs over multiple limpers
          • See cheap flops with suited connectors and small pairs
          • Be aware of domination risk with flush draws
        </span>
      </li>
    </ul>

    <h5 className="text-xl font-bold mb-4 mt-6">
      Dealing with Limp-Reraises
    </h5>
    <ul className="list-disc">
      <li>
        <strong>Against Nuts-Only Limp-Reraisers</strong>
        <span className="text-sm text-gray-500">
          • Continue only with very strong hands (AA, KK)
          • Don't pay off with hands like QQ, JJ, AK
        </span>
      </li>
      <li>
        <strong>Against Mixed-Range Limp-Reraisers</strong>
        <span className="text-sm text-gray-500">
          • More difficult to play against
          • If you 4-bet, they only continue with their best hands
          • Call their limp-reraise with your entire profitable playing range
          • Adjust calling range based on how wide/bluffy their limp-reraising range is
        </span>
      </li>
    </ul>

    <h5 className="text-xl font-bold mb-4 mt-6">
      Key Tips
    </h5>
    <ul className="list-disc">
      <li>
        <strong>Image Matters</strong>
        <span className="text-sm text-gray-500">
          If opponents expect you to raise limps frequently, they'll fight back more. If they see you as straightforward, look for spots to steal their limps.
        </span>
      </li>
      <li>
        <strong>Position is Crucial</strong>
        <span className="text-sm text-gray-500">
          Play more aggressively in position, more cautiously out of position. Position allows you to control pot size and make better decisions postflop.
        </span>
      </li>
      <li>
        <strong>Stack Sizes Matter</strong>
        <span className="text-sm text-gray-500">
          With deeper stacks, you can play more speculative hands that can make the nuts. With shorter stacks, prefer hands that make strong top pair.
        </span>
      </li>
    </ul>
  </div>
);

export default function PlayingAgainstLimpers() {
  return <IndLessLayout><LessonContent /></IndLessLayout>;
} 