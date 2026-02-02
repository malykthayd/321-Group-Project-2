using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models.SMS
{
    public class ProductionRoutingRule
    {
        [Key]
        public int Id { get; set; }
        public string Channel { get; set; } = "sms"; // sms|ussd
        public string MatcherType { get; set; } = "keyword"; // keyword|regex|startsWith
        public string MatcherValue { get; set; } = "START";
        public int FlowId { get; set; }
        public bool Active { get; set; } = true;
        public int Priority { get; set; } = 100;
    }

    public class ProductionFlow
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; } = "Onboarding";
        public string Type { get; set; } = "sms"; // sms|ussd
        public string Locale { get; set; } = "en";
        public string NodesJson { get; set; } = "{}";
        public string DefaultEntryNodeId { get; set; } = "n1";
        public bool Active { get; set; } = true;
        public int Version { get; set; } = 1;
    }

    public class ProductionFlowSession
    {
        [Key]
        public int Id { get; set; }
        public string Phone { get; set; } = "";
        public string Channel { get; set; } = "sms"; // sms|ussd
        public string StateJson { get; set; } = "{}"; // grade, subject, locale, lessonId
        public string CurrentNodeId { get; set; } = "n1";
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddMinutes(15);
        public bool Closed { get; set; } = false;
    }

    public class ProductionGatewayMessage
    {
        [Key]
        public long Id { get; set; }
        public string Direction { get; set; } = "in"; // in|out
        public string Channel { get; set; } = "sms"; // sms|ussd
        public string Phone { get; set; } = "";
        public string Text { get; set; } = "";
        public string Status { get; set; } = "queued"; // queued|sent|delivered|failed
        public string? Error { get; set; }
        public int? FlowId { get; set; }
        public int? SessionId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class ProductionContentTargeting
    {
        [Key]
        public int Id { get; set; }
        public string GradeBand { get; set; } = "g3"; // k,g1..g8
        public string Subject { get; set; } = "MATH";
        public string Language { get; set; } = "en";
        public string Difficulty { get; set; } = "easy";
        public string LessonId { get; set; } = ""; // lesson reference
    }
}

