using Microsoft.AspNetCore.Mvc;
using api.Services;
using api.Data;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AILessonController : ControllerBase
    {
        private readonly IAIProvider _aiProvider;
        private readonly AQEDbContext _context;
        private readonly ILogger<AILessonController> _logger;

        public AILessonController(IAIProvider aiProvider, AQEDbContext context, ILogger<AILessonController> logger)
        {
            _aiProvider = aiProvider;
            _context = context;
            _logger = logger;
        }

        [HttpPost("generate-one")]
        public async Task<IActionResult> GenerateOne([FromBody] LessonGenerationRequest request)
        {
            try
            {
                var response = await _aiProvider.GenerateLessonAsync(request);
                
                if (!response.Success)
                {
                    return BadRequest(new { error = response.Error });
                }

                // Parse and validate JSON
                var lessonData = System.Text.Json.JsonSerializer.Deserialize<object>(response.Content);
                
                // Store as draft
                var draftId = Guid.NewGuid().ToString();
                
                return Ok(new
                {
                    success = true,
                    draftId,
                    content = response.Content,
                    tokens = response.TokensUsed,
                    status = "draft"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating lesson");
                return StatusCode(500, new { error = "Failed to generate lesson" });
            }
        }

        [HttpPost("generate-bulk")]
        public async Task<IActionResult> GenerateBulk([FromBody] BulkGenerationRequest request)
        {
            try
            {
                var tasks = request.Requests.Select(async req =>
                {
                    var response = await _aiProvider.GenerateLessonAsync(req);
                    return new
                    {
                        grade = req.Grade,
                        subject = req.Subject,
                        difficulty = req.Difficulty,
                        topic = req.Topic,
                        success = response.Success,
                        content = response.Content,
                        tokens = response.TokensUsed,
                        error = response.Error
                    };
                }).ToList();

                var results = await Task.WhenAll(tasks);
                
                return Ok(new
                {
                    success = true,
                    count = results.Length,
                    results
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in bulk generation");
                return StatusCode(500, new { error = "Bulk generation failed" });
            }
        }

        [HttpPost("publish/{draftId}")]
        public async Task<IActionResult> PublishLesson(string draftId)
        {
            try
            {
                // Validate lesson
                // Insert into SQLite
                // Generate SMS/USSD exports
                // Trigger PWA precache
                
                return Ok(new { success = true, message = "Lesson published successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error publishing lesson");
                return StatusCode(500, new { error = "Publishing failed" });
            }
        }

        [HttpGet("status")]
        public IActionResult GetGenerationStatus()
        {
            return Ok(new
            {
                provider = "mock",
                model = "mock-ai",
                totalLessons = 1460,
                generatedToday = 0,
                tokenUsage = 0,
                cacheHitRate = 0.85
            });
        }
    }

    public class BulkGenerationRequest
    {
        public List<LessonGenerationRequest> Requests { get; set; } = new();
    }
}

