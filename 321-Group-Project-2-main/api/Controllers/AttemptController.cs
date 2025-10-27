using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models.Curriculum;
using api.Models;
using System.Text.Json;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttemptController : ControllerBase
    {
        private readonly AQEDbContext _context;

        public AttemptController(AQEDbContext context)
        {
            _context = context;
        }

        [HttpPost("start")]
        public async Task<IActionResult> StartAttempt([FromBody] StartAttemptRequest request)
        {
            try
            {
                // Validate assignment exists and student has access
                var assignment = await _context.Assignments
                    .Include(a => a.GeneratedLesson)
                        .ThenInclude(l => l.Questions)
                    .FirstOrDefaultAsync(a => a.Id == request.AssignmentId &&
                                             a.AssigneeType == AssigneeType.Student &&
                                             a.AssigneeId == request.StudentId);

                if (assignment == null)
                {
                    return BadRequest(new { message = "Assignment not found or access denied" });
                }

                // Check if there's already an active attempt
                var existingAttempt = await _context.Attempts
                    .FirstOrDefaultAsync(at => at.AssignmentId == request.AssignmentId &&
                                              at.StudentId == request.StudentId &&
                                              !at.SubmittedAt.HasValue);

                if (existingAttempt != null)
                {
                    return Ok(new
                    {
                        attemptId = existingAttempt.Id,
                        lessonId = assignment.GeneratedLessonId,
                        lessonTitle = assignment.GeneratedLesson.Title,
                        questionsCount = assignment.GeneratedLesson.Questions.Count,
                        startedAt = existingAttempt.StartedAt,
                        message = "Resuming existing attempt"
                    });
                }

                // Create new attempt
                var attempt = new Attempt
                {
                    AssignmentId = request.AssignmentId,
                    StudentId = request.StudentId,
                    StartedAt = DateTime.UtcNow,
                    AnswersJson = JsonSerializer.Serialize(new int[5]), // Initialize with empty answers
                    ScorePercent = 0,
                    WrongCount = 0,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Attempts.Add(attempt);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    attemptId = attempt.Id,
                    lessonId = assignment.GeneratedLessonId,
                    lessonTitle = assignment.GeneratedLesson.Title,
                    questionsCount = assignment.GeneratedLesson.Questions.Count,
                    startedAt = attempt.StartedAt,
                    message = "Attempt started successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error starting attempt", error = ex.Message });
            }
        }

        [HttpPost("submit")]
        public async Task<IActionResult> SubmitAttempt([FromBody] SubmitAttemptRequest request)
        {
            try
            {
                var attempt = await _context.Attempts
                    .Include(at => at.Assignment)
                        .ThenInclude(a => a.GeneratedLesson)
                            .ThenInclude(l => l.Questions)
                    .FirstOrDefaultAsync(at => at.Id == request.AttemptId &&
                                              at.StudentId == request.StudentId &&
                                              !at.SubmittedAt.HasValue);

                if (attempt == null)
                {
                    return BadRequest(new { message = "Attempt not found or already submitted" });
                }

                // Validate answers array length
                if (request.Answers.Length != 5)
                {
                    return BadRequest(new { message = "Must provide exactly 5 answers" });
                }

                // Grade the attempt
                var gradingResult = GradeAttempt(attempt.Assignment.GeneratedLesson.Questions.OrderBy(q => q.Order).ToList(), request.Answers);

                // Update attempt
                attempt.AnswersJson = JsonSerializer.Serialize(request.Answers);
                attempt.ScorePercent = gradingResult.ScorePercent;
                attempt.WrongCount = gradingResult.WrongCount;
                attempt.SubmittedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                // Update analytics
                await UpdateAttemptAnalytics(attempt);

                return Ok(new
                {
                    attemptId = attempt.Id,
                    scorePercent = attempt.ScorePercent,
                    wrongCount = attempt.WrongCount,
                    correctCount = 5 - attempt.WrongCount,
                    submittedAt = attempt.SubmittedAt,
                    questions = attempt.Assignment.GeneratedLesson.Questions
                        .OrderBy(q => q.Order)
                        .Select((q, index) => new
                        {
                            order = q.Order,
                            prompt = q.Prompt,
                            choices = JsonSerializer.Deserialize<string[]>(q.ChoicesJson),
                            correctAnswer = q.AnswerIndex,
                            studentAnswer = request.Answers[index],
                            isCorrect = request.Answers[index] == q.AnswerIndex,
                            explanation = q.Explanation
                        })
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error submitting attempt", error = ex.Message });
            }
        }

        [HttpGet("{attemptId}")]
        public async Task<IActionResult> GetAttempt(int attemptId)
        {
            try
            {
                var attempt = await _context.Attempts
                    .Include(at => at.Assignment)
                        .ThenInclude(a => a.GeneratedLesson)
                            .ThenInclude(l => l.Questions)
                    .Include(at => at.Student)
                    .FirstOrDefaultAsync(at => at.Id == attemptId);

                if (attempt == null)
                {
                    return NotFound(new { message = "Attempt not found" });
                }

                var answers = JsonSerializer.Deserialize<int[]>(attempt.AnswersJson) ?? new int[5];

                return Ok(new
                {
                    id = attempt.Id,
                    assignmentId = attempt.AssignmentId,
                    studentId = attempt.StudentId,
                    studentName = attempt.Student.User.Name,
                    lessonTitle = attempt.Assignment.GeneratedLesson.Title,
                    startedAt = attempt.StartedAt,
                    submittedAt = attempt.SubmittedAt,
                    scorePercent = attempt.ScorePercent,
                    wrongCount = attempt.WrongCount,
                    correctCount = 5 - attempt.WrongCount,
                    answers = answers,
                    questions = attempt.Assignment.GeneratedLesson.Questions
                        .OrderBy(q => q.Order)
                        .Select((q, index) => new
                        {
                            order = q.Order,
                            prompt = q.Prompt,
                            choices = JsonSerializer.Deserialize<string[]>(q.ChoicesJson),
                            correctAnswer = q.AnswerIndex,
                            studentAnswer = index < answers.Length ? answers[index] : -1,
                            isCorrect = index < answers.Length && answers[index] == q.AnswerIndex,
                            explanation = q.Explanation
                        })
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching attempt", error = ex.Message });
            }
        }

        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetStudentAttempts(int studentId)
        {
            try
            {
                var attempts = await _context.Attempts
                    .Include(at => at.Assignment)
                        .ThenInclude(a => a.GeneratedLesson)
                            .ThenInclude(l => l.Subject)
                    .Include(at => at.Assignment)
                        .ThenInclude(a => a.GeneratedLesson)
                            .ThenInclude(l => l.Grade)
                    .Where(at => at.StudentId == studentId)
                    .OrderByDescending(at => at.StartedAt)
                    .ToListAsync();

                var result = attempts.Select(at => new
                {
                    id = at.Id,
                    assignmentId = at.AssignmentId,
                    lessonTitle = at.Assignment.GeneratedLesson.Title,
                    subject = at.Assignment.GeneratedLesson.Subject.Name,
                    grade = at.Assignment.GeneratedLesson.Grade.DisplayName,
                    difficulty = at.Assignment.GeneratedLesson.DifficultyTag.ToString(),
                    startedAt = at.StartedAt,
                    submittedAt = at.SubmittedAt,
                    scorePercent = at.ScorePercent,
                    wrongCount = at.WrongCount,
                    correctCount = 5 - at.WrongCount,
                    status = at.SubmittedAt.HasValue ? "Completed" : "In Progress"
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching student attempts", error = ex.Message });
            }
        }

        [HttpDelete("{attemptId}")]
        public async Task<IActionResult> DeleteAttempt(int attemptId)
        {
            try
            {
                var attempt = await _context.Attempts
                    .FirstOrDefaultAsync(at => at.Id == attemptId);

                if (attempt == null)
                {
                    return NotFound(new { message = "Attempt not found" });
                }

                _context.Attempts.Remove(attempt);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Attempt deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting attempt", error = ex.Message });
            }
        }

        private GradingResult GradeAttempt(List<LessonQuestion> questions, int[] studentAnswers)
        {
            int correctCount = 0;
            int wrongCount = 0;

            for (int i = 0; i < Math.Min(questions.Count, studentAnswers.Length); i++)
            {
                if (studentAnswers[i] == questions[i].AnswerIndex)
                {
                    correctCount++;
                }
                else
                {
                    wrongCount++;
                }
            }

            var scorePercent = questions.Count > 0 ? (decimal)correctCount / questions.Count * 100 : 0;

            return new GradingResult
            {
                CorrectCount = correctCount,
                WrongCount = wrongCount,
                ScorePercent = Math.Round(scorePercent, 2)
            };
        }

        private async Task UpdateAttemptAnalytics(Attempt attempt)
        {
            try
            {
                // Update student analytics
                await UpdateStudentAnalytics(attempt.StudentId, attempt.ScorePercent);

                // Update teacher/parent analytics if applicable
                var assignment = await _context.Assignments
                    .FirstOrDefaultAsync(a => a.Id == attempt.AssignmentId);

                if (assignment != null)
                {
                    var analyticsRole = assignment.AssignedByRole == AssignedByRole.Teacher 
                        ? AnalyticsRole.Teacher 
                        : AnalyticsRole.Parent;

                    await UpdateRoleAnalytics(analyticsRole, assignment.AssignedById, attempt.ScorePercent);
                }

                // Update admin analytics
                await UpdateAdminAnalytics();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating attempt analytics: {ex.Message}");
            }
        }

        private async Task UpdateStudentAnalytics(int studentId, decimal scorePercent)
        {
            var today = DateTime.UtcNow.Date;

            var rollup = await _context.AnalyticsRollups
                .FirstOrDefaultAsync(ar => ar.Role == AnalyticsRole.Student &&
                                         ar.RoleId == studentId &&
                                         ar.TimeWindow == TimeWindow.Daily &&
                                         ar.WindowStart.Date == today);

            if (rollup == null)
            {
                rollup = new AnalyticsRollup
                {
                    Role = AnalyticsRole.Student,
                    RoleId = studentId,
                    TimeWindow = TimeWindow.Daily,
                    WindowStart = today,
                    WindowEnd = today.AddDays(1).AddTicks(-1),
                    CreatedAt = DateTime.UtcNow,
                    LastUpdated = DateTime.UtcNow
                };
                _context.AnalyticsRollups.Add(rollup);
            }

            rollup.AttemptsSubmitted++;
            rollup.TotalScoreSum += scorePercent;
            rollup.TotalQuestionsAttempted += 5;
            rollup.AverageScore = rollup.TotalQuestionsAttempted > 0 
                ? rollup.TotalScoreSum / (rollup.TotalQuestionsAttempted / 5) 
                : 0;
            rollup.CompletionRate = rollup.AttemptsSubmitted > 0 ? 100 : 0; // Simplified for now
            rollup.LastUpdated = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

        private async Task UpdateRoleAnalytics(AnalyticsRole role, int userId, decimal scorePercent)
        {
            var today = DateTime.UtcNow.Date;

            var rollup = await _context.AnalyticsRollups
                .FirstOrDefaultAsync(ar => ar.Role == role &&
                                         ar.RoleId == userId &&
                                         ar.TimeWindow == TimeWindow.Daily &&
                                         ar.WindowStart.Date == today);

            if (rollup == null)
            {
                rollup = new AnalyticsRollup
                {
                    Role = role,
                    RoleId = userId,
                    TimeWindow = TimeWindow.Daily,
                    WindowStart = today,
                    WindowEnd = today.AddDays(1).AddTicks(-1),
                    CreatedAt = DateTime.UtcNow,
                    LastUpdated = DateTime.UtcNow
                };
                _context.AnalyticsRollups.Add(rollup);
            }

            rollup.AttemptsSubmitted++;
            rollup.TotalScoreSum += scorePercent;
            rollup.TotalQuestionsAttempted += 5;
            rollup.AverageScore = rollup.TotalQuestionsAttempted > 0 
                ? rollup.TotalScoreSum / (rollup.TotalQuestionsAttempted / 5) 
                : 0;
            rollup.LastUpdated = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }

        private async Task UpdateAdminAnalytics()
        {
            var today = DateTime.UtcNow.Date;

            var rollup = await _context.AnalyticsRollups
                .FirstOrDefaultAsync(ar => ar.Role == AnalyticsRole.Admin &&
                                         ar.RoleId == null &&
                                         ar.TimeWindow == TimeWindow.Daily &&
                                         ar.WindowStart.Date == today);

            if (rollup == null)
            {
                rollup = new AnalyticsRollup
                {
                    Role = AnalyticsRole.Admin,
                    RoleId = null,
                    TimeWindow = TimeWindow.Daily,
                    WindowStart = today,
                    WindowEnd = today.AddDays(1).AddTicks(-1),
                    CreatedAt = DateTime.UtcNow,
                    LastUpdated = DateTime.UtcNow
                };
                _context.AnalyticsRollups.Add(rollup);
            }

            rollup.AttemptsSubmitted++;
            rollup.LastUpdated = DateTime.UtcNow;

            await _context.SaveChangesAsync();
        }
    }

    public class StartAttemptRequest
    {
        public int AssignmentId { get; set; }
        public int StudentId { get; set; }
    }

    public class SubmitAttemptRequest
    {
        public int AttemptId { get; set; }
        public int StudentId { get; set; }
        public int[] Answers { get; set; } = new int[5];
    }

    public class GradingResult
    {
        public int CorrectCount { get; set; }
        public int WrongCount { get; set; }
        public decimal ScorePercent { get; set; }
    }
}
