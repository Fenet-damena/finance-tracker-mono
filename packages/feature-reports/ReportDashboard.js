import React from "react";
import { Card } from "@repo/ui";
import { aggregateByCategory, getMonthlyTotals } from "@repo/utils";
import SpendingBreakdown from "./SpendingBreakdown";
import SavingsTrend from "./SavingsTrend";
import { TrendingUp, PieChart as PieIcon } from "lucide-react";

const DEMO_EXPENSES = [
  { amount: 1200, category: "Rent", date: "2026-04-01" },
  { amount: 150, category: "Food", date: "2026-04-05" },
  { amount: 200, category: "Food", date: "2026-03-15" },
  { amount: 100, category: "Entertainment", date: "2026-04-10" },
  { amount: 300, category: "Utilities", date: "2026-03-20" },
  { amount: 450, category: "Transport", date: "2026-02-10" },
  { amount: 1100, category: "Rent", date: "2026-03-01" },
];

export default function ReportDashboard({ data = DEMO_EXPENSES }) {
  const breakdownData = aggregateByCategory(data);
  const trendData = getMonthlyTotals(data);

  return (
    <div style={{ padding: "20px" }}>
      <header style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#111827", margin: 0, fontSize: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
          📊 Financial Reports & Analytics
        </h2>
        <p style={{ color: "#64748b", marginTop: "5px" }}>Visual insights into your spending and savings habits.</p>
      </header>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", 
        gap: "25px" 
      }}>
        {/* Spending Breakdown */}
        <Card title={
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <PieIcon size={18} /> Spending by Category
          </span>
        }>
          <div style={{ padding: "10px 0" }}>
            <SpendingBreakdown data={breakdownData} />
          </div>
        </Card>

        {/* Savings Trend */}
        <Card title={
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <TrendingUp size={18} /> Monthly Expense Trend
          </span>
        }>
          <div style={{ padding: "10px 0" }}>
            <SavingsTrend data={trendData} />
          </div>
        </Card>
      </div>

      {/* Analytics Summary */}
      <div style={{ 
        marginTop: "25px", 
        padding: "20px", 
        backgroundColor: "#f8fafc", 
        borderRadius: "12px",
        border: "1px solid #e2e8f0"
      }}>
        <h4 style={{ margin: "0 0 10px 0", color: "#1e293b" }}>💡 AI Insight</h4>
        <p style={{ margin: 0, color: "#475569", fontSize: "14px", lineHeight: "1.5" }}>
          Your highest spending category is <strong>{breakdownData[0]?.name || "N/A"}</strong>. 
          Consider reviewing your {breakdownData[0]?.name?.toLowerCase()} expenses to increase your monthly savings. 
          Your spending has decreased by 12% compared to last month.
        </p>
      </div>
    </div>
  );
}

