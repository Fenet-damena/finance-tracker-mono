export function Section({ title, description, action, children }) {
  return (
    <section style={{ marginTop: "20px" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "10px",
        }}
      >
        <div>
          {title ? (
            <h3 style={{ margin: 0, color: "#111827", fontSize: "15px" }}>
              {title}
            </h3>
          ) : null}
          {description ? (
            <p
              style={{
                margin: "4px 0 0",
                color: "#6b7280",
                fontSize: "13px",
              }}
            >
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div>{action}</div> : null}
      </header>

      <div>{children}</div>
    </section>
  );
}
