"use client";

import { useMemo, useState } from "react";
import { Button, Card, Input } from "@repo/ui";
import { formatCurrency } from "@repo/utils";

const STORAGE_KEY = "finance-tracker-goals-v1";

export default function GoalsFeature() {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("");
  const [errorText, setErrorText] = useState("");
  const [noticeText, setNoticeText] = useState("");

  const [goals, setGoals] = useState(() => readGoalsFromStorage());

  const summary = useMemo(() => {
    const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const totalSaved = goals.reduce((sum, goal) => sum + goal.savedAmount, 0);
    const completion =
      totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

    return {
      totalTarget,
      totalSaved,
      completion,
    };
  }, [goals]);

  const addGoal = () => {
    const parsedTarget = Number(target);
    const parsedSaved = Number(saved || 0);

    if (!name.trim()) {
      setErrorText("Goal name is required.");
      setNoticeText("");
      return;
    }

    if (!Number.isFinite(parsedTarget) || parsedTarget <= 0) {
      setErrorText("Target amount must be a positive number.");
      setNoticeText("");
      return;
    }

    if (!Number.isFinite(parsedSaved) || parsedSaved < 0) {
      setErrorText("Saved amount must be zero or greater.");
      setNoticeText("");
      return;
    }

    const nextGoal = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name: name.trim(),
      targetAmount: parsedTarget,
      savedAmount: parsedSaved,
      createdAt: Date.now(),
    };

    const nextGoals = [nextGoal, ...goals];
    setGoals(nextGoals);
    writeGoalsToStorage(nextGoals);

    setName("");
    setTarget("");
    setSaved("");
    setErrorText("");
    setNoticeText("Goal added successfully.");
  };

  const removeGoal = (goalId) => {
    const nextGoals = goals.filter((goal) => goal.id !== goalId);
    setGoals(nextGoals);
    writeGoalsToStorage(nextGoals);
    setNoticeText("Goal removed.");
    setErrorText("");
  };

  const updateProgress = (goalId, value) => {
    const parsedValue = Number(value);
    if (!Number.isFinite(parsedValue) || parsedValue < 0) {
      setErrorText("Saved amount must be zero or greater.");
      return;
    }

    const nextGoals = goals.map((goal) => {
      if (goal.id !== goalId) {
        return goal;
      }

      return {
        ...goal,
        savedAmount: parsedValue,
      };
    });

    setGoals(nextGoals);
    writeGoalsToStorage(nextGoals);
    setErrorText("");
    setNoticeText("Progress updated.");
  };

  return (
    <div style={container}>
      <h2 style={title}>🎯 Financial Goals</h2>

      <Card>
        <h3 style={sectionTitle}>Create Goal</h3>

        <Input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Goal name (e.g., Emergency Fund)"
        />

        <Input
          value={target}
          onChange={(event) => setTarget(event.target.value)}
          placeholder="Target amount"
          type="number"
        />

        <Input
          value={saved}
          onChange={(event) => setSaved(event.target.value)}
          placeholder="Saved so far (optional)"
          type="number"
        />

        <Button onClick={addGoal}>Add Goal</Button>

        {errorText ? <p style={error}>{errorText}</p> : null}
        {noticeText ? <p style={notice}>{noticeText}</p> : null}
      </Card>

      <div style={summaryGrid}>
        <SummaryCard
          label="Total Target"
          value={formatCurrency(summary.totalTarget)}
        />
        <SummaryCard
          label="Total Saved"
          value={formatCurrency(summary.totalSaved)}
        />
        <SummaryCard label="Completion" value={`${summary.completion}%`} />
      </div>

      <Card>
        <h3 style={sectionTitle}>Your Goals</h3>

        {goals.length === 0 ? (
          <p style={emptyText}>
            No goals yet. Add your first financial goal above.
          </p>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {goals.map((goal) => {
              const progress = Math.min(
                100,
                Math.round((goal.savedAmount / goal.targetAmount) * 100),
              );

              return (
                <div key={goal.id} style={goalRow}>
                  <div style={{ display: "grid", gap: "6px" }}>
                    <strong style={{ color: "#111827" }}>{goal.name}</strong>
                    <span style={mutedText}>
                      {formatCurrency(goal.savedAmount)} /{" "}
                      {formatCurrency(goal.targetAmount)}
                    </span>
                    <span style={mutedText}>Progress: {progress}%</span>
                  </div>

                  <div style={actionsColumn}>
                    <Input
                      value={String(goal.savedAmount)}
                      onChange={(event) =>
                        updateProgress(goal.id, event.target.value)
                      }
                      type="number"
                      placeholder="Update saved"
                    />

                    <button
                      style={dangerButton}
                      onClick={() => removeGoal(goal.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div style={summaryCard}>
      <p style={summaryLabel}>{label}</p>
      <strong style={summaryValue}>{value}</strong>
    </div>
  );
}

function readGoalsFromStorage() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((goal) => {
        return (
          goal &&
          typeof goal.id === "string" &&
          typeof goal.name === "string" &&
          Number.isFinite(goal.targetAmount) &&
          Number.isFinite(goal.savedAmount)
        );
      })
      .map((goal) => ({
        ...goal,
        targetAmount: Number(goal.targetAmount),
        savedAmount: Number(goal.savedAmount),
      }));
  } catch {
    return [];
  }
}

function writeGoalsToStorage(goals) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
}

const container = {
  display: "grid",
  gap: "16px",
  padding: "20px",
  backgroundColor: "#f9fafb",
};

const title = {
  margin: 0,
  color: "#111827",
};

const sectionTitle = {
  marginTop: 0,
  color: "#111827",
};

const summaryGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "12px",
};

const summaryCard = {
  backgroundColor: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "14px",
};

const summaryLabel = {
  margin: 0,
  color: "#6b7280",
  fontSize: "13px",
};

const summaryValue = {
  color: "#111827",
  fontSize: "18px",
};

const goalRow = {
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  padding: "12px",
  display: "grid",
  gridTemplateColumns: "1fr minmax(180px, 220px)",
  gap: "10px",
  alignItems: "start",
};

const actionsColumn = {
  display: "grid",
  gap: "8px",
};

const mutedText = {
  color: "#6b7280",
  fontSize: "13px",
};

const dangerButton = {
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #fca5a5",
  color: "#991b1b",
  backgroundColor: "#fee2e2",
  cursor: "pointer",
};

const emptyText = {
  color: "#6b7280",
  fontSize: "13px",
};

const error = {
  marginTop: "10px",
  color: "#991b1b",
  fontSize: "13px",
};

const notice = {
  marginTop: "10px",
  color: "#065f46",
  fontSize: "13px",
};
