# Backend

This is the .NET backend for the fullstack-example project.

## Run

Start the backend from the `backend` folder:

```bash
dotnet run
```

The API will listen on:

- `http://localhost:5000`

## Notes

- The frontend proxy expects the backend at `http://localhost:5000/api/...`.
- Swagger UI is available at `http://localhost:5000/swagger`.
- The project uses SQLite and creates the database automatically on first run.
