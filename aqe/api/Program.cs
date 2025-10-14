using Microsoft.Data.Sqlite;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Initialize database
InitializeDatabase();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Use CORS
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();

// Database initialization method
void InitializeDatabase()
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    using var connection = new SqliteConnection(connectionString);
    connection.Open();

    // Create tables and insert demo data
    var sql = @"
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'parent', 'admin')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_login DATETIME,
            is_active BOOLEAN DEFAULT 1
        );

        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            grade_level TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS teachers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            subject_taught TEXT NOT NULL,
            grade_level_taught TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS parents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            children_emails TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            permissions TEXT DEFAULT 'full',
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        INSERT OR REPLACE INTO users (id, name, email, password, role) VALUES
        (1, 'Demo Student', 'student@demo.com', 'student123', 'student'),
        (2, 'Demo Teacher', 'teacher@demo.com', 'teacher123', 'teacher'),
        (3, 'Demo Parent', 'parent@demo.com', 'parent123', 'parent'),
        (4, 'Demo Admin', 'admin@demo.com', 'admin123', 'admin');

        INSERT OR REPLACE INTO students (id, user_id, grade_level) VALUES
        (1, 1, '8th Grade');

        INSERT OR REPLACE INTO teachers (id, user_id, subject_taught, grade_level_taught) VALUES
        (1, 2, 'Mathematics', '6th-8th Grade');

        INSERT OR REPLACE INTO parents (id, user_id, children_emails) VALUES
        (1, 3, '[""student@demo.com""]');

        INSERT OR REPLACE INTO admins (id, user_id, permissions) VALUES
        (1, 4, '{""user_management"": true, ""content_management"": true, ""system_settings"": true, ""analytics"": true}');

        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
        CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
        CREATE INDEX IF NOT EXISTS idx_teachers_user_id ON teachers(user_id);
        CREATE INDEX IF NOT EXISTS idx_parents_user_id ON parents(user_id);
        CREATE INDEX IF NOT EXISTS idx_admins_user_id ON admins(user_id);
    ";

    using var command = new SqliteCommand(sql, connection);
    command.ExecuteNonQuery();
}
