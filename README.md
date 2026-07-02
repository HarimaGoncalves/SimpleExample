# Full-stack example — React + C# + SQL

A minimal CRUD example demonstrating two layers:

| Layer        | Technology                                   | Folder      |
| ------------ | -------------------------------------------- | ----------- |
| **Frontend** | React 18 + TypeScript                         | `frontend/` |
| **Backend**  | ASP.NET Core 8 Web API (C#)                  | `backend/`  |
| **Database** | SQLite via Entity Framework Core              | auto-created at `backend/products.db` |

The app manages a list of **products** (name, price, in-stock). The React UI
calls the C# API, and the API persists data in SQLite.

```
Browser ──HTTP──> React dev server (:3000)
                      │  /api/* proxied (setupProxy.js)
                      ▼
                  ASP.NET Core API (:5000)  ──EF Core──>  SQLite (products.db)
```

---

## Prerequisites

- **.NET 8 SDK**
- **Node.js 18+** and npm

If you need a full setup guide, see **[SETUP.md](SETUP.md)**.

---

## Running the app

### 1. Start the backend

```bash
cd backend
dotnet run
```

- Backend API: `http://localhost:5000`
- Swagger UI: `http://localhost:5000/swagger`

On first run the app creates the SQLite database and seeds sample products.

### 2. Start the frontend

```bash
cd frontend
npm install
npm start
```

Open `http://localhost:3000` in your browser.

The React dev server uses `src/setupProxy.js` to forward `/api/*` to
`http://localhost:5000`, so frontend requests reach the backend.

---

## Project structure

```
fullstack-example/
├── backend/
│   ├── Backend.csproj
│   ├── Program.cs
│   ├── appsettings.json
│   ├── Controllers/
│   ├── Data/
│   ├── Models/
│   └── README.md
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── public/
│   ├── src/
│   └── README.md
├── README.md
└── SETUP.md
```

---

## Notes

- The backend is an ASP.NET Core Web API using EF Core with SQLite.
- The frontend is a Create React App-based project.
- The frontend proxy is configured in `src/setupProxy.js`.
- The backend listens on `http://localhost:5000` by default.

---

## API reference

| Method   | Route                | Description          |
| -------- | -------------------- | -------------------- |
| `GET`    | `/api/products`      | List all products    |
| `GET`    | `/api/products/{id}` | Get a single product |
| `POST`   | `/api/products`      | Create a product     |
| `PUT`    | `/api/products/{id}` | Update a product     |
| `DELETE` | `/api/products/{id}` | Delete a product     |

Example:

```bash
curl http://localhost:5000/api/products
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Webcam","price":59.90,"inStock":true}'
```

---

## Additional resources

- `backend/README.md` — backend startup and API notes
- `frontend/README.md` — frontend startup commands
