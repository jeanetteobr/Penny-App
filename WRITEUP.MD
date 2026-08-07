# WRITEUP

## What I built

I built Penny, a full-stack personal budget tracker for recording income and expenses, viewing an overall financial summary, and searching or filtering transaction history. The frontend uses React and TypeScript, backed by a Node/Express API with SQLite persistence.

I kept the architecture intentionally small. The backend is the source of truth for transactions and derived financial data, while the frontend owns presentation and local interaction state. Search and filters are handled by the transactions API and affect only Recent Activity; balance, income, expenses, and spending insights are loaded independently so filtering the table does not change the broader financial picture.

Summary and insight calculations are implemented as pure TypeScript functions rather than being embedded in Express routes or SQL. This keeps business logic separate from persistence and makes it straightforward to test. On the client, I used a thin `fetch`-based API layer rather than introducing React Query or additional state-management tooling for a relatively small data surface.

I kept the API contracts intentionally explicit so each layer had a clear responsibility. That made it easier to validate changes independently and reduced the chance that a persistence or presentation decision would unexpectedly alter behavior elsewhere in the application.

For persistence, I chose SQLite with `better-sqlite3`. It provides durable local storage without requiring an external database server or ORM. Because persistence is isolated behind the transaction service, migrating from the initial JSON implementation to SQLite did not require changing the frontend or API contracts. First-run schema creation and seed insertion are also performed atomically, while an existing intentionally empty database is left untouched.

## AI-assisted development

I used AI throughout the project as an implementation and review tool rather than treating generated output as automatically correct. Figma Make helped establish the initial visual direction, ChatGPT helped refine product decisions and implementation boundaries, and Cursor was used for scoped coding tasks, validation, and code-review passes.

For each larger change, I defined the expected behavior and constraints first, then reviewed the resulting diff, tests, and runtime behavior before committing. That review process surfaced several issues worth correcting. One example was mutation handling: a transaction could successfully save while a subsequent summary or insights refresh failed. Treating both as one operation would incorrectly tell the user the save failed and could encourage a duplicate submission, so I separated mutation success from refresh failures. I also caught an SQLite initialization edge case and changed first-run table creation and seeding to occur in one transaction.

## Enhancement: “A little perspective”

I chose Spending Insights as the meaningful enhancement because transaction logging answers what happened, but not what the data means. The goal was to give users a lightweight way to recognize spending patterns without turning Penny into a prescriptive financial-advice product.

“A little perspective” identifies the largest non-housing spending category for the selected month, compares category totals and percentages, surfaces the largest individual expense, and lets the user jump directly from an insight to the relevant transactions.

I intentionally use “non-housing” rather than “discretionary,” since expenses such as food, utilities, and transportation are not necessarily optional. Housing is excluded from the category comparison so it does not overwhelm the smaller spending categories, but it remains eligible as the largest individual expense. The API returns structured insight data while the frontend owns the user-facing copy.

## With more time

With more time, I would add frontend integration tests for the critical CRUD and filtering flows, along with a small end-to-end test suite.

For a production version, I would add authentication and user-scoped data, formal database migrations, and represent monetary values as integer cents rather than floating-point numbers.