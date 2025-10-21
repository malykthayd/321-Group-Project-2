# MySQL Migration Guide

## Current Status
Your Accessible Quality Education website has been successfully migrated from raw SQLite to Entity Framework Core with MySQL. The database is now running on MySQL with proper Entity Framework integration.

## What Was Changed

### 1. Project Structure
- **Models**: Created proper Entity Framework models in `/Models/` directory
  - `User.cs` - Main user entity
  - `Student.cs` - Student-specific data
  - `Teacher.cs` - Teacher-specific data  
  - `Parent.cs` - Parent-specific data
  - `Admin.cs` - Admin-specific data

- **DbContext**: Created `AQEDbContext.cs` in `/Data/` directory with proper relationships and seed data

### 2. Dependencies
- Added Entity Framework Core packages:
  - `Microsoft.EntityFrameworkCore.SqlServer` (for future SQL Server use)
  - `Microsoft.EntityFrameworkCore.Sqlite` (for future SQLite use)
  - `Pomelo.EntityFrameworkCore.MySql` (current MySQL support)
  - `Microsoft.EntityFrameworkCore.Tools` (for migrations)
  - `Microsoft.EntityFrameworkCore.Design` (for design-time support)

### 3. Code Changes
- **Program.cs**: Updated to use Entity Framework dependency injection
- **AuthController.cs**: Converted from raw SQL to Entity Framework LINQ queries
- **Database**: Migrated from manual SQL creation to Entity Framework migrations

## Current MySQL Setup

Your application is now configured to use MySQL with environment variable support:

### Connection Details
- **Server**: localhost:3306
- **Database**: AQEDatabase_Dev (development) / AQEDatabase (production)
- **User**: root
- **Password**: Set via `MYSQL_PASSWORD` environment variable (default: travonne04)

### Environment Configuration
- **Environment File**: `.env` (not committed to git)
- **Example File**: `env.example` (committed for team reference)
- **Setup Instructions**: `TEAM_SETUP.md` (detailed team setup guide)

### For Team Members
1. Copy `env.example` to `.env`
2. Set your MySQL password in `.env`
3. Run `dotnet ef database update`
4. Run `dotnet run`

## To Switch to SQL Server (Optional)

If you want to switch to SQL Server in the future:

### 1. Update Connection Strings
In `appsettings.json` and `appsettings.Development.json`, change:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER;Database=AQEDatabase;User Id=YOUR_USER;Password=YOUR_PASSWORD;TrustServerCertificate=true;MultipleActiveResultSets=true"
}
```

### 2. Update Program.cs
Change line 13-15 from:
```csharp
options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"), 
    new MySqlServerVersion(new Version(8, 0, 0)))
```
to:
```csharp
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
```

### 3. Create New Migration
```bash
dotnet ef migrations add SqlServerMigration
dotnet ef database update
```

### 4. Remove MySQL Package (Optional)
Remove `Pomelo.EntityFrameworkCore.MySql` from `api.csproj` if you no longer need MySQL support.

## Benefits of This Migration

1. **Type Safety**: Entity Framework provides compile-time type checking
2. **LINQ Support**: Write queries in C# instead of raw SQL
3. **Automatic Migrations**: Database schema changes are versioned and automated
4. **Relationship Management**: Proper foreign key relationships and navigation properties
5. **Easy Database Switching**: Can switch between SQLite and SQL Server with minimal code changes
6. **Better Performance**: Entity Framework includes query optimization and caching
7. **Maintainability**: Cleaner, more maintainable code structure

## Current Database Schema

The MySQL database now includes:
- **Users** table with proper constraints and indexes
- **Students**, **Teachers**, **Parents**, **Admins** tables with foreign key relationships
- **Seed data** for demo accounts
- **Proper indexes** for performance optimization
- **UTF8MB4 character set** for full Unicode support

All existing functionality has been preserved and tested. The API endpoints work exactly the same as before, but now use Entity Framework with MySQL instead of raw SQL with SQLite.

## MySQL Connection Details

You can connect to your MySQL database using:
- **MySQL Workbench**: Use the "Local instance 3306" connection
- **Connection String**: `Server=localhost;Port=3306;Database=AQEDatabase_Dev;Uid=root;Pwd=${MYSQL_PASSWORD:-travonne04};`
- **Database Name**: `AQEDatabase_Dev` (development) or `AQEDatabase` (production)
- **Password**: Set in your `.env` file as `MYSQL_PASSWORD=your_password`

## Team Collaboration

The project is now configured for easy team collaboration:

### What's Secure
- ✅ Passwords are in `.env` files (not committed to git)
- ✅ Each developer can use their own MySQL setup
- ✅ Environment variables are properly configured

### What's Shared
- ✅ Database schema (via migrations)
- ✅ Application code
- ✅ Setup instructions (`TEAM_SETUP.md`)
- ✅ Example configuration (`env.example`)

### For New Team Members
1. Clone the repository
2. Follow instructions in `TEAM_SETUP.md`
3. Copy `env.example` to `.env`
4. Set their MySQL password
5. Run the application
