using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeacherController : ControllerBase
    {
        private readonly AQEDbContext _context;

        public TeacherController(AQEDbContext context)
        {
            _context = context;
        }

        // GET: api/Teacher/{teacherId}/dashboard
        [HttpGet("{teacherId}/dashboard")]
        public async Task<IActionResult> GetDashboard(int teacherId)
        {
            try
            {
                var teacher = await _context.Teachers
                    .Include(t => t.User)
                    .FirstOrDefaultAsync(t => t.Id == teacherId);

                if (teacher == null)
                    return NotFound(new { message = "Teacher not found" });

                // Get students count
                var studentsCount = await _context.Students
                    .Where(s => s.TeacherId == teacherId)
                    .CountAsync();

                // Get practice materials count
                var practiceMaterialsCount = await _context.PracticeMaterials
                    .Where(pm => pm.TeacherId == teacherId && pm.IsActive)
                    .CountAsync();

                // Get completed assignments count
                var completedAssignments = await _context.StudentPracticeMaterials
                    .Where(spm => spm.PracticeMaterial.TeacherId == teacherId && spm.CompletedAt != null)
                    .CountAsync();

                // Get average scores
                var averageScore = await _context.StudentPracticeMaterials
                    .Where(spm => spm.PracticeMaterial.TeacherId == teacherId && spm.Score != null)
                    .AverageAsync(spm => spm.Score);

                var dashboard = new
                {
                    teacher = new
                    {
                        id = teacher.Id,
                        name = teacher.User.Name,
                        email = teacher.User.Email,
                        gradeLevelTaught = teacher.GradeLevelTaught,
                        subjectTaught = teacher.SubjectTaught
                    },
                    stats = new
                    {
                        totalStudents = studentsCount,
                        totalPracticeMaterials = practiceMaterialsCount,
                        completedAssignments = completedAssignments,
                        averageScore = averageScore != null ? Math.Round(averageScore.Value, 2) : 0
                    },
                    recentActivity = await GetRecentActivity(teacherId)
                };

                return Ok(dashboard);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching dashboard data", error = ex.Message });
            }
        }

        // GET: api/Teacher/{teacherId}/students
        [HttpGet("{teacherId}/students")]
        public async Task<IActionResult> GetStudents(int teacherId)
        {
            try
            {
                var students = await _context.Students
                    .Where(s => s.TeacherId == teacherId)
                    .Include(s => s.User)
                    .Select(s => new
                    {
                        id = s.Id,
                        name = s.User.Name,
                        email = s.User.Email,
                        gradeLevel = s.GradeLevel,
                        accessCode = s.AccessCode,
                        createdAt = s.User.CreatedAt,
                        lastLogin = s.User.LastLogin
                    })
                    .ToListAsync();

                return Ok(students);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching students", error = ex.Message });
            }
        }

        // POST: api/Teacher/{teacherId}/students
        [HttpPost("{teacherId}/students")]
        public async Task<IActionResult> AddStudent(int teacherId, [FromBody] AddStudentRequest request)
        {
            try
            {
                var teacher = await _context.Teachers
                    .Include(t => t.User)
                    .FirstOrDefaultAsync(t => t.Id == teacherId);

                if (teacher == null)
                    return NotFound(new { message = "Teacher not found" });

                // Check if student already exists
                var existingStudent = await _context.Students
                    .Include(s => s.User)
                    .FirstOrDefaultAsync(s => s.User.Name == request.Name && s.TeacherId == teacherId);

                if (existingStudent != null)
                    return BadRequest(new { message = "Student already exists in your class" });

                // Generate 6-digit access code
                var accessCode = GenerateAccessCode();

                // Create new user for student
                var user = new User
                {
                    Name = request.Name,
                    Email = $"{request.Name.Replace(" ", "").ToLower()}@student.local", // Temporary email
                    Password = accessCode, // Access code is the password
                    Role = "student",
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Create student record
                var student = new Student
                {
                    UserId = user.Id,
                    GradeLevel = request.GradeLevel, // Use the specific grade level provided
                    AccessCode = accessCode,
                    TeacherId = teacherId
                };

                _context.Students.Add(student);
                await _context.SaveChangesAsync();

                var response = new
                {
                    id = student.Id,
                    name = user.Name,
                    email = user.Email,
                    gradeLevel = student.GradeLevel,
                    accessCode = accessCode,
                    createdAt = user.CreatedAt
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while adding student", error = ex.Message });
            }
        }

        // POST: api/Teacher/{teacherId}/students/{studentId}/regenerate-access-code
        [HttpPost("{teacherId}/students/{studentId}/regenerate-access-code")]
        public async Task<IActionResult> RegenerateAccessCode(int teacherId, int studentId)
        {
            try
            {
                var student = await _context.Students
                    .Include(s => s.User)
                    .FirstOrDefaultAsync(s => s.Id == studentId && s.TeacherId == teacherId);

                if (student == null)
                    return NotFound(new { message = "Student not found" });

                var newAccessCode = GenerateAccessCode();
                student.AccessCode = newAccessCode;
                student.User.Password = newAccessCode; // Update password as well

                await _context.SaveChangesAsync();

                return Ok(new { accessCode = newAccessCode });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while regenerating access code", error = ex.Message });
            }
        }

        // DELETE: api/Teacher/{teacherId}/students/{studentId}
        [HttpDelete("{teacherId}/students/{studentId}")]
        public async Task<IActionResult> DeleteStudent(int teacherId, int studentId)
        {
            try
            {
                var student = await _context.Students
                    .Include(s => s.User)
                    .FirstOrDefaultAsync(s => s.Id == studentId && s.TeacherId == teacherId);

                if (student == null)
                    return NotFound(new { message = "Student not found" });

                // Use a transaction to ensure all deletions happen atomically
                using var transaction = await _context.Database.BeginTransactionAsync();
                
                try
                {
                    // Remove all related records first
                    // Remove practice material assignments
                    var practiceAssignments = await _context.StudentPracticeMaterials
                        .Where(spm => spm.StudentId == studentId)
                        .ToListAsync();
                    _context.StudentPracticeMaterials.RemoveRange(practiceAssignments);

                    // Remove digital library assignments
                    var digitalAssignments = await _context.DigitalLibraryAssignments
                        .Where(dla => dla.StudentId == studentId)
                        .ToListAsync();
                    _context.DigitalLibraryAssignments.RemoveRange(digitalAssignments);

                    // Remove student badges
                    var studentBadges = await _context.StudentBadges
                        .Where(sb => sb.StudentId == studentId)
                        .ToListAsync();
                    _context.StudentBadges.RemoveRange(studentBadges);

                    // Remove student statistics
                    var studentStats = await _context.StudentStatistics
                        .Where(ss => ss.StudentId == studentId)
                        .ToListAsync();
                    _context.StudentStatistics.RemoveRange(studentStats);

                    // Remove parent-student relationships
                    var parentStudents = await _context.ParentStudents
                        .Where(ps => ps.StudentId == studentId)
                        .ToListAsync();
                    _context.ParentStudents.RemoveRange(parentStudents);

                    // Remove student lessons
                    var studentLessons = await _context.StudentLessons
                        .Where(sl => sl.StudentId == studentId)
                        .ToListAsync();
                    _context.StudentLessons.RemoveRange(studentLessons);

                    // Remove the student record
                    _context.Students.Remove(student);

                    // Remove the user account
                    _context.Users.Remove(student.User);

                    // Save all changes
                    await _context.SaveChangesAsync();
                    
                    // Commit the transaction
                    await transaction.CommitAsync();

                    return Ok(new { message = "Student deleted successfully" });
                }
                catch (Exception ex)
                {
                    // Rollback the transaction if something goes wrong
                    await transaction.RollbackAsync();
                    throw ex;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting student", error = ex.Message });
            }
        }

        // GET: api/Teacher/{teacherId}/practice-materials/{materialId}
        [HttpGet("{teacherId}/practice-materials/{materialId}")]
        public async Task<IActionResult> GetPracticeMaterial(int teacherId, int materialId)
        {
            try
            {
                var practiceMaterial = await _context.PracticeMaterials
                    .Where(pm => pm.Id == materialId && pm.TeacherId == teacherId && pm.IsActive)
                    .Include(pm => pm.Questions)
                    .Select(pm => new
                    {
                        id = pm.Id,
                        title = pm.Title,
                        description = pm.Description,
                        subject = pm.Subject,
                        questions = pm.Questions.OrderBy(q => q.Order).Select(q => new
                        {
                            id = q.Id,
                            questionText = q.QuestionText,
                            type = q.Type,
                            optionA = q.OptionA,
                            optionB = q.OptionB,
                            optionC = q.OptionC,
                            optionD = q.OptionD,
                            correctAnswer = q.CorrectAnswer,
                            explanation = q.Explanation,
                            order = q.Order
                        }).ToList(),
                        createdAt = pm.CreatedAt,
                        updatedAt = pm.UpdatedAt
                    })
                    .FirstOrDefaultAsync();

                if (practiceMaterial == null)
                    return NotFound(new { message = "Practice material not found" });

                return Ok(practiceMaterial);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching practice material", error = ex.Message });
            }
        }

        // GET: api/Teacher/{teacherId}/practice-materials
        [HttpGet("{teacherId}/practice-materials")]
        public async Task<IActionResult> GetPracticeMaterials(int teacherId)
        {
            try
            {
                var practiceMaterials = await _context.PracticeMaterials
                    .Where(pm => pm.TeacherId == teacherId && pm.IsActive)
                    .Include(pm => pm.Questions)
                    .Select(pm => new
                    {
                        id = pm.Id,
                        title = pm.Title,
                        description = pm.Description,
                        subject = pm.Subject,
                        questionCount = pm.Questions.Count,
                        createdAt = pm.CreatedAt,
                        updatedAt = pm.UpdatedAt
                    })
                    .ToListAsync();

                return Ok(practiceMaterials);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching practice materials", error = ex.Message });
            }
        }

        // POST: api/Teacher/{teacherId}/practice-materials
        [HttpPost("{teacherId}/practice-materials")]
        public async Task<IActionResult> CreatePracticeMaterial(int teacherId, [FromBody] CreatePracticeMaterialRequest request)
        {
            try
            {
                var teacher = await _context.Teachers.FindAsync(teacherId);
                if (teacher == null)
                    return NotFound(new { message = "Teacher not found" });

                var practiceMaterial = new PracticeMaterial
                {
                    Title = request.Title,
                    Description = request.Description,
                    Subject = request.Subject,
                    TeacherId = teacherId,
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                _context.PracticeMaterials.Add(practiceMaterial);
                await _context.SaveChangesAsync();

                // Add questions
                for (int i = 0; i < request.Questions.Count; i++)
                {
                    var questionRequest = request.Questions[i];
                    var question = new Question
                    {
                        PracticeMaterialId = practiceMaterial.Id,
                        QuestionText = questionRequest.QuestionText,
                        Type = questionRequest.Type,
                        OptionA = questionRequest.OptionA,
                        OptionB = questionRequest.OptionB,
                        OptionC = questionRequest.OptionC,
                        OptionD = questionRequest.OptionD,
                        CorrectAnswer = questionRequest.CorrectAnswer,
                        Explanation = questionRequest.Explanation,
                        Order = i + 1,
                        CreatedAt = DateTime.UtcNow
                    };

                    _context.Questions.Add(question);
                }

                await _context.SaveChangesAsync();

                return Ok(new { id = practiceMaterial.Id, message = "Practice material created successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating practice material", error = ex.Message });
            }
        }

        // PUT: api/Teacher/{teacherId}/practice-materials/{materialId}
        [HttpPut("{teacherId}/practice-materials/{materialId}")]
        public async Task<IActionResult> UpdatePracticeMaterial(int teacherId, int materialId, [FromBody] UpdatePracticeMaterialRequest request)
        {
            try
            {
                var practiceMaterial = await _context.PracticeMaterials
                    .Include(pm => pm.Questions)
                    .FirstOrDefaultAsync(pm => pm.Id == materialId && pm.TeacherId == teacherId);

                if (practiceMaterial == null)
                    return NotFound(new { message = "Practice material not found" });

                // Update practice material properties
                practiceMaterial.Title = request.Title;
                practiceMaterial.Description = request.Description;
                practiceMaterial.Subject = request.Subject;
                practiceMaterial.UpdatedAt = DateTime.UtcNow;

                // Remove existing questions
                _context.Questions.RemoveRange(practiceMaterial.Questions);

                // Add new questions
                for (int i = 0; i < request.Questions.Count; i++)
                {
                    var questionRequest = request.Questions[i];
                    var question = new Question
                    {
                        PracticeMaterialId = practiceMaterial.Id,
                        QuestionText = questionRequest.QuestionText,
                        Type = questionRequest.Type,
                        OptionA = questionRequest.OptionA,
                        OptionB = questionRequest.OptionB,
                        OptionC = questionRequest.OptionC,
                        OptionD = questionRequest.OptionD,
                        CorrectAnswer = questionRequest.CorrectAnswer,
                        Explanation = questionRequest.Explanation,
                        Order = i + 1,
                        CreatedAt = DateTime.UtcNow
                    };

                    _context.Questions.Add(question);
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Practice material updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating practice material", error = ex.Message });
            }
        }

        // POST: api/Teacher/{teacherId}/practice-materials/{materialId}/assign
        [HttpPost("{teacherId}/practice-materials/{materialId}/assign")]
        public async Task<IActionResult> AssignPracticeMaterial(int teacherId, int materialId, [FromBody] AssignMaterialRequest request)
        {
            try
            {
                var practiceMaterial = await _context.PracticeMaterials
                    .FirstOrDefaultAsync(pm => pm.Id == materialId && pm.TeacherId == teacherId);

                if (practiceMaterial == null)
                    return NotFound(new { message = "Practice material not found" });

                var studentsToAssign = request.AssignToAllStudents 
                    ? await _context.Students.Where(s => s.TeacherId == teacherId).ToListAsync()
                    : await _context.Students.Where(s => request.StudentIds.Contains(s.Id) && s.TeacherId == teacherId).ToListAsync();

                foreach (var student in studentsToAssign)
                {
                    var existingAssignment = await _context.StudentPracticeMaterials
                        .FirstOrDefaultAsync(spm => spm.StudentId == student.Id && spm.PracticeMaterialId == materialId);

                    if (existingAssignment == null)
                    {
                        var assignment = new StudentPracticeMaterial
                        {
                            StudentId = student.Id,
                            PracticeMaterialId = materialId,
                            AssignedAt = DateTime.UtcNow
                        };

                        _context.StudentPracticeMaterials.Add(assignment);
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Practice material assigned successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while assigning practice material", error = ex.Message });
            }
        }

        // GET: api/Teacher/{teacherId}/digital-library
        [HttpGet("{teacherId}/digital-library")]
        public async Task<IActionResult> GetDigitalLibrary(int teacherId)
        {
            try
            {
                var teacher = await _context.Teachers.FindAsync(teacherId);
                if (teacher == null)
                    return NotFound(new { message = "Teacher not found" });

                var digitalLibraries = await _context.DigitalLibraries
                    .Where(dl => dl.IsActive && dl.IsAvailable && dl.GradeLevel == teacher.GradeLevelTaught)
                    .Include(dl => dl.Admin)
                    .ThenInclude(a => a.User)
                    .Select(dl => new
                    {
                        id = dl.Id,
                        title = dl.Title,
                        description = dl.Description,
                        subject = dl.Subject,
                        gradeLevel = dl.GradeLevel,
                        content = dl.Content,
                        resourceUrl = dl.ResourceUrl,
                        tags = dl.Tags,
                        createdBy = dl.Admin.User.Name,
                        createdAt = dl.CreatedAt
                    })
                    .ToListAsync();

                return Ok(digitalLibraries);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching digital library", error = ex.Message });
            }
        }

        // POST: api/Teacher/{teacherId}/digital-library/{libraryId}/assign
        [HttpPost("{teacherId}/digital-library/{libraryId}/assign")]
        public async Task<IActionResult> AssignDigitalLibraryLesson(int teacherId, int libraryId, [FromBody] AssignMaterialRequest request)
        {
            try
            {
                var digitalLibrary = await _context.DigitalLibraries
                    .FirstOrDefaultAsync(dl => dl.Id == libraryId && dl.IsActive && dl.IsAvailable);

                if (digitalLibrary == null)
                    return NotFound(new { message = "Digital library lesson not found" });

                var studentsToAssign = request.AssignToAllStudents 
                    ? await _context.Students.Where(s => s.TeacherId == teacherId).ToListAsync()
                    : await _context.Students.Where(s => request.StudentIds.Contains(s.Id) && s.TeacherId == teacherId).ToListAsync();

                foreach (var student in studentsToAssign)
                {
                    var existingAssignment = await _context.DigitalLibraryAssignments
                        .FirstOrDefaultAsync(dla => dla.StudentId == student.Id && dla.DigitalLibraryId == libraryId);

                    if (existingAssignment == null)
                    {
                        var assignment = new DigitalLibraryAssignment
                        {
                            StudentId = student.Id,
                            DigitalLibraryId = libraryId,
                            TeacherId = teacherId,
                            AssignedAt = DateTime.UtcNow
                        };

                        _context.DigitalLibraryAssignments.Add(assignment);
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Digital library lesson assigned successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while assigning digital library lesson", error = ex.Message });
            }
        }

        private async Task<object> GetRecentActivity(int teacherId)
        {
            var recentAssignments = await _context.StudentPracticeMaterials
                .Where(spm => spm.PracticeMaterial.TeacherId == teacherId)
                .Include(spm => spm.Student)
                .ThenInclude(s => s.User)
                .Include(spm => spm.PracticeMaterial)
                .OrderByDescending(spm => spm.AssignedAt)
                .Take(5)
                .Select(spm => new
                {
                    studentName = spm.Student.User.Name,
                    materialTitle = spm.PracticeMaterial.Title,
                    assignedAt = spm.AssignedAt,
                    completedAt = spm.CompletedAt,
                    score = spm.Score
                })
                .ToListAsync();

            return recentAssignments;
        }

        private string GenerateAccessCode()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString();
        }
    }

    // Request models
    public class AddStudentRequest
    {
        public string Name { get; set; } = string.Empty;
        public string GradeLevel { get; set; } = string.Empty; // Single grade level like "6th Grade", "7th Grade", etc.
    }

    public class UpdatePracticeMaterialRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public List<CreateQuestionRequest> Questions { get; set; } = new List<CreateQuestionRequest>();
    }

    public class CreatePracticeMaterialRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public List<CreateQuestionRequest> Questions { get; set; } = new List<CreateQuestionRequest>();
    }

    public class CreateQuestionRequest
    {
        public string QuestionText { get; set; } = string.Empty;
        public QuestionType Type { get; set; }
        public string? OptionA { get; set; }
        public string? OptionB { get; set; }
        public string? OptionC { get; set; }
        public string? OptionD { get; set; }
        public string CorrectAnswer { get; set; } = string.Empty;
        public string? Explanation { get; set; }
    }

    public class AssignMaterialRequest
    {
        public bool AssignToAllStudents { get; set; }
        public List<int> StudentIds { get; set; } = new List<int>();
    }
}
