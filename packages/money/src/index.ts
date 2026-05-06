export type CurrencyCode =
  | "USD"
  | "EUR"
  | "GBP"
  | "JPY"
  | "CAD"
  | "AUD"
  | "INR"
  | "NGN"
  | "KES"
  | "ZAR"
  | "CNY"
  | "CHF";

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  minorUnitDigits: number;
}

export interface Money {
  amount: number;
  currency: CurrencyCode;
}

export interface ExchangeRate {
  from: CurrencyCode;
  to: CurrencyCode;
  rate: number;
  asOfMs: number;
}

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  USD: { code: "USD", symbol: "$", name: "US Dollar", minorUnitDigits: 2 },
  EUR: { code: "EUR", symbol: "€", name: "Euro", minorUnitDigits: 2 },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", minorUnitDigits: 2 },
  JPY: { code: "JPY", symbol: "¥", name: "Japanese Yen", minorUnitDigits: 0 },
  CAD: { code: "CAD", symbol: "CA$", name: "Canadian Dollar", minorUnitDigits: 2 },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar", minorUnitDigits: 2 },
  INR: { code: "INR", symbol: "₹", name: "Indian Rupee", minorUnitDigits: 2 },
  NGN: { code: "NGN", symbol: "₦", name: "Nigerian Naira", minorUnitDigits: 2 },
  KES: { code: "KES", symbol: "KSh", name: "Kenyan Shilling", minorUnitDigits: 2 },
  ZAR: { code: "ZAR", symbol: "R", name: "South African Rand", minorUnitDigits: 2 },
  CNY: { code: "CNY", symbol: "¥", name: "Chinese Yuan", minorUnitDigits: 2 },
  CHF: { code: "CHF", symbol: "CHF", name: "Swiss Franc", minorUnitDigits: 2 },
};

export const DEFAULT_RATES_AS_OF_MS = Date.UTC(2025, 0, 1);

export const DEFAULT_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 156.5,
  CAD: 1.36,
  AUD: 1.52,
  INR: 84.2,
  NGN: 1550,
  KES: 130,
  ZAR: 18.6,
  CNY: 7.25,
  CHF: 0.88,
};

export const ALL_CURRENCY_CODES: CurrencyCode[] = Object.keys(
  CURRENCIES,
) as CurrencyCode[];

export function isCurrencyCode(value: unknown): value is CurrencyCode {
  return typeof value === "string" && value in CURRENCIES;
}

export function parseAmount(input: string | number): number {
  if (typeof input === "number") return Number.isFinite(input) ? input : 0;
  const cleaned = String(input).replace(/[^0-9.\-]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function crossRate(
  from: CurrencyCode,
  to: CurrencyCode,
  rates: Record<CurrencyCode, number> = DEFAULT_RATES,
): number {
  if (from === to) return 1;
  const fromPerUsd = rates[from];
  const toPerUsd = rates[to];
  if (!fromPerUsd || !toPerUsd) return 0;
  return toPerUsd / fromPerUsd;
}

export function convert(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  rates: Record<CurrencyCode, number> = DEFAULT_RATES,
): number {
  const rate = crossRate(from, to, rates);
  const minor = CURRENCIES[to]?.minorUnitDigits ?? 2;
  const factor = Math.pow(10, minor);
  return Math.round(amount * rate * factor) / factor;
}

export function convertMoney(
  money: Money,
  to: CurrencyCode,
  rates: Record<CurrencyCode, number> = DEFAULT_RATES,
): Money {
  return {
    amount: convert(money.amount, money.currency, to, rates),
    currency: to,
  };
}

export function formatMoney(money: Money, locale = "en-US"): string {
  const meta = CURRENCIES[money.currency];
  const fractionDigits = meta?.minorUnitDigits ?? 2;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: money.currency,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(money.amount);
  } catch {
    const symbol = meta?.symbol ?? money.currency;
    return `${symbol}${money.amount.toFixed(fractionDigits)}`;
  }
}

/**
 * Add `b` to `a`, expressing the result in `a.currency`. If `b` is in a
 * different currency it is converted via the supplied rates.
 *
 * Useful when a feature aggregates Money values that came from multiple
 * sources (e.g. a recurring item priced in EUR and another in INR).
 */
export function addMoney(
  a: Money,
  b: Money,
  rates: Record<CurrencyCode, number> = DEFAULT_RATES,
): Money {
  const converted = convert(b.amount, b.currency, a.currency, rates);
  return { amount: a.amount + converted, currency: a.currency };
}

/**
 * Sum an array of Money values into a single base-currency total.
 * Empty / non-array input yields `{ amount: 0, currency: baseCurrency }`.
 *
 * This is the canonical way for any feature (recurring, insights, reports,
 * goals) to display a multi-currency total without each rewriting their own
 * reduce loop.
 */
export function sumMoney(
  monies: readonly Money[],
  baseCurrency: CurrencyCode,
  rates: Record<CurrencyCode, number> = DEFAULT_RATES,
): Money {
  if (!Array.isArray(monies) || monies.length === 0) {
    return { amount: 0, currency: baseCurrency };
  }

  let total = 0;
  for (const money of monies) {
    total += convert(money.amount, money.currency, baseCurrency, rates);
  }

  const minor = CURRENCIES[baseCurrency]?.minorUnitDigits ?? 2;
  const factor = Math.pow(10, minor);
  return {
    amount: Math.round(total * factor) / factor,
    currency: baseCurrency,
  };
}

/**
 * Comparator that returns -1 / 0 / 1 based on which Money is larger after
 * normalizing both into `baseCurrency` via the supplied rates. Suitable
 * for `array.sort(compareMoney)` style usage.
 */
export function compareMoney(
  a: Money,
  b: Money,
  baseCurrency: CurrencyCode = "USD",
  rates: Record<CurrencyCode, number> = DEFAULT_RATES,
): -1 | 0 | 1 {
  const aBase = convert(a.amount, a.currency, baseCurrency, rates);
  const bBase = convert(b.amount, b.currency, baseCurrency, rates);
  if (aBase < bBase) return -1;
  if (aBase > bBase) return 1;
  return 0;
}
