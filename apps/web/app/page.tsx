import Link from "next/link";

export default function Home() {
  return (
    <div style={{ textAlign: "center" }}>
      {/* HERO */}
      <section style={{ padding: "60px 20px" }}>
        <h1 style={{ fontSize: "38px", color: "#111827" }}>
          Manage Your Money Smarter
        </h1>

        <p style={{ color: "#6b7280", marginTop: "10px" }}>
          Track expenses, manage budgets, and understand your spending clearly
        </p>
      </section>

      {/* FEATURE CARDS */}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          flexWrap: "wrap",
          paddingBottom: "60px",
        }}
      >
        {/* Expense */}
        <div style={card}>
          <h3>💸 Expense Tracker</h3>
          <p style={text}>Track your daily spending easily</p>

          <Link href="/expense">
            <button style={button}>Open</button>
          </Link>
        </div>

        {/* Budget */}
        <div style={card}>
          <h3>💰 Budget Planner</h3>
          <p style={text}>Control your monthly budget</p>

          <Link href="/budget">
            <button style={button}>Open</button>
          </Link>
        </div>

        {/* Dashboard */}
        <div style={card}>
          <h3>📊 Dashboard</h3>
          <p style={text}>View insights of your finance</p>

          <Link href="/dashboard">
            <button style={button}>Open</button>
          </Link>
        </div>
      </section>
    </div>
  );
}

/* STYLES */
const card = {
  width: "260px",
  padding: "20px",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
};

const text = {
  fontSize: "13px",
  color: "#6b7280",
};

const button = {
  marginTop: "10px",
  padding: "10px 14px",
  backgroundColor: "#111827",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};