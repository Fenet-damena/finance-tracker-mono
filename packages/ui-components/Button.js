export function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 14px",
        width: "100%",
        backgroundColor: "#1f2937",
        color: "#ffffff",
        border: "1px solid #374151",
        borderRadius: "10px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "0.2s",
      }}
      onMouseOver={(e) => (e.target.style.backgroundColor = "#111827")}
      onMouseOut={(e) => (e.target.style.backgroundColor = "#1f2937")}
    >
      {children}
    </button>
  );
}