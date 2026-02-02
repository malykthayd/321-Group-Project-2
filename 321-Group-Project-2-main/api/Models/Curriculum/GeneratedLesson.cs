using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.Curriculum
{
    public enum LessonDifficulty
    {
        A = 1, // Easier
        B = 2  // Moderate
    }

    public enum LessonStatus
    {
        Draft = 1,
        Published = 2
    }

    public enum CreatedByRole
    {
        Admin = 1,
        Teacher = 2,
        Parent = 3
    }

    public class GeneratedLesson
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int SubjectId { get; set; }

        [Required]
        public int GradeId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public LessonDifficulty DifficultyTag { get; set; }

        [Required]
        public LessonStatus Status { get; set; } = LessonStatus.Draft;

        [Required]
        public CreatedByRole CreatedByRole { get; set; }

        [Required]
        public int CreatedById { get; set; }

        [MaxLength(1000)]
        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? PublishedAt { get; set; }

        // Navigation properties
        [ForeignKey("SubjectId")]
        public Subject Subject { get; set; } = null!;

        [ForeignKey("GradeId")]
        public Grade Grade { get; set; } = null!;

        public ICollection<LessonQuestion> Questions { get; set; } = new List<LessonQuestion>();
        public ICollection<LibraryItem> LibraryItems { get; set; } = new List<LibraryItem>();
        public ICollection<Assignment> Assignments { get; set; } = new List<Assignment>();
    }
}
