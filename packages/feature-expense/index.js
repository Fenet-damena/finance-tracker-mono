"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, Button, Input } from "@repo/ui";
import { formatCurrency } from "@repo/utils";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../apps/web/lib/firebase";

function toUiError(error) {
  if (error?.code === "permission-denied") {
    return "Firestore blocked this action. Update your Firestore rules.";
  }

  if (String(error?.message || "").includes("Database '(default)' not found")) {
    return "Firestore database was not found. Create it or set NEXT_PUBLIC_FIRESTORE_DATABASE_ID.";
  }

  if (String(error?.message || "").includes("request-timeout")) {
    return "Request timed out. Please try again.";
  }

  return "Could not sync expenses with Firebase.";
}

export default function ExpenseFeature() {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(0);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [editingId, setEditingId] = useState("");
  const [editingTitle, setEditingTitle] = useState("");
  const [editingAmount, setEditingAmount] = useState("");
  const [busyExpenseId, setBusyExpenseId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const loadOverview = useCallback(async () => {
    setIsLoading(true);
    setErrorText("");

    try {
      const [budgetDoc, snapshot] = await Promise.all([
        getDoc(doc(db, "finance", "main")),
        getDocs(collection(db, "expenses")),
      ]);

      const budgetData = budgetDoc.exists() ? budgetDoc.data() : null;
      setBudget(Number(budgetData?.budget) || 0);

      const items = snapshot.docs.map((docItem) => {
        const data = docItem.data();

        return {
          id: docItem.id,
          title: data.title || "Untitled",
          amount: Number(data.amount) || 0,
          createdAtMs: data.createdAt?.toMillis ? data.createdAt.toMillis() : 0,
        };
      });

      items.sort((a, b) => b.createdAtMs - a.createdAtMs);
      setExpenses(items);
    } catch (error) {
      console.error("Error loading expenses:", error);
      setErrorText(toUiError(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const addExpense = () => {
    const run = async () => {
      const parsedAmount = Number(amount);
      if (!title || !amount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
        setErrorText("Enter a valid title and amount.");
        return;
      }

      setIsSaving(true);
      setErrorText("");

      try {
        await addDoc(collection(db, "expenses"), {
          title,
          amount: parsedAmount,
          createdAt: serverTimestamp(),
        });

        setTitle("");
        setAmount("");
        await loadOverview();
      } catch (error) {
        console.error("Error saving expense:", error);
        setErrorText(toUiError(error));
      } finally {
        setIsSaving(false);
      }
    };

    run();
  };

  const startEdit = (expense) => {
    setEditingId(expense.id);
    setEditingTitle(expense.title);
    setEditingAmount(String(expense.amount));
    setErrorText("");
  };

  const cancelEdit = () => {
    setEditingId("");
    setEditingTitle("");
    setEditingAmount("");
  };

  const saveEdit = async () => {
    const parsedAmount = Number(editingAmount);
    if (!editingTitle || !editingAmount || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorText("Enter valid title and amount for editing.");
      return;
    }

    setBusyExpenseId(editingId);
    setErrorText("");

    try {
      await updateDoc(doc(db, "expenses", editingId), {
        title: editingTitle,
        amount: parsedAmount,
      });

      cancelEdit();
      await loadOverview();
    } catch (error) {
      console.error("Error updating expense:", error);
      setErrorText(toUiError(error));
    } finally {
      setBusyExpenseId("");
    }
  };

  const removeExpense = async (expenseId) => {
    setBusyExpenseId(expenseId);
    setErrorText("");

    try {
      await deleteDoc(doc(db, "expenses", expenseId));

      if (editingId === expenseId) {
        cancelEdit();
      }

      await loadOverview();
    } catch (error) {
      console.error("Error deleting expense:", error);
      setErrorText(toUiError(error));
    } finally {
      setBusyExpenseId("");
    }
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = budget - total;

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

        <Button onClick={addExpense}>{isSaving ? "Saving..." : "Add Expense"}</Button>

        {isLoading ? (
          <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "12px" }}>
            Loading expenses...
          </p>
        ) : null}

        {errorText ? (
          <p style={{ fontSize: "13px", color: "#991b1b", marginTop: "12px" }}>
            {errorText}
          </p>
        ) : null}

        <div
          style={{
            marginTop: "16px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "10px",
          }}
        >
          <div style={summaryCard}>
            <p style={summaryLabel}>Budget</p>
            <strong style={summaryValue}>{formatCurrency(budget)}</strong>
          </div>

          <div style={summaryCard}>
            <p style={summaryLabel}>Spent</p>
            <strong style={summaryValue}>{formatCurrency(total)}</strong>
          </div>

          <div style={summaryCard}>
            <p style={summaryLabel}>Remaining</p>
            <strong style={summaryValue}>{formatCurrency(remaining)}</strong>
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          {expenses.map((e) => (
            <div
              key={e.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                alignItems: "center",
                padding: "10px 0",
                borderBottom: "1px solid #f3f4f6",
                fontSize: "14px",
                color: "#111827",
                gap: "10px",
              }}
            >
              {editingId === e.id ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 130px", gap: "8px" }}>
                  <input
                    value={editingTitle}
                    onChange={(event) => setEditingTitle(event.target.value)}
                    style={inlineInput}
                  />
                  <input
                    value={editingAmount}
                    onChange={(event) => setEditingAmount(event.target.value)}
                    type="number"
                    style={inlineInput}
                  />
                </div>
              ) : (
                <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
                  <span>{e.title}</span>
                  <span style={{ fontWeight: "600" }}>{formatCurrency(e.amount)}</span>
                </div>
              )}

              {editingId === e.id ? (
                <div style={{ display: "flex", gap: "6px" }}>
                  <button onClick={saveEdit} style={rowButton}>
                    {busyExpenseId === e.id ? "Saving..." : "Save"}
                  </button>
                  <button onClick={cancelEdit} style={rowButtonSecondary}>
                    Cancel
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: "6px" }}>
                  <button onClick={() => startEdit(e)} style={rowButtonSecondary}>
                    Edit
                  </button>
                  <button onClick={() => removeExpense(e.id)} style={rowButtonDanger}>
                    {busyExpenseId === e.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}
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

const summaryCard = {
  padding: "12px",
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
};

const summaryLabel = {
  margin: 0,
  fontSize: "12px",
  color: "#6b7280",
};

const summaryValue = {
  display: "block",
  marginTop: "6px",
  fontSize: "16px",
  color: "#111827",
};

const inlineInput = {
  width: "100%",
  padding: "8px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
};

const rowButton = {
  padding: "6px 10px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#111827",
  color: "#fff",
  cursor: "pointer",
};

const rowButtonSecondary = {
  padding: "6px 10px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  backgroundColor: "#fff",
  color: "#111827",
  cursor: "pointer",
};

const rowButtonDanger = {
  padding: "6px 10px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#b91c1c",
  color: "#fff",
  cursor: "pointer",
};