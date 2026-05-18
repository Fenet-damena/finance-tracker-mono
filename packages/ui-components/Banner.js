export function Banner({ children, tone = "info", title }) {
  const palette = (() => {
    if (tone === "danger") return { bg: "#fee2e2", fg: "#991b1b", border: "#fecaca" };
    if (tone === "warning") return { bg: "#fef3c7", fg: "#92400e", border: "#fde68a" };
    if (tone === "success") return { bg: "#dcfce7", fg: "#166534", border: "#bbf7d0" };
    return { bg: "#dbeafe", fg: "#1e40af", border: "#bfdbfe" };
  })();

  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      style={{
        padding: "10px 12px",
        backgroundColor: palette.bg,
        color: palette.fg,
        border: `1px solid ${palette.border}`,
        borderRadius: "10px",
        fontSize: "13px",
        lineHeight: 1.5,
      }}
    >
      {title ? (
        <strong style={{ display: "block", marginBottom: "2px" }}>{title}</strong>
      ) : null}
      {children}
    </div>
  );
}
