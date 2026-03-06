// src/pages/Dashboard.jsx
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Icon from "../components/Icon";
import { AUDIT_LOGS, CHART_DATA, SYSTEM_STATUS } from "../utils/mockData";

/* ══════════════════════════════════════════════
   DASHBOARD PAGE
══════════════════════════════════════════════ */
const Dashboard = ({ user, onLogout }) => {
  const [page, setPage] = useState("dashboard");

  const now      = new Date();
  const hour     = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const STATS = [
    { label: "Total Encryptions", val: "1,284", icon: "lock",   color: "#10b981", sub: "+12% this week" },
    { label: "Total Decryptions", val: "962",   icon: "unlock", color: "#0ea5e9", sub: "+8% this week"  },
    { label: "Files Secured",     val: "347",   icon: "file",   color: "#a78bfa", sub: "23 added today" },
    { label: "Emails Sent",       val: "89",    icon: "mail",   color: "#fbbf24", sub: "4 pending"      },
  ];

  const maxVal = Math.max(...CHART_DATA.map(b => b.enc + b.dec));

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#060910" }}>
      <Sidebar page={page} setPage={setPage} user={user} onLogout={onLogout} />

      <main style={{ flex: 1, overflowY: "auto" }}>
        {/* ── Only dashboard content shown; other pages show placeholder ── */}
        {page === "dashboard" ? (
          <div className="fade-up" style={{ padding: "32px 36px" }}>

            {/* Header */}
            <div style={{ marginBottom: 32 }}>
              <p className="mono" style={{ fontSize: 11, color: "#334155", letterSpacing: "0.14em", marginBottom: 6 }}>
                {now.toDateString().toUpperCase()} · ALL SYSTEMS OPERATIONAL
              </p>
              <h2 style={{ fontSize: 26, fontWeight: 900, color: "#f1f5f9" }}>
                {greeting},{" "}
                <span style={{
                  background: "linear-gradient(135deg,#10b981,#0ea5e9)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  {user.name}
                </span>{" "}
                <span>👋</span>
              </h2>
              <p style={{ fontSize: 14, color: "#475569", marginTop: 4 }}>
                Here's what's happening with your encryption activity.
              </p>
            </div>

            {/* Stat Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
              {STATS.map((s, i) => (
                <div key={i} style={{
                  background: "linear-gradient(145deg,#0d1421,#0a1628)",
                  border: "1px solid #1e2d40", borderRadius: 16,
                  padding: "20px 20px 16px", position: "relative", overflow: "hidden",
                }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${s.color},${s.color}44)`, borderRadius: "16px 16px 0 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: s.color + "1a", border: `1px solid ${s.color}33`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon n={s.icon} s={18} c={s.color} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 20, background: s.color + "15" }}>
                      <Icon n="trend" s={10} c={s.color} />
                      <span className="mono" style={{ fontSize: 10, color: s.color, fontWeight: 700 }}>↑</span>
                    </div>
                  </div>
                  <div className="mono" style={{ fontSize: 30, fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: 4 }}>{s.val}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4 }}>{s.label}</div>
                  <div className="mono" style={{ fontSize: 10, color: s.color + "99" }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Chart + System Status Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, marginBottom: 24 }}>

              {/* Weekly Bar Chart */}
              <div style={{ background: "#0d1421", border: "1px solid #1e2d40", borderRadius: 16, padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", marginBottom: 4 }}>
                      WEEKLY OPERATIONS
                    </h3>
                    <p className="mono" style={{ fontSize: 11, color: "#334155" }}>Encrypt vs Decrypt · Last 7 days</p>
                  </div>
                  <div style={{ display: "flex", gap: 14 }}>
                    {[{ c: "#10b981", l: "Encrypt" }, { c: "#0ea5e9", l: "Decrypt" }].map((x, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 10, height: 10, borderRadius: 2, background: x.c }} />
                        <span style={{ fontSize: 11, color: "#475569" }}>{x.l}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 140 }}>
                  {CHART_DATA.map((b, i) => {
                    const encH = Math.round((b.enc / maxVal) * 120);
                    const decH = Math.round((b.dec / maxVal) * 120);
                    return (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end" }}>
                        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, width: "100%" }}>
                          <div style={{ flex: 1, height: encH, background: "linear-gradient(180deg,#10b981,#10b98166)", borderRadius: "4px 4px 0 0", minHeight: 4 }} />
                          <div style={{ flex: 1, height: decH, background: "linear-gradient(180deg,#0ea5e9,#0ea5e966)", borderRadius: "4px 4px 0 0", minHeight: 4 }} />
                        </div>
                        <span className="mono" style={{ fontSize: 9, color: "#334155", letterSpacing: "0.04em" }}>
                          {b.day.toUpperCase()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* System Status */}
              <div style={{ background: "#0d1421", border: "1px solid #1e2d40", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em" }}>
                  SYSTEM STATUS
                </h3>
                {SYSTEM_STATUS.map((s, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                      <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>{s.label}</span>
                      <span className="mono" style={{ fontSize: 10, color: s.color, fontWeight: 700 }}>{s.status}</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 4, background: "#1e2d40", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${s.pct}%`, background: s.color, borderRadius: 4, transition: "width .8s ease" }} />
                    </div>
                    <div className="mono" style={{ fontSize: 9, color: "#334155", marginTop: 3, textAlign: "right" }}>
                      {s.pct}% uptime
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Table */}
            <div style={{ background: "#0d1421", border: "1px solid #1e2d40", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "18px 24px", borderBottom: "1px solid #0f1e2e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", marginBottom: 2 }}>
                    RECENT ACTIVITY
                  </h3>
                  <p className="mono" style={{ fontSize: 10, color: "#334155" }}>Live audit trail</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 20, background: "#052e16", border: "1px solid #10b98133" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "pulse 1.5s ease infinite" }} />
                  <span className="mono" style={{ fontSize: 10, color: "#10b981", fontWeight: 700 }}>LIVE</span>
                </div>
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#060910" }}>
                    {["#", "User", "Operation", "Module", "Time", "Status"].map(h => (
                      <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 10, color: "#334155", fontWeight: 700, letterSpacing: "0.12em", borderBottom: "1px solid #0f1e2e" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {AUDIT_LOGS.map(log => (
                    <tr
                      key={log.id}
                      style={{ borderBottom: "1px solid #0a1628", transition: "background .15s", cursor: "default" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#0d1e30"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <td style={{ padding: "13px 20px" }}>
                        <span className="mono" style={{ fontSize: 11, color: "#1e3a5f" }}>{log.id}</span>
                      </td>
                      <td style={{ padding: "13px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#10b98120", border: "1px solid #10b98140", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Icon n="user" s={13} c="#10b981" />
                          </div>
                          <span style={{ fontSize: 13, color: "#94a3b8" }}>{log.user}</span>
                        </div>
                      </td>
                      <td style={{ padding: "13px 20px" }}>
                        <span className="mono" style={{
                          fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 700,
                          background: log.op === "ENCRYPT" ? "#052e16" : "#1c1708",
                          color: log.op === "ENCRYPT" ? "#4ade80" : "#fbbf24",
                        }}>
                          {log.op}
                        </span>
                      </td>
                      <td style={{ padding: "13px 20px", fontSize: 12, color: "#64748b" }}>{log.type}</td>
                      <td style={{ padding: "13px 20px" }}>
                        <span className="mono" style={{ fontSize: 11, color: "#334155" }}>{log.time}</span>
                      </td>
                      <td style={{ padding: "13px 20px" }}>
                        <span className="mono" style={{
                          fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 700,
                          background: log.status === "success" ? "#052e16" : "#2d0d0d",
                          color: log.status === "success" ? "#34d399" : "#f87171",
                        }}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ padding: "12px 24px", borderTop: "1px solid #0f1e2e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="mono" style={{ fontSize: 10, color: "#334155" }}>
                  Showing {AUDIT_LOGS.length} of {AUDIT_LOGS.length} records
                </span>
                <button style={{ background: "none", border: "1px solid #1e3a5f", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 12, color: "#64748b", fontFamily: "'Outfit',sans-serif" }}>
                  View all logs →
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Placeholder for other pages */
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "100vh" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
              <p style={{ fontSize: 18, fontWeight: 700, color: "#334155" }}>
                {[
                  { id: "text",     label: "Text Crypto"  },
                  { id: "files",    label: "File Manager" },
                  { id: "email",    label: "Secure Email" },
                  { id: "database", label: "DB Export"    },
                  { id: "reports",  label: "Reports"      },
                ].find(n => n.id === page)?.label} — Coming Soon
              </p>
              <p className="mono" style={{ fontSize: 12, color: "#1e3a5f", marginTop: 8 }}>
                Navigate to Dashboard to see live data
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
