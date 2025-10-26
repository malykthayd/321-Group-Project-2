using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class StudentPracticeMaterial
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int StudentId { get; set; }

        [Required]
        public int PracticeMaterialId { get; set; }

        [Required]
        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

        public DateTime? StartedAt { get; set; }

        public DateTime? CompletedAt { get; set; }

        public int? Score { get; set; }

        public int? TotalQuestions { get; set; }

        [MaxLength(1000)]
        public string? Notes { get; set; }

        // Navigation properties
        [ForeignKey("StudentId")]
        public Student Student { get; set; } = null!;

        [ForeignKey("PracticeMaterialId")]
        public PracticeMaterial PracticeMaterial { get; set; } = null!;
    }
}
