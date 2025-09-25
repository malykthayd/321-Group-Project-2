using Microsoft.EntityFrameworkCore;
using BasketballTrackerAPI.Models;

namespace BasketballTrackerAPI.Data
{
    public class BasketballTrackerContext : DbContext
    {
        public BasketballTrackerContext(DbContextOptions<BasketballTrackerContext> options) : base(options)
        {
        }

        public DbSet<Player> Players { get; set; }
        public DbSet<Stats> Stats { get; set; }
        public DbSet<Exercise> Exercises { get; set; }
        public DbSet<Workout> Workouts { get; set; }
        public DbSet<WorkoutSet> WorkoutSets { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Player configuration
            modelBuilder.Entity<Player>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Email).IsRequired().HasMaxLength(255);
                entity.Property(p => p.FirstName).IsRequired().HasMaxLength(50);
                entity.Property(p => p.LastName).IsRequired().HasMaxLength(50);
                entity.Property(p => p.Position).IsRequired().HasMaxLength(20);
                entity.Property(p => p.CreatedAt).IsRequired();
                entity.Property(p => p.UpdatedAt).IsRequired();
                
                entity.HasIndex(p => p.Email).IsUnique();
                
                entity.HasMany(p => p.Workouts)
                      .WithOne(w => w.Player)
                      .HasForeignKey(w => w.PlayerId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Stats configuration
            modelBuilder.Entity<Stats>(entity =>
            {
                entity.HasKey(s => s.Id);
                entity.Property(s => s.Date).IsRequired();
                entity.Property(s => s.GameType).IsRequired().HasMaxLength(50);
                entity.Property(s => s.Notes).HasMaxLength(500);
                entity.Property(s => s.CreatedAt).IsRequired();
                entity.Property(s => s.UpdatedAt).IsRequired();

                entity.HasOne(s => s.Player)
                      .WithMany()
                      .HasForeignKey(s => s.PlayerId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Exercise configuration
            modelBuilder.Entity<Exercise>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Category).HasMaxLength(50);
                entity.Property(e => e.CreatedAt).IsRequired();
                entity.Property(e => e.UpdatedAt).IsRequired();
            });

            // Workout configuration
            modelBuilder.Entity<Workout>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Date).IsRequired();
                entity.Property(e => e.Notes).HasMaxLength(200);
                entity.Property(e => e.CreatedAt).IsRequired();
                entity.Property(e => e.UpdatedAt).IsRequired();

            });

            // WorkoutSet configuration
            modelBuilder.Entity<WorkoutSet>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.SetNumber).IsRequired();
                entity.Property(e => e.Reps).IsRequired();
                entity.Property(e => e.Weight).IsRequired();
                entity.Property(e => e.CreatedAt).IsRequired();
                entity.Property(e => e.UpdatedAt).IsRequired();

                entity.HasOne(ws => ws.Workout)
                      .WithMany(w => w.Sets)
                      .HasForeignKey(ws => ws.WorkoutId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(ws => ws.Exercise)
                      .WithMany()
                      .HasForeignKey(ws => ws.ExerciseId)
                      .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}
