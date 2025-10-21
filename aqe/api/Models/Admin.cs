using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class Admin
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [MaxLength(500)]
        public string Permissions { get; set; } = "full";
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;
        public ICollection<DigitalLibrary> DigitalLibraries { get; set; } = new List<DigitalLibrary>();
        public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
    }
}
