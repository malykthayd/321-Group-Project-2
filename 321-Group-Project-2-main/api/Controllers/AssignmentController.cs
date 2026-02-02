using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models.Curriculum;
using api.Models;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssignmentController : ControllerBase
    {
        private readonly AQEDbContext _context;

        public AssignmentController(AQEDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateAssignment([FromBody] CreateAssignmentRequest request)
        {
            try
            {
                // Validate the lesson exists and is published
                var lesson = await _context.GeneratedLessons
                    .Include(l => l.Subject)
                    .Include(l => l.Grade)
                    .FirstOrDefaultAsync(l => l.Id == request.LessonId && l.Status == LessonStatus.Published);

                if (lesson == null)
                {
                    return BadRequest(new { message = "Lesson not found or not published" });
                }

                // Validate the assigner has access to the lesson
                var hasAccess = await ValidateLessonAccess(request.AssignedById, request.AssignedByRole, lesson.Id);
                if (!hasAccess)
                {
                    return Unauthorized(new { message = "You don't have access to this lesson" });
                }

                // Validate assignees exist
                var assigneeIds = await ValidateAssignees(request.AssigneeType, request.AssigneeIds);
                if (!assigneeIds.Any())
                {
                    return BadRequest(new { message = "No valid assignees found" });
                }

                var assignments = new List<Assignment>();

                foreach (var assigneeId in assigneeIds)
                {
                    // Check if assignment already exists
                    var existingAssignment = await _context.Assignments
                        .FirstOrDefaultAsync(a => a.GeneratedLessonId == request.LessonId &&
                                                 a.AssigneeType == request.AssigneeType &&
                                                 a.AssigneeId == assigneeId);

                    if (existingAssignment != null)
                    {
                        continue; // Skip existing assignments
                    }

                    var assignment = new Assignment
                    {
                        GeneratedLessonId = request.LessonId,
                        AssigneeType = request.AssigneeType,
                        AssigneeId = assigneeId,
                        AssignedByRole = request.AssignedByRole,
                        AssignedById = request.AssignedById,
                        AssignedAt = DateTime.UtcNow,
                        DueAt = request.DueAt,
                        CreatedAt = DateTime.UtcNow
                    };

                    assignments.Add(assignment);
                    _context.Assignments.Add(assignment);
                }

                await _context.SaveChangesAsync();

                // Update analytics
                await UpdateAssignmentAnalytics(request.AssignedById, request.AssignedByRole, assignments.Count);

                return Ok(new
                {
                    message = $"Successfully assigned lesson to {assignments.Count} students",
                    assignmentsCreated = assignments.Count,
                    assignments = assignments.Select(a => new
                    {
                        id = a.Id,
                        lessonId = a.GeneratedLessonId,
                        assigneeId = a.AssigneeId,
                        assignedAt = a.AssignedAt,
                        dueAt = a.DueAt
                    })
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating assignment", error = ex.Message });
            }
        }

        [HttpGet("teacher/{teacherId}")]
        public async Task<IActionResult> GetTeacherAssignments(int teacherId)
        {
            try
            {
                var assignments = await _context.Assignments
                    .Include(a => a.GeneratedLesson)
                        .ThenInclude(l => l.Subject)
                    .Include(a => a.GeneratedLesson)
                        .ThenInclude(l => l.Grade)
                    .Include(a => a.Attempts)
                    .Where(a => a.AssignedByRole == AssignedByRole.Teacher && a.AssignedById == teacherId)
                    .OrderByDescending(a => a.AssignedAt)
                    .ToListAsync();

                var result = assignments.Select(a => new
                {
                    id = a.Id,
                    lessonId = a.GeneratedLessonId,
                    lessonTitle = a.GeneratedLesson.Title,
                    subject = a.GeneratedLesson.Subject.Name,
                    grade = a.GeneratedLesson.Grade.DisplayName,
                    difficulty = a.GeneratedLesson.DifficultyTag.ToString(),
                    assigneeType = a.AssigneeType.ToString(),
                    assigneeId = a.AssigneeId,
                    assignedAt = a.AssignedAt,
                    dueAt = a.DueAt,
                    attemptsCount = a.Attempts.Count,
                    completedAttempts = a.Attempts.Count(at => at.SubmittedAt.HasValue),
                    averageScore = a.Attempts.Where(at => at.SubmittedAt.HasValue).Average(at => at.ScorePercent)
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching teacher assignments", error = ex.Message });
            }
        }

        [HttpGet("parent/{parentId}")]
        public async Task<IActionResult> GetParentAssignments(int parentId)
        {
            try
            {
                var assignments = await _context.Assignments
                    .Include(a => a.GeneratedLesson)
                        .ThenInclude(l => l.Subject)
                    .Include(a => a.GeneratedLesson)
                        .ThenInclude(l => l.Grade)
                    .Include(a => a.Attempts)
                    .Where(a => a.AssignedByRole == AssignedByRole.Parent && a.AssignedById == parentId)
                    .OrderByDescending(a => a.AssignedAt)
                    .ToListAsync();

                var result = assignments.Select(a => new
                {
                    id = a.Id,
                    lessonId = a.GeneratedLessonId,
                    lessonTitle = a.GeneratedLesson.Title,
                    subject = a.GeneratedLesson.Subject.Name,
                    grade = a.GeneratedLesson.Grade.DisplayName,
                    difficulty = a.GeneratedLesson.DifficultyTag.ToString(),
                    assigneeType = a.AssigneeType.ToString(),
                    assigneeId = a.AssigneeId,
                    assignedAt = a.AssignedAt,
                    dueAt = a.DueAt,
                    attemptsCount = a.Attempts.Count,
                    completedAttempts = a.Attempts.Count(at => at.SubmittedAt.HasValue),
                    averageScore = a.Attempts.Where(at => at.SubmittedAt.HasValue).Average(at => at.ScorePercent)
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching parent assignments", error = ex.Message });
            }
        }

        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetStudentAssignments(int studentId)
        {
            try
            {
                // Get assignments where the student is the assignee
                var assignments = await _context.Assignments
                    .Include(a => a.GeneratedLesson)
                        .ThenInclude(l => l.Subject)
                    .Include(a => a.GeneratedLesson)
                        .ThenInclude(l => l.Grade)
                    .Include(a => a.Attempts.Where(at => at.StudentId == studentId))
                    .Where(a => a.AssigneeType == AssigneeType.Student && a.AssigneeId == studentId)
                    .OrderByDescending(a => a.AssignedAt)
                    .ToListAsync();

                var result = assignments.Select(a => new
                {
                    id = a.Id,
                    lessonId = a.GeneratedLessonId,
                    lessonTitle = a.GeneratedLesson.Title,
                    subject = a.GeneratedLesson.Subject.Name,
                    grade = a.GeneratedLesson.Grade.DisplayName,
                    difficulty = a.GeneratedLesson.DifficultyTag.ToString(),
                    assignedAt = a.AssignedAt,
                    dueAt = a.DueAt,
                    status = GetAssignmentStatus(a, studentId),
                    attemptsCount = a.Attempts.Count,
                    latestAttempt = a.Attempts.OrderByDescending(at => at.StartedAt).FirstOrDefault(),
                    bestScore = a.Attempts.Where(at => at.SubmittedAt.HasValue).Any() ? 
                        a.Attempts.Where(at => at.SubmittedAt.HasValue).Max(at => at.ScorePercent) : 0
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching student assignments", error = ex.Message });
            }
        }

        [HttpDelete("{assignmentId}")]
        public async Task<IActionResult> DeleteAssignment(int assignmentId)
        {
            try
            {
                var assignment = await _context.Assignments
                    .Include(a => a.Attempts)
                    .FirstOrDefaultAsync(a => a.Id == assignmentId);

                if (assignment == null)
                {
                    return NotFound(new { message = "Assignment not found" });
                }

                // Remove all attempts first
                _context.Attempts.RemoveRange(assignment.Attempts);
                _context.Assignments.Remove(assignment);

                await _context.SaveChangesAsync();

                return Ok(new { message = "Assignment deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting assignment", error = ex.Message });
            }
        }

        private async Task<bool> ValidateLessonAccess(int userId, AssignedByRole role, int lessonId)
        {
            // Check if the user has access to this lesson through library items
            var hasAccess = await _context.LibraryItems
                .AnyAsync(li => li.GeneratedLessonId == lessonId &&
                               li.OwnerRole == role.ToString().ToLower() &&
                               li.OwnerId == userId);

            return hasAccess;
        }

        private async Task<List<int>> ValidateAssignees(AssigneeType assigneeType, List<int> assigneeIds)
        {
            var validIds = new List<int>();

            if (assigneeType == AssigneeType.Student)
            {
                var validStudents = await _context.Students
                    .Where(s => assigneeIds.Contains(s.Id))
                    .Select(s => s.Id)
                    .ToListAsync();
                validIds.AddRange(validStudents);
            }
            else if (assigneeType == AssigneeType.Class)
            {
                // For class assignments, we need to get all students in the teacher's class
                // This would require additional logic to get students by teacher
                // For now, we'll assume the assigneeIds are student IDs
                var validStudents = await _context.Students
                    .Where(s => assigneeIds.Contains(s.Id))
                    .Select(s => s.Id)
                    .ToListAsync();
                validIds.AddRange(validStudents);
            }

            return validIds;
        }

        private string GetAssignmentStatus(Assignment assignment, int studentId)
        {
            var attempts = assignment.Attempts.Where(at => at.StudentId == studentId).ToList();
            
            if (!attempts.Any())
                return "Not Started";
            
            if (attempts.Any(at => at.SubmittedAt.HasValue))
                return "Completed";
            
            if (attempts.Any(at => !at.SubmittedAt.HasValue))
                return "In Progress";
            
            return "Not Started";
        }

        private async Task UpdateAssignmentAnalytics(int userId, AssignedByRole role, int assignmentsCreated)
        {
            try
            {
                var analyticsRole = role == AssignedByRole.Teacher ? AnalyticsRole.Teacher : AnalyticsRole.Parent;
                var today = DateTime.UtcNow.Date;

                var rollup = await _context.AnalyticsRollups
                    .FirstOrDefaultAsync(ar => ar.Role == analyticsRole &&
                                             ar.RoleId == userId &&
                                             ar.TimeWindow == TimeWindow.Daily &&
                                             ar.WindowStart.Date == today);

                if (rollup == null)
                {
                    rollup = new AnalyticsRollup
                    {
                        Role = analyticsRole,
                        RoleId = userId,
                        TimeWindow = TimeWindow.Daily,
                        WindowStart = today,
                        WindowEnd = today.AddDays(1).AddTicks(-1),
                        CreatedAt = DateTime.UtcNow,
                        LastUpdated = DateTime.UtcNow
                    };
                    _context.AnalyticsRollups.Add(rollup);
                }

                rollup.AssignmentsCreated += assignmentsCreated;
                rollup.LastUpdated = DateTime.UtcNow;

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Log error but don't fail the assignment creation
                Console.WriteLine($"Error updating assignment analytics: {ex.Message}");
            }
        }
    }

    public class CreateAssignmentRequest
    {
        public int LessonId { get; set; }
        public AssigneeType AssigneeType { get; set; }
        public List<int> AssigneeIds { get; set; } = new List<int>();
        public AssignedByRole AssignedByRole { get; set; }
        public int AssignedById { get; set; }
        public DateTime? DueAt { get; set; }
    }
}
