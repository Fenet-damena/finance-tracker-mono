import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f59e0b", "#10b981", "#06b6d4", "#3b82f6"];

export default function SpendingBreakdown({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
        No spending data available
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ height: "280px", width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`$${value.toLocaleString()}`, "Amount"]}
              contentStyle={{
                borderRadius: "10px",
                border: "none",
                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                padding: "10px 14px",
                fontSize: "13px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "12px",
        marginTop: "8px",
      }}>
        {data.map((entry, index) => {
          const pct = total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0;
          return (
            <div key={entry.name} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{
                width: "10px",
                height: "10px",
                borderRadius: "3px",
                backgroundColor: COLORS[index % COLORS.length],
                display: "inline-block",
              }}></span>
              <span style={{ fontSize: "12px", color: "#475569" }}>
                {entry.name} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
