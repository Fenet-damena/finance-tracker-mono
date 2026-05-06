import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function SavingsTrend({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
        No trend data available
      </div>
    );
  }

  return (
    <div style={{ height: "280px", width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barSize={32}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
              <stop offset="100%" stopColor="#818cf8" stopOpacity={0.7} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            cursor={{ fill: "rgba(99,102,241,0.06)" }}
            formatter={(value) => [`$${value.toLocaleString()}`, "Total"]}
            contentStyle={{
              borderRadius: "10px",
              border: "none",
              boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
              padding: "10px 14px",
              fontSize: "13px",
            }}
          />
          <Bar dataKey="total" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
