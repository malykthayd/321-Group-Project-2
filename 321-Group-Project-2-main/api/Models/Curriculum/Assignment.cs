using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.Curriculum
{
    public enum AssigneeType
    {
        Class = 1,
        Student = 2
    }

    public enum AssignedByRole
    {
        Teacher = 1,
        Parent = 2
    }

    public class Assignment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int GeneratedLessonId { get; set; }

        [Required]
        public AssigneeType AssigneeType { get; set; }

        [Required]
        public int AssigneeId { get; set; }

        [Required]
        public AssignedByRole AssignedByRole { get; set; }

        [Required]
        public int AssignedById { get; set; }

        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

        public DateTime? DueAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        [ForeignKey("GeneratedLessonId")]
        public GeneratedLesson GeneratedLesson { get; set; } = null!;

        public ICollection<Attempt> Attempts { get; set; } = new List<Attempt>();
    }
}
