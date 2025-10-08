using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LessonsController : ControllerBase
{
    private readonly string _connectionString;

    public LessonsController(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
    }

    // GET: api/lessons
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Lesson>>> GetLessons([FromQuery] string? subject = null, [FromQuery] string? difficulty = null)
    {
        var lessons = new List<Lesson>();
        
        using (var connection = new SqliteConnection(_connectionString))
        {
            await connection.OpenAsync();
            
            var query = "SELECT Id, Title, Description, Subject, Difficulty, Duration, Points FROM Lessons WHERE 1=1";
            var command = new SqliteCommand(query, connection);
            
            if (!string.IsNullOrEmpty(subject))
            {
                query += " AND Subject = @subject";
                command.Parameters.AddWithValue("@subject", subject);
            }
            
            if (!string.IsNullOrEmpty(difficulty))
            {
                query += " AND Difficulty = @difficulty";
                command.Parameters.AddWithValue("@difficulty", difficulty);
            }
            
            command.CommandText = query;
            
            using var reader = await command.ExecuteReaderAsync();
            
            while (await reader.ReadAsync())
            {
                lessons.Add(new Lesson
                {
                    Id = reader.GetString(0),
                    Title = reader.GetString(1),
                    Description = reader.GetString(2),
                    Subject = reader.GetString(3),
                    Difficulty = reader.GetString(4),
                    Duration = reader.GetInt32(5),
                    Points = reader.GetInt32(6)
                });
            }
        }
        
        return Ok(lessons);
    }

    // GET: api/lessons/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Lesson>> GetLesson(string id)
    {
        using (var connection = new SqliteConnection(_connectionString))
        {
            await connection.OpenAsync();
            
            var command = new SqliteCommand(@"
                SELECT Id, Title, Description, Subject, Difficulty, Duration, Points, Content
                FROM Lessons WHERE Id = @id
            ", connection);
            command.Parameters.AddWithValue("@id", id);
            
            using var reader = await command.ExecuteReaderAsync();
            
            if (await reader.ReadAsync())
            {
                return Ok(new Lesson
                {
                    Id = reader.GetString(0),
                    Title = reader.GetString(1),
                    Description = reader.GetString(2),
                    Subject = reader.GetString(3),
                    Difficulty = reader.GetString(4),
                    Duration = reader.GetInt32(5),
                    Points = reader.GetInt32(6),
                    Content = reader.IsDBNull(7) ? null : reader.GetString(7)
                });
            }
        }
        
        return NotFound();
    }

    // POST: api/lessons
    [HttpPost]
    public async Task<ActionResult<Lesson>> CreateLesson([FromBody] CreateLessonRequest request)
    {
        var lessonId = Guid.NewGuid().ToString();
        
        using (var connection = new SqliteConnection(_connectionString))
        {
            await connection.OpenAsync();
            
            var command = new SqliteCommand(@"
                INSERT INTO Lessons (Id, Title, Description, Subject, Difficulty, Duration, Points, Content, CreatedAt)
                VALUES (@id, @title, @description, @subject, @difficulty, @duration, @points, @content, @createdAt)
            ", connection);
            
            command.Parameters.AddWithValue("@id", lessonId);
            command.Parameters.AddWithValue("@title", request.Title);
            command.Parameters.AddWithValue("@description", request.Description);
            command.Parameters.AddWithValue("@subject", request.Subject);
            command.Parameters.AddWithValue("@difficulty", request.Difficulty);
            command.Parameters.AddWithValue("@duration", request.Duration);
            command.Parameters.AddWithValue("@points", request.Points);
            command.Parameters.AddWithValue("@content", request.Content ?? "");
            command.Parameters.AddWithValue("@createdAt", DateTime.UtcNow);
            
            await command.ExecuteNonQueryAsync();
        }
        
        var lesson = new Lesson
        {
            Id = lessonId,
            Title = request.Title,
            Description = request.Description,
            Subject = request.Subject,
            Difficulty = request.Difficulty,
            Duration = request.Duration,
            Points = request.Points,
            Content = request.Content
        };
        
        return CreatedAtAction(nameof(GetLesson), new { id = lessonId }, lesson);
    }

    // PUT: api/lessons/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateLesson(string id, [FromBody] UpdateLessonRequest request)
    {
        using (var connection = new SqliteConnection(_connectionString))
        {
            await connection.OpenAsync();
            
            var command = new SqliteCommand(@"
                UPDATE Lessons 
                SET Title = @title, Description = @description, Subject = @subject, 
                    Difficulty = @difficulty, Duration = @duration, Points = @points, Content = @content
                WHERE Id = @id
            ", connection);
            
            command.Parameters.AddWithValue("@id", id);
            command.Parameters.AddWithValue("@title", request.Title);
            command.Parameters.AddWithValue("@description", request.Description);
            command.Parameters.AddWithValue("@subject", request.Subject);
            command.Parameters.AddWithValue("@difficulty", request.Difficulty);
            command.Parameters.AddWithValue("@duration", request.Duration);
            command.Parameters.AddWithValue("@points", request.Points);
            command.Parameters.AddWithValue("@content", request.Content ?? "");
            
            var rowsAffected = await command.ExecuteNonQueryAsync();
            
            if (rowsAffected == 0)
            {
                return NotFound();
            }
        }
        
        return NoContent();
    }

    // DELETE: api/lessons/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLesson(string id)
    {
        using (var connection = new SqliteConnection(_connectionString))
        {
            await connection.OpenAsync();
            
            var command = new SqliteCommand("DELETE FROM Lessons WHERE Id = @id", connection);
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

public class Lesson
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Difficulty { get; set; } = string.Empty;
    public int Duration { get; set; }
    public int Points { get; set; }
    public string? Content { get; set; }
}

public class CreateLessonRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Difficulty { get; set; } = string.Empty;
    public int Duration { get; set; }
    public int Points { get; set; }
    public string? Content { get; set; }
}

public class UpdateLessonRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Difficulty { get; set; } = string.Empty;
    public int Duration { get; set; }
    public int Points { get; set; }
    public string? Content { get; set; }
}