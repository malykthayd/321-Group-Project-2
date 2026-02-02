using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class DigitalLibraryAssignment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int StudentId { get; set; }

        [Required]
        public int DigitalLibraryId { get; set; }

        public int? TeacherId { get; set; }

        [Required]
        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

        public DateTime? CompletedAt { get; set; }

        [MaxLength(1000)]
        public string? Notes { get; set; }

        [MaxLength(1000)]
        public string? StudentNotes { get; set; }

        // Navigation properties
        [ForeignKey("StudentId")]
        public Student Student { get; set; } = null!;

        [ForeignKey("DigitalLibraryId")]
        public DigitalLibrary DigitalLibrary { get; set; } = null!;

        [ForeignKey("TeacherId")]
        public Teacher? Teacher { get; set; }
    }
}
