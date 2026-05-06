// =============================================================================
// Group baseline helpers (preserved exactly — used by feature-budget,
// feature-expense, feature-insights, feature-goals, feature-reports).
// =============================================================================

export function formatCurrency(amount) {
  return `$${Number(amount).toFixed(2)}`;
}

/**
 * Aggregates a list of items by a specific key (e.g., 'category')
 * @param {Array} items - List of finance objects
 * @param {string} key - Key to group by
 * @returns {Array} - Aggregated data for charts
 */
export function aggregateByCategory(items, key = "category") {
  const map = items.reduce((acc, item) => {
    const val = item[key] || "Uncategorized";
    acc[val] = (acc[val] || 0) + Number(item.amount || 0);
    return acc;
  }, {});

  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

/**
 * Groups items by month for trend analysis
 * @param {Array} items - List of finance objects with 'date'
 * @returns {Array} - Data for bar charts
 */
export function getMonthlyTotals(items) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const map = items.reduce((acc, item) => {
    if (!item.date) return acc;
    const date = new Date(item.date);
    const month = months[date.getMonth()];
    acc[month] = (acc[month] || 0) + Number(item.amount || 0);
    return acc;
  }, {});

  return months.filter(m => map[m] !== undefined).map(month => ({
    name: month,
    total: map[month]
  }));
}

// =============================================================================
// Generic helpers contributed with feature-recurring (Yabets).
// All pure, framework-free, and intentionally not tied to any one feature so
// the rest of the team can adopt them.
// =============================================================================

/**
 * Format a 0..1 ratio as a percent string. `formatPercent(0.42)` → "42%".
 */
export function formatPercent(ratio, fractionDigits = 0) {
  const safe = Number.isFinite(Number(ratio)) ? Number(ratio) : 0;
  return `${(safe * 100).toFixed(fractionDigits)}%`;
}

/**
 * Bound `value` into the inclusive range `[min, max]`.
 * Returns `min` when `value` is NaN.
 */
export function clamp(value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

/**
 * Strict number parser: returns the parsed value when finite, otherwise
 * the supplied fallback (default 0). Centralizes the
 * `Number(x) || 0` pattern that's repeated across every feature today.
 */
export function parseNumber(input, fallback = 0) {
  if (typeof input === "number") {
    return Number.isFinite(input) ? input : fallback;
  }
  if (typeof input !== "string") return fallback;
  const cleaned = input.replace(/[^0-9.\-]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Sum a numeric projection of an array.
 * `sumBy([{ a: 1 }, { a: 2 }], (i) => i.a) === 3`.
 */
export function sumBy(items, selector) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((total, item) => total + (Number(selector(item)) || 0), 0);
}

/**
 * Bucket items into `{ [key]: items[] }`. Generalization of
 * `aggregateByCategory` that doesn't sum — useful when callers want the
 * raw groups (e.g. count, top item, etc.).
 */
export function groupBy(items, keySelector) {
  const result = {};
  if (!Array.isArray(items)) return result;
  for (const item of items) {
    const key = String(keySelector(item) ?? "");
    if (!result[key]) result[key] = [];
    result[key].push(item);
  }
  return result;
}

/**
 * Return the top `count` items sorted by a numeric score (descending).
 */
export function topN(items, scoreSelector, count = 5) {
  if (!Array.isArray(items)) return [];
  return [...items]
    .sort((a, b) => Number(scoreSelector(b)) - Number(scoreSelector(a)))
    .slice(0, Math.max(0, count));
}

/**
 * Locale-aware date formatter. Accepts a Date, ms timestamp, or string.
 * Defaults to "Jan 5, 2025" style.
 */
export function formatDate(input, options) {
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat(
    "en-US",
    options || { month: "short", day: "numeric", year: "numeric" }
  ).format(d);
}

/**
 * Integer day diff between two dates/timestamps. Always positive,
 * minimum 1 (callers usually want "at least one day of activity").
 */
export function daysBetween(a, b) {
  const ms = Math.abs(new Date(a).getTime() - new Date(b).getTime());
  if (Number.isNaN(ms)) return 0;
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)));
}

// =============================================================================
// Recurring-specific helpers (also contributed with feature-recurring).
// Kept here so any feature that wants to surface recurring math can reuse
// them — e.g. dashboard, insights, reports.
// =============================================================================

export const RECURRING_FREQUENCIES = ["daily", "weekly", "monthly", "yearly"];

/**
 * Normalize a recurring amount into a monthly figure. Uses 30 days/month and
 * 365 days/year, the convention used by most consumer subscription tools.
 */
export function monthlyFromFrequency(amount, frequency) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return 0;
  switch (frequency) {
    case "daily":
      return value * 30;
    case "weekly":
      return (value * 52) / 12;
    case "yearly":
      return value / 12;
    case "monthly":
    default:
      return value;
  }
}

/** Annualized cost of a recurring amount at a given frequency. */
export function annualizeAmount(amount, frequency) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return 0;
  switch (frequency) {
    case "daily":
      return value * 365;
    case "weekly":
      return value * 52;
    case "yearly":
      return value;
    case "monthly":
    default:
      return value * 12;
  }
}

/** Human-readable label for a recurring frequency. */
export function frequencyLabel(frequency) {
  switch (frequency) {
    case "daily":
      return "Every day";
    case "weekly":
      return "Every week";
    case "yearly":
      return "Every year";
    case "monthly":
    default:
      return "Every month";
  }
}
