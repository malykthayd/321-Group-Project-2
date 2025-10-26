using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.SMS
{
    public class SmsKeyword
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Keyword { get; set; } = string.Empty; // START, HELP, STOP, etc.

        [Required]
        [MaxLength(10)]
        public string Locale { get; set; } = "en"; // en, es, fr, etc.

        public bool Active { get; set; } = true;

        [MaxLength(500)]
        public string? Description { get; set; }

        public int? FlowId { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        [ForeignKey("FlowId")]
        public Flow? Flow { get; set; }
    }
}

