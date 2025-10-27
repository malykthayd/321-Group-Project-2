# Curriculum Auto-Generation System

This document describes the curriculum auto-generation system implemented in the AQE Platform, which allows administrators to generate lessons automatically and enables teachers/parents to assign them to students.

## Overview

The curriculum system provides:
- **Auto-generation** of lessons with 5 multiple-choice questions each
- **Role-based access** for Admin, Teacher, Parent, and Student
- **Assignment workflow** from generation to completion
- **Analytics tracking** across all roles
- **Accessibility features** for inclusive learning

## Architecture

### Data Models

#### Core Entities
- **Subject**: Educational subjects (English, Math, Science, Social Studies)
- **Grade**: Grade levels (K-12)
- **GeneratedLesson**: Auto-generated lessons with metadata
- **LessonQuestion**: Individual questions within lessons
- **LibraryItem**: Published lessons available to teachers/parents
- **Assignment**: Lessons assigned to students/classes
- **Attempt**: Student attempts on assigned lessons
- **AnalyticsRollup**: Aggregated analytics data

#### Key Relationships
```
Subject (1) -> (N) GeneratedLesson
Grade (1) -> (N) GeneratedLesson
GeneratedLesson (1) -> (N) LessonQuestion
GeneratedLesson (1) -> (N) LibraryItem
GeneratedLesson (1) -> (N) Assignment
Assignment (1) -> (N) Attempt
```

### API Endpoints

#### Admin Endpoints
- `POST /api/admin/curriculum/generate` - Generate lessons
- `POST /api/admin/curriculum/publish` - Publish lessons to libraries
- `GET /api/admin/curriculum/subjects` - Get available subjects
- `GET /api/admin/curriculum/grades` - Get available grades
- `GET /api/admin/curriculum/lessons` - Get generated lessons
- `GET /api/admin/curriculum/analytics` - Get admin analytics

#### Teacher/Parent Endpoints
- `GET /api/teacher/library` - Get teacher's published lessons
- `GET /api/parent/library` - Get parent's published lessons
- `POST /api/assignments` - Create lesson assignments
- `GET /api/teacher/analytics` - Get teacher analytics
- `GET /api/parent/analytics` - Get parent analytics

#### Student Endpoints
- `GET /api/student/assignments` - Get student's assignments
- `GET /api/student/assignments/{id}` - Get assignment details
- `POST /api/attempts` - Submit lesson attempt
- `GET /api/student/analytics` - Get student analytics

## User Workflows

### Admin Workflow
1. **Generate Lessons**: Use the "Generate Lessons" button in Course Management
2. **Configure Generation**: Select subjects/grades or generate all
3. **Review Generated Lessons**: View lessons in the generated lessons table
4. **Publish Lessons**: Select lessons and publish to Teacher/Parent libraries
5. **Monitor Analytics**: Track generation, publishing, and usage statistics

### Teacher/Parent Workflow
1. **Access Digital Library**: View published lessons in the Digital Library tab
2. **Filter Lessons**: Use subject, grade, and difficulty filters
3. **Assign Lessons**: Select students/children and assign lessons
4. **Set Due Dates**: Optional due dates for assignments
5. **Track Progress**: Monitor student attempts and scores

### Student Workflow
1. **View Assignments**: See assigned lessons in Digital Library
2. **Start Lesson**: Click "Start" to begin a lesson
3. **Answer Questions**: Navigate through 5 multiple-choice questions
4. **Submit Lesson**: Complete and submit for grading
5. **View Results**: See score and feedback

## Question Generation

### Difficulty Levels
- **Lesson A**: Easier difficulty level
- **Lesson B**: Moderate difficulty level

### Question Structure
Each lesson contains exactly 5 multiple-choice questions with:
- **Prompt**: The question text
- **4 Choices**: Multiple choice options (A, B, C, D)
- **Correct Answer**: Index of the correct choice (0-3)
- **Order**: Sequential ordering within the lesson

### Subject-Specific Content
Questions are generated based on:
- **Subject**: English, Math, Science, Social Studies
- **Grade Level**: Age-appropriate content complexity
- **Difficulty Tag**: A (easier) or B (moderate)

## Accessibility Features

### Lesson Player
- **Keyboard Navigation**: Full keyboard support for question navigation
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Progress Indicators**: Visual and textual progress feedback
- **Focus Management**: Clear focus indicators and logical tab order

### UI Components
- **Semantic HTML**: Proper heading structure and landmarks
- **Color Contrast**: WCAG compliant color schemes
- **Responsive Design**: Mobile-friendly interface
- **Error Handling**: Clear error messages and validation

## Analytics

### Admin Analytics
- Total lessons generated
- Lessons published to Parent/Teacher libraries
- Total assignments created
- Student attempts and average scores

### Teacher Analytics
- Lessons available in library
- Assignments created
- Students assigned
- Average class score

### Parent Analytics
- Lessons available
- Assignments created
- Child attempts
- Average score

### Student Analytics
- Total lessons assigned
- Lessons completed
- Current streak
- Average score

## Database Migration

The system includes a database migration (`AddCurriculumGeneration`) that:
1. Creates all curriculum-related tables
2. Seeds initial subjects and grades
3. Sets up proper foreign key relationships
4. Creates indexes for performance

## Testing

### Unit Tests
- Question generation logic
- Grading calculations
- Analytics rollup updates

### Integration Tests
- Full assignment workflow
- API endpoint functionality
- Database operations

### Accessibility Tests
- Keyboard navigation
- Screen reader compatibility
- Color contrast validation

## Configuration

### Environment Variables
- Database connection strings
- API base URLs
- Analytics tracking settings

### Question Generator Configuration
- Subject-specific generators
- Grade level mappings
- Difficulty level definitions

## Future Enhancements

### Planned Features
- **Custom Question Types**: Beyond multiple choice
- **Adaptive Difficulty**: Dynamic difficulty adjustment
- **Collaborative Features**: Teacher collaboration on lessons
- **Advanced Analytics**: Detailed performance insights
- **Offline Support**: Offline lesson completion

### Technical Improvements
- **Caching**: Redis caching for frequently accessed data
- **Background Jobs**: Async lesson generation
- **API Versioning**: Versioned API endpoints
- **Rate Limiting**: API rate limiting and throttling

## Troubleshooting

### Common Issues
1. **Lessons not generating**: Check subject/grade data exists
2. **Assignments not appearing**: Verify library publishing
3. **Analytics not updating**: Check event emission
4. **Accessibility issues**: Validate ARIA labels and keyboard navigation

### Debug Tools
- Browser developer tools for frontend debugging
- API logging for backend issues
- Database queries for data verification
- Analytics dashboard for performance monitoring

## Support

For technical support or feature requests:
- Check the main project README
- Review API documentation
- Test with demo accounts
- Contact the development team

---

*This curriculum system is designed to be scalable, accessible, and maintainable for educational institutions of all sizes.*
