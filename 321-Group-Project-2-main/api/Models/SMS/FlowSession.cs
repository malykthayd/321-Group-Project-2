using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.SMS
{
    public class FlowSession
    {
        [Key]
        public int Id { get; set; }

        public int? UserId { get; set; } // Null for guest/unauthenticated

        [Required]
        [MaxLength(20)]
        public string PhoneE164 { get; set; } = string.Empty;

        [Required]
        [MaxLength(10)]
        public string Channel { get; set; } = "sms"; // sms, ussd

        public string StateJson { get; set; } = "{}"; // JSON: {grade: "3-4", subject: "Math", currentStep: 2}

        public int? CurrentNodeId { get; set; }

        [Required]
        [MaxLength(10)]
        public string Locale { get; set; } = "en";

        [Required]
        public DateTime ExpiresAt { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public int? FlowId { get; set; }

        // Navigation properties
        [ForeignKey("FlowId")]
        public Flow? Flow { get; set; }

        public ICollection<GatewayMessage> Messages { get; set; } = new List<GatewayMessage>();
    }
}

