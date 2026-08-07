# Penny — Personal Budget Tracker

## Figma Make Prototype Prompt (revised for internal consistency)

Design and build a polished interactive frontend prototype for a fictional personal budget tracker called Penny.

---

## PRODUCT CONCEPT

Penny is a warm, modern personal finance tracker designed to make everyday money feel clear rather than intimidating.

Core product idea: **"Penny turns transactions into understanding."**

Penny should do more than simply record transactions. It should help users understand the story their financial data is telling so they can make more informed decisions and build healthier financial habits.

Primary tagline: **"Know where your money goes."**

The experience should feel like: *"A beautifully designed personal notebook that happens to understand money."*

**Do NOT make this look like:**

- a traditional banking dashboard
- a crypto product
- a corporate fintech platform
- a generic Tailwind admin dashboard
- a Dribbble dashboard full of charts and cards
- a childish money app

The overall feeling should be: warm, calm, thoughtful, approachable, editorial, highly legible, minimal without feeling sterile.

---

## BRAND

Product name: **penny.**

Use the wordmark in lowercase with the period: "penny." Do not create a mascot or elaborate logo. The period may use the brand accent color.

### Brand Colors

**Core neutrals:**

- Ink: `#20231F` — primary text
- Graphite: `#5F625C` — secondary text
- Stone: `#8D9088` — muted text
- Canvas: `#F7F5EF` — main page background
- Paper: `#FFFEFA` — elevated surfaces/cards
- Border: `#DDDCD5` — borders
- Soft Border: `#EBE9E2` — subtle dividers

**Primary brand green:**

- Fern 700: `#3F6549`
- Fern 600: `#527A5B` — primary action color
- Fern 200: `#C7DAC9`
- Fern 100: `#DDE9DD`
- Fern 50: `#EFF5EF`

**Income:**

- Income text: `#3F7D58`
- Income background: `#E8F2EB`

**Expense:**

- Expense text: `#A94E3F`
- Expense background: `#F7E8E4`

**Accent:**

- Butter: `#F2CF66` — use sparingly for small insight accents, never as a main button color
- Butter Soft: `#FBF2CF`

The UI should primarily be cream, warm white, charcoal, and fern. **Do not turn the whole interface green.**

### Category Tag Colors (NEW — resolves an ambiguity in the original brief)

Category tags use soft, muted tints distinct from the income/expense semantic colors so they never compete with them. Use this fixed palette:

| Category Background Text  |                    |                    |
| ------------------------- | ------------------ | ------------------ |
| Food                      | `#F3EEE3`          | `#6B5B3E`          |
| Housing                   | `#EAE6F2`          | `#5B5480`          |
| Utilities                 | `#E6EEF2`          | `#4A6A78`          |
| Shopping                  | `#F2E8EE`          | `#7A4F65`          |
| Entertainment             | `#F2ECE0`          | `#7A6540`          |
| Transportation            | `#E8EFE6`          | `#4F6B54`          |
| Salary                    | Fern 50 `#EFF5EF`  | Fern 700 `#3F6549` |
| Freelance                 | Fern 100 `#DDE9DD` | Fern 700 `#3F6549` |

---

## TYPOGRAPHY

Use **DM Sans** for the primary UI typeface, and **DM Mono** selectively for financial figures.

**DM Sans:** navigation, headings, descriptions, forms, buttons, transaction descriptions, filters, category labels.

**DM Mono (selective — do NOT use monospace throughout the entire transaction table):** current balance, income/expense figures, transaction amounts, percentages, important numerical data.

**Type hierarchy:**

| Use Size Font Weight   |             |         |          |
| ---------------------- | ----------- | ------- | -------- |
| Large financial figure | 36–40px     | DM Mono | Medium   |
| Page heading           | 28px        | DM Sans | Semibold |
| Section heading        | 20px        | DM Sans | Semibold |
| Component heading      | 16px        | DM Sans | Semibold |
| Body                   | 15px / 22px | DM Sans | Regular  |
| Small labels           | 13px        | DM Sans | Medium   |
| Small financial data   | 13px        | DM Mono | Medium   |

---

## SHAPE AND VISUAL LANGUAGE

Moderate softness. Border radii: small `6px`, medium `10px`, large card `14px`, pill (tags/filter chips only).

Cards: warm white surface, thin warm-gray border (`1px solid #DDDCD5`), little or no shadow. Avoid large floating cards with dramatic shadows. Use shadows only for things that genuinely float (dialogs, dropdowns). Avoid excessive gradients.

---

## ICONS

Simple Lucide-style line icons: Plus, Search, SlidersHorizontal, ChevronDown, ArrowUpRight, ArrowDownRight, Trash2, Pencil, Calendar, WalletCards.

Use icons sparingly and pair with text when meaning isn't obvious. **If Lucide icons aren't available in the tool's library, use the closest available line-icon equivalents — do not substitute filled/solid icons.**

---

## APPLICATION REQUIREMENTS

Single-page personal budget tracker supporting:

1. Viewing all transactions
2. Adding a transaction
3. **Editing a transaction** (added — see "Edit Transaction Experience" below; required by the underlying spec's `PUT` endpoint and implied by the Pencil icon, but missing from the original design brief)
4. Deleting a transaction
5. Viewing total income
6. Viewing total expenses
7. Viewing the current/net balance
8. Searching transactions by description
9. Filtering transactions by income or expense
10. Filtering transactions by category
11. Spending insights as an enhancement

A transaction contains: date, description, positive numeric amount, type (income/expense), category.

**Live recalculation (clarified):** Adding, editing, or deleting a transaction must immediately recalculate and re-render the balance, income/expense summary cards, the insights section, and the transaction list — this is not a static mock, it's a fully interactive prototype driven by the current transaction data.

---

## MOCK DATA (fully reconciled — use exactly this dataset as the default state)

Today's date in the prototype is **August 7, 2026** (matches the header).

| Date Description Category Type Amount  |                   |                |         |           |
| -------------------------------------- | ----------------- | -------------- | ------- | --------- |
| Aug 7, 2026                            | Trader Joe's      | Food           | Expense | $64.28    |
| Aug 6, 2026                            | Whole Foods       | Food           | Expense | $58.90    |
| Aug 6, 2026                            | Uber              | Transportation | Expense | $24.60    |
| Aug 5, 2026                            | Paycheck          | Salary         | Income  | $3,210.00 |
| Aug 5, 2026                            | Netflix           | Entertainment  | Expense | $15.49    |
| Aug 5, 2026                            | Amazon            | Shopping       | Expense | $56.83    |
| Aug 4, 2026                            | Chipotle          | Food           | Expense | $32.15    |
| Aug 3, 2026                            | Duke Energy       | Utilities      | Expense | $127.42   |
| Aug 3, 2026                            | Local Coffee Co.  | Food           | Expense | $18.75    |
| Aug 2, 2026                            | Target            | Shopping       | Expense | $84.21    |
| Aug 2, 2026                            | Gas Station       | Transportation | Expense | $41.18    |
| Aug 2, 2026                            | Movie tickets     | Entertainment  | Expense | $32.00    |
| Aug 1, 2026                            | Rent              | Housing        | Expense | $1,450.00 |
| Aug 1, 2026                            | Spotify           | Entertainment  | Expense | $10.99    |
| Jul 31, 2026                           | Sushi Kai         | Food           | Expense | $46.82    |
| Jul 31, 2026                           | Harris Teeter     | Food           | Expense | $71.40    |
| Jul 30, 2026                           | Freelance project | Freelance      | Income  | $600.00   |

**Derived totals (these are the only correct summary numbers — do not use different figures anywhere else in the prototype):**

- Total income: **$3,810.00**
- Total expenses: **$2,135.02**
- Current balance: **$1,674.98**

**Category totals (all categories, for the filter dropdown and table):** Food $292.30 · Housing $1,450.00 · Utilities $127.42 · Shopping $141.04 · Transportation $65.78 · Entertainment $58.48

---

## PRIMARY DASHBOARD HIERARCHY

Do not create a page made up of many equal-sized cards. Visual hierarchy tells a financial story in this order:

1. Where am I financially?
2. What came in and what went out?
3. What does my spending tell me?
4. What transactions created those numbers?

The current balance should have the strongest visual emphasis.

---

## PAGE STRUCTURE

Centered desktop content area, generous whitespace, max-width **1120–1200px**, warm Canvas background.

**Top header:** "penny." at top left. Current month at top right — **"August 2026," a static, non-interactive label. There is no month-to-month navigation in this prototype; do not add a month picker.**

Do not create a large navigation system or sidebar. This is a focused single-page product.

---

## INTRO / BALANCE SECTION

Under the header:

> "Good morning." "Here's where things stand."

Then prominently, in DM Mono, as one of the largest elements on the page:

> **$1,674.98** Current balance

Keep this area open and spacious rather than placing the balance inside a giant card.

**Negative balance state (clarified):** if expenses ever exceed income, the balance figure switches to expense (coral) styling with a leading minus sign — never color alone. In the default dataset above the balance is positive, so this state should exist in the design but won't be the default view.

---

## SUMMARY

Two simple summary cards below or alongside the balance:

> **Income** +$3,810.00

> **Expenses** −$2,135.02

Green plus sign and income styling; coral minus sign and expense styling. Never rely on color alone.

---

## SPENDING INSIGHTS — PRIMARY ENHANCEMENT

Section titled **"A little perspective."** This interprets the data rather than just displaying another chart.

**Definition (clarified):** insights reflect the current month, August 2026. The category comparison focuses on non-housing expenses because Housing is surfaced separately below as the largest individual expense. Do not describe these categories as "discretionary" or assume that any transaction is recurring.

Lead sentence:

> "Food was your biggest non-housing spending category this month."

Supporting figures:

> **$174.08** 30.7% of non-housing spending

Horizontal category breakdown (simple bars, restrained Fern/neutral tones, not a pie chart, not a full charting dashboard):

| Category Amount % of non-housing spending |         |       |
| ----------------------------------------- | ------- | ----- |
| Food                                      | $174.08 | 30.7% |
| Shopping                                  | $141.04 | 24.9% |
| Utilities                                 | $127.42 | 22.5% |
| Transportation                            | $65.78  | 11.6% |
| Entertainment                             | $58.48  | 10.3% |

Percentages in this category visualization use total non-housing expenses for the current month as their denominator. The current-month non-housing expense total is **$566.80**.

Always show category name, amount, and percentage together — never communicate through color or bar length alone.

Secondary insight:

> **Largest expense** Rent $1,450.00 · Aug 1

**Empty/insufficient-data state (added):** if there are fewer than 3 expense transactions, or all transactions are income, show a quiet fallback instead of a broken insight, e.g.:

> "Add a few more transactions to see spending insights."

This section embodies: Data → Insight → Action. Penny should help the user understand what their data means without judging their spending.

---

## RECENT ACTIVITY / TRANSACTION SECTION

Section heading: **"Recent activity."** Primary button on the right: **"+ Add transaction."**

Filtering/search toolbar under the heading:

- Search field: "Search transactions…" (matches description)
- Type filter: "All types" → All types / Income / Expense
- Category filter: **"All categories," populated dynamically from categories actually present in the current transaction data** (clarified — not the full fixed list regardless of usage)
- "Clear filters" action, shown only when filters are active

**Filter scope (clarified):** Search, type filters, and category filters affect only the Recent Activity transaction list. They do not change Current Balance, Income, Expenses, or A Little Perspective. Those sections are always derived from the full transaction dataset and their explicitly defined time windows.

Keep the filter area visually light, not heavy.

---

## TRANSACTION LIST

Clean desktop table, columns: Date, Description, Category, Amount, Actions.

**Default sort (clarified): newest first (date descending)** — matches the mock data table above.

Transaction descriptions in DM Sans; amounts in DM Mono. Income uses `+` and green text; expenses use `−` and coral text. Category tags use the muted tint palette defined above. Rows have subtle hover states; use dividers rather than individual cards per row.

**Actions column:** Pencil (edit) and Trash2 (delete) icons, each with an accessible label (e.g. `aria-label="Edit transaction"`).

---

## ADD TRANSACTION EXPERIENCE

"+ Add transaction" opens a right-side panel or focused modal (not a permanent on-page form).

**Heading:** "Add transaction"

**Fields (all with visible labels above them — no placeholder-as-label):**

- Type: Income / Expense segmented control — **defaults to Expense** (expenses are logged far more often than income; clarified default)
- Description: text input
- Amount: currency input with a visible `$` prefix. **Formatting (clarified):** allow the user to enter a normal decimal amount such as `64.28`, then normalize the displayed value to `$64.28` on blur.
- Category: select with options based on transaction type. **Expense:** Food, Housing, Utilities, Shopping, Entertainment, Transportation. **Income:** Salary, Freelance. This is a closed dropdown, not free text, for this prototype. If the user changes transaction type after selecting a category that is no longer valid, clear the category selection and require a new one.
- Date: date input, **defaults to today (Aug 7, 2026)**

**Actions:** Cancel / Add transaction

Inline validation next to the relevant field, e.g. "Enter an amount greater than $0." No toast messages for basic form validation.

---

## EDIT TRANSACTION EXPERIENCE (added — was missing from the original brief)

Clicking the Pencil icon on a transaction row opens the **same right-side panel or modal used for Add**, pre-filled with that transaction's existing values.

- Heading changes to **"Edit transaction"**
- Primary button changes to **"Save changes"**
- Same field set, same inline validation rules, same Cancel behavior
- Saving updates the transaction in place and immediately recalculates balance, summary, and insights

---

## DELETE EXPERIENCE

Accessible actions control on each transaction. Deleting requires confirmation:

> Delete this transaction?
>
> Trader Joe's $64.28 · Food · Aug 7
>
> This can't be undone.
>
> Cancel / Delete

Destructive action is visually distinguishable but not dramatic.

---

## EMPTY STATES

**No transactions:**

> "No transactions yet." "Add your first transaction to start seeing where your money goes." Button: "Add transaction"

**No filter results:**

> "No transactions match those filters." "Try changing your search or clearing a filter." Include: "Clear filters"

---

## VOICE AND MICROCOPY

Human, concise, neutral, calm, nonjudgmental. Good: "Add transaction," "Your biggest spending category is Food," "You spent $342 on dining this month." Avoid: "Oops!," "Uh oh!," "You spent WAY too much!," "Great job!" Penny reports patterns and lets the user decide what they mean.

---

## ACCESSIBILITY

Semantic HTML structure, visible form labels, keyboard-accessible controls, clear focus indicators (Fern brand color), sufficient contrast, logical focus order, accessible modal/panel behavior (focus trap, `Esc` to close, focus returns to trigger on close), text/symbols in addition to color, buttons with clear accessible labels, reduced-motion support. Never remove focus outlines without an accessible replacement.

---

## INTERACTIONS

Subtle motion, 150–200ms transitions: background changes, border changes, opacity, 4–8px modal/panel movement. Avoid bouncing, large scale animations, excessive motion. Respect `prefers-reduced-motion`.

---

## RESPONSIVE BEHAVIOR

Design desktop-first, fully responsive. **Breakpoints (clarified):** desktop ≥1024px, tablet 640–1023px, mobile <640px.

- **Desktop:** spacious dashboard, transaction table, summary cards side by side
- **Tablet:** sections stack naturally, financial hierarchy intact
- **Mobile:** balance remains prominent; income/expense become two compact stacked cards; filters wrap/collapse cleanly; transaction table becomes readable rows/cards (no horizontal scroll); Add/Edit Transaction becomes a full-screen sheet

Never sacrifice readability to preserve the desktop layout.

---

## PRODUCT DESIGN PRINCIPLES

1. **Numbers first** — the user understands their financial position almost immediately
2. **Color has meaning** — income/expense have semantic treatments; decorative colors stay subordinate
3. **Warm, never noisy** — approachable without playful clutter
4. **Progressive complexity** — simple default dashboard; filters, forms, and controls appear when needed
5. **Never shame the user** — Penny describes financial behavior without judging it
6. **Turn data into understanding** — insights explain patterns, not just visualize numbers

---

## IMPORTANT VISUAL RESTRAINTS

Do not: fill the page with cards · use a sidebar · add unnecessary navigation · use giant gradient backgrounds · add crypto-style visual effects · use glassmorphism · add unnecessary charts · create a mascot · use excessive icons · use bright saturated category colors · make every element pill-shaped · overuse green · hide form labels · make transaction amounts difficult to scan.

The final product should look credible as a thoughtfully designed real-world personal finance application created by a frontend-focused senior software engineer.

---

## PROTOTYPE BEHAVIOR

Use the reconciled mock dataset above as the default state. Demonstrate, fully interactively:

- Opening and closing Add Transaction and Edit Transaction
- Toggling income/expense in the form
- Entering form data, including currency normalization on blur
- Form validation states
- Searching
- Filtering by transaction type and by category (dynamically populated)
- Clearing filters
- Editing a transaction and seeing totals/insights update
- Deleting a transaction (with confirmation) and seeing totals/insights update
- Empty search result state
- Populated spending insights, correctly recalculated from current data

Focus on frontend experience and interaction design rather than backend infrastructure.

---

## FINAL GOAL

One cohesive, highly polished Penny dashboard demonstrating strong visual hierarchy, thoughtful UX, product judgment, restrained branding, accessible interaction design, and useful financial data presentation — internally consistent down to the dollar and percent.

The interface should make a reviewer think: *"This feels like someone thought about the actual product, not just the CRUD requirements."*