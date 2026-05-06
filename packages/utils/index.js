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

/**
 * Recurring-expense helpers (added with feature-recurring).
 * Pure functions, framework-free, safe to import from any package.
 */

export const RECURRING_FREQUENCIES = ["daily", "weekly", "monthly", "yearly"];

/**
 * Normalize a recurring amount into a monthly figure.
 * Uses 30 days/month and 365 days/year as standard approximations,
 * which is the convention used by most consumer subscription tools.
 * @param {number} amount
 * @param {"daily"|"weekly"|"monthly"|"yearly"} frequency
 * @returns {number}
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

/**
 * Annualized cost of a recurring amount at a given frequency.
 * @param {number} amount
 * @param {"daily"|"weekly"|"monthly"|"yearly"} frequency
 * @returns {number}
 */
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

/**
 * Human-readable label for a recurring frequency.
 * @param {"daily"|"weekly"|"monthly"|"yearly"} frequency
 */
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
