# @repo/money

Pure, framework-free currency utilities shared across the monorepo.

No React, no Firebase, no network — this package is safe to consume from any feature package, the Next.js app (client or server), or a future backend service.

## Exports

### Types
- `CurrencyCode` — supported codes (USD, EUR, GBP, JPY, CAD, AUD, INR, NGN, KES, ZAR, CNY, CHF)
- `Currency` — `{ code, symbol, name, minorUnitDigits }`
- `Money` — `{ amount, currency }`
- `ExchangeRate` — `{ from, to, rate, asOfMs }`

### Data
- `CURRENCIES` — table of every supported currency
- `DEFAULT_RATES` — built-in USD-pivot rate table (no network call required)
- `DEFAULT_RATES_AS_OF_MS` — timestamp for the bundled rates
- `ALL_CURRENCY_CODES` — convenience array

### Functions
- `isCurrencyCode(value)` — type guard
- `parseAmount(input)` — sanitize text/number into a finite number
- `crossRate(from, to, rates?)` — exchange rate via USD pivot
- `convert(amount, from, to, rates?)` — number → number, rounded to the target currency's minor units
- `convertMoney(money, to, rates?)` — `Money` → `Money`
- `formatMoney(money, locale?)` — locale-aware via `Intl.NumberFormat`
