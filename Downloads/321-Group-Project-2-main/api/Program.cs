using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Services;
using DotNetEnv;

// Load environment variables from .env file if it exists
try { Env.Load(); } catch { /* .env file not required */ }

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
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
}
