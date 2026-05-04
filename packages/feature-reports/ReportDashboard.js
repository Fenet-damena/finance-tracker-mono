import React from "react";
import { Card } from "@repo/ui";

export default function ReportDashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#111827", marginBottom: "20px" }}>📊 Financial Reports & Analytics</h2>
      
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", 
        gap: "20px" 
      }}>
        <Card title="Spending Breakdown">
          <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
            [Analytics Visualization Loading...]
          </div>
        </Card>

        <Card title="Savings Trend">
          <div style={{ height: "300px", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
            [Analytics Visualization Loading...]
          </div>
        </Card>
      </div>
    </div>
  );
}
