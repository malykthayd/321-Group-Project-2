using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly string _connectionString;

    public UsersController(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
    }

    // GET: api/users
    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        var users = new List<User>();
        
        using (var connection = new SqliteConnection(_connectionString))
        {
            await connection.OpenAsync();
            
            var command = new SqliteCommand("SELECT Id, Email, Name, Role, CreatedAt FROM Users", connection);
            using var reader = await command.ExecuteReaderAsync();
            
            while (await reader.ReadAsync())
            {
                users.Add(new User
                {
                    Id = reader.GetString(0),
                    Email = reader.GetString(1),
                    Name = reader.GetString(2),
                    Role = reader.GetString(3),
                    CreatedAt = reader.GetDateTime(4)
                });
            }
        }
        
        return Ok(users);
    }

    // GET: api/users/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<User>> GetUser(string id)
    {
        using (var connection = new SqliteConnection(_connectionString))
        {
            await connection.OpenAsync();
            
            var command = new SqliteCommand("SELECT Id, Email, Name, Role, CreatedAt FROM Users WHERE Id = @id", connection);
            command.Parameters.AddWithValue("@id", id);
            
            using var reader = await command.ExecuteReaderAsync();
            
            if (await reader.ReadAsync())
            {
                return Ok(new User
                {
                    Id = reader.GetString(0),
                    Email = reader.GetString(1),
                    Name = reader.GetString(2),
                    Role = reader.GetString(3),
                    CreatedAt = reader.GetDateTime(4)
                });
            }
        }
        
        return NotFound();
    }

    // POST: api/users
    [HttpPost]
    public async Task<ActionResult<User>> CreateUser([FromBody] CreateUserRequest request)
    {
        var userId = Guid.NewGuid().ToString();
        
        using (var connection = new SqliteConnection(_connectionString))
        {
            await connection.OpenAsync();
            
            var command = new SqliteCommand(@"
                INSERT INTO Users (Id, Email, Name, Role, CreatedAt)
                VALUES (@id, @email, @name, @role, @createdAt)
            ", connection);
            
            command.Parameters.AddWithValue("@id", userId);
            command.Parameters.AddWithValue("@email", request.Email);
            command.Parameters.AddWithValue("@name", request.Name);
            command.Parameters.AddWithValue("@role", request.Role);
            command.Parameters.AddWithValue("@createdAt", DateTime.UtcNow);
            
            await command.ExecuteNonQueryAsync();
        }
        
        var user = new User
        {
            Id = userId,
            Email = request.Email,
            Name = request.Name,
            Role = request.Role,
            CreatedAt = DateTime.UtcNow
        };
        
        return CreatedAtAction(nameof(GetUser), new { id = userId }, user);
    }

    // PUT: api/users/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserRequest request)
    {
        using (var connection = new SqliteConnection(_connectionString))
        {
            await connection.OpenAsync();
            
            var command = new SqliteCommand(@"
                UPDATE Users 
                SET Name = @name, Role = @role
                WHERE Id = @id
            ", connection);
            
            command.Parameters.AddWithValue("@id", id);
            command.Parameters.AddWithValue("@name", request.Name);
            command.Parameters.AddWithValue("@role", request.Role);
            
            var rowsAffected = await command.ExecuteNonQueryAsync();
            
            if (rowsAffected == 0)
            {
                return NotFound();
            }
        }
        
        return NoContent();
    }

    // DELETE: api/users/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        using (var connection = new SqliteConnection(_connectionString))
        {
            await connection.OpenAsync();
            
            var command = new SqliteCommand("DELETE FROM Users WHERE Id = @id", connection);
            command.Parameters.AddWithValue("@id", id);
            
            var rowsAffected = await command.ExecuteNonQueryAsync();
            
            if (rowsAffected == 0)
            {
                return NotFound();
            }
        }
        
        return NoContent();
    }
}

public class User
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateUserRequest
{
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}

public class UpdateUserRequest
{
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}