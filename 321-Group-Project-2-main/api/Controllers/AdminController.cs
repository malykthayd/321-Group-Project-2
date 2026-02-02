using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly AQEDbContext _context;

        public AdminController(AQEDbContext context)
        {
            _context = context;
        }

        [HttpGet("{adminId}/dashboard")]
        public async Task<IActionResult> GetDashboard(int adminId)
        {
            try
            {
                var dashboard = new
                {
                    totalUsers = await _context.Users.CountAsync(),
                    totalTeachers = await _context.Teachers.CountAsync(),
                    totalStudents = await _context.Students.CountAsync(),
                    totalParents = await _context.Parents.CountAsync(),
                    totalLessons = await _context.Lessons.CountAsync(),
                    totalPracticeMaterials = await _context.PracticeMaterials.CountAsync(),
                    totalLessonsCompleted = await _context.StudentLessons
                        .Where(sl => sl.CompletedAt != null)
                        .CountAsync(),
                    averageScore = await _context.StudentLessons
                        .Where(sl => sl.CompletedAt != null && sl.Score != null)
                        .AverageAsync(sl => sl.Score) ?? 0,
                    recentActivity = await GetRecentActivity()
                };

                return Ok(dashboard);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching dashboard data", error = ex.Message });
            }
        }

        [HttpGet("{adminId}/digital-library")]
        public async Task<IActionResult> GetDigitalLibrary(int adminId)
        {
            try
            {
                var lessons = await _context.Lessons
                    .Where(l => l.AdminId == adminId)
                    .Select(l => new
                    {
                        id = l.Id,
                        title = l.Title,
                        description = l.Description,
                        subject = l.Subject,
                        gradeLevel = l.GradeLevel,
                        tags = l.Tags,
                        createdAt = l.CreatedAt,
                        updatedAt = l.UpdatedAt,
                        isActive = l.IsActive,
                        isAvailable = l.IsAvailable,
                        totalAssignments = _context.DigitalLibraryAssignments
                            .Where(dla => dla.DigitalLibraryId == l.Id)
                            .Count(),
                        totalCompletions = _context.StudentLessons
                            .Where(sl => sl.LessonId == l.Id && sl.CompletedAt != null)
                            .Count()
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

        [HttpPost("{adminId}/create-lesson")]
        public async Task<IActionResult> CreateLesson(int adminId, [FromBody] CreateLessonRequest request)
        {
            try
            {
                // Validate input
                if (string.IsNullOrEmpty(request.Title) || string.IsNullOrEmpty(request.Description) ||
                    string.IsNullOrEmpty(request.Subject) || string.IsNullOrEmpty(request.GradeLevel) ||
                    string.IsNullOrEmpty(request.Content))
                {
                    return BadRequest(new { message = "Title, description, subject, grade level, and content are required" });
                }

                var lesson = new Lesson
                {
                    Title = request.Title,
                    Description = request.Description,
                    Subject = request.Subject,
                    GradeLevel = request.GradeLevel,
                    Content = request.Content,
                    ResourceUrl = request.ResourceUrl,
                    Tags = request.Tags,
                    AdminId = adminId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    IsActive = true,
                    IsAvailable = request.IsAvailable
                };

                _context.Lessons.Add(lesson);
                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = "Lesson created successfully", 
                    lessonId = lesson.Id 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating lesson", error = ex.Message });
            }
        }

        [HttpPut("{adminId}/lesson/{lessonId}")]
        public async Task<IActionResult> UpdateLesson(int adminId, int lessonId, [FromBody] UpdateLessonRequest request)
        {
            try
            {
                var lesson = await _context.Lessons
                    .FirstOrDefaultAsync(l => l.Id == lessonId && l.AdminId == adminId);

                if (lesson == null)
                {
                    return NotFound(new { message = "Lesson not found" });
                }

                lesson.Title = request.Title ?? lesson.Title;
                lesson.Description = request.Description ?? lesson.Description;
                lesson.Subject = request.Subject ?? lesson.Subject;
                lesson.GradeLevel = request.GradeLevel ?? lesson.GradeLevel;
                lesson.Content = request.Content ?? lesson.Content;
                lesson.ResourceUrl = request.ResourceUrl ?? lesson.ResourceUrl;
                lesson.Tags = request.Tags ?? lesson.Tags;
                lesson.IsActive = request.IsActive ?? lesson.IsActive;
                lesson.IsAvailable = request.IsAvailable ?? lesson.IsAvailable;
                lesson.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Lesson updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating lesson", error = ex.Message });
            }
        }

        [HttpDelete("{adminId}/lesson/{lessonId}")]
        public async Task<IActionResult> DeleteLesson(int adminId, int lessonId)
        {
            try
            {
                var lesson = await _context.Lessons
                    .FirstOrDefaultAsync(l => l.Id == lessonId && l.AdminId == adminId);

                if (lesson == null)
                {
                    return NotFound(new { message = "Lesson not found" });
                }

                _context.Lessons.Remove(lesson);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Lesson deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting lesson", error = ex.Message });
            }
        }

        [HttpGet("{adminId}/user-management")]
        public async Task<IActionResult> GetUserManagement(int adminId)
        {
            try
            {
                var users = await _context.Users
                    .Include(u => u.Student)
                    .Include(u => u.Teacher)
                    .Include(u => u.Parent)
                    .Include(u => u.Admin)
                    .Select(u => new
                    {
                        id = u.Id,
                        name = u.Name,
                        email = u.Email,
                        role = u.Role,
                        createdAt = u.CreatedAt,
                        lastLogin = u.LastLogin,
                        isActive = u.IsActive,
                        studentInfo = u.Student != null ? new
                        {
                            id = u.Student.Id,
                            gradeLevel = u.Student.GradeLevel,
                            isIndependent = u.Student.IsIndependent,
                            teacherName = u.Student.Teacher != null ? u.Student.Teacher.User.Name : null
                        } : null,
                        teacherInfo = u.Teacher != null ? new
                        {
                            id = u.Teacher.Id,
                            subjectTaught = u.Teacher.SubjectTaught,
                            gradeLevelTaught = u.Teacher.GradeLevelTaught
                        } : null,
                        parentInfo = u.Parent != null ? new
                        {
                            id = u.Parent.Id,
                            childrenCount = _context.ParentStudents.Count(ps => ps.ParentId == u.Parent.Id)
                        } : null,
                        adminInfo = u.Admin != null ? new
                        {
                            id = u.Admin.Id,
                            permissions = u.Admin.Permissions
                        } : null
                    })
                    .OrderBy(u => u.role)
                    .ThenBy(u => u.name)
                    .ToListAsync();

                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching users", error = ex.Message });
            }
        }

        [HttpPut("{adminId}/user/{userId}")]
        public async Task<IActionResult> UpdateUser(int adminId, int userId, [FromBody] UpdateUserRequest request)
        {
            try
            {
                var user = await _context.Users
                    .Include(u => u.Student)
                    .Include(u => u.Teacher)
                    .Include(u => u.Parent)
                    .Include(u => u.Admin)
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                // Update user basic info
                user.Name = request.Name ?? user.Name;
                user.Email = request.Email ?? user.Email;
                user.IsActive = request.IsActive ?? user.IsActive;

                // Update role-specific info
                if (user.Student != null && request.StudentInfo != null)
                {
                    user.Student.GradeLevel = request.StudentInfo.GradeLevel ?? user.Student.GradeLevel;
                    user.Student.IsIndependent = request.StudentInfo.IsIndependent ?? user.Student.IsIndependent;
                }

                if (user.Teacher != null && request.TeacherInfo != null)
                {
                    user.Teacher.SubjectTaught = request.TeacherInfo.SubjectTaught ?? user.Teacher.SubjectTaught;
                    user.Teacher.GradeLevelTaught = request.TeacherInfo.GradeLevelTaught ?? user.Teacher.GradeLevelTaught;
                }

                if (user.Admin != null && request.AdminInfo != null)
                {
                    user.Admin.Permissions = request.AdminInfo.Permissions ?? user.Admin.Permissions;
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "User updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating user", error = ex.Message });
            }
        }

        [HttpDelete("{adminId}/user/{userId}")]
        public async Task<IActionResult> DeleteUser(int adminId, int userId)
        {
            try
            {
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                return Ok(new { message = "User deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting user", error = ex.Message });
            }
        }

        private async Task<List<object>> GetRecentActivity()
        {
            var activities = new List<object>();

            // Get recent user registrations
            var registrations = await _context.Users
                .OrderByDescending(u => u.CreatedAt)
                .Take(10)
                .Select(u => new
                {
                    type = "user_registered",
                    userName = u.Name,
                    role = u.Role,
                    createdAt = u.CreatedAt
                })
                .ToListAsync();

            activities.AddRange(registrations.Cast<object>());

            // Get recent lesson completions
            var completions = await _context.StudentLessons
                .Include(sl => sl.Student)
                    .ThenInclude(s => s.User)
                .Include(sl => sl.Lesson)
                .Where(sl => sl.CompletedAt != null)
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

            activities.AddRange(completions.Cast<object>());

            return activities.OrderByDescending(a => ((dynamic)a).createdAt ?? ((dynamic)a).completedAt).Take(10).ToList();
        }
    }

    public class CreateLessonRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string GradeLevel { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? ResourceUrl { get; set; }
        public string? Tags { get; set; }
        public bool IsAvailable { get; set; } = true;
    }

    public class UpdateLessonRequest
    {
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Subject { get; set; }
        public string? GradeLevel { get; set; }
        public string? Content { get; set; }
        public string? ResourceUrl { get; set; }
        public string? Tags { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsAvailable { get; set; }
    }

    public class UpdateUserRequest
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public bool? IsActive { get; set; }
        public StudentInfo? StudentInfo { get; set; }
        public TeacherInfo? TeacherInfo { get; set; }
        public AdminInfo? AdminInfo { get; set; }
    }

    public class StudentInfo
    {
        public string? GradeLevel { get; set; }
        public bool? IsIndependent { get; set; }
    }

    public class TeacherInfo
    {
        public string? SubjectTaught { get; set; }
        public string? GradeLevelTaught { get; set; }
    }

    public class AdminInfo
    {
        public string? Permissions { get; set; }
    }
}
