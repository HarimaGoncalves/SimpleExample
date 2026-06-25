using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

/// <summary>
/// The Entity Framework Core database context. Each <see cref="DbSet{T}"/>
/// becomes a table; LINQ queries against it are translated into SQL.
/// </summary>
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Seed a few rows so the app shows data the first time it runs.
        modelBuilder.Entity<Product>().HasData(
            new Product { Id = 1, Name = "Mechanical Keyboard", Price = 89.99m, InStock = true },
            new Product { Id = 2, Name = "Wireless Mouse", Price = 24.50m, InStock = true },
            new Product { Id = 3, Name = "27\" Monitor", Price = 199.00m, InStock = false }
        );
    }
}
