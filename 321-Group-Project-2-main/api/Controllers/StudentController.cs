using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StudentController : ControllerBase
    {
        private readonly AQEDbContext _context;

        public StudentController(AQEDbContext context)
        {
            _context = context;
        }

        [HttpGet("{studentId}/dashboard")]
        public async Task<IActionResult> GetDashboard(int studentId)
        {
            try
            {
                var student = await _context.Students
                    .Include(s => s.User)
                    .FirstOrDefaultAsync(s => s.Id == studentId);

                if (student == null)
                {
                    return NotFound(new { message = "Student not found" });
                }

                var dashboard = new
                {
                    totalLessonsCompleted = await _context.StudentLessons
                        .Where(sl => sl.StudentId == studentId && sl.CompletedAt != null)
                        .CountAsync(),
                    totalPracticeMaterialsCompleted = await _context.StudentPracticeMaterials
                        .Where(spm => spm.StudentId == studentId && spm.CompletedAt != null)
                        .CountAsync(),
                    averageScore = await _context.StudentLessons
                        .Where(sl => sl.StudentId == studentId && sl.CompletedAt != null && sl.Score != null)
                        .AverageAsync(sl => sl.Score) ?? 0,
                    totalAssignedLessons = await _context.DigitalLibraryAssignments
                        .Where(dla => dla.StudentId == studentId)
                        .CountAsync(),
                    totalCheckedOutLessons = await _context.StudentLessons
                        .Where(sl => sl.StudentId == studentId)
                        .CountAsync(),
                    recentActivity = await GetRecentActivity(studentId)
                };

                return Ok(dashboard);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching dashboard data", error = ex.Message });
            }
        }

        [HttpGet("{studentId}/digital-library")]
        public async Task<IActionResult> GetDigitalLibrary(int studentId)
        {
            try
            {
                var student = await _context.Students
                    .Include(s => s.User)
                    .FirstOrDefaultAsync(s => s.Id == studentId);

                if (student == null)
                {
                    return NotFound(new { message = "Student not found" });
                }

                // Get assigned lessons (not yet checked out)
                var assignedLessons = await _context.DigitalLibraryAssignments
                    .Include(dla => dla.DigitalLibrary)
                        .ThenInclude(dl => dl.Admin)
                            .ThenInclude(a => a.User)
                    .Where(dla => dla.StudentId == studentId)
                    .Select(dla => new
                    {
                        id = dla.DigitalLibrary.Id,
                        title = dla.DigitalLibrary.Title,
                        description = dla.DigitalLibrary.Description,
                        subject = dla.DigitalLibrary.Subject,
                        gradeLevel = dla.DigitalLibrary.GradeLevel,
                        assignedBy = dla.TeacherId.HasValue ? "Teacher" : "Parent",
                        assignedAt = dla.AssignedAt,
                        notes = dla.Notes,
                        canCheckOut = !_context.StudentLessons.Any(sl => sl.StudentId == studentId && sl.LessonId == dla.DigitalLibrary.Id)
                    })
                    .OrderBy(l => l.subject)
                    .ThenBy(l => l.title)
                    .ToListAsync();

                return Ok(assignedLessons);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching digital library", error = ex.Message });
            }
        }

        [HttpGet("{studentId}/my-work")]
        public async Task<IActionResult> GetMyWork(int studentId)
        {
            try
            {
                var checkedOutLessons = await _context.StudentLessons
                    .Include(sl => sl.Lesson)
                    .Where(sl => sl.StudentId == studentId)
                    .Select(sl => new
                    {
                        id = sl.Id,
                        lessonId = sl.Lesson.Id,
                        title = sl.Lesson.Title,
                        subject = sl.Lesson.Subject,
                        checkedOutAt = sl.CheckedOutAt,
                        startedAt = sl.StartedAt,
                        completedAt = sl.CompletedAt,
                        score = sl.Score,
                        totalQuestions = sl.TotalQuestions,
                        correctAnswers = sl.CorrectAnswers,
                        studentNotes = sl.StudentNotes,
                        status = sl.CompletedAt != null ? "completed" : sl.StartedAt != null ? "in_progress" : "not_started"
                    })
                    .OrderByDescending(sl => sl.checkedOutAt)
                    .ToListAsync();

                return Ok(checkedOutLessons);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching my work", error = ex.Message });
            }
        }

        [HttpGet("{studentId}/practice-materials")]
        public async Task<IActionResult> GetPracticeMaterials(int studentId)
        {
            try
            {
                var student = await _context.Students
                    .Include(s => s.User)
                    .FirstOrDefaultAsync(s => s.Id == studentId);

                if (student == null)
                {
                    return NotFound(new { message = "Student not found" });
                }

                // Only show practice materials for students who are part of a teacher's class
                if (student.IsIndependent)
                {
                    return Ok(new List<object>()); // Independent students don't have practice materials
                }

                var practiceMaterials = await _context.StudentPracticeMaterials
                    .Include(spm => spm.PracticeMaterial)
                        .ThenInclude(pm => pm.Teacher)
                            .ThenInclude(t => t.User)
                    .Where(spm => spm.StudentId == studentId)
                    .Select(spm => new
                    {
                        id = spm.Id,
                        materialId = spm.PracticeMaterial.Id,
                        title = spm.PracticeMaterial.Title,
                        description = spm.PracticeMaterial.Description,
                        subject = spm.PracticeMaterial.Subject,
                        assignedAt = spm.AssignedAt,
                        startedAt = spm.StartedAt,
                        completedAt = spm.CompletedAt,
                        score = spm.Score,
                        totalQuestions = spm.TotalQuestions,
                        notes = spm.Notes,
                        status = spm.CompletedAt != null ? "completed" : spm.StartedAt != null ? "in_progress" : "not_started"
                    })
                    .OrderByDescending(spm => spm.assignedAt)
                    .ToListAsync();

                return Ok(practiceMaterials);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching practice materials", error = ex.Message });
            }
        }

        [HttpPost("{studentId}/checkout-lesson")]
        public async Task<IActionResult> CheckoutLesson(int studentId, [FromBody] CheckoutLessonRequest request)
        {
            try
            {
                // Check if student exists
                var student = await _context.Students
                    .FirstOrDefaultAsync(s => s.Id == studentId);

                if (student == null)
                {
                    return NotFound(new { message = "Student not found" });
                }

                // Check if lesson is assigned to this student
                var assignment = await _context.DigitalLibraryAssignments
                    .FirstOrDefaultAsync(dla => dla.StudentId == studentId && dla.DigitalLibraryId == request.LessonId);

                if (assignment == null)
                {
                    return BadRequest(new { message = "This lesson is not assigned to you" });
                }

                // Check if already checked out
                var existingCheckout = await _context.StudentLessons
                    .FirstOrDefaultAsync(sl => sl.StudentId == studentId && sl.LessonId == request.LessonId);

                if (existingCheckout != null)
                {
                    return BadRequest(new { message = "You have already checked out this lesson" });
                }

                // Get the lesson details
                var lesson = await _context.Lessons
                    .FirstOrDefaultAsync(l => l.Id == request.LessonId);

                if (lesson == null)
                {
                    return BadRequest(new { message = "Lesson not found" });
                }

                // Create checkout record
                var checkout = new StudentLesson
                {
                    StudentId = studentId,
                    LessonId = request.LessonId,
                    CheckedOutAt = DateTime.UtcNow,
                    TotalQuestions = 10 // Default, could be calculated from lesson content
                };

                _context.StudentLessons.Add(checkout);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Lesson checked out successfully", checkoutId = checkout.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while checking out lesson", error = ex.Message });
            }
        }

        [HttpPost("{studentId}/start-lesson")]
        public async Task<IActionResult> StartLesson(int studentId, [FromBody] StartLessonRequest request)
        {
            try
            {
                var studentLesson = await _context.StudentLessons
                    .FirstOrDefaultAsync(sl => sl.Id == request.CheckoutId && sl.StudentId == studentId);

                if (studentLesson == null)
                {
                    return NotFound(new { message = "Checked out lesson not found" });
                }

                if (studentLesson.StartedAt != null)
                {
                    return BadRequest(new { message = "Lesson already started" });
                }

                studentLesson.StartedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Lesson started successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while starting lesson", error = ex.Message });
            }
        }

        [HttpPost("{studentId}/complete-lesson")]
        public async Task<IActionResult> CompleteLesson(int studentId, [FromBody] CompleteLessonRequest request)
        {
            try
            {
                var studentLesson = await _context.StudentLessons
                    .FirstOrDefaultAsync(sl => sl.Id == request.CheckoutId && sl.StudentId == studentId);

                if (studentLesson == null)
                {
                    return NotFound(new { message = "Checked out lesson not found" });
                }

                if (studentLesson.CompletedAt != null)
                {
                    return BadRequest(new { message = "Lesson already completed" });
                }

                studentLesson.CompletedAt = DateTime.UtcNow;
                studentLesson.Score = request.Score;
                studentLesson.CorrectAnswers = request.CorrectAnswers;
                studentLesson.StudentNotes = request.Notes;

                if (studentLesson.StartedAt == null)
                {
                    studentLesson.StartedAt = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Lesson completed successfully", score = request.Score });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while completing lesson", error = ex.Message });
            }
        }

        private async Task<List<object>> GetRecentActivity(int studentId)
        {
            var activities = new List<object>();

            // Get recent lesson completions
            var lessonActivities = await _context.StudentLessons
                .Include(sl => sl.Lesson)
                .Where(sl => sl.StudentId == studentId && sl.CompletedAt != null)
                .OrderByDescending(sl => sl.CompletedAt)
                .Take(5)
                .Select(sl => new
                {
                    type = "lesson_completed",
                    title = sl.Lesson.Title,
                    score = sl.Score,
                    completedAt = sl.CompletedAt
                })
                .ToListAsync();

            activities.AddRange(lessonActivities.Cast<object>());

            // Get recent practice material completions
            var practiceActivities = await _context.StudentPracticeMaterials
                .Include(spm => spm.PracticeMaterial)
                .Where(spm => spm.StudentId == studentId && spm.CompletedAt != null)
                .OrderByDescending(spm => spm.CompletedAt)
                .Take(5)
                .Select(spm => new
                {
                    type = "practice_completed",
                    title = spm.PracticeMaterial.Title,
                    score = spm.Score,
                    completedAt = spm.CompletedAt
                })
                .ToListAsync();

            activities.AddRange(practiceActivities.Cast<object>());

            return activities.OrderByDescending(a => ((dynamic)a).completedAt).Take(5).ToList();
        }
    }

    public class CheckoutLessonRequest
    {
        public int LessonId { get; set; }
    }

    public class StartLessonRequest
    {
        public int CheckoutId { get; set; }
    }

    public class CompleteLessonRequest
    {
        public int CheckoutId { get; set; }
        public int Score { get; set; }
        public int CorrectAnswers { get; set; }
        public string? Notes { get; set; }
    }
}
