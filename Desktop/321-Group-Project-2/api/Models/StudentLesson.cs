using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class StudentLesson
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int StudentId { get; set; }

        [Required]
        public int LessonId { get; set; }

        public DateTime CheckedOutAt { get; set; } = DateTime.UtcNow;
        public DateTime? StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        
        public int? Score { get; set; } // 0-100
        public int TotalQuestions { get; set; } = 0;
        public int CorrectAnswers { get; set; } = 0;
        
        [MaxLength(1000)]
        public string? Notes { get; set; }
        
        [MaxLength(1000)]
        public string? StudentNotes { get; set; }

        // Navigation properties
        [ForeignKey("StudentId")]
        public Student Student { get; set; } = null!;

        [ForeignKey("LessonId")]
        public Lesson Lesson { get; set; } = null!;
    }
}
