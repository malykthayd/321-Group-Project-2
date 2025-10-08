using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;

namespace api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProgressController : ControllerBase
{
    private readonly string _connectionString;

    public ProgressController(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
    }

    // GET: api/progress/{userId}
    [HttpGet("{userId}")]
    public async Task<ActionResult<UserProgress>> GetUserProgress(string userId)
    {
        using (var connection = new SqliteConnection(_connectionString))
        {
            await connection.OpenAsync();
            
            var command = new SqliteCommand(@"
                SELECT UserId, TotalPoints, CompletedLessons, CurrentStreak, Accuracy, StudyTime
                FROM UserProgress WHERE UserId = @userId
            ", connection);
            command.Parameters.AddWithValue("@userId", userId);
            
            using var reader = await command.ExecuteReaderAsync();
            
            if (await reader.ReadAsync())
            {
                return Ok(new UserProgress
                {
                    UserId = reader.GetString(0),
                    TotalPoints = reader.GetInt32(1),
                    CompletedLessons = reader.GetInt32(2),
                    CurrentStreak = reader.GetInt32(3),
                    Accuracy = reader.GetDouble(4),
                    StudyTime = reader.GetString(5)
                });
            }
        }
        
        return NotFound();
    }

    // POST: api/progress
    [HttpPost]
    public async Task<ActionResult<UserProgress>> CreateOrUpdateProgress([FromBody] CreateProgressRequest request)
    {
        using (var connection = new SqliteConnection(_connectionString))
        {
            await connection.OpenAsync();
            
            // Check if progress exists
            var checkCommand = new SqliteCommand("SELECT COUNT(*) FROM UserProgress WHERE UserId = @userId", connection);
            checkCommand.Parameters.AddWithValue("@userId", request.UserId);
            var exists = Convert.ToInt32(await checkCommand.ExecuteScalarAsync()) > 0;
            
            SqliteCommand command;
            
            if (exists)
            {
                // Update existing progress
                command = new SqliteCommand(@"
                    UPDATE UserProgress 
                    SET TotalPoints = @totalPoints, CompletedLessons = @completedLessons, 
                        CurrentStreak = @currentStreak, Accuracy = @accuracy, StudyTime = @studyTime,
                        UpdatedAt = @updatedAt
                    WHERE UserId = @userId
                ", connection);
            }
            else
            {
                // Create new progress record
                command = new SqliteCommand(@"
                    INSERT INTO UserProgress (UserId, TotalPoints, CompletedLessons, CurrentStreak, Accuracy, StudyTime, CreatedAt, UpdatedAt)
                    VALUES (@userId, @totalPoints, @completedLessons, @currentStreak, @accuracy, @studyTime, @createdAt, @updatedAt)
                ", connection);
                command.Parameters.AddWithValue("@createdAt", DateTime.UtcNow);
            }
            
            command.Parameters.AddWithValue("@userId", request.UserId);
            command.Parameters.AddWithValue("@totalPoints", request.TotalPoints);
            command.Parameters.AddWithValue("@completedLessons", request.CompletedLessons);
            command.Parameters.AddWithValue("@currentStreak", request.CurrentStreak);
            command.Parameters.AddWithValue("@accuracy", request.Accuracy);
            command.Parameters.AddWithValue("@studyTime", request.StudyTime);
            command.Parameters.AddWithValue("@updatedAt", DateTime.UtcNow);
            
            await command.ExecuteNonQueryAsync();
        }
        
        var progress = new UserProgress
        {
            UserId = request.UserId,
            TotalPoints = request.TotalPoints,
            CompletedLessons = request.CompletedLessons,
            CurrentStreak = request.CurrentStreak,
            Accuracy = request.Accuracy,
            StudyTime = request.StudyTime
        };
        
        return Ok(progress);
    }

    // GET: api/progress/{userId}/lessons/{lessonId}
    [HttpGet("{userId}/lessons/{lessonId}")]
    public async Task<ActionResult<LessonProgress>> GetLessonProgress(string userId, string lessonId)
    {
        using (var connection = new SqliteConnection(_connectionString))
        {
            await connection.OpenAsync();
            
            var command = new SqliteCommand(@"
                SELECT UserId, LessonId, Completed, Score, TimeSpent, Attempts, CompletedAt
                FROM LessonProgress WHERE UserId = @userId AND LessonId = @lessonId
            ", connection);
            command.Parameters.AddWithValue("@userId", userId);
            command.Parameters.AddWithValue("@lessonId", lessonId);
            
            using var reader = await command.ExecuteReaderAsync();
            
            if (await reader.ReadAsync())
            {
                return Ok(new LessonProgress
                {
                    UserId = reader.GetString(0),
                    LessonId = reader.GetString(1),
                    Completed = reader.GetBoolean(2),
                    Score = reader.GetInt32(3),
                    TimeSpent = reader.GetInt32(4),
                    Attempts = reader.GetInt32(5),
                    CompletedAt = reader.IsDBNull(6) ? null : reader.GetDateTime(6)
                });
            }
        }
        
        return NotFound();
    }

    // POST: api/progress/{userId}/lessons/{lessonId}
    [HttpPost("{userId}/lessons/{lessonId}")]
    public async Task<ActionResult<LessonProgress>> UpdateLessonProgress(string userId, string lessonId, [FromBody] CreateLessonProgressRequest request)
    {
        using (var connection = new SqliteConnection(_connectionString))
        {
            await connection.OpenAsync();
            
            // Check if lesson progress exists
            var checkCommand = new SqliteCommand(@"
                SELECT COUNT(*) FROM LessonProgress WHERE UserId = @userId AND LessonId = @lessonId
            ", connection);
            checkCommand.Parameters.AddWithValue("@userId", userId);
            checkCommand.Parameters.AddWithValue("@lessonId", lessonId);
            var exists = Convert.ToInt32(await checkCommand.ExecuteScalarAsync()) > 0;
            
            SqliteCommand command;
            
            if (exists)
            {
                // Update existing lesson progress
                command = new SqliteCommand(@"
                    UPDATE LessonProgress 
                    SET Completed = @completed, Score = @score, TimeSpent = @timeSpent, 
                        Attempts = @attempts, CompletedAt = @completedAt, UpdatedAt = @updatedAt
                    WHERE UserId = @userId AND LessonId = @lessonId
                ", connection);
            }
            else
            {
                // Create new lesson progress record
                command = new SqliteCommand(@"
                    INSERT INTO LessonProgress (UserId, LessonId, Completed, Score, TimeSpent, Attempts, CompletedAt, CreatedAt, UpdatedAt)
                    VALUES (@userId, @lessonId, @completed, @score, @timeSpent, @attempts, @completedAt, @createdAt, @updatedAt)
                ", connection);
                command.Parameters.AddWithValue("@createdAt", DateTime.UtcNow);
            }
            
            command.Parameters.AddWithValue("@userId", userId);
            command.Parameters.AddWithValue("@lessonId", lessonId);
            command.Parameters.AddWithValue("@completed", request.Completed);
            command.Parameters.AddWithValue("@score", request.Score);
            command.Parameters.AddWithValue("@timeSpent", request.TimeSpent);
            command.Parameters.AddWithValue("@attempts", request.Attempts);
            command.Parameters.AddWithValue("@completedAt", request.Completed ? DateTime.UtcNow : (object)DBNull.Value);
            command.Parameters.AddWithValue("@updatedAt", DateTime.UtcNow);
            
            await command.ExecuteNonQueryAsync();
        }
        
        var progress = new LessonProgress
        {
            UserId = userId,
            LessonId = lessonId,
            Completed = request.Completed,
            Score = request.Score,
            TimeSpent = request.TimeSpent,
            Attempts = request.Attempts,
            CompletedAt = request.Completed ? DateTime.UtcNow : null
        };
        
        return Ok(progress);
    }
}

public class UserProgress
{
    public string UserId { get; set; } = string.Empty;
    public int TotalPoints { get; set; }
    public int CompletedLessons { get; set; }
    public int CurrentStreak { get; set; }
    public double Accuracy { get; set; }
    public string StudyTime { get; set; } = string.Empty;
}

public class LessonProgress
{
    public string UserId { get; set; } = string.Empty;
    public string LessonId { get; set; } = string.Empty;
    public bool Completed { get; set; }
    public int Score { get; set; }
    public int TimeSpent { get; set; }
    public int Attempts { get; set; }
    public DateTime? CompletedAt { get; set; }
}

public class CreateProgressRequest
{
    public string UserId { get; set; } = string.Empty;
    public int TotalPoints { get; set; }
    public int CompletedLessons { get; set; }
    public int CurrentStreak { get; set; }
    public double Accuracy { get; set; }
    public string StudyTime { get; set; } = string.Empty;
}

public class CreateLessonProgressRequest
{
    public bool Completed { get; set; }
    public int Score { get; set; }
    public int TimeSpent { get; set; }
    public int Attempts { get; set; }
}