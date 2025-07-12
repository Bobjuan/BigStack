import React from 'react';
import CourseIntroduction from './CourseIntroduction';
import SelfAssessment from './SelfAssessment';
import EssentialMindset from './EssentialMindset';
import CashVsTournaments from './CashVsTournaments';
import BankrollManagement from './BankrollManagement';

import TableSelection from './TableSelection';
import StartingHandSelection from './StartingHandSelection';
import PositionAndHandRanges from './PositionAndHandRanges';
import ThreeBettingStrategy from './ThreeBettingStrategy';
import BoardTextureAnalysis from './BoardTextureAnalysis';
import BetSizing from './BetSizing';
import HandReading from './HandReading';
import ExploitativePlay from './ExploitativePlay';
import MultiStreetPlanning from './MultiStreetPlanning';
import MentalGame from './MentalGame';
import Post4MultiwayPots from './Post4MultiwayPots';
import Post5TurnRiverProbing from './Post5TurnRiverProbing';
import Post6BluffingBlockers from './Post6BluffingBlockers';
import Tourn1ICMBubble from './Tourn1ICMBubble';
import Tourn2ShortStack from './Tourn2ShortStack';
import Tourn3FinalTable from './Tourn3FinalTable';
import Deep1Preflop from './Deep1Preflop';
import Deep2Postflop from './Deep2Postflop';
import Deep3OverbetsLeverage from './Deep3OverbetsLeverage';
import Mental1TiltTriggers from './Mental1TiltTriggers';
import Mental2SpottingTilt from './Mental2SpottingTilt';
import Mental3AngerFocus from './Mental3AngerFocus';

// Map lesson IDs to components
const LessonComponents = {
  'found-0-1': CourseIntroduction,
  'found-0-2': SelfAssessment,
  'found-0-3': EssentialMindset,
  'fund-1': CashVsTournaments,
  'fund-2': BankrollManagement,
  'fund-3': TableSelection,
  'pre-1': StartingHandSelection,
  'pre-2': PositionAndHandRanges,
  'pre-3': ThreeBettingStrategy,
  'post-1': BoardTextureAnalysis,
  'post-2': BetSizing,
  'post-3': HandReading,
  'adv-1': ExploitativePlay,
  'adv-2': MultiStreetPlanning,
  'adv-3': MentalGame,
  'post-4': Post4MultiwayPots,
  'post-5': Post5TurnRiverProbing,
  'post-6': Post6BluffingBlockers,
  'tourn-1': Tourn1ICMBubble,
  'tourn-2': Tourn2ShortStack,
  'tourn-3': Tourn3FinalTable,
  'deep-1': Deep1Preflop,
  'deep-2': Deep2Postflop,
  'deep-3': Deep3OverbetsLeverage,
  'mental-1': Mental1TiltTriggers,
  'mental-2': Mental2SpottingTilt,
  'mental-3': Mental3AngerFocus,
};

export default LessonComponents; 