import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';

// Dummy function to get lesson details - replace with actual data fetching or structure
const getLessonDetails = (categoryName, lessonId) => {
  // For now, just return some placeholder data based on IDs
  const allLessons = {
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

All of this is volatile. You will lose some large pots when the maniac's 40 percent range happens to wake up with aces or spikes a river. Your job is to keep perspective. If someone literally volunteers to shovel money in with 40 percent equity, your bankroll grows every time you accept the gamble. Emotional stability refusing to tighten up in fear after a bad beat is as much a skill edge as any technical line you choose.`,
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

const LessonPage = () => {
  const { categoryName, lessonId } = useParams();
  const lesson = getLessonDetails(categoryName, lessonId);

  if (!lesson) {
    return (
      <PageLayout>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Lesson Not Found</h1>
          <p className="text-gray-400 mb-6">Sorry, we couldn't find the lesson you're looking for.</p>
          <Link to={`/learn/${categoryName || ''}`} className="text-indigo-400 hover:text-indigo-300">
            Back to {categoryName ? categoryName.replace('-', ' ').toUpperCase() : 'Lessons'}
          </Link>
        </div>
      </PageLayout>
    );
  }

  const formattedCategoryName = categoryName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link to={`/learn/${categoryName}`} className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {formattedCategoryName}
          </Link>
          <h1 className="text-4xl font-extrabold text-white mb-2">{lesson.title}</h1>
          {/* Optional: Add author, date, difficulty etc. here */}
        </div>

        {lesson.videoUrl && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-xl">
            <iframe 
              width="100%" 
              height="400" // Adjust height as needed
              src={lesson.videoUrl} 
              title={lesson.title}
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        )}

        <article className="prose prose-lg prose-invert max-w-none text-gray-300 leading-relaxed">
          {/* Render lesson content. This could be Markdown, or structured JSON, etc. */}
          <h2 className="text-2xl font-semibold text-white mt-6 mb-3">Teaching</h2>
          {lesson.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph.trim()}</p>
          ))}
          {/* Example of more structured content */}
          <h2 className="text-2xl font-semibold text-white mt-6 mb-3">Key Characteristics</h2>
          <ul className="list-disc list-inside space-y-1">
            {lesson.keyCharacteristics && lesson.keyCharacteristics.map((characteristic, index) => (
              <li key={index}>{characteristic}</li>
            ))}
          </ul>
          <h2 className="text-2xl font-semibold text-white mt-6 mb-3">How to Exploit</h2>
          {lesson.howToExploit && (
            <ul className="list-disc list-inside space-y-1">
              {lesson.howToExploit.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
          {/* Add more sections: Hand Examples, Quizzes, etc. */}
        </article>
        
        <div className="mt-12 text-center">
            <Link 
              to={lesson.interactiveSection}
              className="inline-block px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
                Interactive Section
            </Link>
        </div>

      </div>
    </PageLayout>
  );
};

export default LessonPage; 