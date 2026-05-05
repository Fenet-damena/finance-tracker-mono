"use client";

import { useMemo, useState } from "react";
import { Button, Card, Input } from "@repo/ui";
import { formatCurrency } from "@repo/utils";

export default function InsightsFeature() {
  const [income, setIncome] = useState("");
  const [fixedCosts, setFixedCosts] = useState("");
  const [variableCosts, setVariableCosts] = useState("");
  const [savingsGoal, setSavingsGoal] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorText, setErrorText] = useState("");

  const model = useMemo(() => {
    const incomeValue = Number(income || 0);
    const fixedValue = Number(fixedCosts || 0);
    const variableValue = Number(variableCosts || 0);
    const goalValue = Number(savingsGoal || 0);

    const spend = fixedValue + variableValue;
    const freeCashFlow = incomeValue - spend;
    const savingsRate =
      incomeValue > 0 ? Math.round((freeCashFlow / incomeValue) * 100) : 0;

    return {
      incomeValue,
      fixedValue,
      variableValue,
      goalValue,
      spend,
      freeCashFlow,
      savingsRate,
    };
  }, [income, fixedCosts, variableCosts, savingsGoal]);

  const runInsights = () => {
    const values = [
      model.incomeValue,
      model.fixedValue,
      model.variableValue,
      model.goalValue,
    ];
    const invalid = values.some(
      (value) => !Number.isFinite(value) || value < 0,
    );

    if (model.incomeValue <= 0 || invalid) {
      setErrorText(
        "Enter valid non-negative numbers and income greater than zero.",
      );
      setSubmitted(false);
      return;
    }

    setErrorText("");
    setSubmitted(true);
  };

  const recommendations = buildRecommendations(model);

  return (
    <div style={page}>
      <h2 style={title}>📈 Spending Insights</h2>

      <Card>
        <h3 style={sectionTitle}>Monthly Inputs</h3>

        <Input
          type="number"
          value={income}
          onChange={(event) => setIncome(event.target.value)}
          placeholder="Monthly income"
        />

        <Input
          type="number"
          value={fixedCosts}
          onChange={(event) => setFixedCosts(event.target.value)}
          placeholder="Fixed costs (rent, bills)"
        />

        <Input
          type="number"
          value={variableCosts}
          onChange={(event) => setVariableCosts(event.target.value)}
          placeholder="Variable costs (food, transport, leisure)"
        />

        <Input
          type="number"
          value={savingsGoal}
          onChange={(event) => setSavingsGoal(event.target.value)}
          placeholder="Monthly savings goal"
        />

        <Button onClick={runInsights}>Generate Insights</Button>

        {errorText ? <p style={error}>{errorText}</p> : null}
      </Card>

      {submitted ? (
        <>
          <div style={summaryGrid}>
            <MetricCard
              label="Total Spend"
              value={formatCurrency(model.spend)}
            />
            <MetricCard
              label="Free Cash Flow"
              value={formatCurrency(model.freeCashFlow)}
            />
            <MetricCard label="Savings Rate" value={`${model.savingsRate}%`} />
            <MetricCard
              label="Savings Goal"
              value={formatCurrency(model.goalValue)}
            />
          </div>

          <Card>
            <h3 style={sectionTitle}>Recommendations</h3>
            <ul style={list}>
              {recommendations.map((item) => (
                <li key={item} style={listItem}>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </>
      ) : null}
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div style={metricCard}>
      <p style={metricLabel}>{label}</p>
      <strong style={metricValue}>{value}</strong>
    </div>
  );
}

function buildRecommendations(model) {
  const items = [];

  if (model.freeCashFlow < 0) {
    items.push(
      "You are spending more than you earn. Reduce variable costs first.",
    );
  } else {
    items.push("You are cash-flow positive. Keep tracking this trend monthly.");
  }

  if (model.savingsRate < 20) {
    items.push(
      "Savings rate is below 20%. Aim to reduce discretionary expenses by 10%.",
    );
  } else {
    items.push(
      "Savings rate is healthy. Consider automating savings contributions.",
    );
  }

  if (model.freeCashFlow < model.goalValue) {
    const deficit = Math.max(0, model.goalValue - model.freeCashFlow);
    items.push(
      `Current plan misses your savings goal by ${formatCurrency(deficit)}.`,
    );
  } else {
    items.push("Current plan can meet your savings goal.");
  }

  const fixedRatio =
    model.incomeValue > 0 ? (model.fixedValue / model.incomeValue) * 100 : 0;
  if (fixedRatio > 50) {
    items.push(
      "Fixed costs are above 50% of income. Review rent/subscription commitments.",
    );
  } else {
    items.push("Fixed-cost ratio is manageable.");
  }

  return items;
}

const page = {
  padding: "20px",
  display: "grid",
  gap: "16px",
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

const metricCard = {
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  backgroundColor: "#ffffff",
};

const metricLabel = {
  margin: 0,
  color: "#6b7280",
  fontSize: "13px",
};

const metricValue = {
  color: "#111827",
  fontSize: "18px",
};

const list = {
  margin: 0,
  paddingLeft: "18px",
  display: "grid",
  gap: "8px",
};

const listItem = {
  color: "#111827",
  fontSize: "14px",
};

const error = {
  marginTop: "10px",
  color: "#991b1b",
  fontSize: "13px",
};
