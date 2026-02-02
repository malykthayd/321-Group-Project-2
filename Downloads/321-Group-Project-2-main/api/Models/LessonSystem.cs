using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class LessonSection
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int LessonId { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string Type { get; set; } = string.Empty; // prior, direct, guided, independent, mastery, challenge, parent, vocab
        
        [Column(TypeName = "TEXT")]
        public string ContentJson { get; set; } = string.Empty;
        
        public int Order { get; set; }
        
        [ForeignKey("LessonId")]
        public Lesson Lesson { get; set; } = null!;
    }

    public class PracticeItem
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int LessonId { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string Section { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(50)]
        public string ItemType { get; set; } = string.Empty; // mcq, short_text, match, dragdrop
        
        [Column(TypeName = "TEXT")]
        public string PayloadJson { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(20)]
        public string DifficultyLevel { get; set; } = string.Empty; // Easy, Intermediate, Hard
        
        [ForeignKey("LessonId")]
        public Lesson Lesson { get; set; } = null!;
    }

    public class MiniGame
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int LessonId { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string GameType { get; set; } = string.Empty; // timed, conceptmap, match, memory, dragdrop
        
        [Column(TypeName = "TEXT")]
        public string ConfigJson { get; set; } = string.Empty;
        
        [ForeignKey("LessonId")]
        public Lesson Lesson { get; set; } = null!;
    }

    public class LessonBadge
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int LessonId { get; set; }
        
        [Required]
        public int BadgeId { get; set; }
        
        [ForeignKey("LessonId")]
        public Lesson Lesson { get; set; } = null!;
        
        [ForeignKey("BadgeId")]
        public Badge Badge { get; set; } = null!;
    }
}

