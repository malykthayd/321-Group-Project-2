using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.SMS
{
    public class Flow
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Type { get; set; } = "sms"; // sms, ussd

        [Required]
        [MaxLength(10)]
        public string Locale { get; set; } = "en";

        [Required]
        [MaxLength(20)]
        public string Version { get; set; } = "1.0.0";

        public string NodesJson { get; set; } = "[]"; // JSON array of nodes

        public string EdgesJson { get; set; } = "[]"; // JSON array of edges

        public int? DefaultEntryNodeId { get; set; }

        public bool Active { get; set; } = true;

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        public ICollection<FlowSession> FlowSessions { get; set; } = new List<FlowSession>();
        public ICollection<SmsKeyword> SmsKeywords { get; set; } = new List<SmsKeyword>();
        public ICollection<RoutingRule> RoutingRules { get; set; } = new List<RoutingRule>();
    }
}

