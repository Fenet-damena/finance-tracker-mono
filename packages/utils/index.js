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