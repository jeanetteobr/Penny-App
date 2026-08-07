# penny.

> Know where your money goes.

Penny is a lightweight personal budget tracker built to make everyday finances feel clear rather than intimidating.

Users can track income and expenses, understand their current financial position, search and filter transaction history, and surface useful patterns in their spending.

Penny's core product idea is simple:

**Turn transactions into understanding.**

## Project Status

Penny is currently under active development as a full-stack take-home project.

The frontend experience and core interactions have been prototyped and implemented. The repository has been structured as a pnpm monorepo with a React client and Node.js server.

The backend currently exposes a health endpoint. Transaction persistence, summary calculations, and spending-insight APIs are the next implementation steps.

## Features

### Budget tracking

- View income and expenses
- See current balance at a glance
- Add transactions
- Edit transactions
- Delete transactions
- Search transactions by description
- Filter transactions by type
- Filter transactions by category

### Spending insights

Penny's primary enhancement is **A little perspective**, a lightweight spending-insights experience designed to help users understand the story behind their transaction data.

Rather than presenting a dense analytics dashboard, Penny surfaces useful context such as:

- the largest non-housing spending category for the current month
- the amount and percentage represented by each category
- the user's largest individual expense
- a direct path from an insight to the transactions that contributed to it

The goal is to move naturally from:

**Data → Insight → Action**

without judging the user's spending behavior.

## Tech Stack

### Client

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide icons

### Server

- Node.js
- TypeScript
- Express

### Tooling

- pnpm workspaces
- mise for local Node.js and pnpm version management

## Repository Structure

```text
Penny-App/
├── client/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── server/
│   ├── src/
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
└── .mise.toml
```

## Prerequisites

Penny currently uses:

- Node.js 22
- pnpm 10.34.3

These versions are pinned in `.mise.toml`.

If you use [mise](https://mise.jdx.dev/), you can install the configured toolchain with:

```bash
mise install
```

Otherwise, install compatible versions of Node.js and pnpm manually.

## Setup

Clone the repository:

```bash
git clone https://github.com/jeanetteobr/Penny-App.git
cd Penny-App
```

Install dependencies from the repository root:

```bash
pnpm install
```

## Run the App

Start both the React client and Express server:

```bash
pnpm dev
```

The applications will be available at:

- Frontend: http://localhost:5173
- API: http://localhost:3001

### Run individually

Frontend only:

```bash
pnpm dev:client
```

Server only:

```bash
pnpm dev:server
```

## Verify the API

The server currently exposes a health endpoint:

```http
GET /api/health
```

Expected response:

```json
{
  "status": "ok"
}
```

You can verify it locally with:

```bash
curl http://localhost:3001/api/health
```

## Build

Build the full workspace:

```bash
pnpm build
```

Build an individual package:

```bash
pnpm --filter @penny/client build
pnpm --filter @penny/server build
```

## Environment Variables

Penny does not currently require any environment variables.

The server defaults to port `3001` and respects a `PORT` environment variable when provided:

```bash
PORT=4000 pnpm dev:server
```

If additional environment variables are introduced during development, they will be documented here and added to `.env.example`.

## API

The backend is currently being implemented.

The completed application will support:

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/transactions` | List transactions with optional type, category, and text filters |
| `POST` | `/api/transactions` | Create a transaction |
| `PUT` | `/api/transactions/:id` | Update a transaction |
| `DELETE` | `/api/transactions/:id` | Delete a transaction |
| `GET` | `/api/summary` | Return total income, total expenses, and current balance |
| `GET` | `/api/insights` | Return Penny's current-month spending insights |

Currently implemented:

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Verify that the API server is running |

## Product & Design

Penny is designed around a few principles:

- **Numbers first** — make the user's financial position immediately understandable.
- **Color has meaning** — use visual treatment intentionally without relying on color alone.
- **Warm, never noisy** — approachable without becoming visually cluttered.
- **Progressive complexity** — keep the default experience simple and reveal controls when needed.
- **Never shame the user** — describe financial behavior without judging it.
- **Turn data into understanding** — interpret patterns rather than simply visualizing numbers.

Accessibility is considered part of the product rather than a finishing pass, including semantic markup, visible labels, keyboard interactions, focus management, sufficient contrast, and reduced-motion support.

## Notes

- Authentication is intentionally out of scope; Penny is a single-user application.
- The project is designed to run locally and does not require deployment.
- The backend will use lightweight persistence appropriate to the scope of the exercise.
- The application favors clear, maintainable implementation over unnecessary abstraction.
