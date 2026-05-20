# Zen-Gamer - Technical & Business Logic Documentation

Welcome to the Zen-Gamer repository. This document serves as a comprehensive guide to understanding the entire architecture, business rules, API logic, and frontend mechanisms of the platform.

## 1. Business Logic & Domain Model

Zen-Gamer is a premium marketplace connecting gamers with services (coaching, boosting, teaming) and products (hardware, gaming gear, supplements).

### User Roles & Permissions
- **OPERATOR (Default)**: Standard user. Can buy, sell, chat, deposit, and withdraw.
- **moderator / admin**: Can moderate content and manage standard users. Can delete any product.
- **owner**: The ultimate super-admin. Automatically assigned to `misheelmother@gmail.com`. Has full control.
- **BANNED**: Cannot log in.

### Products vs. Services
- **Products (Physical Goods)**: Hardware, Gear, Supplements. These items have a **Single Price** (Basic Price is used as the only price).
- **Services (Digital/Labor)**: Boosting, Coaching, Software. These items operate on a **3-Tier Pricing System** (Basic, Pro, Elite), allowing users to choose the level of service.

### Financial System & Escrow (Дундын данс)
Zen-Gamer operates its own internal wallet system to protect users from scams.
1. **Wallet Balance**: Users load their wallet (balance is tracked in `users.balance`). 
2. **Direct Orders**: Buyer purchases a product/service, and funds are immediately transferred.
3. **Escrow Trades**: 
   - Buyer initiates an escrow trade. The `amount` is deducted from the buyer and held in the `escrow_trades` table.
   - The trade status is `PENDING_SELLER_CREDS`.
   - The Seller submits their gaming account credentials (username/password) through the Wallet page.
   - The status changes to `PENDING_MIDDLEMAN_VERIFICATION`.
   - An Admin/Middleman reviews the credentials.
   - If **Approved** (`COMPLETED`): Funds are transferred to the Seller's balance.
   - If **Denied/Cancelled** (`CANCELLED`): Funds are fully refunded to the Buyer's balance.
4. **Withdrawals**: Users can request to withdraw their wallet balance to a real bank account. This deducts their balance and creates a `withdrawals` record.

## 2. System Architecture

- **Frontend**: React 19, React Router v7, TailwindCSS v4, Framer Motion (for animations), Lucide React (for icons). Built with Vite.
- **Backend**: Express.js (Node.js 22+).
- **Database**: Neon (Serverless PostgreSQL) accessed via `@neondatabase/serverless`.
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` for password hashing.
- **File Storage**: Configured for Cloudinary via `multer`.

## 3. Database Schema (`api/index.mjs`)

The database is automatically initialized on the first API request via the `initDb()` middleware. It uses safe `try/catch` migration blocks to prevent cold-start failures.

- **users**: `id`, `username`, `email`, `password`, `rank`, `balance`, etc.
- **products**: Stores both single-price products and 3-tier services. Contains arrays for `features` and `images`.
- **orders**: Direct purchases (`tier`, `status`, `total`).
- **escrow_trades**: Secures high-value trades. Tracks `buyer_id`, `seller_id`, `account_credentials`, and `status`.
- **withdrawals**: Tracks bank withdrawal requests.
- **notifications**: Stores system alerts, order updates, and escrow status changes.
- **conversations / messages**: Handles the chat system between buyers and sellers.

### Concurrency & Race Conditions
All financial transactions (Escrow creation, Withdrawals) use atomic SQL updates with strict constraints:
\`\`\`sql
UPDATE users SET balance = balance - ${amount} WHERE id = ${user_id} AND balance >= ${amount} RETURNING id
\`\`\`
This prevents negative balances if a user spams the purchase/withdraw button.

## 4. Frontend Data Fetching (`src/lib/api.ts`)

The frontend does not use raw `fetch` calls scattered across components. Instead, all API interactions are centralized in `src/lib/api.ts`.

### The `request<T>` Wrapper
\`\`\`typescript
async function request<T>(method: string, path: string, body?: unknown, isForm = false): Promise<T>
\`\`\`
- Automatically attaches the `Authorization: Bearer <token>` header by reading from `localStorage`.
- Automatically stringifies JSON payloads or handles `FormData` for file uploads.
- Captures HTTP errors and extracts the backend's custom error messages (e.g., `res.status(400).json({ error: "..." })`), throwing them as standard JavaScript Errors to be caught by the UI.

### API Modules
The `api.ts` file exports domain-specific objects:
- **`auth`**: `.login()`, `.register()`, `.me()`, `.googleLogin()`
- **`products`**: `.list()`, `.get()`, `.create()`, `.delete()` (Includes the logic that maps raw DB items into normalized `Product` objects, automatically collapsing unused tiers for physical goods).
- **`orders`**: `.list()`, `.create()`
- **`escrow`**: `.create()`, `.list()`, `.submitCreds()`
- **`withdrawals`**: `.mine()`, `.request()`
- **`notifications`**: `.list()`, `.readAll()`

### Debouncing & Caching
The API file includes a custom `debounce` utility and an `aiCache` Map. This is heavily utilized when communicating with the Gemini AI endpoints to prevent rate-limiting and redundant API spam when a user types rapidly.

## 5. UI & State Management

- **Routing**: Handled by `react-router-dom`. Protected routes check `currentUser` state.
- **Global State**: The `App.tsx` typically holds the `currentUser` state and passes it down, or components fetch their own data using `useEffect` combined with the `api.ts` wrappers.
- **Wallet & Transactions (`Wallet.tsx`)**: 
  - Dual-tab system (Wallet vs Escrow).
  - Merges `Withdrawals` and completed/cancelled `Escrow Trades` into a single, chronologically sorted **Transaction History** feed.
  - Dynamically calculates whether an Escrow trade represents an incoming deposit (Seller) or a refund (Buyer).
- **Notifications (`NotificationBell.tsx` & `Notifications.tsx`)**:
  - Fetches notifications on load.
  - Opaque UI design to ensure readability over complex backgrounds.
  - Unread count badges and one-click "Mark all as read" functionality.

## 6. Security & Authorization

- **JWT Verification**: The backend middleware (`auth`, `adminAuth`, `ownerAuth`) intercepts routes and verifies the token.
- **Route Protection**: 
  - `DELETE /api/products/:id` can only be executed by the product owner OR an admin/owner.
  - Escrow credential submission is strictly validated so only the assigned `seller_id` can upload credentials.
- **Input Sanitization**: Basic SQL injection protection is inherently provided by Neon's tagged template literals (e.g., \`sql\`SELECT * FROM users WHERE id = \${id}\`\`).

---
*This documentation is kept up-to-date with the core architectural decisions of Zen-Gamer.*
