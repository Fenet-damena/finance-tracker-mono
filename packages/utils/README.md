# @repo/utils (utils)

Small, pure JavaScript helpers shared across the monorepo. No React, no
Firebase, no network — anything in here is safe to call from a feature
package, the Next.js app (client or server), or a Node script.

## Exports

### Group baseline

- `formatCurrency(amount)` — `12.34` → `"$12.34"` (USD-only). Used by
  `feature-budget`, `feature-expense`, `feature-insights`, `feature-goals`.
- `aggregateByCategory(items, key = "category")` — groups items by a key
  and sums their `amount`. Returns `[{ name, value }, ...]`. Used by
  `feature-reports`.
- `getMonthlyTotals(items)` — buckets items by their `date.getMonth()` and
  sums their `amount`. Returns `[{ name: "Jan", total }, ...]`. Used by
  `feature-reports`.

### Added with `feature-recurring`

Additive and self-contained — none of the existing helpers were changed.

- `RECURRING_FREQUENCIES` — `["daily", "weekly", "monthly", "yearly"]`,
  the canonical option list every recurring UI / dropdown should iterate.
- `monthlyFromFrequency(amount, frequency)` — normalizes a recurring amount
  into a monthly figure (`daily * 30`, `weekly * 52/12`, `monthly`,
  `yearly / 12`).
- `annualizeAmount(amount, frequency)` — annualized cost
  (`daily * 365`, `weekly * 52`, `monthly * 12`, `yearly`).
- `frequencyLabel(frequency)` — human-readable label
  (`"Every day" / week / month / year`).

## Usage

```js
import {
  RECURRING_FREQUENCIES,
  formatCurrency,
  monthlyFromFrequency,
  annualizeAmount,
  frequencyLabel,
} from "@repo/utils";

monthlyFromFrequency(15, "yearly"); // 1.25
annualizeAmount(5, "weekly");       // 260
frequencyLabel("monthly");          // "Every month"
formatCurrency(1.25);               // "$1.25"
```
