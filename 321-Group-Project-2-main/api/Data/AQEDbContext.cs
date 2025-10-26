using Microsoft.EntityFrameworkCore;
using api.Models;
using api.Helpers;
using api.Models.SMS;

namespace api.Data
{
    public class AQEDbContext : DbContext
    {
        public AQEDbContext(DbContextOptions<AQEDbContext> options) : base(options)
        {
        }

        // DbSet properties for all entities
        public DbSet<User> Users { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Teacher> Teachers { get; set; }
        public DbSet<Parent> Parents { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<ParentStudent> ParentStudents { get; set; }
        public DbSet<Lesson> Lessons { get; set; }
        public DbSet<StudentLesson> StudentLessons { get; set; }
        public DbSet<PracticeMaterial> PracticeMaterials { get; set; }
        public DbSet<StudentPracticeMaterial> StudentPracticeMaterials { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<DigitalLibrary> DigitalLibraries { get; set; }
        public DbSet<DigitalLibraryAssignment> DigitalLibraryAssignments { get; set; }
        public DbSet<Badge> Badges { get; set; }
        public DbSet<StudentBadge> StudentBadges { get; set; }
        public DbSet<StudentStatistics> StudentStatistics { get; set; }

        // SMS/USSD DbSet properties
        public DbSet<GatewayNumber> GatewayNumbers { get; set; }
        public DbSet<SmsKeyword> SmsKeywords { get; set; }
        public DbSet<Flow> Flows { get; set; }
        public DbSet<FlowSession> FlowSessions { get; set; }
        public DbSet<GatewayMessage> GatewayMessages { get; set; }
        public DbSet<RoutingRule> RoutingRules { get; set; }
        public DbSet<ContentTargeting> ContentTargetings { get; set; }
        public DbSet<OptIn> OptIns { get; set; }

        // Subscription and Donation
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<Donation> Donations { get; set; }

        // Lesson System (Complete)
        public DbSet<LessonSection> LessonSections { get; set; }
        public DbSet<PracticeItem> PracticeItems { get; set; }
        public DbSet<MiniGame> MiniGames { get; set; }
        public DbSet<LessonBadge> LessonBadges { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User entity configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.Role);
                entity.ToTable(t => t.HasCheckConstraint("CK_User_Role", "Role IN ('student', 'teacher', 'parent', 'admin')"));

                // One-to-one relationships
                entity.HasOne(u => u.Student)
                    .WithOne(s => s.User)
                    .HasForeignKey<Student>(s => s.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(u => u.Teacher)
                    .WithOne(t => t.User)
                    .HasForeignKey<Teacher>(t => t.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(u => u.Parent)
                    .WithOne(p => p.User)
                    .HasForeignKey<Parent>(p => p.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(u => u.Admin)
                    .WithOne(a => a.User)
                    .HasForeignKey<Admin>(a => a.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Student entity configuration
            modelBuilder.Entity<Student>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.UserId).IsUnique();
                entity.HasIndex(e => e.AccessCode);
                entity.HasIndex(e => e.TeacherId);

                entity.HasOne(s => s.Teacher)
                    .WithMany()
                    .HasForeignKey(s => s.TeacherId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Teacher entity configuration
            modelBuilder.Entity<Teacher>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.UserId).IsUnique();
            });

            // Parent entity configuration
            modelBuilder.Entity<Parent>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.UserId).IsUnique();
            });

            // Admin entity configuration
            modelBuilder.Entity<Admin>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.UserId).IsUnique();
            });

            // ParentStudent entity configuration
            modelBuilder.Entity<ParentStudent>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => new { e.ParentId, e.StudentId }).IsUnique();

                entity.HasOne(ps => ps.Parent)
                    .WithMany(p => p.ParentStudents)
                    .HasForeignKey(ps => ps.ParentId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(ps => ps.Student)
                    .WithMany(s => s.ParentStudents)
                    .HasForeignKey(ps => ps.StudentId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Lesson entity configuration
            modelBuilder.Entity<Lesson>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Subject);
                entity.HasIndex(e => e.GradeLevel);

                entity.HasOne(l => l.Admin)
                    .WithMany(a => a.Lessons)
                    .HasForeignKey(l => l.AdminId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // StudentLesson entity configuration
            modelBuilder.Entity<StudentLesson>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => new { e.StudentId, e.LessonId }).IsUnique();

                entity.HasOne(sl => sl.Student)
                    .WithMany(s => s.StudentLessons)
                    .HasForeignKey(sl => sl.StudentId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(sl => sl.Lesson)
                    .WithMany(l => l.StudentLessons)
                    .HasForeignKey(sl => sl.LessonId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // PracticeMaterial entity configuration
            modelBuilder.Entity<PracticeMaterial>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Subject);
                entity.HasIndex(e => e.TeacherId);

                entity.HasOne(pm => pm.Teacher)
                    .WithMany()
                    .HasForeignKey(pm => pm.TeacherId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // StudentPracticeMaterial entity configuration
            modelBuilder.Entity<StudentPracticeMaterial>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(spm => spm.Student)
                    .WithMany(s => s.StudentPracticeMaterials)
                    .HasForeignKey(spm => spm.StudentId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(spm => spm.PracticeMaterial)
                    .WithMany(pm => pm.StudentPracticeMaterials)
                    .HasForeignKey(spm => spm.PracticeMaterialId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Question entity configuration
            modelBuilder.Entity<Question>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(q => q.PracticeMaterial)
                    .WithMany(pm => pm.Questions)
                    .HasForeignKey(q => q.PracticeMaterialId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // DigitalLibrary entity configuration
            modelBuilder.Entity<DigitalLibrary>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Subject);
                entity.HasIndex(e => e.GradeLevel);

                entity.HasOne(dl => dl.Admin)
                    .WithMany(a => a.DigitalLibraries)
                    .HasForeignKey(dl => dl.AdminId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // DigitalLibraryAssignment entity configuration
            modelBuilder.Entity<DigitalLibraryAssignment>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(dla => dla.Student)
                    .WithMany(s => s.DigitalLibraryAssignments)
                    .HasForeignKey(dla => dla.StudentId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(dla => dla.DigitalLibrary)
                    .WithMany(dl => dl.DigitalLibraryAssignments)
                    .HasForeignKey(dla => dla.DigitalLibraryId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(dla => dla.Teacher)
                    .WithMany()
                    .HasForeignKey(dla => dla.TeacherId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Badge entity configuration
            modelBuilder.Entity<Badge>(entity =>
            {
                entity.HasKey(e => e.Id);
            });

            // StudentBadge entity configuration
            modelBuilder.Entity<StudentBadge>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => new { e.StudentId, e.BadgeId }).IsUnique();

                entity.HasOne(sb => sb.Student)
                    .WithMany(s => s.StudentBadges)
                    .HasForeignKey(sb => sb.StudentId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(sb => sb.Badge)
                    .WithMany(b => b.StudentBadges)
                    .HasForeignKey(sb => sb.BadgeId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // StudentStatistics entity configuration
            modelBuilder.Entity<StudentStatistics>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.StudentId).IsUnique();

                entity.HasOne(ss => ss.Student)
                    .WithOne(s => s.Statistics)
                    .HasForeignKey<StudentStatistics>(ss => ss.StudentId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // SMS/USSD entity configurations
            modelBuilder.Entity<GatewayNumber>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.PhoneE164).IsUnique();
            });

            modelBuilder.Entity<SmsKeyword>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => new { e.Keyword, e.Locale }).IsUnique();
            });

            modelBuilder.Entity<Flow>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Type);
                entity.HasIndex(e => e.Active);
            });

            modelBuilder.Entity<FlowSession>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.PhoneE164);
                entity.HasIndex(e => e.ExpiresAt);
            });

            modelBuilder.Entity<GatewayMessage>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.PhoneE164);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.CreatedAt);
            });

            modelBuilder.Entity<RoutingRule>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Channel);
                entity.HasIndex(e => e.Priority);
                entity.HasIndex(e => e.Active);
            });

            modelBuilder.Entity<ContentTargeting>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Priority);
                entity.HasIndex(e => e.Active);
            });

            modelBuilder.Entity<OptIn>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => new { e.PhoneE164, e.Channel }).IsUnique();
            });

            // Seed initial demo data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            var now = DateTime.UtcNow;

            // Seed Users
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Name = "Demo Student",
                    Email = "student@demo.com",
                    Password = PasswordHelper.HashPassword("student123"),
                    Role = "student",
                    CreatedAt = now,
                    IsActive = true
                },
                new User
                {
                    Id = 2,
                    Name = "Demo Teacher",
                    Email = "teacher@demo.com",
                    Password = PasswordHelper.HashPassword("teacher123"),
                    Role = "teacher",
                    CreatedAt = now,
                    IsActive = true
                },
                new User
                {
                    Id = 3,
                    Name = "Demo Parent",
                    Email = "parent@demo.com",
                    Password = PasswordHelper.HashPassword("parent123"),
                    Role = "parent",
                    CreatedAt = now,
                    IsActive = true
                },
                new User
                {
                    Id = 4,
                    Name = "Demo Admin",
                    Email = "admin@demo.com",
                    Password = PasswordHelper.HashPassword("admin123"),
                    Role = "admin",
                    CreatedAt = now,
                    IsActive = true
                },
                new User
                {
                    Id = 5,
                    Name = "Jane Smith",
                    Email = "jane@demo.com",
                    Password = PasswordHelper.HashPassword("789012"), // Access code as password for class student
                    Role = "student",
                    CreatedAt = now,
                    IsActive = true
                }
            );

            // Seed Teacher
            modelBuilder.Entity<Teacher>().HasData(
                new Teacher
                {
                    Id = 1,
                    UserId = 2,
                    SubjectTaught = "Mathematics",
                    GradeLevelTaught = "6th-8th Grade"
                }
            );

            // Seed Students
            modelBuilder.Entity<Student>().HasData(
                new Student
                {
                    Id = 1,
                    UserId = 1,
                    GradeLevel = "8th Grade",
                    AccessCode = "123456",
                    TeacherId = 1,
                    IsIndependent = false,
                    CreatedAt = now,
                    UpdatedAt = now
                },
                new Student
                {
                    Id = 2,
                    UserId = 5,
                    GradeLevel = "7th Grade",
                    AccessCode = "789012",
                    TeacherId = 1,
                    IsIndependent = false,
                    CreatedAt = now,
                    UpdatedAt = now
                }
            );

            // Seed Parent
            modelBuilder.Entity<Parent>().HasData(
                new Parent
                {
                    Id = 1,
                    UserId = 3,
                    ChildrenEmails = "[\"student@demo.com\"]",
                    CreatedAt = now,
                    UpdatedAt = now
                }
            );

            // Seed Admin
            modelBuilder.Entity<Admin>().HasData(
                new Admin
                {
                    Id = 1,
                    UserId = 4,
                    Permissions = "{\"user_management\": true, \"content_management\": true, \"system_settings\": true, \"analytics\": true}",
                    CreatedAt = now,
                    UpdatedAt = now
                }
            );
        }
    }
}

