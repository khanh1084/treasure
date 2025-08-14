using Microsoft.EntityFrameworkCore;
using TreasureApi.Models;

namespace TreasureApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<TreasureRun> TreasureRuns => Set<TreasureRun>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TreasureRun>(b =>
            {
                b.ToTable("treasure_runs");
                b.HasKey(x => x.Id);
                b.Property(x => x.MatrixJson).HasColumnType("jsonb");
                b.Property(x => x.PathJson).HasColumnType("jsonb");
                b.Property(x => x.CreatedAt).HasDefaultValueSql("NOW() AT TIME ZONE 'UTC'");
            });
        }
    }
}

