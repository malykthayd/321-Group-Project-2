using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class Student
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [MaxLength(50)]
        public string GradeLevel { get; set; } = string.Empty;

        [MaxLength(6)]
        public string? AccessCode { get; set; }

        public int? TeacherId { get; set; } // null for independent students
        
        public bool IsIndependent { get; set; } = false; // true if not part of a teacher's class
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("UserId")]
        public User User { get; set; } = null!;

        [ForeignKey("TeacherId")]
        public Teacher? Teacher { get; set; }
        
        public ICollection<ParentStudent> ParentStudents { get; set; } = new List<ParentStudent>();
        public ICollection<StudentLesson> StudentLessons { get; set; } = new List<StudentLesson>();
        public ICollection<StudentPracticeMaterial> StudentPracticeMaterials { get; set; } = new List<StudentPracticeMaterial>();
        public ICollection<DigitalLibraryAssignment> DigitalLibraryAssignments { get; set; } = new List<DigitalLibraryAssignment>();
    }
}
