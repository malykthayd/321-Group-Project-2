// Better lesson content generator with proper educational flow

export interface LessonContent {
  title: string
  description: string
  content: string
  duration: number
}

export function generateLessonContent(grade: number, subject: string, lessonNum: number): LessonContent {
  const gradeLabel = grade === 0 ? 'Kindergarten' : `Grade ${grade}`
  
  switch (subject) {
    case 'Science':
      return generateScienceLesson(grade, lessonNum)
    case 'Mathematics':
      return generateMathLesson(grade, lessonNum)
    case 'English':
      return generateEnglishLesson(grade, lessonNum)
    case 'Technology':
      return generateTechnologyLesson(grade, lessonNum)
    default:
      return generateDefaultLesson(grade, subject, lessonNum)
  }
}

function generateScienceLesson(grade: number, lessonNum: number): LessonContent {
  const scienceTopics = {
    0: ['Plant Life Cycle', 'Animal Sounds', 'Weather Changes', 'Five Senses', 'Living vs Non-living'],
    1: ['Plant Needs', 'Animal Homes', 'Weather Patterns', 'Body Parts', 'Materials'],
    2: ['Plant Growth', 'Animal Life Cycles', 'Weather Instruments', 'Human Body', 'States of Matter'],
    3: ['Photosynthesis', 'Food Chains', 'Water Cycle', 'Digestive System', 'Simple Machines'],
    4: ['Plant Reproduction', 'Ecosystems', 'Climate Zones', 'Circulatory System', 'Force and Motion'],
    5: ['Cell Structure', 'Adaptation', 'Natural Disasters', 'Respiratory System', 'Energy Transfer'],
    6: ['Genetics', 'Evolution', 'Earth Layers', 'Nervous System', 'Chemical Reactions']
  }
  
  const topic = scienceTopics[grade as keyof typeof scienceTopics]?.[lessonNum - 1] || 'Science Exploration'
  
  switch (lessonNum) {
    case 1:
      return {
        title: topic,
        description: `Introduction to ${topic.toLowerCase()}`,
        content: generateScienceLesson1(grade, topic),
        duration: getDuration(grade, 15, 25)
      }
    case 2:
      return {
        title: `${topic} - Part 2`,
        description: `Deeper exploration of ${topic.toLowerCase()}`,
        content: generateScienceLesson2(grade, topic),
        duration: getDuration(grade, 18, 28)
      }
    case 3:
      return {
        title: `${topic} - Experiments`,
        description: `Hands-on activities with ${topic.toLowerCase()}`,
        content: generateScienceLesson3(grade, topic),
        duration: getDuration(grade, 20, 30)
      }
    case 4:
      return {
        title: `${topic} - Applications`,
        description: `Real-world uses of ${topic.toLowerCase()}`,
        content: generateScienceLesson4(grade, topic),
        duration: getDuration(grade, 16, 26)
      }
    case 5:
      return {
        title: `${topic} - Review`,
        description: `Comprehensive review of ${topic.toLowerCase()}`,
        content: generateScienceLesson5(grade, topic),
        duration: getDuration(grade, 22, 32)
      }
    default:
      return generateDefaultLesson(grade, 'Science', lessonNum)
  }
}

function generateScienceLesson1(grade: number, topic: string): string {
  const baseContent = `# ${topic} 🔬

## What We'll Learn Today
Today we're exploring ${topic.toLowerCase()}! This is an exciting topic that helps us understand the world around us.

### Key Concepts
Let's start with the basics:`

  switch (topic) {
    case 'Plant Life Cycle':
      return baseContent + `

**The Amazing Journey of Plants**
Plants go through an incredible journey from tiny seeds to full-grown plants!

**Stage 1: Seed 🌱**
- A seed is like a tiny package
- It contains everything needed to grow
- Seeds can be different sizes and shapes

**Interactive Activity:**
What do you think a seed needs to start growing?
- [ ] Just water
- [ ] Just sunlight  
- [ ] Water and warmth ✓
- [ ] Just soil

**Stage 2: Sprout 🌿**
- The seed opens up
- A tiny root grows down
- A small stem grows up

**Think About It:**
Why do you think the root grows down and the stem grows up?
- [ ] They're confused
- [ ] Root needs soil, stem needs light ✓
- [ ] It's just random
- [ ] They're trying to be different

**🔍 Observation Challenge:**
Look around your home or classroom. Can you find any plants in different stages of their life cycle?`

    case 'Animal Life Cycles':
      return baseContent + `

**Animals Change and Grow**
Just like plants, animals go through different stages as they grow!

**Butterfly Life Cycle 🦋**
Let's follow a butterfly's amazing transformation:

**Stage 1: Egg**
- Tiny eggs laid on leaves
- Protected by the mother butterfly
- Will hatch into caterpillars

**Interactive Activity:**
Where do you think butterflies lay their eggs?
- [ ] In water
- [ ] On leaves ✓
- [ ] Underground
- [ ] In trees

**Stage 2: Caterpillar**
- Eats lots of leaves
- Grows bigger and bigger
- Sheds its skin several times

**Stage 3: Chrysalis**
- Forms a protective covering
- Amazing changes happen inside
- Can take days or weeks

**Stage 4: Butterfly**
- Emerges with beautiful wings
- Can fly and find food
- Will lay eggs to start the cycle again

**🎨 Creative Activity:**
Draw the four stages of a butterfly's life cycle in order!`

    default:
      return baseContent + `

**Understanding ${topic}**
${topic} is all around us and affects our daily lives in many ways.

**Key Points to Remember:**
- Every topic has important concepts to learn
- We can observe these concepts in nature
- Science helps us understand the world better

**Interactive Discovery:**
What questions do you have about ${topic.toLowerCase()}?
Think about what you already know and what you'd like to learn more about.`
  }
}

function generateScienceLesson2(grade: number, topic: string): string {
  return `# ${topic} - Deeper Dive 🔍

## Building on What We Know
Now that we understand the basics, let's explore ${topic.toLowerCase()} in more detail!

### Advanced Concepts
Let's dig deeper into the fascinating world of ${topic.toLowerCase()}:

**More Complex Ideas**
- How does this connect to other scientific concepts?
- What patterns can we observe?
- How does this affect our daily lives?

**Interactive Exploration:**
Let's investigate further:

**Question 1:** What is the most important factor in ${topic.toLowerCase()}?
- [ ] Size matters most
- [ ] Environment is key ✓
- [ ] Speed is everything
- [ ] Color is important

**Question 2:** How does ${topic.toLowerCase()} relate to other things we've learned?
- [ ] It's completely separate
- [ ] It connects to many other concepts ✓
- [ ] It only relates to one other topic
- [ ] It has no connections

**🔬 Investigation Time:**
Let's look for examples of ${topic.toLowerCase()} in our environment. What do you notice?

**Real-World Connection:**
Think about how understanding ${topic.toLowerCase()} helps us in our daily lives. Can you think of any examples?`
}

function generateScienceLesson3(grade: number, topic: string): string {
  return `# ${topic} - Hands-On Experiments 🧪

## Let's Experiment!
Time for some exciting hands-on activities with ${topic.toLowerCase()}!

### Experiment 1: Observation
**What You'll Need:**
- Your senses (sight, touch, smell)
- A notebook or paper
- Pencil or crayons

**What to Do:**
1. Find examples of ${topic.toLowerCase()} around you
2. Observe carefully
3. Record what you see
4. Draw pictures of your observations

**Interactive Question:**
What sense is most important for studying ${topic.toLowerCase()}?
- [ ] Hearing
- [ ] Sight ✓
- [ ] Taste
- [ ] Touch

### Experiment 2: Comparison
**Let's Compare:**
Find two different examples of ${topic.toLowerCase()} and compare them:

**What's the Same?**
- [ ] They look identical
- [ ] They share some characteristics ✓
- [ ] They're completely different
- [ ] They're the same size

**What's Different?**
- [ ] Nothing is different
- [ ] They have unique features ✓
- [ ] Everything is different
- [ ] Only the color differs

### Experiment 3: Prediction
**Making Predictions:**
Based on what we've learned, what do you think would happen if...?

**Think and Predict:**
What would happen if we changed the environment?
- [ ] Nothing would change
- [ ] It might affect the outcome ✓
- [ ] Everything would be the same
- [ ] It would be completely different

**🎯 Experiment Results:**
Record your observations and compare them with your predictions!`
}

function generateScienceLesson4(grade: number, topic: string): string {
  return `# ${topic} - Real-World Applications 🌍

## How This Affects Our World
Let's see how ${topic.toLowerCase()} impacts our daily lives and the world around us!

### Everyday Applications
**In Our Homes:**
- How does ${topic.toLowerCase()} affect what we eat?
- How does it influence our daily activities?
- What role does it play in our health?

**Interactive Application:**
Which of these is most affected by ${topic.toLowerCase()}?
- [ ] Only our food
- [ ] Only our clothing
- [ ] Many aspects of our lives ✓
- [ ] Only our entertainment

### Community Impact
**In Our Neighborhood:**
- How does ${topic.toLowerCase()} affect our local environment?
- What can we do to help or protect it?
- How does it influence our community?

**Community Question:**
How can understanding ${topic.toLowerCase()} help our community?
- [ ] It has no community impact
- [ ] It helps us make better decisions ✓
- [ ] It only affects individuals
- [ ] It's just for scientists

### Global Connections
**Around the World:**
- How does ${topic.toLowerCase()} affect different places?
- What are the global implications?
- How do different cultures interact with this concept?

**Global Thinking:**
Why is it important to understand ${topic.toLowerCase()} globally?
- [ ] It only matters locally
- [ ] It helps us understand worldwide connections ✓
- [ ] It's not important globally
- [ ] It only affects one country

**🌱 Action Steps:**
What can you do in your daily life to apply what you've learned about ${topic.toLowerCase()}?`
}

function generateScienceLesson5(grade: number, topic: string): string {
  return `# ${topic} - Comprehensive Review 📚

## Let's Review Everything!
Time to put together all the pieces we've learned about ${topic.toLowerCase()}!

### Key Concepts Review
**What We've Learned:**
1. **Basic Concepts** - The fundamental ideas
2. **Advanced Understanding** - How it all connects
3. **Hands-On Experience** - What we discovered through experiments
4. **Real-World Impact** - How it affects our lives

**Quick Review Questions:**

**Question 1:** What is the most important thing to remember about ${topic.toLowerCase()}?
- [ ] It's very complicated
- [ ] It affects many aspects of life ✓
- [ ] It's only for scientists
- [ ] It doesn't matter much

**Question 2:** How do experiments help us understand ${topic.toLowerCase()}?
- [ ] They don't help at all
- [ ] They let us observe and test ideas ✓
- [ ] They make things more confusing
- [ ] They're just for fun

**Question 3:** Why is it important to understand ${topic.toLowerCase()}?
- [ ] It's not really important
- [ ] It helps us make informed decisions ✓
- [ ] It's only for school
- [ ] It's too difficult to understand

### Putting It All Together
**Connect the Concepts:**
How do all the parts of ${topic.toLowerCase()} work together?

**Final Challenge:**
Based on everything we've learned, what would you tell a friend about ${topic.toLowerCase()}?

**🎓 Congratulations!**
You've completed a comprehensive study of ${topic.toLowerCase()}! You now understand:
- The basic concepts
- How it works in detail
- How to investigate it
- Its real-world importance
- How all the pieces fit together

**Next Steps:**
Keep observing and asking questions about ${topic.toLowerCase()} in the world around you!`
}

function generateMathLesson(grade: number, lessonNum: number): LessonContent {
  const mathTopics = {
    0: ['Counting 1-10', 'Basic Shapes', 'Patterns', 'Comparing Sizes', 'Simple Addition'],
    1: ['Numbers 1-20', '2D Shapes', 'Number Patterns', 'Measurement', 'Addition to 10'],
    2: ['Place Value', '3D Shapes', 'Skip Counting', 'Time', 'Subtraction'],
    3: ['Multiplication Basics', 'Fractions', 'Perimeter', 'Money', 'Word Problems'],
    4: ['Long Division', 'Decimals', 'Area', 'Data Analysis', 'Problem Solving'],
    5: ['Fractions Operations', 'Percentages', 'Volume', 'Algebra Basics', 'Geometry'],
    6: ['Ratios', 'Proportions', 'Statistics', 'Probability', 'Advanced Problem Solving']
  }
  
  const topic = mathTopics[grade as keyof typeof mathTopics]?.[lessonNum - 1] || 'Math Exploration'
  
  return {
    title: topic,
    description: `Master ${topic.toLowerCase()} concepts`,
    content: generateMathContent(grade, topic, lessonNum),
    duration: getDuration(grade, 20, 35)
  }
}

function generateMathContent(grade: number, topic: string, lessonNum: number): string {
  switch (topic) {
    case 'Counting 1-10':
      return generateCountingLesson(grade, lessonNum)
    case 'Basic Shapes':
      return generateShapesLesson(grade, lessonNum)
    case 'Simple Addition':
      return generateAdditionLesson(grade, lessonNum)
    default:
      return generateGenericMathLesson(grade, topic, lessonNum)
  }
}

function generateCountingLesson(grade: number, lessonNum: number): string {
  const lessons = [
    `# Counting 1-10 - Introduction 🔢

## Let's Start Counting!
Numbers are everywhere! Let's learn to count from 1 to 10.

### Counting Practice
**Count with Me:**
1️⃣ One - Like one nose on your face
2️⃣ Two - Like two eyes
3️⃣ Three - Like three wheels on a tricycle
4️⃣ Four - Like four legs on a chair
5️⃣ Five - Like five fingers on one hand

**Interactive Counting:**
How many apples do you see? 🍎🍎🍎🍎🍎
- [ ] 3
- [ ] 4
- [ ] 5 ✓
- [ ] 6

**Continue Counting:**
6️⃣ Six - Like six sides of a cube
7️⃣ Seven - Like seven days in a week
8️⃣ Eight - Like eight legs on a spider
9️⃣ Nine - Like nine players on a baseball team
🔟 Ten - Like ten toes on your feet

**Counting Challenge:**
Count the stars: ⭐⭐⭐⭐⭐⭐⭐
How many stars?
- [ ] 6
- [ ] 7 ✓
- [ ] 8
- [ ] 9`,

    `# Counting 1-10 - Recognition 👀

## Recognizing Numbers
Now let's learn to recognize the written numbers!

### Number Recognition
**Match the Number:**
What number is this? 3
- [ ] Two
- [ ] Three ✓
- [ ] Four
- [ ] Five

**Number Hunt:**
Find the number 7 in this group: 2, 5, 7, 9
- [ ] First number
- [ ] Second number
- [ ] Third number ✓
- [ ] Fourth number

**Count and Write:**
If you see 4 ducks, what number should you write?
- [ ] 3
- [ ] 4 ✓
- [ ] 5
- [ ] 6`,

    `# Counting 1-10 - Order 📋

## Number Order
Let's learn about the order of numbers!

### Before and After
**What Comes Before 5?**
- [ ] 3
- [ ] 4 ✓
- [ ] 6
- [ ] 7

**What Comes After 8?**
- [ ] 6
- [ ] 7
- [ ] 9 ✓
- [ ] 10

**Missing Numbers:**
Complete the sequence: 1, 2, _, 4, 5
What number is missing?
- [ ] 1
- [ ] 2
- [ ] 3 ✓
- [ ] 4`,

    `# Counting 1-10 - Comparison ⚖️

## Comparing Numbers
Let's learn to compare numbers!

### More or Less
**Which Group Has More?**
Group A: 🍎🍎🍎
Group B: 🍎🍎🍎🍎
- [ ] Group A has more
- [ ] Group B has more ✓
- [ ] They have the same
- [ ] I can't tell

**Which Number is Greater?**
Compare 6 and 4
- [ ] 4 is greater
- [ ] 6 is greater ✓
- [ ] They are equal
- [ ] I don't know

**Counting and Comparing:**
Count the cars: 🚗🚗🚗🚗🚗🚗
Count the bikes: 🚲🚲🚲🚲
Which has more?
- [ ] Cars ✓
- [ ] Bikes
- [ ] Same amount
- [ ] Can't compare`,

    `# Counting 1-10 - Mastery 🎯

## You're a Counting Master!
Let's put it all together!

### Mixed Practice
**Number Recognition:**
What number is this? 9
- [ ] Eight
- [ ] Nine ✓
- [ ] Ten
- [ ] Seven

**Counting Objects:**
Count the balloons: 🎈🎈🎈🎈🎈🎈🎈🎈
How many balloons?
- [ ] 7
- [ ] 8 ✓
- [ ] 9
- [ ] 10

**Number Order:**
What comes between 4 and 6?
- [ ] 3
- [ ] 5 ✓
- [ ] 7
- [ ] 8

**Comparison:**
Which is greater: 3 or 7?
- [ ] 3
- [ ] 7 ✓
- [ ] They're equal
- [ ] I don't know

**🎉 Congratulations!**
You've mastered counting from 1 to 10!`
  ]
  
  return lessons[lessonNum - 1] || lessons[0]
}

function generateShapesLesson(grade: number, lessonNum: number): string {
  const lessons = [
    `# Basic Shapes - Introduction 🔺

## Shapes All Around Us!
Shapes are everywhere in our world! Let's learn about them.

### Basic 2D Shapes
**Circle ⭕**
- Round and smooth
- No corners or edges
- Like a wheel or a clock face

**Square ⬜**
- Four equal sides
- Four right angles
- Like a window or a book

**Triangle 🔺**
- Three sides
- Three corners
- Like a slice of pizza

**Interactive Shape Hunt:**
What shape is a pizza slice?
- [ ] Circle
- [ ] Square
- [ ] Triangle ✓
- [ ] Rectangle`,

    `# Basic Shapes - Recognition 👁️

## Recognizing Shapes
Let's learn to identify different shapes!

### Shape Identification
**What Shape is This?**
Look at this shape: ⬜
- [ ] Circle
- [ ] Square ✓
- [ ] Triangle
- [ ] Rectangle

**Real-World Shapes:**
A clock face is what shape?
- [ ] Square
- [ ] Triangle
- [ ] Circle ✓
- [ ] Rectangle

**Shape Sorting:**
Which of these is a triangle?
- [ ] ⬜
- [ ] 🔺 ✓
- [ ] ⭕
- [ ] ⬛`,

    `# Basic Shapes - Properties 📐

## Shape Properties
Let's learn about the special features of each shape!

### Counting Sides and Corners
**How Many Sides?**
A square has how many sides?
- [ ] 2
- [ ] 3
- [ ] 4 ✓
- [ ] 5

**How Many Corners?**
A triangle has how many corners?
- [ ] 2
- [ ] 3 ✓
- [ ] 4
- [ ] 5

**Special Features:**
Which shape has no corners?
- [ ] Square
- [ ] Triangle
- [ ] Circle ✓
- [ ] Rectangle`,

    `# Basic Shapes - In Our World 🌍

## Shapes Everywhere!
Let's find shapes in our daily lives!

### Real-World Examples
**At Home:**
What shape is a TV screen?
- [ ] Circle
- [ ] Square
- [ ] Rectangle ✓
- [ ] Triangle

**In Nature:**
What shape is the sun?
- [ ] Square
- [ ] Triangle
- [ ] Circle ✓
- [ ] Rectangle

**Shapes Around You:**
Look around your room. What shapes do you see?
- [ ] Only circles
- [ ] Only squares
- [ ] Many different shapes ✓
- [ ] No shapes at all`,

    `# Basic Shapes - Mastery 🏆

## Shape Expert!
You're becoming a shape expert!

### Mixed Practice
**Shape Identification:**
What shape is this? 🔺
- [ ] Circle
- [ ] Square
- [ ] Triangle ✓
- [ ] Rectangle

**Properties Quiz:**
Which shape has the most sides?
- [ ] Circle
- [ ] Triangle
- [ ] Square ✓
- [ ] They all have the same

**Real-World Application:**
A stop sign is what shape?
- [ ] Circle
- [ ] Square
- [ ] Triangle
- [ ] Octagon (8 sides) ✓

**🎨 Creative Challenge:**
Can you draw a picture using only circles, squares, and triangles?`
  ]
  
  return lessons[lessonNum - 1] || lessons[0]
}

function generateAdditionLesson(grade: number, lessonNum: number): string {
  const lessons = [
    `# Simple Addition - Introduction ➕

## Adding Things Together!
Addition is about putting things together to make more!

### What is Addition?
**The Plus Sign +**
- Means "add" or "put together"
- We use it to combine numbers
- Example: 2 + 3 = 5

**Simple Addition:**
If you have 2 apples and get 3 more apples, how many apples do you have?
- [ ] 4
- [ ] 5 ✓
- [ ] 6
- [ ] 7

**Visual Addition:**
🍎🍎 + 🍎🍎🍎 = ?
Count all the apples together!
- [ ] 4
- [ ] 5 ✓
- [ ] 6
- [ ] 7`,

    `# Simple Addition - Practice 📝

## Let's Practice Adding!
Time to practice with more addition problems!

### Addition Problems
**Problem 1:**
3 + 2 = ?
- [ ] 4
- [ ] 5 ✓
- [ ] 6
- [ ] 7

**Problem 2:**
1 + 4 = ?
- [ ] 4
- [ ] 5 ✓
- [ ] 6
- [ ] 7

**Problem 3:**
2 + 3 = ?
- [ ] 4
- [ ] 5 ✓
- [ ] 6
- [ ] 7`,

    `# Simple Addition - Word Problems 📚

## Addition in Stories!
Let's solve addition problems using stories!

### Story Problem 1
**Sarah's Toys:**
Sarah has 2 dolls. Her friend gives her 3 more dolls. How many dolls does Sarah have now?
- [ ] 4
- [ ] 5 ✓
- [ ] 6
- [ ] 7

**Story Problem 2**
**Tom's Stickers:**
Tom has 4 stickers. He finds 2 more stickers. How many stickers does Tom have?
- [ ] 5
- [ ] 6 ✓
- [ ] 7
- [ ] 8

**Story Problem 3**
**Lisa's Books:**
Lisa reads 1 book in the morning and 3 books in the afternoon. How many books did she read?
- [ ] 3
- [ ] 4 ✓
- [ ] 5
- [ ] 6`,

    `# Simple Addition - Different Ways 🔄

## Many Ways to Add!
There are different ways to think about addition!

### Counting On
**Method 1: Count All**
Start with the first number and count on: 3 + 2
Start at 3: 3, 4, 5
- [ ] 4
- [ ] 5 ✓
- [ ] 6
- [ ] 7

**Method 2: Use Objects**
Use blocks or fingers to help: 2 + 3
Count 2 blocks, then count 3 more blocks
- [ ] 4
- [ ] 5 ✓
- [ ] 6
- [ ] 7

**Method 3: Number Line**
Jump on a number line: 4 + 1
Start at 4, jump 1 space to the right
- [ ] 4
- [ ] 5 ✓
- [ ] 6
- [ ] 7`,

    `# Simple Addition - Mastery 🎯

## Addition Master!
You're becoming an addition expert!

### Mixed Practice
**Quick Addition:**
4 + 1 = ?
- [ ] 4
- [ ] 5 ✓
- [ ] 6
- [ ] 7

**Word Problem:**
Emma has 3 pencils. She buys 2 more pencils. How many pencils does she have?
- [ ] 4
- [ ] 5 ✓
- [ ] 6
- [ ] 7

**Challenge Problem:**
If 2 + 3 = 5, what does 3 + 2 equal?
- [ ] 4
- [ ] 5 ✓
- [ ] 6
- [ ] 7

**🎉 Congratulations!**
You've mastered simple addition! You can now:
- Add small numbers together
- Solve addition word problems
- Use different methods to add
- Understand that addition means "putting together"!`
  ]
  
  return lessons[lessonNum - 1] || lessons[0]
}

function generateGenericMathLesson(grade: number, topic: string, lessonNum: number): string {
  return `# ${topic} - Lesson ${lessonNum} 📊

## Exploring ${topic}
Let's dive into the world of ${topic.toLowerCase()}!

### Key Concepts
**Understanding the Basics:**
${topic} is an important mathematical concept that helps us solve problems and understand patterns.

**Interactive Learning:**
What is the most important thing to remember about ${topic.toLowerCase()}?
- [ ] It's very difficult
- [ ] It helps us solve problems ✓
- [ ] It's only for advanced students
- [ ] It's not useful

**Practice Problems:**
Let's work through some examples together!

**Problem 1:**
Apply what you know about ${topic.toLowerCase()}:
- [ ] Option A
- [ ] Option B
- [ ] Option C ✓
- [ ] Option D

**Real-World Application:**
How does ${topic.toLowerCase()} help us in daily life?
- [ ] It doesn't help at all
- [ ] It helps us make decisions ✓
- [ ] It's only for school
- [ ] It's not useful

**🎯 Key Takeaway:**
${topic} is a powerful tool that helps us understand and solve problems in mathematics and beyond!`
}

function generateEnglishLesson(grade: number, lessonNum: number): LessonContent {
  const englishTopics = {
    0: ['Letter Recognition', 'Phonics Basics', 'Sight Words', 'Simple Sentences', 'Reading Readiness'],
    1: ['Letter Sounds', 'Word Building', 'Common Words', 'Sentence Structure', 'Reading Comprehension'],
    2: ['Spelling Patterns', 'Grammar Basics', 'Story Elements', 'Writing Skills', 'Vocabulary Building'],
    3: ['Advanced Phonics', 'Sentence Types', 'Paragraph Writing', 'Reading Strategies', 'Language Arts'],
    4: ['Complex Spelling', 'Grammar Rules', 'Creative Writing', 'Literary Analysis', 'Communication'],
    5: ['Word Origins', 'Advanced Grammar', 'Essay Writing', 'Critical Reading', 'Language Study'],
    6: ['Literary Devices', 'Advanced Writing', 'Research Skills', 'Media Literacy', 'Language Arts']
  }
  
  const topic = englishTopics[grade as keyof typeof englishTopics]?.[lessonNum - 1] || 'English Language Arts'
  
  return {
    title: topic,
    description: `Develop ${topic.toLowerCase()} skills`,
    content: generateEnglishContent(grade, topic, lessonNum),
    duration: getDuration(grade, 18, 30)
  }
}

function generateEnglishContent(grade: number, topic: string, lessonNum: number): string {
  switch (topic) {
    case 'Letter Recognition':
      return generateLetterRecognitionLesson(grade, lessonNum)
    case 'Phonics Basics':
      return generatePhonicsLesson(grade, lessonNum)
    default:
      return generateGenericEnglishLesson(grade, topic, lessonNum)
  }
}

function generateLetterRecognitionLesson(grade: number, lessonNum: number): string {
  const lessons = [
    `# Letter Recognition - A to E 🔤

## Learning Our First Letters!
Let's start with the first five letters of the alphabet!

### Letters A, B, C, D, E
**Letter A (uppercase A)**
- Looks like a triangle with a line across the middle
- Makes the "ah" sound
- Examples: Apple, Ant, Alligator

**Letter B (uppercase B)**
- Has two bumps on the right side
- Makes the "buh" sound
- Examples: Ball, Bear, Book

**Interactive Practice:**
Which letter makes the "ah" sound?
- [ ] B
- [ ] C
- [ ] A ✓
- [ ] D

**Letter C (uppercase C)**
- Looks like a curved line
- Makes the "kuh" sound
- Examples: Cat, Car, Cake

**Letter D (uppercase D)**
- Has one bump on the right side
- Makes the "duh" sound
- Examples: Dog, Duck, Door

**Letter E (uppercase E)**
- Has three lines across
- Makes the "eh" sound
- Examples: Elephant, Egg, Earth

**Letter Recognition:**
What letter is this? E
- [ ] F
- [ ] E ✓
- [ ] G
- [ ] H`,

    `# Letter Recognition - F to J 🔤

## More Letters to Learn!
Let's continue with letters F through J!

### Letters F, G, H, I, J
**Letter F (uppercase F)**
- Has two lines across
- Makes the "fuh" sound
- Examples: Fish, Flower, Fire

**Letter G (uppercase G)**
- Looks like a C with a line inside
- Makes the "guh" sound
- Examples: Goat, Garden, Game

**Interactive Practice:**
Which letter makes the "fuh" sound?
- [ ] G
- [ ] F ✓
- [ ] H
- [ ] I

**Letter H (uppercase H)**
- Has two vertical lines connected
- Makes the "huh" sound
- Examples: House, Horse, Hat

**Letter I (uppercase I)**
- A straight line with a dot on top
- Makes the "ih" sound
- Examples: Ice, Igloo, Island

**Letter J (uppercase J)**
- Looks like an I with a curve at the bottom
- Makes the "juh" sound
- Examples: Jump, Juice, Jacket

**Letter Recognition:**
What letter is this? H
- [ ] I
- [ ] J
- [ ] H ✓
- [ ] G`,

    `# Letter Recognition - K to O 🔤

## Continuing Our Journey!
Let's learn letters K through O!

### Letters K, L, M, N, O
**Letter K (uppercase K)**
- Has a vertical line with two angled lines
- Makes the "kuh" sound
- Examples: Kite, King, Kitchen

**Letter L (uppercase L)**
- A vertical line with a horizontal line at the bottom
- Makes the "luh" sound
- Examples: Lion, Leaf, Light

**Interactive Practice:**
Which letter makes the "luh" sound?
- [ ] K
- [ ] L ✓
- [ ] M
- [ ] N

**Letter M (uppercase M)**
- Has two peaks like mountains
- Makes the "muh" sound
- Examples: Moon, Mouse, Music

**Letter N (uppercase N)**
- Has one peak like a mountain
- Makes the "nuh" sound
- Examples: Nest, Nose, Night

**Letter O (uppercase O)**
- A perfect circle
- Makes the "oh" sound
- Examples: Owl, Orange, Ocean

**Letter Recognition:**
What letter is this? M
- [ ] N
- [ ] O
- [ ] M ✓
- [ ] L`,

    `# Letter Recognition - P to T 🔤

## Almost Halfway There!
Let's learn letters P through T!

### Letters P, Q, R, S, T
**Letter P (uppercase P)**
- Has a vertical line with a bump on the right
- Makes the "puh" sound
- Examples: Pig, Pizza, Park

**Letter Q (uppercase Q)**
- Looks like an O with a tail
- Makes the "kwuh" sound
- Examples: Queen, Quiet, Question

**Interactive Practice:**
Which letter makes the "puh" sound?
- [ ] Q
- [ ] R
- [ ] P ✓
- [ ] S

**Letter R (uppercase R)**
- Like a P with a diagonal line
- Makes the "ruh" sound
- Examples: Rabbit, Rainbow, Robot

**Letter S (uppercase S)**
- A curved line like a snake
- Makes the "suh" sound
- Examples: Sun, Star, Snake

**Letter T (uppercase T)**
- A vertical line with a horizontal line on top
- Makes the "tuh" sound
- Examples: Tree, Tiger, Train

**Letter Recognition:**
What letter is this? S
- [ ] T
- [ ] R
- [ ] S ✓
- [ ] Q`,

    `# Letter Recognition - U to Z 🔤

## The Final Letters!
Let's finish with letters U through Z!

### Letters U, V, W, X, Y, Z
**Letter U (uppercase U)**
- Looks like a horseshoe
- Makes the "uh" sound
- Examples: Umbrella, Up, Unicorn

**Letter V (uppercase V)**
- Two diagonal lines meeting at the bottom
- Makes the "vuh" sound
- Examples: Violin, Volcano, Vacation

**Interactive Practice:**
Which letter makes the "vuh" sound?
- [ ] U
- [ ] V ✓
- [ ] W
- [ ] X

**Letter W (uppercase W)**
- Two V's connected together
- Makes the "wuh" sound
- Examples: Water, Whale, Window

**Letter X (uppercase X)**
- Two diagonal lines crossing
- Makes the "ks" sound
- Examples: Xylophone, Box, Fox

**Letter Y (uppercase Y)**
- A V with an extra line
- Makes the "yuh" sound
- Examples: Yellow, Yes, Yard

**Letter Z (uppercase Z)**
- Three horizontal lines connected diagonally
- Makes the "zuh" sound
- Examples: Zebra, Zoo, Zero

**🎉 Alphabet Complete!**
You've learned all 26 letters of the alphabet!
What letter is this? Z
- [ ] Y
- [ ] X
- [ ] W
- [ ] Z ✓`
  ]
  
  return lessons[lessonNum - 1] || lessons[0]
}

function generatePhonicsLesson(grade: number, lessonNum: number): string {
  const lessons = [
    `# Phonics Basics - Short Vowels 🔤

## Learning Letter Sounds!
Phonics helps us understand how letters make sounds!

### Short Vowel Sounds
**Short A Sound (ă)**
- Sounds like "ah" in cat
- Examples: cat, bat, hat, mat

**Short E Sound (ĕ)**
- Sounds like "eh" in bed
- Examples: bed, red, net, pet

**Interactive Practice:**
Which word has the short A sound?
- [ ] bed
- [ ] cat ✓
- [ ] pet
- [ ] net

**Short I Sound (ĭ)**
- Sounds like "ih" in sit
- Examples: sit, hit, bit, kit

**Short O Sound (ŏ)**
- Sounds like "ah" in hot
- Examples: hot, pot, dot, lot

**Short U Sound (ŭ)**
- Sounds like "uh" in cup
- Examples: cup, up, run, sun

**Sound Recognition:**
Which word has the short U sound?
- [ ] cat
- [ ] bed
- [ ] cup ✓
- [ ] hot`,

    `# Phonics Basics - Consonant Sounds 🎵

## Consonant Letter Sounds!
Let's learn how consonants make sounds!

### Common Consonants
**B Sound (buh)**
- Examples: ball, bat, big, book

**C Sound (kuh)**
- Examples: cat, car, cup, cut

**Interactive Practice:**
Which word starts with the B sound?
- [ ] cat
- [ ] ball ✓
- [ ] dog
- [ ] fish

**D Sound (duh)**
- Examples: dog, dad, day, door

**F Sound (fuh)**
- Examples: fish, fun, fast, four

**G Sound (guh)**
- Examples: go, get, good, green

**Sound Matching:**
Which word starts with the F sound?
- [ ] go
- [ ] fish ✓
- [ ] day
- [ ] ball`,

    `# Phonics Basics - Blending Sounds 🔗

## Putting Sounds Together!
Let's learn to blend sounds to make words!

### Sound Blending
**C-A-T = CAT**
- Say each sound: c-ah-t
- Blend them together: cat

**H-A-T = HAT**
- Say each sound: h-ah-t
- Blend them together: hat

**Interactive Blending:**
What word do these sounds make? B-A-T
- [ ] bat ✓
- [ ] cat
- [ ] hat
- [ ] mat

**M-O-P = MOP**
- Say each sound: m-ah-p
- Blend them together: mop

**S-I-T = SIT**
- Say each sound: s-ih-t
- Blend them together: sit

**Blending Practice:**
What word do these sounds make? R-U-N
- [ ] run ✓
- [ ] sun
- [ ] fun
- [ ] bun`,

    `# Phonics Basics - Word Families 📚

## Words That Rhyme!
Word families are groups of words that share the same ending sound!

### -AT Word Family
**AT Family Words:**
- cat, bat, hat, mat, rat, sat

**-AN Word Family**
**AN Family Words:**
- can, man, pan, ran, tan, van

**Interactive Practice:**
Which word belongs in the -AT family?
- [ ] can
- [ ] bat ✓
- [ ] man
- [ ] pan

**-IT Word Family**
**IT Family Words:**
- bit, hit, kit, lit, pit, sit

**-OG Word Family**
**OG Family Words:**
- bog, dog, fog, hog, jog, log

**Family Matching:**
Which word belongs in the -OG family?
- [ ] bit
- [ ] hit
- [ ] dog ✓
- [ ] kit`,

    `# Phonics Basics - Reading Words 📖

## Reading Our First Words!
Now let's put it all together to read words!

### Simple Word Reading
**Three-Letter Words:**
- cat, dog, hat, pig, sun, run

**Four-Letter Words:**
- ball, tree, fish, book, jump, play

**Interactive Reading:**
What word is this? D-O-G
- [ ] cat
- [ ] dog ✓
- [ ] pig
- [ ] hat

**Word Recognition:**
Look at this word: F-I-S-H
What does it say?
- [ ] dish
- [ ] wish
- [ ] fish ✓
- [ ] dish

**Reading Practice:**
What word is this? B-O-O-K
- [ ] look
- [ ] took
- [ ] book ✓
- [ ] cook

**🎉 Reading Success!**
You can now read simple words using phonics!
You know:
- Letter sounds
- Sound blending
- Word families
- Word recognition`
  ]
  
  return lessons[lessonNum - 1] || lessons[0]
}

function generateGenericEnglishLesson(grade: number, topic: string, lessonNum: number): string {
  return `# ${topic} - Lesson ${lessonNum} 📚

## Exploring ${topic}
Let's dive into the world of ${topic.toLowerCase()}!

### Key Concepts
**Understanding the Basics:**
${topic} is an important part of language arts that helps us communicate effectively.

**Interactive Learning:**
What is the most important thing to remember about ${topic.toLowerCase()}?
- [ ] It's very difficult
- [ ] It helps us communicate better ✓
- [ ] It's only for advanced students
- [ ] It's not useful

**Practice Activities:**
Let's work through some examples together!

**Activity 1:**
Apply what you know about ${topic.toLowerCase()}:
- [ ] Option A
- [ ] Option B
- [ ] Option C ✓
- [ ] Option D

**Real-World Application:**
How does ${topic.toLowerCase()} help us in daily life?
- [ ] It doesn't help at all
- [ ] It helps us communicate clearly ✓
- [ ] It's only for school
- [ ] It's not useful

**🎯 Key Takeaway:**
${topic} is a powerful tool that helps us understand and use language effectively!`
}

function generateTechnologyLesson(grade: number, lessonNum: number): LessonContent {
  const techTopics = {
    0: ['Computer Basics', 'Mouse Skills', 'Keyboard Fun', 'Screen Safety', 'Digital Citizenship'],
    1: ['Computer Parts', 'Clicking Practice', 'Typing Basics', 'Internet Safety', 'Digital Manners'],
    2: ['File Management', 'Word Processing', 'Internet Research', 'Online Privacy', 'Responsible Use'],
    3: ['Software Applications', 'Presentation Skills', 'Email Basics', 'Cybersecurity', 'Digital Footprint'],
    4: ['Coding Basics', 'Multimedia Creation', 'Online Collaboration', 'Information Literacy', 'Ethical Technology'],
    5: ['Programming Concepts', 'Digital Storytelling', 'Data Analysis', 'Media Literacy', 'Technology Ethics'],
    6: ['Advanced Programming', 'Web Development', 'Digital Innovation', 'Critical Thinking', 'Future Technology']
  }
  
  const topic = techTopics[grade as keyof typeof techTopics]?.[lessonNum - 1] || 'Technology Skills'
  
  return {
    title: topic,
    description: `Develop ${topic.toLowerCase()} skills`,
    content: generateTechnologyContent(grade, topic, lessonNum),
    duration: getDuration(grade, 20, 35)
  }
}

function generateTechnologyContent(grade: number, topic: string, lessonNum: number): string {
  switch (topic) {
    case 'Computer Basics':
      return generateComputerBasicsLesson(grade, lessonNum)
    case 'Internet Safety':
      return generateInternetSafetyLesson(grade, lessonNum)
    default:
      return generateGenericTechnologyLesson(grade, topic, lessonNum)
  }
}

function generateComputerBasicsLesson(grade: number, lessonNum: number): string {
  const lessons = [
    `# Computer Basics - Parts of a Computer 🖥️

## What is a Computer?
Let's learn about the different parts of a computer!

### Main Computer Parts
**Monitor (Screen)**
- Shows pictures and words
- Like a TV screen
- We look at it to see what we're doing

**Keyboard**
- Has letters and numbers
- We use it to type words
- Like writing with your fingers

**Interactive Learning:**
What part of the computer shows pictures?
- [ ] Keyboard
- [ ] Mouse
- [ ] Monitor ✓
- [ ] Speakers

**Mouse**
- Small device we move around
- Helps us click on things
- Like pointing with your finger

**CPU (Computer Brain)**
- The main part that thinks
- Usually in a big box
- Makes everything work

**Parts Quiz:**
What do we use to type words?
- [ ] Mouse
- [ ] Monitor
- [ ] Keyboard ✓
- [ ] CPU`,

    `# Computer Basics - Using the Mouse 🖱️

## Mouse Skills!
Let's learn how to use the mouse properly!

### Mouse Movements
**Moving the Mouse**
- Move it left, right, up, down
- The arrow on screen follows
- Don't pick it up off the desk

**Clicking**
- Press the left button once
- Makes a "click" sound
- Selects things on screen

**Interactive Practice:**
How do you select something on the computer?
- [ ] Move the mouse
- [ ] Click the mouse ✓
- [ ] Type on keyboard
- [ ] Turn off computer

**Double-Clicking**
- Press the left button twice quickly
- Opens programs or files
- Like knocking twice on a door

**Right-Clicking**
- Press the right button once
- Shows special options
- Like asking "What can I do?"

**Mouse Skills:**
What happens when you double-click?
- [ ] Nothing
- [ ] Opens something ✓
- [ ] Closes something
- [ ] Changes color`,

    `# Computer Basics - Keyboard Fun ⌨️

## Learning the Keyboard!
Let's explore the keyboard and learn to type!

### Keyboard Layout
**Letter Keys**
- A, B, C, D, E, F, G...
- All the letters of the alphabet
- We use them to type words

**Number Keys**
- 1, 2, 3, 4, 5, 6, 7, 8, 9, 0
- We use them to type numbers
- At the top of the keyboard

**Interactive Typing:**
What keys do we use to type the word "CAT"?
- [ ] Number keys
- [ ] Letter keys ✓
- [ ] Special keys
- [ ] Mouse buttons

**Space Bar**
- The long bar at the bottom
- Makes spaces between words
- Very important for typing

**Enter Key**
- Looks like a bent arrow
- Moves to the next line
- Like pressing "send"

**Keyboard Knowledge:**
What key makes spaces between words?
- [ ] Enter key
- [ ] Letter keys
- [ ] Space bar ✓
- [ ] Number keys`,

    `# Computer Basics - Screen Safety 👀

## Taking Care of Your Eyes!
Let's learn how to use computers safely!

### Good Computer Habits
**Sit Up Straight**
- Keep your back straight
- Don't slouch in your chair
- Sit at a comfortable distance

**Eye Care**
- Look away from screen sometimes
- Blink your eyes regularly
- Don't stare too long

**Interactive Safety:**
How often should you look away from the screen?
- [ ] Never
- [ ] Once in a while ✓
- [ ] Always
- [ ] Only when tired

**Take Breaks**
- Get up and move around
- Stretch your arms and legs
- Give your eyes a rest

**Good Lighting**
- Use computers in well-lit rooms
- Don't use in very dark places
- Avoid glare on the screen

**Safety First:**
What should you do to take care of your eyes?
- [ ] Stare at screen all day
- [ ] Take breaks and blink ✓
- [ ] Use computer in dark room
- [ ] Never look away`,

    `# Computer Basics - Getting Started 🚀

## Ready to Use Computers!
You're ready to start using computers!

### Starting Up
**Turning On the Computer**
- Press the power button
- Wait for it to start up
- Look for the desktop

**Desktop**
- The main screen you see
- Has icons and pictures
- Like your computer's home

**Interactive Start:**
What do you see when the computer starts?
- [ ] A black screen
- [ ] The desktop ✓
- [ ] Nothing
- [ ] Error messages

**Icons**
- Small pictures on desktop
- Each one opens a program
- Click to start using them

**Closing Programs**
- Click the X in the corner
- Or use the close button
- Always close when done

**Computer Ready:**
You now know how to:
- Identify computer parts
- Use the mouse
- Use the keyboard
- Stay safe while computing
- Start and close programs

**🎉 Congratulations!**
You're ready to use computers safely and effectively!`
  ]
  
  return lessons[lessonNum - 1] || lessons[0]
}

function generateInternetSafetyLesson(grade: number, lessonNum: number): string {
  const lessons = [
    `# Internet Safety - What is the Internet? 🌐

## Exploring the Internet!
Let's learn about the internet and how to use it safely!

### What is the Internet?
**The Internet**
- Connects computers around the world
- Like a giant library
- Has lots of information and fun things

**Websites**
- Pages you can visit on the internet
- Like books in a library
- Each one has different information

**Interactive Learning:**
What is the internet like?
- [ ] A small box
- [ ] A giant library ✓
- [ ] A toy
- [ ] A game

**Safe Websites**
- Websites made for kids
- Have fun games and learning
- Are supervised by adults

**Unsafe Places**
- Some websites are not for kids
- May have scary or bad content
- Should be avoided

**Safety First:**
Which websites should you visit?
- [ ] All websites
- [ ] Only safe websites for kids ✓
- [ ] Any website you find
- [ ] Only scary websites`,

    `# Internet Safety - Personal Information 🔒

## Keeping Your Information Safe!
Let's learn what information to keep private!

### Personal Information
**Your Name**
- Never give your full name online
- Use only your first name
- Don't tell strangers your last name

**Your Address**
- Never share where you live
- Don't tell anyone your address
- Keep your home location private

**Interactive Privacy:**
What should you never share online?
- [ ] Your favorite color
- [ ] Your home address ✓
- [ ] Your favorite food
- [ ] Your favorite game

**Your Phone Number**
- Never give your phone number
- Don't share family phone numbers
- Keep contact information private

**Your School**
- Don't tell people what school you go to
- Keep your school name private
- Don't share school schedules

**Privacy Protection:**
Which information is okay to share?
- [ ] Your address
- [ ] Your favorite color ✓
- [ ] Your phone number
- [ ] Your school name`,

    `# Internet Safety - Talking to Strangers 👥

## Stranger Danger Online!
Let's learn about staying safe when talking to people online!

### Online Strangers
**Who Are Strangers?**
- People you don't know in real life
- People you've never met before
- Anyone you don't recognize

**Never Meet Strangers**
- Don't agree to meet people from online
- Tell an adult if someone asks to meet
- Stay safe by staying away

**Interactive Safety:**
What should you do if a stranger asks to meet you?
- [ ] Meet them
- [ ] Tell an adult ✓
- [ ] Keep it secret
- [ ] Say yes

**Block and Report**
- If someone is mean or scary, block them
- Tell an adult immediately
- Don't respond to bad messages

**Trusted Adults**
- Always tell parents or teachers
- They can help keep you safe
- They know what to do

**Stranger Safety:**
Who should you talk to if someone online scares you?
- [ ] Your friends
- [ ] A trusted adult ✓
- [ ] The stranger
- [ ] No one`,

    `# Internet Safety - Good Websites 🎯

## Finding Good Places Online!
Let's learn how to find safe and fun websites!

### Safe Websites for Kids
**Educational Websites**
- Help you learn new things
- Have fun games and activities
- Are made just for kids

**Parent-Approved Sites**
- Websites your parents say are okay
- Have been checked for safety
- Are appropriate for your age

**Interactive Discovery:**
What makes a website safe for kids?
- [ ] It's scary
- [ ] It's made for kids ✓
- [ ] It has bad words
- [ ] It's for adults only

**Fun Learning Sites**
- Games that teach you things
- Stories you can read
- Activities that help you grow

**Avoid These Sites**
- Sites with scary content
- Sites not meant for kids
- Sites that ask for personal information

**Smart Surfing:**
What should you do before visiting a new website?
- [ ] Visit immediately
- [ ] Ask a parent first ✓
- [ ] Tell your friends
- [ ] Keep it secret`,

    `# Internet Safety - Being a Good Digital Citizen 🌟

## Being Kind Online!
Let's learn how to be a good person on the internet!

### Digital Citizenship
**Be Kind Online**
- Use nice words when talking to others
- Don't say mean things
- Treat others like you want to be treated

**Share Good Things**
- Share positive messages
- Help others learn
- Be a good friend online

**Interactive Kindness:**
How should you talk to others online?
- [ ] Say mean things
- [ ] Be kind and helpful ✓
- [ ] Ignore everyone
- [ ] Be rude

**Ask Permission**
- Ask before sharing photos
- Get permission before posting
- Respect other people's privacy

**Help Others**
- If you see someone being mean, tell an adult
- Help friends who are having trouble
- Be a positive influence

**Digital Hero:**
What makes someone a good digital citizen?
- [ ] Being mean to others
- [ ] Being kind and helpful ✓
- [ ] Sharing secrets
- [ ] Ignoring problems

**🎉 Internet Safety Master!**
You now know how to:
- Keep your information private
- Stay safe from strangers
- Find good websites
- Be kind online
- Be a responsible digital citizen!`
  ]
  
  return lessons[lessonNum - 1] || lessons[0]
}

function generateGenericTechnologyLesson(grade: number, topic: string, lessonNum: number): string {
  return `# ${topic} - Lesson ${lessonNum} 💻

## Exploring ${topic}
Let's dive into the world of ${topic.toLowerCase()}!

### Key Concepts
**Understanding the Basics:**
${topic} is an important skill that helps us use technology effectively and safely.

**Interactive Learning:**
What is the most important thing to remember about ${topic.toLowerCase()}?
- [ ] It's very difficult
- [ ] It helps us use technology safely ✓
- [ ] It's only for advanced users
- [ ] It's not useful

**Practice Activities:**
Let's work through some examples together!

**Activity 1:**
Apply what you know about ${topic.toLowerCase()}:
- [ ] Option A
- [ ] Option B
- [ ] Option C ✓
- [ ] Option D

**Real-World Application:**
How does ${topic.toLowerCase()} help us in daily life?
- [ ] It doesn't help at all
- [ ] It helps us use technology responsibly ✓
- [ ] It's only for school
- [ ] It's not useful

**🎯 Key Takeaway:**
${topic} is a powerful skill that helps us navigate the digital world safely and effectively!`
}

function generateDefaultLesson(grade: number, subject: string, lessonNum: number): LessonContent {
  return {
    title: `${subject} Exploration - Part ${lessonNum}`,
    description: `Learn about ${subject.toLowerCase()} concepts`,
    content: `# ${subject} Exploration - Part ${lessonNum} 📚

## Welcome to ${subject}!
Let's explore the fascinating world of ${subject.toLowerCase()}!

### What We'll Learn
**Key Concepts:**
- Understanding basic principles
- Exploring real-world applications
- Hands-on learning activities

**Interactive Learning:**
What interests you most about ${subject.toLowerCase()}?
- [ ] The basic concepts
- [ ] How it's used in real life ✓
- [ ] The complicated parts
- [ ] Nothing at all

**Let's Get Started:**
${subject} is all around us and affects our daily lives in many ways.

**Practice Activity:**
Apply what you know about ${subject.toLowerCase()}:
- [ ] Option A
- [ ] Option B
- [ ] Option C ✓
- [ ] Option D

**Real-World Connection:**
How does ${subject.toLowerCase()} help us understand the world better?
- [ ] It doesn't help
- [ ] It helps us solve problems ✓
- [ ] It's only for experts
- [ ] It's too confusing

**🎯 Key Takeaway:**
${subject} helps us understand and interact with the world around us in meaningful ways!`,
    duration: getDuration(grade, 15, 25)
  }
}

function getDuration(grade: number, minMinutes: number, maxMinutes: number): number {
  // Adjust duration based on grade level
  const gradeMultiplier = grade === 0 ? 0.8 : 1 + (grade * 0.1)
  const baseDuration = Math.floor((minMinutes + maxMinutes) / 2)
  return Math.max(minMinutes, Math.min(maxMinutes, Math.floor(baseDuration * gradeMultiplier)))
}
