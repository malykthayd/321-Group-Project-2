using api.Models.Curriculum;
using System.Text.Json;

namespace api.Services.Curriculum
{
    public interface IQuestionGenerator
    {
        LessonContent GenerateLessonContent(Subject subject, Grade grade, LessonDifficulty difficulty);
        List<LessonQuestion> GenerateQuestions(Subject subject, Grade grade, LessonDifficulty difficulty, int lessonId);
    }

    public class LessonContent
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class QuestionGenerator : IQuestionGenerator
    {
        private readonly Dictionary<string, ISubjectGenerator> _subjectGenerators;

        public QuestionGenerator()
        {
            _subjectGenerators = new Dictionary<string, ISubjectGenerator>
            {
                { "english-language-arts", new EnglishLanguageArtsGenerator() },
                { "mathematics", new MathematicsGenerator() },
                { "science", new ScienceGenerator() },
                { "social-studies", new SocialStudiesGenerator() }
            };
        }

        public LessonContent GenerateLessonContent(Subject subject, Grade grade, LessonDifficulty difficulty)
        {
            var generator = GetSubjectGenerator(subject.Slug);
            return generator.GenerateLessonContent(subject, grade, difficulty);
        }

        public List<LessonQuestion> GenerateQuestions(Subject subject, Grade grade, LessonDifficulty difficulty, int lessonId)
        {
            var generator = GetSubjectGenerator(subject.Slug);
            return generator.GenerateQuestions(subject, grade, difficulty, lessonId);
        }

        private ISubjectGenerator GetSubjectGenerator(string subjectSlug)
        {
            if (_subjectGenerators.TryGetValue(subjectSlug, out var generator))
            {
                return generator;
            }
            return new DefaultSubjectGenerator();
        }
    }

    public interface ISubjectGenerator
    {
        LessonContent GenerateLessonContent(Subject subject, Grade grade, LessonDifficulty difficulty);
        List<LessonQuestion> GenerateQuestions(Subject subject, Grade grade, LessonDifficulty difficulty, int lessonId);
    }

    public abstract class BaseSubjectGenerator : ISubjectGenerator
    {
        public abstract LessonContent GenerateLessonContent(Subject subject, Grade grade, LessonDifficulty difficulty);
        public abstract List<LessonQuestion> GenerateQuestions(Subject subject, Grade grade, LessonDifficulty difficulty, int lessonId);

        protected int GetGradeLevel(Grade grade)
        {
            return grade.Code switch
            {
                "K" => 0,
                _ => int.TryParse(grade.Code, out var level) ? level : 1
            };
        }

        protected LessonQuestion CreateQuestion(int lessonId, int order, string prompt, string[] choices, int correctIndex, string? explanation = null)
        {
            return new LessonQuestion
            {
                GeneratedLessonId = lessonId,
                Prompt = prompt,
                ChoicesJson = JsonSerializer.Serialize(choices),
                AnswerIndex = correctIndex,
                Explanation = explanation,
                Order = order
            };
        }
    }

    public class EnglishLanguageArtsGenerator : BaseSubjectGenerator
    {
        public override LessonContent GenerateLessonContent(Subject subject, Grade grade, LessonDifficulty difficulty)
        {
            var gradeLevel = GetGradeLevel(grade);
            var difficultyText = difficulty == LessonDifficulty.A ? "Basic" : "Intermediate";

            return new LessonContent
            {
                Title = $"{difficultyText} {subject.Name} - {grade.DisplayName}",
                Description = $"Practice {subject.Name} skills appropriate for {grade.DisplayName} students. This lesson focuses on {GetELAFocus(gradeLevel, difficulty)}."
            };
        }

        public override List<LessonQuestion> GenerateQuestions(Subject subject, Grade grade, LessonDifficulty difficulty, int lessonId)
        {
            var gradeLevel = GetGradeLevel(grade);
            var questions = new List<LessonQuestion>();

            // Generate 5 questions based on grade level and difficulty
            for (int i = 1; i <= 5; i++)
            {
                var question = GenerateELAQuestion(lessonId, i, gradeLevel, difficulty);
                questions.Add(question);
            }

            return questions;
        }

        private LessonQuestion GenerateELAQuestion(int lessonId, int order, int gradeLevel, LessonDifficulty difficulty)
        {
            return gradeLevel switch
            {
                <= 2 => GenerateEarlyElementaryELA(lessonId, order, difficulty),
                <= 5 => GenerateElementaryELA(lessonId, order, difficulty),
                <= 8 => GenerateMiddleSchoolELA(lessonId, order, difficulty),
                _ => GenerateHighSchoolELA(lessonId, order, difficulty)
            };
        }

        private LessonQuestion GenerateEarlyElementaryELA(int lessonId, int order, LessonDifficulty difficulty)
        {
            var questions = new[]
            {
                ("Which word rhymes with 'cat'?", new[] { "dog", "hat", "run", "jump" }, 1, "Hat rhymes with cat because they end with the same sound."),
                ("What is the opposite of 'big'?", new[] { "small", "large", "huge", "tall" }, 0, "Small is the opposite of big."),
                ("Which word starts with the letter 'B'?", new[] { "apple", "ball", "cat", "dog" }, 1, "Ball starts with the letter B."),
                ("What do you call a baby cat?", new[] { "puppy", "kitten", "chick", "cub" }, 1, "A baby cat is called a kitten."),
                ("Which word means the same as 'happy'?", new[] { "sad", "glad", "mad", "bad" }, 1, "Glad means the same as happy.")
            };

            var (prompt, choices, correctIndex, explanation) = questions[order - 1];
            return CreateQuestion(lessonId, order, prompt, choices, correctIndex, explanation);
        }

        private LessonQuestion GenerateElementaryELA(int lessonId, int order, LessonDifficulty difficulty)
        {
            var questions = new[]
            {
                ("What is the main idea of this sentence: 'The dog ran quickly to catch the ball.'?", new[] { "Dogs like balls", "The dog was fast", "Running is fun", "Balls are round" }, 1, "The main idea is that the dog was running fast."),
                ("Which word is a noun in this sentence: 'The red car drove down the street.'?", new[] { "red", "car", "drove", "down" }, 1, "Car is a noun - it's a person, place, or thing."),
                ("What does 'enormous' mean?", new[] { "small", "huge", "round", "fast" }, 1, "Enormous means very large or huge."),
                ("Which sentence is written correctly?", new[] { "i like pizza", "I like pizza.", "I like pizza", "i like pizza." }, 1, "Sentences should start with a capital letter and end with a period."),
                ("What is the setting of a story?", new[] { "The characters", "Where it happens", "The problem", "The solution" }, 1, "The setting is where and when the story takes place.")
            };

            var (prompt, choices, correctIndex, explanation) = questions[order - 1];
            return CreateQuestion(lessonId, order, prompt, choices, correctIndex, explanation);
        }

        private LessonQuestion GenerateMiddleSchoolELA(int lessonId, int order, LessonDifficulty difficulty)
        {
            var questions = new[]
            {
                ("What literary device is used in: 'The wind whispered through the trees.'?", new[] { "metaphor", "personification", "simile", "alliteration" }, 1, "Personification gives human qualities to non-human things."),
                ("What is the theme of a story?", new[] { "The plot", "The main message", "The characters", "The setting" }, 1, "The theme is the main message or lesson of the story."),
                ("Which word has a negative connotation?", new[] { "confident", "arrogant", "proud", "happy" }, 1, "Arrogant has a negative meaning, suggesting excessive pride."),
                ("What is the purpose of a topic sentence?", new[] { "To end a paragraph", "To introduce the main idea", "To ask a question", "To provide details" }, 1, "A topic sentence introduces the main idea of a paragraph."),
                ("Which sentence uses correct punctuation?", new[] { "What time is it.", "What time is it?", "What time is it!", "What time is it," }, 1, "Questions should end with a question mark.")
            };

            var (prompt, choices, correctIndex, explanation) = questions[order - 1];
            return CreateQuestion(lessonId, order, prompt, choices, correctIndex, explanation);
        }

        private LessonQuestion GenerateHighSchoolELA(int lessonId, int order, LessonDifficulty difficulty)
        {
            var questions = new[]
            {
                ("What is the difference between 'affect' and 'effect'?", new[] { "They're the same", "Affect is a verb, effect is a noun", "Effect is a verb, affect is a noun", "They're both nouns" }, 1, "Affect is typically a verb meaning to influence; effect is typically a noun meaning result."),
                ("What is the tone of this passage: 'The storm raged mercilessly, destroying everything in its path.'?", new[] { "cheerful", "ominous", "peaceful", "confused" }, 1, "The words 'raged mercilessly' and 'destroying' create an ominous tone."),
                ("What is the purpose of a thesis statement?", new[] { "To conclude an essay", "To introduce the main argument", "To provide evidence", "To ask a question" }, 1, "A thesis statement introduces the main argument of an essay."),
                ("Which is an example of dramatic irony?", new[] { "A character slips on a banana peel", "The audience knows something the character doesn't", "Two characters argue", "A storm occurs" }, 1, "Dramatic irony occurs when the audience knows something the character doesn't."),
                ("What is the primary purpose of a counterargument?", new[] { "To confuse readers", "To strengthen your argument", "To end the essay", "To provide evidence" }, 1, "Addressing counterarguments strengthens your main argument.")
            };

            var (prompt, choices, correctIndex, explanation) = questions[order - 1];
            return CreateQuestion(lessonId, order, prompt, choices, correctIndex, explanation);
        }

        private string GetELAFocus(int gradeLevel, LessonDifficulty difficulty)
        {
            return gradeLevel switch
            {
                <= 2 => difficulty == LessonDifficulty.A ? "letter recognition and basic phonics" : "word families and simple comprehension",
                <= 5 => difficulty == LessonDifficulty.A ? "reading comprehension and vocabulary" : "grammar and writing skills",
                <= 8 => difficulty == LessonDifficulty.A ? "literary devices and analysis" : "essay writing and critical thinking",
                _ => difficulty == LessonDifficulty.A ? "advanced literary analysis" : "research and argumentative writing"
            };
        }
    }

    public class MathematicsGenerator : BaseSubjectGenerator
    {
        public override LessonContent GenerateLessonContent(Subject subject, Grade grade, LessonDifficulty difficulty)
        {
            var gradeLevel = GetGradeLevel(grade);
            var difficultyText = difficulty == LessonDifficulty.A ? "Basic" : "Intermediate";

            return new LessonContent
            {
                Title = $"{difficultyText} {subject.Name} - {grade.DisplayName}",
                Description = $"Practice {subject.Name} skills appropriate for {grade.DisplayName} students. This lesson focuses on {GetMathFocus(gradeLevel, difficulty)}."
            };
        }

        public override List<LessonQuestion> GenerateQuestions(Subject subject, Grade grade, LessonDifficulty difficulty, int lessonId)
        {
            var gradeLevel = GetGradeLevel(grade);
            var questions = new List<LessonQuestion>();

            for (int i = 1; i <= 5; i++)
            {
                var question = GenerateMathQuestion(lessonId, i, gradeLevel, difficulty);
                questions.Add(question);
            }

            return questions;
        }

        private LessonQuestion GenerateMathQuestion(int lessonId, int order, int gradeLevel, LessonDifficulty difficulty)
        {
            return gradeLevel switch
            {
                <= 2 => GenerateEarlyElementaryMath(lessonId, order, difficulty),
                <= 5 => GenerateElementaryMath(lessonId, order, difficulty),
                <= 8 => GenerateMiddleSchoolMath(lessonId, order, difficulty),
                _ => GenerateHighSchoolMath(lessonId, order, difficulty)
            };
        }

        private LessonQuestion GenerateEarlyElementaryMath(int lessonId, int order, LessonDifficulty difficulty)
        {
            var questions = new[]
            {
                ("What is 2 + 3?", new[] { "4", "5", "6", "7" }, 1, "2 + 3 = 5"),
                ("How many sides does a triangle have?", new[] { "2", "3", "4", "5" }, 1, "A triangle has 3 sides."),
                ("What comes after 7?", new[] { "6", "8", "9", "10" }, 1, "8 comes after 7 when counting."),
                ("Which number is greater: 5 or 3?", new[] { "3", "5", "They're equal", "Neither" }, 1, "5 is greater than 3."),
                ("What is 10 - 4?", new[] { "5", "6", "7", "8" }, 1, "10 - 4 = 6")
            };

            var (prompt, choices, correctIndex, explanation) = questions[order - 1];
            return CreateQuestion(lessonId, order, prompt, choices, correctIndex, explanation);
        }

        private LessonQuestion GenerateElementaryMath(int lessonId, int order, LessonDifficulty difficulty)
        {
            var questions = new[]
            {
                ("What is 6 × 7?", new[] { "40", "42", "45", "48" }, 1, "6 × 7 = 42"),
                ("What is 3/4 as a decimal?", new[] { "0.25", "0.5", "0.75", "1.0" }, 2, "3/4 = 0.75"),
                ("What is the area of a rectangle that is 5 units long and 3 units wide?", new[] { "8", "15", "16", "20" }, 1, "Area = length × width = 5 × 3 = 15"),
                ("What is 144 ÷ 12?", new[] { "10", "11", "12", "13" }, 2, "144 ÷ 12 = 12"),
                ("What is the perimeter of a square with sides of 4 units?", new[] { "8", "12", "16", "20" }, 2, "Perimeter = 4 × side = 4 × 4 = 16")
            };

            var (prompt, choices, correctIndex, explanation) = questions[order - 1];
            return CreateQuestion(lessonId, order, prompt, choices, correctIndex, explanation);
        }

        private LessonQuestion GenerateMiddleSchoolMath(int lessonId, int order, LessonDifficulty difficulty)
        {
            var questions = new[]
            {
                ("What is the value of x in the equation 2x + 5 = 13?", new[] { "3", "4", "5", "6" }, 1, "2x + 5 = 13, so 2x = 8, therefore x = 4"),
                ("What is the slope of the line y = 3x + 2?", new[] { "2", "3", "5", "6" }, 1, "In y = mx + b, m is the slope, so the slope is 3"),
                ("What is the square root of 64?", new[] { "6", "7", "8", "9" }, 2, "8 × 8 = 64, so √64 = 8"),
                ("What is the probability of rolling a 3 on a fair six-sided die?", new[] { "1/6", "1/3", "1/2", "2/3" }, 0, "There is 1 favorable outcome out of 6 possible outcomes"),
                ("What is the circumference of a circle with radius 7? (Use π ≈ 3.14)", new[] { "21.98", "43.96", "153.86", "307.72" }, 1, "C = 2πr = 2 × 3.14 × 7 = 43.96")
            };

            var (prompt, choices, correctIndex, explanation) = questions[order - 1];
            return CreateQuestion(lessonId, order, prompt, choices, correctIndex, explanation);
        }

        private LessonQuestion GenerateHighSchoolMath(int lessonId, int order, LessonDifficulty difficulty)
        {
            var questions = new[]
            {
                ("What is the derivative of x²?", new[] { "x", "2x", "x²", "2x²" }, 1, "The derivative of x² is 2x using the power rule"),
                ("What is the value of sin(30°)?", new[] { "0.5", "0.707", "0.866", "1.0" }, 0, "sin(30°) = 0.5"),
                ("What is the solution to the system: x + y = 5, x - y = 1?", new[] { "x=2, y=3", "x=3, y=2", "x=1, y=4", "x=4, y=1" }, 1, "Adding the equations: 2x = 6, so x = 3, then y = 2"),
                ("What is the limit of (x² - 4)/(x - 2) as x approaches 2?", new[] { "0", "2", "4", "undefined" }, 2, "Factor: (x-2)(x+2)/(x-2) = x+2, so limit = 2+2 = 4"),
                ("What is the standard deviation of the set {2, 4, 6, 8, 10}?", new[] { "2", "2.83", "4", "6" }, 1, "Mean = 6, variance = 8, standard deviation = √8 ≈ 2.83")
            };

            var (prompt, choices, correctIndex, explanation) = questions[order - 1];
            return CreateQuestion(lessonId, order, prompt, choices, correctIndex, explanation);
        }

        private string GetMathFocus(int gradeLevel, LessonDifficulty difficulty)
        {
            return gradeLevel switch
            {
                <= 2 => difficulty == LessonDifficulty.A ? "counting and basic addition" : "subtraction and number recognition",
                <= 5 => difficulty == LessonDifficulty.A ? "multiplication and division" : "fractions and decimals",
                <= 8 => difficulty == LessonDifficulty.A ? "algebra and geometry" : "statistics and probability",
                _ => difficulty == LessonDifficulty.A ? "calculus and advanced algebra" : "trigonometry and complex numbers"
            };
        }
    }

    public class ScienceGenerator : BaseSubjectGenerator
    {
        public override LessonContent GenerateLessonContent(Subject subject, Grade grade, LessonDifficulty difficulty)
        {
            var gradeLevel = GetGradeLevel(grade);
            var difficultyText = difficulty == LessonDifficulty.A ? "Basic" : "Intermediate";

            return new LessonContent
            {
                Title = $"{difficultyText} {subject.Name} - {grade.DisplayName}",
                Description = $"Explore {subject.Name} concepts appropriate for {grade.DisplayName} students. This lesson covers {GetScienceFocus(gradeLevel, difficulty)}."
            };
        }

        public override List<LessonQuestion> GenerateQuestions(Subject subject, Grade grade, LessonDifficulty difficulty, int lessonId)
        {
            var gradeLevel = GetGradeLevel(grade);
            var questions = new List<LessonQuestion>();

            for (int i = 1; i <= 5; i++)
            {
                var question = GenerateScienceQuestion(lessonId, i, gradeLevel, difficulty);
                questions.Add(question);
            }

            return questions;
        }

        private LessonQuestion GenerateScienceQuestion(int lessonId, int order, int gradeLevel, LessonDifficulty difficulty)
        {
            return gradeLevel switch
            {
                <= 2 => GenerateEarlyElementaryScience(lessonId, order, difficulty),
                <= 5 => GenerateElementaryScience(lessonId, order, difficulty),
                <= 8 => GenerateMiddleSchoolScience(lessonId, order, difficulty),
                _ => GenerateHighSchoolScience(lessonId, order, difficulty)
            };
        }

        private LessonQuestion GenerateEarlyElementaryScience(int lessonId, int order, LessonDifficulty difficulty)
        {
            var questions = new[]
            {
                ("What do plants need to grow?", new[] { "water only", "sunlight only", "water and sunlight", "nothing" }, 2, "Plants need both water and sunlight to grow."),
                ("What happens to water when it gets very cold?", new[] { "it disappears", "it turns to ice", "it gets hot", "it stays the same" }, 1, "Water turns to ice when it gets very cold."),
                ("What animal lives in the ocean?", new[] { "elephant", "fish", "lion", "bear" }, 1, "Fish live in the ocean."),
                ("What do we use to see things?", new[] { "ears", "eyes", "nose", "mouth" }, 1, "We use our eyes to see things."),
                ("What is the sun?", new[] { "a planet", "a star", "a moon", "a rock" }, 1, "The sun is a star.")
            };

            var (prompt, choices, correctIndex, explanation) = questions[order - 1];
            return CreateQuestion(lessonId, order, prompt, choices, correctIndex, explanation);
        }

        private LessonQuestion GenerateElementaryScience(int lessonId, int order, LessonDifficulty difficulty)
        {
            var questions = new[]
            {
                ("What is the process by which plants make their own food?", new[] { "respiration", "photosynthesis", "digestion", "circulation" }, 1, "Photosynthesis is how plants make food using sunlight."),
                ("What are the three states of matter?", new[] { "hot, cold, warm", "solid, liquid, gas", "big, medium, small", "red, blue, green" }, 1, "The three states of matter are solid, liquid, and gas."),
                ("What force pulls objects toward Earth?", new[] { "magnetism", "gravity", "friction", "electricity" }, 1, "Gravity pulls objects toward Earth."),
                ("What is the largest planet in our solar system?", new[] { "Earth", "Mars", "Jupiter", "Saturn" }, 2, "Jupiter is the largest planet in our solar system."),
                ("What do we call animals that eat only plants?", new[] { "carnivores", "herbivores", "omnivores", "predators" }, 1, "Herbivores are animals that eat only plants.")
            };

            var (prompt, choices, correctIndex, explanation) = questions[order - 1];
            return CreateQuestion(lessonId, order, prompt, choices, correctIndex, explanation);
        }

        private LessonQuestion GenerateMiddleSchoolScience(int lessonId, int order, LessonDifficulty difficulty)
        {
            var questions = new[]
            {
                ("What is the chemical symbol for water?", new[] { "H2O", "CO2", "NaCl", "O2" }, 0, "H2O is the chemical formula for water."),
                ("What type of energy does the sun provide?", new[] { "chemical", "solar", "nuclear", "electrical" }, 1, "The sun provides solar energy."),
                ("What is the smallest unit of matter?", new[] { "molecule", "atom", "cell", "particle" }, 1, "An atom is the smallest unit of matter."),
                ("What causes earthquakes?", new[] { "weather", "movement of tectonic plates", "ocean waves", "wind" }, 1, "Earthquakes are caused by movement of tectonic plates."),
                ("What is the process by which water vapor becomes liquid water?", new[] { "evaporation", "condensation", "precipitation", "transpiration" }, 1, "Condensation is when water vapor becomes liquid water.")
            };

            var (prompt, choices, correctIndex, explanation) = questions[order - 1];
            return CreateQuestion(lessonId, order, prompt, choices, correctIndex, explanation);
        }

        private LessonQuestion GenerateHighSchoolScience(int lessonId, int order, LessonDifficulty difficulty)
        {
            var questions = new[]
            {
                ("What is the speed of light in a vacuum?", new[] { "300,000 km/s", "3,000,000 km/s", "30,000 km/s", "300 km/s" }, 0, "The speed of light in a vacuum is approximately 300,000 km/s."),
                ("What is the pH of pure water?", new[] { "5", "6", "7", "8" }, 2, "Pure water has a pH of 7, which is neutral."),
                ("What is the first law of thermodynamics?", new[] { "Energy cannot be created or destroyed", "Heat flows from hot to cold", "Pressure increases with temperature", "Volume decreases with pressure" }, 0, "The first law states that energy cannot be created or destroyed."),
                ("What is the process by which DNA is copied?", new[] { "transcription", "translation", "replication", "mutation" }, 2, "DNA replication is the process by which DNA is copied."),
                ("What is the unit of electric current?", new[] { "volt", "ampere", "ohm", "watt" }, 1, "The ampere is the unit of electric current.")
            };

            var (prompt, choices, correctIndex, explanation) = questions[order - 1];
            return CreateQuestion(lessonId, order, prompt, choices, correctIndex, explanation);
        }

        private string GetScienceFocus(int gradeLevel, LessonDifficulty difficulty)
        {
            return gradeLevel switch
            {
                <= 2 => difficulty == LessonDifficulty.A ? "basic observations and simple concepts" : "cause and effect relationships",
                <= 5 => difficulty == LessonDifficulty.A ? "life cycles and basic physics" : "ecosystems and matter properties",
                <= 8 => difficulty == LessonDifficulty.A ? "chemical reactions and earth systems" : "genetics and energy transformations",
                _ => difficulty == LessonDifficulty.A ? "advanced chemistry and physics" : "molecular biology and quantum mechanics"
            };
        }
    }

    public class SocialStudiesGenerator : BaseSubjectGenerator
    {
        public override LessonContent GenerateLessonContent(Subject subject, Grade grade, LessonDifficulty difficulty)
        {
            var gradeLevel = GetGradeLevel(grade);
            var difficultyText = difficulty == LessonDifficulty.A ? "Basic" : "Intermediate";

            return new LessonContent
            {
                Title = $"{difficultyText} {subject.Name} - {grade.DisplayName}",
                Description = $"Learn about {subject.Name} concepts appropriate for {grade.DisplayName} students. This lesson explores {GetSocialStudiesFocus(gradeLevel, difficulty)}."
            };
        }

        public override List<LessonQuestion> GenerateQuestions(Subject subject, Grade grade, LessonDifficulty difficulty, int lessonId)
        {
            var gradeLevel = GetGradeLevel(grade);
            var questions = new List<LessonQuestion>();

            for (int i = 1; i <= 5; i++)
            {
                var question = GenerateSocialStudiesQuestion(lessonId, i, gradeLevel, difficulty);
                questions.Add(question);
            }

            return questions;
        }

        private LessonQuestion GenerateSocialStudiesQuestion(int lessonId, int order, int gradeLevel, LessonDifficulty difficulty)
        {
            return gradeLevel switch
            {
                <= 2 => GenerateEarlyElementarySocialStudies(lessonId, order, difficulty),
                <= 5 => GenerateElementarySocialStudies(lessonId, order, difficulty),
                <= 8 => GenerateMiddleSchoolSocialStudies(lessonId, order, difficulty),
                _ => GenerateHighSchoolSocialStudies(lessonId, order, difficulty)
            };
        }

        private LessonQuestion GenerateEarlyElementarySocialStudies(int lessonId, int order, LessonDifficulty difficulty)
        {
            var questions = new[]
            {
                ("What is the name of the country we live in?", new[] { "Canada", "Mexico", "United States", "Brazil" }, 2, "We live in the United States."),
                ("What do we call the person who leads our country?", new[] { "King", "President", "Mayor", "Teacher" }, 1, "The President leads our country."),
                ("What do we use money for?", new[] { "playing", "buying things", "sleeping", "eating" }, 1, "We use money to buy things we need and want."),
                ("What do we call the place where we live?", new[] { "school", "home", "store", "park" }, 1, "Home is where we live."),
                ("What do we call the people in our family?", new[] { "friends", "relatives", "strangers", "neighbors" }, 1, "The people in our family are called relatives.")
            };

            var (prompt, choices, correctIndex, explanation) = questions[order - 1];
            return CreateQuestion(lessonId, order, prompt, choices, correctIndex, explanation);
        }

        private LessonQuestion GenerateElementarySocialStudies(int lessonId, int order, LessonDifficulty difficulty)
        {
            var questions = new[]
            {
                ("What are the three branches of government?", new[] { "executive, legislative, judicial", "federal, state, local", "president, congress, courts", "democracy, republic, monarchy" }, 0, "The three branches are executive, legislative, and judicial."),
                ("What is the capital of the United States?", new[] { "New York", "Los Angeles", "Washington D.C.", "Chicago" }, 2, "Washington D.C. is the capital of the United States."),
                ("What do we call the first ten amendments to the Constitution?", new[] { "The Bill of Rights", "The Declaration of Independence", "The Articles of Confederation", "The Federalist Papers" }, 0, "The first ten amendments are called the Bill of Rights."),
                ("What is the largest ocean?", new[] { "Atlantic", "Pacific", "Indian", "Arctic" }, 1, "The Pacific Ocean is the largest ocean."),
                ("What do we call the study of the past?", new[] { "geography", "history", "science", "math" }, 1, "History is the study of the past.")
            };

            var (prompt, choices, correctIndex, explanation) = questions[order - 1];
            return CreateQuestion(lessonId, order, prompt, choices, correctIndex, explanation);
        }

        private LessonQuestion GenerateMiddleSchoolSocialStudies(int lessonId, int order, LessonDifficulty difficulty)
        {
            var questions = new[]
            {
                ("What was the main cause of World War I?", new[] { "economic depression", "alliance system and imperialism", "religious conflict", "technological advancement" }, 1, "The alliance system and imperialism were main causes of WWI."),
                ("What is the difference between a democracy and a dictatorship?", new[] { "democracy has more people", "democracy has elected leaders", "dictatorship is more efficient", "there is no difference" }, 1, "In a democracy, leaders are elected by the people."),
                ("What is the purpose of the United Nations?", new[] { "to promote world peace", "to control world trade", "to establish world government", "to regulate world population" }, 0, "The UN was created to promote international peace and cooperation."),
                ("What is the difference between a primary and secondary source?", new[] { "primary is older", "primary is firsthand", "secondary is more accurate", "there is no difference" }, 1, "Primary sources are firsthand accounts; secondary sources are interpretations."),
                ("What is the economic system where individuals own businesses?", new[] { "socialism", "communism", "capitalism", "feudalism" }, 2, "Capitalism is an economic system where individuals own businesses.")
            };

            var (prompt, choices, correctIndex, explanation) = questions[order - 1];
            return CreateQuestion(lessonId, order, prompt, choices, correctIndex, explanation);
        }

        private LessonQuestion GenerateHighSchoolSocialStudies(int lessonId, int order, LessonDifficulty difficulty)
        {
            var questions = new[]
            {
                ("What is the significance of the Magna Carta?", new[] { "it ended feudalism", "it established the rule of law", "it created democracy", "it started the Renaissance" }, 1, "The Magna Carta established the principle that everyone, including the king, is subject to the law."),
                ("What is the difference between fiscal and monetary policy?", new[] { "fiscal uses taxes, monetary uses interest rates", "fiscal is federal, monetary is state", "fiscal is short-term, monetary is long-term", "there is no difference" }, 0, "Fiscal policy uses government spending and taxes; monetary policy uses interest rates and money supply."),
                ("What was the main cause of the Cold War?", new[] { "economic competition", "ideological differences between capitalism and communism", "territorial disputes", "religious conflicts" }, 1, "The Cold War was primarily caused by ideological differences between capitalism and communism."),
                ("What is the concept of 'checks and balances'?", new[] { "each branch can limit the others", "all branches have equal power", "one branch controls all others", "branches work independently" }, 0, "Checks and balances allow each branch of government to limit the power of the others."),
                ("What is the difference between a market economy and a command economy?", new[] { "market has government control", "command has private ownership", "market has supply and demand", "there is no difference" }, 2, "In a market economy, prices are determined by supply and demand.")
            };

            var (prompt, choices, correctIndex, explanation) = questions[order - 1];
            return CreateQuestion(lessonId, order, prompt, choices, correctIndex, explanation);
        }

        private string GetSocialStudiesFocus(int gradeLevel, LessonDifficulty difficulty)
        {
            return gradeLevel switch
            {
                <= 2 => difficulty == LessonDifficulty.A ? "community helpers and basic geography" : "family structures and local government",
                <= 5 => difficulty == LessonDifficulty.A ? "American history and government" : "world geography and cultures",
                <= 8 => difficulty == LessonDifficulty.A ? "world history and economics" : "civics and global issues",
                _ => difficulty == LessonDifficulty.A ? "advanced political science and international relations" : "economic theory and social movements"
            };
        }
    }

    public class DefaultSubjectGenerator : BaseSubjectGenerator
    {
        public override LessonContent GenerateLessonContent(Subject subject, Grade grade, LessonDifficulty difficulty)
        {
            var difficultyText = difficulty == LessonDifficulty.A ? "Basic" : "Intermediate";
            return new LessonContent
            {
                Title = $"{difficultyText} {subject.Name} - {grade.DisplayName}",
                Description = $"Practice {subject.Name} skills appropriate for {grade.DisplayName} students."
            };
        }

        public override List<LessonQuestion> GenerateQuestions(Subject subject, Grade grade, LessonDifficulty difficulty, int lessonId)
        {
            var questions = new List<LessonQuestion>();
            
            for (int i = 1; i <= 5; i++)
            {
                var question = CreateQuestion(
                    lessonId, 
                    i, 
                    $"Sample question {i} for {subject.Name} - {grade.DisplayName}",
                    new[] { "Option A", "Option B", "Option C", "Option D" },
                    0,
                    "This is a sample explanation."
                );
                questions.Add(question);
            }

            return questions;
        }
    }
}
