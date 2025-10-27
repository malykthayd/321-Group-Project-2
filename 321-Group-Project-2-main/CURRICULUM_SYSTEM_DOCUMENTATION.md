# AQE Platform Curriculum Auto-Generation System

## Overview

The AQE Platform now includes a comprehensive curriculum auto-generation system that allows administrators to generate lessons, teachers and parents to assign them to students, and students to complete them with automatic grading and analytics tracking.

## System Architecture

### Backend Components

#### 1. Database Models (`api/Models/Curriculum/`)

- **Subject**: Core subjects (English Language Arts, Mathematics, Science, Social Studies)
- **Grade**: Grade levels K-12 with proper ordering
- **GeneratedLesson**: Auto-generated lessons with difficulty levels (A=easier, B=moderate)
- **LessonQuestion**: Multiple-choice questions with 4 choices each
- **LibraryItem**: Tracks lessons published to teacher/parent libraries
- **Assignment**: Links lessons to students/classes
- **Attempt**: Student submissions with answers and scores
- **AnalyticsRollup**: Aggregated analytics data for dashboards

#### 2. Services (`api/Services/Curriculum/`)

- **CurriculumGenerationService**: Handles lesson generation and publishing
- **QuestionGenerator**: Generates subject-specific questions by grade level
- **Subject Generators**: Specialized generators for each subject area

#### 3. Controllers (`api/Controllers/`)

- **AdminCurriculumController**: Admin lesson generation and management
- **AssignmentController**: Teacher/parent assignment creation
- **AttemptController**: Student lesson completion and grading
- **LibraryController**: Teacher/parent library management

### Frontend Components

#### 1. Main Platform (`client/resources/scripts/main.js`)

Updated with curriculum-specific methods:
- `loadAdminCourseManagement()`: Admin lesson generation interface
- `loadTeacherLibrary()` / `loadParentLibrary()`: Library management
- `loadStudentAssignments()`: Student assignment viewing
- `startLesson()` / `submitLesson()`: Lesson player functionality

#### 2. UI Components (`client/index.html`)

- Admin Course Management tab with generation and publishing
- Teacher/Parent Digital Library tabs with assignment capabilities
- Student Digital Library with lesson player
- Lesson Player Modal for interactive question answering
- Results Modal for score display

## User Workflows

### Admin Workflow

1. **Generate Lessons**
   - Navigate to Admin > Course Management
   - Click "Generate Lessons" button
   - Select subjects and grades (or generate all)
   - Choose dry run or actual generation
   - System generates 2 lessons per subject/grade (A=easier, B=moderate)
   - Each lesson contains exactly 5 multiple-choice questions

2. **Publish Lessons**
   - View generated lessons in the table
   - Select lessons to publish
   - Choose target library (Parent or Teacher)
   - Select specific teachers/parents to publish to
   - Lessons become available in their libraries

### Teacher/Parent Workflow

1. **View Library**
   - Navigate to Digital Library tab
   - See published lessons with analytics
   - Filter by subject, grade, difficulty

2. **Assign Lessons**
   - Click "Assign" button on a lesson
   - Select students/children to assign to
   - Set optional due date
   - Assignment is created and students are notified

3. **Track Progress**
   - View assignment analytics
   - See completion rates and average scores
   - Monitor student progress

### Student Workflow

1. **View Assignments**
   - Navigate to Digital Library tab
   - See assigned lessons with status
   - Filter by subject, assigner, status

2. **Complete Lessons**
   - Click "Start Lesson" on an assignment
   - Answer 5 multiple-choice questions
   - Navigate between questions
   - Submit when complete

3. **View Results**
   - See immediate score and feedback
   - Review correct answers and explanations
   - Track progress over time

## API Endpoints

### Admin Curriculum Management

```
GET /api/admin/curriculum/subjects - Get all subjects
GET /api/admin/curriculum/grades - Get all grades
GET /api/admin/curriculum/lessons - Get generated lessons
POST /api/admin/curriculum/generate - Generate new lessons
POST /api/admin/curriculum/publish - Publish lessons to libraries
GET /api/admin/curriculum/analytics - Get admin analytics
POST /api/admin/curriculum/seed-data - Seed subjects and grades
```

### Assignment Management

```
POST /api/assignment - Create new assignment
GET /api/assignment/teacher/{teacherId} - Get teacher assignments
GET /api/assignment/parent/{parentId} - Get parent assignments
GET /api/assignment/student/{studentId} - Get student assignments
DELETE /api/assignment/{assignmentId} - Delete assignment
```

### Lesson Attempts

```
POST /api/attempt/start - Start lesson attempt
POST /api/attempt/submit - Submit lesson attempt
GET /api/attempt/{attemptId} - Get attempt details
GET /api/attempt/student/{studentId} - Get student attempts
DELETE /api/attempt/{attemptId} - Delete attempt
```

### Library Management

```
GET /api/library/teacher/{teacherId} - Get teacher library
GET /api/library/parent/{parentId} - Get parent library
GET /api/library/lesson/{lessonId} - Get lesson details
GET /api/library/teacher/{teacherId}/students - Get teacher students
GET /api/library/parent/{parentId}/children - Get parent children
GET /api/library/teacher/{teacherId}/analytics - Get teacher analytics
GET /api/library/parent/{parentId}/analytics - Get parent analytics
DELETE /api/library/item/{libraryItemId} - Remove from library
```

## Question Generation

### Subject-Specific Generators

Each subject has a specialized generator that creates age-appropriate questions:

- **English Language Arts**: Reading comprehension, grammar, vocabulary, literary devices
- **Mathematics**: Arithmetic, algebra, geometry, statistics, calculus
- **Science**: Life science, physical science, earth science, chemistry, physics
- **Social Studies**: History, geography, civics, economics, government

### Grade-Level Adaptation

Questions are automatically adapted for grade levels:
- **K-2**: Basic concepts, simple vocabulary
- **3-5**: Intermediate concepts, expanded vocabulary
- **6-8**: Advanced concepts, critical thinking
- **9-12**: Complex analysis, college preparation

### Difficulty Levels

Each lesson pair includes:
- **Lesson A**: Easier difficulty with simpler distractors
- **Lesson B**: Moderate difficulty with more challenging content

## Analytics and Reporting

### Real-Time Analytics

The system tracks:
- Lessons generated and published
- Assignments created and completed
- Student scores and progress
- Completion rates by role

### Dashboard Metrics

Each role sees relevant metrics:
- **Admin**: Site-wide lesson generation and usage
- **Teacher**: Class assignments and student performance
- **Parent**: Child assignments and progress
- **Student**: Personal assignments and scores

## Database Schema

### Key Relationships

```
Subject (1) -> (Many) GeneratedLesson
Grade (1) -> (Many) GeneratedLesson
GeneratedLesson (1) -> (Many) LessonQuestion
GeneratedLesson (1) -> (Many) LibraryItem
GeneratedLesson (1) -> (Many) Assignment
Assignment (1) -> (Many) Attempt
Student (1) -> (Many) Attempt
```

### Data Integrity

- Foreign key constraints ensure data consistency
- Cascade deletes maintain referential integrity
- Unique constraints prevent duplicate data
- Indexes optimize query performance

## Security and Access Control

### Role-Based Access

- **Admin**: Full curriculum management access
- **Teacher**: Can assign lessons to their students
- **Parent**: Can assign lessons to their children
- **Student**: Can only access their assigned lessons

### Data Validation

- Input validation on all API endpoints
- User authentication required for all operations
- Assignment ownership verification
- Lesson access validation

## Performance Considerations

### Database Optimization

- Indexed foreign keys for fast lookups
- Efficient query patterns for analytics
- Batch operations for bulk data processing

### Caching Strategy

- Analytics rollups for dashboard performance
- Client-side caching for lesson data
- Optimized API responses

## Testing and Quality Assurance

### Automated Testing

The system includes comprehensive test coverage:
- Unit tests for question generators
- Integration tests for API endpoints
- End-to-end tests for user workflows

### Manual Testing

- Admin lesson generation workflow
- Teacher/parent assignment process
- Student lesson completion flow
- Analytics accuracy verification

## Deployment and Configuration

### Environment Setup

1. **Database**: SQLite with automatic migrations
2. **API**: .NET Core with CORS enabled
3. **Frontend**: Static files served by API
4. **Configuration**: Environment-based settings

### Initialization

The system automatically:
- Creates database tables
- Seeds subjects and grades
- Sets up default configurations
- Initializes analytics rollups

## Future Enhancements

### Planned Features

- **Advanced Question Types**: Fill-in-the-blank, matching, essay
- **Adaptive Difficulty**: Dynamic question adjustment
- **Collaborative Features**: Teacher lesson sharing
- **Mobile Support**: Responsive lesson player
- **Offline Mode**: Downloadable lessons

### Scalability Improvements

- **Microservices**: Separate curriculum service
- **Caching Layer**: Redis for performance
- **CDN Integration**: Global content delivery
- **Analytics Pipeline**: Real-time data processing

## Troubleshooting

### Common Issues

1. **Lesson Generation Fails**
   - Check database connectivity
   - Verify subject/grade data exists
   - Review error logs for details

2. **Assignment Creation Errors**
   - Ensure user has library access
   - Verify student/child relationships
   - Check assignment permissions

3. **Student Access Issues**
   - Confirm assignment exists
   - Verify student authentication
   - Check lesson publication status

### Debug Tools

- API endpoint testing with Swagger UI
- Database query logging
- Frontend console debugging
- Analytics data verification

## Support and Maintenance

### Monitoring

- API response time tracking
- Database performance metrics
- User activity analytics
- Error rate monitoring

### Maintenance Tasks

- Regular database backups
- Analytics rollup updates
- Performance optimization
- Security updates

---

This curriculum system provides a complete educational content management solution with automatic generation, assignment, completion, and analytics capabilities. The system is designed to be scalable, maintainable, and user-friendly for all educational stakeholders.
