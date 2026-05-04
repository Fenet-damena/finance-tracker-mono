"use client";

import { useCallback, useEffect, useState } from "react";
import { db } from "../../apps/web/lib/firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

const REQUEST_TIMEOUT_MS = 12000;

function withTimeout(promise, timeoutMs = REQUEST_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error("request-timeout")), timeoutMs);
    }),
  ]);
}

function toUiError(error) {
  if (error?.code === "permission-denied") {
    return "Firestore blocked this write/read. Update your Firestore security rules.";
  }

  if (String(error?.message || "").includes("Database '(default)' not found")) {
    return "Firestore database was not found. Create a Firestore database or set NEXT_PUBLIC_FIRESTORE_DATABASE_ID.";
  }

  if (String(error?.message || "").includes("request-timeout")) {
    return "Request timed out. Check your internet and Firebase project config.";
  }

  return "Could not complete the action. Check Firebase config and try again.";
}

export default function BudgetPage() {
  const [budget, setBudget] = useState("");
  const [saved, setSaved] = useState(0);
  const [loadingAction, setLoadingAction] = useState("idle");
  const [errorText, setErrorText] = useState("");
  const [noticeText, setNoticeText] = useState("");

  const isSaving = loadingAction === "saving";
  const isLoading = loadingAction === "loading";
  const isClearing = loadingAction === "clearing";

  const saveBudget = async () => {
    const parsedBudget = Number(budget);
    if (!budget || Number.isNaN(parsedBudget) || parsedBudget < 0) {
      setErrorText("Please enter a valid budget amount.");
      return;
    }

    setLoadingAction("saving");
    setErrorText("");
    setNoticeText("");

    try {
      await withTimeout(
        setDoc(doc(db, "finance", "main"), {
          budget: parsedBudget,
          updatedAt: serverTimestamp(),
        })
      );

      setSaved(parsedBudget);
      setBudget("");
      setNoticeText("Budget saved to Firebase.");
    } catch (error) {
      console.error("Error saving budget:", error);
      setErrorText(toUiError(error));
    } finally {
      setLoadingAction("idle");
    }
  };

  const loadBudget = useCallback(async () => {
    setLoadingAction("loading");
    setErrorText("");
    setNoticeText("");

    try {
      const snap = await withTimeout(getDoc(doc(db, "finance", "main")));

      if (snap.exists()) {
        const data = snap.data();
        setSaved(Number(data.budget) || 0);
      } else {
        setSaved(0);
        setNoticeText("No saved budget yet.");
      }
    } catch (error) {
      console.error("Error loading budget:", error);
      setErrorText(toUiError(error));
    } finally {
      setLoadingAction("idle");
    }
  }, []);

  const clearBudget = async () => {
    setLoadingAction("clearing");
    setErrorText("");
    setNoticeText("");

    try {
      await withTimeout(
        setDoc(doc(db, "finance", "main"), {
          budget: 0,
          updatedAt: serverTimestamp(),
        })
      );

      setSaved(0);
      setBudget("");
      setNoticeText("Budget cleared.");
    } catch (error) {
      console.error("Error clearing budget:", error);
      setErrorText(toUiError(error));
    } finally {
      setLoadingAction("idle");
    }
  };

  useEffect(() => {
    loadBudget();
  }, [loadBudget]);

  return (
    <div style={container}>
      <h2 style={title}>💰 Budget Planner</h2>

      <input
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        placeholder="Enter budget"
        style={input}
      />

      <div style={buttonGroup}>
        <button onClick={saveBudget} style={button}>
          {isSaving ? "Saving..." : "Save Budget"}
        </button>

        <button onClick={loadBudget} style={buttonSecondary}>
          {isLoading ? "Loading..." : "Load Budget"}
        </button>

        <button onClick={clearBudget} style={buttonDanger}>
          {isClearing ? "Clearing..." : "Clear Budget"}
        </button>
      </div>

      {errorText ? <p style={error}>{errorText}</p> : null}
      {noticeText ? <p style={notice}>{noticeText}</p> : null}

      <div style={card}>
        <h3>Current Budget:</h3>
        <p style={value}>${saved}</p>
        <button onClick={() => setBudget(String(saved))} style={editCurrentButton}>
          Edit Current Budget
        </button>
      </div>
    </div>
  );
}

/* STYLES */
const container = {
  padding: "20px",
  fontFamily: "Arial",
  backgroundColor: "#f9fafb",
  minHeight: "100vh",
};

const title = {
  color: "#111827",
  marginBottom: "20px",
};

const input = {
  padding: "10px",
  width: "250px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
};

const buttonGroup = {
  marginTop: "10px",
  display: "flex",
  gap: "10px",
};

const button = {
  padding: "10px 15px",
  backgroundColor: "#111827",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const buttonSecondary = {
  padding: "10px 15px",
  backgroundColor: "#6b7280",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const buttonDanger = {
  padding: "10px 15px",
  backgroundColor: "#b91c1c",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const card = {
  marginTop: "20px",
  padding: "15px",
  backgroundColor: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
};

const value = {
  fontSize: "22px",
  fontWeight: "bold",
  color: "#111827",
};

const editCurrentButton = {
  marginTop: "10px",
  padding: "8px 12px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  backgroundColor: "#fff",
  color: "#111827",
  cursor: "pointer",
};

const error = {
  marginTop: "12px",
  color: "#991b1b",
  fontSize: "13px",
};

const notice = {
  marginTop: "12px",
  color: "#065f46",
  fontSize: "13px",
};