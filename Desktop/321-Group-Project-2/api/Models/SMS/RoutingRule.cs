using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.SMS
{
    public class RoutingRule
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(10)]
        public string Channel { get; set; } = "sms"; // sms, ussd

        [Required]
        [MaxLength(50)]
        public string MatcherType { get; set; } = "keyword"; // keyword, starts_with, regex

        [Required]
        [MaxLength(200)]
        public string MatcherValue { get; set; } = string.Empty; // The actual value to match

        [Required]
        public int FlowId { get; set; }

        [Required]
        public int Priority { get; set; } = 0; // Lower number = higher priority

        public bool Active { get; set; } = true;

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        [ForeignKey("FlowId")]
        public Flow Flow { get; set; } = null!;
    }
}

