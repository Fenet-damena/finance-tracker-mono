"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import InsightsFeature from "feature-insights";
import { onAuthStateChanged, auth } from "../../lib/auth";

export default function InsightsPage() {
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

  return <InsightsFeature />;
}
