# penny.

> Know where your money goes.

Penny is a lightweight personal budget tracker for recording income and expenses, understanding overall financial position, filtering transaction history, and surfacing useful spending patterns.

**Penny turns transactions into understanding.**

## Project Status

Penny is a functionally complete full-stack take-home application.

The current implementation includes:

- Persisted transaction CRUD with a local SQLite database
- Server-side search and filtering
- Budget summary (income, expenses, balance)
- Month-scoped spending insights
- React frontend connected to live Express APIs
- Loading and error states with per-resource retry
- Zod validation on the server
- Automated Vitest coverage for summary and insights logic

## Features

### Budget tracking

- Add income and expense transactions
- Edit existing transactions
- Delete transactions with confirmation
- View current balance, total income, and total expenses
- Search transaction descriptions
- Filter by transaction type and category
- SQLite-backed persistence across local server restarts

### Spending insights

Penny’s product enhancement is **A little perspective** — a lightweight view of spending for a selected month.

From expense data, Penny surfaces:

- The biggest non-housing spending category
- Category totals and percentages
- The largest individual expense
- A direct path from an insight to the matching transactions in Recent Activity

Housing is excluded from the category-comparison calculation so day-to-day categories stay comparable, but Housing remains eligible as the largest individual expense.

## Tech Stack

### Client

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide icons
- Browser Fetch API (thin client API layer; no React Query)

### Server

- Node.js
- TypeScript
- Express
- Zod
- SQLite (`better-sqlite3`)

### Testing / tooling

- Vitest
- pnpm workspaces
- mise for pinned local Node.js and pnpm versions

## Architecture

```text
Client (React)
  ↓
client/src/lib/api.ts
  ↓
Express API routes
  ↓
services (transactions, summary, insights)
  ↓
SQLite (`server/data/penny.db`)
```

The backend is the source of truth for:

- Persisted transactions
- Summary calculations
- Spending-insight calculations

The frontend owns:

- Presentation and layout
- Filter/search UI state
- Forms, panels, and confirmation dialogs
- Loading and error presentation
- Mapping semantic API data to user-facing copy

Recent Activity filters affect only the transaction list. Summary and insights always reflect the full persisted dataset (insights scoped by month).

## Repository Structure

```text
Penny-App/
├── client/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── server/
│   ├── data/                 # runtime SQLite DB (gitignored)
│   ├── src/
│   │   ├── db/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── types/
│   └── package.json
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── .mise.toml
└── README.md
```

## Prerequisites

- Node.js 22
- pnpm 10.34.3

These versions are pinned in `.mise.toml`.

If you use [mise](https://mise.jdx.dev/):

```bash
mise install
```

Otherwise, install compatible versions of Node.js and pnpm manually.

## Setup

```bash
git clone https://github.com/jeanetteobr/Penny-App.git
cd Penny-App
pnpm install
```

## Run the App

Start the client and server together:

```bash
pnpm dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001

During local development, the Vite client proxies `/api` requests to the Express server on port 3001.

### Run individually

```bash
pnpm dev:client
pnpm dev:server
```

## Development Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Run client and server in parallel |
| `pnpm build` | Build client and server |
| `pnpm --filter @penny/client build` | Build the client only |
| `pnpm --filter @penny/server build` | Build the server only |
| `pnpm --filter @penny/server test` | Run server unit tests |

## Verify the API

With the server running (`pnpm dev` or `pnpm dev:server`):

| Request | Purpose |
| --- | --- |
| `GET /api/health` | Health check |
| `GET /api/transactions` | List transactions |
| `GET /api/summary` | Budget totals |
| `GET /api/insights?month=2026-08` | August 2026 insights (demo month) |

```bash
curl http://localhost:3001/api/health
curl http://localhost:3001/api/summary
curl "http://localhost:3001/api/insights?month=2026-08"
```

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Health check (`{ "status": "ok" }`) |
| `GET` | `/api/transactions` | List transactions (optional filters) |
| `POST` | `/api/transactions` | Create a transaction |
| `PUT` | `/api/transactions/:id` | Update a transaction |
| `DELETE` | `/api/transactions/:id` | Delete a transaction (`204` on success) |
| `GET` | `/api/summary` | Income, expenses, and balance |
| `GET` | `/api/insights` | Month-scoped spending insights |

### Transaction filters

`GET /api/transactions` accepts optional query parameters:

| Parameter | Description |
| --- | --- |
| `type` | `income` or `expense` |
| `category` | A valid transaction category |
| `search` | Case-insensitive substring match on description |

Combined filters use **AND** semantics.

### Insights month

`GET /api/insights` accepts:

| Parameter | Description |
| --- | --- |
| `month` | `YYYY-MM` (optional) |

If `month` is omitted, the server defaults to the current calendar month. The Penny dashboard explicitly requests `2026-08` because the demo dataset and UI represent August 2026.

## Transaction Model

```ts
{
  id: string
  date: string          // YYYY-MM-DD
  description: string
  amount: number        // positive number
  type: "income" | "expense"
  category: Category
}
```

- Amounts are stored as positive numbers; `type` determines income vs expense
- IDs are generated server-side (`POST` does not accept a client `id`)
- Category must be valid for the selected type (expense vs income categories)

Expense categories: Food, Housing, Utilities, Shopping, Entertainment, Transportation  
Income categories: Salary, Freelance

## Summary

`GET /api/summary` returns:

```json
{
  "income": 3810,
  "expenses": 2135.02,
  "balance": 1674.98
}
```

Where `balance = income - expenses`.

Summary always uses the full persisted dataset. Recent Activity search/type/category filters do not affect these totals.

## Insights

`GET /api/insights?month=YYYY-MM` returns semantic spending data, including:

- `status`
- `totalNonHousingSpending`
- `topCategory`
- `categories` (breakdown with amounts and percentages)
- `largestExpense`

Possible `status` values:

| Status | Meaning |
| --- | --- |
| `ready` | Enough non-housing expense data to show insights |
| `no-expenses` | No expenses in the month |
| `no-non-housing-expenses` | Expenses exist, but all are Housing |
| `insufficient-data` | Not enough expense transactions for a meaningful breakdown |

The frontend maps this response into the **A little perspective** presentation and copy.

## Persistence

Transactions are stored in a local SQLite database at `server/data/penny.db` (created automatically on first run; gitignored).

On first startup, Penny creates the `transactions` table and seeds the canonical 17-row demo dataset. Later startups leave existing data alone — including an intentionally empty table — so deleting every transaction does not cause the seed data to reappear.

For the take-home scope, file-backed SQLite keeps persistence understandable without introducing a separate database server. An optional `PENNY_DB_PATH` environment variable can override the default database file location.

## Validation

Create and update requests are validated on the server with Zod, including:

- Amounts greater than zero
- Valid `YYYY-MM-DD` calendar dates
- Non-empty descriptions
- Valid `type` and `category` values
- Category compatibility with the selected type

## Testing

```bash
pnpm --filter @penny/server test
```

Server unit tests cover derived financial logic and SQLite initialization, including:

- Summary calculations and currency rounding
- Month-scoped spending insights
- Housing exclusion from category comparison
- Insight sufficiency / empty states
- Deterministic tie-breaking
- Fresh-database schema creation and canonical seeding
- Idempotent initialization (existing empty databases are not reseeded)

The client does not currently have an automated test suite.

## Product & Design

- **Numbers first** — make financial position immediately understandable
- **Color has meaning** — intentional visual treatment without relying on color alone
- **Warm, never noisy** — approachable without visual clutter
- **Progressive complexity** — keep the default experience simple
- **Never shame the user** — describe spending without judging it
- **Turn data into understanding** — interpret patterns, not just list numbers

Accessibility is part of the product: semantic markup, visible labels, keyboard use, focus management, contrast, and reduced-motion support.

## Take-home Scope

- No authentication (single-user local app)
- Local-only; no production deployment required
- Local SQLite file persistence (no external database server)
- Architecture favors clarity and maintainability over production infrastructure

## Environment Variables

Penny does not require environment variables for normal local use.

| Variable | Description |
| --- | --- |
| `PORT` | API server port (default `3001`) |
| `PENNY_DB_PATH` | Optional override for the SQLite database file path |

```bash
PORT=4000 pnpm dev:server
```
