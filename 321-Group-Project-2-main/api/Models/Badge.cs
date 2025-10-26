using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public enum BadgeType
    {
        LessonCompletion,
        PerfectScore,
        Streak,
        FastLearner,
        SubjectMaster,
        FirstLesson,
        TenLessons,
        FiftyLessons,
        HundredLessons
    }

    public class Badge
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public BadgeType Type { get; set; }

        [MaxLength(200)]
        public string? IconUrl { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<StudentBadge> StudentBadges { get; set; } = new List<StudentBadge>();
    }

    public class StudentBadge
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int StudentId { get; set; }

        [Required]
        public int BadgeId { get; set; }

        [Required]
        public DateTime EarnedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("StudentId")]
        public Student Student { get; set; } = null!;

        [ForeignKey("BadgeId")]
        public Badge Badge { get; set; } = null!;
    }
}

