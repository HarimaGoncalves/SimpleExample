namespace Backend.Models;

/// <summary>
/// A single row in the Products table. EF Core maps this class to the database.
/// </summary>
public class Product
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public bool InStock { get; set; }
}
