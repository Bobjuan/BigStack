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
  'adv-3': MentalGame
};

export default LessonComponents; 