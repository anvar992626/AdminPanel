using Microsoft.EntityFrameworkCore;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique()
            .HasDatabaseName("IX_Users_Email"); // Named index for better management

        modelBuilder.Entity<User>().Property(u => u.IsBlocked).HasDefaultValue(false);
        modelBuilder.Entity<User>().Property(u => u.IsDeleted).HasDefaultValue(false);
        modelBuilder.Entity<User>().Property(u => u.LastLoginTime).HasDefaultValue(null);
    }
}
