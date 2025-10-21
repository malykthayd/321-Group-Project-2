using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class StudentStatistics
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int StudentId { get; set; }

        // Lesson Statistics
        public int TotalLessonsStarted { get; set; } = 0;
        public int TotalLessonsCompleted { get; set; } = 0;
        public int TotalLessonsCheckedOut { get; set; } = 0;

        // Practice Material Statistics
        public int TotalPracticeStarted { get; set; } = 0;
        public int TotalPracticeCompleted { get; set; } = 0;

        // Digital Library Statistics
        public int TotalLibraryAssignments { get; set; } = 0;
        public int TotalLibraryCompleted { get; set; } = 0;

        // Score Statistics
        public double AverageScore { get; set; } = 0.0;
        public int TotalQuestionsAnswered { get; set; } = 0;
        public int TotalCorrectAnswers { get; set; } = 0;

        // Time Statistics
        public int TotalMinutesSpent { get; set; } = 0;
        public DateTime? LastActivityDate { get; set; }
        public int CurrentStreak { get; set; } = 0; // Days in a row
        public int LongestStreak { get; set; } = 0;

        // Badge Statistics
        public int TotalBadgesEarned { get; set; } = 0;

        // Subject-specific statistics (stored as JSON)
        [MaxLength(2000)]
        public string? SubjectScores { get; set; } // JSON: {"Math": 95, "Science": 87, ...}

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("StudentId")]
        public Student Student { get; set; } = null!;
    }
}

