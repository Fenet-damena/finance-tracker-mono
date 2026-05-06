# feature-recurring

Recurring Expenses / Subscriptions tracker, mounted at `/recurring` in
`apps/web`.

This is the **second of two individual feature systems** contributed by
`yabets143`. The first is `feature-currency` (multi-currency converter
powered by `@repo/money`); this one builds on top of `@repo/money` again
and adds a CRUD-y subscription tracker that none of the existing features
covered.

## Why this feature

The team already shipped:

- `feature-budget` — set a single monthly budget amount
- `feature-expense` — log one-off expenses
- `feature-goals` — savings goals (target/saved per goal, in localStorage)
- `feature-insights` — single-month cash-flow snapshot + recommendations
- `feature-reports` — historical breakdown charts

None of them track **expenses that repeat at a known cadence** (Netflix,
rent, gym, annual domain renewal). That's a real gap for a finance tracker,
so this feature fills it. It is intentionally orthogonal to everything else
in the monorepo and writes to its own Firestore collection
(`recurringExpenses`) so no other feature is affected.

## What the user can do

- **Add** a recurring item with a name, amount, **frequency**
  (`daily` / `weekly` / `monthly` / `yearly`) and an item-level **currency**
  (any of the 12 supported by `@repo/money`).
- **Pause / resume** any item (paused items don't count toward the totals).
- **Remove** an item.
- See three live KPI tiles:
  - **Active items** (with paused count as a hint)
  - **Monthly total** — every active item normalized to a monthly amount
    with `monthlyFromFrequency`, then converted from the item's currency
    into the user's chosen base currency with `convert` from `@repo/money`.
  - **Annual total** — same idea using `annualizeAmount`.
- **Switch the base currency** at any time — every item row and every
  total re-renders without another network call.
- See per-item readouts that combine native currency, monthly equivalent,
  and annual equivalent.

## How it satisfies the assignment brief

> Configuration and Assembly only is allowed on System directory — the
> composites are imported from packages.

`apps/web/app/recurring/page.tsx` does only auth-guarding (matching the
team's existing pattern in `/budget`, `/expense`, `/currency`) and renders
`<RecurringFeature />`. Every piece of business logic, layout, styling and
Firestore interaction lives inside this package.

## Package usage map

| Source package  | What this feature uses it for                                                                                                       |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `@repo/ui`      | `Card`, `Button`, `Input`, plus the new `Pill` (status tags) and `EmptyState` (no-items placeholder) primitives                     |
| `@repo/utils`   | `formatCurrency` (legacy comparison), plus the new `RECURRING_FREQUENCIES`, `monthlyFromFrequency`, `annualizeAmount`, `frequencyLabel` |
| `@repo/money`   | `convert`, `formatMoney`, `CURRENCIES`, `ALL_CURRENCY_CODES`, `DEFAULT_RATES` for the multi-currency display + base-currency totals |

It also reads `apps/web/lib/firebase`'s shared Firestore client so it
participates in the same Firebase project as `feature-budget` /
`feature-expense` without re-initializing Firebase.

## Architecture

```
apps/web/app/recurring/page.tsx              ← assembly (auth guard + mount)
                  │
                  ▼
packages/feature-recurring/index.js          ← composite (this package)
                  │
   ┌──────────────┼─────────────────┬───────────────────────────────┐
   ▼              ▼                 ▼                               ▼
@repo/ui      @repo/utils       @repo/money                 apps/web/lib/firebase
(Card, Pill,  (frequency        (convert / formatMoney /    (shared Firestore client
 EmptyState,   helpers +         CURRENCIES list)            — same as Budget/Expense)
 Button,       formatCurrency)
 Input)
```

### Data model (Firestore: `recurringExpenses`)

```
{
  name:       string,            // "Netflix", "Rent", "Gym Membership"
  amount:     number,             // > 0
  frequency:  "daily" | "weekly" | "monthly" | "yearly",
  currency:   CurrencyCode,       // any of the 12 in @repo/money
  status:     "active" | "paused",
  createdAt:  Firestore Timestamp
}
```

### Total calculation flow

For every active item:

1. `monthlyFromFrequency(amount, frequency)` → monthly amount in the item's
   own currency (e.g. a £5/week item → £21.67/month).
2. `convert(value, item.currency, baseCurrency, DEFAULT_RATES)` →
   monthly amount in the base currency.
3. Sum across all active items → **Monthly total** tile.
4. `annualizeAmount(amount, frequency)` + same `convert` step → **Annual total**.

This means an item billed as "$15/year" and another as "₹500/month" can
both contribute to the same "Monthly total" tile in EUR, with no extra
network calls.

## Running locally

```bash
yarn install
yarn dev
# log in via /auth, then open http://localhost:3000/recurring
```

The route is auth-guarded — exactly like `/budget` and `/expense` — so it
redirects to `/auth` when there's no signed-in user.
