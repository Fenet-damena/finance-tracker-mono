export function Card({ children }) {
  return (
    <div
      style={{
        maxWidth: "480px",
        margin: "40px auto",
        padding: "24px",
        borderRadius: "16px",
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        fontFamily: "system-ui",
      }}
    >
      {children}
    </div>
  );
}