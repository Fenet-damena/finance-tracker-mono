export function Input(props) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        padding: "11px",
        margin: "6px 0",
        borderRadius: "10px",
        border: "1px solid #d1d5db",
        fontSize: "14px",
        outline: "none",
        backgroundColor: "#f9fafb",
      }}
    />
  );
}