# Plan: Penny Budget Tracker

## Source of truth
The full product brief lives at `src/imports/Penny_Figma_Make_Prototype_Prompt_revised-1.md`. Read this file at the start of the build and treat it as authoritative for every product decision: mock data, derived totals, category tag colors, typography hierarchy, interaction rules, microcopy, accessibility requirements, and responsive breakpoints. The screenshot at `src/imports/Screenshot_2026-08-07_at_12.05.47_PM.png` is the visual reference — match its layout and hierarchy.

## Context
Build a fully interactive personal budget tracker called "Penny" from a detailed product brief and reference screenshot. The current `App.tsx` is essentially a blank placeholder. This is a complete replacement of the app content, not an extension.

## Approach

### File structure
```
src/
  index.css                        — Google Fonts imports + CSS custom property tokens
  types/
    transaction.ts                 — Transaction type, Category/Type enums, CATEGORY_TAGS map
  data/
    transactions.ts                — INITIAL_TRANSACTIONS array (17 rows from brief)
  hooks/
    useTransactions.ts             — state + derived totals (useMemo), add/edit/delete handlers
    useInsights.ts                 — computes category breakdown, top category, largest expense
  components/
    Header.tsx                     — "penny." wordmark + "August 2026" label
    BalanceSection.tsx             — greeting, balance figure, Income/Expense summary cards
    SummaryCard.tsx                — reusable Income or Expense card (icon + label + DM Mono amount)
    SpendingInsights.tsx           — "A little perspective." section with category bars + largest expense
    CategoryBar.tsx                — single horizontal bar row (name, bar, amount, %)
    RecentActivity.tsx             — section heading + Add button + FilterToolbar + TransactionTable
    FilterToolbar.tsx              — search input, type dropdown, category dropdown, Clear filters
    TransactionTable.tsx           — table shell + rows, empty states
    TransactionRow.tsx             — single table row with category tag, amount, edit/delete icons
    CategoryTag.tsx                — pill tag styled per CATEGORY_TAGS map
    TransactionPanel.tsx           — right-side slide-in panel for Add and Edit
    DeleteModal.tsx                — centered confirmation dialog
  App.tsx                          — composes all sections; owns top-level state via useTransactions
```

---

## Implementation Plan

### 1. `src/index.css`
Add Google Fonts `@import` statements at the top (before `@import 'tailwindcss'`):
```css
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
@import 'tailwindcss';
```
Then define CSS custom properties for all brand tokens and set `font-family: 'DM Sans', sans-serif` on `body`.

### 2. `src/types/transaction.ts`
- `Transaction` interface: `{ id, date, description, amount, type, category }`
- `TransactionType`: `'income' | 'expense'`
- `Category` union type for all valid categories
- `CATEGORY_TAGS` map: `Record<Category, { bg: string; text: string }>`

### 3. `src/data/transactions.ts`
- `INITIAL_TRANSACTIONS`: 17 transactions exactly as specified in the brief (dates, descriptions, amounts, categories, types)

### 4. `src/hooks/useTransactions.ts`
- `useState<Transaction[]>` initialized from `INITIAL_TRANSACTIONS`
- `useMemo` derived: `totalIncome`, `totalExpenses`, `balance`
- Handlers: `addTransaction`, `updateTransaction`, `deleteTransaction`

### 5. `src/hooks/useInsights.ts`
- Accepts transaction array, computes current-month non-housing expense totals by category
- Returns: `categoryBreakdown[]`, `topCategory`, `largestExpense`, `hasEnoughData` flag

### 6. Components

**`Header.tsx`** — "penny." wordmark, period in Fern 600; "August 2026" at right

**`BalanceSection.tsx`** — greeting text, balance in DM Mono (coral if negative), "Current balance" label, renders two `<SummaryCard>`s

**`SummaryCard.tsx`** — accepts `type: 'income' | 'expense'`, label, amount; styled card with icon

**`SpendingInsights.tsx`** — "A little perspective." heading, lead sentence, top-category figures, renders `<CategoryBar>` list, largest expense callout; empty state if `!hasEnoughData`

**`CategoryBar.tsx`** — name, filled fern bar (width as % of max), dollar amount (DM Mono), percentage label

**`RecentActivity.tsx`** — heading + Add button row, `<FilterToolbar>`, `<TransactionTable>`; owns filter state (search, typeFilter, categoryFilter)

**`FilterToolbar.tsx`** — search input with icon, type `<select>`, category `<select>` (dynamic from current transactions), "Clear filters" link (shown only when active)

**`TransactionTable.tsx`** — `<table>` with column headers; maps filtered transactions to `<TransactionRow>`; two empty states (no transactions / no filter match)

**`TransactionRow.tsx`** — date, description, `<CategoryTag>`, DM Mono amount with +/− and color, Pencil + Trash2 icon buttons

**`CategoryTag.tsx`** — pill badge, looks up bg/text from `CATEGORY_TAGS`

**`TransactionPanel.tsx`** — fixed overlay + right-side slide-in panel; mode prop `'add' | 'edit'`; fields: Type segmented control, Description, Amount (blur normalization), Category (filtered by type, resets on type change), Date; inline validation; Esc to close, focus trap

**`DeleteModal.tsx`** — centered modal, transaction summary, Cancel + Delete (coral); Esc to close

### 7. `src/App.tsx`
- Calls `useTransactions()` for state and handlers
- Manages panel/modal open state (which transaction is being edited/deleted)
- Composes: `<Header>`, `<BalanceSection>`, `<SpendingInsights>`, `<RecentActivity>`, `<TransactionPanel>`, `<DeleteModal>`
- Passes handlers down as props

#### Key behaviors
- All adds/edits/deletes immediately recalculate balance, income, expenses, insights
- Filters affect only the transaction list, not summary totals
- Negative balance: coral color + minus sign
- Reduced-motion support on transitions

---

## Design Token Notes (inline in index.css)
```
--ink: #20231F
--graphite: #5F625C
--stone: #8D9088
--canvas: #F7F5EF
--paper: #FFFEFA
--border: #DDDCD5
--soft-border: #EBE9E2
--fern-700: #3F6549
--fern-600: #527A5B
--fern-200: #C7DAC9
--fern-100: #DDE9DD
--fern-50: #EFF5EF
--income-text: #3F7D58
--income-bg: #E8F2EB
--expense-text: #A94E3F
--expense-bg: #F7E8E4
--butter: #F2CF66
--butter-soft: #FBF2CF
```

---

## Verification
1. The preview panel shows the full Penny dashboard matching the screenshot reference
2. Add a transaction → balance/income/expenses/insights update immediately
3. Edit a transaction → pre-filled form, save updates in place
4. Delete a transaction → confirmation modal, then removal + recalculation
5. Search and filter work without affecting summary totals
6. "Add transaction" panel opens/closes with Esc and Cancel
7. Category dropdown resets when switching Income ↔ Expense
8. Insights show correct figures: Food $174.08 / 30.7%, Shopping $141.04 / 24.9%, etc.
9. Responsive: mobile shows stacked cards, no horizontal scroll on transaction rows
