using System.Text.Json;

namespace api.Services
{
    public interface IAIProvider
    {
        Task<AIResponse> GenerateAsync(string prompt, Dictionary<string, object>? options = null);
        Task<AIResponse> GenerateLessonAsync(LessonGenerationRequest request);
    }

    public class OpenAIProvider : IAIProvider
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<OpenAIProvider> _logger;
        private readonly string _apiKey;
        private readonly string _model;

        public OpenAIProvider(HttpClient httpClient, ILogger<OpenAIProvider> logger, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _logger = logger;
            _apiKey = configuration["AI:OpenAI:ApiKey"] ?? "";
            _model = configuration["AI:OpenAI:Model"] ?? "gpt-4";
            
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_apiKey}");
        }

        public async Task<AIResponse> GenerateAsync(string prompt, Dictionary<string, object>? options = null)
        {
            try
            {
                var requestBody = new
                {
                    model = _model,
                    messages = new[]
                    {
                        new { role = "system", content = GetSystemPrompt() },
                        new { role = "user", content = prompt }
                    },
                    temperature = options?.GetValueOrDefault("temperature", 0.7) ?? 0.7,
                    max_tokens = options?.GetValueOrDefault("max_tokens", 2000) ?? 2000
                };

                var response = await _httpClient.PostAsJsonAsync("https://api.openai.com/v1/chat/completions", requestBody);
                var content = await response.Content.ReadAsStringAsync();
                var json = JsonDocument.Parse(content);

                return new AIResponse
                {
                    Success = true,
                    Content = json.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString() ?? "",
                    TokensUsed = json.RootElement.GetProperty("usage").GetProperty("total_tokens").GetInt32()
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "OpenAI API error");
                return new AIResponse { Success = false, Error = ex.Message };
            }
        }

        public async Task<AIResponse> GenerateLessonAsync(LessonGenerationRequest request)
        {
            var prompt = LessonPromptBuilder.BuildPrompt(request);
            return await GenerateAsync(prompt);
        }

        private string GetSystemPrompt()
        {
            return @"You are an expert K-8 curriculum designer and assessment writer. 
Produce age-appropriate, culturally neutral, standards-aligned lessons with measurable objectives.
Output valid JSON matching the lesson schema.
Include direct instruction, guided/independent practice, mastery check, misconceptions with corrective feedback, 
a mini-game config, vocabulary, and SMS/USSD micro-lesson exports.
Respect difficulty: Easy (scaffolded), Intermediate (grade-level), Hard (multi-step).
Keep language clear; add alt-text. Write original content.";
        }
    }

    public class MockAIProvider : IAIProvider
    {
        public Task<AIResponse> GenerateAsync(string prompt, Dictionary<string, object>? options = null)
        {
            return Task.FromResult(new AIResponse
            {
                Success = true,
                Content = GenerateMockLesson(prompt),
                TokensUsed = 1500
            });
        }

        public Task<AIResponse> GenerateLessonAsync(LessonGenerationRequest request)
        {
            var mockContent = GenerateMockLessonJson(request);
            return Task.FromResult(new AIResponse
            {
                Success = true,
                Content = mockContent,
                TokensUsed = 1800
            });
        }

        private string GenerateMockLesson(string prompt)
        {
            return "{\"lesson\":{\"title\":\"AI Generated Lesson\"}}";
        }

        private string GenerateMockLessonJson(LessonGenerationRequest request)
        {
            var lessonId = Guid.NewGuid().ToString();
            return System.Text.Json.JsonSerializer.Serialize(new
            {
                lesson = new
                {
                    grade_band = request.Grade,
                    subject_code = request.Subject.ToUpper(),
                    difficulty = request.Difficulty,
                    title = $"{request.Subject} - {request.Topic}",
                    objective = $"Students will understand {request.Topic} at {request.Grade} level",
                    time_minutes = 20,
                    adaptive_enabled = true,
                    language_default = "en"
                },
                sections = new
                {
                    prior = new { question = "What do you know about this topic?", timeLimit = 2 },
                    direct = new { content = $"Let's explore {request.Topic} in depth.", duration = 5 },
                    guided = new[] { new { q = "Practice question 1", type = "mcq" } },
                    independent = new[] { new { type = "exercise", description = "Apply your learning" } },
                    mastery = new[] { new { q = "Mastery check question", type = "mcq" } }
                },
                mini_game = new { game_type = "timed", config = new { timeLimit = 60 } },
                gamification = new { badges = new[] { "LEARNING_BEGINNER", "QUIZ_PRO" }, xpRules = new { guided = 5, independent = 10 } },
                sms = new { prep = new[] { "Welcome!" }, items = new[] { "Question 1" }, closing = "Great job!" },
                ussd = new { read = new[] { "Introduction" }, quiz = new[] { "Quiz question" }, closing = "Well done!" },
                metadata = new { vocab_keys = new[] { "concept", "understand" } }
            });
        }
    }

    public class AIResponse
    {
        public bool Success { get; set; }
        public string Content { get; set; } = string.Empty;
        public int TokensUsed { get; set; }
        public string Error { get; set; } = string.Empty;
    }

    public class LessonGenerationRequest
    {
        public string Grade { get; set; } = "";
        public string Subject { get; set; } = "";
        public string Difficulty { get; set; } = "";
        public string Topic { get; set; } = "";
        public string Language { get; set; } = "en";
        public List<string>? AdditionalLanguages { get; set; }
    }

    public static class LessonPromptBuilder
    {
        public static string BuildPrompt(LessonGenerationRequest request)
        {
            return $@"
Generate a complete, gamified K-8 lesson with the following specifications:

Grade: {request.Grade}
Subject: {request.Subject}
Difficulty: {request.Difficulty}
Topic: {request.Topic}

Requirements:
1. Objective - measurable learning target
2. Prior Knowledge Activation - warm-up question
3. Direct Instruction - 3-5 steps with visual descriptions
4. Guided Practice - 3-6 items with hints and explanations
5. Independent Practice - 6-10 exercises
6. Mastery Check - 2-3 assessment questions
7. Challenge Extension - optional advanced task
8. Mini-Game - interactive element (timed/match/memory/dragdrop)
9. Misconceptions - 2-4 common errors with corrective feedback
10. Vocabulary - 3-6 key terms with definitions
11. Parent/Home Connection - K-5 optional activity
12. Gamification - badges and XP rules
13. SMS Micro-lesson - condensed format
14. USSD Micro-lesson - menu navigation format

Output valid JSON matching the lesson schema.
Ensure all content is age-appropriate, culturally neutral, and pedagogically sound.
";
        }
    }
}

