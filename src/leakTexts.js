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
    name: "Ultra-Loose Pre-flop (Maniac)",
    description: "With a VPIP of {vpip}%, you are playing more than half of all hands dealt.",
    why: "Playing this many hands means you're entering pots with a significantly wide and weak range. This is often called having a **range disadvantage**. Your opponents, playing tighter ranges, will frequently have you dominated post-flop. This forces you into very difficult, and often losing, situations where you're guessing what to do on the flop, turn, and river with marginal holdings. It's exciting to see a lot of flops, but it's a recipe for bleeding chips in the long run.",
    fix: "We need to fundamentally rebuild your pre-flop starting hand ranges. It's not about playing scared; it's about playing smart. Focus on **positional awareness**. Your range should be tightest in early position (like Under the Gun) and widest on the button. Start with a baseline of raising only premium pairs (TT+), strong aces (AQ+), and some suited connectors from early position. As your position gets later, you can add more hands. This discipline will give you a stronger, more manageable range post-flop."
  },
  loose: {
    name: "Overly Loose Pre-flop",
    description: "Your VPIP of {vpip}% is above the optimal range, suggesting you play too many weak hands.",
    why: "While not as extreme as a maniac, a VPIP this high still indicates you're playing too many marginal hands. This leads to what's known as a 'red-line bleed'—losing money without going to showdown. You'll find yourself in many post-flop spots with hands like a weak top pair or second pair, facing aggression. These situations are tricky because you're often not sure if your hand is best, leading to incorrect calls or folds. Your opponents can exploit this by value-betting relentlessly or bluffing you off better hands.",
    fix: "The fix is to be more selective with your starting hands, especially offsuit combinations. A hand like KTo looks tempting, but it's often dominated by KT-suited, AK, KQ, and can get you into a lot of trouble. Use pre-flop charts as a guideline—not a strict rulebook, but a solid foundation. Focus on playing hands that have good **post-flop playability**, like suited and connected cards, over disconnected offsuit hands."
  },
  nit: {
    name: "Too Tight / Predictable (Nit)",
    description: "Your VPIP is only {vpip}%. You are likely playing only the strongest premium hands.",
    why: "Playing extremely tight makes your hand range completely **face-up**. When you finally decide to enter a pot, everyone at the table knows you have a monster. As a result, you get no action. Opponents will fold to your raises unless they also have a premium hand, so you never get paid off. You also miss out on countless opportunities to win smaller pots by stealing blinds or outplaying opponents post-flop in situations where position and skill are more important than pure hand strength.",
    fix: "You need to widen your opening range, especially from late position. The button (BTN) and cutoff (CO) are your money-making seats. From the button, you should be trying to open raise at least 40-50% of your hands. Start by adding suited connectors (like 87s, 98s) and suited gappers (like T8s, J9s) to your repertoire. These hands have great **implied odds** and can make strong flushes and straights that will be disguised, ensuring you get paid when you hit."
  },
  passivity: {
    name: "Excessive Pre-flop Passivity",
    description: "With a VPIP of {vpip}% and a PFR of {pfr}%, you call raises far more often than you re-raise, letting opponents control the hand.",
    why: "This makes you predictable and easy to play against. When you only call, you give up the **initiative** in the hand. The pre-flop raiser gets to dictate the betting and can put you in tough spots post-flop, even when they have a weaker hand. They can c-bet with a high frequency, and you're left guessing. By not 3-betting your strong hands, you fail to build a bigger pot when you have a significant advantage. Furthermore, a passive strategy allows opponents to see cheap flops with speculative hands (like suited connectors or small pairs), which can crack your premium pairs. You're essentially letting them realize their equity for a very small price.",
    fix: "We need to build a 3-betting range. It's not just about getting more value from your monsters (AA, KK, QQ, AK), although that's a huge part of it. It's about taking control. Start by exclusively 3-betting these premium hands. As you get comfortable, we can start adding **polarized 3-bet bluffs**. These are hands that aren't quite good enough to call a raise with, but have good potential, like suited 'wheel' Aces (A2s-A5s). They block strong Ace-King or Ace-Queen hands your opponent might have, and they can make the nut flush. By 3-betting a mix of value and bluffs, you become unpredictable and much tougher to play against. Your opponents won't know if you have aces or a suited ace, and they'll have to respect your raises."
  },
  tight: {
    name: "Overly Tight Pre-flop",
    description: "You are folding too often pre-flop, with a VPIP of {vpip}%, likely playing only premium hands.",
    why: "While playing strong hands is good, being too tight makes you extremely predictable. Observant opponents will know you only have a monster hand when you enter the pot and will easily fold unless they have a monster themselves, preventing you from getting paid. You are surrendering your blinds too easily and not taking advantage of profitable situations from later positions.",
    fix: "Let's work on expanding your opening ranges, starting with the most profitable positions: the Cutoff (CO) and the Button (BTN). From the button, you should be opening a wide variety of hands. Think about it: there are only two players left to act, and you are guaranteed to be in position post-flop. Start by adding more suited hands, even ones with gaps like J9s or T8s, and all pairs. From the cutoff, you can do the same but be slightly more conservative. This aggression will win you more blinds and put you in control of more hands."
  },
  spewyOpen: {
    name: "Overly Aggressive Opens",
    description: "Raising pre-flop with a very wide range, indicated by a high PFR of {pfr}% compared to your VPIP.",
    why: "While aggression is good, opening too wide from early and middle position (EP/MP) is a significant leak. When you open from EP, there are many players left to act behind you. This increases the chances of someone waking up with a monster hand and 3-betting you. When you get 3-bet, you are forced to fold your weaker holdings, losing your initial raise. If you call, you are often out of position with a dominated hand, a very difficult spot to navigate.",
    fix: "We need to tighten your opening ranges considerably from early and middle position. A solid EP opening range in a 9-handed game is very narrow, maybe only 10-15% of hands (e.g., 77+, ATs+, KQs, AJo+). As you move to later positions like the Hijack, Cutoff, and Button, you can and should widen this range significantly. Positional discipline is key to profitable pre-flop play."
  },
  btnTight: {
    name: "Under-Opening Button",
    description: "Your Button Raise-First-In (RFI) is only {btnRfi}%, which is far too low.",
    why: "The button is the single most profitable position in poker. You are guaranteed to act last on every post-flop street. This **positional advantage** is so powerful that you can profitably play a huge number of hands. By folding too often, you are literally burning money by giving up easy opportunities to steal the blinds or play profitable pots in position against the small and big blinds' wide defending ranges.",
    fix: "You should aim to open-raise at least 45-50% of hands from the button when it's folded to you. This includes all pairs, all suited aces, most suited kings, all broadway hands (like KTo, QJo), and many suited connectors and gappers. It will feel uncomfortable at first, but it is a fundamental pillar of winning poker. Seize the power of the button!"
  },
  coTight: {
    name: "Under-Opening Cut-off",
    description: "Your Cut-off Raise-First-In (RFI) is only {coRfi}%, which is too tight.",
    why: "Similar to the button, the cutoff (CO) is a highly profitable late position seat. While not as powerful as the button, you still only have three players to act after you (BTN, SB, BB). By playing too tight from the CO, you miss many profitable steal opportunities, especially if the button is a tight player. You are giving up a chance to isolate weaker players in the blinds and play a pot in position.",
    fix: "Your goal from the CO should be to open-raise around 27-30% of your hands. This is a significant increase but crucial for your win rate. Expand your opening range to include more suited connectors, suited aces, and weaker broadway hands than you would from middle position. An aggressive CO strategy puts immense pressure on the button and the blinds."
  },
  openLimp: {
    name: "Open-Limping",
    description: "You open-limp {openLimp}% of the time. This means you are just calling the big blind instead of raising when you are the first person to enter the pot.",
    why: "Open-limping is one of the most significant leaks a player can have. When you limp, you give up the **initiative** and invite other players into the pot for a cheap price. This creates multi-way pots where your hand equity decreases significantly. It also makes your hand range transparent; players will correctly assume you have a weak-to-medium strength hand you were afraid to raise. You cannot win the pot pre-flop, and you are setting yourself up for difficult post-flop situations.",
    fix: "Adopt a strict 'raise-or-fold' policy when you are the first player to enter the pot. If a hand is not good enough to raise with, it's not good enough to play at all. This single change will make you a more aggressive, less predictable, and more profitable player. The only rare exception might be in some very specific live game dynamics, but for online play and general strategy, eliminating the open-limp is critical."
  },
  sbOverFold: {
    name: "SB Over-Folds vs Steal",
    description: "You fold your Small Blind {sbFoldSteal}% of the time when facing a raise from a late position (CO or BTN).",
    why: "When you fold your small blind, you are only losing half a big blind. However, when it's a steal attempt from late position, the pot is already offering you attractive odds to call or 3-bet. By folding too often, you become a prime target for aggressive players who will relentlessly raise your blind, knowing it's an easy win for them. You are giving up on pots where you have a mathematical edge to continue.",
    fix: "Against a button raise, you should be defending your small blind much more frequently. This doesn't just mean calling. A good SB strategy involves a mix of calling and 3-betting. You should 3-bet your premium hands for value and add in some polarized bluffs (like suited connectors or suited aces). You should call with hands that play well post-flop, like medium pairs and suited broadways. This aggressive defense will make you much less exploitable."
  },
  bbOverFold: {
    name: "BB Over-Folds vs Steal",
    description: "You fold your Big Blind {bbFoldSteal}% of the time against a steal from a late position.",
    why: "The big blind is a special position. You already have one big blind invested in the pot, which means you are getting excellent **pot odds** to defend against a raise. For example, if the button min-raises to 2bb, you only have to call 1bb to play for a pot that will be 4.5bb. Folding too often here is a massive leak and directly hurts your win rate. You are essentially lighting money on fire by giving up on these mathematically profitable situations.",
    fix: "You can and should defend your big blind with a very wide range of hands, especially against a min-raise. This includes almost any two suited cards, many offsuit connectors and one-gappers, and of course any pair. Your defense should primarily be calling, as you will be out of position post-flop. However, you should still have a 3-betting range for value and bluffs to keep your opponents from raising with any two cards."
  },
  overCbet: {
    name: "Over-C-Betting the Flop",
    description: "Your flop continuation-bet (C-bet) is {cbetFlop}%. This suggests you are betting the flop almost every time you were the pre-flop raiser.",
    why: "C-betting with a near-100% frequency is a strategy that worked in the past but is easily exploited by modern players. When you c-bet every single flop, you are betting with your strong hands, your marginal hands, and your complete air. Observant opponents will realize this and start 'floating' (calling your bet with the intention of taking the pot away on a later street) or simply raising your c-bet as a bluff, putting you in a very tough spot. Your range is too wide and weak to withstand this pressure.",
    fix: "You need to develop a **checking range** after you raise pre-flop. Your decision to c-bet should be based on several factors, primarily **board texture** and the number of opponents. On dry, uncoordinated boards (like K72 rainbow), you can c-bet with a high frequency. On wet, coordinated boards (like J T 9 with a flush draw), you should check much more often, as these boards are more likely to have connected with your opponent's calling range. Checking controls the size of the pot and protects you from being check-raised."
  },
  underCbet: {
    name: "Under-C-Betting the Flop",
    description: "Your flop C-bet is only {cbetFlop}%, which means you are often checking after being the pre-flop aggressor.",
    why: "By not c-betting enough, you are missing out on value and giving your opponents free cards. When you have a strong hand, you want to build the pot. When you have a bluff, a c-bet can often win the pot right there. By checking, you are letting your opponents **realize their equity** for free. A hand like 65s might be a big underdog to your AK on an A72 flop, but if you check, you give them a free card to potentially hit a straight or flush.",
    fix: "Be more aggressive with c-betting, especially when you are in position and heads-up. On dry boards (like A83 rainbow), you should be c-betting with a very high frequency. These boards are unlikely to have hit your opponent's range. You can use a small bet sizing (like 1/3 pot) to apply pressure cheaply. Remember, the goal of a c-bet isn't always to get value; it's often to deny equity and take down the pot uncontested."
  },
  rareDouble: {
    name: "Rarely Double-Barrels",
    description: "After c-betting the flop, you only bet the turn {cbetTurn}% of the time. This is too low.",
    why: "If you frequently c-bet the flop but then give up on the turn, your opponents will pick up on this pattern. They will start calling your flop c-bets with a wide range of hands, knowing that if they just call, you will often check the turn and give them a free card or an opportunity to bluff you. Your flop c-bets become ineffective because they carry no threat of further aggression.",
    fix: "You need a plan for the turn. Your turn barreling strategy should be based on how the turn card interacts with your range and your opponent's range. Good cards to double-barrel on are cards that are good for your perceived range. For example, if you raised pre-flop and the flop was T52, and the turn is a K or an A, that is a great card to continue betting. You should be double-barreling with your value hands and a selection of semi-bluffs (like flush draws or straight draws)."
  },
  spewTriple: {
    name: "Spewy Triple-Barreling",
    description: "You fire a river c-bet {cbetRiver}% of the time after betting the flop and turn. This is very high.",
    why: "Emptying the clip and betting on all three streets is a powerful move, but only when done with the right hands and in the right situations. Firing a third barrel with too high a frequency means you are bluffing too often. Smart opponents will realize you can't always have a strong hand and will start calling you down with wider ranges, catching your bluffs. A triple-barrel bluff is expensive, and getting called can be devastating to your stack.",
    fix: "Your river betting range needs to be more polarized. Before you bet the river for value, ask yourself: 'What weaker hands can call me?' If there aren't many, consider checking. Before you bluff, think about what hands you are representing. Does your betting line make sense? Good river bluffs often have some **blocker** value. For example, holding an ace of the flush suit when you bluff the river makes it less likely your opponent has the nut flush. Be more selective with your river aggression."
  },
  foldVsCbet: {
    name: "Folds Too Much vs Flop C-Bet",
    description: "You fold {foldVsCbetFlop}% of the time when facing a flop continuation bet.",
    why: "If you fold to c-bets too often, you are a walking ATM for aggressive players. They will notice this and c-bet against you with 100% of their range because it's so profitable. You are giving up your equity in the pot too easily. Even hands with long-shot potential have a right to see the turn if the price is right. You are essentially playing 'fit-or-fold' poker, which is a losing strategy in the long run.",
    fix: "You need to defend against c-bets more strategically. This doesn't mean calling down every time. Your defense should include calling, raising, and folding. You should continue with any decent pair, any good draw (flush or open-ended straight draw), and even some backdoor draws (e.g., two cards to a flush or straight) if the bet size is small. Raising as a semi-bluff with a draw is also a powerful move that puts the pressure back on the c-bettor."
  },
  no3bet: {
    name: "Never 3-Betting",
    description: "Your overall 3-bet frequency is just {threeBetOverall}%. This means you are almost never re-raising an opponent's initial raise.",
    why: "Without a 3-betting game, you are a passive player. You allow opponents to see flops cheaply with their entire opening range, realizing their equity. You miss out on value with your premium hands (you want to build a big pot with AA!), and you become extremely predictable. Aggressive opponents will raise with a wide range of hands, knowing you'll just call, and they can outplay you post-flop. A lack of 3-betting forfeits a key weapon in your poker arsenal.",
    fix: "We need to construct a proper 3-betting range. Start with a simple, **linear** range: 3-bet your best hands for value (e.g., QQ+, AK). Once you are comfortable with that, we can evolve it into a more sophisticated **polarized** range. This means 3-betting your premium value hands, but also adding in some bluffs. Good bluffing candidates are hands like suited aces (A2s-A5s) because they have good **blocker** effects (making it less likely your opponent has AA or AK) and can make the nut flush."
  },
  fold3bet: {
    name: "Folds Too Much vs 3-Bet",
    description: "You open-raise, an opponent 3-bets, and you fold {foldVs3}% of the time. This is too high.",
    why: "If you fold to 3-bets too often, you become a massive target for aggressive, thinking players. They will notice your high fold-to-3-bet statistic and start 3-betting you with a very wide range of hands as a pure bluff. Every time you open-raise and then fold, you lose your initial investment. This leak can drain your stack very quickly without you ever seeing a flop.",
    fix: "You need a plan for when you face a 3-bet. First, tighten your opening ranges from early position. If you open with stronger hands, you'll be able to defend more effectively. Your defense should include both calling and 4-betting. You should have a 4-betting range that includes your absolute premium hands (AA, KK) for value, and some bluffs (like Axs) to balance it. With the rest of your continuing range (like AQ, AJ, TT, 99), you can just call the 3-bet and play poker post-flop."
  },
  no4bet: {
    name: "Never 4-Betting",
    description: "Your overall 4-bet frequency is only {fourBetOverall}%. This suggests you only ever 4-bet with pocket Aces or Kings.",
    why: "If you only 4-bet with AA/KK, you become incredibly predictable. As soon as you 4-bet, your opponents know your exact hand and can play perfectly against you. Furthermore, by just calling 3-bets with hands like QQ or AK, you're missing out on value and allowing your opponents to see a flop and potentially outdraw you. A 4-bet takes away that option and puts maximum pressure on your opponent pre-flop.",
    fix: "Your 4-betting range should not just be for value. A balanced strategy includes 4-betting your premium hands (QQ+, AK) and adding in a few bluffs. The classic 4-bet bluff hand is a suited ace like A5s. It works well because it **blocks** your opponent from having Aces or Ace-King, making it more likely they will fold to your 4-bet. A 4-bet bluff is a high-level play that will make you a formidable opponent."
  },
  fold4bet: {
    name: "Folds Too Much vs 4-Bet",
    description: "You 3-bet and then fold to a 4-bet {foldVs4}% of the time.",
    why: "If you're folding to 4-bets too frequently, it implies your 3-betting range is too wide or you're not correctly defending it. Opponents can exploit this by 4-bet bluffing you, knowing you'll give up on your 3-bet. This negates the purpose of 3-betting as a bluff in the first place and turns a profitable play into a losing one.",
    fix: "The solution lies in proper 3-bet range construction. When you 3-bet, you should have a plan for facing a 4-bet. Your 3-bet range should be composed of hands you're happy to stack off with (like KK, AA) and bluffs that you can comfortably fold to a 4-bet (like A5s, K9s). If you find yourself 3-betting a hand like AJo and then facing a 4-bet, it's often a tricky spot. Make sure your 3-bet bluffs are hands you are willing to let go of, and your value 3-bets are hands you are willing to play for stacks."
  },
  passivePost: {
    name: "Ultra-Passive Post-Flop",
    description: "Your Aggression Factor (AF) is only {af}. This indicates you are checking and calling far more than betting or raising post-flop.",
    why: "Passive post-flop play is a major leak. By checking and calling, you let your opponents dictate the action and the size of the pot. You allow them to see free cards and realize their equity, and you make your own hand transparent. If you only bet when you have a monster, good players will fold. If you only check and call, they will run you over with aggression, forcing you to fold the best hand or pay them off when they have it.",
    fix: "You need to look for opportunities to bet and raise. When you have a value hand, you should almost always be betting to build the pot. Don't be afraid to bet for 'thin value' on the river with hands that are likely best but not invincible. You also need to incorporate bluffs and semi-bluffs. Raising on the flop with a draw (a check-raise or a raise vs a c-bet) is a powerful way to win the pot immediately or build a bigger pot for when you hit your hand."
  },
  maniacPost: {
    name: "Over-Aggressive Post-Flop (Maniac)",
    description: "Your Aggression Factor (AF) is {af}, indicating a very high level of post-flop aggression.",
    why: "Uncontrolled aggression is just as bad as being too passive. While betting and raising is good, doing it without a plan or a balanced range is a recipe for disaster. This is often called 'spewing'. You are likely bluffing in spots where it makes no sense, or over-valuing your marginal hands. Opponents will adjust by becoming 'calling stations', letting you bet all three streets with your bluffs and then picking you off at showdown.",
    fix: "We need to harness your aggression and apply it more surgically. Think about what you are representing with your bets and raises. Does your story make sense? Are you betting on board textures that favor your range? We also need to work on pot control with marginal hands. Sometimes, the best play with a medium-strength hand is to check and call, not bet. Aggression is a tool, not a default setting."
  },
  wtsdHigh: {
    name: "Showdown Junkie",
    description: "You go to showdown {wtsd}% of the time, which is very high.",
    why: "A high WTSD (Went to Showdown) percentage usually means you are a 'calling station'. You are calling bets on the flop, turn, and river with hands that are too weak, hoping to get lucky or hoping your opponent is bluffing. This is a massive leak because you are constantly paying off your opponents when they have value hands. Good players will notice this and will stop bluffing you, and start value betting you much more thinly.",
    fix: "You need to become more comfortable with the fold button, especially on the turn and river. When an opponent is showing a lot of aggression, especially on later streets, you have to give them credit for having a strong hand more often. Learn to evaluate the relative strength of your hand. Having top pair is great on the flop, but if there is a lot of action on the turn and river, and multiple flush and straight draws complete, your top pair might not be good anymore. Don't be a hero."
  },
  wtsdLow: {
    name: "Showdown Shy",
    description: "You only reach showdown {wtsd}% of the time. This suggests you are folding too often.",
    why: "A low WTSD percentage is a sign that you are being bluffed too often. You are likely folding medium-strength hands on the turn or river to aggression. You might be playing too 'scared', overly concerned about your opponent having the nuts. While it's good to be cautious, folding too much means you are giving up pots that rightfully belong to you. You are not getting your fair share of showdowns.",
    fix: "You need to develop the ability to make 'hero calls' with hands that can beat bluffs. These are often hands like second or third pair. Before you fold on the river, analyze your opponent's line. Does it make sense for them to have a value hand? Or is it more likely they are bluffing with a busted draw? You don't have to call every time, but you need to start calling some of the time with your bluff-catchers to prevent opponents from running you over."
  },
  wsdLow: {
    name: "Poor Showdown Results (Low WSD)",
    description: "You only win {wsd}% of the time when you do get to showdown.",
    why: "A low WSD (Won at Showdown) percentage is a clear indicator that you are going to showdown with the worst hand too often. This usually stems from two issues: either you are calling down way too lightly (being a calling station), or you are not value betting effectively and are checking through with hands that should have gotten more money in the pot. It's a sign that your hand-reading skills need refinement.",
    fix: "We need to work on two things. First, tighten up your calling ranges on the turn and river. As mentioned for the 'Showdown Junkie' leak, you need to learn to fold marginal hands when facing significant aggression. Second, you need to be more aggressive with your own value hands. When you think you have the best hand, you should be betting to extract value from your opponent's weaker holdings. This will increase your WSD because sometimes your opponent will fold, and when they call, you'll win a bigger pot."
  },
  wwsfLow: {
    name: "Low Flop Success (WWSF)",
    description: "You win the pot after seeing a flop only {wwsf}% of the time.",
    why: "WWSF (Won When Saw Flop) is a key stat that often points to overly passive post-flop play. If this number is low, it means that when you see a flop, you are frequently getting pushed out of the pot. This could be because you are check-folding too often, not c-betting enough as the aggressor, or not defending enough against c-bets. You are not fighting hard enough for pots post-flop.",
    fix: "The solution is to play more aggressively and strategically post-flop. As the pre-flop raiser, you need an effective c-betting strategy. As the pre-flop caller, you need to defend against c-bets by calling and raising. Look for opportunities to take control of the pot. Don't just give up because you didn't hit the flop perfectly. Semi-bluffing with your draws and floating in position are key skills to develop to increase your WWSF."
  },
  noDonk: {
    name: "Never Donk-Betting",
    description: "Your flop donk-bet frequency is {donkFlop}%. A donk bet is when you bet into the pre-flop raiser, out of position.",
    why: "While donk-betting was traditionally seen as a weak, fishy play, modern GTO (Game Theory Optimal) strategies have shown that having a small donk-betting range is actually optimal in certain situations. By never donk-betting, your checking range becomes more defined and potentially exploitable. When you check, the pre-flop raiser knows you don't have a certain category of hands, which makes their life easier.",
    fix: "This is an advanced concept, so we should approach it carefully. You can start to introduce a donk-betting range on very specific board textures. For example, on low, connected boards like 6-5-4, when you are in the big blind against a button raise. These boards hit the big blind's calling range much harder than the button's raising range. You can lead out with some of your strong hands (like sets and two pairs) and some draws. This balances your checking range and makes you much harder to play against."
  },
  noCheckRaise: {
    name: "Never Check-Raising",
    description: "Your flop check-raise frequency is {xrFlop}%. This means you are never check-raising as a bluff or for value.",
    why: "The check-raise is one of the most powerful moves in poker. Without it, you are fighting with one hand tied behind your back. If you never check-raise, aggressive opponents can c-bet against you with impunity, knowing they will never face a raise. You lose value with your monster hands (you want to build a big pot!), and you have no way to effectively bluff opponents off their equity.",
    fix: "You need to start looking for spots to check-raise. When you are out of position, this is your primary weapon. Your check-raising range should be polarized: include your monster hands (like sets, two-pair) for value, and your strong semi-bluffs (like flush draws, open-ended straight draws) as bluffs. Check-raising puts your opponent to a tough decision and allows you to take control of the hand. Start by identifying spots where the board is dynamic and you have a good draw."
  },
  losingBB: {
    name: "Overall Losing Player (bb/100)",
    description: "Your win-rate is {bb100} bb/100 over the sample, which indicates you are a losing player in these games.",
    why: "A negative win-rate is the ultimate sign that there are fundamental leaks in your strategy. It's the sum total of all the small and large mistakes you are making. It's not about being unlucky; over a large enough sample, luck evens out. This result means your current approach to the game is not profitable against the opponents you are facing.",
    fix: "The fix is a holistic one. It requires a commitment to study and a systematic approach to plugging your leaks. We've identified many potential leaks already. The path forward is to work on them one by one. Start with the pre-flop leaks, as they are the foundation of your entire game. Solid pre-flop ranges will make your post-flop decisions easier. Review your hand histories, especially the big pots you lost. Be honest with your self-assessment and be willing to change. This is a journey, but a profitable one."
  }
};
