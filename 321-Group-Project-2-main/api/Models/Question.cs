using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public enum QuestionType
    {
        MultipleChoice,
        FillInTheBlank,
        TrueFalse
    }

    public class Question
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PracticeMaterialId { get; set; }

        [Required]
        [MaxLength(1000)]
        public string QuestionText { get; set; } = string.Empty;

        [Required]
        public QuestionType Type { get; set; }

        // For Multiple Choice questions
        public string? OptionA { get; set; }
        public string? OptionB { get; set; }
        public string? OptionC { get; set; }
        public string? OptionD { get; set; }

        [Required]
        [MaxLength(500)]
        public string CorrectAnswer { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string? Explanation { get; set; }

        [Required]
        public int Order { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        [ForeignKey("PracticeMaterialId")]
        public PracticeMaterial PracticeMaterial { get; set; } = null!;
    }
}
