using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Services;
using api.Services.Curriculum;
using DotNetEnv;

// Load environment variables from .env file if it exists
try { Env.Load(); } catch { /* .env file not required */ }

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
    });
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Entity Framework with SQLite
builder.Services.AddDbContext<AQEDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("SQLiteConnection")));

// Register SMS Gateway Provider based on configuration
        var gatewayProvider = builder.Configuration["Gateway:Provider"] ?? "mock";
        
        builder.Services.AddHttpClient();
        
        if (gatewayProvider.ToLower() == "twilio")
        {
            builder.Services.AddScoped<IGatewayProvider, TwilioGatewayProvider>();
        }
        else if (gatewayProvider.ToLower() == "africastalking")
        {
            builder.Services.AddScoped<IGatewayProvider, AfricasTalkingProvider>();
        }
        else
        {
            builder.Services.AddScoped<IGatewayProvider, MockGatewayProvider>();
        }

        // AI Provider
        var aiProvider = builder.Configuration["AI:Provider"] ?? "mock";
        if (aiProvider.ToLower() == "openai")
        {
            builder.Services.AddHttpClient<IAIProvider, OpenAIProvider>();
        }
        else
        {
            builder.Services.AddScoped<IAIProvider, MockAIProvider>();
        }

        // Curriculum Services
        builder.Services.AddScoped<ICurriculumGenerationService, CurriculumGenerationService>();
        builder.Services.AddScoped<IQuestionGenerator, QuestionGenerator>();

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
await InitializeDatabaseAsync();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Serve static files from the client directory
var clientPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "client");
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(clientPath),
    RequestPath = ""
});
app.UseDefaultFiles(new DefaultFilesOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(clientPath),
    RequestPath = ""
});

// Use CORS
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();

// Database initialization method
async Task InitializeDatabaseAsync()
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<AQEDbContext>();
    
    // Ensure database is created and migrations are applied
    await context.Database.EnsureCreatedAsync();
    
    // Seed subjects and grades if they don't exist
    await SeedSubjectsAndGradesAsync(context);
}

// Seed subjects and grades
async Task SeedSubjectsAndGradesAsync(AQEDbContext context)
{
    // Seed subjects
    var subjects = new[]
    {
        new api.Models.Curriculum.Subject { Slug = "english", Name = "English", Description = "Reading, writing, and communication skills" },
        new api.Models.Curriculum.Subject { Slug = "mathematics", Name = "Mathematics", Description = "Numbers, operations, and problem solving" },
        new api.Models.Curriculum.Subject { Slug = "technology", Name = "Technology", Description = "Computer science, digital literacy, and technology skills" },
        new api.Models.Curriculum.Subject { Slug = "science", Name = "Science", Description = "Natural world and scientific inquiry" },
        new api.Models.Curriculum.Subject { Slug = "geography", Name = "Geography", Description = "World geography, maps, and cultural studies" }
    };

    foreach (var subject in subjects)
    {
        if (!await context.Subjects.AnyAsync(s => s.Slug == subject.Slug))
        {
            context.Subjects.Add(subject);
        }
    }

    // Seed grades (K-8 only)
    var grades = new[]
    {
        new api.Models.Curriculum.Grade { Code = "K", DisplayName = "Kindergarten", SortOrder = 0 },
        new api.Models.Curriculum.Grade { Code = "1", DisplayName = "1st Grade", SortOrder = 1 },
        new api.Models.Curriculum.Grade { Code = "2", DisplayName = "2nd Grade", SortOrder = 2 },
        new api.Models.Curriculum.Grade { Code = "3", DisplayName = "3rd Grade", SortOrder = 3 },
        new api.Models.Curriculum.Grade { Code = "4", DisplayName = "4th Grade", SortOrder = 4 },
        new api.Models.Curriculum.Grade { Code = "5", DisplayName = "5th Grade", SortOrder = 5 },
        new api.Models.Curriculum.Grade { Code = "6", DisplayName = "6th Grade", SortOrder = 6 },
        new api.Models.Curriculum.Grade { Code = "7", DisplayName = "7th Grade", SortOrder = 7 },
        new api.Models.Curriculum.Grade { Code = "8", DisplayName = "8th Grade", SortOrder = 8 }
    };

    foreach (var grade in grades)
    {
        if (!await context.Grades.AnyAsync(g => g.Code == grade.Code))
        {
            context.Grades.Add(grade);
        }
    }

    await context.SaveChangesAsync();
}
