export function StatTile({ label, value, hint, tone = "neutral" }) {
  const accent = (() => {
    if (tone === "danger") return "#dc2626";
    if (tone === "warning") return "#b45309";
    if (tone === "success") return "#15803d";
    if (tone === "info") return "#1d4ed8";
    return "#111827";
  })();

  return (
    <div
      style={{
        padding: "14px 16px",
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        minWidth: 0,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "12px",
          color: "#6b7280",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </p>

      <strong
        style={{
          display: "block",
          marginTop: "6px",
          fontSize: "20px",
          color: accent,
          wordBreak: "break-word",
        }}
      >
        {value}
      </strong>

      {hint ? (
        <p
          style={{
            margin: "4px 0 0",
            fontSize: "12px",
            color: "#6b7280",
          }}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
