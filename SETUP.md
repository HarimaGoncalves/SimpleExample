# Setup & Run from Zero

This guide takes a **brand-new machine with nothing installed** and gets the
full-stack example (React + C# + SQLite) running locally. Works on
**Windows, macOS, and Linux**.

> TL;DR once the prerequisites are installed:
> ```bash
> # terminal 1 — backend (C# API)        # terminal 2 — frontend (React)
> cd fullstack-example/backend            cd fullstack-example/frontend
> dotnet run                              npm install   # first time only
>                                         npm start
> ```
> Then open <http://localhost:3000>.

---

## 1. What you're installing and why

| Tool | Why you need it | Minimum version |
| --- | --- | --- |
| **.NET SDK** | Builds & runs the C# backend | **8.0** |
| **Node.js + npm** | Builds & runs the React frontend | **Node 18.19+ / 20.11+ / 22** (LTS 20 or 22 recommended) |
| **Git** | To clone the code (skip if you copy the folder) | any recent |
| **An editor** (optional) | Visual Studio 2022 and/or VS Code | — |

> **No database to install.** The app uses **SQLite**, a file-based SQL engine
> that ships with the .NET package — a single `products.db` file is created
> automatically on first run.

---

## 2. Install the prerequisites

Pick your operating system. After installing, **open a new terminal** so the
`PATH` changes take effect, then jump to [step 3 (verify)](#3-verify-the-tools).

### Windows

Easiest with **winget** (built into Windows 10/11). In PowerShell:

```powershell
winget install Microsoft.DotNet.SDK.8
winget install OpenJS.NodeJS.LTS
winget install Git.Git
# Optional editors:
winget install Microsoft.VisualStudioCode
winget install Microsoft.VisualStudio.2022.Community   # full IDE for C#
```

Or download the installers manually:
- .NET 8 SDK: <https://dotnet.microsoft.com/download/dotnet/8.0>
- Node.js LTS: <https://nodejs.org/>
- Git: <https://git-scm.com/download/win>

> For Visual Studio, during install tick the **"ASP.NET and web development"**
> workload (needed to open/run the backend).

### macOS

With [Homebrew](https://brew.sh/):

```bash
brew install --cask dotnet-sdk      # .NET 8 SDK
brew install node                    # Node.js + npm (or: brew install node@20)
brew install git
brew install --cask visual-studio-code   # optional
```

### Linux (Ubuntu / Debian)

```bash
# .NET 8 SDK
sudo apt-get update && sudo apt-get install -y dotnet-sdk-8.0
# Node.js 20 LTS (NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
# Git
sudo apt-get install -y git
```

> If `dotnet-sdk-8.0` isn't found, follow Microsoft's distro-specific steps:
> <https://learn.microsoft.com/dotnet/core/install/linux>

> **Tip — managing Node versions:** if you work on multiple projects, install
> [nvm](https://github.com/nvm-sh/nvm) (macOS/Linux) or
> [nvm-windows](https://github.com/coreybutler/nvm-windows), then `nvm install 20 && nvm use 20`.

---

## 3. Verify the tools

In a **new** terminal:

```bash
dotnet --version    # expect 8.x  (e.g. 8.0.x)
node --version      # expect v20.x or v22.x  (must be >= 18.19)
npm --version       # expect 9.x or 10.x
```

If any command is "not found", the installer's PATH change hasn't loaded —
close and reopen the terminal (or sign out/in on Windows).

---

## 4. Get the code

**If it's in a Git repo:**
```bash
git clone <your-repo-url>
cd <repo>/fullstack-example
```

**If you're copying it manually:** copy the **entire `fullstack-example/`
folder** (it's self-contained — it includes its own `nuget.config` and the
`Directory.*` files it needs to build on its own). Do **not** copy
`node_modules/`, `bin/`, `obj/`, or `dist/` — those are regenerated.

---

## 5. Run the backend (C# API)

```bash
cd fullstack-example/backend
dotnet run
```

First run restores NuGet packages (needs internet), creates `products.db`, and
seeds 3 products. You should see:

```
Now listening on: http://localhost:5000
Application started. Press Ctrl+C to shut down.
```

Check it:
- API: <http://localhost:5000/api/products>
- Swagger (interactive docs): <http://localhost:5000/swagger>

Leave this terminal running.

---

## 6. Run the frontend (React)

In a **second** terminal:

```bash
cd fullstack-example/frontend
npm install      # first time only — downloads dependencies (a few minutes)
npm start
```

When you see `Local: http://localhost:3000/`, open
**<http://localhost:3000>** in a browser.

You should see the product list. Add a product, tick/untick stock, delete —
each action calls the C# API, which reads/writes SQLite.

> **How they connect:** `npm start` starts the React development server.
> Requests to `/api/*` are forwarded to the backend by `src/setupProxy.js`,
> so there are no cross-origin issues in development.

---

## 7. Running from an IDE (optional)

**Visual Studio (backend):** File → Open → Project/Solution →
`backend/Backend.csproj`, then press **F5** (debug) or **Ctrl+F5** (run). It
starts on :5000.

**VS Code (frontend):** File → Open Folder → `frontend`, open a terminal
(`` Ctrl+` ``), run `npm install` then `npm start`. Recommended extension:
*Angular Language Service*.

**VS Code (both):** open the `fullstack-example` folder, install the
**C# Dev Kit** extension, and use two terminals (`dotnet run` and `npm start`).

---

## 8. Troubleshooting

| Symptom | Cause / Fix |
| --- | --- |
| `dotnet: command not found` | SDK not installed or PATH not loaded — reinstall and **open a new terminal**. |
| React install/serve fails with an **engine/Node version** error | Node is too old. Install Node 20 or 22 (`nvm use 20`). |
| **Port 5000 already in use** | Stop the other process, or run `dotnet run --urls http://localhost:5050` **and** update the backend target in `src/setupProxy.js` to `http://localhost:5050`. |
| **Port 3000 already in use** | Set `PORT=3001` then run `npm start`, or on Windows use `set PORT=3001 && npm start`. |
| `npm install` fails behind a **corporate proxy** | Configure npm: `npm config set proxy http://user:pass@host:port` and the same for `https-proxy`. |
| `dotnet restore` fails behind a **proxy/firewall** | The bundled `backend/nuget.config` uses nuget.org. Configure your proxy, or change it to your internal NuGet feed. |
| `npm` is not recognized or `react-scripts` fails | Run `npm install` inside `frontend` first. If PowerShell blocks npm, use `npm.cmd install` then `npm.cmd start` or `cmd /c npm install` / `cmd /c npm start`. |
| **PowerShell** blocks `ng` with a script-execution error | Use `npm.cmd start` or `cmd /c npm start`. To allow global `ng`, run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`. |
| The page loads but shows **no products / network errors** | The backend isn't running. Start it (step 5) first, then refresh :4200. |
| Want a **clean database** | Stop the API and delete `backend/products.db` (and `-shm`/`-wal` if present). It reseeds on next run. |
| Browser shows a `favicon.ico` 404 in the console | Harmless — no favicon is included. |

---

## 9. Going to production (optional)

The `/api` **proxy is development-only** (`ng serve`). For a real deployment:

**Build the frontend** to static files:
```bash
cd frontend
npm run build           # output in frontend/build
```

**Publish the backend:**
```bash
cd backend
dotnet publish -c Release -o publish
dotnet publish/Backend.dll      # or deploy the publish/ folder
```

In production the built Angular app requests `/api/...` relative to wherever
it's hosted, so either **serve the Angular files from the same origin as the
API**, or put a **reverse proxy** (nginx, IIS, YARP, etc.) in front that routes
`/api` to the backend. You'd also switch SQLite for a server database
(PostgreSQL / SQL Server) — see the "different free SQL database" section in
[README.md](README.md).

---

## 10. Quick reference

```bash
# Versions
dotnet --version
node --version

# Backend
cd fullstack-example/backend
dotnet run                       # http://localhost:5000  (Swagger at /swagger)

# Frontend
cd fullstack-example/frontend
npm install                      # first time only
npm start                        # http://localhost:3000

# Reset the database
#   delete backend/products.db, then `dotnet run` again
```
