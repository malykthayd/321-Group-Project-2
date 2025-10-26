using System.ComponentModel.DataAnnotations;

namespace api.Models.SMS
{
    public class ContentTargeting
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string RuleName { get; set; } = string.Empty;

        [MaxLength(20)]
        public string? GradeBand { get; set; } // "K", "1-2", "3-4", "5-6", "7-8"

        [MaxLength(50)]
        public string? Subject { get; set; } // Math, Reading, Science, etc.

        [MaxLength(10)]
        public string? Language { get; set; } // en, es, fr, etc.

        public int? BookId { get; set; }

        public int? LessonId { get; set; }

        public int? PracticePackId { get; set; }

        [Required]
        public int Priority { get; set; } = 0; // Lower = higher priority

        public bool Active { get; set; } = true;

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

