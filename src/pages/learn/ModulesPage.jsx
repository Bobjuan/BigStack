import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../config/supabase';

const ModulesPage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [lessonCompletion, setLessonCompletion] = useState({});

  // This would typically come from your database
  const course = {
    id: 'cash-game-foundations',
    title: 'Foundations for Winning Cash Games',
    level: 'Beginner to Intermediate',
    description: 'Master the essential concepts and strategies needed to become a winning cash game player. This comprehensive course covers everything from basic fundamentals to advanced concepts.',
    totalLessons: 3,
    completedLessons: 0,
    estimatedTime: '1-2 hours',
    color: 'from-blue-500 to-blue-700',
    modules: [
      {
        id: 'module-0',
        title: 'Foundations for Winning Poker',
        description: 'Build a strong foundation for your poker journey with essential concepts and mindset',
        lessons: [
          {
            id: 'found-0-1',
            title: 'Course Introduction & Your Poker Development',
            completed: false,
            content: `# Target Audience & Course Goals

This course is **not** for total beginners. It's for players with some poker experience who want to:

- Beat small stakes cash games
- Progress to middle stakes as quickly as possible
- Realize the dream of making significant money from poker

---

## The Core Philosophy – How You Win in Small Stakes

- **Profit comes from exploiting opponents' mistakes.**
- Small stakes games are very profitable because the average player is weak.
- Unlike high-stakes (where GTO is key), here you should play an **exploitable strategy** to take advantage of frequent blunders.

---

## Unlearning Bad Habits & Adopting Effective Strategies

To improve, you may need to forget some old advice:

- Many books say "play tight, only put money in with the best hand." This is not enough to win big in small stakes.
- To get good at poker, you must:
  1. Play a technically sound strategy
  2. Be able to 'get out of line' to exploit mistakes
  3. Think outside the box

### Example: Adaptive Strategy with A-J

Suppose someone raises from middle position and you have A-J on the button:

- **Against overly tight players:** Fold (they only raise with hands that dominate you)
- **Against reasonably active players:** Call is probably best
- **Against wild players:** Reraise for value

> Simple preflop charts ("always reraise with A-J") lead to trouble. Success requires adjusting your strategy based on your opponents' tendencies.`
          },
          {
            id: 'found-0-2',
            title: 'Self-Assessment: Your Current Cash Game Understanding',
            completed: false,
            content: `# Self-Assessment: Your Current Cash Game Understanding

## Why Take This Quiz?

- Quickly test your knowledge of small stakes no-limit hold'em cash games
- Identify which concepts you need to work on most
- Retake after the course to ensure mastery

## About the Quiz

- 10 questions covering:
  - Opponent categorization
  - Preflop strategy (raise sizing, responding to raises/limpers)
  - Postflop play (value betting, bluffing, pot control)
  - Bankroll management
  - Mindset
- Immediate feedback and short analysis after each question
- If you miss a question, you'll be directed to the relevant lesson

**Tip:** Take the quiz before starting, and again after each module. Keep going until you get a perfect score!` 
          },
          {
            id: 'found-0-3',
            title: 'Essential Mindset & Bankroll Prerequisites',
            completed: false,
            content: `# Essential Mindset & Bankroll Prerequisites

## Bankroll Requirements for Small Stakes Success

- Maintain a bankroll of at least **2,500 big blinds**
- For $1/$2 games (big blind = $2): $5,000 is ideal
- $3,000 (1,500BB) is possible, but 2,500BB is safer
- Learning to play well lets you move up to middle stakes (where the real money is)

---

## The Critical Role of Mindset

- Poker can be infuriating; a poor attitude leads to misery and failure
- Mindset is so important, we'll cover it in detail later—but you need to understand its importance from the start

---

## The Source of Profit

- **Most money is made by exploiting opponents' mistakes**
- Great plays matter, but exploiting errors is where most profit comes from

> "If you ever hear someone say 'I would win if my opponents would stop making bad plays,' they are clearly unaware of this most basic concept."

Instead of being frustrated by bad plays, learn to recognize and exploit them. That's the path to consistent profits!`
          }
        ]
      },
      {
        id: 'module-1',
        title: 'Understanding and Combating Your Opponents',
        description: 'Learn to classify, profile, and exploit the most common player types you will encounter at small stakes tables.',
        lessons: [
          {
            id: 'opp-1-1',
            title: 'The Art of Opponent Profiling',
            completed: false,
            content: `# The Art of Opponent Profiling

> **Core Principle:** In small stakes, an _exploitable strategy_ tailored to your opponents' mistakes is superior to trying to play perfectly unexploitable poker.

## Fundamental Importance
- **Profit in poker comes from exploiting opponents' mistakes.**
- Your first job is to figure out what your opponents are doing wrong, then develop a strategy to exploit those errors.
- In high-stakes, players often use a game theory optimal (GTO) approach. In small stakes, an *exploitable* strategy is far more profitable because players make frequent blunders.

## Classification Basics
- No two players are identical, but classifying opponents helps you formulate a plan of attack.
- The main axes: **Loose/Passive** and **Tight/Aggressive**.
- Once classified, you can quantify and exploit specific tendencies.

**Player Types:**
- Loose/Passive
- Loose/Aggressive
- Tight/Passive
- Tight/Aggressive

## Playing Against a Range
- You are always playing against a **range of hands**, not a single specific hand.
- Avoid the mindset of "I put him on A-J so I went all-in."
- Over many hands, your opponent's holdings will vary within a range, not just one hand.
- Focus on putting each player on a range and narrow it as the hand progresses.`
          },
          {
            id: 'opp-1-2',
            title: 'How to Exploit Straightforward Loose Passive Players',
            completed: false,
            content: `# How to Exploit Straightforward Loose Passive Players

## Identifying Characteristics
- Play a wide range of hands preflop, often limping or calling raises with speculative hands.
- Postflop, apply pressure with top pair or better, but check/call with weaker hands and fold to river bets if unimproved.
- Play draws passively, betting big only when they hit.
- Rarely bluff; easy to read—raise when strong, call when unsure, fold when crushed.

## Exploitative Adjustments
- **Value Betting:** Value bet in a way they can realistically call when you have the best hand. Example: Raise A-Q, three call, flop A-7-5, bet half-pot on all streets to get calls from any Ace. Fold if they raise.
- **Folding to Strength:** Fold when they show aggression and you have a marginal hand. Their raises are almost always strong.
- **Bet Sizing Adaptation:** Adjust bet size to their likely holdings. Bet huge with the nuts, small with marginal hands.
- **Bluffing Opportunities:** Bluff when they show no interest. Example: Limp/call pre, check flop, you bet small—if they have nothing, they fold. Your bluff only needs to work 30% of the time.
- **Attacking Multi-way Checked Pots:** If checked to you in late position, bet about 50% pot with any two cards.
- **Smaller Bluff Sizing:** Use smaller bet sizes when bluffing; half-pot is often enough.

---

**Example: Bluffing Opportunity**

Situation: One loose passive player limps. You raise K-5s on the button. Limper calls. Flop comes A-6-2. Opponent checks. Pot is $23.

- **Action:** Bet $10.
- **Reasoning:** If opponent doesn't have top pair or better, they will usually fold. This bluff only needs to work about 30% of the time.
- **Calculation:** $10 (bet) / ($23 pot + $10 bet) = $10 / $33 ≈ 30%

> **Remember:** Profit from these players largely comes from disciplined value betting and folding when they show aggression.`
          },
          {
            id: 'opp-1-3',
            title: 'How to Exploit Weak Tight Passive Players',
            completed: false,
            content: `# How to Exploit Weak Tight Passive Players

## Identifying Characteristics
- Act overly weak until sure they have a premium hand.
- Abhor putting money at risk unless completely confident of winning. Often older players, playing to pass time.
- Tend to limp with most playable hands, even strong ones like J-J and A-K from early position, then check-call down if they hit top pair, fearing stronger hands.
- Some only enter the pot by raising huge (e.g., 7.5 BBs), to win immediately or make opponents pay dearly. They despise getting outdrawn and are easy to play against.

## Exploitative Adjustments
- **Vs. the Limping/Check-Calling Type:** Be overly cautious when they call your preflop raises and postflop bets; even passive calls can indicate strength. If they call your preflop raise and flop bet, and you have a bluff, abandon the bluff if they continue, as they likely have a strong hand they won't fold.
- **Vs. the Huge Preflop Raiser Type:** Simply fold and wait for an overly premium hand that has their strong range (e.g., 9-9+, A-Q+) in bad shape. If you make a hand that beats their premium range postflop (e.g., you call their big raise with 3-3, flop J-6-3), bet it strong or raise them, as they are unlikely to fold their premium overpair.

## Universal Exploits
- **Steal Their Blinds:** Relentlessly attack their blinds with raises when they are in them, as they don't like investing money without premium hands and will fold preflop often.
- **Continuation Bet:** If only the weak, tight, passive big blind defends your preflop raise, make a half-pot continuation bet.
- **Post-C-Bet Play:** If you have nothing and they call your flop c-bet, concede the pot. If you have a marginal made hand, check the turn to get to showdown. If you have the effective nuts, keep betting for value.

> **Key Insight:** The main way to crush these players is by staying out of their way unless you have the effective nuts, or by stealing their blinds.`
          },
          {
            id: 'opp-1-4',
            title: 'How to Exploit Straightforward Tight Aggressive (TAG) Players',
            completed: false,
            content: `# How to Exploit Straightforward Tight Aggressive (TAG) Players

## Identifying Characteristics
- Similar to weak, tight, passive players but understand the value of aggression.
- Preflop: Raise with a slightly wider range (all pairs, Broadway, suited Aces, suited connectors). Rarely limp.
- Postflop: Often overvalue strong made hands. Because they play few hands, they feel compelled to win most pots they enter, leading to paying off opponents too often.
- Frequently c-bet heads-up, but are often lost on the turn if their c-bet is called and they lack a premium hand.

## Exploitative Adjustments
- **Value Targeting Overvalued Hands:** Invest as much as possible when you can beat their obvious top pair or overpair.
- **Floating the Flop & Attacking the Turn:** Call their c-bets on boards good for your range, then bet the turn if they check. If you improve, bet smaller to induce calls.
- **Attacking Their Blinds:** Relentlessly attack their blinds from middle/late position; they often fold preflop or check-fold the flop.
- **Responding to Their Aggression:** If your raise + c-bet is met by a raise, fold unless you have a strong overpair or better.
- **Awareness of Exploitable Bet Sizing:** Varying your bet sizes based on hand strength can be exploited by observant opponents, but most small stakes players won't notice.

---

**Example: Floating and Turn Play**

A straightforward TAG raises to $7 from the lojack, you call on the button with 7-6s. Flop: 9♥ 8♥ 6♣. Opponent bets $12. Call to see the turn. If opponent checks any turn, bet ~$27 (bluff/semi-bluff). If you improve to a premium hand, bet ~$14 (value/induce).

> **Caution:** Varying your bet sizes based on hand strength can be exploited by observant opponents. Use with care or default to consistent sizing against better players.

Hand: J-J on T-9-3 flop vs. opponent's raising range (sets, top two, overpairs, good TP, strong flush draws).
Equity: ~40%. Action: Fold.`
          },
          {
            id: 'opp-1-5',
            title: 'Dealing with Good Tight Aggressive (TAG) Players',
            completed: false,
            content: `# Dealing With: Good Tight Aggressive Players

> Strategies for competing against skilled opponents who make fewer mistakes.

## Identifying Characteristics
- Similar to straightforward TAGs but better understand relative hand values.
- Rarely make huge errors with strong hands postflop.
- Play intelligently, sometimes calling, sometimes folding, depending on their read.
- Continue applying pressure intelligently, making them harder to play against.
- These players are rare in small stakes because they quickly move up.

## Exploitative Adjustments (How to Compete)
- **Applying Pressure:** 3-bet their preflop raises from cutoff/button with a polarized range (J-J+, A-Q+ for value, plus bluffs like A-5s, K-8s, Q-8s, J-7s, etc.). Adjust frequency based on their tightness.
- **Flop:** Raise their c-bets on boards good for your range and bad for theirs (e.g., T-9-7, 8-7-5, J-7-7, 8-8-6).
- **Floating and Turn Aggression:** Call the flop, then bet or raise the turn when checked to you.
- **River Overbet Bluffs (Advanced):** If you check-raised turn and opponent called, consider a large river bluff if convinced they have an overpair they might fold. Use sparingly.
- **Image Dynamics:** Good players adapt to your style. If you're aggressive, expect more calls; if tight, expect more folds.
- **Goal:** Applying pressure can make them play more like straightforward TAGs, who are easier to exploit.

---

**Example: Turn Check-Raise**

Good TAG raises $6 MP, Button (tight passive) calls, you call A-3s in BB. Flop 8♠ 5♠ 2♦. You check, TAG bets $10, Button folds. Check-call. Turn 6♥. You check, TAG bets $23. Excellent spot to check-raise to ~$57. This applies immense pressure; your range (sets, straights) is stronger than theirs (overpairs, unpaired overcards).

> **Table Image Matters!** Good players adapt to your perceived style. If they think you're overly tight, your bluffs gain credibility. If they see you bluffing often, expect more calls.`
          },
          {
            id: 'opp-1-6',
            title: 'How to Exploit Maniacal Loose Aggressive Players (LAGs)',
            completed: false,
            content: `# Conquering the Maniacs (Loose Aggressive Players)

> Strategies for taming wild and unpredictable opponents.

## Identifying Characteristics
- **Type 1 (Pressure on Weakness):** Applies pressure when you show weakness (e.g., checking).
- **Type 2 (Wide Preflop Reraiser):** Reraises preflop with an overly wide range, hoping to push you off hands.
- **Type 3 (Constant Blind Pressure):** Applies pressure at all times if they think you are reasonably active.
- Hand values shift dramatically against maniacs due to their wide ranges.

## Exploitative Adjustments

### Vs. Type 1 (Pressure on Weakness)
- Call down with decently strong hands to induce bluffs.
- Occasionally bluff when you think the maniac will assume you have a premium hand.
- Don't raise your premium made hands on the flop; call down until river, then consider raising if you improve.

### Vs. Type 2 (Wide Preflop Reraiser)
- Play huge pots with strong hands.
- With hands that crush their reraising range, both 4-betting and calling are good.
- If you think they'll fold to a 4-bet, call to keep their range wide.

### Vs. Type 3 (Constant Blind Pressure)
- Remain somewhat active preflop and on the flop so they give you action.
- Raise and reraise your premium hands when happy to get stacks in.

### General Mindset vs. Maniacs
- Accept larger bankroll swings but remain emotionally stable; they will eventually deposit their stacks to you.
- Giving opponents the opportunity to make errors (like bluffing into your strong hands) is how you make money.

---

**Example: Slowplaying a Set vs. Maniac**

You have 9-9. Flop J-9-7 (you have a set) vs. a Type 1 Maniac who c-bets.  
**Incorrect Play:** Raising the flop. Maniac folds their air.  
**Correct Play:** Just call. This keeps their entire bluffing range in the pot. Plan to call down most turns and rivers.

> **Critical Adjustment!** Hand values change dramatically against maniacs due to their wide ranges. What seems like a marginal hand against a TAG can be a strong value hand or bluff-catcher against a maniac.`
          },
          {
            id: 'opp-1-7',
            title: 'Demolishing Calling Stations',
            completed: false,
            content: `# Demolishing Calling Stations

_Your most profitable opponent type... if played correctly._

## Identifying Characteristics
- Incapable of folding any hand they deem to have potential on the flop, turn, or river.
- Give amateurs fits because they seem to "always get lucky."
- Most act passively unless they have a strong hand, but will call much larger bets with a much wider range than they should.

## Exploitative Adjustments

- **Relentless Value Betting:** Value bet on all three streets with hands like J-T on Q-J-6-7-2, even if it's just middle pair.
- **Larger Value Bet Sizing:** Against extreme calling stations, bet fairly large (e.g., 80% pot) on all three streets.
- **River Value Betting:** Thin value bets are crucial; your river value bet needs to get called by a worse hand at least 50% of the time.
- **Preflop Adjustments:** Reraise them for value preflop with an unpolarized range (7-7+, A-T+, K-J+, Q-Js).
- **No Bluffs Allowed:** If your opponent is not capable of folding, there is no point in bluffing them.
- **Folding to THEIR Aggression:** If a calling station raises, fold most hands.

---

**Example: Thin River Value Bet**

Hand: J♥ T♣. Board: Q♥ J♣ 6♥ 7♣ 2♥. Opponent is a calling station.  
**Action:** Bet for value on the river (e.g., 80% pot).  
**Reasoning:** They will call with any Queen, any Jack, any flush draw that missed, sometimes even just Ace-high. Your J-T is ahead of most of that calling range. This is a mandatory value bet.

> **Golden Rule vs. Calling Stations:**  
> **DO NOT BLUFF!**  
> (If they never fold, your bluff has no fold equity.)`
          },
          {
            id: 'opp-1-8',
            title: 'Which Strategy is Ideal? Adapting to the Table Dynamic',
            completed: false,
            content: `# Optimal Strategy: It's All About Adaptation

## Strategy is Opponent-Dependent
- The strategy you should employ depends almost entirely on how your opponents are playing.

## General Guidelines Based on Table Type

- **Against Tight & Passive Tables:** Play like a maniac. Widen your ranges and apply relentless aggression until they push back.
- **Against Maniacal Tables:** Play tight & passive. Let them bluff into your strong hands. Become a trapper.
- **Default (Most Small Stakes Games):** Employ a tight, aggressive strategy. Focus on value betting against the common loose-passive opponents.

---

## Exploiting Players Who Overplay Marginal Hands

- To exploit players who hang around too long with marginal one-pair hands, start with superior preflop hands or hands that can easily flop well (e.g., 2-2, K-Q, 7-6s).
- As postflop skills increase, you can start playing a bit looser before the flop, calling raises and limping more often with the intention of attacking postflop when opponents show weakness.

---

## The Ultimate Answer to "Which Strategy?"

The best strategy is one that maximally exploits your specific opponents' errors.  
Constantly identify what opponents do incorrectly, figure out adjustments to take advantage of them, and have the courage to get out of line to exploit them. This will likely make you the best player at the table.

> "If you make a point of constantly identifying what your opponents do incorrectly, figure out the adjustments you should make to take advantage of them, and then have the courage to get out of line in order to exploit them, you will probably be the best player at the table."`
          }
        ]
      },
      {
        id: 'module-2',
        title: 'Mastering Preflop Strategy',
        description: 'Build a sound and exploitative preflop game to set up profitable postflop situations in small stakes cash games.',
        lessons: [
          {
            id: 'pre-2-1',
            title: 'The "Why" Behind Preflop Decisions',
            completed: false,
            content: `# The "Why" Behind Preflop Decisions

## Setting Up Postflop Play
- While exploiting opponents is key, understanding technically sound poker is crucial—especially preflop.
- Preflop strategy is about more than just the strength of your two cards; it's about setting up profitable postflop situations.

## Disguising Hand Strength
- Consistent preflop actions (e.g., raising to the same size with your entire playable range when folded to you) help disguise your hand strength, making you harder to read.
- This contrasts with opponents who raise strong hands and limp marginal ones, making them easy to play against.`
          },
          {
            id: 'pre-2-2',
            title: 'Preflop Raise Sizing Principles',
            completed: false,
            content: `# Preflop Raise Sizing Principles

## Common Mistakes in Small Stakes
- Many $1/$2 players raise to $8–$15 when action folds to them, simply because "that is how much we raise in this game," not for strategic reasons.
- Huge bet sizes are often used to "protect" strong hands, while marginal hands are limped—making their strategy blatantly straightforward.

## Fundamental Sizing Concepts
- As stack size increases, preflop raise size should also increase, but not blindly.
- If you have a postflop skill edge, you want to see flops with as little money in the pot as possible.

## Recommended Standard Sizing (When Folded To You)
- Raise to 2.5 or 3 big blinds when everyone folds to you (e.g., $5–$6 at $1/$2, 100BB stacks).
- This sizing allows for sizable pots when you flop strong, provides room for aggression, and lets opponents call with junk that is unplayable on most flops.
- Raises larger than 3BB force reasonable opponents to play correctly (e.g., fold A-9, K-T to a 5BB raise, but might call a 3BB raise).
- Using a smaller size means you will get outdrawn more often, but with postflop skill, you can make tight folds when your premium hand is beaten.

## The "Pot-Sized Bet" Formula
- To calculate a pot-sized raise: multiply the last bet by three, then add in any additional money in the pot.
- **Example 1 (Opening):** First to act, 3x the big blind ($2) = $6, plus the small blind ($1) = $7. So a bit less than $7 (e.g., $6) is appropriate.
- **Example 2 (Large Pot):** Two limpers ($2 each), someone raises to $10, someone reraises to $26. A reraise to a bit less than pot size would be 3 x $26 + $10 (raiser) + $2 (limper) + $2 (limper) + $1 (SB) = ~$95. So perhaps $88.

## Adjusting to Opponents Who Call Large Raises
- In soft games where players never fold preflop, play tight and make large raises with premium hands (9-9+, A-J+), and smaller with Broadway/drawing hands.
- Most players will quickly adjust if you do this too often. Few call 15BB raises with K-8o, but many call a 3BB raise.`
          },
          {
            id: 'pre-2-3',
            title: 'Opening the Pot (When Action Folds to You)',
            completed: false,
            content: `# Opening the Pot (When Action Folds to You)

## General Principles
- When everyone folds to you, almost always enter the pot with a raise to roughly 3BB.
- Play your entire playable preflop range in the same manner (same action, same raise size) to give away minimal information.
- Suggested ranges are a bit looser to help develop postflop skills; tighten up if doubtful about postflop play, but improvement comes from playing outside comfort zones.

- With small pairs (like 6-6 from EP), a smaller raise size (e.g., $5 instead of $12 with $200 stacks) allows calling a 3-bet to $15, aiming for 10:1 implied odds. For suited connectors/Aces, aim for 20:1 implied odds.

## Opening Ranges by Position (Assuming $1/$2, $200 stacks, 2.5–3BB raises)
- **Early Position (EP):** 2-2+, A-Js+, K-Qs, A-Jo+, K-Qo, T-9s, 9-8s, 8-7s, 7-6s, 6-5s, 5-4s. Include hands like 9-8s and 2-2 to represent nuts on all flops.
- **Middle Position (MP):** 2-2+, A-Ts+, K-Js+, Q-Js, A-Jo+, K-Jo+, Q-Jo, J-To, T-9o, plus more suited connectors/gappers. Fold Q-Jo, A-8o from EP/MP due to domination risk.
- **Cutoff (CO):** Significantly wider, includes more suited Aces/Kings/Queens, suited connectors down to 5-4s, and more offsuit broadways/connectors like A-7o+, K-9o+, Q-9o+, J-9o+, T-8o+, 9-8o, 8-7o.
- **Button (BTN):** Range depends on blinds. Can be extremely wide, down to K-2s+, Q-2s+, J-2s+, T-6s+, 9-6s+, 8-5s+, 7-5s+, 6-4s+, 5-3s+, A-2o+, K-2o+, Q-5o+, J-7o+, T-7o+, 9-7o+, 8-6o+, 7-6o, 6-5o.
- **Small Blind (SB) vs. Big Blind:** Strategy depends on BB. Limping is reasonable if BB is straightforward. If BB is tight, raise a wide range. If BB is loose/aggressive, fold junk and play most pots in position. Default: raise most of the time, but be fluid.

## To Chop or Not to Chop
- If rake is low, do not chop; gain experience playing out of position and short-handed. If rake is large, chopping is better.`
          },
          {
            id: 'pre-2-4',
            title: 'Facing a Preflop Raise',
            completed: false,
            content: `# Facing a Preflop Raise

## Assessing the Raiser's Range
- Crucial to figure out the preflop raiser's range and tailor your strategy.
- Example: If a player limps marginal hands but only raises premiums, assign them a tight range when they raise, even if they see many flops.
- Recognize that players adjust ranges by position. Two players raising the same percentage of hands can have drastically different actual ranges based on position.

## Hand Categories for Response
- **Strong hands:** Premium pairs/big cards
- **Marginal hands:** Junky big cards/A-x
- **Drawing hands:** Small pairs, suited connectors/Aces
- **Weak hands:** Anything else

## Strategy vs. a Tight Raiser
- **Premium Hands (AA, KK):** Almost always 3-bet and get all-in. Can 3-bet larger if opponent won't fold their tight range.
- **Strong but Not Super-Premium (QQ, JJ, AK, AQ):** Consider calling more often. With J-J, can 3-bet vs. a tight player you expect to call with 9-9/A-J and 4-bet with AA/QQ (fold to their 4-bet).
- **Marginal Hands (A-J, K-Q, J-T):** Often fold these, as they are frequently dominated by a tight raiser's range. Folding K-Q to a preflop raise from an abnormally tight player is often correct.
- **If Raiser is a Bit Looser:** Tend to call with marginal hands. Consider turning some too weak to call (A-9, K-T) into 3-bet bluffs to balance your range. Don't bluff if opponent never folds to 3-bets.
- **Drawing Hands (2-2, 8-7s):** Almost always call if getting proper implied odds (10:1 for pairs, 20:1 for suited connectors/Aces). If opponent is incapable of folding an overpair postflop, you want to see flops with these hands.
- **Junky Hands (A-5, K-9, 9-8):** Simply fold. Avoid calling with A-5, flopping top pair, and then facing multiple bets.

## Strategy vs. a Loose Raiser
- **Premium Hands (AA, KK, QQ, AK, JJ):** Play aggressively (3-bet) if opponent will believe you're 3-betting wider than just these. If you've been overly tight, consider flat calling to trap.
- **Marginal Hands (A-J, K-Q, Q-T):** Play more aggressively. Reraise (3-bet) these hands for value because loose raisers call with many dominated hands.
- **Drawing Hands (small pairs, suited connectors/Aces):** Generally call to flop a strong made hand/draw. Only 3-bet if raise is from late position and you expect them to call your 3-bet then check-fold flop often.
- **Junky Hands (A-6, K-5, 9-8):** Generally fold. Only play if you expect the initial raiser to fold if you 3-bet (high fold equity).

## The Concept of "Blockers" in 3-Bet Bluffing
- Reraising as a bluff with a big card (Ace or King) in your hand is reraising with a "blocker". The presence of this card makes it less likely your opponent has a premium hand.
- **Example:** If you hold an Ace, opponent has A-A half as often (3 combos removed out of 6). They'll have A-K 75% as often (4 combos removed out of 16).`
          },
          {
            id: 'pre-2-5',
            title: 'Reacting to a 3-Bet After Your Opening Raise',
            completed: false,
            content: `# Reacting to a 3-Bet After Your Opening Raise

## Assess the 3-Bettor's Range
- Is the reraiser tight (only 3-betting A-A, K-K, Q-Q, J-J, A-K, A-Q)? Or loose (wide range)?
- Assume a "standard" 3-bet size (e.g., to $16–$24 over your $6 raise), not a huge one (like to $45 over $6, which warrants folding all but AA/KK vs. a tight 3-bettor).

## Strategy vs. a Tight 3-Bettor
- **AA, KK:** Almost always 4-bet/get all-in.
- **QQ, JJ, AK:** Play varies. If opponent will stack off with T-T, A-Q, then getting in J-J, A-K is great. If they only stack off with AA/KK, then calling with your QQ/JJ/AK is better to see a flop.
- **Marginal Hands (A-J, K-Q):** Usually fold to anything larger than a tiny 3-bet. Many small stakes players incorrectly call here; this is a major leak due to reverse implied odds.
- **Drawing Hands (9-9 down to 2-2, A-Js, A-2s, K-Qs, 8-7s):** Call if getting proper implied odds (10:1 for pairs, 20:1 for suiteds). If not, fold.

## Strategy vs. a Loose 3-Bettor
- **Biggest error is folding too often.**
- **Premium Hands (AA, KK, QQ, etc.):** Usually 4-bet if opponent won't fold too often. Or, just call their 3-bet to keep their bluffs in and allow them to make postflop blunders.
- **Good, Not Amazing Hands (A-J, K-Q):** Usually best to just call a loose player's 3-bet. If you flop equity (gutshot, overcards), consider check-calling or even check-pushing all-in.
- **Drawing Hands (A-Js, 8-8):** If not getting proper implied odds, consider 4-betting as a bluff or folding. Can also 4-bet bluff with blocker hands (A-x, K-x).

## Balanced Ranges (Advanced)
- Having a balanced 4-bet range (value + bluffs) is a skill for higher stakes. For small stakes, profit mainly by value-betting strong hands and folding weak ones; fancy plays are often unnecessary.`
          },
          {
            id: 'pre-2-6',
            title: 'Playing Against Limpers',
            completed: false,
            content: `# Playing Against Limpers

## Understanding Limper Tendencies
- Many small stakes players limp with a wide range because they want to see if the flop connects before folding.
- It's crucial to figure out individual limpers' tendencies.
- **Common Limper Type:** Raises premium hands, limps marginal/junky hands, folds trash. When they limp, you can often remove top 10% of hands from their range. They'll often fold to a sizable preflop raise, or at best flop a marginal hand.
- **Other Limper Types:** Some limp their entire playable range (even premiums). Some limp a mix of monsters and speculative hands from EP, but a wide range from LP.

## Strategy Against One Limper
- **Your Image:** If opponents expect you to raise limps frequently, they'll fight back. If they see you as straightforward, look for spots to steal their limps.
- **Example:** Tight image, weak player limps $1/$2 MP. You (any position) raise to $12 (if they fold to $12 but call $8) with A-4, K-6, Q-4. If you have a premium and want action, raise to $8. Adjust to balanced sizing ($12) if they catch on.
- **If you have maniacal image or they won't be pushed, raise almost entirely for value.**

### Limper from Early Position (Wide Range Limper)
- **You are also in EP:** Raise reasonably strong hands (9-9, A-J, K-Q), call with drawing hands (4-4, 7-6s), fold junk (A-x, 9-7). With marginal hands (K-J, J-T), if players behind might squeeze, either raise or fold. If players behind will also limp, you can limp too.
- **You are in MP/LP:** More inclined to raise a wide range (including A-x, 9-7) as fewer players are left. Limping behind with draws is okay, but raising for heads-up in position is often better.
- **You are in SB:** Limp with a wide range not strong enough to raise for value. Raising range depends on limper's postflop play. If they're tough postflop, raise only premiums/strong hands (9-9, A-J, K-Q). If they fold to raise or play straightforwardly postflop, raise wider (A-9, K-T, Q-J). Limp marginal/drawing hands. Can limp some junk (A-2, K-7, 8-6, 5-4) for pot odds but beware reverse implied odds. If limper folds to large raise, you (SB) raise wide to steal (unless BB wakes up). If limper calls any reasonable raise then plays straightforwardly postflop, consider raising to $10 with wide range, planning $12 c-bet.
- **You are in BB:** Usually best to check unless limper will concede to a preflop raise or raise + c-bet. If they let you see free flops, don't discourage it. Postflop: if weak limper bets when they hit/checks when they miss, check and see. If they check, bet turn/river. If they auto-bet flop when you check, consider check-raising with any equity.

### Limper from Early Position (Tight Range Limper)
- **You are also in EP:** Only raise premiums. Call with drawing hands. Fold marginals (A-9, K-T). With good non-nuts (A-J, K-Q), if limper is truly only premium, limp along. If wider, raise for value. Some tight limpers will limp-reraise nuts and limp-call non-nuts; good to raise A-T, K-J against them (fold to their limp-reraise).
- **You are in MP/LP:** Continue to play as if in EP; limper's tight strategy is main factor.
- **You are in Blinds:** Happy to see cheap flop with all decent hands. Only raise when you have them in bad shape.

### Limper from Middle/Late Position (Wide Range Limper)
- **You are also in MP/LP:** Raise with all playable hands and some junk (A-A, 2-2, A-Q, A-3, K-T, K-5, Q-J, Q-9, suited connectors) to get heads-up or steal. Be aware of image.
- **You are in Blinds:** Usually best to see cheap flop with non-premiums. Raise best hands for value. Can attempt bluff raise + c-bet if high fold equity expected.

### Limper from Middle/Late Position (Tight Range Limper)
- **You are also in MP/LP:** More willing to raise high card hands (A-T, K-J) as their range is wider than EP limp. Raising for bloated HU pot in position is good. Less inclined to raise blocker hands (A-x, K-x) unless high fold equity.
- **You are in Blinds:** Content to see cheap flop. Play big pots in position, small pots out of position.

## Strategy Against Multiple Limpers
- **Premium Hands:** Raise for value. If limpers are wide, your value range widens (e.g., can raise 7-7, A-T, K-J if they call with junk). Adjust bet size (larger to make them fold, pot-sized or less to get calls).
- **Marginal High Card Hands (Q-J, J-T):** Feel free to limp along. Profitable if you play well postflop and don't overplay marginal top pair. Weaker ones (Q-9, J-8, T-9) need more caution/postflop edge.
- **Drawing Hands:** More willing to see flops. But all draws aren't equal postflop (e.g., 8-5s making bottom flush draw multiway on K-9-4 facing bets/calls is often a fold due to domination risk and reverse implied odds). Avoid raising small over multiple limpers with drawing hands; no need to build pot preflop, you'll get stacks in if you flop a monster vs. players unwilling to fold top pair. See cheap flops.
- **Blocker Hands (A-x, K-x):** As more players limp, become more willing to raise with these, assuming initial limper is weak and others aren't trapping. Can justify large raise relative to pot; opponents likely fold without strong hands. If they rarely fold to large preflop raises, abandon this. If one calls, c-bet ~35% pot on most flops. If multiple call and you miss, check-fold unless very dry board (A-7-2, K-8-4) then small bet if checked to. If you hit top pair with bad kicker after raising blockers, usually go into pot control mode (check to get to showdown cheaply) as likely beat if much money goes in.

## Limp-Reraising
- Players who limp-reraise usually have very tight (nuts only) or very wide (nuts + bluffs) ranges.
- **vs. Nuts-Only Limp-Reraiser:** Continue only with a very snug range (AA, KK if raise makes drawing unprofitable). Don't pay off with Q-Q, J-J, A-K.
- **vs. Nuts + Bluffs Limp-Reraiser:** More difficult. If you 4-bet them, they only continue with best value. So, call their limp-reraise with your entire profitable playing range. Calling range widens as their limp-reraising range gets wider/more bluffy. Postflop: if they c-bet entire range, call with top pair or better. (Example: Maniac limps EP, 4 others limp, you raise Button T-T to $15. Initial limper 3-bets to $40. All-in is bad (36% equity vs. AA,KK,QQ,AK). Folding is criminal if they have trash like A-4, 8-7. If their range is too bluffy, call $40 with T-T. Fold to pressure on A-high flop. Fold on K-J-x or Q-J-x. Often call down on one non-Ace overcard flop.).

## Why Limp-Reraising is Usually Bad (for the user to do)
- Example: You have A-A UTG, limp. 4 limpers, Button raises $16. You 3-bet to $60, everyone folds, you win $27. Leaves equity on table. Compare to raising A-A to $6, getting callers, Button 3-bets to $24, you 4-bet, profit $48 if folds. Or raise A-A, get callers, someone flops TP and stacks off. You must be able to fold A-A when clearly beat postflop (e.g. on 8-6-4, you bet $20, one call, straightforward player raises to $90. Easy fold vs. set/two pair).

## When Limp-Reraising Can Make Sense (for the user)
- EP with playable drawing hand (3-3, A-4s, T-9s), want to limp. If aggressive player raises limpers (and you think they have weak range), consider turning your hand into a bluff limp-reraise (if not getting odds to call). If they call, they put you on premium, allowing you to represent and sometimes hit nuts. (Example: Limp $2 A-4s EP, 3 limpers, aggressive LP player raises to $16. You're getting 14:1 odds, want 20:1 for suited Aces. Consider 3-bet to $40. Fold to 4-bet all-in. If they call, c-bet $32 into $88 pot).

## When Limpers Don't Fold to Preflop Aggression (Calling Stations Who Limp)
- These players limp wide and call huge raises (e.g., up to $30) with their entire range because they hate folding potential winners.
- Strategy: Wait for the nuts and put your stack in.
- If you know their calling threshold (e.g., $12 vs $40), tailor your strategy.
- With hands like A-9, K-T, if limpers have weak ranges but call most raises, you can make a sizable raise in position, then often win with a c-bet. May need larger c-bet vs. calling stations.
- With drawing hands (2-2, A-3s, 8-7s), rarely raise if multiple limpers; see cheap flops.`
          },
          {
            id: 'pre-2-7',
            title: 'Adjusting to Abnormal Stack Sizes',
            completed: false,
            content: `# Adjusting to Abnormal Stack Sizes

## Deep Stacks (e.g., 150BB+)
- Hands that can easily improve to the effective nuts (2-2, 8-7s) go up in value due to large implied odds.
- Hands that are usually one pair (J-J, A-K) go down in value due to large reverse implied odds; one pair is nowhere near the nuts when stacks are deep.
- This doesn't make high card hands unplayable, just requires awareness.

## Short Stacks (e.g., 30BB, or $60 at $1/$2)
- Big pairs and high cards gain value; drawing hands (small pairs, suited connectors/Aces) lose value because you can't win much if you hit your draw.
- If someone raises to $7 and you have $60 with a drawing hand, either fold or go all-in. You won't flop strong often enough to justify calling such a high percentage of your stack.
- Push all-in with these drawing hands when you expect decent fold equity (e.g., vs. a loose, aggressive late position raiser). Pushing leverages raw equity + fold equity.

## Formula for All-In Profitability
(Percent you steal pot * Size of pot) + (Percent you get called * ((Your equity in pot * Total size of pot if called) – Amount you put in)).
- **Example 1 (Bad Shove):** Tight player raises to $6 UTG. Folds to you on BTN with 8-7s, $60 stack. Assume opponent calls all-in 90% of time. You have 31% equity vs. their calling range. (.1 * $9) + (.9 * ((.31 * $123) - $60)) = $0.90 - $19.61 = $18.71 loss.
- **Example 2 (Good Shove):** Loose aggressive player raises to $7 from CO. You have 8-7s on BTN, $60 stack. Assume opponent calls all-in with top 7% hands. Your 8-7s has 32% equity vs. this calling range. (.9 * $10) + (.1 * ((.32 * $123) - $60)) = $9 - $2.06 = $6.94 profit.

- If opponents call all-ins too often, you lose fold equity; wait for a hand that crushes their calling range.`
          },
          {
            id: 'pre-2-8',
            title: 'Playing with a Straddle',
            completed: false,
            content: `# Playing with a Straddle

## What is a Straddle?
- A voluntary blind bet, usually 2x the big blind, placed by the player in first position (UTG) before cards are dealt.
- Effectively acts as a third blind. Player to the left of straddle acts first preflop; straddler has option to raise when action gets back to them.
- Strongly suggest never making a traditional straddle unless required, as it makes pots large when you are out of position, which is not good. Players who straddle are often trying to increase action or gamble.

## Impact on Effective Stacks & Strategy
- The straddle cuts the effective stack size in half (e.g., $200 is 100BB at $1/$2 but only 50BB at $1/$2/$4 straddle).
- Use a strategy suited for 50BB stacks (big pairs/cards gain value; drawing hands lose value).
- Adjust bet sizes for the larger pot; typical preflop opening raise should be to $12 if straddle is $4.

## Exploiting Aggressive Straddlers
- Many aggressive straddlers will raise from the straddle when many players limp, or reraise when there's a raise and many callers.
- **Example:** $1/$2/$4 with $200 stacks. Someone raises to $14 EP, 4 players call. Straddle can raise large or go all-in.
- **Counter:** Strongly consider calling initial raises with your premium hands (rather than 3-betting) to trap the straddler who might squeeze.
- If straddler only raises over limpers (not over raises), you can limp your premium hands and then limp-call or limp-reraise their straddle raise.

## Straddles from Other Positions
- Some casinos allow straddling from any position. Player to straddle's left acts first preflop.
- **Example:** Cutoff straddles. Button acts first preflop. You (Button) should limp or raise a wide range as you'll be in position vs. the straddle (likely aggressive with worse hands).

## Mississippi Straddle (Button Straddle)
- Button posts a straddle, Small Blind acts first preflop.
- Posting a Mississippi straddle with a deep stack is often a good play as it forces blinds into a horrible spot (first to act pre and post) and usually results in you seeing a bloated flop in position.
- From the Blinds vs. Mississippi Straddle: Develop a relatively tight limping strategy. You have money invested but must worry about rest of table and Button raising. Limp playable hands, fold trash. If Button will raise frequently, fold hands that don't flop well. Avoid limping only to be blown off by straddler's raise, unless setting up a limp-reraise with a premium.`
          }
        ]
      },
      {
        id: 'module-3',
        title: 'Dominating Postflop Play',
        description: 'Master the art of postflop decision-making in various situations, both heads-up and multiway.',
        lessons: [
          {
            id: 'post-3-1',
            title: 'Core Postflop Principles',
            completed: false,
            content: `# Core Postflop Principles

## Dynamic Nature of Hand Values

Postflop, hand values are never static—they are dynamic and context-dependent. The strength of your hand is determined by:

- **Number of players in the pot**
- **Opponents' preflop ranges**
- **Opponent tendencies**
- **Your table image**
- **Board texture**
- **Effective stack size**
- **Your specific hand**

**Example:**  
You hold A-Q on a Q-8-7 flop.

- **Heads-up vs. a loose, passive player:**  
  If your opponent is the type to call down three streets with A-8, your A-Q (top pair, top kicker) is a premium hand. Even if the board pairs (Q-8-7-7-4), as long as your opponent shows no aggression, you can confidently value bet.

- **Multiway (e.g., four callers):**  
  If you bet the Q-8-7 flop and get three callers, then the turn is a 7 (Q-8-7-7), and you check and face a bet and a call, your A-Q is now much weaker. Folding is often the correct play, as it's highly probable someone improved to trips.

## Primary Goals of Postflop Play

- **Extract maximum value from marginal made hands.**
- **Get away from strong hands when it becomes clear you are beaten.**

Skilled players maximize value with hands that are only slightly ahead and avoid losing big pots with hands that are no longer best.

## Continuous Range Assessment

You must **actively put opponents on ranges** and **narrow those ranges** as the hand progresses. Failing to do so will cost you money.

## Betting for Value with a Plan

When betting for value, always have a plan for what you'll do if you get raised. Often, the correct response is to fold, especially if the raise represents a range that beats your hand. This concept will be expanded in later lessons.`
          },
          {
            id: 'post-3-2',
            title: 'Heads-Up Postflop Play',
            completed: false,
            content: `# Heads-Up Postflop Play

## Playing Premium Made Hands (Sets, Flushes, Straights)

- **If you do not fear being outdrawn:**  
  If an opponent bets into you (e.g., overly tight player raises, you call with 2-2, flop 5-2-2 for quads), slow play is often best if they likely have a strong hand.  
  If you sense they have exactly an overpair and will never fold, raise to get money in before a scare card comes.  
  If it's hard for your opponent to have anything (e.g., you raise Q-J, one call, flop Q-Q-J), check to give them a chance to bluff or improve to a second-best hand.

- **If you have the nuts but can easily be outdrawn (e.g., you raise 4-4, flop 9-8-4):**  
  Bet for value—slow playing can be disastrous. Continue betting on most non-draw-completing turns.

- **Effective Nuts:**  
  Treat hands like top two pair or better on a board like 9-8-4 as the effective nuts and play them aggressively.

## Playing Strong One-Pair Hands (Top Pair, Overpairs)

- **General Strategy:**  
  Bet as long as your opponent can call with worse.

- **Scare Cards:**  
  If the board changes (e.g., you raise A-J, one call, flop J-T-5, turn is a spade, King, or Queen), check with the intention of calling one bet. On safe turns, continue betting for value.

- **Betting for Value, Folding to Raises:**  
  Example: Raise A-J, see J-T-5 flop. Bet $10, opponent calls. Turn is 7. Bet $17 for value. If opponent calls, assume worse made hand or draw. If opponent raises, fold—assume they improved to a hand that crushes you. Continue this on safe rivers, betting for value (e.g., $28) with the intention of folding if raised.

- **Amateur Mistake:**  
  Raising the flop with top pair to "win immediately" is a huge mistake except against the worst calling stations.

- **Vs. Aggressive Opponents:**  
  Often check top pair on the turn with the intention of check-calling down.  
  Example: Raise K-Js MP, loose aggressive calls BTN. Flop K-Q-6. Bet $10, call. Turn 9. Check to induce bluffs; call if they bet $22. Plan to call down on most rivers.

## Playing Middle or Bottom Pair

- **General Strategy:**  
  Value bet the flop, then pot control (check) on the turn.

- **Checking the Flop:**  
  With weak top pairs or strong middle pairs, checking controls the pot and aims for a cheap showdown.  
  Example: Raise J-J MP, SB calls. Flop Q-6-3. Checking is good. If opponent checks turn, more confident they don't have a Queen. If they bet turn after flop checks through, tend to call at least once.

## Playing Drawing Hands

- **Categorization:**  
  - Premium draws: flush draw + straight draw/overcards  
  - Marginal draws: naked flush draw, OESD, gutshot + overcards  
  - Trashy draws: gutshot + one overcard, naked gutshot, naked overcards

- **Premium Draws:**  
  Play aggressively (bet/raise) if opponent's range isn't all premiums.  
  Example: Opponent raises, you call T-9s BTN. Flop 8s-7x-3y (OESD + flush draw). Opponent bets $12. If their range is weak, raise flop or call and bet turn if checked to.

- **When Draw Hits (Effective Nuts):**  
  Vs. good players, continue calling to induce bluffs. Vs. players who can't fold top pair, put in a small turn raise. Vs. calling stations, go for a large raise/all-in.

- **Marginal Draws:**  
  Rely on fold equity plus actual equity. Play more aggressively if opponents fold often.  
  Example: Tight player raises EP, you call J-Ts BTN. Flop Q-9-4. Call, as their tight range means raising is bad. Vs. loose, aggressive player, consider raising.

- **Bluffing with Missed Marginal Draws:**  
  If you have J-T on Q-9-4, call c-bet, turn is a heart, loose aggressive opponent bets again: consider raising as a bluff to represent the flush.

- **Trashy Draws:**  
  Rely almost entirely on fold equity.  
  Example: Opponent raises, you call A-3s BTN. Flop J-5-2 (gutshot). If opponent folds to raise when they have nothing, raise. If they call flop raise wide, call flop. If they c-bet turn wide, raise if you miss.

## Playing Junk/Air

- **As Preflop Caller:**  
  Fold almost every time.

- **As Preflop Aggressor (C-Betting):**  
  C-bet when board is good for your range or opponent likely missed.  
  Example: Raise EP, opponent calls BTN. C-bet most boards unless opponent only calls with suited connectors (then check boards with multiple middle cards).

- **C-Bet Sizing:**  
  Half-pot on dry boards, 3/4 pot on coordinated boards. In 3-bet pots, size smaller.

- **Giving Up:**  
  Nothing wrong with raising A-5 and check-folding J-8-6 if opponent likes their hand.

- **Firing Multiple Barrels:**  
  Fire again when board changes in a way unlikely to help opponent.  
  Example: Bet 9-8-3, opponent calls. Turn A or K, bet again.

## Additional Heads-Up Tactics

- **Responding to Donk Bets:**  
  If opponent leads with marginal hands and folds to raises, raise every time. If they never fold, raise for value when you beat them, call with draws.

- **Your Leading Range:**  
  Don't have one without specific reads. Prefer your checking range to be strong, especially out of position.

- **Vs. Inelastic Opponents:**  
  Bet large for value, small when bluffing.

- **River Value Betting & Raising:**  
  For a value bet to be profitable, you must have the best hand >50% when called.  
  Example: Raise, call with A-Q in SB. Flop A-8-6. You check, opp bets $10, call. Turn 4. Check, opp bets $22, call. River A. You check, opp bets $42. If opp only calls check-raise with full house, don't check-raise. If opp calls with any made hand, raise big.`
          },
          {
            id: 'post-3-3',
            title: 'Multi-Way Postflop Play',
            completed: false,
            content: `# Multi-Way Postflop Play

## Key Adjustments from Heads-Up

- **More likely someone has connected with the flop.**
- **C-bet less frequently as more people see the flop.**  
  Example: Raise Q-J, 1-2 callers, can c-bet K-7-2. If 4-8 callers, check Q-J on K-7-2 and fold to a bet.

- **With nothing in a 3-way pot on a coordinated flop (J-T-6, 7-6-4), check-fold.**  
  Attack heads-up pots aggressively, be more selective multiway.

## Attacking When Weakness is Shown

- **Look to attack when in position and everyone checks to you, especially if not the preflop aggressor.**  
  Example: Straightforward player raises $6 EP, passive calls MP, you call K-J BTN, BB calls. Flop Q-7-4. Everyone checks to you. Bet about $15 into $25. If BB calls, proceed cautiously. If others call, assume at best TP marginal kicker, be prepared to bluff again.

## Playing Premium Made Hands (Sets, Flushes, Straights)

- **Usually bet for value, whether or not easily outdrawn.**  
  It's likely one opponent has a decently strong hand you beat.

- **Slow play only when betting will only get action from hands that will pay you off regardless, or if you can trap multiple players.**  
  Example: EP raises, you call A-J, six others call. Flop A-A-J. Blinds & initial raiser check to you. If players yet to act have an Ace, they will bet. Slow playing (checking) has merit here.

- **Slow playing trips or two pair is almost always wrong in multiway pots, especially when susceptible to draws.**

- **If you bet flop, get callers, and turn drastically changes board (completes obvious straight/flush):**  
  Check. If turn checks through, check river unless opponents are calling stations. If board gets worse, continue checking.  
  Example: Raise 8-8 EP, five callers. Flop 8-7-5 (set). Bet $20, three callers. If turn completes obvious draw, check. Look to check-call if getting proper odds to draw to full house; fold if not. If turn is safe, continue betting for value (~70% pot).

## Playing Strong One-Pair Hands (Top Pair, Overpairs)

- **Tricky.**  
  If you bet and get called, generally assume best hand. If raised (especially by straightforward players), assume beat.

- **If you see a horrible turn in a multiway pot, check-folding is perfectly acceptable.**

## Playing Middle or Bottom Pair

- **Play incredibly cautiously.**  
  Acceptable in 3-way pots, trash in 7-way pots.

  Example: Opponent raises, three call, you call 9-8s BTN. Flop K-8-7. Initial raiser bets, someone calls. Even with middle pair and backdoor straight draw, fold. One player likely has superior made hand, other a draw; some of your outs might not be good.

## Playing Drawing Hands

- **Tricky on multiway flops.**  
  When facing bets and calls, some have made hands, others draws.

- **Clean draw to nuts (e.g., A-3s or K-Qs on J-T-5ss):**  
  Happy to call and see what develops.

- **Weaker draws (e.g., 4-3ss on J-T-5ss):**  
  Consider folding to one flop bet if many players will see turn.

- **Junky draw to effective nuts (e.g., A-4s for wheel draw on K-5-3ss):**  
  Can justify calling if direct pot odds are amazing.  
  Example: EP raises $6, four call, you call A-4s BTN. Flop K-5-3ss. Initial raiser bets $8, all four call. Pot is $73, call $8 to win $73 (~9:1). Close enough to call if implied odds are good.

- **Apply pressure with draws when most opponents have weak ranges.**  
  If you flop a draw and everyone checks to you, bet flop, intending to bet most turns if heads-up.

  Example: Opponent raises, four call, you call T-7s BB. Flop 9-8-3ss (gutshot + flush draw). Everyone checks to BTN, who bets. Consider check-raising to ~2.7x BTN's bet if you think BTN is aware they can steal. If BTN is straightforward, call and see.

## Playing Junk/Air

- **When you miss flop multiway, check-fold.**  
  Likely someone has a decent hand; no point bluffing them off it.

- **Common mistake:**  
  Raising A-K EP, getting multiple callers, then c-betting when failing to improve, then barreling turn with nothing. Don't overvalue strong preflop hands that become weak postflop.`
          },
          {
            id: 'post-3-4',
            title: 'Playing Large Pots',
            completed: false,
            content: `# Playing Large Pots

## Hand Values Change with Pot Size

- **Hand values change drastically as the pot size (relative to stacks) increases.**

**Example 1 (Folding AA in a large pre-pot-commitment scenario):**  
You raise A-A to $6 EP, five players call (blinds included). Pot is ~$33. Flop 9-8-4. Small Blind leads for $24, Big Blind raises all-in. Even with A-A, typically fold unless opponents are "bonkers". (You are not pot-committed.)

**Example 2 (Can't Fold AA when pot is already huge due to your actions):**  
Someone raises to $6, three call. You raise to $34 from the button with A-A, and they all call. Pot is ~$140. Flop 9-8-4. In any reasonable scenario, even against four players, you simply cannot fold because the pot is too large relative to remaining stacks. Only consider folding if all three players before you push all-in.

## General Guideline

- **When you have a reasonably strong hand in a huge pot, your goal should not be to fold without an excellent reason.**

## Caution vs. Strong Ranges in Large Pots

- **Don't take the above too far, especially against an opponent with a strong range.**

**Example:**  
You raise A-Js EP to $6, three call. A tight, straightforward player 3-bets BTN to $30. You call. Pot ~$100. Flop A-T-5 rainbow. Everyone checks to BTN, who bets $80. Even with top pair, you should fold. The only hands in opponent's range you beat are K-K, Q-Q, J-J, which they might check behind. You lose to A-A, T-T, A-T, sometimes A-K.

- **If the preflop 3-bettor was a maniac, you should call or go all-in on the flop because you crush many hands in their range. Always assess opponent's range and adjust.**`
          },
          {
            id: 'post-3-5',
            title: 'Strategic Use of Overbetting',
            completed: false,
            content: `# Strategic Use of Overbetting

## Typical Small Stakes Overbets

- **How Amateurs Use Them:**  
  Most small stakes players overbet before the river to "protect" a strong hand, or overbet the river when they know they have the best hand and want full value.  
  This is a bad strategy—it forces opponents to play well (fold when they should, call when they shouldn't). If facing such a player, refuse to pay them off.

- **Some players overbet with unpaired hands (A-K on J-8-4) and bet smaller with made hands (K-K, A-J).**  
  Against these players, be inclined to call their overbets with a wide range of paired hands, but be careful.

## When Overbetting is Recommended

- **Spot 1: Value Overbet (vs. Inelastic Opponent or Polarized Range):**  
  Overbet when opponent refuses to fold (calling station), or when their range is almost entirely strong, but second-best, hands that will call, or nothing that will fold to any bet.

  **Example:**  
  You raise A-2s LP, BB calls. Flop Qs-7x-4x. BB checks, you bet $10, call. Turn 3s (nut flush). BB checks, you bet $24, call. River Kx. BB checks. If opponent has Qx or worse (75%), they fold to almost any bet or call a small one. If they have a flush (25%), they call any bet. $25 bet profits $25 (if called 100% by Qx/flush). $160 all-in bet profits 0.25 * $160 = $40. The large overbet is more profitable.

- **Spot 2: Bluff Overbet (vs. Capped Range of Foldable Hands):**  
  Overbet as a bluff when opponent's range is mostly marginal/weak made hands that will fold to a large bet.

  **Example:**  
  Same A-2s hand, Qs-7x-4x-3s-Kx board. You don't have the flush (e.g., Q-T or air), and you think opponent doesn't have a flush. Overbet as a bluff—unless opponent is a calling station, they will fold their entire (non-flush) range. Even with Q-T, consider turning hand into a bluff by overbetting all-in.

- **Use sparingly for high profit.**`
          }
        ]
      },
      {
        id: 'module-4',
        title: 'Advanced Skills & Professional Habits',
        description: 'Master the non-technical skills crucial for poker success, from reading tells to managing your bankroll and maintaining a winning mindset.',
        lessons: [
          {
            id: 'adv-4-1',
            title: 'Mastering Poker Tells',
            completed: false,
            content: `# Mastering Poker Tells

## Introduction to Tells

The average player in small stakes cash games has little to no control over their physical mannerisms, often being oblivious to how powerful tells are. Paying attention to opponents can reveal behavior that is obviously weak or strong, helping narrow their range significantly.

However, most tells should only slightly sway your decision one way or the other. Being great at reading people without strong technical skills is insufficient for success.

To gather reads, stop being concerned with only your two cards and pay attention to opponents. Develop a baseline read of how an opponent acts normally, then look for behaviors that are out of the ordinary or drastic changes.

**Example:** If someone normally has calm, steady hands, but they suddenly start shaking, that almost certainly means something. You need to figure out if shaking hands means a premium hand, a bluff, or occurs every time they play a big pot.

## Common Physical Tells

- **"I am obviously interested" look:**  
  When an amateur gets a hand they plan to play, they often sit up and become visibly interested, both preflop with a premium or postflop when they improve to a strong hand.  
  Example: You raise J-Ts, four players call, flop T-9-4. If two players to your left become obviously interested, it's probably best to check-call or check-fold, saving a c-bet.

- **"I am obviously not interested" look:**  
  Most often seen in multiway pots postflop; players stop paying intense attention and revert to other focuses.  
  Example: You raise Q-J, four call, flop K-8-7. If all opponents become clearly uninterested, you should c-bet, even if you'd normally check-fold.

- **Blinking Rate:**  
  Often an indicator of hand strength, assuming different rates at different times. Generally, players blink a lot when bluffing and normally when they have a strong hand.

- **Heart Rate Variations:**  
  Many players' heart rates vary with hand strength. Some players' hearts beat faster when attempting a large bluff. Study opponents for their specific tendencies.

## Verbal Tells & Behavior

- **"The Speech" or "Hollywooding":**  
  When an opponent tries to talk or make gestures during a hand, it's almost always an attempt to get you to call. In general, someone bluffing will be quiet and still; some can't even form a coherent sentence. If someone is goading you into calling, do not pay them off.

- **Talking when you're about to act:**  
  Other players talk when you are about to make the opposite of the play they want you to make. If you are about to call, they might say something to get you to fold. If a player always talks when their opponents are about to make the correct decision, then when they don't talk, it means they want their opponent to make the incorrect play.

## Timing Tells

- **Quick Bet or Raise:**  
  Usually indicates either a very strong hand (they know they're betting) or a very weak hand (they want to look strong). Most players will have one of these two tendencies, not mixing it up.

- **Quick Call:**  
  Usually indicates a mediocre made hand or a draw, as players with these hands often know they are not going to fold or raise.

- **Taking Time:**  
  Other players take their time with marginal hands (weak made hands, draws) because they need more time to analyze when unsure. Knowing someone thinks before calling with middle pair or worse can allow you to value bet top pair, bad kicker on all three streets.

## Gathering and Using Tells

Instead of initially focusing on everyone, focus on players seated directly next to you, as you play most pots with them. Once you have rough reads, branch out. Observing opponents becomes routine over time.

## Becoming Tell-less Yourself

- Strive to have no tells. Most small stakes players are playing their cards and acting naturally, not trying to give false tells, so there's no point trying to trick them with one.

- Do your best to remain stoic when involved in a pot, until you no longer have your cards.

- Do not fall into the habit of becoming uninterested when you know you are folding, as it will let opponents know that when you are interested, you are not folding. As long as you have cards, wear your poker face.`
          },
          {
            id: 'adv-4-2',
            title: 'Professional Bankroll Management',
            completed: false,
            content: `# Professional Bankroll Management

## Player Types and Risk Tolerance

In small stakes, there are primarily two types of players:
- Recreational (can reload bankroll from their day job)
- Those trying to play professionally (cannot or refuse to reload from a job)

These types require drastically different bankrolls due to different tolerances for risk of ruin.  
Example: Losing a weekly $100 poker allowance is not a big deal if you make $2,000/month from a job, but losing $400 in a month is huge if you only have $2,000 total.

## Purpose of Bankroll Management

- No amount of bankroll management will save a losing player.
- For winning players, proper bankroll management ensures they have the ability to play in the future, even when running poorly.

## Bankroll Size Recommendations

- In a soft $1/$2 cash game with low rake, it's possible to win $20 per hour or more with a bankroll as small as $3,000.
- However, for a true professional approach, $3,000 is quite small.
- General guideline: 2,500 big blinds ($5,000 at $1/$2) to rarely go broke.

As you move up, your bankroll requirement will increase in terms of big blinds because games get tougher and you'll win fewer big blinds per hour. If you need $3,000 at $1/$2, you will probably need $12,000 at $2/$5.

Playing well within your bankroll helps manage losses and allows for comfortable grinding with minimal swings. This is opposite to most small stakes players who risk their entire net worth.

## Stop-Loss Strategies

- A "stop loss" is an arbitrary rule to quit after losing a certain amount.
- While not personally favored by the author for themselves, it's a good idea for most amateur players who lack emotional control, as many have obliterated bankrolls by going on tilt in a single session.
- As an arbitrary default in 100 big blind games, consider stopping for the day if you lose 300 big blinds, assuming the game is not great.

## Reloading at the Table

- If you are profitable in a game and lose some money, it's usually a good idea to reload (add more money to the table).
- Personally, if playing 100 big blind buy-in games, if dipping below 90 big blinds, add 10 big blinds, keeping additional chips in pocket.
- Avoid buying in for 100 big blinds and playing until broke or finished for the day, as this can result in playing with a short (e.g., 30 big blind) stack. Winners typically want a large stack to capitalize on profitable situations.

## Impact of Rake

- It's important to recognize how much rake the casino is taking. In the past, at $1/$2 no-limit, casinos might take $3 per hand, which is reasonably beatable. Some casinos now take as much as $10 per hand.

- If your casino rakes more than $5 at $1/$2, it will be difficult to win, even as a great player. You don't have to play a game simply because it's spread.

- Extremely soft home games with high rake (e.g., 5% of pot, uncapped; a $10,000 pot means $500 rake) can be unbeatable long-term unless you're a huge favorite regularly.

- If playing in a high-rake game, adjust by playing very tight before the flop. Playing few, significant hands per hour minimizes rake paid. Being involved in many small pots, even winning more than your share, can lead to losing overall due to rake. If rake is huge, you don't have to play.

## Moving Up and Down Stakes

- As you beat small stakes, grow your bankroll. Suggest moving from $1/$2 to $2/$5 when bankroll reaches roughly $8,000.

- If your bankroll at $2/$5 dips back to $6,000, it's probably wise to move back down to $1/$2. These are recommendations and should change based on your risk tolerance.

- If things go poorly at higher stakes, or you start losing after moving up, do not be ashamed to move down, especially if your bankroll is in jeopardy. Many players forfeit success due to pride, playing high limits until broke.`
          },
          {
            id: 'adv-4-3',
            title: 'Cultivating a Winning Mindset',
            completed: false,
            content: `# Cultivating a Winning Mindset

## Importance of Mindset and Emotional Control

While mindset, attitude, and outlook won't solely make you a winning poker player, having control of your emotions makes life more enjoyable and makes you much less prone to go on tilt, a serious leak for most small stakes players.

## Understanding and Combating Tilt

- **Define tilt:** You are on tilt any time you play differently than you would if playing your absolute best.

- **Common causes of tilt:** making a poor play, getting unlucky, having an argument with a partner, or being too excited.

- **Managing tilt:** Constantly be aware of how you are feeling and if something is altering your thought process. If so, acknowledge your feelings, realize it shouldn't affect your strategy, and then continue playing fundamentally sound poker.

### Tilt from Bad Luck/Beats

Most players in small stakes games go on tilt when they get unlucky, feeling they should win every time they have the best hand. Understand that you will not win every time you have the best hand.

Example: If you get all-in with A-A versus 2-2, you will lose 18% of the time. If you get your stack in and lose in this situation, you did nothing wrong and have no reason to be upset. If a result is expected some portion of the time, it should not surprise or anger you when it happens; it's simply part of the game.

### Tilt from Mistakes

The author used to go on tilt when realizing a mistake. This was cured by recording hands in a notebook for later review away from the table, allowing deferral of processing. Work hard to eradicate whatever causes you to tilt. Playing less than your best leaves money on the table.

## Exploiting Opponents on Tilt

If someone is obviously upset and playing poorly, quantify what they are doing incorrectly and adjust your strategy to take advantage.

It's common to see a normally tight, aggressive player become a maniac, or a loose, passive player become a calling station when on tilt. Pay attention to tell when someone is off their 'A' game.

## Common Attitude Leaks to Avoid

- **Complaining:** Do not complain about things. At every table, there seems to be someone unhappy with every aspect of life; this person is rarely focused on poker and almost always plays poorly.

- **Discussing Strategy at the Table:** Do not discuss strategy at the poker table. While most small stakes players want to get better, they should discuss the game away from the table. Discussing strategy at the table reveals your thought processes to opponents and may educate inferior players. Wait until finished playing for the day to talk poker with someone at your table.

## Recognizing and Exploiting "End of Session" Mentality

Some players drastically change their strategy when they know their session will end soon. The vast majority of small stakes players have a leak where they want to end each session either up or even; they can't stand going to sleep a loser.

This is an asinine thought process because each session is actually part of one never-ending session; the last hand of your previous session might as well be the first of your next.

If you recognize someone at your table playing passively to lock up a winning session, you can probably push them around a bit more than normal.

If someone is down a buy-in, they may gamble a bit more than normal in an attempt to get even. Being aware of these factors helps make better decisions.

## Adopting the Mindset of a Professional

If you strive to become a professional or winning player, you must develop a pro's mindset:

- Pros don't care about routine swings; they realize sometimes they win, sometimes lose.
- They monitor emotions and recognize when not thinking clearly.
- They keep a large bankroll to ensure they don't go broke.
- They don't let annoying people or circumstances take them off their game or bother them at the table.
- They live a healthy life, at and away from the table.
- They work hard studying the game and constantly developing skills.
- They don't get discouraged when things go poorly, even for a long time. Pros are impossible to keep down. Develop this mindset to succeed.`
          }
        ]
      },
      {
        id: 'module-5',
        title: 'Final Quiz & Your Path Forward',
        description: 'Assess your knowledge and get guidance for continued improvement as a small stakes cash game player.',
        lessons: [
          {
            id: 'final-5-1',
            title: 'Final Cash Game Knowledge Check',
            completed: false,
            content: `# Final Cash Game Knowledge Check

## Purpose of the Final Assessment

Congratulations on reaching the end of the course! This is your opportunity to put the knowledge you've gained to the test and ensure you have mastered the most important concepts for small stakes cash game success.

A short companion quiz has been created for this course to help you assess your understanding and reinforce your learning.

## Quiz Details and Reinforcement

- The quiz consists of **10 questions**.
- Each question relates to a specific concept discussed in this course, covering topics from opponent profiling and preflop strategy to postflop play, bankroll management, and mindset.
- If you answer a question incorrectly, the quiz will direct you to the appropriate section in this course so you can review and strengthen your understanding of that topic.
- **Strongly recommended:** Keep taking this quiz until you achieve a perfect score. This will help reinforce your mastery of the concepts and ensure you are ready to apply them at the tables.

## Interactive Element: Re-take Quiz

You now have access to the same 10-question interactive quiz featured in [Lesson 0.2: Self-Assessment: Your Current Cash Game Understanding].

- Treat this as your **Final Cash Game IQ Test** to measure your improvement since starting the course.
- The quiz functionality remains the same: you'll receive immediate feedback, short analysis after each question, and direction to relevant course sections for any incorrect answers.
- Use this tool as often as needed to solidify your knowledge and track your progress.

---

> **Ready to test your skills? Click below to begin the Final Cash Game IQ Test!**

[Start Final Quiz]
`
          },
          {
            id: 'final-5-2',
            title: 'Conclusion & Continuing Your Poker Education',
            completed: false,
            content: `# Conclusion & Continuing Your Poker Education

## Congratulations on Completing the Course!

You've reached the end of 'Strategic Mastery of Small Stakes Cash Games.' You should now have a solid foundation to become a successful small stakes cash game player, equipped with the technical skills, strategic insights, and professional habits needed to win consistently.

## The Journey Continues

Remember, poker development is an ongoing process. The best players are always learning, studying, and refining their approach. To further master small stakes cash games, consider seeking out additional resources and opportunities for improvement.

### Recommended Next Steps

- **Review Hand Histories:** One of the most valuable ways to continue your education is by reviewing detailed hand history analyses from actual small stakes sessions (e.g., $1/$2 games). These reviews show how to apply course concepts in real time and highlight common mistakes made by opponents.
  - For example, the source text describes a 15-hour live $1/$2 cash game session where 30 hands were reviewed, demonstrating how winnings were achieved and how opponent errors were capitalized upon.
- **Seek Out Credible Learning Materials:** Look for books, videos, and forums that focus on practical application and analysis of small stakes play. Prioritize resources that emphasize real-world examples and actionable advice.
- **Stay Disciplined and Analytical:** Continue to track your results, analyze your play, and work on both your technical and mental game. The habits you develop now will serve you well as you move up in stakes.

## Final Words

Thank you for taking this course. Stay focused, keep learning, and enjoy the journey to becoming a truly formidable small stakes cash game player!
`
          }
        ]
      }
    ]
  };

  const handleModuleClick = (module) => {
    window.dispatchEvent(new Event('minimizeSidebar'));
    navigate(`/learn/course/${courseId}/module/${module.id}`, {
      state: { module, course }
    });
  };

  // Fetch lesson progress from Supabase on mount
  useEffect(() => {
    const fetchLessonProgress = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('lesson_progress')
        .select('lesson_id, completed')
        .eq('user_id', user.id);
      if (error) return;
      const progressMap = {};
      data.forEach(row => {
        progressMap[row.lesson_id] = row.completed;
      });
      setLessonCompletion(progressMap);
    };
    fetchLessonProgress();
  }, [user]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation Bar */}
      <div className="bg-[#1a1a1a] border-b border-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-white">BigStack</h1>
        </div>
        <button
          onClick={() => navigate('/learn')}
          className="flex items-center bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Courses
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-400 mb-4">{course.description}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>{course.totalLessons} lessons</span>
            <span>•</span>
            <span>{course.estimatedTime}</span>
            <span>•</span>
            <span>{course.level}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {course.modules.map((module) => {
            // Calculate real completion state for this module
            const moduleLessonIds = module.lessons.map(l => l.id);
            const completed = moduleLessonIds.filter(id => lessonCompletion[id]).length;
            const total = moduleLessonIds.length;
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
            return (
              <div
                key={module.id}
                onClick={() => handleModuleClick(module)}
                className="bg-[#1F2127] rounded-xl p-6 hover:bg-[#252831] transition-all cursor-pointer transform hover:scale-105"
              >
                <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
                <p className="text-gray-400 mb-4">{module.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
                  <span>{total} lessons</span>
                  <div className="flex items-center">
                    <span className="mr-2">View Module</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="h-2 bg-[#2a2d36] rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400">{completed}/{total} lessons • {percent}% complete</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModulesPage; 