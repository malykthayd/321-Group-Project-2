using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.SMS
{
    public class GatewayMessage
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(10)]
        public string Direction { get; set; } = "in"; // in, out

        [Required]
        [MaxLength(10)]
        public string Channel { get; set; } = "sms"; // sms, ussd

        [Required]
        [MaxLength(20)]
        public string PhoneE164 { get; set; } = string.Empty;

        public string PayloadJson { get; set; } = "{}"; // Full message payload

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "queued"; // queued, sent, delivered, failed

        [MaxLength(500)]
        public string? ErrorText { get; set; }

        public int? FlowId { get; set; }

        public int? SessionId { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? SentAt { get; set; }

        public DateTime? DeliveredAt { get; set; }

        // Navigation properties
        [ForeignKey("FlowId")]
        public Flow? Flow { get; set; }

        [ForeignKey("SessionId")]
        public FlowSession? Session { get; set; }
    }
}

