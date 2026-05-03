"use client";

import { useState } from "react";
import { Card, Button, Input } from "@repo/ui";
import { formatCurrency } from "@repo/utils";

export default function ExpenseFeature() {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const addExpense = () => {
    if (!title || !amount) return;

    const newExpense = {
      id: Date.now(),
      title,
      amount: Number(amount),
    };

    setExpenses([...expenses, newExpense]);
    setTitle("");
    setAmount("");
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div
      style={{
        backgroundColor: "#f3f4f6",
        padding: "20px",
      }}
    >
      <Card>
        <h2 style={{ color: "#111827", marginBottom: "5px" }}>
          💸 Expense Tracker
        </h2>

        <p style={{ color: "#6b7280", fontSize: "13px" }}>
          Track your spending in a simple way
        </p>

        <Input
          placeholder="Expense title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Input
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <Button onClick={addExpense}>Add Expense</Button>

        <div style={{ marginTop: "20px" }}>
          {expenses.map((e) => (
            <div
              key={e.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid #f3f4f6",
                fontSize: "14px",
                color: "#111827",
              }}
            >
              <span>{e.title}</span>
              <span style={{ fontWeight: "600" }}>
                {formatCurrency(e.amount)}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "15px",
            paddingTop: "10px",
            borderTop: "1px solid #e5e7eb",
            fontWeight: "700",
            color: "#111827",
          }}
        >
          Total: {formatCurrency(total)}
        </div>
      </Card>
    </div>
  );
}