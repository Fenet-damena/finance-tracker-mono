"use client";

import { useState } from "react";
import { Card, Input, Button } from "@repo/ui";

export default function BudgetFeature() {
  const [budget, setBudget] = useState(0);
  const [input, setInput] = useState("");

  const setNewBudget = () => {
    setBudget(Number(input));
    setInput("");
  };

  return (
    <Card>
      <h2>💰 Budget Planner</h2>

      <Input
        placeholder="Set your monthly budget"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <Button onClick={setNewBudget}>Set Budget</Button>

      <div style={{ marginTop: "20px" }}>
        <h3>Current Budget:</h3>

        <p style={{ fontSize: "20px", fontWeight: "700" }}>
          ${budget}
        </p>

        {budget === 0 && (
          <p style={{ color: "#6b7280" }}>
            No budget set yet
          </p>
        )}
      </div>
    </Card>
  );
}