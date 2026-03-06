// src/components/Field.jsx
import Icon from "./Icon";

const Field = ({ label, type = "text", value, onChange, onBlur, placeholder, error, hint, suffix }) => (
  <div>
    {label && (
      <label style={{
        display: "block", fontSize: 11, fontFamily: "'JetBrains Mono',monospace",
        fontWeight: 700, letterSpacing: "0.08em", color: "#64748b", marginBottom: 6,
      }}>
        {label}
      </label>
    )}
    <div style={{ position: "relative" }}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: suffix ? "11px 44px 11px 14px" : "11px 14px",
          background: "#0a0f1a",
          border: `1px solid ${error ? "#ef444466" : "#1e3a5f"}`,
          borderRadius: 10,
          color: "#e2e8f0",
          fontSize: 13,
          fontFamily: "'JetBrains Mono',monospace",
          outline: "none",
          transition: "border-color .2s, box-shadow .2s",
        }}
        onFocus={e => {
          e.target.style.borderColor = error ? "#ef4444" : "#10b981";
          e.target.style.boxShadow   = error ? "0 0 0 3px #ef444420" : "0 0 0 3px #10b98120";
        }}
        onBlur={onBlur || (e => {
          e.target.style.borderColor = error ? "#ef444466" : "#1e3a5f";
          e.target.style.boxShadow   = "none";
        })}
      />
      {suffix && (
        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }}>
          {suffix}
        </div>
      )}
    </div>

    {error && (
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5 }}>
        <Icon n="x" s={12} c="#ef4444" />
        <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: "#ef4444" }}>
          {error}
        </span>
      </div>
    )}

    {hint && !error && (
      <div style={{ fontSize: 11, fontFamily: "'JetBrains Mono',monospace", color: "#10b981", marginTop: 4 }}>
        {hint}
      </div>
    )}
  </div>
);

export default Field;
