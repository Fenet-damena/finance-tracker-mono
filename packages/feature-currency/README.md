# feature-currency

Multi-currency converter feature, mounted at `/currency` in `apps/web`.

## What it shows about the monorepo

| Source package  | What this feature uses it for                                |
| --------------- | ------------------------------------------------------------ |
| `@repo/ui`      | `Card`, `Button`, `Input` for the converter UI               |
| `@repo/utils`   | `formatCurrency` (kept for the side-by-side legacy comparison) |
| `@repo/money`   | All the conversion logic + types (`convert`, `convertMoney`, `crossRate`, `formatMoney`, `parseAmount`, `CURRENCIES`, `DEFAULT_RATES`) |

The same `@repo/money` package is also imported directly by `apps/web/app/currency/page.tsx`, so a single workspace package powers both the feature package and the consuming app — the standard monorepo benefit.
