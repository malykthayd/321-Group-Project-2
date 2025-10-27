using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.Curriculum
{
    public class LessonQuestion
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int GeneratedLessonId { get; set; }

        [Required]
        [MaxLength(1000)]
        public string Prompt { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "TEXT")]
        public string ChoicesJson { get; set; } = string.Empty; // JSON array of 4 strings

        [Required]
        public int AnswerIndex { get; set; } // 0-3 for the correct choice

        public string? Explanation { get; set; }

        [Required]
        [Column("QuestionOrder")]
        public int Order { get; set; }

        // Navigation property
        [ForeignKey("GeneratedLessonId")]
        public GeneratedLesson GeneratedLesson { get; set; } = null!;
    }
}
