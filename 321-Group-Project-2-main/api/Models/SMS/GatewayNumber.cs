using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.SMS
{
    public class GatewayNumber
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Provider { get; set; } = "mock"; // mock, twilio, etc.

        [Required]
        [MaxLength(20)]
        public string PhoneE164 { get; set; } = string.Empty; // +15551234567

        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "active"; // active, inactive, suspended

        [MaxLength(1000)]
        public string? CapabilitiesJson { get; set; } // JSON: {sms: true, mms: true, voice: true}

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}

