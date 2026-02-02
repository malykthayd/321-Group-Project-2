using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class ParentStudent
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ParentId { get; set; }

        [Required]
        public int StudentId { get; set; }

        public DateTime LinkedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("ParentId")]
        public Parent Parent { get; set; } = null!;

        [ForeignKey("StudentId")]
        public Student Student { get; set; } = null!;
    }
}
