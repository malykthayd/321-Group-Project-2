using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models.Curriculum;
using System.Text.Json;

namespace api.Controllers
{
    [ApiController]
    [Route("api/lesson-player")]
    public class LessonPlayerController : ControllerBase
    {
        private readonly AQEDbContext _context;

        public LessonPlayerController(AQEDbContext context)
        {
            _context = context;
        }

        [HttpGet("assignment/{assignmentId}")]
        public async Task<IActionResult> GetAssignmentDetails(int assignmentId)
        {
            try
            {
                var assignment = await _context.Assignments
                    .Include(a => a.GeneratedLesson)
                        .ThenInclude(gl => gl.Subject)
                    .Include(a => a.GeneratedLesson)
                        .ThenInclude(gl => gl.Grade)
                    .Include(a => a.GeneratedLesson)
                        .ThenInclude(gl => gl.Questions.OrderBy(q => q.Order))
                    .FirstOrDefaultAsync(a => a.Id == assignmentId);

                if (assignment == null)
                {
                    return NotFound(new { message = "Assignment not found" });
                }

                return Ok(assignment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching assignment details", error = ex.Message });
            }
        }

        [HttpPost("attempt")]
        public async Task<IActionResult> SubmitAttempt([FromBody] AttemptSubmissionRequest request)
        {
            try
            {
                // Validate assignment exists
                var assignment = await _context.Assignments
                    .Include(a => a.GeneratedLesson)
                        .ThenInclude(gl => gl.Questions.OrderBy(q => q.Order))
                    .FirstOrDefaultAsync(a => a.Id == request.AssignmentId);

                if (assignment == null)
                {
                    return NotFound(new { message = "Assignment not found" });
                }

                // Validate student access
                var student = await _context.Students
                    .Include(s => s.User)
                    .FirstOrDefaultAsync(s => s.Id == request.StudentId && s.User.Role == "student");

                if (student == null)
                {
                    return Unauthorized(new { message = "Student access required" });
                }

                // Check if attempt already exists
                var existingAttempt = await _context.Attempts
                    .FirstOrDefaultAsync(a => a.AssignmentId == request.AssignmentId && a.StudentId == request.StudentId);

                if (existingAttempt != null)
                {
                    return BadRequest(new { message = "Attempt already submitted for this assignment" });
                }

                // Grade the attempt
                var questions = assignment.GeneratedLesson.Questions.ToList();
                var correctAnswers = questions.Select(q => q.AnswerIndex).ToList();
                var studentAnswers = request.Answers;

                if (studentAnswers.Count != questions.Count)
                {
                    return BadRequest(new { message = "Number of answers does not match number of questions" });
                }

                int correctCount = 0;
                for (int i = 0; i < questions.Count; i++)
                {
                    if (studentAnswers[i] == correctAnswers[i])
                    {
                        correctCount++;
                    }
                }

                int wrongCount = questions.Count - correctCount;
                int scorePercent = (int)Math.Round((double)correctCount / questions.Count * 100);

                // Create attempt record
                var attempt = new Attempt
                {
                    AssignmentId = request.AssignmentId,
                    StudentId = request.StudentId,
                    StartedAt = request.StartedAt,
                    SubmittedAt = DateTime.UtcNow,
                    AnswersJson = JsonSerializer.Serialize(request.Answers),
                    ScorePercent = scorePercent,
                    WrongCount = wrongCount
                };

                _context.Attempts.Add(attempt);
                await _context.SaveChangesAsync();

                // Update analytics
                await UpdateAttemptAnalytics(request.StudentId, scorePercent, questions.Count);

                // Return results with correct answers for feedback
                var results = new
                {
                    attemptId = attempt.Id,
                    scorePercent = scorePercent,
                    correctCount = correctCount,
                    wrongCount = wrongCount,
                    totalQuestions = questions.Count,
                    questions = questions.Select((q, index) => new
                    {
                        order = q.Order,
                        prompt = q.Prompt,
                        correctAnswerIndex = q.AnswerIndex,
                        studentAnswerIndex = studentAnswers[index],
                        isCorrect = studentAnswers[index] == q.AnswerIndex,
                        explanation = q.Explanation
                    }).ToList()
                };

                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error submitting attempt", error = ex.Message });
            }
        }

        [HttpGet("student/{studentId}/attempts")]
        public async Task<IActionResult> GetStudentAttempts(int studentId)
        {
            try
            {
                var attempts = await _context.Attempts
                    .Include(a => a.Assignment)
                        .ThenInclude(ass => ass.GeneratedLesson)
                            .ThenInclude(gl => gl.Subject)
                    .Include(a => a.Assignment)
                        .ThenInclude(ass => ass.GeneratedLesson)
                            .ThenInclude(gl => gl.Grade)
                    .Where(a => a.StudentId == studentId)
                    .OrderByDescending(a => a.SubmittedAt)
                    .ToListAsync();

                return Ok(attempts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching student attempts", error = ex.Message });
            }
        }

        [HttpGet("student/{studentId}/analytics")]
        public async Task<IActionResult> GetStudentAnalytics(int studentId)
        {
            try
            {
                var analytics = await _context.AnalyticsRollups
                    .Where(a => a.Role == AnalyticsRole.Student && a.RoleId == studentId)
                    .OrderByDescending(a => a.LastUpdated)
                    .FirstOrDefaultAsync();

                if (analytics == null)
                {
                    // Return empty analytics if none exist
                    analytics = new AnalyticsRollup
                    {
                        Role = AnalyticsRole.Student,
                        RoleId = studentId,
                        TimeWindow = TimeWindow.AllTime,
                        AssignmentsCreated = 0,
                        AttemptsSubmitted = 0,
                        AverageScore = 0,
                        CompletionRate = 0
                    };
                }

                return Ok(analytics);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching student analytics", error = ex.Message });
            }
        }

        private async Task UpdateAttemptAnalytics(int studentId, int scorePercent, int totalQuestions)
        {
            var analytics = await _context.AnalyticsRollups
                .FirstOrDefaultAsync(a => a.Role == AnalyticsRole.Student && a.RoleId == studentId && a.TimeWindow == TimeWindow.AllTime);

            if (analytics == null)
            {
                analytics = new AnalyticsRollup
                {
                    Role = AnalyticsRole.Student,
                    RoleId = studentId,
                    TimeWindow = TimeWindow.AllTime,
                    LastUpdated = DateTime.UtcNow
                };
                _context.AnalyticsRollups.Add(analytics);
            }

            analytics.AttemptsSubmitted++;
            analytics.TotalScoreSum += scorePercent;
            analytics.TotalQuestionsAttempted += totalQuestions;
            analytics.LastUpdated = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }
    }

    public class AttemptSubmissionRequest
    {
        public int AssignmentId { get; set; }
        public int StudentId { get; set; }
        public DateTime StartedAt { get; set; }
        public List<int> Answers { get; set; } = new List<int>();
    }
}
