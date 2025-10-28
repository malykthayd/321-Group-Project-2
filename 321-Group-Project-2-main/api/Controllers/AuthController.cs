using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Models;
using api.Helpers;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AQEDbContext _context;

        public AuthController(AQEDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                // Validate input
                if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                {
                    return BadRequest(new { message = "Email and password are required" });
                }

                if (request.Password.Length < 8)
                {
                    return BadRequest(new { message = "Password must be at least 8 characters long" });
                }

                // Check if user exists
                var user = await _context.Users
                    .Include(u => u.Student)
                    .Include(u => u.Teacher)
                    .Include(u => u.Parent)
                    .Include(u => u.Admin)
                    .FirstOrDefaultAsync(u => u.Email == request.Email && u.IsActive);

                // Verify password
                if (user == null || !PasswordHelper.VerifyPassword(request.Password, user.Password))
                {
                    return Unauthorized(new { message = "Invalid email or password" });
                }

                var userResponse = new
                {
                    id = user.Id,
                    name = user.Name,
                    email = user.Email,
                    role = user.Role,
                    lastLogin = user.LastLogin,
                    gradeLevel = user.Student?.GradeLevel,
                    subjectTaught = user.Teacher?.SubjectTaught,
                    gradeLevelTaught = user.Teacher?.GradeLevelTaught,
                    childrenEmails = user.Parent?.ChildrenEmails,
                    permissions = user.Admin?.Permissions,
                    teacherId = user.Teacher?.Id,
                    studentId = user.Student?.Id,
                    parentId = user.Parent?.Id,
                    adminId = user.Admin?.Id
                };

                // Update last login
                user.LastLogin = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Login successful", user = userResponse });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during login", error = ex.Message });
            }
        }

        [HttpPost("login-student-access-code")]
        public async Task<IActionResult> LoginStudentWithAccessCode([FromBody] StudentAccessCodeLoginRequest request)
        {
            try
            {
                // Validate input
                if (string.IsNullOrEmpty(request.Name) || string.IsNullOrEmpty(request.AccessCode))
                {
                    return BadRequest(new { message = "Name and access code are required" });
                }

                // Find student by name and access code
                var student = await _context.Students
                    .Include(s => s.User)
                    .Include(s => s.Teacher)
                    .FirstOrDefaultAsync(s => s.User.Name == request.Name && s.AccessCode == request.AccessCode);

                if (student != null)
                {
                    var userResponse = new
                    {
                        id = student.User.Id,
                        studentId = student.Id,
                        name = student.User.Name,
                        email = student.User.Email,
                        role = "student",
                        gradeLevel = student.GradeLevel,
                        accessCode = student.AccessCode,
                        teacherId = student.TeacherId,
                        isIndependent = student.IsIndependent,
                        lastLogin = student.User.LastLogin
                    };

                    // Update last login
                    student.User.LastLogin = DateTime.UtcNow;
                    await _context.SaveChangesAsync();

                    return Ok(new { message = "Login successful", user = userResponse });
                }
                else
                {
                    return Unauthorized(new { message = "Invalid name or access code" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during login", error = ex.Message });
            }
        }

        [HttpGet("demo-accounts")]
        public async Task<IActionResult> GetDemoAccounts()
        {
            try
            {
                var accounts = await _context.Users
                    .Include(u => u.Student)
                    .Include(u => u.Teacher)
                    .Include(u => u.Parent)
                    .OrderBy(u => u.Role)
                    .ThenBy(u => u.Name)
                    .Select(u => new
                    {
                        name = u.Name,
                        email = u.Email,
                        role = u.Role,
                        gradeLevel = u.Student != null ? u.Student.GradeLevel : null,
                        subjectTaught = u.Teacher != null ? u.Teacher.SubjectTaught : null,
                        gradeLevelTaught = u.Teacher != null ? u.Teacher.GradeLevelTaught : null,
                        childrenEmails = u.Parent != null ? u.Parent.ChildrenEmails : null
                    })
                    .ToListAsync();

                return Ok(accounts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching demo accounts", error = ex.Message });
            }
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // In a real application, you would invalidate the session/token here
            return Ok(new { message = "Logout successful" });
        }

        [HttpPost("register-teacher")]
        public async Task<IActionResult> RegisterTeacher([FromBody] RegisterTeacherRequest request)
        {
            try
            {
                // Validate input
                if (string.IsNullOrEmpty(request.Name) || string.IsNullOrEmpty(request.Email) || 
                    string.IsNullOrEmpty(request.Password) || string.IsNullOrEmpty(request.GradeLevelTaught))
                {
                    return BadRequest(new { message = "Name, email, password, and grade level are required" });
                }

                if (request.Password.Length < 8)
                {
                    return BadRequest(new { message = "Password must be at least 8 characters long" });
                }

                // Check if email already exists
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (existingUser != null)
                {
                    return BadRequest(new { message = "Email already exists" });
                }

                // Create new user
                var user = new User
                {
                    Name = request.Name,
                    Email = request.Email,
                    Password = PasswordHelper.HashPassword(request.Password),
                    Role = "teacher",
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Create teacher profile
                var teacher = new Teacher
                {
                    UserId = user.Id,
                    SubjectTaught = request.SubjectTaught ?? "General",
                    GradeLevelTaught = request.GradeLevelTaught
                };

                _context.Teachers.Add(teacher);
                await _context.SaveChangesAsync();

                var response = new
                {
                    id = user.Id,
                    teacherId = teacher.Id,
                    name = user.Name,
                    email = user.Email,
                    role = user.Role,
                    gradeLevelTaught = teacher.GradeLevelTaught,
                    subjectTaught = teacher.SubjectTaught,
                    message = "Teacher registered successfully"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during registration", error = ex.Message });
            }
        }

        [HttpPost("register-parent")]
        public async Task<IActionResult> RegisterParent([FromBody] RegisterParentRequest request)
        {
            try
            {
                // Validate input
                if (string.IsNullOrEmpty(request.Name) || string.IsNullOrEmpty(request.Email) || 
                    string.IsNullOrEmpty(request.Password) || request.Children == null || !request.Children.Any())
                {
                    return BadRequest(new { message = "Name, email, password, and at least one child are required" });
                }

                if (request.Password.Length < 8)
                {
                    return BadRequest(new { message = "Password must be at least 8 characters long" });
                }

                // Check if email already exists
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (existingUser != null)
                {
                    return BadRequest(new { message = "Email already exists" });
                }

                // Validate access codes for all children
                var validatedChildren = new List<object>();
                foreach (var child in request.Children)
                {
                    var student = await _context.Students
                        .Include(s => s.User)
                        .FirstOrDefaultAsync(s => s.User.Name == child.Name && s.AccessCode == child.AccessCode);
                    
                    if (student == null)
                    {
                        return BadRequest(new { message = $"Invalid access code for child: {child.Name}" });
                    }
                    
                    validatedChildren.Add(new { name = student.User.Name, studentId = student.Id });
                }

                // Create new user
                var user = new User
                {
                    Name = request.Name,
                    Email = request.Email,
                    Password = PasswordHelper.HashPassword(request.Password),
                    Role = "parent",
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Create parent profile
                var parent = new Parent
                {
                    UserId = user.Id,
                    ChildrenEmails = string.Join(",", request.Children.Select(c => c.Name))
                };

                _context.Parents.Add(parent);
                await _context.SaveChangesAsync();

                // Create parent-student relationships
                foreach (var child in request.Children)
                {
                    var student = await _context.Students
                        .FirstOrDefaultAsync(s => s.User.Name == child.Name && s.AccessCode == child.AccessCode);
                    
                    if (student != null)
                    {
                        var parentStudent = new ParentStudent
                        {
                            ParentId = parent.Id,
                            StudentId = student.Id,
                            LinkedAt = DateTime.UtcNow
                        };
                        _context.ParentStudents.Add(parentStudent);
                    }
                }
                await _context.SaveChangesAsync();

                var response = new
                {
                    id = user.Id,
                    parentId = parent.Id,
                    name = user.Name,
                    email = user.Email,
                    role = user.Role,
                    children = validatedChildren,
                    message = "Parent registered successfully"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during registration", error = ex.Message });
            }
        }

        [HttpPost("register-student")]
        public async Task<IActionResult> RegisterStudent([FromBody] RegisterStudentRequest request)
        {
            try
            {
                // Validate input
                if (string.IsNullOrEmpty(request.Name) || string.IsNullOrEmpty(request.Email) || 
                    string.IsNullOrEmpty(request.Password) || string.IsNullOrEmpty(request.GradeLevel))
                {
                    return BadRequest(new { message = "Name, email, password, and grade level are required" });
                }

                if (request.Password.Length < 8)
                {
                    return BadRequest(new { message = "Password must be at least 8 characters long" });
                }

                // Check if email already exists
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (existingUser != null)
                {
                    return BadRequest(new { message = "Email already exists" });
                }

                // Create new user
                var user = new User
                {
                    Name = request.Name,
                    Email = request.Email,
                    Password = PasswordHelper.HashPassword(request.Password),
                    Role = "student",
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Create student profile (independent student)
                var student = new Student
                {
                    UserId = user.Id,
                    GradeLevel = request.GradeLevel,
                    IsIndependent = true // Independent student, not part of a teacher's class
                };

                _context.Students.Add(student);
                await _context.SaveChangesAsync();

                var response = new
                {
                    id = user.Id,
                    studentId = student.Id,
                    name = user.Name,
                    email = user.Email,
                    role = user.Role,
                    gradeLevel = student.GradeLevel,
                    isIndependent = student.IsIndependent,
                    message = "Student registered successfully"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during registration", error = ex.Message });
            }
        }

        [HttpPost("register-admin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] RegisterAdminRequest request)
        {
            try
            {
                // Validate input
                if (string.IsNullOrEmpty(request.Name) || string.IsNullOrEmpty(request.Email) || 
                    string.IsNullOrEmpty(request.Password) || string.IsNullOrEmpty(request.AdminPassword))
                {
                    return BadRequest(new { message = "Name, email, password, and admin password are required" });
                }

                if (request.Password.Length < 8)
                {
                    return BadRequest(new { message = "Password must be at least 8 characters long" });
                }

                // Validate admin password
                if (request.AdminPassword != "admin")
                {
                    return BadRequest(new { message = "Invalid admin password" });
                }

                // Check if email already exists
                var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
                if (existingUser != null)
                {
                    return BadRequest(new { message = "Email already exists" });
                }

                // Create new user
                var user = new User
                {
                    Name = request.Name,
                    Email = request.Email,
                    Password = PasswordHelper.HashPassword(request.Password),
                    Role = "admin",
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // Create admin profile
                var admin = new Admin
                {
                    UserId = user.Id,
                    Permissions = "full"
                };

                _context.Admins.Add(admin);
                await _context.SaveChangesAsync();

                var response = new
                {
                    id = user.Id,
                    adminId = admin.Id,
                    name = user.Name,
                    email = user.Email,
                    role = user.Role,
                    permissions = admin.Permissions,
                    message = "Admin registered successfully"
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during registration", error = ex.Message });
            }
        }

        [HttpPost("validate-access-code")]
        public async Task<IActionResult> ValidateAccessCode([FromBody] ValidateAccessCodeRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.AccessCode))
                {
                    return BadRequest(new { message = "Access code is required" });
                }

                var student = await _context.Students
                    .Include(s => s.User)
                    .FirstOrDefaultAsync(s => s.AccessCode == request.AccessCode);

                if (student != null)
                {
                    return Ok(new { 
                        isValid = true, 
                        studentName = student.User.Name,
                        gradeLevel = student.GradeLevel,
                        message = "Access code is valid" 
                    });
                }
                else
                {
                    return Ok(new { 
                        isValid = false, 
                        message = "Invalid access code" 
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while validating access code", error = ex.Message });
            }
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterTeacherRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string GradeLevelTaught { get; set; } = string.Empty;
        public string? SubjectTaught { get; set; }
    }

    public class StudentAccessCodeLoginRequest
    {
        public string Name { get; set; } = string.Empty;
        public string AccessCode { get; set; } = string.Empty;
    }

    public class RegisterParentRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public List<ChildInfo> Children { get; set; } = new List<ChildInfo>();
    }

    public class ChildInfo
    {
        public string Name { get; set; } = string.Empty;
        public string AccessCode { get; set; } = string.Empty;
    }

    public class RegisterStudentRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string GradeLevel { get; set; } = string.Empty;
    }

    public class RegisterAdminRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string AdminPassword { get; set; } = string.Empty;
    }

    public class ValidateAccessCodeRequest
    {
        public string AccessCode { get; set; } = string.Empty;
    }
}
