using Microsoft.EntityFrameworkCore;
using api.Data;
using api.Services;
using DotNetEnv;

// Load environment variables from .env file
Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Entity Framework with MySQL
builder.Services.AddDbContext<AQEDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"), 
    new MySqlServerVersion(new Version(8, 0, 0))));

// Register SMS Gateway Provider based on configuration
var gatewayProvider = builder.Configuration["Gateway:Provider"] ?? "mock";
if (gatewayProvider.ToLower() == "twilio")
{
    builder.Services.AddScoped<IGatewayProvider, TwilioGatewayProvider>();
}
else
{
    builder.Services.AddScoped<IGatewayProvider, MockGatewayProvider>();
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
