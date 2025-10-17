using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class Lesson
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Subject { get; set; } = string.Empty; // Science, Technology, English, Math, Geography

        [Required]
        [MaxLength(50)]
        public string GradeLevel { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty; // HTML content of the lesson

        [MaxLength(500)]
        public string? ResourceUrl { get; set; } // Optional external resource

        [MaxLength(500)]
        public string? Tags { get; set; } // Comma-separated tags

        [Required]
        public int AdminId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        public bool IsActive { get; set; } = true;
        public bool IsAvailable { get; set; } = true;

        // Navigation properties
        [ForeignKey("AdminId")]
        public Admin Admin { get; set; } = null!;
        
        public ICollection<StudentLesson> StudentLessons { get; set; } = new List<StudentLesson>();
        public ICollection<DigitalLibraryAssignment> DigitalLibraryAssignments { get; set; } = new List<DigitalLibraryAssignment>();
    }
}
