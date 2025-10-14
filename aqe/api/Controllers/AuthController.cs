using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using System.Text.Json;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly string _connectionString;

        public AuthController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                using var connection = new SqliteConnection(_connectionString);
                await connection.OpenAsync();

                // Validate input
                if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                {
                    return BadRequest(new { message = "Email and password are required" });
                }

                if (request.Password.Length < 8)
                {
                    return BadRequest(new { message = "Password must be at least 8 characters long" });
                }

                // Check if user exists and password matches
                var query = @"
                    SELECT u.id, u.name, u.email, u.role, u.last_login,
                           s.grade_level,
                           t.subject_taught, t.grade_level_taught,
                           p.children_emails,
                           a.permissions
                    FROM users u
                    LEFT JOIN students s ON u.id = s.user_id
                    LEFT JOIN teachers t ON u.id = t.user_id
                    LEFT JOIN parents p ON u.id = p.user_id
                    LEFT JOIN admins a ON u.id = a.user_id
                    WHERE u.email = @email AND u.password = @password AND u.is_active = 1";

                using var command = new SqliteCommand(query, connection);
                command.Parameters.AddWithValue("@email", request.Email);
                command.Parameters.AddWithValue("@password", request.Password);

                using var reader = await command.ExecuteReaderAsync();
                
                if (await reader.ReadAsync())
                {
                    var user = new
                    {
                        id = reader.GetInt32(0),
                        name = reader.GetString(1),
                        email = reader.GetString(2),
                        role = reader.GetString(3),
                        lastLogin = reader.IsDBNull(4) ? (DateTime?)null : reader.GetDateTime(4),
                        gradeLevel = reader.IsDBNull(5) ? null : reader.GetString(5),
                        subjectTaught = reader.IsDBNull(6) ? null : reader.GetString(6),
                        gradeLevelTaught = reader.IsDBNull(7) ? null : reader.GetString(7),
                        childrenEmails = reader.IsDBNull(8) ? null : reader.GetString(8),
                        permissions = reader.IsDBNull(9) ? null : reader.GetString(9)
                    };

                    // Update last login
                    await UpdateLastLogin(connection, user.id);

                    return Ok(new { message = "Login successful", user });
                }
                else
                {
                    return Unauthorized(new { message = "Invalid email or password" });
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
                using var connection = new SqliteConnection(_connectionString);
                await connection.OpenAsync();

                var query = @"
                    SELECT u.name, u.email, u.role,
                           s.grade_level,
                           t.subject_taught, t.grade_level_taught,
                           p.children_emails
                    FROM users u
                    LEFT JOIN students s ON u.id = s.user_id
                    LEFT JOIN teachers t ON u.id = t.user_id
                    LEFT JOIN parents p ON u.id = p.user_id
                    ORDER BY u.role, u.name";

                using var command = new SqliteCommand(query, connection);
                using var reader = await command.ExecuteReaderAsync();

                var accounts = new List<object>();

                while (await reader.ReadAsync())
                {
                    var account = new
                    {
                        name = reader.GetString(0),
                        email = reader.GetString(1),
                        role = reader.GetString(2),
                        gradeLevel = reader.IsDBNull(3) ? null : reader.GetString(3),
                        subjectTaught = reader.IsDBNull(4) ? null : reader.GetString(4),
                        gradeLevelTaught = reader.IsDBNull(5) ? null : reader.GetString(5),
                        childrenEmails = reader.IsDBNull(6) ? null : reader.GetString(6)
                    };

                    accounts.Add(account);
                }

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

        private async Task UpdateLastLogin(SqliteConnection connection, int userId)
        {
            var updateQuery = "UPDATE users SET last_login = @lastLogin WHERE id = @userId";
            using var updateCommand = new SqliteCommand(updateQuery, connection);
            updateCommand.Parameters.AddWithValue("@lastLogin", DateTime.UtcNow);
            updateCommand.Parameters.AddWithValue("@userId", userId);
            await updateCommand.ExecuteNonQueryAsync();
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
