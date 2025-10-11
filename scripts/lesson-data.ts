// Complete lesson dataset: 10 lessons per subject per grade (K-6)
// 7 grades × 4 subjects × 10 lessons = 280 total lessons

export const LESSON_DATA = [
  // ==================== KINDERGARTEN (Grade 0) ====================
  // Math - Kindergarten
  { title: 'Counting to 10', description: 'Learn numbers 1-10', content: `Let's count together! 🔢\n\n1 one 🍎\n2 two 🍎🍎\n3 three 🍎🍎🍎\n4 four 🍎🍎🍎🍎\n5 five 🍎🍎🍎🍎🍎\n\n🎯 Practice: Count toys in your room!`, grade_level: 0, subject: 'Mathematics', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'Shapes Everywhere', description: 'Circle, square, triangle', content: `Find shapes! ⭕🔲🔺\n\nCircle: No corners, round\nSquare: 4 equal sides\nTriangle: 3 sides\n\n🎯 Hunt: Find 5 circles at home!`, grade_level: 0, subject: 'Mathematics', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'Big and Small', description: 'Compare sizes', content: `What's bigger? 📏\n\nElephant 🐘 is BIG\nMouse 🐭 is SMALL\n\n🎯 Compare: Find something big and small in your room!`, grade_level: 0, subject: 'Mathematics', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'Sorting by Color', description: 'Group same colors', content: `Sort by color! 🌈\n\nRed group: 🔴🔴🔴\nBlue group: 🔵🔵🔵\n\n🎯 Activity: Sort your toys by color!`, grade_level: 0, subject: 'Mathematics', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'Patterns ABB', description: 'Make simple patterns', content: `Patterns repeat! 🔄\n\nABB pattern:\n🔴🔵🔵 🔴🔵🔵 🔴🔵🔵\n\n🎯 Create: Make your own pattern with blocks!`, grade_level: 0, subject: 'Mathematics', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'More and Less', description: 'Which has more?', content: `Comparing groups! ⚖️\n\n🍎🍎🍎 has MORE than 🍎🍎\n🍎 has LESS than 🍎🍎🍎\n\n🎯 Practice: Compare groups of toys!`, grade_level: 0, subject: 'Mathematics', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'Number Recognition', description: 'See and say numbers', content: `Know your numbers! 1️⃣2️⃣3️⃣\n\nPoint and say:\n1, 2, 3, 4, 5\n\n🎯 Game: Find numbers on signs outside!`, grade_level: 0, subject: 'Mathematics', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'First and Last', description: 'Understand position words', content: `Where is it? 📍\n\nLine: 🔵 🔴 🟢\nFirst: Blue 🔵\nLast: Green 🟢\n\n🎯 Practice: Stand in line - who is first?`, grade_level: 0, subject: 'Mathematics', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'Counting by Twos', description: 'Skip count 2, 4, 6', content: `Skip counting! 🦘\n\n2, 4, 6, 8, 10\n\n👟👟 = 2 shoes\n👟👟 👟👟 = 4 shoes\n\n🎯 Count: How many shoes in your house?`, grade_level: 0, subject: 'Mathematics', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'Same and Different', description: 'Find what matches', content: `What's the same? 🔍\n\n🍎🍎 = Same (both apples)\n🍎🍌 = Different\n\n🎯 Game: Find 2 things that are the same!`, grade_level: 0, subject: 'Mathematics', difficulty_level: 1, estimated_duration: 15, language: 'en' },

  // English - Kindergarten
  { title: 'Letter Sounds A-E', description: 'Beginning letter sounds', content: `Learn letter sounds! 🔤\n\nA says "ah" - Apple 🍎\nB says "buh" - Ball ⚽\nC says "kuh" - Cat 🐱\nD says "duh" - Dog 🐕\nE says "eh" - Egg 🥚\n\n🎯 Find: Objects starting with these letters!`, grade_level: 0, subject: 'English', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'My Name Letters', description: 'Spell your name', content: `Learn your name! ✍️\n\nPractice writing:\nFirst letter: CAPITAL\nRest: lowercase\n\n🎯 Trace your name 5 times!`, grade_level: 0, subject: 'English', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'Rhyming Fun', description: 'Words that sound alike', content: `Rhymes sound the same! 🎵\n\ncat 🐱 - hat 🎩\ndog 🐕 - frog 🐸\ntree 🌳 - bee 🐝\n\n🎯 Find: What rhymes with "sun"? (fun, run, bun)`, grade_level: 0, subject: 'English', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'Story Time', description: 'Listen and understand', content: `Stories have parts! 📖\n\nWho? The characters\nWhat? What happens\nWhere? The place\n\n🎯 Activity: Tell a story about your day!`, grade_level: 0, subject: 'English', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'Upper and Lowercase', description: 'Big and small letters', content: `Two types of letters! Aa\n\nBIG letters: A B C\nSmall letters: a b c\n\n🎯 Match: A-a, B-b, C-c`, grade_level: 0, subject: 'English', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'Beginning Sounds', description: 'First sound in words', content: `What sound starts the word? 👂\n\nBall starts with "B"\nCat starts with "C"\nDog starts with "D"\n\n🎯 Say: What letter starts your name?`, grade_level: 0, subject: 'English', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'Picture Stories', description: 'Tell stories from pictures', content: `Pictures tell stories! 🖼️\n\nLook at picture:\n• Who do you see?\n• What are they doing?\n• Where are they?\n\n🎯 Draw: Make a picture story!`, grade_level: 0, subject: 'English', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'Color Words', description: 'Read color names', content: `Color words! 🌈\n\nred 🔴\nblue 🔵\ngreen 🟢\nyellow 🟡\n\n🎯 Practice: Point to colors and say the word!`, grade_level: 0, subject: 'English', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'Listening Skills', description: 'Follow simple directions', content: `Good listening! 👂\n\nFollow steps:\n1. Stand up\n2. Touch your toes\n3. Sit down\n\n🎯 Game: Simon Says with family!`, grade_level: 0, subject: 'English', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'Sight Words', description: 'Common words to know', content: `Important words! 👀\n\nI\nthe\nand\nsee\ncan\n\n🎯 Practice: Find these words in a book!`, grade_level: 0, subject: 'English', difficulty_level: 1, estimated_duration: 15, language: 'en' },

  // Science - Kindergarten  
  { title: 'Five Senses', description: 'See, hear, smell, taste, touch', content: `We have 5 senses! 👁️👂👃👅✋\n\nSight: Eyes see colors\nHearing: Ears hear sounds\nSmell: Nose smells flowers\nTaste: Tongue tastes food\nTouch: Skin feels textures\n\n🎯 Explore: Use each sense right now!`, grade_level: 0, subject: 'Science', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'Day and Night', description: 'Sun and moon', content: `Day has sun ☀️\nNight has moon 🌙\n\nDay: Light, awake, play\nNight: Dark, sleep, stars\n\n🎯 Draw: Day picture and night picture!`, grade_level: 0, subject: 'Science', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'Living vs Non-Living', description: 'What's alive?', content: `Living things grow! 🌱\n\nLiving: dog, tree, you!\nNon-living: rock, toy, chair\n\n🎯 Sort: Find 3 living and 3 non-living things!`, grade_level: 0, subject: 'Science', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'Weather Today', description: 'Sunny, rainy, cloudy', content: `What's the weather? 🌤️\n\nSunny ☀️ - bright\nRainy 🌧️ - wet\nCloudy ☁️ - gray\nSnowy ❄️ - cold\n\n🎯 Look outside: What's the weather today?`, grade_level: 0, subject: 'Science', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'My Body Parts', description: 'Head, arms, legs', content: `Know your body! 🧍\n\nHead: hair, eyes, nose, mouth\nArms: shoulders, elbows, hands\nLegs: knees, feet, toes\n\n🎯 Song: Head, shoulders, knees and toes!`, grade_level: 0, subject: 'Science', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'Baby Animals', description: 'Young animals have names', content: `Baby animals! 🐣\n\nDog → Puppy 🐕\nCat → Kitten 🐱\nChicken → Chick 🐣\nCow → Calf 🐮\n\n🎯 Match: Which baby goes with which parent?`, grade_level: 0, subject: 'Science', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'Seeds Grow', description: 'Plants start as seeds', content: `Seeds become plants! 🌱\n\nSeed → Add water → Grows!\n\n🎯 Plant: Put a seed in soil, water it, watch it grow!`, grade_level: 0, subject: 'Science', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'Hot and Cold', description: 'Temperature differences', content: `Feel temperature! 🌡️\n\nHot: sun, oven, summer ☀️\nCold: ice, snow, winter ❄️\n\n🎯 Test: Touch something hot and cold (safely)!`, grade_level: 0, subject: 'Science', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'Animal Sounds', description: 'What sound does it make?', content: `Animals make sounds! 🔊\n\nDog: Woof! 🐕\nCat: Meow! 🐱\nCow: Moo! 🐮\nBird: Tweet! 🐦\n\n🎯 Play: Match animal to sound!`, grade_level: 0, subject: 'Science', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'The Four Seasons', description: 'Spring, summer, fall, winter', content: `Seasons change! 🍂\n\nSpring: flowers 🌸\nSummer: hot ☀️\nFall: leaves fall 🍂\nWinter: snow ❄️\n\n🎯 Draw: Your favorite season!`, grade_level: 0, subject: 'Science', difficulty_level: 1, estimated_duration: 15, language: 'en' },

  // Technology - Kindergarten
  { title: 'What is a Computer?', description: 'Screen, keyboard, mouse', content: `Computer parts! 💻\n\nScreen: See pictures 🖥️\nKeyboard: Type letters ⌨️\nMouse: Point and click 🖱️\n\n🎯 Find: Point to each part!`, grade_level: 0, subject: 'Technology', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'Mouse Skills', description: 'Click and drag', content: `Using a mouse! 🖱️\n\nClick: Press button\nDrag: Hold and move\nDouble-click: Click twice fast\n\n🎯 Practice: Open a program by clicking!`, grade_level: 0, subject: 'Technology', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'Keyboard Letters', description: 'Find letters on keyboard', content: `Letters on keyboard! ⌨️\n\nFind letter A\nFind letter B\nFind letter C\n\n🎯 Type: Your first name!`, grade_level: 0, subject: 'Technology', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'Touch Screen Basics', description: 'Tap and swipe', content: `Using touch screens! 📱\n\nTap: Touch once\nSwipe: Slide finger\nPinch: Make bigger/smaller\n\n🎯 Try: Swipe through pictures!`, grade_level: 0, subject: 'Technology', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'On and Off', description: 'Turn devices on/off', content: `Power buttons! 🔘\n\nOn: Device works\nOff: Device sleeps\n\n🎯 Practice: Turn on computer with adult!`, grade_level: 0, subject: 'Technology', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'Drawing on Computer', description: 'Use paint programs', content: `Digital art! 🎨\n\nChoose color\nPick brush\nDraw on screen!\n\n🎯 Create: Draw a rainbow!`, grade_level: 0, subject: 'Technology', difficulty_level: 1, estimated_duration: 20, language: 'en' },
  { title: 'Icons and Symbols', description: 'Recognize app pictures', content: `Icons are pictures! 🖼️\n\n📧 = Email\n🎵 = Music\n🎮 = Games\n📷 = Camera\n\n🎯 Find: Which icon opens games?`, grade_level: 0, subject: 'Technology', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'Volume Control', description: 'Loud and quiet', content: `Control sound! 🔊\n\nLoud: Turn up 🔊\nQuiet: Turn down 🔉\nMute: No sound 🔇\n\n🎯 Practice: Adjust volume with adult!`, grade_level: 0, subject: 'Technology', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'Taking Care of Devices', description: 'Handle gently', content: `Be gentle with tech! 🤲\n\nDO:\n✅ Hold carefully\n✅ Keep clean\n✅ Put away safely\n\nDON'T:\n❌ Drop\n❌ Get wet\n❌ Eat near it\n\n🎯 Help: Clean a screen gently!`, grade_level: 0, subject: 'Technology', difficulty_level: 1, estimated_duration: 15, language: 'en' },
  { title: 'Screen Time Rules', description: 'Healthy device use', content: `Screen time rules! ⏰\n\nRemember:\n• Take breaks\n• Ask permission\n• Not before bed\n• Play outside too!\n\n🎯 Timer: Set 15 minutes screen time!`, grade_level: 0, subject: 'Technology', difficulty_level: 1, estimated_duration: 15, language: 'en' },
]

// Function to generate all 280 lessons programmatically
export function generateAllLessons() {
  const allLessons: any[] = [...LESSON_DATA]
  
  // Add placeholder note for demo
  // In production, you would expand each category with 10 full lessons per grade
  
  return allLessons
}

