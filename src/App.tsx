import { useEffect, useMemo, useState } from 'react'

type Subject = 'Math magic' | 'Story spells' | 'Word wardrobe'
type Question = {
  id: string
  subject: Subject
  eyebrow: string
  prompt: string
  detail?: string
  answers: string[]
  correct: number
  hint: string
  success: string
}

type CatProfile = {
  id: string
  name: string
  fur: 'midnight' | 'pumpkin' | 'silver' | 'cream' | 'lavender' | 'snow'
  eyes: 'gold' | 'emerald' | 'violet' | 'blue' | 'rose' | 'copper'
  pattern: 'solid' | 'stars' | 'tuxedo' | 'stripes' | 'calico' | 'moon' | 'socks'
  ears: 'pointed' | 'soft' | 'tufted' | 'folded' | 'lynx'
  markingColor: 'gold' | 'cream' | 'charcoal' | 'rose' | 'teal' | 'lavender'
  background: 'moon' | 'pumpkins' | 'library' | 'forest' | 'ballroom'
  tail: 'classic' | 'long' | 'short' | 'bob' | 'fluffy'
  eyeShape: 'almond' | 'round' | 'sleepy' | 'wide'
  mood: 'happy' | 'angry' | 'sad' | 'scared'
  pose: 'sit' | 'stretch' | 'prowl' | 'prance'
  outfit: string[]
  room?: LessonRoom
}

type LessonRoom = 'grand-hall' | 'potion-lab' | 'moonlit-library' | 'enchanted-tailor'

type Progress = {
  sessions: number
  correct: number
  attempts: number
  unlocked: string[]
  subjectCorrect: Record<Subject, number>
  cats: CatProfile[]
  recentByRoom: Partial<Record<LessonRoom, string[]>>
}

type Reward = {
  name: string
  icon: string
  slot: 'head' | 'body' | 'feet'
  style: string
  description: string
}

const QUESTIONS: Question[] = [
  {
    id: 'math-bridge-1',
    subject: 'Math magic',
    eyebrow: 'Potion Boutique',
    prompt: 'Miso needs 28 moon buttons and 15 star buttons. How many buttons altogether?',
    detail: 'Try making a new ten.',
    answers: ['33', '43', '42', '53'],
    correct: 1,
    hint: 'Split 15 into 2 and 13. Then 28 + 2 makes 30.',
    success: 'Yes! 28 + 15 = 43. You made a new ten to solve it.',
  },
  {
    id: 'reading-review-1',
    subject: 'Story spells',
    eyebrow: 'Moonlit Library',
    prompt: 'Luna packed her rain boots. Dark clouds covered the moon, and drops tapped the window. Why did Luna pack boots?',
    answers: ['She expected rain', 'She was going to bed', 'She lost her shoes', 'She wanted to dance'],
    correct: 0,
    hint: 'Look for two clues about the weather.',
    success: 'Exactly. The dark clouds and drops are evidence that rain is coming.',
  },
  {
    id: 'word-review-1',
    subject: 'Word wardrobe',
    eyebrow: 'Enchanted Tailor',
    prompt: 'Choose the word that means the opposite of enormous.',
    answers: ['sparkly', 'tiny', 'towering', 'heavy'],
    correct: 1,
    hint: 'Enormous means very, very big.',
    success: 'Perfect! Tiny is an antonym, or opposite, of enormous.',
  },
  {
    id: 'math-review-2',
    subject: 'Math magic',
    eyebrow: 'Potion Boutique',
    prompt: 'A shelf holds 64 purple bottles and 27 green bottles. How many bottles are there in all?',
    detail: 'Add the tens, then the ones.',
    answers: ['81', '91', '101', '87'],
    correct: 1,
    hint: '60 + 20 = 80, and 4 + 7 = 11.',
    success: 'Brilliant! 64 + 27 = 91 bottles.',
  },
  {
    id: 'math-review-3',
    subject: 'Math magic',
    eyebrow: 'Potion Boutique',
    prompt: 'There are 72 treats. The cats eat 35. How many treats remain?',
    answers: ['37', '47', '43', '107'],
    correct: 0,
    hint: 'First subtract 30 from 72, then subtract 5 more.',
    success: 'Correct! 72 − 35 = 37 treats.',
  },
  {
    id: 'math-bridge-4',
    subject: 'Math magic',
    eyebrow: 'Potion Boutique',
    prompt: 'Three cats each need 4 silver bells. How many bells are needed altogether?',
    detail: 'Think of equal groups.',
    answers: ['7', '10', '12', '16'],
    correct: 2,
    hint: 'Count 4 three times: 4, 8, 12.',
    success: 'Exactly! 3 groups of 4 make 12.',
  },
  {
    id: 'reading-review-2',
    subject: 'Story spells',
    eyebrow: 'Moonlit Library',
    prompt: 'Ash practiced the same spell each morning. At first it fizzled, but on Friday it filled the room with stars. What helped Ash succeed?',
    answers: ['Getting lucky', 'Practicing often', 'Changing rooms', 'Sleeping late'],
    correct: 1,
    hint: 'What did Ash do again and again?',
    success: 'Yes. The story shows that regular practice helped Ash improve.',
  },
  {
    id: 'reading-review-3',
    subject: 'Story spells',
    eyebrow: 'Moonlit Library',
    prompt: 'The tiny kitten stood in front of the nervous crowd. She took a breath and began her song. Which word best describes her?',
    answers: ['Brave', 'Careless', 'Sleepy', 'Unkind'],
    correct: 0,
    hint: 'She was nervous, but she performed anyway.',
    success: 'Right! Acting even when nervous shows bravery.',
  },
  {
    id: 'reading-review-4',
    subject: 'Story spells',
    eyebrow: 'Moonlit Library',
    prompt: 'First, Nova sketched a cape. Next, she cut the cloth. Finally, she sewed on the stars. What happened second?',
    answers: ['She wore the cape', 'She sketched it', 'She cut the cloth', 'She added stars'],
    correct: 2,
    hint: 'Look for the event after “Next.”',
    success: 'Correct. Nova cut the cloth second.',
  },
  {
    id: 'word-review-2',
    subject: 'Word wardrobe',
    eyebrow: 'Enchanted Tailor',
    prompt: 'Which word means almost the same thing as shimmer?',
    answers: ['Glow', 'Hide', 'Tumble', 'Whisper'],
    correct: 0,
    hint: 'Think about what soft light does.',
    success: 'Yes! Glow and shimmer have similar meanings.',
  },
  {
    id: 'word-review-3',
    subject: 'Word wardrobe',
    eyebrow: 'Enchanted Tailor',
    prompt: 'Choose the correct word: The cat flicked ___ tail.',
    answers: ["it's", 'its', 'it is', 'its’'],
    correct: 1,
    hint: 'You need the word that shows the tail belongs to the cat.',
    success: 'You got it! “Its” shows possession.',
  },
  {
    id: 'word-bridge-4',
    subject: 'Word wardrobe',
    eyebrow: 'Enchanted Tailor',
    prompt: 'If “careful” means full of care, what does “hopeful” mean?',
    answers: ['Without hope', 'Full of hope', 'Before hope', 'Hoping again'],
    correct: 1,
    hint: 'The suffix “-ful” means full of.',
    success: 'Exactly. Hopeful means full of hope.',
  },
]

QUESTIONS.push(
  // Math magic: 11 additional questions, for 15 total.
  { id: 'math-05', subject: 'Math magic', eyebrow: 'Potion Boutique', prompt: 'Which number has 6 hundreds, 3 tens, and 8 ones?', answers: ['638', '368', '603', '68'], correct: 0, hint: 'Put 6 in the hundreds place, 3 in the tens place, and 8 in the ones place.', success: 'Correct! 6 hundreds + 3 tens + 8 ones is 638.' },
  { id: 'math-06', subject: 'Math magic', eyebrow: 'Potion Boutique', prompt: 'Which number is greater than 456?', answers: ['399', '450', '465', '356'], correct: 2, hint: 'Compare the hundreds first, then the tens.', success: 'Yes! 465 is greater than 456.' },
  { id: 'math-07', subject: 'Math magic', eyebrow: 'Potion Boutique', prompt: 'The clock shows 4:30. Which phrase means the same time?', answers: ['Quarter past four', 'Half past four', 'Quarter to four', 'Half past five'], correct: 1, hint: 'Thirty minutes is half of an hour.', success: 'Exactly! 4:30 is half past four.' },
  { id: 'math-08', subject: 'Math magic', eyebrow: 'Potion Boutique', prompt: 'A ribbon is 18 inches long. Another is 7 inches long. How much longer is the first ribbon?', answers: ['11 inches', '25 inches', '12 inches', '9 inches'], correct: 0, hint: 'Find the difference: 18 − 7.', success: 'Right! The first ribbon is 11 inches longer.' },
  { id: 'math-09', subject: 'Math magic', eyebrow: 'Potion Boutique', prompt: 'Which group of coins equals 40 cents?', answers: ['4 dimes', '4 pennies', '2 nickels', '1 quarter and 1 nickel'], correct: 0, hint: 'Each dime is worth 10 cents.', success: 'Correct! Four dimes equal 40 cents.' },
  { id: 'math-10', subject: 'Math magic', eyebrow: 'Potion Boutique', prompt: 'Which number is even?', answers: ['17', '29', '34', '45'], correct: 2, hint: 'An even number can be split into two equal groups.', success: 'Yes! 34 is even.' },
  { id: 'math-11', subject: 'Math magic', eyebrow: 'Potion Boutique', prompt: 'What number comes next: 125, 135, 145, ___?', answers: ['150', '155', '165', '245'], correct: 1, hint: 'The pattern adds 10 each time.', success: 'Perfect! Adding 10 to 145 gives 155.' },
  { id: 'math-12', subject: 'Math magic', eyebrow: 'Potion Boutique', prompt: 'A rectangle has sides of 5 inches and 3 inches. What is its perimeter?', answers: ['8 inches', '15 inches', '16 inches', '10 inches'], correct: 2, hint: 'Add every side: 5 + 3 + 5 + 3.', success: 'Correct! The perimeter is 16 inches.' },
  { id: 'math-13', subject: 'Math magic', eyebrow: 'Potion Boutique', prompt: 'A shape is divided into 4 equal parts. One part is shaded. What fraction is shaded?', answers: ['1/2', '1/3', '1/4', '4/1'], correct: 2, hint: 'The denominator tells how many equal parts make the whole.', success: 'Exactly! One of four equal parts is 1/4.' },
  { id: 'math-14', subject: 'Math magic', eyebrow: 'Potion Boutique', prompt: 'Five cats sit in 2 equal rows. How many cats are there altogether?', answers: ['7', '10', '3', '12'], correct: 1, hint: 'Two groups of five means 5 + 5.', success: 'Yes! 2 groups of 5 make 10.' },
  { id: 'math-15', subject: 'Math magic', eyebrow: 'Potion Boutique', prompt: 'Round 47 to the nearest ten.', answers: ['40', '45', '50', '60'], correct: 2, hint: '47 is closer to 50 than to 40.', success: 'Correct! 47 rounds to 50.' },

  // Story spells: 11 additional questions, for 15 total.
  { id: 'reading-05', subject: 'Story spells', eyebrow: 'Moonlit Library', prompt: 'Pip planted a seed, watered it, and placed it by the sunny window. Soon a green shoot appeared. What is the main idea?', answers: ['Pip grew a plant', 'Windows are green', 'Seeds dislike water', 'Pip lost a flower'], correct: 0, hint: 'Choose the answer that tells what the whole passage is mostly about.', success: 'Correct! The passage is mainly about Pip growing a plant.' },
  { id: 'reading-06', subject: 'Story spells', eyebrow: 'Moonlit Library', prompt: 'The path glittered with ice, so Olive took tiny, careful steps. Why did Olive walk carefully?', answers: ['She was dancing', 'The path was slippery', 'She was tired', 'The path was crowded'], correct: 1, hint: 'What might happen when a path is covered in ice?', success: 'Right! The icy path could be slippery.' },
  { id: 'reading-07', subject: 'Story spells', eyebrow: 'Moonlit Library', prompt: '“I can carry the lantern,” said Wren. “You carry the map.” What can you infer about Wren?', answers: ['Wren likes teamwork', 'Wren is lost', 'Wren dislikes lanterns', 'Wren wants to be alone'], correct: 0, hint: 'Wren suggests that each cat do one helpful job.', success: 'Yes! Wren is cooperating and sharing the work.' },
  { id: 'reading-08', subject: 'Story spells', eyebrow: 'Moonlit Library', prompt: 'The old door groaned as it slowly opened. What mood does this sentence create?', answers: ['Silly', 'Mysterious', 'Cheerful', 'Peaceful'], correct: 1, hint: 'Think about how a groaning old door might make you feel.', success: 'Exactly! The description creates a mysterious mood.' },
  { id: 'reading-09', subject: 'Story spells', eyebrow: 'Moonlit Library', prompt: 'Bram forgot his umbrella. By the time he reached school, his fur dripped onto the floor. What caused Bram to get wet?', answers: ['He forgot his umbrella', 'The floor was wet', 'He went swimming', 'School ended'], correct: 0, hint: 'Look for the event that happened first.', success: 'Correct! Forgetting his umbrella caused Bram to get wet.' },
  { id: 'reading-10', subject: 'Story spells', eyebrow: 'Moonlit Library', prompt: 'A book says, “Bats sleep during the day and search for food at night.” When do bats search for food?', answers: ['At noon', 'At night', 'In the morning', 'All day'], correct: 1, hint: 'The answer is stated directly in the sentence.', success: 'Right! The text says bats search for food at night.' },
  { id: 'reading-11', subject: 'Story spells', eyebrow: 'Moonlit Library', prompt: 'Mara wanted the blue ribbon, but she gave it to a younger kitten who had none. Which trait describes Mara?', answers: ['Generous', 'Greedy', 'Impatient', 'Forgetful'], correct: 0, hint: 'She gave away something she wanted to help someone else.', success: 'Yes! Giving to someone else shows generosity.' },
  { id: 'reading-12', subject: 'Story spells', eyebrow: 'Moonlit Library', prompt: 'Before the show, Jun checked every button twice. During the show, nothing came loose. What lesson fits the story?', answers: ['Careful preparation helps', 'Buttons are unimportant', 'Shows should be short', 'Never check your work'], correct: 0, hint: 'What good result came from checking the buttons?', success: 'Correct! Jun’s careful preparation prevented a problem.' },
  { id: 'reading-13', subject: 'Story spells', eyebrow: 'Moonlit Library', prompt: 'One text explains how spiders spin webs. Another tells a story about a spider winning a race. How are the texts different?', answers: ['One gives facts; one tells a story', 'Both are recipes', 'Both are maps', 'One is about cats'], correct: 0, hint: 'One is informational and one is fiction.', success: 'Exactly! One teaches facts while the other tells a story.' },
  { id: 'reading-14', subject: 'Story spells', eyebrow: 'Moonlit Library', prompt: 'Nell peeked behind the curtain, smiled at the crowd, and stepped onto the stage. Where does this event most likely happen?', answers: ['At a performance', 'In a grocery store', 'Underwater', 'On a farm'], correct: 0, hint: 'A curtain, crowd, and stage are clues.', success: 'Right! Those clues show Nell is at a performance.' },
  { id: 'reading-15', subject: 'Story spells', eyebrow: 'Moonlit Library', prompt: 'First the sky darkened. Then thunder rumbled. Soon rain poured down. Which event happened first?', answers: ['Rain poured', 'Thunder rumbled', 'The sky darkened', 'The sun rose'], correct: 2, hint: 'The word “First” points to the opening event.', success: 'Correct! The sky darkened first.' },

  // Word wardrobe: 11 additional questions, for 15 total.
  { id: 'word-05', subject: 'Word wardrobe', eyebrow: 'Enchanted Tailor', prompt: 'Which word is a synonym for joyful?', answers: ['Happy', 'Angry', 'Silent', 'Rough'], correct: 0, hint: 'A synonym has the same or almost the same meaning.', success: 'Correct! Happy and joyful are synonyms.' },
  { id: 'word-06', subject: 'Word wardrobe', eyebrow: 'Enchanted Tailor', prompt: 'Which word is an antonym for ancient?', answers: ['Old', 'Historic', 'Modern', 'Broken'], correct: 2, hint: 'Ancient means very old.', success: 'Yes! Modern is the opposite of ancient.' },
  { id: 'word-07', subject: 'Word wardrobe', eyebrow: 'Enchanted Tailor', prompt: 'Which word correctly completes the sentence? The cats ___ their costumes yesterday.', answers: ['finish', 'finishes', 'finished', 'finishing'], correct: 2, hint: '“Yesterday” means the action happened in the past.', success: 'Right! “Finished” is the past-tense verb.' },
  { id: 'word-08', subject: 'Word wardrobe', eyebrow: 'Enchanted Tailor', prompt: 'Which sentence uses the correct homophone?', answers: ['Their going home', 'They’re going home', 'There going home', 'Theyre going home'], correct: 1, hint: 'You need the contraction for “they are.”', success: 'Correct! “They’re” means “they are.”' },
  { id: 'word-09', subject: 'Word wardrobe', eyebrow: 'Enchanted Tailor', prompt: 'What does the prefix “un-” mean in unhappy?', answers: ['Again', 'Not', 'Before', 'Very'], correct: 1, hint: 'Someone unhappy is not happy.', success: 'Exactly! The prefix “un-” can mean “not.”' },
  { id: 'word-10', subject: 'Word wardrobe', eyebrow: 'Enchanted Tailor', prompt: 'Which word has the suffix “-less,” meaning without?', answers: ['Helpful', 'Careless', 'Kindness', 'Quickly'], correct: 1, hint: 'Careless describes someone acting without care.', success: 'Correct! “Careless” means without care.' },
  { id: 'word-11', subject: 'Word wardrobe', eyebrow: 'Enchanted Tailor', prompt: 'Choose the sentence with correct capitalization.', answers: ['we visited alabama.', 'We visited Alabama.', 'We Visited alabama.', 'we visited Alabama.'], correct: 1, hint: 'Capitalize the first word and the name of a state.', success: 'Right! Both “We” and “Alabama” need capital letters.' },
  { id: 'word-12', subject: 'Word wardrobe', eyebrow: 'Enchanted Tailor', prompt: 'Which punctuation mark completes this question? Where is my silver cape__', answers: ['.', '!', '?', ','], correct: 2, hint: 'The sentence asks something.', success: 'Correct! A question ends with a question mark.' },
  { id: 'word-13', subject: 'Word wardrobe', eyebrow: 'Enchanted Tailor', prompt: 'Which word is the most vivid way to say “walked quickly”?', answers: ['Moved', 'Went', 'Hurried', 'Was'], correct: 2, hint: 'Choose the verb that gives the clearest picture.', success: 'Yes! “Hurried” is more precise and vivid.' },
  { id: 'word-14', subject: 'Word wardrobe', eyebrow: 'Enchanted Tailor', prompt: 'Which word is a compound word?', answers: ['Moonlight', 'Shining', 'Brightest', 'Careful'], correct: 0, hint: 'A compound word joins two complete words.', success: 'Exactly! Moon + light makes moonlight.' },
  { id: 'word-15', subject: 'Word wardrobe', eyebrow: 'Enchanted Tailor', prompt: 'Which sentence is complete?', answers: ['Under the moon.', 'The black cat purred.', 'Running down the hall.', 'Because it was late.'], correct: 1, hint: 'A complete sentence tells who or what and what happened.', success: 'Correct! “The black cat purred” has a subject and a complete action.' },
)

const ROOMS: { id: LessonRoom; name: string; subject?: Subject; icon: string; description: string }[] = [
  { id: 'grand-hall', name: 'Grand Hall', icon: '✦', description: 'A mixed magical review' },
  { id: 'potion-lab', name: 'Potion Lab', subject: 'Math magic', icon: '⚗', description: 'Numbers, patterns & problem solving' },
  { id: 'moonlit-library', name: 'Moonlit Library', subject: 'Story spells', icon: '☾', description: 'Stories, clues & comprehension' },
  { id: 'enchanted-tailor', name: 'Enchanted Tailor', subject: 'Word wardrobe', icon: '♢', description: 'Words, meanings & language' },
]

const REWARD_COLLECTIONS: Reward[][] = [
  [
    { name: 'Moon Witch Hat', icon: '🌙', slot: 'head', style: 'moon-hat', description: 'Velvet, stars & a moon charm' },
    { name: 'Pumpkin Beret', icon: '🎃', slot: 'head', style: 'pumpkin-beret', description: 'Cozy felt with a curling stem' },
    { name: 'Bat Bow', icon: '🦇', slot: 'head', style: 'bat-bow', description: 'Satin wings with a jewel center' },
  ],
  [
    { name: 'Pumpkin Cape', icon: '🍂', slot: 'body', style: 'pumpkin-cape', description: 'Swishy satin with gold trim' },
    { name: 'Midnight Tutu', icon: '✨', slot: 'body', style: 'midnight-tutu', description: 'Three layers of starry tulle' },
    { name: 'Ghostly Ruffles', icon: '👻', slot: 'body', style: 'ghost-ruffles', description: 'Pearl buttons & soft ruffles' },
  ],
  [
    { name: 'Starry Boots', icon: '⭐', slot: 'feet', style: 'starry-boots', description: 'Golden stars with purple soles' },
    { name: 'Ruby Paw Slippers', icon: '❤️', slot: 'feet', style: 'ruby-slippers', description: 'Glitter velvet & tiny bows' },
    { name: 'Moonbeam High-Tops', icon: '☁️', slot: 'feet', style: 'moonbeam-hightops', description: 'Silver laces that softly glow' },
  ],
]

const ALL_REWARDS = REWARD_COLLECTIONS.flat()

const defaultProgress: Progress = {
  sessions: 0,
  correct: 0,
  attempts: 0,
  unlocked: [],
  subjectCorrect: { 'Math magic': 0, 'Story spells': 0, 'Word wardrobe': 0 },
  cats: [],
  recentByRoom: {},
}

const NEW_CAT: CatProfile = {
  id: '',
  name: '',
  fur: 'midnight',
  eyes: 'gold',
  pattern: 'solid',
  ears: 'pointed',
  markingColor: 'gold',
  background: 'moon',
  tail: 'classic',
  eyeShape: 'almond',
  mood: 'happy',
  pose: 'sit',
  outfit: [],
  room: 'grand-hall',
}

function loadProgress(): Progress {
  try {
    const saved = localStorage.getItem('hca-progress')
    return saved ? { ...defaultProgress, ...JSON.parse(saved) } : defaultProgress
  } catch {
    return defaultProgress
  }
}

function makeLesson(room: LessonRoom, recent: string[] = []): Question[] {
  const shuffled = (items: Question[]) => [...items].sort(() => Math.random() - 0.5)
  const freshFirst = (items: Question[]) => [
    ...shuffled(items.filter((question) => !recent.includes(question.id))),
    ...shuffled(items.filter((question) => recent.includes(question.id))),
  ]
  const selectedRoom = ROOMS.find((item) => item.id === room)
  if (selectedRoom?.subject) {
    return freshFirst(QUESTIONS.filter((question) => question.subject === selectedRoom.subject)).slice(0, 3)
  }
  return (['Math magic', 'Story spells', 'Word wardrobe'] as Subject[])
    .map((subject) => freshFirst(QUESTIONS.filter((question) => question.subject === subject))[0])
    .sort(() => Math.random() - 0.5)
}

function Cat({
  profile = { ...NEW_CAT, name: 'Miso' },
  equipped,
  runway = false,
  compact = false,
}: {
  profile?: CatProfile
  equipped?: string[]
  runway?: boolean
  compact?: boolean
}) {
  const visual = { ...NEW_CAT, ...profile }
  const looks = (equipped ?? visual.outfit)
    .map((name) => ALL_REWARDS.find((reward) => reward.name === name))
    .filter((reward): reward is Reward => Boolean(reward))
  const itemFor = (slot: Reward['slot']) => [...looks].reverse().find((reward) => reward.slot === slot)
  const head = itemFor('head')
  const body = itemFor('body')
  const feet = itemFor('feet')

  return (
    <div className={`cat-stage fur-${visual.fur} eyes-${visual.eyes} pattern-${visual.pattern} ears-${visual.ears} mark-${visual.markingColor} scene-${visual.background} tail-${visual.tail} eye-shape-${visual.eyeShape} mood-${visual.mood} pose-${visual.pose} ${runway ? 'runway-pose' : ''} ${compact ? 'compact-cat' : ''}`} aria-label={`${visual.name || 'A new cat'} wearing ${looks.map((item) => item.name).join(', ') || 'an academy collar'}`}>
      <div className="scene-backdrop" aria-hidden="true"><i /><b /><em /></div>
      <div className="moon" />
      <div className="stars" aria-hidden="true">✦ · ✧</div>
      <div className="floor-shadow" />
      <div className="cat">
        <div className="cat-tail" />
        <div className="cat-ear left" />
        <div className="cat-ear right" />
        <div className="cat-head">
          <span className="fur-shine forehead" />
          <span className="face-pattern" />
          <span className="brow left" />
          <span className="brow right" />
          <span className="eye left" />
          <span className="eye right" />
          <span className="nose">◆</span>
          <span className="muzzle left" />
          <span className="muzzle right" />
          <span className="smile" />
          <span className="whisker left">—</span>
          <span className="whisker right">—</span>
        </div>
        <div className="cat-body">
          <span className="body-pattern" />
          <span className="chest-fluff">♢</span>
          <span className="collar"><i>✦</i></span>
          <span className="paw left" />
          <span className="paw right" />
        </div>
        {body && <div className={`fashion-item body-item ${body.style}`}><i /><b /><em>✦</em></div>}
        {head && <div className={`fashion-item head-item ${head.style}`}><i /><b /><em>✦</em></div>}
        {feet && <div className={`fashion-item feet-item ${feet.style}`}><i /><b /></div>}
      </div>
      <div className="stage-name"><span>✦</span> {visual.name || 'New student'} <span>✦</span></div>
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState<'home' | 'creator' | 'game' | 'reward' | 'academy' | 'parent'>('home')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [attempted, setAttempted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [calm, setCalm] = useState(false)
  const [progress, setProgress] = useState<Progress>(loadProgress)
  const [sessionAnswers, setSessionAnswers] = useState<boolean[]>([])
  const [sessionRewards, setSessionRewards] = useState<Reward[]>([])
  const [draftCat, setDraftCat] = useState<CatProfile>(NEW_CAT)
  const [currentCat, setCurrentCat] = useState<CatProfile>({ ...NEW_CAT, name: 'Miso' })
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>(() => makeLesson('grand-hall'))
  const [selectedRoom, setSelectedRoom] = useState<LessonRoom>('grand-hall')
  const [editingCatId, setEditingCatId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const question = sessionQuestions[questionIndex]
  const isCorrect = selected === question?.correct
  const rewardChoices = REWARD_COLLECTIONS[questionIndex]

  useEffect(() => {
    localStorage.setItem('hca-progress', JSON.stringify(progress))
  }, [progress])

  const accuracy = progress.attempts ? Math.round((progress.correct / progress.attempts) * 100) : 0
  const sessionMessage = useMemo(() => {
    const score = sessionAnswers.filter(Boolean).length
    if (score === 3) return 'A perfectly spooky look!'
    if (score === 2) return `${currentCat.name} is runway ready!`
    return 'A magical first fitting!'
  }, [currentCat.name, sessionAnswers])

  function beginNewCat(room: LessonRoom = 'grand-hall') {
    setSelectedRoom(room)
    setEditingCatId(null)
    setConfirmDelete(false)
    setDraftCat({ ...NEW_CAT, name: '', room })
    setScreen('creator')
  }

  function editCat(cat: CatProfile) {
    setEditingCatId(cat.id)
    setConfirmDelete(false)
    setDraftCat({ ...NEW_CAT, ...cat, room: cat.room ?? 'grand-hall' })
    setScreen('creator')
  }

  function saveCatEdit() {
    const updated = { ...draftCat, name: draftCat.name.trim() || 'Mooncat' }
    setProgress((old) => ({ ...old, cats: old.cats.map((cat) => cat.id === editingCatId ? updated : cat) }))
    setScreen('academy')
  }

  function deleteEditedCat() {
    if (!editingCatId) return
    setProgress((old) => ({ ...old, cats: old.cats.filter((cat) => cat.id !== editingCatId) }))
    setEditingCatId(null)
    setConfirmDelete(false)
    setScreen('academy')
  }

  function startSession() {
    const namedCat = {
      ...draftCat,
      id: crypto.randomUUID(),
      name: draftCat.name.trim() || `Mooncat ${progress.cats.length + 1}`,
      room: selectedRoom,
    }
    const roomHistory = progress.recentByRoom[selectedRoom] ?? []
    const nextLesson = makeLesson(selectedRoom, roomHistory)
    setCurrentCat(namedCat)
    setSessionQuestions(nextLesson)
    setProgress((old) => ({
      ...old,
      recentByRoom: {
        ...old.recentByRoom,
        [selectedRoom]: [...(old.recentByRoom[selectedRoom] ?? []), ...nextLesson.map((question) => question.id)].slice(-15),
      },
    }))
    setQuestionIndex(0)
    setSelected(null)
    setAttempted(false)
    setShowHint(false)
    setSessionAnswers([])
    setSessionRewards([])
    setScreen('game')
  }

  function checkAnswer() {
    if (selected === null || attempted) return
    const correct = selected === question.correct
    setAttempted(true)
    setProgress((old) => ({
      ...old,
      attempts: old.attempts + 1,
      correct: old.correct + (correct ? 1 : 0),
      subjectCorrect: {
        ...old.subjectCorrect,
        [question.subject]: old.subjectCorrect[question.subject] + (correct ? 1 : 0),
      },
    }))
  }

  function continueGame(reward?: Reward) {
    const correct = selected === question.correct
    const updated = [...sessionAnswers, correct]
    const updatedRewards = reward ? [...sessionRewards, reward] : sessionRewards
    setSessionRewards(updatedRewards)
    if (questionIndex === sessionQuestions.length - 1) {
      const graduatedCat = { ...currentCat, outfit: updatedRewards.map((item) => item.name) }
      setCurrentCat(graduatedCat)
      setSessionAnswers(updated)
      setProgress((old) => ({
        ...old,
        sessions: old.sessions + 1,
        unlocked: [...new Set([...old.unlocked, ...updatedRewards.map((item) => item.name)])],
        cats: [...old.cats, graduatedCat],
      }))
      setScreen('reward')
      return
    }
    setSessionAnswers(updated)
    setQuestionIndex((old) => old + 1)
    setSelected(null)
    setAttempted(false)
    setShowHint(false)
  }

  function retry() {
    setSelected(null)
    setAttempted(false)
    setShowHint(true)
  }

  return (
    <div className={calm ? 'app calm' : 'app'}>
      <header className="topbar">
        <button className="brand" onClick={() => setScreen('home')} aria-label="Go home">
          <span className="brand-mark">✦</span>
          <span><strong>Haunted Catwalk</strong><small>ACADEMY</small></span>
        </button>
        <div className="top-actions">
          <button className="quiet-button" onClick={() => setCalm((value) => !value)} aria-pressed={calm}>
            {calm ? '✦ Magic on' : '☾ Calm mode'}
          </button>
          <button className="avatar-button" onClick={() => setScreen('parent')} aria-label="Open grown-up view">G</button>
        </div>
      </header>

      {screen === 'home' && (
        <main className="home">
          <section className="hero-copy">
            <p className="overline">WELCOME, YOUNG DESIGNER</p>
            <h1>Something magical is waiting backstage...</h1>
            <p className="intro">Help Miso create a spellbinding look for tonight’s <strong>Moonlight Masquerade!</strong></p>
            <div className="mission-card">
              <div className="mission-icon">☾</div>
              <div>
                <span>TODAY’S ADVENTURE</span>
                <strong>3 tiny challenges</strong>
                <p>Math magic · Story spells · Word wardrobe</p>
              </div>
              <div className="time-pill">~ 8 min</div>
            </div>
            <div className="hero-buttons">
              <button className="primary-button" onClick={() => beginNewCat('grand-hall')}>Create today’s cat <span>→</span></button>
              <button className="secondary-button" onClick={() => setScreen('academy')}>Visit my academy <b>{progress.cats.length}</b></button>
            </div>
            <p className="reassurance">No timers. Take a break whenever you need one.</p>
          </section>
          <section className="hero-art">
            <div className="show-card">
              <span className="show-label">TONIGHT’S SHOW</span>
              <h2>Moonlight<br />Masquerade</h2>
            <Cat profile={progress.cats.at(-1) ?? { ...NEW_CAT, name: 'Your first cat' }} />
            </div>
            <div className="floating-card reward-preview">
              <span>NEW REWARD</span>
              <strong>?</strong>
              <p>Mystery accessory</p>
            </div>
            <div className="floating-card streak-card"><span>★</span><strong>{progress.sessions}</strong><small>adventures</small></div>
          </section>
        </main>
      )}

      {screen === 'creator' && (
        <main className="creator-layout">
          <section className="creator-preview">
            <p className="overline">{editingCatId ? 'CAT MAKEOVER' : 'NEW ACADEMY STUDENT'}</p>
            <h1>{editingCatId ? `Restyle ${draftCat.name}` : 'Make a magical cat'}</h1>
            <div className="creator-stage">
              <Cat profile={draftCat} />
            </div>
            <p>{editingCatId ? 'Changes are saved without needing another lesson.' : `This cat will join the ${ROOMS.find((room) => room.id === selectedRoom)?.name} after today’s adventure.`}</p>
          </section>
          <section className="creator-controls">
            <button className="back-button" onClick={() => setScreen('home')}>← Maybe later</button>
            <label className="name-field">
              <span>What is your cat’s name?</span>
              <input
                value={draftCat.name}
                maxLength={18}
                placeholder="Type a magical name..."
                onChange={(event) => setDraftCat((cat) => ({ ...cat, name: event.target.value }))}
                autoFocus
              />
              <small>{draftCat.name.length}/18</small>
            </label>

            <fieldset className="custom-group">
              <legend><span>1</span> Fur color</legend>
              <div className="swatch-row">
                {([
                  ['midnight', 'Midnight', '#1d1827'],
                  ['pumpkin', 'Pumpkin', '#b95a32'],
                  ['silver', 'Moon silver', '#a8a5b4'],
                  ['cream', 'Ghost cream', '#e9d9bd'],
                  ['lavender', 'Spell lavender', '#8e739f'],
                  ['snow', 'Winter snow', '#eeeaf1'],
                ] as const).map(([value, label, color]) => (
                  <button key={value} className={draftCat.fur === value ? 'active' : ''} onClick={() => setDraftCat((cat) => ({ ...cat, fur: value }))}>
                    <i style={{ background: color }} />{label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="custom-group">
              <legend><span>2</span> Eye color</legend>
              <div className="swatch-row">
                {([
                  ['gold', 'Gold', '#f5c753'],
                  ['emerald', 'Emerald', '#57c58a'],
                  ['violet', 'Violet', '#a77adb'],
                  ['blue', 'Moon blue', '#64bce8'],
                  ['rose', 'Rose', '#e77b9f'],
                  ['copper', 'Copper', '#d98445'],
                ] as const).map(([value, label, color]) => (
                  <button key={value} className={draftCat.eyes === value ? 'active' : ''} onClick={() => setDraftCat((cat) => ({ ...cat, eyes: value }))}>
                    <i className="eye-swatch" style={{ background: color }} />{label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="custom-group">
              <legend><span>3</span> Fur markings</legend>
              <div className="option-row">
                {(['solid', 'stars', 'tuxedo', 'stripes', 'calico', 'moon', 'socks'] as const).map((value) => (
                  <button key={value} className={draftCat.pattern === value ? 'active' : ''} onClick={() => setDraftCat((cat) => ({ ...cat, pattern: value }))}>
                    <i className={`pattern-icon ${value}`} />{value[0].toUpperCase() + value.slice(1)}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="custom-group">
              <legend><span>4</span> Ear style</legend>
              <div className="option-row ears-options">
                {(['pointed', 'soft', 'tufted', 'folded', 'lynx'] as const).map((value) => (
                  <button key={value} className={draftCat.ears === value ? 'active' : ''} onClick={() => setDraftCat((cat) => ({ ...cat, ears: value }))}>
                    <i className={`ear-icon ${value}`} />{value[0].toUpperCase() + value.slice(1)}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="custom-group">
              <legend><span>5</span> Marking color</legend>
              <div className="swatch-row">
                {([
                  ['gold', 'Gold', '#efb94f'],
                  ['cream', 'Cream', '#f3e4cd'],
                  ['charcoal', 'Charcoal', '#38313e'],
                  ['rose', 'Rose', '#cf6f91'],
                  ['teal', 'Teal', '#4ca6a0'],
                  ['lavender', 'Lavender', '#a37abe'],
                ] as const).map(([value, label, color]) => (
                  <button key={value} className={draftCat.markingColor === value ? 'active' : ''} onClick={() => setDraftCat((cat) => ({ ...cat, markingColor: value }))}>
                    <i style={{ background: color }} />{label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="custom-group">
              <legend><span>6</span> Tail</legend>
              <div className="option-row">
                {(['classic', 'long', 'short', 'bob', 'fluffy'] as const).map((value) => (
                  <button key={value} className={draftCat.tail === value ? 'active' : ''} onClick={() => setDraftCat((cat) => ({ ...cat, tail: value }))}>
                    <i className={`tail-icon ${value}`} />{value[0].toUpperCase() + value.slice(1)}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="custom-group">
              <legend><span>7</span> Eye shape</legend>
              <div className="option-row">
                {(['almond', 'round', 'sleepy', 'wide'] as const).map((value) => (
                  <button key={value} className={draftCat.eyeShape === value ? 'active' : ''} onClick={() => setDraftCat((cat) => ({ ...cat, eyeShape: value }))}>
                    <i className={`eye-shape-icon ${value}`} />{value[0].toUpperCase() + value.slice(1)}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="custom-group">
              <legend><span>8</span> Mood</legend>
              <div className="option-row mood-options">
                {([['happy', 'Happy', '☺'], ['angry', 'Angry', '⌁'], ['sad', 'Sad', '◡'], ['scared', 'Scared', '!']] as const).map(([value, label, icon]) => (
                  <button key={value} className={draftCat.mood === value ? 'active' : ''} onClick={() => setDraftCat((cat) => ({ ...cat, mood: value }))}>
                    <i className={`mood-icon ${value}`}>{icon}</i>{label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="custom-group">
              <legend><span>9</span> Movement</legend>
              <div className="option-row">
                {([['sit', 'Sit', '●'], ['stretch', 'Stretch', '↔'], ['prowl', 'Prowl', '→'], ['prance', 'Prance', '↟']] as const).map(([value, label, icon]) => (
                  <button key={value} className={draftCat.pose === value ? 'active' : ''} onClick={() => setDraftCat((cat) => ({ ...cat, pose: value }))}>
                    <i className={`pose-icon ${value}`}>{icon}</i>{label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="custom-group">
              <legend><span>10</span> Portrait background</legend>
              <div className="background-options">
                {([['moon', 'Moon'], ['pumpkins', 'Pumpkins'], ['library', 'Library'], ['forest', 'Haunted forest'], ['ballroom', 'Ballroom']] as const).map(([value, label]) => (
                  <button key={value} className={draftCat.background === value ? 'active' : ''} onClick={() => setDraftCat((cat) => ({ ...cat, background: value }))}>
                    <i className={`background-icon ${value}`}><b /></i>{label}
                  </button>
                ))}
              </div>
            </fieldset>
            <button className="primary-button creator-start" onClick={editingCatId ? saveCatEdit : startSession}>
              {editingCatId ? 'Save this makeover' : draftCat.name.trim() ? `Begin ${draftCat.name.trim()}’s adventure` : 'Name my cat later'} <span>→</span>
            </button>
            {editingCatId && (
              <div className="delete-cat-zone">
                {!confirmDelete ? (
                  <button onClick={() => setConfirmDelete(true)}>Remove {draftCat.name} from the academy</button>
                ) : (
                  <div className="delete-confirm">
                    <p><strong>Remove {draftCat.name}?</strong>This cannot be undone, but lesson progress will remain.</p>
                    <div>
                      <button onClick={() => setConfirmDelete(false)}>Keep this cat</button>
                      <button className="delete-forever" onClick={deleteEditedCat}>Yes, remove cat</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </main>
      )}

      {screen === 'game' && question && (
        <main className="game-layout">
          <section className="game-panel">
            <div className="progress-row">
              <button className="back-button" onClick={() => setScreen('home')}>← Leave</button>
              <div className="steps" aria-label={`Challenge ${questionIndex + 1} of 3`}>
                {sessionQuestions.map((_, index) => <span key={index} className={index <= questionIndex ? 'filled' : ''} />)}
              </div>
              <span>Challenge {questionIndex + 1} of 3</span>
            </div>
            <p className="challenge-overline">{question.eyebrow} · {question.subject}</p>
            <h2>{question.prompt.replace('Miso', currentCat.name)}</h2>
            {question.detail && <p className="question-detail">{question.detail}</p>}
            {showHint && <div className="hint-box"><span>💡</span><p><strong>Try this:</strong> {question.hint}</p></div>}
            <div className="answer-grid">
              {question.answers.map((answer, index) => {
                let state = selected === index ? 'selected' : ''
                if (attempted && index === question.correct) state = 'correct'
                if (attempted && selected === index && !isCorrect) state = 'incorrect'
                return (
                  <button
                    key={answer}
                    className={`answer ${state}`}
                    onClick={() => !attempted && setSelected(index)}
                    disabled={attempted}
                  >
                    <span>{String.fromCharCode(65 + index)}</span>{answer}
                  </button>
                )
              })}
            </div>
            {attempted && isCorrect ? (
              <div className="reward-choice">
                <div className="feedback success">
                  <div>✦</div><p><strong>{question.success}</strong></p>
                </div>
                <div className="choice-heading">
                  <div><span>YOUR FASHION REWARD</span><h3>Choose one for Miso</h3></div>
                  <small>There’s no wrong choice</small>
                </div>
                <div className="fashion-grid">
                  {rewardChoices.map((reward) => (
                    <button key={reward.name} className={`fashion-choice ${reward.style}`} onClick={() => continueGame(reward)}>
                      <span className="item-preview"><i /><b /><em>{reward.icon}</em></span>
                      <strong>{reward.name}</strong>
                      <small>{reward.description}</small>
                      <u>Choose this look →</u>
                    </button>
                  ))}
                </div>
              </div>
            ) : attempted ? (
              <div className={isCorrect ? 'feedback success' : 'feedback try-again'}>
                <div>↻</div>
                <p><strong>Not quite—and that’s how magic gets learned.</strong> Take another look with a clue.</p>
                <button onClick={retry}>Show me a clue</button>
              </div>
            ) : (
              <button className="primary-button check" disabled={selected === null} onClick={checkAnswer}>Check my answer</button>
            )}
          </section>
          <aside className="game-side">
            <Cat profile={currentCat} equipped={sessionRewards.map((item) => item.name)} />
            <div className="reward-track">
              <span>LOOK IN PROGRESS</span>
              <div>{REWARD_COLLECTIONS.map((collection, index) => {
                const reward = sessionRewards[index]
                return <i key={collection[0].slot} className={reward ? 'earned' : ''}>{reward ? reward.icon : '?'}</i>
              })}</div>
              <p>Each challenge unlocks something magical.</p>
            </div>
          </aside>
        </main>
      )}

      {screen === 'reward' && (
        <main className="reward-screen">
          <p className="overline">MOONLIGHT MASQUERADE</p>
          <h1>{sessionMessage}</h1>
          <p>You helped Miso think, learn, and create. That’s real magic.</p>
          <div className="runway">
            <span className="spotlight" />
            <Cat profile={currentCat} equipped={sessionRewards.map((item) => item.name)} runway />
          </div>
          <div className="reward-list">
            {sessionRewards.length ? sessionRewards.map((item) => <div key={item.name}><span>{item.icon}</span><small>YOU CHOSE</small><strong>{item.name}</strong></div>) :
              <div><span>🌙</span><small>NEW</small><strong>Moonlight Badge</strong></div>}
          </div>
          <div className="reward-actions">
            <button className="primary-button" onClick={() => setScreen('academy')}>Welcome {currentCat.name} to the academy →</button>
            <span>The lesson is complete. This cat now lives in your academy!</span>
          </div>
        </main>
      )}

      {screen === 'academy' && (
        <main className="academy-screen">
          <section className="academy-hero">
            <div className="academy-moon">☾</div>
            <div className="academy-towers" aria-hidden="true"><i /><i /><i /></div>
            <p className="overline">YOUR MAGICAL COLLECTION</p>
            <h1>Haunted Catwalk Academy</h1>
            <p>Choose a classroom for the next lesson, or give an enrolled cat a makeover.</p>
            <div className="academy-actions">
              <button className="primary-button" onClick={() => beginNewCat('grand-hall')}>Mixed adventure <span>＋</span></button>
              <button className="secondary-button light" onClick={() => setScreen('home')}>Back home</button>
            </div>
          </section>
          <section className="academy-floor-section">
            <div className="roster-heading">
              <div><span>TOP-DOWN ACADEMY MAP</span><h2>Choose where to explore</h2></div>
              <p>{progress.cats.length} magical {progress.cats.length === 1 ? 'cat lives' : 'cats live'} here. Select a cat to edit it.</p>
            </div>
            <div className="academy-floor">
              <div className="map-corridor vertical"><i>☾</i><span>THE WHISPERING HALL</span></div>
              <div className="map-corridor horizontal" />
              {ROOMS.map((room) => {
                const residents = progress.cats.filter((cat) => (cat.room ?? 'grand-hall') === room.id)
                return (
                  <article className={`map-room ${room.id}`} key={room.id}>
                    <div className="room-heading">
                      <span>{room.icon}</span>
                      <div><strong>{room.name}</strong><small>{room.description}</small></div>
                    </div>
                    <div className="room-furniture" aria-hidden="true"><i /><i /><i /></div>
                    <div className="room-cats">
                      {residents.map((cat) => (
                        <button key={cat.id} className={`map-cat fur-dot-${cat.fur}`} onClick={() => editCat(cat)} title={`Edit ${cat.name}`}>
                          <span className="mini-ears">⌃</span><b>{cat.name}</b><small>✎ Edit</small>
                        </button>
                      ))}
                    </div>
                    <button className="room-start" onClick={() => beginNewCat(room.id)}>
                      <span>＋</span> Start {room.id === 'grand-hall' ? 'mixed' : room.name.replace('Moonlit ', '').replace('Enchanted ', '')} lesson
                    </button>
                  </article>
                )
              })}
              <div className="map-entry"><span>ACADEMY GATES</span><i>↟</i></div>
            </div>
            <p className="map-note">Cats live in the classroom connected to the adventure they completed. You can change their appearance anytime.</p>
          </section>
        </main>
      )}

      {screen === 'parent' && (
        <main className="parent-view">
          <button className="back-button" onClick={() => setScreen('home')}>← Back to academy</button>
          <p className="overline">GROWN-UP VIEW</p>
          <h1>Learning at a glance</h1>
          <p className="parent-intro">Progress stays on this device. Early results are signals, not grades.</p>
          <div className="stats">
            <article><span>Adventures</span><strong>{progress.sessions}</strong><small>completed sessions</small></article>
            <article><span>Questions tried</span><strong>{progress.attempts}</strong><small>across all skills</small></article>
            <article><span>Independent accuracy</span><strong>{accuracy}%</strong><small>first attempts only</small></article>
          </div>
          <section className="skill-card">
            <h2>Skill signals</h2>
            <p>We’ll need several sessions before drawing conclusions.</p>
            {(Object.keys(progress.subjectCorrect) as Subject[]).map((subject) => (
              <div className="skill-row" key={subject}>
                <span>{subject}</span>
                <div><i style={{ width: `${Math.min(progress.subjectCorrect[subject] * 25, 100)}%` }} /></div>
                <strong>{progress.subjectCorrect[subject] === 0 ? 'Collecting clues' : 'Growing'}</strong>
              </div>
            ))}
          </section>
          <div className="privacy-note"><span>⌂</span><p><strong>Private by design</strong>No account, advertising, chat, or uploaded child data.</p></div>
        </main>
      )}
    </div>
  )
}
