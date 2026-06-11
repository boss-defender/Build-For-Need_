# Database Architecture & Persistence Schema

This document details the complete persistent database architecture, transactional migration schema, and automated startup health validation system implemented inside the **Project From Problem** application.

---

## 1. Architectural Overview

The application utilizes an environment-aware, pluggable architecture targeting high-grade cloud performance without sacrificing local development simplicity. 

The storage layer is defined under `/backend/storage.ts` and managed by the `IStorageAdapter` interface:

*   **`LocalFileStorageAdapter`**: Selected when `APP_ENV=local` (or blank). Reads and writes directly to root `db.json` on disk. Automates pristine seed bootstrapping on first run if the file doesn't exist.
*   **`PostgresStorageAdapter`**: Required and activated strictly when `APP_ENV=cloud` or `DATABASE_URL` is parsed. Operates strictly using a cloud-hosted relational DB. Ephemeral process RAM adapters are completely eliminated. If connection verification fails, the server prints a stack trace and initiates a crash shutdown immediately.

---

## 2. Startup & Boot Sequence Diagram

```text
       [ Node.js Backend Server Boot ]
                     │
                     ▼
       [ Detect APP_ENV & Connection ]
         ├── LOCAL (APP_ENV = local)  ──► Initialize LocalFileStorageAdapter (reads db.json)
         └── CLOUD (APP_ENV = cloud) ──► Initialize PostgresStorageAdapter
                                              │
                      ┌───────────────────────┘
                      ▼
         [ DatabaseManager Instantiation ]
                      │
                      ▼
         [ Phase A: Auto-Migrations ]
         ├── Verify 'pfp_migrations' table
         └── Check executed catalog list
              ├── Missing ──► Execute safe transactional batch DDL (COMMIT/ROLLBACK)
              └── Run     ──► Progress quietly (Skip)
                      │
                      ▼
         [ Phase B: Startup Health Diagnostics ]
         ├── Connect test with exponential backoff (Max 5 Retries, 2s+ multiplier)
         ├── Verify Secure SSL configurations
         ├── Check presence of tables: users, posts, comments, likes, replies, migrations
         ├── Check structure of core key columns & data types
         └── Inspect active index registrations
              ├── Pass  ──► Log SUCCESS diagnostic certificates
              └── Fail  ──► Fatal Error! Interrupt server launch (process.exit(1))
                      │
                      ▼
         [ Phase C: Seeding Guard ]
         └── Check if 'users' table is empty (0 records)
              ├── Empty ──► Write high-quality initial mockup seeds
              └── Loaded ──► Synchronize remote state to server hot cache
                      │
                      ▼
          [ Express App listen(3000) ]
```

---

## 3. Production Migration System

Schema versioning is fully automated and transaction-safe to enable hassle-free, zero-downtime continuous deployment on cloud platforms (e.g., Render, Railway, AWS, Google Cloud Run).

1.  **Metadata Tracker**: The database maintains a metadata schema log called `pfp_migrations` to record and track already run schema steps.
2.  **Incremental Execution**: Subsystem migration steps are defined as code functions sequentially. If a migration is not in the `pfp_migrations` log table, it runs transactionally:
    *   **Migration `001_create_initial_schema`**: Initializes five major relational entities with foreign key constraints, cascading deletions, default values, and column constraints.
    *   **Migration `002_create_indexes`**: Automatically creates indexing profiles for rapid query compilation and performance guarantees.

---

## 4. Relational Database Tables Reference

The relational database is carefully mapped to meet production consistency rules.

### A. Table: `users`
Tracks signed-up profiles, passwords, bookmarks, and onboarding preferences.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(100)` | `PRIMARY KEY` | Unique ID of the user. |
| `name` | `VARCHAR(255)` | `NOT NULL` | Full displayed name. |
| `email_or_phone` | `VARCHAR(255)` | `UNIQUE`, `NOT NULL` | Direct auth credential matching. |
| `role_preference` | `VARCHAR(100)` | `NOT NULL` | Active role (`PROBLEM_SHARER` / `DEVELOPER`). |
| `onboarding_completed` | `BOOLEAN` | `NOT NULL DEFAULT FALSE` | State of onboarding. |
| `saved_post_ids` | `JSONB` | `NOT NULL DEFAULT '[]'::jsonb` | Saved bookmarks IDs array. |
| `salt` | `VARCHAR(255)` | - | Salt for standard safe cryptography. |
| `hashed_password` | `VARCHAR(255)` | - | PBKDF2 computed string. |
| `created_at` | `VARCHAR(100)` | `NOT NULL` | Creation timestamp. |

*   **Indexes**: Unique indexing on `email_or_phone`. Non-unique B-tree index on `role_preference` and name for sorting.

### B. Table: `posts`
Represents problems posted by problem sharers.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(100)` | `PRIMARY KEY` | Unique post identifier. |
| `user_id` | `VARCHAR(100)` | `NOT NULL`, `FOREIGN KEY` | Refers to `users.id` (ON DELETE CASCADE). |
| `user_name` | `VARCHAR(255)` | `NOT NULL` | Cached poster name. |
| `title` | `VARCHAR(255)` | `NOT NULL` | Post header title. |
| `description` | `TEXT` | `NOT NULL` | Markdown description content. |
| `category` | `VARCHAR(255)` | `NOT NULL` | Tag grouping category. |
| `is_anonymous` | `BOOLEAN` | `NOT NULL DEFAULT FALSE` | Mask identifier. |
| `visibility` | `VARCHAR(100)` | `NOT NULL` | Post visibility scope restriction. |
| `likes` | `JSONB` | `NOT NULL DEFAULT '[]'::jsonb` | Author ID array. |
| `difficulty_ratings`| `JSONB` | `NOT NULL DEFAULT '[]'::jsonb` | Developer difficulty scores. |
| `created_at` | `VARCHAR(100)` | `NOT NULL` | Sorting ISO timestamp. |

*   **Indexes**: B-Tree single index on `user_id`, `category`, and a desc index on `created_at` for lightning-fast feed rendering.

### C. Table: `comments`
Captures developer solutions, repositories, and feedback.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(100)` | `PRIMARY KEY` | Unique comment ID. |
| `post_id` | `VARCHAR(100)` | `FOREIGN KEY` | Refers to `posts.id` (ON DELETE CASCADE). |
| `user_id` | `VARCHAR(100)` | `NOT NULL`, `FOREIGN KEY` | Refers to `users.id` (ON DELETE CASCADE). |
| `user_name` | `VARCHAR(255)` | `NOT NULL` | Author visual text profile name. |
| `content` | `TEXT` | `NOT NULL` | Body solution markdown description. |
| `visibility` | `VARCHAR(100)` | `NOT NULL` | Visible flag (all or Owner and Commenter). |
| `repository_url` | `VARCHAR(255)` | - | Associated GitHub code repo solution. |
| `rating` | `INTEGER` | - | Feedback rating (1-3 gold stars). |
| `is_anonymous` | `BOOLEAN` | `NOT NULL DEFAULT FALSE` | Anonymity indicator. |
| `likes` | `JSONB` | `NOT NULL DEFAULT '[]'::jsonb` | Liking profile IDs array. |
| `reply` | `JSONB` | - | Unified single feedback object. |
| `created_at` | `VARCHAR(100)` | `NOT NULL` | Comment entry creation timestamp. |

*   **Indexes**: Indexes on `post_id` and `user_id` to accelerate listing actions.

### D. Table: `likes`
Provides an optimized secondary auditing framework for fast relational queries.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | Row sequence. |
| `user_id` | `VARCHAR(100)` | `NOT NULL`, `FOREIGN KEY` | Refers to `users.id` (ON DELETE CASCADE). |
| `target_id` | `VARCHAR(100)` | `NOT NULL` | Target Post/Comment ID string. |
| `target_type` | `VARCHAR(100)` | `NOT NULL` | Type discriminator (`post` / `comment`). |
| `created_at` | `TIMESTAMP` | `DEFAULT NOW()` | Record date. |

*   **Uniqueness**: Under the constraint `UNIQUE (user_id, target_id, target_type)`.

### E. Table: `replies`
Audit log of feedback replies.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(100)` | `PRIMARY KEY` | Reply key identifier. |
| `comment_id` | `VARCHAR(100)` | `FOREIGN KEY` | Refers to `comments.id` (ON DELETE CASCADE). |
| `user_id` | `VARCHAR(100)` | `NOT NULL`, `FOREIGN KEY` | Refers to `users.id` (ON DELETE CASCADE). |
| `reply_content` | `TEXT` | `NOT NULL` | Reply message body. |
| `likes` | `JSONB` | `NOT NULL DEFAULT '[]'::jsonb` | Liking users tracker array. |
| `created_at` | `TIMESTAMP` | `DEFAULT NOW()` | Entry timestamp. |

---

## 5. Startup Health Check Parameters

When the Node.js server initiates, it automatically launches a diagnostic pipeline if the cloud mode configuration is defined:

1.  **SSL Validation & Detection**: Runs the query `SELECT ssl_is_used()` to verify whether your PostgreSQL cloud provider enforces SSL encryption on the communication wire. A certificate configuration check ensures transport security.
2.  **Structural Validation**: Verifies both the tables themselves and standard columns (`role_preference`, `visibility`, `saved_post_ids`) are properly typed and available.
3.  **Automatic Sealer Recovery**: In case of transient downtime or database reboots (e.g., Supabase resuming from scale-to-zero), the diagnostic pipeline handles retry routines using exponential backoff (re-trying 5 times with a growing delay). If the database is completely offline, the process shutdowns safely (`exit(1)`) preventing headless, broken-routing API endpoints from serving clients.
