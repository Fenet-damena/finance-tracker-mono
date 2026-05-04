"use client";

import { useCallback, useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";

type ExpenseItem = {
  amount: number;
};

function toUiError(error: unknown): string {
  const maybeError = error as { code?: string; message?: string };

  if (maybeError?.code === "permission-denied") {
    return "Firestore read was blocked by security rules.";
  }

  if ((maybeError?.message || "").includes("Database '(default)' not found")) {
    return "Firestore database was not found. Create it or set NEXT_PUBLIC_FIRESTORE_DATABASE_ID.";
  }

  return "Could not load dashboard data from Firebase.";
}

export default function Dashboard() {
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setErrorText("");

    try {
      const [budgetDoc, expenseDocs] = await Promise.all([
        getDoc(doc(db, "finance", "main")),
        getDocs(collection(db, "expenses")),
      ]);

      const budgetData = budgetDoc.exists() ? budgetDoc.data() : null;
      setBudget(Number(budgetData?.budget) || 0);

      const expenseItems = expenseDocs.docs.map((item) => {
        const data = item.data();
        return { amount: Number(data.amount) || 0 };
      });

      setExpenses(expenseItems);
    } catch (error) {
      console.error("Error loading dashboard:", error);
      setErrorText(toUiError(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const spent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remaining = budget - spent;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#111827" }}>📊 Finance Dashboard</h2>

      {isLoading ? (
        <p style={{ color: "#6b7280", fontSize: "13px" }}>Loading dashboard...</p>
      ) : null}

      {errorText ? (
        <p style={{ color: "#991b1b", fontSize: "13px" }}>{errorText}</p>
      ) : null}

      <div style={grid}>
        <Card title="Budget" value={`$${budget}`} />
        <Card title="Spent" value={`$${spent}`} />
        <Card title="Remaining" value={`$${remaining}`} />
        <Card title="Status" value={spent > budget ? "Over Budget ⚠️" : "On Track ✅"} />
      </div>

      {spent > budget && budget > 0 && (
        <div style={warning}>
          ⚠️ You have exceeded your budget limit!
        </div>
      )}
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div style={card}>
      <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>{title}</p>
      <h3 style={{ margin: "5px 0 0", color: "#111827" }}>{value}</h3>
    </div>
  );
}

/* STYLES */
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "15px",
  marginTop: "20px",
};

const card = {
  padding: "18px",
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
};

const warning = {
  marginTop: "20px",
  padding: "12px",
  backgroundColor: "#fee2e2",
  border: "1px solid #fecaca",
  color: "#991b1b",
  borderRadius: "8px",
  fontWeight: "600",
};