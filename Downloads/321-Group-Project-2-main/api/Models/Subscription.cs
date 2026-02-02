using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class Subscription
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string PlanType { get; set; } = string.Empty; // "free", "premium_parent", "premium_teacher"

        [Required]
        [MaxLength(100)]
        public string PlanName { get; set; } = string.Empty;

        [Column(TypeName = "decimal(10,2)")]
        public decimal MonthlyPrice { get; set; } = 0;

        public DateTime StartDate { get; set; } = DateTime.UtcNow;

        public DateTime? EndDate { get; set; }

        public bool IsActive { get; set; } = true;

        [MaxLength(100)]
        public string? StripeSubscriptionId { get; set; }

        [MaxLength(100)]
        public string? StripeCustomerId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;
    }

    public class Donation
    {
        [Key]
        public int Id { get; set; }

        public int? UserId { get; set; } // Optional - anonymous donations allowed

        [MaxLength(255)]
        public string? DonorName { get; set; }

        [MaxLength(255)]
        public string? Email { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal Amount { get; set; }

        [MaxLength(50)]
        public string? PaymentMethod { get; set; } // "stripe", "paypal", "patreon"

        [MaxLength(100)]
        public string? TransactionId { get; set; }

        public bool IsAnonymous { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("UserId")]
        public User? User { get; set; }
    }
}

