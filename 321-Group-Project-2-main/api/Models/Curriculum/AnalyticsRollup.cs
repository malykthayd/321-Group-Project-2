using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.Curriculum
{
    public enum AnalyticsRole
    {
        Admin = 1,
        Teacher = 2,
        Parent = 3,
        Student = 4
    }

    public enum TimeWindow
    {
        Daily = 1,
        Weekly = 2,
        Monthly = 3,
        Yearly = 4,
        AllTime = 5
    }

    public class AnalyticsRollup
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public AnalyticsRole Role { get; set; }

        public int? RoleId { get; set; } // null for Admin, specific user ID for others

        [Required]
        public TimeWindow TimeWindow { get; set; }

        public DateTime WindowStart { get; set; }

        public DateTime WindowEnd { get; set; }

        // Lesson metrics
        public int LessonsGenerated { get; set; }

        public int LessonsPublishedParent { get; set; }

        public int LessonsPublishedTeacher { get; set; }

        // Assignment metrics
        public int AssignmentsCreated { get; set; }

        public int AttemptsSubmitted { get; set; }

        // Performance metrics
        public decimal AverageScore { get; set; }

        public decimal CompletionRate { get; set; }

        // Additional metrics for calculation
        public decimal TotalScoreSum { get; set; } = 0; // Sum of scores for average calculation
        public int TotalQuestionsAttempted { get; set; } = 0; // For completion rate

        public DateTime LastUpdated { get; set; } = DateTime.UtcNow;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
