/*
 * Centralised leak descriptions for Poker DNA analysis.
 * Each entry keyed by leak id contains:
 *   - name: Short display name
 *   - description: Brief summary
 *   - why: Explanation of the strategic problem
 *   - fix: Recommended adjustment
 */

export const leakTexts = {
  maniac: {
    name: 'Ultra-Loose Pre-flop',
    description: 'With a VPIP of {vpip}%, you are playing more than half of all hands dealt.',
    why: 'You enter too many pots with weak holdings, forcing tough spots post-flop.',
    fix: 'Tighten your starting hand range, especially from early positions.'
  },
  loose: {
    name: 'Overly Loose Pre-flop',
    description: 'Your VPIP of {vpip}% is above the population norm.',
    why: 'Weak range disadvantage leads to tough decisions and red-line bleed.',
    fix: 'Fold marginal offsuit hands; use charts as baseline.'
  },
  nit: {
    name: 'Too Tight / Predictable',
    description: 'Your VPIP is only {vpip}%, making you very tight and predictable.',
    why: 'Opponents can safely fold when you enter a pot, killing your value.',
    fix: 'Open up suited connectors and broadways on the BTN/CO.'
  },
  passivity: {
    name: 'Excessive Pre-flop Passivity',
    description: 'With a VPIP of {vpip}% and a PFR of {pfr}%, you call raises far more often than you re-raise, letting opponents control the hand.',
    why: 'This makes you predictable and easy to play against. Aggressive opponents will raise you with a wide range of hands, knowing you will likely just call and let them see a cheap flop. You lose value with your strong hands and get put in tough spots with your marginal ones.',
    fix: 'Start 3-betting more with your premium hands (AA, KK, QQ, AK) and mix in suited wheel Aces as bluffs to balance your range.'
  },
  tight: {
    name: 'Overly Tight Pre-flop',
    description: 'You are folding too often pre-flop, likely playing only premium hands.',
    why: 'While playing strong hands is good, being too tight makes you extremely predictable. Observant opponents will know you only have a monster hand when you enter the pot and will easily fold unless they have a monster themselves, preventing you from getting paid.',
    fix: 'Start by adding more hands to your button and cutoff opening ranges. Hands like suited connectors (89s, 78s) and suited gappers (J9s, T8s) are great candidates to start opening up your game.'
  },
  spewyOpen: {
    name: 'Overly Aggressive Opens',
    description: 'Raising pre-flop with a very wide range.',
    why: 'Loose opens can be exploited by 3-bets and put you out of position with weak hands.',
    fix: 'Tighten your opening range, especially from EP/MP.'
  },
  btnTight: {
    name: 'Under-Opening Button',
    description: 'Button raise-first-in < 35 %.',
    why: 'You forfeit the most profitable position at the table.',
    fix: 'Open at least top 45-50 % of hands on the BTN.'
  },
  coTight: {
    name: 'Under-Opening Cut-off',
    description: 'CO raise-first-in < 25 %.',
    why: 'You miss many profitable steal spots.',
    fix: 'Aim for 28-32 % opening frequency from CO.'
  },
  openLimp: {
    name: 'Open-Limping',
    description: 'You open-limp {openLimp}% of the time, far too often.',
    why: 'Open-limping gives up initiative and makes pots multi-way.',
    fix: 'Raise or fold; avoid limping except in special live games.'
  },
  sbOverFold: {
    name: 'SB Over-Folds vs Steal',
    description: 'Small blind defends only {sbFoldSteal}% of steal attempts.',
    why: 'Big blind collects dead money; you lose blinds uncontested.',
    fix: 'Defend by 3-betting or calling with top 25 % vs BTN steals.'
  },
  bbOverFold: {
    name: 'BB Over-Folds vs Steal',
    description: 'Big blind defends only {bbFoldSteal}% of the time against steals.',
    why: 'You give up the 2.5 BB pot too easily.',
    fix: 'Defend with suited hands and 3-bet more against late-position opens.'
  },
  overCbet: {
    name: 'Over-C-Bet Flop',
    description: 'Your flop C-bet is {cbetFlop}%, far above balanced ranges.',
    why: 'You barrel every board; opponents float/raise light.',
    fix: 'Check more on wet boards and in multi-way pots.'
  },
  underCbet: {
    name: 'Under-C-Bet Flop',
    description: 'Your flop C-bet is only {cbetFlop}%, missing value.',
    why: 'You miss value and let opponents realise equity for free.',
    fix: 'C-bet more on dry boards heads-up.'
  },
  rareDouble: {
    name: 'Rare Double-Barrel',
    description: 'After c-betting the flop, you fire the turn only {cbetTurn}% of the time.',
    why: 'You give up too often on turn, allowing opponents to realise equity.',
    fix: 'Barrel more favourable turns, especially heads-up.'
  },
  spewTriple: {
    name: 'Spewy Triple-Barrel',
    description: 'You fire a river c-bet {cbetRiver}% of the time, which is very high.',
    why: 'High river aggression without a nutted range can be exploited.',
    fix: 'Select river bluffs carefully; give up more often on blank rivers.'
  },
  foldVsCbet: {
    name: 'Folds Too Much vs Flop C-Bet',
    description: 'You fold {foldVsCbetFlop}% of the time when facing a flop c-bet.',
    why: 'Opponents profit by auto-barrelling you.',
    fix: 'Defend with top-pair+, back-door equity and occasional raises.'
  },
  no3bet: {
    name: 'Never 3-Betting',
    description: 'Your overall 3-bet frequency is just {threeBetOverall}%.',
    why: 'You rarely contest pots aggressively, letting open-raisers realise equity.',
    fix: 'Add value 3-bets with QQ+/AK and mix a few suited wheel Aces as bluffs.'
  },
  fold3bet: {
    name: 'Folds Too Much vs 3-Bet',
    description: 'You fold to 3-bets {foldVs3}% of the time.',
    why: 'Aggressive players can 3-bet you with impunity.',
    fix: '4-bet or call more with the top of your opening range.'
  },
  no4bet: {
    name: 'Never 4-Betting',
    description: 'Your overall 4-bet frequency is only {fourBetOverall}%.',
    why: 'You surrender initiative and leave money on the table with premiums.',
    fix: '4-bet for value with KK+ and include some A5s/A4s bluffs.'
  },
  fold4bet: {
    name: 'Folds Too Much vs 4-Bet',
    description: 'You fold to 4-bets {foldVs4}% of the time.',
    why: 'Observant opponents will 4-bet bluff you.',
    fix: 'Tighten your 3-bet range or continue with the value portion against 4-bets.'
  },
  passivePost: {
    name: 'Ultra-Passive Post-Flop',
    description: 'Your aggression factor is only {af}.',
    why: 'You rarely bet/raise, letting opponents dictate pot size.',
    fix: 'Bet your value hands and add semi-bluff raises.'
  },
  maniacPost: {
    name: 'Over-Aggressive Post-Flop',
    description: 'Your aggression factor is {af}, indicating very high aggression.',
    why: 'High aggression with a loose range leads to spew.',
    fix: 'Pick your bluff spots; slow down with marginal hands.'
  },
  wtsdHigh: {
    name: 'Showdown Junkie',
    description: 'You go to showdown {wtsd}% of the time.',
    why: 'Going to showdown too often with marginal hands leaks chips.',
    fix: 'Fold earlier in the hand when you have weak holdings – don’t pay off every river.'
  },
  wtsdLow: {
    name: 'Showdown Shy',
    description: 'You only reach showdown {wtsd}% of the time.',
    why: 'If you rarely reach showdown you probably fold too much before the river and get bluffed.',
    fix: 'Continue more often with decent draws and medium-strength made hands.'
  },
  wsdLow: {
    name: 'Poor Showdown Results',
    description: 'You win only {wsd}% of the showdowns you reach.',
    why: 'You lose too many pots at showdown, indicating calling too light.',
    fix: 'Tighten your calling ranges and value-bet thinner when ahead.'
  },
  wwsfLow: {
    name: 'Low Flop Success',
    description: 'You win the pot after seeing a flop only {wwsf}% of the time.',
    why: 'Indicates excessive passivity or poor hand selection post-flop.',
    fix: 'Play more aggressively on favourable boards and protect equity.'
  },
  noDonk: {
    name: 'Never Donk-Betting',
    description: 'Your flop donk-bet frequency is {donkFlop}%.',
    why: 'Not having a donk range makes your checking range face-up and easier to exploit.',
    fix: 'Introduce a small donk range on boards that favour the caller.'
  },
  noCheckRaise: {
    name: 'Never Check-Raising',
    description: 'Your flop check-raise frequency is {xrFlop}%.',
    why: 'Without check-raises opponents can c-bet relentlessly for free equity.',
    fix: 'Add value and semi-bluff check-raises on dynamic flops.'
  },
  losingBB: {
    name: 'Overall Losing (bb/100)',
    description: 'Your win-rate is {bb100} bb/100 over the sample.',
    why: 'Consistently losing chips points to fundamental leaks in your game.',
    fix: 'Review hand histories, tighten ranges and focus on position and aggression.'
  }
};
