# Deployment Guide

This guide outlines how to execute, build, and deploy the **Project From Problem** application in both local and cloud-based environments.

---

## 1. Running Locally (Ubuntu Server, Local PC, macOS, Windows)

The project leverages a single-root monorepo structure. You can install all dependencies, compile the application, and start it locally without any external dependencies.

### System Prerequisites
- **Node.js**: v18 or newer
- **npm**: v9 or newer

### Local Execution Commands

#### A. Install Dependencies
Run the install command at the root folder of the project to initialize both the server and client packages:
```bash
npm install
```

#### B. Run Live Developer Server
Launches the backend server in development mode. The server starts the Vite bundler as integrated middleware, enabling hot-reload code delivery:
```bash
npm run dev
```
*The application immediately becomes accessible on: **`http://localhost:3000`***

#### C. Compile / Production Build
Compiles the frontend assets into `/dist` and bundles the Express server file (`/backend/server.ts`) into a standalone CommonJS file `/dist/server.cjs` using `esbuild`:
```bash
npm run build
```

#### D. Run in Production Mode
Runs the pre-bundled standalone Express server file using plain Node.js. Serves optimized client pages statically:
```bash
npm run start
```

---

## 2. Deploying on Cloud Environments

To deploy the application in a durable full-stack environment, we use Docker containers or PaaS runners. Memory-only ephemeral databases are completely removed from cloud mode, ensuring transactions, user bookmarks, feedback suggestions, and roles survive container recycling securely.

### A. Core Requirements in Cloud Mode
When the platform detects `APP_ENV=cloud` or `NODE_ENV=production`:
1. It ignores root `db.json` files entirely.
2. It **requires** `DATABASE_URL` to be present.
3. On startup, before listening to port 3000, the application initiates an internal `DatabaseManager` pipeline:
   * **Phase 1: Automated Migrations**: Compares current schema migrations history against the `pfp_migrations` log table. Transactions apply missing tables, indexes, and constraints safely on first boot without any manual SQL setup.
   * **Phase 2: Elastic Connection Diagnostics (Retries)**: Attempts to connect to PostgreSQL. If the database is sleeping (such as a Supabase free tier database waking up from a scale-to-zero state), it retries automatically 5 times using exponential backoff to achieve high-availability startup success.
   * **Phase 3: Deep Health Check Scans**: Runs diagnostic checks validating tables, column schema types, indexed constraints, SSL encryption, and system time. If the database is missing, or health validation fails, the process stops booting immediately and exits with code 1.
   * **Phase 4: Database Seeding**: If the database tables have 0 active records, it automatically bootstraps high-quality, professional mockup seeds to make the app plug-and-play.

---

### B. Configuring your Supabase / PostgreSQL Instance
Standard deployments utilize a Supabase database instance:
1. Log into your **Supabase Console** or postgres provider.
2. Under project settings, find your **URI Transaction/Session Connection String**. It looks like this:
   ```text
   postgresql://postgres:your-secure-password@aws-0-us-east-1.pooler.supabase.com:5432/postgres
   ```
3. Store this URL strictly inside your environment variables in your cloud hosting portal.

---

### C. Cloud Containers (Google Cloud Run, AWS App Runner, Render, Railway, DigitalOcean App Platform)
This is the recommended deployment method. The root `package.json` compiles the static assets and bundles the Express app into a standalone production server on port `3000`.

1. Connect your Github Repository to your container provider (e.g. Render, Railway, or Google Cloud Run).
2. Configure active configurations:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
   - **Port**: Bind route entries to port `3000`.
3. Provide operational Environment Variables:
   ```env
   # Set environment context to cloud mode
   APP_ENV=cloud

   # Mandatory persistent Postgres address (e.g., Supabase, Neon)
   DATABASE_URL=postgresql://postgres:your-db-password@db-host.supabase.co:5432/postgres

   # Secured key for system tasks
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
Once deployed, the instances will connect to Supabase, migrate tables automatically at boot, and serve requests cleanly!
