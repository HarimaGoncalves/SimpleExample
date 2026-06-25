# Full-stack example — Angular + C# + SQL

A minimal but complete CRUD app demonstrating the three classic layers:

| Layer        | Technology                                   | Folder      |
| ------------ | -------------------------------------------- | ----------- |
| **Frontend** | Angular 18 (standalone components, signals)  | `frontend/` |
| **Backend**  | ASP.NET Core 8 Web API (C#)                  | `backend/`  |
| **Database** | SQLite via Entity Framework Core (free SQL)  | auto-created at `backend/products.db` |

The app manages a list of **products** (name, price, in-stock). You can list,
add, toggle stock, and delete — each action calls the C# API, which reads/writes
the SQLite database.

```
Browser ──HTTP──> Angular dev server (:4200)
                      │  /api/* proxied (proxy.conf.json)
                      ▼
                  ASP.NET Core API (:5000)  ──EF Core──>  SQLite (products.db)
```

---

## Prerequisites

> 🆕 **Setting this up on a fresh machine from scratch?** See **[SETUP.md](SETUP.md)** —
> a step-by-step guide (Windows/macOS/Linux) for installing every tool, running
> both apps, using the IDEs, and troubleshooting.

- **.NET 8 SDK** — already installed on this machine (`dotnet --version` → 8.0.x). ✅
- **Node.js 18+** (LTS 20 or 22 recommended) and npm, for the Angular app.
  > ⚠️ The Node on this shell's PATH is **v14.18.1**, which is end-of-life and
  > **too old** for Angular 18 (needs Node ^18.19 / ^20.11 / ^22). Use the newer
  > Node you already have for the Nx monorepo (Nx 20 requires Node 18+), e.g. via
  > `nvm use 20`, before running the frontend.

No database to install — SQLite is a single file created automatically on first run.

---

## Running it (two terminals)

### 1. Backend (C# API)

```bash
cd fullstack-example/backend
dotnet run
```

- API: <http://localhost:5000/api/products>
- Swagger UI: <http://localhost:5000/swagger>

On first run it creates `products.db` and seeds three rows.

### 2. Frontend (Angular)

```bash
cd fullstack-example/frontend
npm install
npm start
```

Open <http://localhost:4200>. The `npm start` script runs
`ng serve --proxy-config proxy.conf.json`, so calls to `/api/*` are forwarded to
the backend on port 5000 (no CORS needed in dev — though CORS is also enabled in
`Program.cs` as a fallback).

---

## API reference

| Method   | Route                | Body            | Description          |
| -------- | -------------------- | --------------- | -------------------- |
| `GET`    | `/api/products`      | —               | List all products    |
| `GET`    | `/api/products/{id}` | —               | Get one product      |
| `POST`   | `/api/products`      | `Product` JSON  | Create a product     |
| `PUT`    | `/api/products/{id}` | `Product` JSON  | Update a product     |
| `DELETE` | `/api/products/{id}` | —               | Delete a product     |

Example:

```bash
curl http://localhost:5000/api/products
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Webcam","price":59.90,"inStock":true}'
```

---

## How the layers connect

1. **Angular** (`product.service.ts`) calls `/api/products` with `HttpClient`.
2. The **dev-server proxy** (`proxy.conf.json`) forwards `/api/*` to the C# API.
3. **ASP.NET Core** (`ProductsController.cs`) handles the request and uses an
   injected `AppDbContext`.
4. **EF Core** translates LINQ (`_db.Products.ToListAsync()`) into SQL and runs
   it against **SQLite**.

---

## Project structure

```
fullstack-example/
├── Directory.Build.props      # isolates the example from the monorepo's MSBuild config
├── Directory.Build.targets    #   (empty caps — see comments inside)
├── Directory.Packages.props   # disables Central Package Management for this example
├── backend/
│   ├── nuget.config           # pins package source to nuget.org
│   ├── Backend.csproj
│   ├── Program.cs             # app startup, DI, EF Core + CORS + Swagger
│   ├── appsettings.json       # SQLite connection string
│   ├── Properties/launchSettings.json   # fixes the URL to http://localhost:5000
│   ├── Models/Product.cs      # entity mapped to the Products table
│   ├── Data/AppDbContext.cs   # EF Core context + seed data
│   └── Controllers/ProductsController.cs  # REST endpoints
└── frontend/
    ├── package.json, angular.json, tsconfig*.json
    ├── proxy.conf.json        # forwards /api -> :5000
    └── src/
        ├── main.ts, index.html, styles.css
        └── app/
            ├── app.config.ts      # provideHttpClient()
            ├── app.component.ts    # UI + list/add/toggle/delete
            ├── product.model.ts
            └── product.service.ts  # HttpClient calls
```

> **Note on the `Directory.*` files:** this example lives inside a .NET monorepo
> that uses Central Package Management and redirects build output. The three
> `Directory.*` cap files keep the example self-contained so `dotnet run` works
> here and if you copy the folder elsewhere.

---

## Want a different free SQL database?

SQLite needs zero setup, but EF Core makes swapping providers a one-line change.

**PostgreSQL** (free, open source):

```bash
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
```

```csharp
// Program.cs
options.UseNpgsql(builder.Configuration.GetConnectionString("Default"));
```

```jsonc
// appsettings.json
"Default": "Host=localhost;Database=demo;Username=postgres;Password=postgres"
```

**SQL Server Express / LocalDB** (free editions):

```bash
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
```

```csharp
options.UseSqlServer(builder.Configuration.GetConnectionString("Default"));
```

```jsonc
"Default": "Server=(localdb)\\MSSQLLocalDB;Database=demo;Trusted_Connection=True"
```

---

## Next steps / production notes

- This demo calls `db.Database.EnsureCreated()` for simplicity. For a real app,
  use **EF Core migrations**:
  ```bash
  dotnet tool install --global dotnet-ef
  dotnet ef migrations add Initial
  dotnet ef database update
  ```
- Add DTOs + validation (e.g. FluentValidation) instead of binding the entity
  directly in the controller.
- Add error handling/loading states and a real UI library on the frontend.
