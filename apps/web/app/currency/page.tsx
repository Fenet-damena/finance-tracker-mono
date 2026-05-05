"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, auth } from "../../lib/auth";
import CurrencyFeature from "feature-currency";
import { ALL_CURRENCY_CODES, DEFAULT_RATES_AS_OF_MS } from "@repo/money";

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/auth");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [router]);

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const ratesAsOf = new Date(DEFAULT_RATES_AS_OF_MS).toISOString().slice(0, 10);

  return (
    <div>
      <div style={appBadgeRow}>
        <span style={appBadge}>
          {ALL_CURRENCY_CODES.length} currencies supported &middot; rates as of{" "}
          {ratesAsOf}
        </span>
      </div>

      <CurrencyFeature />
    </div>
  );
}

const appBadgeRow = {
  display: "flex",
  justifyContent: "flex-end",
  padding: "10px 20px 0",
};

const appBadge = {
  fontSize: "12px",
  color: "#374151",
  backgroundColor: "#e5e7eb",
  padding: "4px 10px",
  borderRadius: "999px",
};
