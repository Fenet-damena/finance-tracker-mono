export function Stack({
  children,
  direction = "column",
  gap = 12,
  align = "stretch",
  justify = "flex-start",
  wrap = false,
  style,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: direction,
        gap: `${gap}px`,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? "wrap" : "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
