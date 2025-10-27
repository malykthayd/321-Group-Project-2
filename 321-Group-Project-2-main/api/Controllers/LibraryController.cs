using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models.Curriculum;
using api.Models;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LibraryController : ControllerBase
    {
        private readonly AQEDbContext _context;

        public LibraryController(AQEDbContext context)
        {
            _context = context;
        }

        [HttpGet("teacher/{teacherId}")]
        public async Task<IActionResult> GetTeacherLibrary(int teacherId)
        {
            try
            {
                var libraryItems = await _context.LibraryItems
                    .Include(li => li.GeneratedLesson)
                        .ThenInclude(l => l.Subject)
                    .Include(li => li.GeneratedLesson)
                        .ThenInclude(l => l.Grade)
                    .Include(li => li.GeneratedLesson)
                        .ThenInclude(l => l.Questions)
                    .Where(li => li.OwnerRole == "teacher" && li.OwnerId == teacherId)
                    .OrderByDescending(li => li.PublishedAt)
                    .ToListAsync();

                var result = libraryItems.Select(li => new
                {
                    id = li.Id,
                    lessonId = li.GeneratedLessonId,
                    title = li.GeneratedLesson.Title,
                    description = li.GeneratedLesson.Description,
                    subject = li.GeneratedLesson.Subject.Name,
                    subjectSlug = li.GeneratedLesson.Subject.Slug,
                    grade = li.GeneratedLesson.Grade.DisplayName,
                    gradeCode = li.GeneratedLesson.Grade.Code,
                    difficulty = li.GeneratedLesson.DifficultyTag.ToString(),
                    status = li.GeneratedLesson.Status.ToString(),
                    questionsCount = li.GeneratedLesson.Questions.Count,
                    publishedAt = li.PublishedAt,
                    assignmentsCount = _context.Assignments
                        .Where(a => a.GeneratedLessonId == li.GeneratedLessonId &&
                                   a.AssignedByRole == AssignedByRole.Teacher &&
                                   a.AssignedById == teacherId)
                        .Count(),
                    attemptsCount = _context.Assignments
                        .Where(a => a.GeneratedLessonId == li.GeneratedLessonId &&
                                   a.AssignedByRole == AssignedByRole.Teacher &&
                                   a.AssignedById == teacherId)
                        .SelectMany(a => a.Attempts)
                        .Count(),
                    averageScore = 0 // Will be calculated client-side to avoid SQLite decimal issues
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching teacher library", error = ex.Message });
            }
        }

        [HttpGet("parent/{parentId}")]
        public async Task<IActionResult> GetParentLibrary(int parentId)
        {
            try
            {
                var libraryItems = await _context.LibraryItems
                    .Include(li => li.GeneratedLesson)
                        .ThenInclude(l => l.Subject)
                    .Include(li => li.GeneratedLesson)
                        .ThenInclude(l => l.Grade)
                    .Include(li => li.GeneratedLesson)
                        .ThenInclude(l => l.Questions)
                    .Where(li => li.OwnerRole == "parent" && li.OwnerId == parentId)
                    .OrderByDescending(li => li.PublishedAt)
                    .ToListAsync();

                var result = libraryItems.Select(li => new
                {
                    id = li.Id,
                    lessonId = li.GeneratedLessonId,
                    title = li.GeneratedLesson.Title,
                    description = li.GeneratedLesson.Description,
                    subject = li.GeneratedLesson.Subject.Name,
                    subjectSlug = li.GeneratedLesson.Subject.Slug,
                    grade = li.GeneratedLesson.Grade.DisplayName,
                    gradeCode = li.GeneratedLesson.Grade.Code,
                    difficulty = li.GeneratedLesson.DifficultyTag.ToString(),
                    status = li.GeneratedLesson.Status.ToString(),
                    questionsCount = li.GeneratedLesson.Questions.Count,
                    publishedAt = li.PublishedAt,
                    assignmentsCount = _context.Assignments
                        .Where(a => a.GeneratedLessonId == li.GeneratedLessonId &&
                                   a.AssignedByRole == AssignedByRole.Parent &&
                                   a.AssignedById == parentId)
                        .Count(),
                    attemptsCount = _context.Assignments
                        .Where(a => a.GeneratedLessonId == li.GeneratedLessonId &&
                                   a.AssignedByRole == AssignedByRole.Parent &&
                                   a.AssignedById == parentId)
                        .SelectMany(a => a.Attempts)
                        .Count(),
                    averageScore = 0 // Will be calculated client-side to avoid SQLite decimal issues
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching parent library", error = ex.Message });
            }
        }

        [HttpGet("lesson/{lessonId}")]
        public async Task<IActionResult> GetLessonDetails(int lessonId)
        {
            try
            {
                var lesson = await _context.GeneratedLessons
                    .Include(l => l.Subject)
                    .Include(l => l.Grade)
                    .Include(l => l.Questions.OrderBy(q => q.Order))
                    .FirstOrDefaultAsync(l => l.Id == lessonId && l.Status == LessonStatus.Published);

                if (lesson == null)
                {
                    return NotFound(new { message = "Lesson not found or not published" });
                }

                var result = new
                {
                    id = lesson.Id,
                    title = lesson.Title,
                    description = lesson.Description,
                    subject = lesson.Subject.Name,
                    subjectSlug = lesson.Subject.Slug,
                    grade = lesson.Grade.DisplayName,
                    gradeCode = lesson.Grade.Code,
                    difficulty = lesson.DifficultyTag.ToString(),
                    questionsCount = lesson.Questions.Count,
                    questions = lesson.Questions.Select(q => new
                    {
                        id = q.Id,
                        order = q.Order,
                        prompt = q.Prompt,
                        choices = System.Text.Json.JsonSerializer.Deserialize<string[]>(q.ChoicesJson),
                        explanation = q.Explanation
                    })
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching lesson details", error = ex.Message });
            }
        }

        [HttpGet("teacher/{teacherId}/students")]
        public async Task<IActionResult> GetTeacherStudents(int teacherId)
        {
            try
            {
                var students = await _context.Students
                    .Include(s => s.User)
                    .Where(s => s.TeacherId == teacherId)
                    .OrderBy(s => s.User.Name)
                    .ToListAsync();

                var result = students.Select(s => new
                {
                    id = s.Id,
                    name = s.User.Name,
                    gradeLevel = s.GradeLevel,
                    accessCode = s.AccessCode,
                    isIndependent = s.IsIndependent
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching teacher students", error = ex.Message });
            }
        }

        [HttpGet("parent/{parentId}/children")]
        public async Task<IActionResult> GetParentChildren(int parentId)
        {
            try
            {
                var children = await _context.ParentStudents
                    .Include(ps => ps.Student)
                        .ThenInclude(s => s.User)
                    .Where(ps => ps.ParentId == parentId)
                    .OrderBy(ps => ps.Student.User.Name)
                    .ToListAsync();

                var result = children.Select(ps => new
                {
                    id = ps.Student.Id,
                    name = ps.Student.User.Name,
                    gradeLevel = ps.Student.GradeLevel,
                    accessCode = ps.Student.AccessCode,
                    teacherId = ps.Student.TeacherId,
                    teacherName = ps.Student.Teacher != null ? ps.Student.Teacher.User.Name : null
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching parent children", error = ex.Message });
            }
        }

        [HttpDelete("item/{libraryItemId}")]
        public async Task<IActionResult> RemoveFromLibrary(int libraryItemId)
        {
            try
            {
                var libraryItem = await _context.LibraryItems
                    .Include(li => li.GeneratedLesson)
                    .FirstOrDefaultAsync(li => li.Id == libraryItemId);

                if (libraryItem == null)
                {
                    return NotFound(new { message = "Library item not found" });
                }

                // Check if there are any assignments for this lesson
                var hasAssignments = await _context.Assignments
                    .AnyAsync(a => a.GeneratedLessonId == libraryItem.GeneratedLessonId);

                if (hasAssignments)
                {
                    return BadRequest(new { message = "Cannot remove lesson that has been assigned to students" });
                }

                _context.LibraryItems.Remove(libraryItem);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Lesson removed from library successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error removing from library", error = ex.Message });
            }
        }

        [HttpGet("teacher/{teacherId}/analytics")]
        public async Task<IActionResult> GetTeacherLibraryAnalytics(int teacherId)
        {
            try
            {
                var libraryCount = await _context.LibraryItems
                    .Where(li => li.OwnerRole == "teacher" && li.OwnerId == teacherId)
                    .CountAsync();

                var assignmentsCount = await _context.Assignments
                    .Where(a => a.AssignedByRole == AssignedByRole.Teacher && a.AssignedById == teacherId)
                    .CountAsync();

                var attemptsCount = await _context.Assignments
                    .Where(a => a.AssignedByRole == AssignedByRole.Teacher && a.AssignedById == teacherId)
                    .SelectMany(a => a.Attempts)
                    .CountAsync();

                var completedAttempts = await _context.Assignments
                    .Where(a => a.AssignedByRole == AssignedByRole.Teacher && a.AssignedById == teacherId)
                    .SelectMany(a => a.Attempts)
                    .Where(at => at.SubmittedAt.HasValue)
                    .CountAsync();

                var averageScore = 0; // Will be calculated client-side to avoid SQLite decimal issues

                var studentsAssigned = await _context.Assignments
                    .Where(a => a.AssignedByRole == AssignedByRole.Teacher && a.AssignedById == teacherId)
                    .Select(a => a.AssigneeId)
                    .Distinct()
                    .CountAsync();

                return Ok(new
                {
                    lessonsInLibrary = libraryCount,
                    assignmentsCreated = assignmentsCount,
                    studentsAssigned = studentsAssigned,
                    attemptsReceived = attemptsCount,
                    completedAttempts = completedAttempts,
                    averageScore = Math.Round((decimal)averageScore, 2),
                    completionRate = attemptsCount > 0 ? Math.Round((decimal)completedAttempts / attemptsCount * 100, 2) : 0
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching teacher analytics", error = ex.Message });
            }
        }

        [HttpGet("parent/{parentId}/analytics")]
        public async Task<IActionResult> GetParentLibraryAnalytics(int parentId)
        {
            try
            {
                var libraryCount = await _context.LibraryItems
                    .Where(li => li.OwnerRole == "parent" && li.OwnerId == parentId)
                    .CountAsync();

                var assignmentsCount = await _context.Assignments
                    .Where(a => a.AssignedByRole == AssignedByRole.Parent && a.AssignedById == parentId)
                    .CountAsync();

                var attemptsCount = await _context.Assignments
                    .Where(a => a.AssignedByRole == AssignedByRole.Parent && a.AssignedById == parentId)
                    .SelectMany(a => a.Attempts)
                    .CountAsync();

                var completedAttempts = await _context.Assignments
                    .Where(a => a.AssignedByRole == AssignedByRole.Parent && a.AssignedById == parentId)
                    .SelectMany(a => a.Attempts)
                    .Where(at => at.SubmittedAt.HasValue)
                    .CountAsync();

                var averageScore = 0; // Will be calculated client-side to avoid SQLite decimal issues

                var childrenAssigned = await _context.Assignments
                    .Where(a => a.AssignedByRole == AssignedByRole.Parent && a.AssignedById == parentId)
                    .Select(a => a.AssigneeId)
                    .Distinct()
                    .CountAsync();

                return Ok(new
                {
                    lessonsAvailable = libraryCount,
                    assignmentsCreated = assignmentsCount,
                    childrenAssigned = childrenAssigned,
                    childAttempts = attemptsCount,
                    completedAttempts = completedAttempts,
                    averageScore = Math.Round((decimal)averageScore, 2),
                    completionRate = attemptsCount > 0 ? Math.Round((decimal)completedAttempts / attemptsCount * 100, 2) : 0
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching parent analytics", error = ex.Message });
            }
        }
    }
}