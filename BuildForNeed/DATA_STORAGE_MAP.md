# Data Storage Map

This document outlines where all user data is stored, persistency characteristics, and the data flows of the **Project From Problem** platform under different runtime modes.

---

## 1. Storage Layers Overview

The application utilizes an environment-aware, pluggable architecture targeting high-grade cloud performance:
- **LOCAL Mode**: Stores all platform data (users, credentials, posts, comments, bookmarks, ratings) directly into `/db.json` on disk using the synchronous `LocalFileStorageAdapter`.
- **CLOUD Mode**: Leverages **Supabase/PostgreSQL** via `PostgresStorageAdapter` as the absolute single source of truth. Data is structured cleanly across key tables (with indexing and cascade deletion constraints).

| Data Type | LOCAL Mode Storage | CLOUD Mode Storage | Lifetime / Scope |
| :--- | :--- | :--- | :--- |
| **User Signups & Profiles** | Root `/db.json` (`users` array) | SQL `users` Table | Permanent. Survives restarts and container cycle. |
| **Hashed Secrets** | Root `/db.json` (PBKDF2 SHA512) | SQL `users` Table (`salt`, `hashed_password`) | Permanent. Encrypted and never shared with interface. |
| **Auth Tokens / Sessions** | Browser client `localStorage` | SQL `users` Table verified by token ID | Session duration. Header bearer authenticated. |
| **Problems & Posts** | Root `/db.json` (`posts` array) | SQL `posts` Table | Permanent. Live CRUD actions. |
| **Comments & Suggestions** | Root `/db.json` (`comments` array) | SQL `comments` Table | Permanent. Supports code solution links. |
| **Likes / Appreciations** | Root `/db.json` (`likes` list) | SQL `likes` Table / `posts.likes` | Permanent. Handles uniqueness across targets. |
| **Feedback Replies** | Root `/db.json` (`comment.reply`) | SQL `replies` Table / `comments.reply` | Permanent. Handles post-author specific replies. |
| **Anonymity & Roles Preferences**| Root `/db.json` (`users.rolePreference`)| SQL `users.role_preference` | Permanent. Direct user mode tracking. |
| **UI Theme Mode** | Browser client `localStorage` | Browser client `localStorage` | Local client device configuration. |

---

## 2. Pluggable Storage Adapters

The active database instance is resolved dynamically via `/backend/storage.ts` using the strict `IStorageAdapter` contract:

1. **`LocalFileStorageAdapter`**:
   - Resolved when `APP_ENV=local` (or configuration variables are empty).
   - Reads and writes directly to root `/db.json` sequentially.
   - Automatically initializes with pristine, highly interactive seed items on first launch if the JSON file isn't present.

2. **`PostgresStorageAdapter`**:
   - Required and configured strictly when `APP_ENV=cloud` or `DATABASE_URL` is parsed.
   - Leverages a background schema `DatabaseManager` to run auto-migrations (`pfp_migrations`), verify indexing optimization, check constraints, and perform startup diagnostics.
   - Writes are committed via ACID-compliant SQL transactions inside `syncWriteToDB`.
   - Polling cache synchronizers run every 10 seconds to pull changes from multiple live server nodes.

---

## 3. End-to-End Data Flow

```text
  [ Frontend User Interaction ] 
            │
            ▼ (Form submits / State change / Rating toggle)
  [ services/api.ts Fetch Agent ]
            │
            ▼ (Asynchronous Web API HTTP transaction with Bearer Auth)
  [ Express Routes in backend/server.ts ]
            │
            ▼ (Verifies Bearer Token authorization rules against storage cache)
  [ readDB / writeDB Storage Helpers ]
            │
            ├──────────────────────────────────────────┐
            ▼ (LOCAL MODE)                             ▼ (CLOUD MODE)
  [ LocalFileStorageAdapter ]               [ PostgresStorageAdapter ]
            │                                          │
            ▼                                          ▼
   [ disk-write: db.json ]                   [ ACID Transaction over pg Pool ]
            │                                          │
            └───────────────┬──────────────────────────┘
                            ▼ (Returns resolved record payload)
              [ Express JSON response payload ]
                            │
                            ▼ (Triggers React context state updates)
              [ Beautiful, Fluid Slate Render Engine ]
```
