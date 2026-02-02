using System.ComponentModel.DataAnnotations;

namespace api.Models.SMS
{
    public class OptIn
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(20)]
        public string PhoneE164 { get; set; } = string.Empty;

        [Required]
        [MaxLength(10)]
        public string Channel { get; set; } = "sms"; // sms, ussd

        [Required]
        public bool OptedIn { get; set; } = false;

        [MaxLength(100)]
        public string? ConsentSource { get; set; } // web_form, sms_reply, teacher_enrollment

        public DateTime? ConsentAt { get; set; }

        [MaxLength(10)]
        public string Locale { get; set; } = "en";

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}

