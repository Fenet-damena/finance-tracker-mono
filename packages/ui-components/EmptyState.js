export function EmptyState({ title = "Nothing here yet", description, action }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "28px 16px",
        backgroundColor: "#f9fafb",
        border: "1px dashed #d1d5db",
        borderRadius: "12px",
        color: "#6b7280",
      }}
    >
      <h4 style={{ margin: 0, color: "#111827", fontSize: "15px" }}>{title}</h4>

      {description ? (
        <p style={{ margin: "6px 0 0", fontSize: "13px" }}>{description}</p>
      ) : null}

      {action ? <div style={{ marginTop: "12px" }}>{action}</div> : null}
    </div>
  );
}
