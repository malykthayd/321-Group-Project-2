# AQE - Accessible Quality Education Platform

A comprehensive educational platform designed to provide accessible, quality education to learners worldwide.

## Features

### 🌍 Multi-Language Support
- 9 languages supported: English, Español, Français, Deutsch, 中文, العربية, Kiswahili, አማርኛ, isiZulu
- Dynamic UI translation
- Language persistence across sessions

### 👥 Role-Based Access
- **Students**: Dashboard, lessons, progress tracking, badges
- **Teachers**: Student management, assignment creation, progress monitoring
- **Parents**: Child monitoring, activity viewing, lesson assignment
- **Admins**: User management, content management, SMS/USSD features

### 🎨 User Experience
- Dark/Light mode toggle
- Responsive design
- Progressive Web App (PWA) capabilities
- Offline functionality

### 📱 SMS/USSD Integration
- Admin accessibility suite
- SMS keyword management
- USSD menu trees
- Content delivery via mobile

### 📚 Curriculum Auto-Generation System

The AQE Platform includes a comprehensive curriculum auto-generation system that creates educational content automatically:

#### **Admin Features**
- **Lesson Generation**: Generate lessons for any subject/grade combination
- **Content Publishing**: Publish lessons to teacher or parent libraries
- **Analytics Dashboard**: Track lesson generation and usage across the platform
- **Subject Management**: Manage core subjects (English, Math, Science, Social Studies)
- **Grade Management**: Support for grades K-12 with proper ordering

#### **Teacher/Parent Features**
- **Digital Library**: Access published lessons with filtering and search
- **Assignment Creation**: Assign lessons to students/children with due dates
- **Progress Tracking**: Monitor student completion rates and scores
- **Analytics**: View detailed analytics for assigned lessons

#### **Student Features**
- **Assignment Viewing**: See assigned lessons with status indicators
- **Interactive Lesson Player**: Complete lessons with accessible quiz interface
- **Progress Tracking**: View completion status and scores
- **Results Review**: See detailed feedback with explanations

#### **System Features**
- **Automatic Question Generation**: Creates 5 multiple-choice questions per lesson
- **Difficulty Levels**: Each subject/grade gets 2 lessons (A=easier, B=moderate)
- **Real-Time Analytics**: Updates dashboards across all roles
- **Accessibility**: Keyboard navigation, screen reader support, color contrast
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Quick Start

### Prerequisites
- .NET 8.0 SDK
- Node.js (for frontend development)
- SQLite (included)

### Running the Application

**Simple Commands:**

1. **Start Server:**
   ```bash
   cd 321-Group-Project-2-main
   ./start-server.sh
   ```

2. **Stop Server:**
   ```bash
   cd 321-Group-Project-2-main
   ./stop-server.sh
   ```

3. **Use the Site:**
   - Open `client/index.html` directly in your browser
   - OR visit: http://localhost:5001

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Student | student@demo.com | student123 |
| Teacher | teacher@demo.com | teacher123 |
| Parent | parent@demo.com | parent123 |
| Admin | admin@demo.com | admin123 |

## Testing the Curriculum System

### Quick Test
1. **Login as Admin** and navigate to "Course Management"
2. **Generate Lessons** using the "Generate Lessons" button
3. **Publish Lessons** to Teacher/Parent libraries
4. **Login as Teacher/Parent** and assign lessons to students
5. **Login as Student** and complete assigned lessons

### Automated Tests
Run the built-in curriculum system tests:
```javascript
// In browser console
runCurriculumTests();
```

Or click the "Run Curriculum Tests" button in the Admin dashboard.

### Test Coverage
- Subject and Grade generation
- Lesson auto-generation (dry run)
- Assignment workflow
- Analytics endpoints
- API functionality

## Technology Stack

### Backend
- .NET 8.0
- Entity Framework Core
- SQLite Database
- ASP.NET Core Web API

### Frontend
- Vanilla JavaScript (ES6+)
- Bootstrap 5
- PWA with Service Worker
- IndexedDB for offline storage

### Features
- Secure password hashing (BCrypt)
- JWT authentication
- Multi-role user system
- SMS/USSD gateway integration
- Internationalization (i18n)

## Testing the Curriculum System

### Automated Testing

Run the curriculum system test script in your browser console:

```javascript
// Load the test script
const script = document.createElement('script');
script.src = 'resources/scripts/curriculumSystemTest.js';
document.head.appendChild(script);

// Or run manually
testCurriculumSystem();
```

### Manual Testing Workflow

1. **Start the server** using `./start-server.sh`
2. **Open the application** in your browser
3. **Test Admin Workflow:**
   - Log in as admin (demo account available)
   - Navigate to Admin > Course Management
   - Click "Generate Lessons" and select subjects/grades
   - Click "Publish Lessons" to publish to teacher/parent libraries
4. **Test Teacher/Parent Workflow:**
   - Log in as teacher or parent
   - Navigate to Digital Library tab
   - Click "Assign" on a lesson
   - Select students/children and set due date
5. **Test Student Workflow:**
   - Log in as student
   - Navigate to Digital Library tab
   - Click "Start Lesson" on an assignment
   - Complete the 5-question quiz
   - View results and feedback

### API Testing

Use the Swagger UI at `http://localhost:5001/swagger` to test API endpoints:

- `/api/admin/curriculum/*` - Admin curriculum management
- `/api/assignment/*` - Assignment management
- `/api/attempt/*` - Student attempts
- `/api/library/*` - Library management

## Project Structure

```
aqe/
├── api/                 # Backend API
│   ├── Controllers/     # API Controllers
│   ├── Models/         # Data Models
│   ├── Data/           # Database Context
│   └── Services/       # Business Logic
├── client/             # Frontend
│   ├── resources/      # CSS, JS, Images
│   └── *.html         # Pages
└── docs/              # Documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of a group assignment for educational purposes.
