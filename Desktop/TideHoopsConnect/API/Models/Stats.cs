using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BasketballTrackerAPI.Models
{
    public class Stats
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int PlayerId { get; set; }

        [ForeignKey(nameof(PlayerId))]
        public Player? Player { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        [MaxLength(50)]
        public string GameType { get; set; } = string.Empty;

        public int ThreePointAttempts { get; set; } = 0;
        public int ThreePointMakes { get; set; } = 0;
        public int TwoPointAttempts { get; set; } = 0;
        public int TwoPointMakes { get; set; } = 0;
        public int FreeThrowAttempts { get; set; } = 0;
        public int FreeThrowMakes { get; set; } = 0;
        public int Assists { get; set; } = 0;
        public int Rebounds { get; set; } = 0;

        [MaxLength(500)]
        public string? Notes { get; set; }

        // Audit fields
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
