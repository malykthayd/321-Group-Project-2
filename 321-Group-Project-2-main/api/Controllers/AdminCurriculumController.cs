using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models.Curriculum;
using api.Services.Curriculum;

namespace api.Controllers
{
    [ApiController]
    [Route("api/admin/curriculum")]
    public class AdminCurriculumController : ControllerBase
    {
        private readonly AQEDbContext _context;
        private readonly ICurriculumGenerationService _curriculumService;

        public AdminCurriculumController(AQEDbContext context, ICurriculumGenerationService curriculumService)
        {
            _context = context;
            _curriculumService = curriculumService;
        }

        [HttpGet("subjects")]
        public async Task<IActionResult> GetSubjects()
        {
            try
            {
                var subjects = await _curriculumService.GetSubjectsAsync();
                return Ok(subjects);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching subjects", error = ex.Message });
            }
        }

        [HttpGet("grades")]
        public async Task<IActionResult> GetGrades()
        {
            try
            {
                var grades = await _curriculumService.GetGradesAsync();
                return Ok(grades);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching grades", error = ex.Message });
            }
        }

        [HttpGet("lessons")]
        public async Task<IActionResult> GetGeneratedLessons([FromQuery] int? subjectId, [FromQuery] int? gradeId, [FromQuery] LessonStatus? status)
        {
            try
            {
                var query = _context.GeneratedLessons
                    .Include(l => l.Subject)
                    .Include(l => l.Grade)
                    .Include(l => l.Questions)
                    .AsQueryable();

                if (subjectId.HasValue)
                    query = query.Where(l => l.SubjectId == subjectId.Value);

                if (gradeId.HasValue)
                    query = query.Where(l => l.GradeId == gradeId.Value);

                if (status.HasValue)
                    query = query.Where(l => l.Status == status.Value);

                var lessons = await query
                    .OrderBy(l => l.Subject.Name)
                    .ThenBy(l => l.Grade.SortOrder)
                    .ThenBy(l => l.DifficultyTag)
                    .ToListAsync();

                return Ok(lessons);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching lessons", error = ex.Message });
            }
        }

        [HttpPost("generate")]
        public async Task<IActionResult> GenerateLessons([FromBody] CurriculumGenerationRequest request)
        {
            try
            {
                // Validate admin access
                var adminId = request.CreatedById;
                var admin = await _context.Admins
                    .Include(a => a.User)
                    .FirstOrDefaultAsync(a => a.Id == adminId);

                if (admin == null || admin.User.Role != "admin")
                {
                    return Unauthorized(new { message = "Admin access required" });
                }

                request.CreatedByRole = CreatedByRole.Admin;

                var result = await _curriculumService.GenerateLessonsAsync(request);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error generating lessons", error = ex.Message });
            }
        }

        [HttpPost("publish")]
        public async Task<IActionResult> PublishLessons([FromBody] PublishRequest request)
        {
            try
            {
                // Validate admin access
                var adminId = request.OwnerIds.FirstOrDefault();
                var admin = await _context.Admins
                    .Include(a => a.User)
                    .FirstOrDefaultAsync(a => a.Id == adminId);

                if (admin == null || admin.User.Role != "admin")
                {
                    return Unauthorized(new { message = "Admin access required" });
                }

                var result = await _curriculumService.PublishLessonsAsync(request);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error publishing lessons", error = ex.Message });
            }
        }

        [HttpGet("analytics")]
        public async Task<IActionResult> GetAnalytics([FromQuery] TimeWindow timeWindow = TimeWindow.AllTime)
        {
            try
            {
                var analytics = await _context.AnalyticsRollups
                    .Where(a => a.Role == AnalyticsRole.Admin && a.TimeWindow == timeWindow)
                    .OrderByDescending(a => a.LastUpdated)
                    .FirstOrDefaultAsync();

                if (analytics == null)
                {
                    // Return empty analytics if none exist
                    analytics = new AnalyticsRollup
                    {
                        Role = AnalyticsRole.Admin,
                        TimeWindow = timeWindow,
                        LessonsGenerated = 0,
                        LessonsPublishedParent = 0,
                        LessonsPublishedTeacher = 0,
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
                return StatusCode(500, new { message = "Error fetching analytics", error = ex.Message });
            }
        }

        [HttpPost("seed-data")]
        public async Task<IActionResult> SeedSubjectsAndGrades()
        {
            try
            {
                // Seed subjects
                var subjects = new[]
                {
                    new Subject { Slug = "english", Name = "English", Description = "Reading, writing, and communication skills" },
                    new Subject { Slug = "mathematics", Name = "Mathematics", Description = "Numbers, operations, and problem solving" },
                    new Subject { Slug = "technology", Name = "Technology", Description = "Computer science, digital literacy, and technology skills" },
                    new Subject { Slug = "science", Name = "Science", Description = "Natural world and scientific inquiry" },
                    new Subject { Slug = "geography", Name = "Geography", Description = "World geography, maps, and cultural studies" }
                };

                foreach (var subject in subjects)
                {
                    if (!await _context.Subjects.AnyAsync(s => s.Slug == subject.Slug))
                    {
                        _context.Subjects.Add(subject);
                    }
                }

                // Seed grades (K-8 only)
                var grades = new[]
                {
                    new Grade { Code = "K", DisplayName = "Kindergarten", SortOrder = 0 },
                    new Grade { Code = "1", DisplayName = "1st Grade", SortOrder = 1 },
                    new Grade { Code = "2", DisplayName = "2nd Grade", SortOrder = 2 },
                    new Grade { Code = "3", DisplayName = "3rd Grade", SortOrder = 3 },
                    new Grade { Code = "4", DisplayName = "4th Grade", SortOrder = 4 },
                    new Grade { Code = "5", DisplayName = "5th Grade", SortOrder = 5 },
                    new Grade { Code = "6", DisplayName = "6th Grade", SortOrder = 6 },
                    new Grade { Code = "7", DisplayName = "7th Grade", SortOrder = 7 },
                    new Grade { Code = "8", DisplayName = "8th Grade", SortOrder = 8 }
                };

                foreach (var grade in grades)
                {
                    if (!await _context.Grades.AnyAsync(g => g.Code == grade.Code))
                    {
                        _context.Grades.Add(grade);
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Subjects and grades seeded successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error seeding data", error = ex.Message });
            }
        }
    }
}
