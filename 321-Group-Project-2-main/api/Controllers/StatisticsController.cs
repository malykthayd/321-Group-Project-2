using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models;
using System.Text.Json;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatisticsController : ControllerBase
    {
        private readonly AQEDbContext _context;

        public StatisticsController(AQEDbContext context)
        {
            _context = context;
        }

        // GET: api/Statistics/student/{studentId}
        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetStudentStatistics(int studentId)
        {
            try
            {
                var student = await _context.Students
                    .Include(s => s.Statistics)
                    .Include(s => s.User)
                    .FirstOrDefaultAsync(s => s.Id == studentId);

                if (student == null)
                    return NotFound(new { message = "Student not found" });

                // Initialize statistics if they don't exist
                if (student.Statistics == null)
                {
                    await InitializeStudentStatistics(studentId);
                    student = await _context.Students
                        .Include(s => s.Statistics)
                        .FirstOrDefaultAsync(s => s.Id == studentId);
                }

                // Update statistics
                await UpdateStudentStatistics(studentId);

                // Reload statistics after update
                student = await _context.Students
                    .Include(s => s.Statistics)
                    .Include(s => s.User)
                    .FirstOrDefaultAsync(s => s.Id == studentId);

                return Ok(new
                {
                    studentId = student.Id,
                    studentName = student.User.Name,
                    statistics = new
                    {
                        lessons = new
                        {
                            checkedOut = student.Statistics?.TotalLessonsCheckedOut ?? 0,
                            started = student.Statistics?.TotalLessonsStarted ?? 0,
                            completed = student.Statistics?.TotalLessonsCompleted ?? 0
                        },
                        practice = new
                        {
                            started = student.Statistics?.TotalPracticeStarted ?? 0,
                            completed = student.Statistics?.TotalPracticeCompleted ?? 0
                        },
                        library = new
                        {
                            assigned = student.Statistics?.TotalLibraryAssignments ?? 0,
                            completed = student.Statistics?.TotalLibraryCompleted ?? 0
                        },
                        performance = new
                        {
                            averageScore = Math.Round(student.Statistics?.AverageScore ?? 0, 2),
                            totalQuestionsAnswered = student.Statistics?.TotalQuestionsAnswered ?? 0,
                            totalCorrectAnswers = student.Statistics?.TotalCorrectAnswers ?? 0,
                            accuracyRate = student.Statistics?.TotalQuestionsAnswered > 0 
                                ? Math.Round((double)(student.Statistics?.TotalCorrectAnswers ?? 0) / (student.Statistics?.TotalQuestionsAnswered ?? 1) * 100, 2)
                                : 0
                        },
                        engagement = new
                        {
                            totalMinutesSpent = student.Statistics?.TotalMinutesSpent ?? 0,
                            lastActivityDate = student.Statistics?.LastActivityDate,
                            currentStreak = student.Statistics?.CurrentStreak ?? 0,
                            longestStreak = student.Statistics?.LongestStreak ?? 0
                        },
                        badges = new
                        {
                            total = student.Statistics?.TotalBadgesEarned ?? 0
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching statistics", error = ex.Message });
            }
        }

        // GET: api/Statistics/student/{studentId}/badges
        [HttpGet("student/{studentId}/badges")]
        public async Task<IActionResult> GetStudentBadges(int studentId)
        {
            try
            {
                var badges = await _context.StudentBadges
                    .Include(sb => sb.Badge)
                    .Where(sb => sb.StudentId == studentId)
                    .OrderByDescending(sb => sb.EarnedAt)
                    .Select(sb => new
                    {
                        id = sb.Badge.Id,
                        name = sb.Badge.Name,
                        description = sb.Badge.Description,
                        type = sb.Badge.Type.ToString(),
                        iconUrl = sb.Badge.IconUrl,
                        earnedAt = sb.EarnedAt
                    })
                    .ToListAsync();

                return Ok(badges);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching badges", error = ex.Message });
            }
        }

        // GET: api/Statistics/teacher/{teacherId}/overview
        [HttpGet("teacher/{teacherId}/overview")]
        public async Task<IActionResult> GetTeacherStatisticsOverview(int teacherId)
        {
            try
            {
                var teacher = await _context.Teachers
                    .Include(t => t.User)
                    .FirstOrDefaultAsync(t => t.Id == teacherId);

                if (teacher == null)
                    return NotFound(new { message = "Teacher not found" });

                var studentIds = await _context.Students
                    .Where(s => s.TeacherId == teacherId)
                    .Select(s => s.Id)
                    .ToListAsync();

                var overview = new
                {
                    teacherId = teacher.Id,
                    teacherName = teacher.User.Name,
                    totalStudents = studentIds.Count,
                    overallStatistics = new
                    {
                        totalLessonsAssigned = await _context.DigitalLibraryAssignments
                            .Where(dla => studentIds.Contains(dla.StudentId) && dla.TeacherId == teacherId)
                            .CountAsync(),
                        totalLessonsCompleted = await _context.StudentLessons
                            .Where(sl => studentIds.Contains(sl.StudentId) && sl.CompletedAt != null)
                            .CountAsync(),
                        totalPracticeAssigned = await _context.StudentPracticeMaterials
                            .Where(spm => studentIds.Contains(spm.StudentId))
                            .CountAsync(),
                        totalPracticeCompleted = await _context.StudentPracticeMaterials
                            .Where(spm => studentIds.Contains(spm.StudentId) && spm.CompletedAt != null)
                            .CountAsync(),
                        averageClassScore = await _context.StudentLessons
                            .Where(sl => studentIds.Contains(sl.StudentId) && sl.Score != null)
                            .AverageAsync(sl => (double?)sl.Score) ?? 0
                    },
                    studentPerformance = await GetStudentPerformanceList(studentIds)
                };

                return Ok(overview);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching teacher statistics", error = ex.Message });
            }
        }

        // GET: api/Statistics/parent/{parentId}/overview
        [HttpGet("parent/{parentId}/overview")]
        public async Task<IActionResult> GetParentStatisticsOverview(int parentId)
        {
            try
            {
                var parent = await _context.Parents
                    .Include(p => p.User)
                    .FirstOrDefaultAsync(p => p.Id == parentId);

                if (parent == null)
                    return NotFound(new { message = "Parent not found" });

                var studentIds = await _context.ParentStudents
                    .Where(ps => ps.ParentId == parentId)
                    .Select(ps => ps.StudentId)
                    .ToListAsync();

                var childrenPerformance = new List<object>();
                foreach (var studentId in studentIds)
                {
                    var student = await _context.Students
                        .Include(s => s.User)
                        .Include(s => s.Statistics)
                        .FirstOrDefaultAsync(s => s.Id == studentId);

                    if (student != null)
                    {
                        await UpdateStudentStatistics(studentId);
                        await _context.Entry(student).ReloadAsync();

                        childrenPerformance.Add(new
                        {
                            studentId = student.Id,
                            studentName = student.User.Name,
                            gradeLevel = student.GradeLevel,
                            lessonsCompleted = student.Statistics?.TotalLessonsCompleted ?? 0,
                            practiceCompleted = student.Statistics?.TotalPracticeCompleted ?? 0,
                            averageScore = Math.Round(student.Statistics?.AverageScore ?? 0, 2),
                            badgesEarned = student.Statistics?.TotalBadgesEarned ?? 0,
                            lastActivityDate = student.Statistics?.LastActivityDate,
                            currentStreak = student.Statistics?.CurrentStreak ?? 0
                        });
                    }
                }

                return Ok(new
                {
                    parentId = parent.Id,
                    parentName = parent.User.Name,
                    totalChildren = studentIds.Count,
                    childrenPerformance = childrenPerformance
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching parent statistics", error = ex.Message });
            }
        }

        // POST: api/Statistics/student/{studentId}/update
        [HttpPost("student/{studentId}/update")]
        public async Task<IActionResult> UpdateStudentStatisticsManually(int studentId)
        {
            try
            {
                await UpdateStudentStatistics(studentId);
                return Ok(new { message = "Statistics updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating statistics", error = ex.Message });
            }
        }

        // Private helper methods
        private async Task InitializeStudentStatistics(int studentId)
        {
            var existingStats = await _context.StudentStatistics
                .FirstOrDefaultAsync(ss => ss.StudentId == studentId);

            if (existingStats == null)
            {
                var statistics = new StudentStatistics
                {
                    StudentId = studentId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.StudentStatistics.Add(statistics);
                await _context.SaveChangesAsync();
            }
        }

        private async Task UpdateStudentStatistics(int studentId)
        {
            var statistics = await _context.StudentStatistics
                .FirstOrDefaultAsync(ss => ss.StudentId == studentId);

            if (statistics == null)
            {
                await InitializeStudentStatistics(studentId);
                statistics = await _context.StudentStatistics
                    .FirstOrDefaultAsync(ss => ss.StudentId == studentId);
            }

            if (statistics != null)
            {
                // Update lesson statistics
                var lessonStats = await _context.StudentLessons
                    .Where(sl => sl.StudentId == studentId)
                    .ToListAsync();

                statistics.TotalLessonsCheckedOut = lessonStats.Count;
                statistics.TotalLessonsStarted = lessonStats.Count(sl => sl.StartedAt != null);
                statistics.TotalLessonsCompleted = lessonStats.Count(sl => sl.CompletedAt != null);

                // Update practice material statistics
                var practiceStats = await _context.StudentPracticeMaterials
                    .Where(spm => spm.StudentId == studentId)
                    .ToListAsync();

                statistics.TotalPracticeStarted = practiceStats.Count(spm => spm.StartedAt != null);
                statistics.TotalPracticeCompleted = practiceStats.Count(spm => spm.CompletedAt != null);

                // Update digital library statistics
                var libraryStats = await _context.DigitalLibraryAssignments
                    .Where(dla => dla.StudentId == studentId)
                    .ToListAsync();

                statistics.TotalLibraryAssignments = libraryStats.Count;
                statistics.TotalLibraryCompleted = libraryStats.Count(dla => dla.CompletedAt != null);

                // Update score statistics
                var completedLessons = lessonStats.Where(sl => sl.CompletedAt != null && sl.Score != null).ToList();
                var completedPractice = practiceStats.Where(spm => spm.CompletedAt != null && spm.Score != null).ToList();

                var allScores = new List<int>();
                allScores.AddRange(completedLessons.Select(sl => sl.Score!.Value));
                allScores.AddRange(completedPractice.Select(spm => spm.Score!.Value));

                statistics.AverageScore = allScores.Any() ? allScores.Average() : 0;
                statistics.TotalQuestionsAnswered = completedLessons.Sum(sl => sl.TotalQuestions);
                statistics.TotalCorrectAnswers = completedLessons.Sum(sl => sl.CorrectAnswers);

                // Update last activity date
                var lastActivity = new List<DateTime?>();
                if (lessonStats.Any()) lastActivity.Add(lessonStats.Max(sl => sl.CompletedAt));
                if (practiceStats.Any()) lastActivity.Add(practiceStats.Max(spm => spm.CompletedAt));

                statistics.LastActivityDate = lastActivity.Where(d => d != null).Any() 
                    ? lastActivity.Where(d => d != null).Max() 
                    : null;

                // Update badge count
                statistics.TotalBadgesEarned = await _context.StudentBadges
                    .Where(sb => sb.StudentId == studentId)
                    .CountAsync();

                statistics.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                // Check and award new badges
                await CheckAndAwardBadges(studentId);
            }
        }

        private async Task CheckAndAwardBadges(int studentId)
        {
            var statistics = await _context.StudentStatistics
                .FirstOrDefaultAsync(ss => ss.StudentId == studentId);

            if (statistics == null) return;

            // Ensure badges exist
            await EnsureBadgesExist();

            // Check for First Lesson badge
            if (statistics.TotalLessonsCompleted >= 1)
            {
                await AwardBadgeIfNotExists(studentId, BadgeType.FirstLesson);
            }

            // Check for Ten Lessons badge
            if (statistics.TotalLessonsCompleted >= 10)
            {
                await AwardBadgeIfNotExists(studentId, BadgeType.TenLessons);
            }

            // Check for Perfect Score badge (100% on any lesson)
            var hasPerfectScore = await _context.StudentLessons
                .AnyAsync(sl => sl.StudentId == studentId && sl.Score == 100);

            if (hasPerfectScore)
            {
                await AwardBadgeIfNotExists(studentId, BadgeType.PerfectScore);
            }
        }

        private async Task EnsureBadgesExist()
        {
            var existingBadges = await _context.Badges.ToListAsync();
            var badgesToAdd = new List<Badge>();

            if (!existingBadges.Any(b => b.Type == BadgeType.FirstLesson))
            {
                badgesToAdd.Add(new Badge
                {
                    Name = "First Steps",
                    Description = "Completed your first lesson!",
                    Type = BadgeType.FirstLesson,
                    CreatedAt = DateTime.UtcNow
                });
            }

            if (!existingBadges.Any(b => b.Type == BadgeType.TenLessons))
            {
                badgesToAdd.Add(new Badge
                {
                    Name = "Dedicated Learner",
                    Description = "Completed 10 lessons!",
                    Type = BadgeType.TenLessons,
                    CreatedAt = DateTime.UtcNow
                });
            }

            if (!existingBadges.Any(b => b.Type == BadgeType.PerfectScore))
            {
                badgesToAdd.Add(new Badge
                {
                    Name = "Perfect!",
                    Description = "Achieved a perfect score!",
                    Type = BadgeType.PerfectScore,
                    CreatedAt = DateTime.UtcNow
                });
            }

            if (badgesToAdd.Any())
            {
                _context.Badges.AddRange(badgesToAdd);
                await _context.SaveChangesAsync();
            }
        }

        private async Task AwardBadgeIfNotExists(int studentId, BadgeType badgeType)
        {
            var badge = await _context.Badges
                .FirstOrDefaultAsync(b => b.Type == badgeType);

            if (badge != null)
            {
                var existingAward = await _context.StudentBadges
                    .FirstOrDefaultAsync(sb => sb.StudentId == studentId && sb.BadgeId == badge.Id);

                if (existingAward == null)
                {
                    var studentBadge = new StudentBadge
                    {
                        StudentId = studentId,
                        BadgeId = badge.Id,
                        EarnedAt = DateTime.UtcNow
                    };

                    _context.StudentBadges.Add(studentBadge);
                    await _context.SaveChangesAsync();
                }
            }
        }

        private async Task<List<object>> GetStudentPerformanceList(List<int> studentIds)
        {
            var performanceList = new List<object>();

            foreach (var studentId in studentIds)
            {
                var student = await _context.Students
                    .Include(s => s.User)
                    .Include(s => s.Statistics)
                    .FirstOrDefaultAsync(s => s.Id == studentId);

                if (student != null)
                {
                    await UpdateStudentStatistics(studentId);
                    await _context.Entry(student).ReloadAsync();

                    var completedLessons = await _context.StudentLessons
                        .Where(sl => sl.StudentId == studentId && sl.CompletedAt != null)
                        .CountAsync();

                    var averageScore = await _context.StudentLessons
                        .Where(sl => sl.StudentId == studentId && sl.Score != null)
                        .AverageAsync(sl => (double?)sl.Score) ?? 0;

                    performanceList.Add(new
                    {
                        studentId = student.Id,
                        studentName = student.User.Name,
                        gradeLevel = student.GradeLevel,
                        lessonsCompleted = completedLessons,
                        averageScore = Math.Round(averageScore, 2),
                        lastActivityDate = student.Statistics?.LastActivityDate
                    });
                }
            }

            return performanceList;
        }
    }
}

