using Backend.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// --- Services ---------------------------------------------------------------

// Register the EF Core context using the SQLite connection string from appsettings.json.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddControllers();

// Swagger / OpenAPI (interactive API docs at /swagger).
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Allow the Angular dev server to call the API directly (handy if you skip the proxy).
const string FrontendCors = "frontend";
builder.Services.AddCors(options =>
    options.AddPolicy(FrontendCors, policy => policy
        .WithOrigins("http://localhost:4200")
        .AllowAnyHeader()
        .AllowAnyMethod()));

var app = builder.Build();

// --- Database bootstrap -----------------------------------------------------

// Create the SQLite file and schema (with seed data) on first run.
// For a real app you'd use EF Core migrations instead of EnsureCreated().
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// --- HTTP pipeline ----------------------------------------------------------

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors(FrontendCors);
app.MapControllers();

app.Run();
