"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  Banner,
  Button,
  Card,
  EmptyState,
  Input,
  Pill,
  Section,
  Stack,
  StatTile,
} from "@repo/ui";
import {
  RECURRING_FREQUENCIES,
  annualizeAmount,
  formatCurrency,
  frequencyLabel,
  monthlyFromFrequency,
  parseNumber,
} from "@repo/utils";
import {
  ALL_CURRENCY_CODES,
  CURRENCIES,
  DEFAULT_RATES,
  compareMoney,
  formatMoney,
  sumMoney,
} from "@repo/money";
import { db } from "../../apps/web/lib/firebase";

const COLLECTION = "recurringExpenses";

function toUiError(error) {
  if (error?.code === "permission-denied") {
    return "Firestore blocked this action. Update your Firestore rules.";
  }
  if (String(error?.message || "").includes("Database '(default)' not found")) {
    return "Firestore database was not found. Create it or set NEXT_PUBLIC_FIRESTORE_DATABASE_ID.";
  }
  return "Could not sync recurring items with Firebase.";
}

export default function RecurringFeature() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("monthly");
  const [currency, setCurrency] = useState("USD");
  const [baseCurrency, setBaseCurrency] = useState("USD");

  const [busyId, setBusyId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [noticeText, setNoticeText] = useState("");

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    setErrorText("");

    try {
      const snapshot = await getDocs(collection(db, COLLECTION));

      const next = snapshot.docs.map((entry) => {
        const data = entry.data();
        return {
          id: entry.id,
          name: data.name || "Untitled",
          amount: parseNumber(data.amount, 0),
          frequency: RECURRING_FREQUENCIES.includes(data.frequency)
            ? data.frequency
            : "monthly",
          currency: typeof data.currency === "string" ? data.currency : "USD",
          status: data.status === "paused" ? "paused" : "active",
          createdAtMs: data.createdAt?.toMillis ? data.createdAt.toMillis() : 0,
        };
      });

      next.sort((a, b) => b.createdAtMs - a.createdAtMs);
      setItems(next);
    } catch (error) {
      console.error("Error loading recurring items:", error);
      setErrorText(toUiError(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const addItem = async () => {
    const parsedAmount = parseNumber(amount, NaN);

    if (!name.trim()) {
      setErrorText("Please enter a name (e.g. Netflix, Rent, Gym).");
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setErrorText("Amount must be a positive number.");
      return;
    }
    if (!RECURRING_FREQUENCIES.includes(frequency)) {
      setErrorText("Invalid frequency.");
      return;
    }
    if (!ALL_CURRENCY_CODES.includes(currency)) {
      setErrorText("Invalid currency.");
      return;
    }

    setIsSaving(true);
    setErrorText("");
    setNoticeText("");

    try {
      await addDoc(collection(db, COLLECTION), {
        name: name.trim(),
        amount: parsedAmount,
        frequency,
        currency,
        status: "active",
        createdAt: serverTimestamp(),
      });

      setName("");
      setAmount("");
      setFrequency("monthly");
      setCurrency(baseCurrency);
      setNoticeText("Recurring item added.");
      await loadItems();
    } catch (error) {
      console.error("Error saving recurring item:", error);
      setErrorText(toUiError(error));
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStatus = async (item) => {
    setBusyId(item.id);
    setErrorText("");
    setNoticeText("");

    try {
      const nextStatus = item.status === "active" ? "paused" : "active";
      await updateDoc(doc(db, COLLECTION, item.id), { status: nextStatus });
      setNoticeText(`"${item.name}" ${nextStatus === "paused" ? "paused" : "resumed"}.`);
      await loadItems();
    } catch (error) {
      console.error("Error toggling status:", error);
      setErrorText(toUiError(error));
    } finally {
      setBusyId("");
    }
  };

  const removeItem = async (item) => {
    setBusyId(item.id);
    setErrorText("");
    setNoticeText("");

    try {
      await deleteDoc(doc(db, COLLECTION, item.id));
      setNoticeText(`"${item.name}" removed.`);
      await loadItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      setErrorText(toUiError(error));
    } finally {
      setBusyId("");
    }
  };

  const activeItems = useMemo(
    () => items.filter((i) => i.status === "active"),
    [items],
  );

  // Build Money[] arrays once, then let @repo/money do the FX-aware summation.
  const monthlyMonies = useMemo(
    () =>
      activeItems.map((item) => ({
        amount: monthlyFromFrequency(item.amount, item.frequency),
        currency: item.currency,
      })),
    [activeItems],
  );

  const annualMonies = useMemo(
    () =>
      activeItems.map((item) => ({
        amount: annualizeAmount(item.amount, item.frequency),
        currency: item.currency,
      })),
    [activeItems],
  );

  const monthlyTotal = useMemo(
    () => sumMoney(monthlyMonies, baseCurrency, DEFAULT_RATES),
    [monthlyMonies, baseCurrency],
  );

  const annualTotal = useMemo(
    () => sumMoney(annualMonies, baseCurrency, DEFAULT_RATES),
    [annualMonies, baseCurrency],
  );

  // Sort displayed items by their monthly cost in base currency, descending.
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const aMonthly = {
        amount: monthlyFromFrequency(a.amount, a.frequency),
        currency: a.currency,
      };
      const bMonthly = {
        amount: monthlyFromFrequency(b.amount, b.frequency),
        currency: b.currency,
      };
      return compareMoney(bMonthly, aMonthly, baseCurrency, DEFAULT_RATES);
    });
  }, [items, baseCurrency]);

  const activeCount = activeItems.length;
  const pausedCount = items.length - activeCount;

  return (
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
      <Card>
        <Stack
          direction="row"
          justify="space-between"
          align="flex-start"
          gap={12}
          wrap
        >
          <div>
            <h2 style={{ color: "#111827", margin: 0 }}>🔁 Recurring Expenses</h2>
            <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px", marginBottom: 0 }}>
              Track subscriptions, rent, and any expense that repeats. Mix
              currencies — totals are normalized into your chosen base
              currency by <code>@repo/money</code>.
            </p>
          </div>

          <Stack direction="row" gap={8} align="center" wrap>
            <Pill tone="info">{items.length} item{items.length === 1 ? "" : "s"}</Pill>
            <Button onClick={loadItems}>{isLoading ? "Refreshing..." : "Refresh"}</Button>
          </Stack>
        </Stack>

        <div style={baseRow}>
          <label style={fieldLabel}>Base currency for totals</label>
          <select
            value={baseCurrency}
            onChange={(event) => setBaseCurrency(event.target.value)}
            style={selectStyle}
          >
            {ALL_CURRENCY_CODES.map((code) => (
              <option key={code} value={code}>
                {code} — {CURRENCIES[code].name}
              </option>
            ))}
          </select>
        </div>

        <div style={summaryGrid}>
          <StatTile
            label="Active items"
            value={String(activeCount)}
            hint={`${pausedCount} paused`}
          />
          <StatTile
            label="Monthly total"
            value={formatMoney(monthlyTotal)}
            hint={`Across ${activeCount} active item${activeCount === 1 ? "" : "s"}`}
            tone="info"
          />
          <StatTile
            label="Annual total"
            value={formatMoney(annualTotal)}
            hint="12 × monthly equivalent"
          />
        </div>

        <Section
          title="Add a recurring item"
          description="Use any supported currency — totals will normalize to your base currency."
        >
          <div style={formGrid}>
            <Input
              placeholder="Name (e.g. Netflix, Rent, Gym)"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <Input
              placeholder="Amount"
              type="number"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />

            <select
              value={frequency}
              onChange={(event) => setFrequency(event.target.value)}
              style={selectStyle}
            >
              {RECURRING_FREQUENCIES.map((opt) => (
                <option key={opt} value={opt}>
                  {frequencyLabel(opt)}
                </option>
              ))}
            </select>

            <select
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              style={selectStyle}
            >
              {ALL_CURRENCY_CODES.map((code) => (
                <option key={code} value={code}>
                  {code} — {CURRENCIES[code].symbol}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: "10px" }}>
            <Button onClick={addItem}>{isSaving ? "Saving..." : "Add"}</Button>
          </div>

          {errorText ? (
            <div style={{ marginTop: "12px" }}>
              <Banner tone="danger">{errorText}</Banner>
            </div>
          ) : null}
          {noticeText ? (
            <div style={{ marginTop: "12px" }}>
              <Banner tone="success">{noticeText}</Banner>
            </div>
          ) : null}
        </Section>

        <Section
          title="Your recurring items"
          description="Sorted by monthly cost in your base currency."
        >
          {isLoading ? (
            <p style={mutedText}>Loading...</p>
          ) : sortedItems.length === 0 ? (
            <EmptyState
              title="No recurring items yet"
              description="Add your first subscription or recurring bill above. It will be saved to Firestore."
            />
          ) : (
            <div style={{ display: "grid", gap: "10px" }}>
              {sortedItems.map((item) => {
                const monthlyInBase = sumMoney(
                  [
                    {
                      amount: monthlyFromFrequency(item.amount, item.frequency),
                      currency: item.currency,
                    },
                  ],
                  baseCurrency,
                  DEFAULT_RATES,
                );
                const annualInBase = sumMoney(
                  [
                    {
                      amount: annualizeAmount(item.amount, item.frequency),
                      currency: item.currency,
                    },
                  ],
                  baseCurrency,
                  DEFAULT_RATES,
                );
                const isPaused = item.status === "paused";

                return (
                  <div
                    key={item.id}
                    style={{
                      ...rowStyle,
                      opacity: isPaused ? 0.6 : 1,
                    }}
                  >
                    <div style={{ display: "grid", gap: "4px", minWidth: 0 }}>
                      <Stack direction="row" gap={8} align="center" wrap>
                        <strong style={{ color: "#111827" }}>{item.name}</strong>
                        <Pill tone={isPaused ? "warning" : "success"}>
                          {isPaused ? "Paused" : "Active"}
                        </Pill>
                        <Pill tone="info">{frequencyLabel(item.frequency)}</Pill>
                      </Stack>
                      <span style={mutedText}>
                        {formatMoney({ amount: item.amount, currency: item.currency })}{" "}
                        ({item.currency}) · ≈ {formatMoney(monthlyInBase)} / month · ≈{" "}
                        {formatMoney(annualInBase)} / year
                      </span>
                    </div>

                    <Stack direction="row" gap={6} align="flex-start">
                      <button
                        onClick={() => toggleStatus(item)}
                        style={secondaryBtn}
                        disabled={busyId === item.id}
                      >
                        {busyId === item.id ? "..." : isPaused ? "Resume" : "Pause"}
                      </button>
                      <button
                        onClick={() => removeItem(item)}
                        style={dangerBtn}
                        disabled={busyId === item.id}
                      >
                        {busyId === item.id ? "..." : "Remove"}
                      </button>
                    </Stack>
                  </div>
                );
              })}
            </div>
          )}
        </Section>

        <details style={legacyDetails}>
          <summary style={legacySummary}>
            Legacy <code>formatCurrency</code> for active total
          </summary>
          <p style={legacyBody}>
            <code>formatCurrency</code> from <code>@repo/utils</code> (USD-only)
            on the monthly total: <strong>{formatCurrency(monthlyTotal.amount)}</strong>.
            For multi-currency display we use <code>formatMoney</code> from{" "}
            <code>@repo/money</code> instead.
          </p>
        </details>
      </Card>
    </div>
  );
}

const baseRow = {
  marginTop: "12px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  flexWrap: "wrap",
};

const fieldLabel = {
  fontSize: "12px",
  color: "#6b7280",
};

const selectStyle = {
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  backgroundColor: "#f9fafb",
  fontSize: "14px",
  outline: "none",
};

const summaryGrid = {
  marginTop: "16px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "10px",
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "10px",
  alignItems: "center",
};

const mutedText = {
  color: "#6b7280",
  fontSize: "13px",
};

const rowStyle = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  gap: "10px",
  padding: "12px",
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  backgroundColor: "#ffffff",
};

const secondaryBtn = {
  padding: "6px 10px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  backgroundColor: "#ffffff",
  color: "#111827",
  cursor: "pointer",
  fontSize: "13px",
};

const dangerBtn = {
  padding: "6px 10px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#b91c1c",
  color: "#ffffff",
  cursor: "pointer",
  fontSize: "13px",
};

const legacyDetails = {
  marginTop: "20px",
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
