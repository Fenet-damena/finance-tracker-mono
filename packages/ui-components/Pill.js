export function Pill({ children, tone = "neutral" }) {
  const palette = (() => {
    if (tone === "danger") return { bg: "#fee2e2", fg: "#991b1b" };
    if (tone === "warning") return { bg: "#fef3c7", fg: "#92400e" };
    if (tone === "success") return { bg: "#dcfce7", fg: "#166534" };
    if (tone === "info") return { bg: "#dbeafe", fg: "#1e40af" };
    return { bg: "#e5e7eb", fg: "#374151" };
  })();

  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        backgroundColor: palette.bg,
        color: palette.fg,
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: "600",
        lineHeight: 1.4,
      }}
    >
      {children}
    </span>
  );
}
