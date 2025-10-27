using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.Curriculum
{
    public class Attempt
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int AssignmentId { get; set; }

        [Required]
        public int StudentId { get; set; }

        public DateTime StartedAt { get; set; } = DateTime.UtcNow;

        public DateTime? SubmittedAt { get; set; }

        [Required]
        [Column(TypeName = "TEXT")]
        public string AnswersJson { get; set; } = string.Empty; // JSON array of 5 integers (student's chosen answer index)

        public decimal ScorePercent { get; set; }

        public int WrongCount { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("AssignmentId")]
        public Assignment Assignment { get; set; } = null!;

        [ForeignKey("StudentId")]
        public Student Student { get; set; } = null!;
    }
}
