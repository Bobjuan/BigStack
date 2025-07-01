import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { categories } from './practice/data/scenarios/index';
import LessonComponents from './lessons/indexForLessons';
import { Box, Button } from '@mui/material';

// Dummy function to get lesson details - replace with actual data fetching or structure
const getLessonDetails = (categoryName, lessonId) => {
  // For now, just return some placeholder data based on IDs
  const allLessons = {
    'fundamentals': {
      'what-is-texas-holdem': {
        title: 'What is Texas Hold\'em?',
        icon: '🎮',
        content: `Texas Hold'em is the most popular form of poker today. Each player receives two private cards (hole cards) and shares five community cards to make the best five-card hand.

The game consists of four betting rounds:
1. Preflop: After receiving your hole cards
2. Flop: After the first three community cards
3. Turn: After the fourth community card
4. River: After the fifth and final community card

The goal is simple: make the best five-card poker hand using any combination of your two hole cards and the five community cards. The player with the best hand at showdown wins the pot.

Key concepts to understand:
- Blinds: Forced bets that drive the action
- Position: Where you sit relative to the dealer button
- Betting rounds: When and how you can bet
- Showdown: Revealing hands to determine the winner`,
        keyCharacteristics: [
          "Two private cards dealt to each player",
          "Five community cards shared by all players",
          "Four betting rounds: preflop, flop, turn, and river",
          "Best five-card hand wins the pot"
        ],
        howToExploit: [
          "Learn the basic rules thoroughly before diving into strategy",
          "Pay attention to position and its impact on your decisions",
          "Understand the betting structure and when you can act",
          "Practice hand reading by observing community cards"
        ],
        interactiveSection: '/learn/fundamentals/what-is-texas-holdem/interactive'
      },
      'hand-rankings': {
        title: 'Hand Rankings',
        icon: '🃏',
        content: `Understanding hand rankings is fundamental to poker success. Here's the complete hierarchy from highest to lowest:

1. Royal Flush: A, K, Q, J, 10 of the same suit
2. Straight Flush: Five consecutive cards of the same suit
3. Four of a Kind: Four cards of the same rank
4. Full House: Three of a kind plus a pair
5. Flush: Five cards of the same suit
6. Straight: Five consecutive cards of any suit
7. Three of a Kind: Three cards of the same rank
8. Two Pair: Two different pairs
9. One Pair: Two cards of the same rank
10. High Card: Highest card when no other hand is made

Remember these key points:
- Suits are equal in value (no suit is higher than another)
- Aces can be high or low in straights
- The highest card breaks ties when hands are equal`,
        keyCharacteristics: [
          "Ten distinct hand rankings from royal flush to high card",
          "Suits are equal in value",
          "Aces can be high or low in straights",
          "Highest card breaks ties"
        ],
        howToExploit: [
          "Memorize the rankings in order",
          "Practice identifying winning hands quickly",
          "Learn to count outs for drawing hands",
          "Understand the relative strength of different hands"
        ],
        interactiveSection: '/learn/fundamentals/hand-rankings/interactive',
        videoUrl: "https://www.youtube.com/embed/your-video-id"
      },
      'positions-and-blinds': {
        title: 'Positions and Blinds',
        icon: '🎯',
        content: `Position is one of the most important concepts in poker. It determines when you act in each betting round and significantly impacts your strategy.

Key positions (from earliest to latest):
1. Small Blind (SB)
2. Big Blind (BB)
3. Under the Gun (UTG)
4. UTG+1
5. Middle Position (MP)
6. Hijack (HJ)
7. Cutoff (CO)
8. Button (BTN)

The blinds are forced bets that drive the action:
- Small Blind: Half the minimum bet
- Big Blind: Full minimum bet

Positional advantages:
- Later positions have more information
- Earlier positions must act with less information
- The button is the most profitable position
- The blinds are the least profitable positions`,
        keyCharacteristics: [
          "Eight distinct positions at a full table",
          "Blinds rotate clockwise each hand",
          "Later positions have more information",
          "Button is the most profitable position"
        ],
        howToExploit: [
          "Play tighter from early positions",
          "Play wider from late positions",
          "Defend your blinds appropriately",
          "Use position to control pot size"
        ],
        interactiveSection: '/learn/fundamentals/positions-and-blinds/interactive',
        videoUrl: "https://www.youtube.com/embed/your-video-id"
      },
      'basic-strategy': {
        title: 'Basic Strategy',
        icon: '📚',
        content: `Mastering basic strategy is the foundation of winning poker. Here are the key concepts every player should understand:

1. Starting Hand Selection
- Play fewer hands, but play them aggressively
- Position matters: play tighter in early position
- Premium hands (AA, KK, QQ, AK) are always playable
- Suited connectors and small pairs need proper odds

2. Betting Strategy
- Bet for value when you have a strong hand
- Use position to control the pot size
- Don't chase draws without proper odds
- Fold when you're likely behind

3. Bankroll Management
- Buy in for 100 big blinds in cash games
- Don't risk more than 5% of your bankroll in a session
- Move down in stakes if you lose 20% of your bankroll
- Keep records of your results`,
        keyCharacteristics: [
          "Tight-aggressive play is most profitable",
          "Position determines hand selection",
          "Proper bankroll management is crucial",
          "Value betting is key to winning"
        ],
        howToExploit: [
          "Start with a tight range and expand as you learn",
          "Focus on value betting strong hands",
          "Avoid fancy plays until you master basics",
          "Keep detailed records of your play"
        ],
        interactiveSection: '/learn/fundamentals/basic-strategy/interactive',
        videoUrl: "https://www.youtube.com/embed/your-video-id"
      }
    },
    'advanced': {
      'preflop-strategy': {
        title: 'Preflop Strategy',
        icon: '🎲',
        content: `Advanced preflop strategy involves understanding ranges, position, and stack sizes. Here's a comprehensive guide:

1. Opening Ranges
- UTG: 15% of hands (AA-99, AK-AQ, KQ)
- MP: 20% of hands (add 88-77, AJ, KQ)
- CO: 30% of hands (add suited connectors, small pairs)
- BTN: 40% of hands (add suited aces, suited kings)
- SB: 25% of hands (position vs BB matters)
- BB: Defend 40% vs BTN, 30% vs CO

2. 3-Betting Strategy
- Value: QQ+, AK (vs early position)
- Bluff: A5s-A2s, 76s-54s (in position)
- Size: 3x vs early position, 2.5x vs late position

3. 4-Betting Strategy
- Value: KK+, AK (vs tight players)
- Bluff: A5s, 76s (vs aggressive players)
- Size: 2.2x the 3-bet size`,
        keyCharacteristics: [
          "Position determines opening ranges",
          "Stack sizes affect strategy",
          "Player types influence decisions",
          "Board texture matters postflop"
        ],
        howToExploit: [
          "Adjust ranges based on position",
          "Consider stack sizes when 3-betting",
          "Exploit player tendencies",
          "Plan postflop play before acting"
        ],
        interactiveSection: '/learn/advanced/preflop-strategy/interactive'
      },
      'postflop-play': {
        title: 'Postflop Play',
        icon: '🎯',
        content: `Postflop play is where the real money is made. Here's how to approach different situations:

1. Continuation Betting
- C-bet 75% on dry boards
- C-bet 50% on wet boards
- Size: 33% pot on dry, 75% on wet
- Check back with weak hands on scary boards

2. Board Texture
- Dry boards: T72 rainbow
- Wet boards: 987 two-tone
- Paired boards: 772
- Connected boards: 876

3. Turn Play
- Double barrel on good turn cards
- Check back on bad turn cards
- Consider pot control with medium strength
- Use position to control pot size`,
        keyCharacteristics: [
          "Board texture determines strategy",
          "Position is crucial for control",
          "Bet sizing varies by situation",
          "Player tendencies matter"
        ],
        howToExploit: [
          "Adjust c-bet frequency by board",
          "Use position to control pot size",
          "Consider player tendencies",
          "Plan multiple streets ahead"
        ],
        interactiveSection: '/learn/advanced/postflop-play/interactive'
      },
      'bet-sizing': {
        title: 'Bet Sizing',
        icon: '💰',
        content: `Proper bet sizing is crucial for maximizing value and minimizing losses. Here's a comprehensive guide:

1. Value Betting
- Strong hands: 75% pot
- Medium strength: 50% pot
- Thin value: 33% pot
- Consider opponent's calling range

2. Bluffing
- Pure bluffs: 75% pot
- Semi-bluffs: 50% pot
- Blocking bets: 25% pot
- Consider fold equity

3. Pot Control
- Check-call with medium strength
- Small bets to control pot size
- Consider stack-to-pot ratio
- Use position to control pot`,
        keyCharacteristics: [
          "Bet size varies by hand strength",
          "Position affects sizing",
          "Stack sizes matter",
          "Player tendencies influence sizing"
        ],
        howToExploit: [
          "Size bets for maximum value",
          "Consider fold equity when bluffing",
          "Use pot control when appropriate",
          "Adjust sizing based on opponent"
        ],
        interactiveSection: '/learn/advanced/bet-sizing/interactive'
      },
      'board-texture': {
        title: 'Board Texture',
        icon: '🎨',
        content: `Understanding board texture is key to making good postflop decisions. Here's how to analyze different board types:

1. Dry Boards
- Example: T72 rainbow
- Characteristics: No flush draws, no straight draws
- Strategy: C-bet wider, value bet thinner
- Bluff more frequently

2. Wet Boards
- Example: 987 two-tone
- Characteristics: Many draws, connected cards
- Strategy: C-bet less, value bet bigger
- Bluff less frequently

3. Paired Boards
- Example: 772
- Characteristics: Reduced straight possibilities
- Strategy: Value bet bigger, bluff less
- Consider full house possibilities

4. Connected Boards
- Example: 876
- Characteristics: Many straight possibilities
- Strategy: C-bet less, value bet bigger
- Consider straight draws`,
        keyCharacteristics: [
          "Board texture affects strategy",
          "Draws influence betting",
          "Connectedness matters",
          "Paired boards change dynamics"
        ],
        howToExploit: [
          "Adjust c-bet frequency by texture",
          "Size bets appropriately",
          "Consider draw possibilities",
          "Use position to control pot"
        ],
        interactiveSection: '/learn/advanced/board-texture/interactive'
      }
    },
    'game-theory': {
      'what-is-gto': {
        title: 'What is GTO?',
        icon: '🧮',
        content: `Game Theory Optimal (GTO) poker is a balanced strategy that cannot be exploited. Here's what you need to know:

1. Core Concepts
- Balanced ranges: Mix of value and bluffs
- Unexploitable play: Cannot be taken advantage of
- Mathematical approach: Based on game theory
- Solver-based: Uses computer analysis

2. Key Principles
- Always include some bluffs
- Balance bet sizing
- Consider all possible actions
- Think in terms of ranges

3. When to Use GTO
- Against strong opponents
- In high-stakes games
- When you have no reads
- As a baseline strategy`,
        keyCharacteristics: [
          "Balanced ranges of hands",
          "Mathematical approach",
          "Unexploitable strategy",
          "Solver-based solutions"
        ],
        howToExploit: [
          "Use as a baseline strategy",
          "Deviate based on reads",
          "Study solver outputs",
          "Practice balanced play"
        ],
        interactiveSection: '/learn/game-theory/what-is-gto/interactive'
      },
      'range-construction': {
        title: 'Range Construction',
        icon: '📊',
        content: `Building balanced ranges is fundamental to GTO play. Here's how to construct effective ranges:

1. Preflop Ranges
- Position-based opening ranges
- 3-betting ranges
- 4-betting ranges
- Defending ranges

2. Postflop Ranges
- C-betting ranges
- Check-raising ranges
- Bluff-catching ranges
- Value betting ranges

3. Range Construction Principles
- Include both value and bluffs
- Consider blockers
- Think in terms of combos
- Balance frequencies`,
        keyCharacteristics: [
          "Position determines ranges",
          "Include value and bluffs",
          "Consider blockers",
          "Balance frequencies"
        ],
        howToExploit: [
          "Study solver outputs",
          "Practice range visualization",
          "Consider blockers",
          "Balance your ranges"
        ],
        interactiveSection: '/learn/game-theory/range-construction/interactive'
      },
      'equity-realization': {
        title: 'Equity Realization',
        icon: '📈',
        content: `Equity realization is how much of your hand's equity you actually win. Here's how to maximize it:

1. Factors Affecting Realization
- Position
- Stack sizes
- Player tendencies
- Board texture

2. Maximizing Realization
- Play in position
- Have initiative
- Control pot size
- Use proper bet sizing

3. Common Mistakes
- Overplaying weak hands
- Underplaying strong hands
- Ignoring position
- Poor bet sizing`,
        keyCharacteristics: [
          "Position is crucial",
          "Initiative matters",
          "Stack sizes affect realization",
          "Player tendencies influence decisions"
        ],
        howToExploit: [
          "Play more hands in position",
          "Control pot size appropriately",
          "Consider stack sizes",
          "Adjust to player tendencies"
        ],
        interactiveSection: '/learn/game-theory/equity-realization/interactive'
      },
      'icm-considerations': {
        title: 'ICM Considerations',
        icon: '🎯',
        content: `Independent Chip Model (ICM) is crucial for tournament play. Here's how to use it:

1. ICM Basics
- Chips have different values at different stages
- Survival becomes more important near the money
- Stack sizes affect decisions
- Position matters more

2. Key Concepts
- Bubble play
- Final table dynamics
- Pay jump considerations
- Stack preservation

3. Common Mistakes
- Ignoring ICM pressure
- Overvaluing chips
- Underestimating survival
- Poor bubble play`,
        keyCharacteristics: [
          "Chips have different values",
          "Survival becomes important",
          "Stack sizes matter",
          "Position is crucial"
        ],
        howToExploit: [
          "Apply ICM pressure",
          "Preserve stack when needed",
          "Consider pay jumps",
          "Adjust to tournament stage"
        ],
        interactiveSection: '/learn/game-theory/icm-considerations/interactive'
      }
    },
    'player-profiling': {
      'straightforward-loose-passive': {
        title: 'Straightforward Loose Passive',
        icon: '🎣',
        content: `In small stakes cash games the majority of opponents fall into the straightforward loose passive bucket. They like to "see a flop" and will limp or call raises with almost any two cards that have even a hint of promise small pairs, offsuit aces, king nine offsuit, suited gap connectors, even ragged suited kings. Their guiding belief is that poker is a game of making hands, so real money should only pile in once they connect. When they flop top pair or better, they bet or raise large because they fear being outdrawn; when they have a draw or a weak pair they simply check and call; when they miss completely they fold. True bluffs sit at the bottom of their priority list because, to them, bluffing is "throwing chips away."

To profit, begin punishing their limp happy habit. From late position raise wider than normal suited aces, broadways, medium suited connectors confident that their calling range will be both dominated and out of position. If several have already limped, isolation raises of 5 7 bb not only inflate the pot when you likely hold the best hand but also give you post flop initiative.

After the flop, think "thin value" and "cheap bluffs." Any time you make top pair with a decent kicker, fire three streets at sensible sizes: half pot on flop and turn, two thirds on the river. Oversized bets merely scare them into folding what you desperately want them to call with. Conversely, the moment an SLP check raises or suddenly leads big, fold everything shy of a very strong made hand; their raises are almost never bluffs.

Because they fold far too often when they miss, small stab bets rake in chips. If four players see a flop of ace seven three rainbow and it checks to you on the button, a 40 % pot bet will succeed well above the 30 % break even point. The same logic applies in multi way limped pots where nobody seems interested take one shot and then shut down if called.

Over time your winnings come from three steady leaks: dead money steals before the flop, low cost continuation bets when they whiff, and value bets they pay off when they think "top pair is good." Notice that none of these moves require fancy lines; discipline and repetition beat this group handily.`,
        keyCharacteristics: [
          "Limp or over call with a very wide range",
          "Bet or raise big when they hit top pair or better",
          "Check call with draws or marginal pairs, rarely bluff",
          "Fold quickly when they miss"
        ],
        howToExploit: [
          "Raise wide in position to isolate, then continuation bet often",
          "Value bet thinly with one pair hands, using moderate sizing",
          "Fold medium strength hands to their sudden aggression",
          "Fire small stabs when boards are dry and they show weakness"
        ],
        interactiveSection: '/learn/player-profiling/straightforward-loose-passive/interactive'
      },
      'maniacal-loose-aggressive': {
        title: 'Maniacal Loose Aggressive (LAG)',
        icon: '💥',
        content: `A true maniac treats every pot as a personal challenge. He raises close to 40 percent of hands, blasts continuation bets whenever checked to, and keeps barrelling until someone shows unmistakable resistance. Because his starting range is so bloated, the "normal" metric for a strong hand shifts: middle pair, ace high, and even gut shot draws pull far ahead of what he is actually holding on average. Little illustrates this with a $1/$2 example in which the maniac opens to $8, you flat with Q T on the button, and the board runs out J T 5 4 7. If you quietly call flop, turn, and river, you still realise about 71 percent equity against the entirety of his three barrel range an edge that dwarfs the discomfort of calling down with second pair.

Because maniacs bet their whole spectrum when you show the slightest weakness, your best weapon is controlled passivity. Suppose he raises and you call with 9 9, seeing a J 9 7 two tone flop. Raising his c bet is a blunder; it forces him to fold the garbage you dominate. By merely calling and letting him keep the lead, you bottle feed chips from his bluffs while preserving your chance to stack him when he double or triple barrels into the nuts. Move in only when the board pairs or you spike quads and his entire range is drawing dead.

At the same time, selective aggression can flip his own style back on him. Little recommends spots where you hold overcards plus back door equity say you defend with Q J suited, meet a K 9 7 flop, and face the usual two thirds pot stab. A raise here strains his continuum of bluffs: if he calls, you still have live outs to straights and top pair; if he folds, you pick up a pot that would almost never be yours by showdown. The key is to bluff when the story of a made hand makes sense, not simply because you are tired of folding.

Maniacs come in flavours. One variety prefers the gargantuan three bet turning a $7 open into $35 with holdings as weak as 7 5 suited. Recognising the difference between that pattern and a tight player's rare monster save stacks and earns windfalls. Versus the maniac three bettor, hands like 9 9 and A Q play for stacks profitably; versus the nit doing it five times a night, they are easy folds. Against the maniac you may either smooth call to keep his trash in or four bet/jam if you think he will snap with worse.

All of this is volatile. You will lose some large pots when the maniac's 40 percent range happens to wake up with aces or spikes a river. Your job is to keep perspective. If someone literally volunteered to shovel money in with 40 percent equity, your bankroll grows every time you accept the gamble. Emotional stability refusing to tighten up in fear after a bad beat is as much a skill edge as any technical line you choose.`,
        keyCharacteristics: [
          "Opens and three bets an extremely wide range, firing multi street bluffs at the first sign of passivity",
          "Adjusts only when you show real strength; otherwise assumes folds are weakness",
          "Causes hand value inflation: middle pair and ace high routinely beat his betting range"
        ],
        howToExploit: [
          "Trap, don't chase: flat call strong but vulnerable hands and let him keep bluffing",
          "Call down wider: accept that second pair or ace high often has 60 %+ equity",
          "Bluff with a story: attack boards that credibly hit you, especially with back door equity",
          "Differentiate sizing tells: habitual huge three bets from a maniac are not the same as rare ones from a tight opponent"
        ],
        interactiveSection: '/learn/player-profiling/maniacal-loose-aggressive/interactive'
      },
      'weak-tight-passive': {
        title: 'Weak Tight Passive (Nit)',
        icon: '🛡️',
        content: `Weak tight passive opponents share one driving emotion: fear of losing money. They limp almost every "playable" hand, including premiums like pocket jacks or ace king, and they call raises only when they believe they hold a monster. Post flop they check call with top pair or an over pair down to the river, terrified of folding a winner, yet they fold far too often when faced with multi street aggression. On rare occasions they open raise, but the sizing is huge (7 8 bb) because they want either to win the pot outright or charge dearly for a flop.

Your first adjustment is relentless pre flop pressure. If action folds to you and a WTP sits in the blinds, open raise almost any reasonable hand; they defend only with holdings they consider premium. When they limp, isolate to 5 6 bb. Even min raises get the job done because their instinct says "fold and wait for better."

Respect, however, the money they do put in. A limp call followed by a flop and turn call often hides a hand as strong as top pair top kicker or pocket queens. Continuing to barrel with air is torching chips. Instead, value bet confidently when you're ahead, but abandon bluffs once they refuse to fold. If this player ever check raises, assume you face at least two pair and get out unless you beat that range.

Because WTPs hate volatility, trapping becomes lucrative. When they make the big early position raise that screams tens plus or ace queen plus, flat call with small pairs and suited connectors. Flop a disguised monster and bet immediately or spring a check raise; slow playing only invites scary turn cards that might finally scare them into folding. Remember they struggle to lay down an over pair, so squeeze maximum value while the getting is good.

Finally, exploit their blind reluctance. Any time stacks fold around to you in middle or late position and a WTP remains in the blinds, raise with a wide range. If only the weak big blind defends, a single half pot continuation bet will take it down a large percentage of the time. Should they call, wave the white flag with air you already earned your profit pre flop and on the flop.`,
        keyCharacteristics: [
          "Limp almost everything, including premiums",
          "Call raises and flop bets only with hands they believe are strong",
          "Open raise very large when they finally play aggressively",
          "Fold frequently to sustained pressure once they miss"
        ],
        howToExploit: [
          "Steal blinds and isolate limps with wide but solid ranges",
          "Treat their calls and raises as strong signals; bluff sparingly",
          "Trap huge pre flop raises with set mining hands, then extract maximum value",
          "Raise wide from late position; a single continuation bet often ends the hand"
        ],
        interactiveSection: '/learn/player-profiling/weak-tight-passive/interactive'
      },
      'straightforward-tight-aggressive': {
        title: 'Straightforward Tight Aggressive (TAG)',
        icon: '⚖️',
        content: `The garden variety TAG looks solid at first glance: he enters with all pairs, Broadway cards, suited aces, and premium connectors, and he almost always raises rather than limps. The leak appears after the flop. Because he plays so few hands, he subconsciously expects to win the pots he contests. That mindset makes him shove stacks with single pair holdings on dangerous textures raising with A Q pre flop, c betting a Q J 8 board, facing a raise, and still jamming despite being crushed by two pair or better.

Little's remedy is to let them barrel once, then take the pot away on the turn. Call the default c bet on boards that favour the caller middle, connected, or paired textures because the TAG's range is weakest there. When the turn bricks, a half pot lead from you often turns his A K or K Q into a reluctant fold. Conversely, on ace high boards that naturally favour the raiser, stick to straightforward poker unless you hold real equity.

Concrete hand examples clarify the plan. You flat a $7 lojack open with 4 4 on the button and see a 9 8 6 flop. He fires $12; you call. The turn bricks with an offsuit deuce, he checks, and you bet $27 into $41. Against the vast majority of small stakes TAGs this folds out everything short of an over pair, and even jacks or queens are queasy about continuing out of position for another big bet.

Pre flop harassment amplifies post flop leverage. TAGs hate defending blinds without position, so raise into them every orbit; most outcomes are immediate folds or check folds to a single continuation bet. When they three bet, respect it continue only with a range prepared to play a big pot. But when the open comes from mid position and folds to you on the button, polarised three bets work wonders: value with J J+ and A Q+, bluffs with suited wheel aces and lower suited connectors, always ready to fold to the inevitable four bet from the top of their range.

Discipline remains critical once a straightforward TAG shows resistance. Their flop or turn check raise overwhelmingly signals top pair plus a strong draw or better. Little notes that J J on T 9 3 has barely forty percent equity against that range; folding quickly saves an entire stack rather than a dozen blinds. Learning to believe their strength closes the money leaks that keep many players perpetually stuck in small stakes.`,
        keyCharacteristics: [
          "Enters with solid pre flop ranges and fires routine continuation bets, but overvalues one pair hands",
          "Rarely adjusts on scary turns, often playing fit or fold after the first barrel",
          "Surrenders blinds and struggles when forced to make big decisions out of position"
        ],
        howToExploit: [
          "Float, then attack: call flop bets on middle or paired boards and lead or raise many turns",
          "Polarise three bets: punish their opens with premiums and a sprinkle of suited junk they fear playing against",
          "Steal relentlessly: small raises into their blinds print chips when they fold or miss",
          "Respect their signals: fold medium strength hands to flop or turn check raises when they get aggressive, they usually have it"
        ],
        interactiveSection: '/learn/player-profiling/straightforward-tight-aggressive/interactive'
      },
      'good-tight-aggressive': {
        title: 'Good Tight Aggressive (Good TAG)',
        icon: '🎓',
        content: `The good tight-aggressive player looks a lot like the straightforward TAG at first glance-solid opening ranges, disciplined three-bet selections, and frequent continuation bets-but he also understands relative hand strength. When his pocket aces sit on a 9-8-5 two-tone flop, he no longer assumes the nuts; instead he weighs stack size, number of opponents, and potential draws before deciding whether to pot-control or press on. That single adjustment-recognising when one pair is not worth a stack-eliminates the huge equity dumps that keep lesser TAGs stuck in low stakes.

Pre-flop he protects his edge with a balanced three-bet strategy: pure value such as J-J+ and A-Q+ mixed with a handful of suited wheel aces and the occasional 9-8 suited bluff when image allows. Facing this range out of position is uncomfortable because you never know whether he holds a premium or a semi-bluff that can barrel on many textures. Yet that very balance opens an exploitable door-he hates calling reraises without the initiative. Well-timed polarised three-bets from the button or cutoff force him either to narrow his opening range or to play bloated pots out of position, both profitable outcomes for you.

Post-flop his aggression is purposeful rather than automatic. With K-Q on 9-6-3 he may fire flop and turn on any overcard, then check a river king to invite a bluff from missed draws. Because he can take opposite lines with the same holding, hand reading feels cloudy. Your counter is range leverage. Boards such as T-9-7, 8-7-5, or paired eights smash the caller's range and miss his; a flop raise or a turn bet after floating squeezes his capped holdings and often forces folds from over-pairs that straightforward TAGs would stack off with.

Little's hand example underlines the tactic. A $6 middle-position raise from the good TAG and one call reach you in the big blind with A-3 suited. You check-call his $10 c-bet on 8-5-2 rainbow, then check-raise the $23 turn bet when a six falls to $57. Your perceived range contains sets and wheel straights while his is heavy on over-pairs and unpaired big cards; he must either fold now or guess correctly on a sizable river shove. By choosing boards where your turn raise credibly represents nut hands, you pressure even competent opponents into profitable mistakes.

Because these players pay attention, image management matters. If you have splashed around for an hour they will call lighter, expecting bluffs; if you have been a rock they will over-fold. Alternate aggression with tight stretches so that your turn check-raise or river over-bet lands in the sweet spot between credibility and fear. Remember your goal is incremental edges, not fireworks-good TAGs rarely donate stacks, but they do surrender a steady stream of medium pots when you force them to play large ones without clear information.`,
        keyCharacteristics: [
          "Balances value and bluffs pre-flop, rarely stacking off with a mere over-pair",
          "Applies intelligent multi-street pressure and may check strong hands to induce",
          "Reads table dynamics and adjusts to opponents' perceived looseness or tightness",
          "Gives up medium pots when range disadvantage becomes obvious"
        ],
        howToExploit: [
          "Attack with polarised three-bets in position, making him play big pots out of position",
          "Float flop bets on middling or paired boards, then bet or raise scare turns",
          "Time check-raises on turns where your range trumps his capped holdings",
          "Vary your own pace so that strong lines receive action and bluffs earn folds"
        ],
        interactiveSection: '/learn/player-profiling/good-tight-aggressive/interactive'
      },
      'calling-station': {
        title: 'Calling Station',
        icon: '💰',
        content: `The calling station's guiding principle is simple: folding feels like losing. If a hand has the faintest whiff of potential-bottom pair, a back-door straight draw, even just two overcards-he will pay to see the next card. Entire streets pass with him dragging chips to the middle, head tilted as if mesmerised by the felt. Because he calls so often, amateur opponents believe he is "always lucky," yet Little's math shows the opposite: on a J-8-3 flop even 8-2 offsuit will crack aces just 19 percent of the time, meaning 81 percent of the time the station is torching money while you rake the pot.

Exploit begins pre-flop with an unpolarised value-heavy three-bet range-77+, A-T+, K-J+, Q-J suited-because he will call with dominated trash like A-3 or K-8 offsuit. There is no point bluffing; if a hand is not ahead of his calling range you are simply inflating variance. Post-flop, value betting becomes a relentless drumbeat. Against the extreme version who will "see what you have," J-T on Q-J-6-7-2 merits bets on flop, turn, and river, each perhaps 80 percent of pot, because he neither counts pot odds nor adjusts to sizing.

Thin value is the station's kryptonite. Suppose five limpers give you A-Q on the button; you raise to $12 and three players call. On a Q-T-7 flop you fire $30 and one station calls. The turn 3♦ brings another $44 call, the river 5♣ gets his remaining $114 with Q-J. You risked little relative to his errors, yet extracted maximum value because folding top-pair never entered his mind. Note how bet sizing ignored conventional "small into weak range" advice; with customers who never fold, bigger is better.

Discipline, however, saves stacks when the station does wake up. The moment he check-raises turn or river, believe him until you see evidence of bluffs. Little warns that paying off these rare shows of force reverses all the thin-value profit you accumulate elsewhere. Fold and move on; another chance to value bet the world awaits within minutes.

Finally, keep tilt in check. Stations will outdraw you sometimes-two-outer on the river, running flush after a bad call-and the table will groan. Your edge lies in the frequency of their errors, not in any single pot. Smile, reload if needed, and continue betting every time you glimpse that wide-eyed reluctance to fold.`,
        keyCharacteristics: [
          "Limp-heavy and call-happy both pre-flop and post-flop, almost never folding draws or pairs",
          "Rarely bluffs; raises only when holding a premium hand",
          "Unconcerned with bet sizing; will call large wagers to see the next card",
          "Appears lucky in the short run but bleeds chips through constant thin calls"
        ],
        howToExploit: [
          "Three-bet a broad, value-only range-expect dominated hands to call",
          "Fire big, multi-street value bets with any top-pair or better; aim for 70-80 % pot",
          "Make extra-thin value bets on rivers where weaker one-pair hands will still call",
          "Instantly fold when the station shows rare aggression-his range has flipped to strong"
        ],
        interactiveSection: '/learn/player-profiling/calling-station/interactive',
      }
    }
    // ... other categories later
  };
  return allLessons[categoryName]?.[lessonId] || null;
};

const LESSON_ORDER = [
  'found-0-1', // Course Introduction
  'found-0-2', // Self-Assessment
  'found-0-3', // Essential Mindset
  'fund-1',    // Cash vs Tournaments
  'fund-2',    // Table Selection
  'pre-1',     // Starting Hand Selection
  'pre-2',     // Position and Hand Ranges
  'pre-3',     // 3-Betting Strategy
  'post-1',    // Board Texture Analysis
  'post-2',    // Bet Sizing
  'post-3',    // Hand Reading
  'adv-1',     // Exploitative Play
  'adv-2',     // Multi-Street Planning
  'adv-3'      // Mental Game
];

const LessonPage = () => {
  const { courseId, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('content');

  // Get the lesson component based on lessonId
  const LessonComponent = LessonComponents[lessonId];

  // Find current lesson index
  const currentIndex = LESSON_ORDER.indexOf(lessonId);
  const previousLesson = currentIndex > 0 ? LESSON_ORDER[currentIndex - 1] : null;
  const nextLesson = currentIndex < LESSON_ORDER.length - 1 ? LESSON_ORDER[currentIndex + 1] : null;

  if (!LessonComponent) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div>Lesson not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <button
            onClick={() => {
              navigate('/learn', { state: { activeSection: 'lessons' } });
            }}            
            className="text-gray-400 hover:text-white transition-colors flex items-center mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Lessons
          </button>
        </div>

        {/* Content */}
        <div className="bg-[#0F1115] rounded-xl p-6">
          <LessonComponent />
          
          {/* Lesson Navigation */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            {previousLesson && (
              <Button
                variant="contained"
                onClick={() => navigate(`/learn/lessons/${previousLesson}`)}
                sx={{ bgcolor: 'blue.600', '&:hover': { bgcolor: 'blue.700' } }}
              >
                Previous Lesson
              </Button>
            )}
            {nextLesson && (
              <Button
                variant="contained"
                onClick={() => navigate(`/learn/lessons/${nextLesson}`)}
                sx={{ bgcolor: 'blue.600', '&:hover': { bgcolor: 'blue.700' } }}
              >
                Next Lesson
              </Button>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
};

export default LessonPage; 