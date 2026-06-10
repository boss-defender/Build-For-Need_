# Environment Modes

This document explains the runtime modes supported by **Project From Problem**, detailing how the application dynamically shifts its internal architecture and storage adapters based on your operational environment.

---

## 1. Environment Detection Mechanics

At startup, the backend server automatically auto-detects whether it is running inside a stable local development workflow or a distributed/containerized cloud platform.

The detection logic resides in a centralized configuration model in `/backend/storage.ts`:

- **LOCAL Mode**: Enabled when `APP_ENV` is set to `"local"` or is undefined, and no PostgreSQL connection is defined. This mode is customized for desktop developers, Ubuntu environments, or home servers. It operates exclusively using a local file store.
- **CLOUD Mode**: Enabled automatically when `APP_ENV` is set to `"cloud"` or the process is running with `NODE_ENV=production`. This mode strictly requires active database parameters and connects to a secure cloud-hosted database.

### Configuration Schema Map

| State / Variable | Local Mode | Cloud Mode |
| :--- | :--- | :--- |
| **`APP_ENV`** | `local` (or blank) | `cloud` |
| **`NODE_ENV`** | `development` (or production local) | `production` |
| **Storage Adapter** | `LocalFileStorageAdapter` | `PostgresStorageAdapter` |
| **Database Manager**| - | Runs `DatabaseManager` system on boot |
| **Data Persistence** | Reads/writes directly to local disk `db.json` | Persisted on cloud PostgreSQL (Supabase / Neon) |
| **Auto-Migrations** | - | Transactional migrations run automatically (`pfp_migrations`) |
| **Diagnostics / Retry**| - | Exponential backoff (5 retries), SSL check, column validations |
| **Filesystem Dependency**| Required (Read-Write) | Stateless / Ephemeral (Ignores disk) |
| **Startup Crash Fault** | Graceful fallback to bootstrap seed JSON | Immediate shell stop if database health check fails |

---

## 2. Supported Operational Modes & Behaviors

### A. Local Development Mode

- **Purpose**: Rapid local testing, lightweight inspection, and offline setup.
- **Operational Strategy**: Utilizes `LocalFileStorageAdapter`. Reads and saves records sequentially into a file called `db.json` in the root workspace directory.
- **Resiliency**: If `db.json` is missing, the adapter automatically bootstraps the local database with pre-populated, professional seed entries (users, problems, comments, and replies).

### B. Hosted Cloud Mode (Cloud Persistent)

- **Purpose**: Clean production deployments requiring permanent database durability across container restarts, scale-to-zero cycles, and multi-instance redeployments.
- **Operational Strategy**: Utilizes database adapters such as `PostgresStorageAdapter`. 
- **Auto-Migrations Integrity**: Instantiates `DatabaseManager` which automatically evaluates schema migration history against the `pfp_migrations` log table. If any DDL operations (under transaction scopes) are missing, they execute cleanly without destroying existing production data.
- **Diagnostics with Elastic Retries**: Since cloud relational datastores (like Supabase) scale down to zero on free plans and require 10-15 seconds to wake up, our health checks introduce exponential backoff (attempting connection 5 times, starting with 2 seconds interval).
- **No Memory-Only Fallback**: To ensure strict data integrity, any ephemeral memory fallback (`CloudMemoryStorageAdapter`) is entirely removed. If the connection cannot be established or configuration variables are missing, the server fails loudly with an explicit stack trace and stops booting immediately. This design enforces strict data safety and prevents accidental data loss.

---

## 3. Configuration Variables

Deploying or configuring your environments is managed entirely using these variables in your target environment dashboard or local `.env`:

```env
# --------------------------------------------------
# Operational Environment Variables
# --------------------------------------------------

# Sets the execution context ("local" or "cloud")
APP_ENV=local

# Required PostgreSQL DB URL (Switches storage mode to PostgreSQL, mandatory in cloud mode)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Gemini AI Key used securely server-side for system tasks (hidden from client)
GEMINI_API_KEY=your_gemini_api_key_here

# Base Hosting URL for reference (automatically provided in Cloud Run)
APP_URL=https://your-app-service.run.app
```
