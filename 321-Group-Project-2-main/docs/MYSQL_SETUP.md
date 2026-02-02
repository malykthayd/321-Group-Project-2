# MySQL Database Setup Guide

## Prerequisites
- MySQL Server installed (via Homebrew: `brew install mysql`)
- MySQL service running (`brew services start mysql`)

## Step 1: Configure MySQL Root Access

### Option A: Reset Root Password
```bash
# Stop MySQL
brew services stop mysql

# Start MySQL in safe mode
sudo mysqld_safe --skip-grant-tables --skip-networking &

# Connect and reset password
mysql -u root
```

In MySQL console:
```sql
USE mysql;
UPDATE user SET authentication_string=PASSWORD('root') WHERE User='root';
FLUSH PRIVILEGES;
EXIT;
```

### Option B: Create New User
```bash
# Connect as root (if password is known)
mysql -u root -p

# Create database and user
CREATE DATABASE aqe_database;
CREATE USER 'aqe_user'@'localhost' IDENTIFIED BY 'aqe_password';
GRANT ALL PRIVILEGES ON aqe_database.* TO 'aqe_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Step 2: Update Connection String

Update `api/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=aqe_database;Uid=root;Pwd=root;"
  },
  "DatabaseType": "MySQL"
}
```

## Step 3: Update Program.cs

Update `api/Program.cs`:
```csharp
// Add Entity Framework with MySQL
builder.Services.AddDbContext<AQEDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"), 
    new MySqlServerVersion(new Version(8, 0, 0))));
```

## Step 4: Run Migrations

```bash
cd api
dotnet ef database update
```

## Step 5: Start API

```bash
dotnet run
```

## Troubleshooting

### Access Denied Error
- Ensure MySQL is running: `brew services start mysql`
- Check if root user has password: `mysql -u root -p`
- Reset password if needed (see Option A above)

### Connection String Issues
- Verify database name exists: `SHOW DATABASES;`
- Check user permissions: `SHOW GRANTS FOR 'root'@'localhost';`
- Test connection: `mysql -u root -p aqe_database`

### Migration Issues
- Ensure database is empty or backup existing data
- Check Entity Framework packages are installed
- Verify connection string format

## Current Status
- API is currently running with SQLite database
- All data is being saved to `aqe.db` file
- MySQL migration can be done later when MySQL is properly configured
