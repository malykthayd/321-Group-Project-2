using api.Models.Curriculum;
using api.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace api.Services.Curriculum
{
    public interface ICurriculumGenerationService
    {
        Task<CurriculumGenerationResult> GenerateLessonsAsync(CurriculumGenerationRequest request);
        Task<PublishResult> PublishLessonsAsync(PublishRequest request);
        Task<List<Subject>> GetSubjectsAsync();
        Task<List<Grade>> GetGradesAsync();
    }

    public class CurriculumGenerationRequest
    {
        public List<int>? SubjectIds { get; set; }
        public List<int>? GradeIds { get; set; }
        public bool DryRun { get; set; } = false;
        public int CreatedById { get; set; }
        public CreatedByRole CreatedByRole { get; set; }
    }

    public class CurriculumGenerationResult
    {
        public int LessonsCreated { get; set; }
        public int LessonsSkipped { get; set; }
        public int QuestionsCreated { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
        public List<GeneratedLesson> GeneratedLessons { get; set; } = new List<GeneratedLesson>();
    }

    public class PublishRequest
    {
        public List<int> LessonIds { get; set; } = new List<int>();
        public OwnerRole TargetLibrary { get; set; }
        public List<int> OwnerIds { get; set; } = new List<int>();
    }

    public class PublishResult
    {
        public int LessonsPublished { get; set; }
        public int LibraryItemsCreated { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
    }

    public class CurriculumGenerationService : ICurriculumGenerationService
    {
        private readonly AQEDbContext _context;
        private readonly IQuestionGenerator _questionGenerator;

        public CurriculumGenerationService(AQEDbContext context, IQuestionGenerator questionGenerator)
        {
            _context = context;
            _questionGenerator = questionGenerator;
        }

        public async Task<CurriculumGenerationResult> GenerateLessonsAsync(CurriculumGenerationRequest request)
        {
            var result = new CurriculumGenerationResult();

            try
            {
                // Get subjects and grades to process
                var subjects = await GetSubjectsToProcess(request.SubjectIds);
                var grades = await GetGradesToProcess(request.GradeIds);

                if (!subjects.Any() || !grades.Any())
                {
                    result.Errors.Add("No subjects or grades found to process");
                    return result;
                }

                // Process each subject-grade combination
                foreach (var subject in subjects)
                {
                    foreach (var grade in grades)
                    {
                        try
                        {
                            // Generate Lesson A (easier) and Lesson B (moderate)
                            await GenerateLessonPair(subject, grade, request, result);
                        }
                        catch (Exception ex)
                        {
                            result.Errors.Add($"Error generating lessons for {subject.Name} - {grade.DisplayName}: {ex.Message}");
                        }
                    }
                }

                if (!request.DryRun)
                {
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                result.Errors.Add($"General error during generation: {ex.Message}");
            }

            return result;
        }

        private async Task GenerateLessonPair(Subject subject, Grade grade, CurriculumGenerationRequest request, CurriculumGenerationResult result)
        {
            // Generate Lesson A (easier)
            var lessonA = await GenerateSingleLesson(subject, grade, LessonDifficulty.A, request);
            if (lessonA != null)
            {
                result.GeneratedLessons.Add(lessonA);
                result.LessonsCreated++;
                result.QuestionsCreated += lessonA.Questions.Count;
            }

            // Generate Lesson B (moderate)
            var lessonB = await GenerateSingleLesson(subject, grade, LessonDifficulty.B, request);
            if (lessonB != null)
            {
                result.GeneratedLessons.Add(lessonB);
                result.LessonsCreated++;
                result.QuestionsCreated += lessonB.Questions.Count;
            }
        }

        private async Task<GeneratedLesson?> GenerateSingleLesson(Subject subject, Grade grade, LessonDifficulty difficulty, CurriculumGenerationRequest request)
        {
            // Check if lesson already exists
            var existingLesson = await _context.GeneratedLessons
                .FirstOrDefaultAsync(l => l.SubjectId == subject.Id && 
                                          l.GradeId == grade.Id && 
                                          l.DifficultyTag == difficulty);

            if (existingLesson != null)
            {
                return null; // Skip existing lessons
            }

            // Generate lesson content
            var lessonContent = _questionGenerator.GenerateLessonContent(subject, grade, difficulty);
            
            var lesson = new GeneratedLesson
            {
                SubjectId = subject.Id,
                GradeId = grade.Id,
                Title = lessonContent.Title,
                Description = lessonContent.Description,
                DifficultyTag = difficulty,
                Status = LessonStatus.Draft,
                CreatedByRole = request.CreatedByRole,
                CreatedById = request.CreatedById,
                CreatedAt = DateTime.UtcNow
            };

            if (!request.DryRun)
            {
                _context.GeneratedLessons.Add(lesson);
                await _context.SaveChangesAsync(); // Save to get the ID
            }

            // Generate questions
            var questions = _questionGenerator.GenerateQuestions(subject, grade, difficulty, lesson.Id);
            
            foreach (var question in questions)
            {
                if (!request.DryRun)
                {
                    _context.LessonQuestions.Add(question);
                }
                lesson.Questions.Add(question);
            }

            return lesson;
        }

        public async Task<PublishResult> PublishLessonsAsync(PublishRequest request)
        {
            var result = new PublishResult();

            try
            {
                var lessons = await _context.GeneratedLessons
                    .Where(l => request.LessonIds.Contains(l.Id))
                    .ToListAsync();

                foreach (var lesson in lessons)
                {
                    // Update lesson status
                    lesson.Status = LessonStatus.Published;
                    lesson.PublishedAt = DateTime.UtcNow;

                    // Create library items for each owner
                    foreach (var ownerId in request.OwnerIds)
                    {
                        var libraryItem = new LibraryItem
                        {
                            OwnerRole = request.TargetLibrary.ToString().ToLower(),
                            OwnerId = ownerId,
                            GeneratedLessonId = lesson.Id,
                            PublishedAt = DateTime.UtcNow
                        };

                        _context.LibraryItems.Add(libraryItem);
                        result.LibraryItemsCreated++;
                    }

                    result.LessonsPublished++;
                }

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                result.Errors.Add($"Error publishing lessons: {ex.Message}");
            }

            return result;
        }

        public async Task<List<Subject>> GetSubjectsAsync()
        {
            return await _context.Subjects
                .Where(s => s.IsActive)
                .OrderBy(s => s.Name)
                .ToListAsync();
        }

        public async Task<List<Grade>> GetGradesAsync()
        {
            return await _context.Grades
                .Where(g => g.IsActive)
                .OrderBy(g => g.SortOrder)
                .ToListAsync();
        }

        private async Task<List<Subject>> GetSubjectsToProcess(List<int>? subjectIds)
        {
            if (subjectIds != null && subjectIds.Any())
            {
                return await _context.Subjects
                    .Where(s => subjectIds.Contains(s.Id) && s.IsActive)
                    .ToListAsync();
            }
            return await _context.Subjects.Where(s => s.IsActive).ToListAsync();
        }

        private async Task<List<Grade>> GetGradesToProcess(List<int>? gradeIds)
        {
            if (gradeIds != null && gradeIds.Any())
            {
                return await _context.Grades
                    .Where(g => gradeIds.Contains(g.Id) && g.IsActive)
                    .ToListAsync();
            }
            return await _context.Grades.Where(g => g.IsActive).ToListAsync();
        }
    }
}
