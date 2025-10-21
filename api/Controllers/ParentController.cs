using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ParentController : ControllerBase
    {
        private readonly AQEDbContext _context;

        public ParentController(AQEDbContext context)
        {
            _context = context;
        }

        [HttpGet("{parentId}/dashboard")]
        public async Task<IActionResult> GetDashboard(int parentId)
        {
            try
            {
                // Get parent's children
                var children = await _context.ParentStudents
                    .Include(ps => ps.Student)
                        .ThenInclude(s => s.User)
                    .Where(ps => ps.ParentId == parentId)
                    .Select(ps => ps.Student)
                    .ToListAsync();

                var dashboard = new
                {
                    totalChildren = children.Count,
                    totalLessonsCompleted = await _context.StudentLessons
                        .Where(sl => children.Select(c => c.Id).Contains(sl.StudentId) && sl.CompletedAt != null)
                        .CountAsync(),
                    totalPracticeMaterialsCompleted = await _context.StudentPracticeMaterials
                        .Where(spm => children.Select(c => c.Id).Contains(spm.StudentId) && spm.CompletedAt != null)
                        .CountAsync(),
                    averageScore = await _context.StudentLessons
                        .Where(sl => children.Select(c => c.Id).Contains(sl.StudentId) && sl.CompletedAt != null && sl.Score != null)
                        .AverageAsync(sl => sl.Score) ?? 0,
                    recentActivity = await GetRecentActivity(children.Select(c => c.Id).ToList())
                };

                return Ok(dashboard);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching dashboard data", error = ex.Message });
            }
        }

        [HttpGet("{parentId}/children")]
        public async Task<IActionResult> GetChildren(int parentId)
        {
            try
            {
                var children = await _context.ParentStudents
                    .Include(ps => ps.Student)
                        .ThenInclude(s => s.User)
                    .Include(ps => ps.Student)
                        .ThenInclude(s => s.Teacher)
                    .Where(ps => ps.ParentId == parentId)
                    .Select(ps => new
                    {
                        id = ps.Student.Id,
                        name = ps.Student.User.Name,
                        gradeLevel = ps.Student.GradeLevel,
                        teacherName = ps.Student.Teacher != null ? ps.Student.Teacher.User.Name : null,
                        lastLogin = ps.Student.User.LastLogin,
                        totalLessonsCompleted = _context.StudentLessons
                            .Where(sl => sl.StudentId == ps.Student.Id && sl.CompletedAt != null)
                            .Count(),
                        totalPracticeMaterialsCompleted = _context.StudentPracticeMaterials
                            .Where(spm => spm.StudentId == ps.Student.Id && spm.CompletedAt != null)
                            .Count(),
                        averageScore = _context.StudentLessons
                            .Where(sl => sl.StudentId == ps.Student.Id && sl.CompletedAt != null && sl.Score != null)
                            .Average(sl => sl.Score) ?? 0
                    })
                    .ToListAsync();

                return Ok(children);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching children", error = ex.Message });
            }
        }

        [HttpGet("{parentId}/digital-library")]
        public async Task<IActionResult> GetDigitalLibrary(int parentId)
        {
            try
            {
                // Get parent's children's grade levels
                var childrenGradeLevels = await _context.ParentStudents
                    .Include(ps => ps.Student)
                    .Where(ps => ps.ParentId == parentId)
                    .Select(ps => ps.Student.GradeLevel)
                    .Distinct()
                    .ToListAsync();

                // Get available lessons for those grade levels
                var lessons = await _context.Lessons
                    .Include(l => l.Admin)
                        .ThenInclude(a => a.User)
                    .Where(l => l.IsActive && l.IsAvailable && childrenGradeLevels.Contains(l.GradeLevel))
                    .Select(l => new
                    {
                        id = l.Id,
                        title = l.Title,
                        description = l.Description,
                        subject = l.Subject,
                        gradeLevel = l.GradeLevel,
                        tags = l.Tags,
                        createdBy = l.Admin.User.Name,
                        createdAt = l.CreatedAt
                    })
                    .OrderBy(l => l.subject)
                    .ThenBy(l => l.gradeLevel)
                    .ThenBy(l => l.title)
                    .ToListAsync();

                return Ok(lessons);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching digital library", error = ex.Message });
            }
        }

        [HttpPost("{parentId}/assign-lesson")]
        public async Task<IActionResult> AssignLesson(int parentId, [FromBody] AssignLessonRequest request)
        {
            try
            {
                // Validate parent has access to the student
                var parentStudent = await _context.ParentStudents
                    .FirstOrDefaultAsync(ps => ps.ParentId == parentId && ps.StudentId == request.StudentId);

                if (parentStudent == null)
                {
                    return BadRequest(new { message = "You don't have access to this student" });
                }

                // Check if lesson exists and is available
                var lesson = await _context.Lessons
                    .FirstOrDefaultAsync(l => l.Id == request.LessonId && l.IsActive && l.IsAvailable);

                if (lesson == null)
                {
                    return BadRequest(new { message = "Lesson not found or not available" });
                }

                // Check if already assigned
                var existingAssignment = await _context.DigitalLibraryAssignments
                    .FirstOrDefaultAsync(dla => dla.StudentId == request.StudentId && dla.DigitalLibraryId == request.LessonId);

                if (existingAssignment != null)
                {
                    return BadRequest(new { message = "Lesson already assigned to this student" });
                }

                // Create assignment
                var assignment = new DigitalLibraryAssignment
                {
                    StudentId = request.StudentId,
                    DigitalLibraryId = request.LessonId,
                    TeacherId = null, // Assigned by parent, not teacher
                    AssignedAt = DateTime.UtcNow,
                    Notes = request.Notes
                };

                _context.DigitalLibraryAssignments.Add(assignment);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Lesson assigned successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while assigning lesson", error = ex.Message });
            }
        }

        private async Task<List<object>> GetRecentActivity(List<int> studentIds)
        {
            var activities = new List<object>();

            // Get recent lesson completions
            var lessonActivities = await _context.StudentLessons
                .Include(sl => sl.Student)
                    .ThenInclude(s => s.User)
                .Include(sl => sl.Lesson)
                .Where(sl => studentIds.Contains(sl.StudentId) && sl.CompletedAt != null)
                .OrderByDescending(sl => sl.CompletedAt)
                .Take(10)
                .Select(sl => new
                {
                    type = "lesson_completed",
                    studentName = sl.Student.User.Name,
                    lessonTitle = sl.Lesson.Title,
                    score = sl.Score,
                    completedAt = sl.CompletedAt
                })
                .ToListAsync();

            activities.AddRange(lessonActivities.Cast<object>());

            // Get recent practice material completions
            var practiceActivities = await _context.StudentPracticeMaterials
                .Include(spm => spm.Student)
                    .ThenInclude(s => s.User)
                .Include(spm => spm.PracticeMaterial)
                .Where(spm => studentIds.Contains(spm.StudentId) && spm.CompletedAt != null)
                .OrderByDescending(spm => spm.CompletedAt)
                .Take(10)
                .Select(spm => new
                {
                    type = "practice_completed",
                    studentName = spm.Student.User.Name,
                    materialTitle = spm.PracticeMaterial.Title,
                    score = spm.Score,
                    completedAt = spm.CompletedAt
                })
                .ToListAsync();

            activities.AddRange(practiceActivities.Cast<object>());

            return activities.OrderByDescending(a => ((dynamic)a).completedAt).Take(10).ToList();
        }
    }

    public class AssignLessonRequest
    {
        public int StudentId { get; set; }
        public int LessonId { get; set; }
        public string? Notes { get; set; }
    }
}
