# @repo/utils (utils)

Small, pure JavaScript helpers shared across the monorepo. No React, no
Firebase, no network — anything in here is safe to call from a feature
package, the Next.js app (client or server), or a Node script.

## Exports

### Group baseline

| Helper                              | Provided by | Notes                                                                                                       |
| ----------------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------- |
| `formatCurrency(amount)`            | Fenet       | `12.34` → `"$12.34"` (USD-only). Used by feature-budget, feature-expense, feature-insights, feature-goals.  |
| `aggregateByCategory(items, key?)`  | suze-ad     | Groups items by a key and sums their `amount`. Used by feature-reports.                                     |
| `getMonthlyTotals(items)`           | suze-ad     | Buckets items by month and sums `amount`. Used by feature-reports.                                          |

### Generic helpers contributed by Yabets

All additive — none of the existing exports were modified, so every
teammate's feature keeps working unchanged.

| Helper                              | What it does                                                                                                |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `parseNumber(input, fallback?)`     | Strict number parser. Replaces the `Number(x) \|\| 0` pattern repeated across every feature today.         |
| `formatPercent(ratio, digits?)`     | `0.42` → `"42%"`. `digits` defaults to 0.                                                                   |
| `clamp(value, min, max)`            | Bound a number into an inclusive range.                                                                     |
| `sumBy(items, selector)`            | Sum a numeric projection of an array.                                                                       |
| `groupBy(items, keySelector)`       | Bucket items into `{ [key]: items[] }`. Non-summing generalization of `aggregateByCategory`.                |
| `topN(items, scoreSelector, n=5)`   | Top `n` items by score, descending.                                                                         |
| `formatDate(input, options?)`       | Locale-aware date formatter built on `Intl.DateTimeFormat`. Accepts `Date`, ms timestamp, or string.        |
| `daysBetween(a, b)`                 | Integer day diff between two dates/timestamps. Always positive, minimum 1.                                  |

### Recurring-finance helpers contributed by Yabets

Used directly by `feature-recurring` and available to any other feature
that wants to surface recurring-cost math (dashboard, insights, reports).

| Helper                              | What it does                                                                                                       |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `RECURRING_FREQUENCIES`             | `["daily", "weekly", "monthly", "yearly"]` — canonical option list for any recurring UI / dropdown.                |
| `monthlyFromFrequency(amount, fq)`  | Normalize a recurring amount into a monthly figure (`daily * 30`, `weekly * 52/12`, `monthly`, `yearly / 12`).     |
| `annualizeAmount(amount, fq)`       | Annualized cost (`daily * 365`, `weekly * 52`, `monthly * 12`, `yearly`).                                          |
| `frequencyLabel(fq)`                | Human-readable label (`"Every day" / week / month / year`).                                                        |

## Cross-feature use cases

| If a feature does this today …                              | They can now use …                                |
| ----------------------------------------------------------- | ------------------------------------------------- |
| `Number(x) \|\| 0` everywhere                               | `parseNumber(x)`                                  |
| `Math.round((saved / target) * 100) + "%"`                  | `formatPercent(saved / target)`                   |
| `arr.reduce((s, e) => s + e.amount, 0)`                     | `sumBy(arr, (e) => e.amount)`                     |
| `aggregateByCategory` then sort/slice for "top N"           | `topN(items, (i) => i.value, 5)`                  |
| Manual `new Date(ms).toLocaleDateString()`                  | `formatDate(ms)`                                  |
| `Math.round(ms / 86400000)` to get day count                | `daysBetween(a, b)`                               |

## Usage

```js
import {
  RECURRING_FREQUENCIES,
  annualizeAmount,
  clamp,
  daysBetween,
  formatCurrency,
  formatDate,
  formatPercent,
  frequencyLabel,
  groupBy,
  monthlyFromFrequency,
  parseNumber,
  sumBy,
  topN,
} from "@repo/utils";

monthlyFromFrequency(15, "yearly");        // 1.25
annualizeAmount(5, "weekly");              // 260
formatPercent(0.42);                        // "42%"
sumBy([{ a: 1 }, { a: 2 }], (x) => x.a);   // 3
clamp(120, 0, 100);                         // 100
daysBetween("2025-01-01", "2025-01-08");   // 7
```
