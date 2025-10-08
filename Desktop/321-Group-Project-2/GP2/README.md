# EduConnect - Digital Learning Platform

A comprehensive digital learning platform prototype built for the University of Alabama MIS 321 Group Project 2 (Fall 2025), supporting UN Sustainable Development Goal #4 - Quality Education.

## 🌟 Features

### Core Functionality
- **Role-based Authentication**: Student, Teacher, Parent, and Admin dashboards
- **Interactive Lessons**: Digital library with adaptive learning content
- **Gamification System**: Points, badges, achievements, and leaderboards
- **Adaptive Learning Engine**: AI-powered difficulty adjustment and personalized recommendations
- **Progress Tracking**: Comprehensive analytics and performance monitoring
- **Offline-First Design**: Works without internet connection with automatic sync
- **Cross-Platform**: Responsive design for mobile and desktop

### Role-Specific Features

#### Student Dashboard
- Personal learning progress and statistics
- Interactive lesson library with difficulty levels
- Achievement tracking and badge collection
- Leaderboard participation
- Adaptive learning recommendations

#### Teacher Dashboard
- Class overview and student management
- Lesson creation and assignment tools
- Performance analytics and insights
- Student progress monitoring

#### Parent Dashboard
- Child progress tracking and notifications
- Learning activity summaries
- Achievement celebrations
- Study time monitoring

#### Admin Dashboard
- User management and system administration
- Content approval and management
- System health monitoring
- Analytics and reporting

## 🚀 Technology Stack

### Frontend
- **HTML5/CSS3**: Single-page application with semantic markup
- **Vanilla JavaScript (ES6+)**: Modern JavaScript with modular architecture
- **Bootstrap 5.3.0**: Responsive UI framework with custom components
- **Service Worker**: Offline functionality and caching
- **Local Storage**: Client-side data persistence

### Backend
- **ASP.NET Core Web API**: RESTful API with .NET 8.0
- **C#**: Modern C# with async/await patterns
- **SQLite Database**: Lightweight, serverless database
- **Swagger/OpenAPI**: API documentation and testing

### Key Libraries & Frameworks
- Bootstrap Icons for UI elements
- Microsoft.Data.Sqlite for database operations
- Service Worker API for offline functionality

## 📁 Project Structure

```
GP2/
├── client/                          # Frontend application
│   ├── index.html                   # Main HTML file
│   ├── sw.js                        # Service worker for offline functionality
│   └── resources/
│       ├── styles/
│       │   └── main.css             # Custom styles and themes
│       └── scripts/
│           ├── app.js               # Main application controller
│           ├── dashboard.js         # Dashboard components
│           ├── lessons.js           # Lesson management
│           ├── gamification.js      # Points, badges, leaderboards
│           ├── adaptive-learning.js # AI learning engine
│           ├── offline-sync.js      # Offline functionality
│           ├── data.js              # Sample data and utilities
│           └── components.js        # Reusable UI components
├── api/                             # Backend API
│   ├── Controllers/
│   │   ├── UsersController.cs       # User management endpoints
│   │   ├── LessonsController.cs     # Lesson CRUD operations
│   │   └── ProgressController.cs    # Progress tracking endpoints
│   ├── Program.cs                   # Application configuration
│   ├── api.csproj                   # Project dependencies
│   ├── appsettings.json             # Configuration settings
│   └── database.db                  # SQLite database (auto-created)
└── README.md                        # Project documentation
```

## 🛠️ Setup Instructions

### Prerequisites
- .NET 8.0 SDK or later
- Modern web browser with JavaScript enabled
- Git (for cloning the repository)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GP2
   ```

2. **Setup Backend API**
   ```bash
   cd api
   dotnet restore
   dotnet build
   dotnet run
   ```
   The API will be available at `https://localhost:7000` (or the port shown in console)

3. **Setup Frontend**
   - Open `client/index.html` in a modern web browser
   - For local development, you can use a simple HTTP server:
     ```bash
     cd client
     python -m http.server 8000  # Python 3
     # or
     npx serve .                 # Node.js
     ```

### Demo Credentials

The application includes demo credentials for testing:

| Role | Email | Password |
|------|-------|----------|
| Student | student@demo.com | demo123 |
| Teacher | teacher@demo.com | demo123 |
| Parent | parent@demo.com | demo123 |
| Admin | admin@demo.com | demo123 |

## 🎯 Usage Guide

### Getting Started
1. Open the application in your web browser
2. Click on one of the demo role buttons or enter credentials manually
3. Explore the role-specific dashboard and features
4. Navigate between different sections using the top navigation

### Key Features to Explore

#### For Students
- Start with the **Dashboard** to see your learning progress
- Visit the **Lessons** section to explore interactive content
- Check the **Leaderboard** to see your ranking
- Complete lessons to earn points and badges

#### For Teachers
- Monitor student progress in the **Dashboard**
- Use **Analytics** to track class performance
- Create and manage lesson content (coming soon)

#### For Parents
- Track your children's learning progress
- View achievement notifications
- Monitor study time and completion rates

#### For Admins
- Manage users and system settings
- Monitor system health and performance
- Access comprehensive analytics

## 🔧 Development

### Adding New Features

1. **Frontend Components**: Add new modules in `client/resources/scripts/`
2. **API Endpoints**: Create new controllers in `api/Controllers/`
3. **Database Schema**: Modify the initialization in `Program.cs`
4. **Styling**: Update `client/resources/styles/main.css`

### Offline Development
The application works offline by default. Data is cached locally and syncs when connection is restored.

### API Documentation
Once the backend is running, visit `https://localhost:7000/swagger` for interactive API documentation.

## 📊 Sample Data

The application includes comprehensive sample data:
- 4 demo users (one per role)
- 3 sample lessons with different difficulties
- Mock progress data and achievements
- Leaderboard with sample rankings

## 🌐 Offline Functionality

- **Service Worker**: Caches essential files for offline access
- **Local Storage**: Saves progress and user data locally
- **Background Sync**: Automatically syncs data when online
- **Offline Indicators**: Visual feedback for connection status

## 🎨 Design Features

- **Responsive Design**: Works on mobile, tablet, and desktop
- **Accessibility**: Keyboard navigation and screen reader support
- **Theme Support**: Role-specific color schemes
- **Modern UI**: Bootstrap components with custom styling
- **Loading States**: Smooth transitions and feedback

## 🔒 Security Features

- **Input Validation**: Client and server-side validation
- **CORS Configuration**: Secure cross-origin requests
- **Data Privacy**: Local data encryption simulation
- **Role-based Access**: Appropriate permissions per user type

## 📈 Performance Optimizations

- **Lazy Loading**: Components load as needed
- **Efficient Caching**: Smart cache management
- **Minimal Dependencies**: Lightweight framework usage
- **Optimized Assets**: Compressed CSS and JavaScript

## 🚧 Future Enhancements

- Real-time notifications and messaging
- Advanced analytics and reporting
- Content creation tools for teachers
- Mobile app development
- Integration with external learning resources
- Advanced AI-powered recommendations

## 🤝 Contributing

This is a prototype for educational purposes. For contributions:
1. Follow the existing code structure and naming conventions
2. Add appropriate comments and documentation
3. Test all functionality before submitting
4. Ensure responsive design compatibility

## 📄 License

This project is created for educational purposes as part of the University of Alabama MIS 321 curriculum.

## 🎓 Educational Impact

EduConnect demonstrates how technology can support UN SDG #4 by:
- Providing equitable access to quality education
- Enabling personalized learning experiences
- Supporting diverse learning styles and paces
- Facilitating teacher-student-parent collaboration
- Promoting engagement through gamification
- Ensuring accessibility across different devices and connectivity levels

---

**Built with ❤️ for Quality Education**

*University of Alabama MIS 321 Group Project 2 - Fall 2025*
