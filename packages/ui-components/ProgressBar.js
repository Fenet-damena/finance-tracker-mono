export function ProgressBar({
  value = 0,
  max = 100,
  label,
  tone = "neutral",
  showPercent = true,
}) {
  const safeMax = max > 0 ? max : 1;
  const ratio = Math.max(0, Math.min(1, value / safeMax));
  const percentText = `${Math.round(ratio * 100)}%`;

  const fillColor = (() => {
    if (tone === "danger") return "#dc2626";
    if (tone === "warning") return "#f59e0b";
    if (tone === "success") return "#16a34a";
    if (tone === "info") return "#2563eb";
    return "#4b5563";
  })();

  return (
    <div style={{ width: "100%" }}>
      {label || showPercent ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "12px",
            color: "#6b7280",
            marginBottom: "6px",
          }}
        >
          <span>{label}</span>
          {showPercent ? <span>{percentText}</span> : null}
        </div>
      ) : null}

      <div
        role="progressbar"
        aria-valuenow={Math.round(ratio * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{
          width: "100%",
          height: "10px",
          backgroundColor: "#e5e7eb",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${ratio * 100}%`,
            height: "100%",
            backgroundColor: fillColor,
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}
