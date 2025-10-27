using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.Curriculum
{
    public class Grade
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(10)]
        public string Code { get; set; } = string.Empty; // "K", "1", "2", ..., "12"

        [Required]
        [MaxLength(50)]
        public string DisplayName { get; set; } = string.Empty; // "Kindergarten", "1st Grade", etc.

        public int SortOrder { get; set; } // For ordering grades properly

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public ICollection<GeneratedLesson> GeneratedLessons { get; set; } = new List<GeneratedLesson>();
    }
}
