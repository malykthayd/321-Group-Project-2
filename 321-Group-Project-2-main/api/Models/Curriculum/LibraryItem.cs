using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.Curriculum
{
    public enum OwnerRole
    {
        Parent = 1,
        Teacher = 2
    }

    public class LibraryItem
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int GeneratedLessonId { get; set; }

        [Required]
        [MaxLength(20)]
        public string OwnerRole { get; set; } = string.Empty; // "parent" or "teacher"

        [Required]
        public int OwnerId { get; set; } // ParentId or TeacherId

        public DateTime PublishedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("GeneratedLessonId")]
        public GeneratedLesson GeneratedLesson { get; set; } = null!;
    }
}
