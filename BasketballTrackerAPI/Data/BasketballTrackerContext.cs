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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Player entity (consolidated User + Player)
            modelBuilder.Entity<Player>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(50);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Position).IsRequired().HasMaxLength(20);
                entity.Property(e => e.PhotoUrl).HasMaxLength(500);
                entity.Property(e => e.CreatedAt).IsRequired();
                entity.Property(e => e.UpdatedAt).IsRequired();
                
                // Create unique index on email
                entity.HasIndex(e => e.Email).IsUnique();
            });
        }
    }
}
