import React from "react";
import { aggregateByCategory, getMonthlyTotals } from "@repo/utils";
import SpendingBreakdown from "./SpendingBreakdown";
import SavingsTrend from "./SavingsTrend";

const DEMO_EXPENSES = [
  { amount: 1200, category: "Rent", date: "2026-01-15" },
  { amount: 850, category: "Rent", date: "2026-02-15" },
  { amount: 1200, category: "Rent", date: "2026-03-15" },
  { amount: 1200, category: "Rent", date: "2026-04-15" },
  { amount: 320, category: "Food", date: "2026-01-10" },
  { amount: 280, category: "Food", date: "2026-02-08" },
  { amount: 350, category: "Food", date: "2026-03-12" },
  { amount: 150, category: "Food", date: "2026-04-05" },
  { amount: 200, category: "Food", date: "2026-04-20" },
  { amount: 100, category: "Entertainment", date: "2026-01-20" },
  { amount: 75, category: "Entertainment", date: "2026-02-25" },
  { amount: 120, category: "Entertainment", date: "2026-03-18" },
  { amount: 100, category: "Entertainment", date: "2026-04-10" },
  { amount: 180, category: "Utilities", date: "2026-01-05" },
  { amount: 200, category: "Utilities", date: "2026-02-05" },
  { amount: 190, category: "Utilities", date: "2026-03-05" },
  { amount: 300, category: "Utilities", date: "2026-04-05" },
  { amount: 450, category: "Transport", date: "2026-01-12" },
  { amount: 380, category: "Transport", date: "2026-02-10" },
  { amount: 420, category: "Transport", date: "2026-03-14" },
  { amount: 350, category: "Transport", date: "2026-04-08" },
  { amount: 60, category: "Health", date: "2026-02-20" },
  { amount: 150, category: "Health", date: "2026-03-22" },
  { amount: 90, category: "Health", date: "2026-04-18" },
];

export default function ReportDashboard({ data = DEMO_EXPENSES }) {
  const breakdownData = aggregateByCategory(data);
  const trendData = getMonthlyTotals(data);

  const totalSpent = data.reduce((s, i) => s + Number(i.amount || 0), 0);
  const avgMonthly = trendData.length > 0 ? totalSpent / trendData.length : 0;
  const topCategory = breakdownData.sort((a, b) => b.value - a.value)[0];

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>📊 Reports & Analytics</h2>
          <p style={styles.subtitle}>Visual insights into your spending and savings habits</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        <div style={{ ...styles.summaryCard, borderLeft: "4px solid #6366f1" }}>
          <p style={styles.summaryLabel}>Total Spent</p>
          <p style={styles.summaryValue}>${totalSpent.toLocaleString()}</p>
        </div>
        <div style={{ ...styles.summaryCard, borderLeft: "4px solid #10b981" }}>
          <p style={styles.summaryLabel}>Monthly Average</p>
          <p style={styles.summaryValue}>${Math.round(avgMonthly).toLocaleString()}</p>
        </div>
        <div style={{ ...styles.summaryCard, borderLeft: "4px solid #f59e0b" }}>
          <p style={styles.summaryLabel}>Top Category</p>
          <p style={styles.summaryValue}>{topCategory?.name || "N/A"}</p>
        </div>
        <div style={{ ...styles.summaryCard, borderLeft: "4px solid #ec4899" }}>
          <p style={styles.summaryLabel}>Categories</p>
          <p style={styles.summaryValue}>{breakdownData.length}</p>
        </div>
      </div>

      {/* Charts */}
      <div style={styles.chartsGrid}>
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>🥧 Spending by Category</h3>
            <span style={styles.chartBadge}>Breakdown</span>
          </div>
          <SpendingBreakdown data={breakdownData} />
        </div>

        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>📈 Monthly Expense Trend</h3>
            <span style={styles.chartBadge}>Trend</span>
          </div>
          <SavingsTrend data={trendData} />
        </div>
      </div>

      {/* Insight Panel */}
      <div style={styles.insightCard}>
        <div style={styles.insightHeader}>
          <span style={styles.insightIcon}>💡</span>
          <h4 style={styles.insightTitle}>Smart Insights</h4>
        </div>
        <div style={styles.insightBody}>
          <div style={styles.insightItem}>
            <span style={styles.insightDot}></span>
            <p style={styles.insightText}>
              Your highest spending category is <strong>{topCategory?.name || "N/A"}</strong> at ${topCategory?.value?.toLocaleString() || 0}.
            </p>
          </div>
          <div style={styles.insightItem}>
            <span style={styles.insightDot}></span>
            <p style={styles.insightText}>
              You spend an average of <strong>${Math.round(avgMonthly).toLocaleString()}</strong> per month across all categories.
            </p>
          </div>
          <div style={styles.insightItem}>
            <span style={styles.insightDot}></span>
            <p style={styles.insightText}>
              Consider reviewing your <strong>{topCategory?.name?.toLowerCase()}</strong> expenses to increase your monthly savings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    padding: "30px",
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    maxWidth: "1100px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "28px",
  },
  title: {
    margin: 0,
    fontSize: "26px",
    fontWeight: "700",
    color: "#0f172a",
  },
  subtitle: {
    margin: "6px 0 0 0",
    fontSize: "14px",
    color: "#64748b",
  },

  /* Summary Cards */
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "28px",
  },
  summaryCard: {
    padding: "18px 20px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  },
  summaryLabel: {
    margin: 0,
    fontSize: "12px",
    fontWeight: "600",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  summaryValue: {
    margin: "6px 0 0 0",
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f172a",
  },

  /* Chart Cards */
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
  },
  chartCard: {
    padding: "24px",
    backgroundColor: "#ffffff",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  chartHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  chartTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e293b",
  },
  chartBadge: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#6366f1",
    backgroundColor: "#eef2ff",
    padding: "4px 10px",
    borderRadius: "20px",
  },

  /* Insight Panel */
  insightCard: {
    padding: "24px",
    backgroundColor: "#fefce8",
    borderRadius: "14px",
    border: "1px solid #fde68a",
  },
  insightHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "14px",
  },
  insightIcon: {
    fontSize: "20px",
  },
  insightTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "600",
    color: "#92400e",
  },
  insightBody: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  insightItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
  },
  insightDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#f59e0b",
    marginTop: "7px",
    flexShrink: 0,
  },
  insightText: {
    margin: 0,
    fontSize: "14px",
    color: "#78350f",
    lineHeight: "1.5",
  },
};
