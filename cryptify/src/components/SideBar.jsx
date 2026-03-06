// src/components/Sidebar.jsx
import Icon from "./Icon";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard",   icon: "grid"   },
  { id: "text",      label: "Text Crypto", icon: "lock"   },
  { id: "files",     label: "File Manager",icon: "file"   },
  { id: "email",     label: "Secure Email",icon: "mail"   },
  { id: "database",  label: "DB Export",   icon: "db"     },
  { id: "reports",   label: "Reports",     icon: "bar"    },
];

const Sidebar = ({ page, setPage, user, onLogout }) => {
  return (
    <aside style={{
      width: 230, minHeight: "100vh",
      background: "#08111c",
      borderRight: "1px solid #0f1e2e",
      display: "flex", flexDirection: "column",
      padding: "20px 10px", flexShrink: 0,
    }}>
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 12px", marginBottom: 28 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "linear-gradient(135deg,#10b981,#0ea5e9)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon n="shield" s={18} c="#fff" />
        </div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 14, letterSpacing: "0.16em", color: "#f1f5f9" }}>CRYPTIFY</div>
          <div className="mono" style={{ fontSize: 9, color: "#1e3a5f", letterSpacing: "0.14em" }}>v1.0.0</div>
        </div>
      </div>

      {/* Nav label */}
      <div className="mono" style={{
        fontSize: 9, color: "#1e3a5f", fontWeight: 700,
        letterSpacing: "0.18em", padding: "0 14px", marginBottom: 8,
      }}>
        MODULES
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_ITEMS.map(n => (
          <button
            key={n.id}
            onClick={() => setPage(n.id)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px", borderRadius: 10,
              border: `1px solid ${page === n.id ? "#10b98133" : "transparent"}`,
              background: page === n.id ? "#0d1e30" : "transparent",
              color: page === n.id ? "#10b981" : "#64748b",
              cursor: "pointer", fontSize: 13, fontWeight: 600,
              textAlign: "left", transition: "all .2s",
            }}
          >
            <Icon n={n.icon} s={16} c={page === n.id ? "#10b981" : "#475569"} />
            {n.label}
            {page === n.id && (
              <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
            )}
          </button>
        ))}
      </nav>

      {/* User footer */}
      <div style={{ borderTop: "1px solid #0f1e2e", paddingTop: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px" }}>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: "#10b98120", border: "1px solid #10b98140",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Icon n="user" s={16} c="#10b981" />
          </div>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#cbd5e1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user.name}
            </div>
            <div className="mono" style={{ fontSize: 10, color: "#334155" }}>Standard User</div>
          </div>
          <button
            onClick={onLogout}
            title="Logout"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 4, display: "flex" }}
          >
            <Icon n="logout" s={15} c="#475569" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
