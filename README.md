# Zen-Gamer - Codebase Architecture & Technical Documentation

This document provides a deep technical dive into the Zen-Gamer codebase. It covers the code structure, internal logic, and the specific methods used to connect the React frontend with the Express backend.

## 1. Directory & Code Structure

The project follows a monorepo-style structure where the backend and frontend coexist in the same repository.

```text
Zen-Gamer/
├── api/
│   └── index.mjs           # Express Backend: Contains all API routes, DB migrations, Auth middleware.
├── src/
│   ├── assets/             # Static UI assets and global styles.
│   ├── components/         # Reusable React components (Navbar, NotificationBell, Footer).
│   ├── lib/                # Core frontend utilities.
│   │   ├── api.ts          # Centralized API fetch wrapper and endpoint definitions.
│   │   └── utils.ts        # Tailwind class merging utility (cn).
│   ├── pages/              # Main App Routes (Home, Wallet, Orders, Products).
│   ├── App.tsx             # React Router setup, Global Context (AuthUser), and layout structure.
│   └── main.tsx            # React DOM entry point.
├── .env                    # Environment variables (DATABASE_URL, JWT_SECRET, CLOUDINARY).
├── package.json            # Dependencies and npm scripts (uses `concurrently` for dev).
├── tailwind.config.js      # Tailwind v4 configuration for theme and styling.
└── vite.config.ts          # Vite bundler configuration.
```

## 2. Frontend-Backend Integration (How they connect)

The frontend (Vite/React on port 3000) and backend (Express on port 3001) communicate via RESTful API calls. 

### Centralized Fetch Logic (`src/lib/api.ts`)
Instead of scattering `fetch()` calls across React components, all HTTP requests are strictly managed by a generic wrapper function in `api.ts`:

```typescript
async function request<T>(method: string, path: string, body?: unknown, isForm = false): Promise<T> {
  const headers: Record<string, string> = { ...authHeaders() }; // Injects JWT Token
  if (body && !isForm) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: isForm ? (body as FormData) : body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
  return data as T;
}
```

### Key Integration Mechanics:
1. **JWT Authentication**: Upon login, the backend issues a JSON Web Token (JWT). The frontend stores this in `localStorage`. The `authHeaders()` function intercepts every outgoing request and attaches `Authorization: Bearer <token>`.
2. **Error Handling**: If the backend responds with a non-200 status (e.g., `401 Unauthorized` or `400 Bad Request`), the `request` function automatically extracts the backend's JSON error message and throws a standard JavaScript `Error`. React components catch this in `try/catch` blocks and display it to the user.
3. **CORS (Cross-Origin Resource Sharing)**: The Express backend uses the `cors()` middleware to allow the Vite frontend to make cross-origin HTTP requests during local development.

## 3. Backend Logic & Database (`api/index.mjs`)

The backend is a single-file Express application designed for Serverless environments (like Vercel).

### Database Connection (Neon PostgreSQL)
We use `@neondatabase/serverless` to connect to PostgreSQL over WebSockets/HTTP, which is optimized for serverless edge functions.

```javascript
import { neon } from '@neondatabase/serverless';
const sql = neon(databaseUrl);
```

### Auto-Migration Logic (`initDb`)
To ensure the database is always in sync with the codebase without requiring manual CLI migrations, the backend uses a "Lazy Initialization" pattern.
On the very first API request, the `initDb()` middleware fires:
1. Creates all tables if they don't exist (`IF NOT EXISTS`).
2. Runs an array of `ALTER TABLE` and `UPDATE` statements within individual `try/catch` blocks.
3. Sets a flag `_dbReady = true` so subsequent requests bypass this check, ensuring high performance.

### Transaction Safety (Race Condition Prevention)
Financial operations (like Escrow creations and Withdrawals) are protected against race conditions (e.g., users double-clicking a "Buy" button) at the SQL query level:
```sql
UPDATE users 
SET balance = balance - ${amount} 
WHERE id = ${user_id} AND balance >= ${amount} 
RETURNING id
```
The `AND balance >= ${amount}` clause guarantees that the balance can never go negative, even under heavy concurrent requests.

## 4. Specific Business Logic Flows

### Escrow State Machine (Дундын данс)
The Escrow system relies on strict state transitions tracked in the `escrow_trades` table:
1. **Initialization (`PENDING_SELLER_CREDS`)**: Buyer creates a trade. Buyer's balance is deducted immediately.
2. **Credential Submission (`PENDING_MIDDLEMAN_VERIFICATION`)**: The Seller uses the Wallet UI to submit their account username/password.
3. **Resolution**:
   - **`COMPLETED`**: Middleman approves. The funds are mathematically added to the Seller's `users.balance`.
   - **`CANCELLED`**: Middleman denies. The funds are refunded back to the Buyer's `users.balance`.

### 3-Tier Product Mapping
In the database, products have columns for `basic_price`, `pro_price`, and `elite_price`. 
When the frontend fetches products, `api.ts` maps these flat columns into a dynamic `tiers` array:
- If the category is a physical good (Gear/Hardware), it ignores the Pro/Elite tiers and returns a single price.
- If it's a digital service (Boosting/Coaching), it maps all non-zero prices into a structured array used by the UI to render the tier selection cards.

### Security Middlewares
Routes are protected by hierarchical middlewares:
- `auth`: Decodes JWT, ensures user is not `BANNED`.
- `adminAuth`: Ensures `req.user.role` is admin, moderator, or owner.
- `ownerAuth`: Strictly reserved for the `owner`. (Note: Logging in with `misheelmother@gmail.com` automatically promotes the account to `owner` at the database level).
