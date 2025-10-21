# Registration and Login Test Guide

## Current Status
The registration and login system has been updated with the following changes:

### Changes Made
1. **Student Login Flow**: Students now choose between "Independent Student" (email/password) or "Class Student" (name/access code) when logging in
2. **Teacher Registration**: Removed "Subject Taught" field - automatically set to "Multiple Subjects"
3. **Admin Registration**: Added developer note showing admin secret password is "admin"
4. **Auto-Login After Registration**: Users are automatically logged in after successful registration - no need to log in manually!

## How to Test Registration

### Backend API Testing (Working)
The backend API is confirmed working:
```bash
curl -X POST http://localhost:5000/api/auth/register-student \
  -H "Content-Type: application/json" \
  -d '{"name":"Johnny Jones","email":"johnny@example.com","password":"password123","gradeLevel":"5th Grade"}'
```

Expected response:
```json
{"id":8,"studentId":5,"name":"Johnny Jones","email":"johnny@example.com","role":"student","gradeLevel":"5th Grade","isIndependent":true,"message":"Student registered successfully"}
```

### Frontend Registration Testing

#### Step-by-Step Process:
1. **Open the application**: http://localhost:8080 or http://localhost:8081
2. **Click "Get Started" or Login button**
3. **Switch to "Register" tab**
4. **Select a role** (Student, Teacher, Parent, or Admin)
5. **Fill in the form fields**
6. **Click "Register" button**

#### What Should Happen:
- If successful, you'll see a success message "Registration successful! Logging you in..."
- The login modal will automatically close
- You'll be automatically logged in and taken to your role-specific dashboard
- No need to manually log in after registration!
- If there's an error, you'll see an error message

#### Current Known Issues:
If the "Register" button does nothing:
1. **Check browser console** (F12 → Console tab)
   - Look for any error messages
   - Look for the debug logs mentioned above
2. **Check if role is selected** - The registration form won't work unless you click on a role card first
3. **Check if form fields are filled** - JavaScript validation checks for empty fields
4. **Check if password is long enough** - Must be at least 8 characters

## Testing Each Role

### Student Registration
**Required Fields:**
- Full Name: Any text
- Email: Valid email format
- Password: At least 8 characters
- Grade Level: Select from dropdown

**Test Data:**
- Name: Johnny Jones
- Email: johnny.jones@example.com
- Password: password123
- Grade Level: 5th Grade

### Teacher Registration
**Required Fields:**
- Full Name: Any text
- Email: Valid email format
- Password: At least 8 characters
- Grade Level Taught: Select from dropdown

**Note:** Subject Taught is NO LONGER required - automatically set to "Multiple Subjects"

**Test Data:**
- Name: Mrs. Smith
- Email: mrs.smith@example.com
- Password: teacher123
- Grade Level: 6th Grade

### Parent Registration
**Required Fields:**
- Full Name: Any text
- Email: Valid email format
- Password: At least 8 characters
- At least one child with Name and 6-digit Access Code

**Test Data:**
- Name: John Parent
- Email: john.parent@example.com
- Password: parent123
- Child 1: Demo Student, Access Code: 123456

### Admin Registration
**Required Fields:**
- Full Name: Any text
- Email: Valid email format
- Password: At least 8 characters
- Admin Secret Password: "admin"

**Developer Note:** The admin secret password is displayed on the form: "admin"

**Test Data:**
- Name: Admin User
- Email: admin@example.com
- Password: admin123
- Admin Secret Password: admin

## Login Testing

### Student Login (Two Methods)

#### Method 1: Independent Student
1. Click login
2. Select "Student" role
3. Choose "Independent Student"
4. Enter email and password
5. Click "Login"

**Test Data:**
- Email: student@demo.com
- Password: student123

#### Method 2: Class Student
1. Click login
2. Select "Student" role
3. Choose "Class Student"
4. Enter name and 6-digit access code
5. Click "Login"

**Test Data:**
- Name: Demo Student
- Access Code: 123456

### Other Roles Login
Same as before - just email and password

## Troubleshooting

### If Registration Button Does Nothing:
1. Open browser console (F12)
2. Look for these logs:
   - "Initializing event listeners"
   - "Register form found: true"
   - "Register role selected: [role]"
3. If "Register form found: false" - the JavaScript loaded before the HTML
4. If no role logs - you didn't click a role card
5. If "Please select a role to register" error - click a role card first
6. If "Please fill in all fields" error - fill in all fields

### If Registration Submits but Fails:
1. Check the error message displayed
2. Common errors:
   - "Email already exists" - Use a different email
   - "Password must be at least 8 characters long"
   - "Invalid admin password" - Must be exactly "admin"
   - "Invalid access code for child" - Parent registration only

### Debug Mode
The system now includes extensive logging. Open the browser console to see:
- All form submissions
- All API calls
- All registration data (passwords hidden)
- All server responses

## Next Steps
If registration is still not working after following this guide:
1. Share the browser console logs (F12 → Console tab)
2. Share any error messages displayed
3. Confirm which browser you're using
4. Confirm which URL you're accessing (port 8080 or 8081)

## Server Status
- Backend API: http://localhost:5000 ✓ Running
- Frontend: http://localhost:8080 or http://localhost:8081 ✓ Running
- Database: MySQL ✓ Connected

