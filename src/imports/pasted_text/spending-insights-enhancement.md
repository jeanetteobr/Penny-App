Update only Penny’s existing “A little perspective” spending-insights enhancement and the interactions directly connected to it.

Do not redesign the rest of the dashboard.

Do not change:
- the overall page layout
- the Penny brand
- typography
- color palette
- balance section
- income/expense summary cards
- transaction table design
- Add/Edit/Delete transaction experiences
- existing search/filter styling
- responsive design outside of what is necessary for this enhancement

The goal of this iteration is to fully prototype Penny’s spending-insights enhancement as a data-driven, interactive product feature.

--------------------------------------------------
PRODUCT INTENT
--------------------------------------------------

Penny’s core product idea is:

“Penny turns transactions into understanding.”

The spending-insights feature should demonstrate:

Data → Insight → Action

Penny should not simply display transaction statistics.

It should:
1. analyze the user’s spending data
2. explain one useful pattern in plain language
3. show the data supporting that interpretation
4. give the user a lightweight way to investigate that pattern further

The tone must remain calm, concise, neutral, and nonjudgmental.

Do not tell the user whether their spending is “good,” “bad,” “too high,” or “healthy.”

--------------------------------------------------
SECTION
--------------------------------------------------

Keep the existing section title:

“A little perspective”

Add a small supporting label underneath:

“August 2026 · Non-housing spending”

This should be visually secondary and quiet.

The insight is specifically about the current month shown in Penny, which is August 2026.

Do not include July transactions in this analysis.

--------------------------------------------------
INSIGHT CALCULATION
--------------------------------------------------

For the default dataset, analyze August 2026 EXPENSE transactions only.

Exclude Housing from the category comparison.

Do not describe the remaining categories as “discretionary,” because Penny should not make assumptions about which expenses are optional.

Refer to them as:

“non-housing spending”

For August 2026, the correct non-housing totals are:

Food: $174.08
Shopping: $141.04
Utilities: $127.42
Transportation: $65.78
Entertainment: $58.48

Total non-housing spending:

$566.80

Correct percentages of non-housing spending:

Food: 30.7%
Shopping: 24.9%
Utilities: 22.5%
Transportation: 11.6%
Entertainment: 10.3%

These values must be derived dynamically from the current transaction data rather than hardcoded into the rendered UI.

--------------------------------------------------
PRIMARY INSIGHT
--------------------------------------------------

Determine which non-housing expense category has the highest total for the current month.

For the default data, render:

“Food was your biggest non-housing spending category this month.”

Supporting figures:

$174.08

30.7% of non-housing spending

Use DM Mono for the numerical figures.

Use Penny’s Fern color for emphasis, but do not rely on color alone.

The sentence is the primary interpretation.

The numbers provide the evidence.

--------------------------------------------------
CATEGORY BREAKDOWN
--------------------------------------------------

Below the primary insight, show a lightweight horizontal spending breakdown.

Order categories from highest amount to lowest amount.

Default order:

Food
Shopping
Utilities
Transportation
Entertainment

Each row must visibly include:

- category name
- horizontal proportional bar
- dollar amount
- percentage

Example:

Food              [████████████████]   $174.08   30.7%
Shopping          [█████████████   ]   $141.04   24.9%
Utilities         [████████████    ]   $127.42   22.5%
Transportation    [██████          ]    $65.78   11.6%
Entertainment     [█████           ]    $58.48   10.3%

The bars should use restrained Fern tones or neutral supporting tones.

Do not:
- use a pie chart
- use a donut chart
- introduce a charting-dashboard aesthetic
- use five bright category colors
- communicate values using bar length or color alone

The text values must always remain visible.

--------------------------------------------------
ACTION — INVESTIGATE THE INSIGHT
--------------------------------------------------

Add one lightweight text-style action below the primary insight:

“View Food transactions →”

The category name in this action must be dynamic.

For example, if Shopping later becomes the largest non-housing category, the action should become:

“View Shopping transactions →”

When the user activates this action:

1. Set the existing Recent Activity Category filter to that category.
2. Preserve all underlying financial totals and insights.
3. Scroll or move focus to the Recent Activity section.
4. Show only transactions matching that category in the transaction list.

For the default data:

Clicking “View Food transactions →”

should:
- set Category filter = Food
- display Food transactions in Recent Activity
- leave balance, Income, Expenses, and “A little perspective” unchanged

This interaction is intended to help the user move naturally from:

“What is happening?”

to:

“Which transactions caused it?”

Do not create a new page, modal, or analytics screen for this action.

Reuse the existing transaction filtering system.

--------------------------------------------------
SECONDARY INSIGHT
--------------------------------------------------

Keep the secondary insight:

“Largest expense”

For the default August data:

Rent
$1,450.00 · Aug 1

This is a separate lens from the non-housing category comparison.

The category insight answers:

“Where is my non-housing spending concentrated?”

The largest-expense insight answers:

“What was my single largest expense?”

Do not include Rent in the category bar comparison just because it is the largest transaction.

--------------------------------------------------
LIVE RECALCULATION
--------------------------------------------------

The enhancement must be driven by the same transaction state as the rest of Penny.

When a transaction is:

- added
- edited
- deleted

immediately recalculate:

- current-month non-housing category totals
- category percentages
- category ordering
- primary insight sentence
- highlighted category
- “View [Category] transactions” action
- largest expense
- chart/bar widths

Example:

If a new $200 Shopping expense is added in August, Shopping should automatically become the largest non-housing category if its new total exceeds Food.

The insight sentence should then update to:

“Shopping was your biggest non-housing spending category this month.”

The CTA should update to:

“View Shopping transactions →”

The category bars should reorder automatically.

Do not require a page refresh.

--------------------------------------------------
TIME WINDOW
--------------------------------------------------

The insight section reflects only the current month displayed by Penny:

August 2026

Transactions from July may still appear in Recent Activity, but must not contribute to August spending insights.

The overall Current Balance, Income, and Expenses summary behavior should remain exactly as already implemented.

Search and transaction-list filters must NOT change the spending insight calculations.

The insights represent the underlying dataset, not the currently filtered table.

--------------------------------------------------
EMPTY / INSUFFICIENT DATA STATES
--------------------------------------------------

If there are no expense transactions in the current month, replace the insight visualization with:

“No spending insights yet.”

“Add a few expenses to start seeing patterns in your spending.”

Do not render empty bars.

If there are fewer than 3 current-month expense transactions, show:

“Add a few more transactions to see spending insights.”

Do not attempt to manufacture a meaningful trend from insufficient data.

If the user has expenses but all current-month expenses are Housing, show:

“No non-housing spending to compare yet.”

Do not treat Housing as the category winner simply to avoid an empty state.

--------------------------------------------------
ACCESSIBILITY
--------------------------------------------------

The spending visualization must remain understandable without color.

Each category row must contain visible:
- category
- amount
- percentage

If the bars use semantic progress elements or ARIA attributes, expose an accessible label equivalent to:

“Food: $174.08, 30.7% of non-housing spending”

The “View [Category] transactions” action must be keyboard accessible.

When it applies the category filter and moves the user to Recent Activity:
- move focus appropriately so keyboard and screen-reader users understand where they have gone
- do not unexpectedly steal focus during ordinary data recalculation

Respect prefers-reduced-motion when scrolling to Recent Activity.

--------------------------------------------------
RESPONSIVE BEHAVIOR
--------------------------------------------------

Desktop:
Keep the existing editorial two-part insight layout if space allows:
- interpretation/supporting figures
- category breakdown

Tablet:
Allow the interpretation and breakdown to stack naturally.

Mobile:
Stack everything vertically.

Keep:
1. primary insight sentence
2. key amount/percentage
3. “View [Category] transactions” action
4. category breakdown
5. largest expense

Do not create horizontal scrolling for the chart.

Category rows on mobile should still clearly expose name, amount, and percentage.

--------------------------------------------------
VISUAL DIRECTION
--------------------------------------------------

Preserve Penny’s established aesthetic:

- warm
- calm
- editorial
- restrained
- spacious
- highly legible

The insight should feel like Penny quietly pointing something useful out to the user, not like an analytics dashboard shouting a metric.

Do not add more cards just to contain individual pieces of insight data.

Prefer whitespace, typography, dividers, and alignment over additional containers.

Do not add:
- trend arrows unless there is actual comparison data
- month-over-month language
- financial recommendations
- spending warnings
- budgeting goals
- arbitrary benchmarks
- celebratory or judgmental messaging

We currently have only enough data to accurately describe the user’s spending distribution for August 2026.

Do not imply additional analysis that the dataset does not support.

--------------------------------------------------
SUCCESS CRITERIA
--------------------------------------------------

The finished enhancement should make the user able to answer, within a few seconds:

1. What category am I spending the most on outside of Housing?
2. How much have I spent there?
3. What share of my non-housing spending does it represent?
4. How do my other categories compare?
5. What was my single largest expense?
6. Which transactions contributed to the category Penny surfaced?

The experience should reinforce Penny’s product promise:

“Penny turns transactions into understanding.”