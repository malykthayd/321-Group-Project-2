using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class DigitalLibrary
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Subject { get; set; } = string.Empty; // Science, Technology, English, Math, Geography

        [Required]
        [MaxLength(50)]
        public string GradeLevel { get; set; } = string.Empty; // Kindergarten - 8th Grade

        [Required]
        [MaxLength(1000)]
        public string Content { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? ResourceUrl { get; set; }

        [MaxLength(500)]
        public string? Tags { get; set; }

        [Required]
        public int AdminId { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        [Required]
        public bool IsActive { get; set; } = true;

        [Required]
        public bool IsAvailable { get; set; } = true; // Admin can make lessons available/unavailable

        // Navigation property
        [ForeignKey("AdminId")]
        public Admin Admin { get; set; } = null!;

        public ICollection<DigitalLibraryAssignment> DigitalLibraryAssignments { get; set; } = new List<DigitalLibraryAssignment>();
    }
}
