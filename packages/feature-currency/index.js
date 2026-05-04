"use client";

import { useMemo, useState } from "react";
import { Button, Card, Input } from "@repo/ui";
import { formatCurrency } from "@repo/utils";
import {
  ALL_CURRENCY_CODES,
  CURRENCIES,
  DEFAULT_RATES,
  DEFAULT_RATES_AS_OF_MS,
  convert,
  convertMoney,
  crossRate,
  formatMoney,
  parseAmount,
} from "@repo/money";

const POPULAR_TARGETS = ["USD", "EUR", "GBP", "JPY", "INR", "NGN"];

export default function CurrencyFeature() {
  const [amountText, setAmountText] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");

  const amount = parseAmount(amountText);

  const converted = useMemo(
    () => convertMoney({ amount, currency: from }, to, DEFAULT_RATES),
    [amount, from, to],
  );

  const rate = useMemo(() => crossRate(from, to, DEFAULT_RATES), [from, to]);

  const popularTable = useMemo(() => {
    return POPULAR_TARGETS
      .filter((code) => code !== from)
      .map((code) => ({
        code,
        value: convert(amount, from, code, DEFAULT_RATES),
      }));
  }, [amount, from]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const fromMeta = CURRENCIES[from];
  const toMeta = CURRENCIES[to];
  const ratesAsOf = new Date(DEFAULT_RATES_AS_OF_MS).toISOString().slice(0, 10);

  return (
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
      <Card>
        <h2 style={{ color: "#111827", marginBottom: "5px" }}>
          Currency Converter
        </h2>

        <p style={{ color: "#6b7280", fontSize: "13px" }}>
          Convert any supported currency. Powered by{" "}
          <code>@repo/money</code> — pure logic shared across the monorepo.
        </p>

        <div style={fieldGroup}>
          <label style={fieldLabel}>Amount</label>
          <Input
            type="text"
            inputMode="decimal"
            value={amountText}
            onChange={(event) => setAmountText(event.target.value)}
            placeholder="Enter amount"
          />
        </div>

        <div style={selectorRow}>
          <div style={selectorColumn}>
            <label style={fieldLabel}>From</label>
            <CurrencySelect value={from} onChange={setFrom} />
          </div>

          <button onClick={swap} style={swapButton} aria-label="Swap currencies">
            ↔
          </button>

          <div style={selectorColumn}>
            <label style={fieldLabel}>To</label>
            <CurrencySelect value={to} onChange={setTo} />
          </div>
        </div>

        <div style={resultCard}>
          <p style={resultLabelTop}>
            {formatMoney({ amount, currency: from })}
          </p>
          <p style={resultEquals}>=</p>
          <p style={resultValue}>{formatMoney(converted)}</p>
          <p style={resultRateLine}>
            1 {from} = {rate ? rate.toFixed(4) : "0"} {to}
          </p>
        </div>

        <div style={{ marginTop: "16px" }}>
          <Button onClick={() => setAmountText(String(amount))}>
            Recalculate
          </Button>
        </div>

        <div style={{ marginTop: "24px" }}>
          <h3 style={sectionTitle}>
            {formatMoney({ amount, currency: from })} in popular currencies
          </h3>
          <div style={popularGrid}>
            {popularTable.map((row) => (
              <div key={row.code} style={popularTile}>
                <p style={popularCode}>{row.code}</p>
                <strong style={popularValue}>
                  {formatMoney({ amount: row.value, currency: row.code })}
                </strong>
              </div>
            ))}
          </div>
        </div>

        <div style={metaRow}>
          <span>
            Bundled rates as of <strong>{ratesAsOf}</strong>
          </span>
          <span>
            {fromMeta?.name} → {toMeta?.name}
          </span>
        </div>

        <details style={legacyDetails}>
          <summary style={legacySummary}>
            Compare with the existing <code>@repo/utils</code> formatter
          </summary>
          <p style={legacyBody}>
            <code>formatCurrency(amount)</code> from <code>@repo/utils</code>{" "}
            (USD-only): <strong>{formatCurrency(amount)}</strong>. The new{" "}
            <code>formatMoney</code> in <code>@repo/money</code> is locale-aware
            and supports every currency:{" "}
            <strong>{formatMoney({ amount, currency: from })}</strong>.
          </p>
        </details>
      </Card>
    </div>
  );
}

function CurrencySelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      style={selectStyle}
    >
      {ALL_CURRENCY_CODES.map((code) => {
        const meta = CURRENCIES[code];
        return (
          <option key={code} value={code}>
            {code} — {meta.name}
          </option>
        );
      })}
    </select>
  );
}

const fieldGroup = {
  marginTop: "12px",
};

const fieldLabel = {
  display: "block",
  fontSize: "12px",
  color: "#6b7280",
  marginBottom: "4px",
};

const selectorRow = {
  marginTop: "12px",
  display: "grid",
  gridTemplateColumns: "1fr auto 1fr",
  gap: "10px",
  alignItems: "end",
};

const selectorColumn = {
  display: "flex",
  flexDirection: "column",
};

const selectStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  backgroundColor: "#f9fafb",
  fontSize: "14px",
  outline: "none",
};

const swapButton = {
  marginBottom: "1px",
  height: "42px",
  width: "42px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  backgroundColor: "#ffffff",
  cursor: "pointer",
  fontSize: "16px",
  color: "#111827",
};

const resultCard = {
  marginTop: "20px",
  padding: "16px",
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  textAlign: "center",
};

const resultLabelTop = {
  margin: 0,
  fontSize: "13px",
  color: "#6b7280",
};

const resultEquals = {
  margin: "4px 0",
  fontSize: "14px",
  color: "#9ca3af",
};

const resultValue = {
  margin: 0,
  fontSize: "26px",
  fontWeight: "700",
  color: "#111827",
};

const resultRateLine = {
  marginTop: "10px",
  fontSize: "12px",
  color: "#6b7280",
};

const sectionTitle = {
  margin: "0 0 8px",
  fontSize: "14px",
  color: "#111827",
};

const popularGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: "10px",
};

const popularTile = {
  padding: "12px",
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
};

const popularCode = {
  margin: 0,
  fontSize: "12px",
  color: "#6b7280",
};

const popularValue = {
  display: "block",
  marginTop: "4px",
  fontSize: "15px",
  color: "#111827",
};

const metaRow = {
  marginTop: "20px",
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "8px",
  fontSize: "12px",
  color: "#6b7280",
};

const legacyDetails = {
  marginTop: "16px",
  padding: "10px 12px",
  backgroundColor: "#fafafa",
  border: "1px dashed #d1d5db",
  borderRadius: "10px",
};

const legacySummary = {
  cursor: "pointer",
  fontSize: "13px",
  color: "#374151",
};

const legacyBody = {
  marginTop: "8px",
  marginBottom: 0,
  fontSize: "12px",
  color: "#4b5563",
  lineHeight: 1.5,
};
