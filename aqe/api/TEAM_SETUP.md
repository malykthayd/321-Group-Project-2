# Team Setup Instructions

## 🚀 **FIRST TIME SETUP** (Do this once)

### Prerequisites
1. **Install .NET 8 SDK**: [Download here](https://dotnet.microsoft.com/download/dotnet/8.0)
2. **Install MySQL**: [Download here](https://dev.mysql.com/downloads/mysql/)
3. **Install MySQL Workbench** (optional): [Download here](https://dev.mysql.com/downloads/workbench/)

### Step 1: Start MySQL Service
Make sure MySQL is running on your machine:
- **Windows**: MySQL should start automatically, or use Services
- **macOS**: `brew services start mysql`
- **Linux**: `sudo systemctl start mysql`

### Step 2: Create Database
Connect to MySQL and create the development database:

```sql
CREATE DATABASE AQEDatabase_Dev;
```

You can do this in:
- MySQL Workbench
- MySQL command line
- Any MySQL client

### Step 3: Configure Environment Variables
1. **Run the following command in your terminal**:
   ```bash
   cp env.example .env
   ```

2. **A `.env` should populate after the previous command is ran. Edit `.env` file** with your MySQL password:
   ```bash
   MYSQL_PASSWORD=your_actual_mysql_password
   ```

   **Note**: Replace `your_actual_mysql_password` with your MySQL root password.

### Step 4: Install Dependencies & Setup Database
```bash
cd aqe/api
dotnet restore
dotnet ef database update
```

### Step 5: Test Everything Works
Follow the **"DAILY USAGE"** section below to verify everything is working.

---

## 🔄 **DAILY USAGE** (Do this every time you want to use the site)

### Step 1: Start the Backend API
```bash
cd aqe/api
dotnet run
```
*Keep this terminal running*

The API will be available at: `http://localhost:5000`

### Step 2: Start the Frontend (New Terminal)
Open a **new terminal window** and run:
```bash
cd aqe/client
python3 -m http.server 8080
```
*Keep this terminal running too*

**Alternative Frontend Options:**
- **VS Code Live Server**: Right-click `aqe/client/index.html` → "Open with Live Server"
- **Node.js**: If you have Node.js: `npx http-server aqe/client -p 8080`

### Step 3: Access the Website
Open your browser and go to: **`http://localhost:8080`**

### Step 4: Login
Use these demo accounts:
- **Student**: `student@demo.com` / `student123`
- **Teacher**: `teacher@demo.com` / `teacher123`
- **Parent**: `parent@demo.com` / `parent123`
- **Admin**: `admin@demo.com` / `admin123`

### Step 5: When Done
Press `Ctrl+C` in both terminals to stop the servers.

---

## 🧪 **TESTING THE SETUP**

### Quick Health Check
1. **API**: Visit `http://localhost:5000/swagger`
2. **Website**: Visit `http://localhost:8080`
3. **Login**: Try any demo account above

### Advanced Testing (Optional)
```bash
# Test API directly
curl http://localhost:5000/api/auth/demo-accounts

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@demo.com","password":"student123"}'
```

---

## 🔧 **TROUBLESHOOTING**

### Connection Issues
- **Error**: "Access denied for user 'root'"
  - **Solution**: Check your MySQL password in the `.env` file
  - **Verify**: Test connection in MySQL Workbench

- **Error**: "Unknown database 'AQEDatabase_Dev'"
  - **Solution**: Create the database using the SQL command above

- **Error**: "MySQL server not running"
  - **Solution**: Start MySQL service on your machine

### Port Issues
- **Error**: "Address already in use"
  - **Solution**: Kill existing processes: `pkill -f "dotnet run"` or `pkill -f "python3 -m http.server"`

### Frontend Issues
- **Error**: "Cannot connect to API"
  - **Solution**: Make sure the backend API is running on `localhost:5000`
  - **Check**: Visit `http://localhost:5000/swagger` to verify API is working

- **Error**: "Frontend not loading"
  - **Solution**: Make sure you're accessing `http://localhost:8080` (not 5000)
  - **Alternative**: Try VS Code Live Server extension

---

## 📝 **DEVELOPMENT NOTES**

- The application uses Entity Framework Core with MySQL
- Database migrations are automatically applied on startup
- All sensitive data is stored in environment variables
- The `.env` file is ignored by git (keeps passwords secure)
- **Two servers required**: Backend API (`localhost:5000`) + Frontend (`localhost:8080`)
- Frontend communicates with backend via API calls
- Both servers must be running simultaneously for full functionality

---

## 🆘 **NEED HELP?**

1. Check that MySQL is running
2. Verify your password in the `.env` file
3. Ensure the database `AQEDatabase_Dev` exists
4. Check the console output for detailed error messages
5. Make sure both servers are running (backend + frontend)