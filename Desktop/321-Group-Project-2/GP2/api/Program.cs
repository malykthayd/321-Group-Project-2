using Microsoft.Data.Sqlite;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Add CORS for frontend access
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://127.0.0.1:3000", "file://")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// Initialize database
InitializeDatabase();

app.Run();

// Database initialization method
void InitializeDatabase()
{
    var connectionString = app.Configuration.GetConnectionString("DefaultConnection");
    
    using (var connection = new SqliteConnection(connectionString))
    {
        connection.Open();
        
        // Create Users table
        var createUsersTable = @"
            CREATE TABLE IF NOT EXISTS Users (
                Id TEXT PRIMARY KEY,
                Email TEXT NOT NULL UNIQUE,
                Name TEXT NOT NULL,
                Role TEXT NOT NULL,
                CreatedAt DATETIME NOT NULL
            )";
        
        using (var command = new SqliteCommand(createUsersTable, connection))
        {
            command.ExecuteNonQuery();
        }
        
        // Create Lessons table
        var createLessonsTable = @"
            CREATE TABLE IF NOT EXISTS Lessons (
                Id TEXT PRIMARY KEY,
                Title TEXT NOT NULL,
                Description TEXT NOT NULL,
                Subject TEXT NOT NULL,
                Difficulty TEXT NOT NULL,
                Duration INTEGER NOT NULL,
                Points INTEGER NOT NULL,
                Content TEXT,
                CreatedAt DATETIME NOT NULL
            )";
        
        using (var command = new SqliteCommand(createLessonsTable, connection))
        {
            command.ExecuteNonQuery();
        }
        
        // Create UserProgress table
        var createUserProgressTable = @"
            CREATE TABLE IF NOT EXISTS UserProgress (
                UserId TEXT PRIMARY KEY,
                TotalPoints INTEGER NOT NULL DEFAULT 0,
                CompletedLessons INTEGER NOT NULL DEFAULT 0,
                CurrentStreak INTEGER NOT NULL DEFAULT 0,
                Accuracy REAL NOT NULL DEFAULT 0.0,
                StudyTime TEXT NOT NULL DEFAULT '0h 0m',
                CreatedAt DATETIME NOT NULL,
                UpdatedAt DATETIME NOT NULL,
                FOREIGN KEY (UserId) REFERENCES Users (Id)
            )";
        
        using (var command = new SqliteCommand(createUserProgressTable, connection))
        {
            command.ExecuteNonQuery();
        }
        
        // Create LessonProgress table
        var createLessonProgressTable = @"
            CREATE TABLE IF NOT EXISTS LessonProgress (
                UserId TEXT NOT NULL,
                LessonId TEXT NOT NULL,
                Completed BOOLEAN NOT NULL DEFAULT FALSE,
                Score INTEGER NOT NULL DEFAULT 0,
                TimeSpent INTEGER NOT NULL DEFAULT 0,
                Attempts INTEGER NOT NULL DEFAULT 0,
                CompletedAt DATETIME,
                CreatedAt DATETIME NOT NULL,
                UpdatedAt DATETIME NOT NULL,
                PRIMARY KEY (UserId, LessonId),
                FOREIGN KEY (UserId) REFERENCES Users (Id),
                FOREIGN KEY (LessonId) REFERENCES Lessons (Id)
            )";
        
        using (var command = new SqliteCommand(createLessonProgressTable, connection))
        {
            command.ExecuteNonQuery();
        }
        
        // Insert sample data if tables are empty
        InsertSampleData(connection);
    }
}

// Insert sample data for demonstration
void InsertSampleData(SqliteConnection connection)
{
    // Check if Users table is empty
    var checkUsers = "SELECT COUNT(*) FROM Users";
    using (var command = new SqliteCommand(checkUsers, connection))
    {
        var userCount = Convert.ToInt32(command.ExecuteScalar());
        
        if (userCount == 0)
        {
            // Insert sample users
            var insertUsers = @"
                INSERT INTO Users (Id, Email, Name, Role, CreatedAt) VALUES
                ('student_001', 'student@demo.com', 'Alex Johnson', 'student', datetime('now')),
                ('teacher_001', 'teacher@demo.com', 'Dr. Sarah Williams', 'teacher', datetime('now')),
                ('parent_001', 'parent@demo.com', 'Michael Davis', 'parent', datetime('now')),
                ('admin_001', 'admin@demo.com', 'Jennifer Martinez', 'admin', datetime('now'))";
            
            using (var command2 = new SqliteCommand(insertUsers, connection))
            {
                command2.ExecuteNonQuery();
            }
        }
    }
    
    // Check if Lessons table is empty
    var checkLessons = "SELECT COUNT(*) FROM Lessons";
    using (var command = new SqliteCommand(checkLessons, connection))
    {
        var lessonCount = Convert.ToInt32(command.ExecuteScalar());
        
        if (lessonCount == 0)
        {
            // Insert sample lessons
            var insertLessons = @"
                INSERT INTO Lessons (Id, Title, Description, Subject, Difficulty, Duration, Points, Content, CreatedAt) VALUES
                ('math_001', 'Introduction to Algebra', 'Learn basic algebraic concepts and operations', 'Mathematics', 'Easy', 15, 50, 'Sample content', datetime('now')),
                ('science_001', 'Photosynthesis Process', 'Explore how plants convert sunlight into energy', 'Science', 'Medium', 20, 75, 'Sample content', datetime('now')),
                ('english_001', 'Creative Writing Basics', 'Learn storytelling techniques and character development', 'English Language Arts', 'Hard', 25, 100, 'Sample content', datetime('now'))";
            
            using (var command2 = new SqliteCommand(insertLessons, connection))
            {
                command2.ExecuteNonQuery();
            }
        }
    }
}
