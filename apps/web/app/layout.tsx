"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "Arial",
          backgroundColor: "#f1f5f9",
        }}
      >
        {/* HEADER */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "15px 30px",
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <h2 style={{ margin: 0, color: "#111827" }}>
            💼 Finance Tracker
          </h2>

          <nav style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Link href="/" style={getLinkStyle(pathname === "/")}>
              Home
            </Link>

            {user && (
              <>
                <Link
                  href="/expense"
                  style={getLinkStyle(pathname === "/expense")}
                >
                  Expense
                </Link>

                <Link
                  href="/budget"
                  style={getLinkStyle(pathname === "/budget")}
                >
                  Budget
                </Link>

                <Link
                  href="/dashboard"
                  style={getLinkStyle(pathname === "/dashboard")}
                >
                  Dashboard
                </Link>

                <Link
                  href="/currency"
                  style={getLinkStyle(pathname === "/currency")}
                >
                  Currency
                </Link>
              </>
            )}

            {!loading && (
              <Link
                href="/auth"
                style={getLinkStyle(pathname === "/auth")}
              >
                {user ? "Account" : "Login"}
              </Link>
            )}
          </nav>
        </header>

        {/* MAIN */}
        <main
          style={{
            padding: "30px",
            minHeight: "calc(100vh - 140px)",
          }}
        >
          {children}
        </main>

        {/* FOOTER */}
        <footer
          style={{
            backgroundColor: "#e5e7eb",
            borderTop: "1px solid #d1d5db",
            padding: "30px 20px",
            marginTop: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              maxWidth: "1000px",
              margin: "0 auto",
            }}
          >
            {/* LEFT */}
            <div>
              <h3 style={{ margin: 0, color: "#111827" }}>
                💼 Finance Tracker
              </h3>
              <p style={{ color: "#6b7280", fontSize: "13px" }}>
                Simple finance tracking system
              </p>
            </div>

            {/* LINKS */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <Link href="/" style={footerLink}>
                Home
              </Link>
              <Link href="/expense" style={footerLink}>
                Expense
              </Link>
              <Link href="/budget" style={footerLink}>
                Budget
              </Link>
              <Link href="/dashboard" style={footerLink}>
                Dashboard
              </Link>
            </div>

            {/* RIGHT */}
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>
                Clean UI • Monorepo System
              </p>
            </div>
          </div>

          {/* BOTTOM */}
          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
              color: "#9ca3af",
              fontSize: "12px",
            }}
          >
            © {new Date().getFullYear()} Finance Tracker
          </div>
        </footer>
      </body>
    </html>
  );
}

/* NAV ACTIVE STYLE */
const getLinkStyle = (active: boolean) => ({
  textDecoration: "none",
  fontSize: "13px",
  padding: "6px 10px",
  borderRadius: "6px",
  color: active ? "#111827" : "#6b7280",
  backgroundColor: active ? "#e5e7eb" : "transparent",
  fontWeight: active ? "600" : "400",
});

/* FOOTER LINKS */
const footerLink = {
  textDecoration: "none",
  color: "#6b7280",
  fontSize: "13px",
};