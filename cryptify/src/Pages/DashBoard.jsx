import { useState, useRef } from "react";

// ══════════════════════════════════════════════
//  MOCK DATA
// ══════════════════════════════════════════════
const AUDIT_LOGS = [
  { id: 1, user: "alice@corp.com", op: "ENCRYPT", type: "Text",  time: "2026-03-06 09:12", status: "success" },
  { id: 2, user: "bob@corp.com",   op: "DECRYPT", type: "File",  time: "2026-03-06 09:34", status: "success" },
  { id: 3, user: "alice@corp.com", op: "ENCRYPT", type: "Email", time: "2026-03-06 10:01", status: "success" },
  { id: 4, user: "carol@corp.com", op: "ENCRYPT", type: "File",  time: "2026-03-06 10:22", status: "fail"    },
  { id: 5, user: "bob@corp.com",   op: "DECRYPT", type: "Excel", time: "2026-03-06 10:55", status: "success" },
  { id: 6, user: "alice@corp.com", op: "ENCRYPT", type: "Text",  time: "2026-03-06 11:10", status: "success" },
];

const CHART_DATA = [
  { day: "Mon", enc: 180, dec: 120 },
  { day: "Tue", enc: 220, dec: 145 },
  { day: "Wed", enc: 195, dec: 160 },
  { day: "Thu", enc: 310, dec: 210 },
  { day: "Fri", enc: 275, dec: 190 },
  { day: "Sat", enc: 140, dec: 95  },
  { day: "Sun", enc: 165, dec: 110 },
];

const SYSTEM_STATUS = [
  { label: "Encryption Engine", status: "Operational", color: "#10b981", pct: 99 },
  { label: "File Storage",       status: "Operational", color: "#10b981", pct: 97 },
  { label: "Email Gateway",      status: "Operational", color: "#10b981", pct: 94 },
  { label: "DB Export Service",  status: "Degraded",    color: "#fbbf24", pct: 72 },
  { label: "Audit Logger",       status: "Operational", color: "#10b981", pct: 100},
];

const MOCK_FILES = [
  { id: 1, name: "financial_report_Q4.pdf",  size: "2.4 MB", type: "PDF",  status: "encrypted", algo: "AES-256-GCM", date: "2026-03-06", decryptedAt: null },
  { id: 2, name: "employee_data.xlsx",        size: "1.1 MB", type: "XLSX", status: "encrypted", algo: "ChaCha20",    date: "2026-03-05", decryptedAt: null },
  { id: 3, name: "project_brief.docx",        size: "0.3 MB", type: "DOCX", status: "plain",     algo: null,         date: "2026-03-05", decryptedAt: null },
  { id: 4, name: "backup_keys.zip",           size: "0.8 MB", type: "ZIP",  status: "encrypted", algo: "AES-256-GCM", date: "2026-03-04", decryptedAt: null },
  { id: 5, name: "audit_trail_march.csv",     size: "5.2 MB", type: "CSV",  status: "plain",     algo: null,         date: "2026-03-04", decryptedAt: null },
  { id: 6, name: "server_config.json",        size: "0.1 MB", type: "JSON", status: "encrypted", algo: "XOR-Base64", date: "2026-03-03", decryptedAt: null },
  { id: 7, name: "client_contracts.pdf",      size: "3.7 MB", type: "PDF",  status: "decrypted", algo: "AES-256-GCM", date: "2026-03-02", decryptedAt: "09:14:32" },
  { id: 8, name: "system_keys_backup.zip",    size: "0.5 MB", type: "ZIP",  status: "decrypted", algo: "ChaCha20",   date: "2026-03-01", decryptedAt: "14:22:11" },
];

const MOCK_EMAILS = [
  { id: 1, to: "bob@corp.com",    subject: "Encrypted Report Q4",    algo: "AES-256-GCM", status: "sent",    time: "09:12", read: true  },
  { id: 2, to: "carol@corp.com",  subject: "Secure Key Exchange",    algo: "RSA-2048",    status: "sent",    time: "10:34", read: true  },
  { id: 3, to: "dave@corp.com",   subject: "Confidential Memo",      algo: "AES-256-GCM", status: "pending", time: "11:01", read: false },
  { id: 4, to: "team@corp.com",   subject: "System Alert: Degraded", algo: "ChaCha20",    status: "sent",    time: "11:45", read: true  },
];

const MOCK_TABLES = [
  { name: "users",           rows: 1284, size: "2.1 MB", encrypted: true  },
  { name: "audit_logs",      rows: 9462, size: "8.7 MB", encrypted: false },
  { name: "encryption_keys", rows: 48,   size: "0.3 MB", encrypted: true  },
  { name: "email_templates", rows: 12,   size: "0.1 MB", encrypted: false },
  { name: "file_metadata",   rows: 347,  size: "1.4 MB", encrypted: true  },
  { name: "reports",         rows: 203,  size: "0.9 MB", encrypted: false },
];

const MONTHLY_TREND = [
  { month: "SEP", enc: 3200, dec: 2100 }, { month: "OCT", enc: 3900, dec: 2600 },
  { month: "NOV", enc: 4200, dec: 2900 }, { month: "DEC", enc: 3700, dec: 2400 },
  { month: "JAN", enc: 4800, dec: 3200 }, { month: "FEB", enc: 5100, dec: 3500 },
  { month: "MAR", enc: 5600, dec: 3800 },
];

// ══════════════════════════════════════════════
//  ICON COMPONENT
// ══════════════════════════════════════════════
const Icon = ({ n, s = 16, c = "currentColor" }) => {
  const icons = {
    lock:     <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />,
    unlock:   <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75M3.75 21.75h16.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />,
    file:     <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />,
    mail:     <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />,
    db:       <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />,
    chart:    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zm9.75-6.75c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v13.5c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V6.375zm-4.5 6c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v7.5c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 018.25 19.875v-7.5z" />,
    user:     <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />,
    logout:   <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />,
    eye:      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />,
    eyeoff:   <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />,
    dash:     <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />,
    upload:   <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />,
    download: <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />,
    trash:    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />,
    send:     <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />,
    plus:     <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />,
    shield:   <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />,
    key:      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />,
    close:    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
    search:   <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />,
    refresh:  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />,
    inbox:    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z" />,
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8}>
      {icons[n] || null}
    </svg>
  );
};

// ══════════════════════════════════════════════
//  SIDEBAR
// ══════════════════════════════════════════════
const NAV = [
  { id: "dashboard", label: "Dashboard",    icon: "dash"  },
  { id: "text",      label: "Text Crypto",  icon: "key"   },
  { id: "files",     label: "File Manager", icon: "file"  },
  { id: "email",     label: "Secure Email", icon: "mail"  },
  { id: "database",  label: "DB Export",    icon: "db"    },
  { id: "reports",   label: "Reports",      icon: "chart" },
];

const Sidebar = ({ page, setPage, user, onLogout }) => (
  <aside style={{ width: 220, minWidth: 220, background: "#060d18", borderRight: "1px solid #0f1e2e", display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0 }}>
    {/* Logo */}
    <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid #0f1e2e" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg,#065f46,#10b981)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon n="shield" s={20} c="#fff" />
        </div>
        <div>
          <div style={{ fontFamily: "'Courier New',monospace", fontSize: 14, fontWeight: 900, letterSpacing: 3, color: "#f1f5f9" }}>CRYPTIFY</div>
          <div style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#1e3a5f", letterSpacing: 1 }}>v1.0.0</div>
        </div>
      </div>
    </div>

    {/* Nav */}
    <nav style={{ flex: 1, padding: "16px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
      <div style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#1e3a5f", letterSpacing: 3, padding: "0 10px 10px" }}>MODULES</div>
      {NAV.map((item) => {
        const active = page === item.id;
        return (
          <button key={item.id} onClick={() => setPage(item.id)} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
            borderRadius: 10, border: "none", cursor: "pointer", width: "100%", textAlign: "left",
            background: active ? "linear-gradient(135deg,#052e1699,#065f4633)" : "transparent",
            color: active ? "#10b981" : "#334155",
            transition: "all .15s",
          }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#0a1628"; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
          >
            <Icon n={item.icon} s={16} c={active ? "#10b981" : "#334155"} />
            <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, fontFamily: "'Outfit',sans-serif" }}>{item.label}</span>
            {active && <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: 3, background: "#10b981" }} />}
          </button>
        );
      })}
    </nav>

    {/* User */}
    <div style={{ padding: "14px 14px", borderTop: "1px solid #0f1e2e" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#065f46,#10b981)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 14, color: "#fff", fontFamily: "'Courier New',monospace" }}>
          {(user?.name || "A")[0].toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", fontFamily: "'Outfit',sans-serif" }}>{user?.name || "Arpita"}</div>
          <div style={{ fontSize: 10, color: "#1e3a5f", fontFamily: "'Courier New',monospace" }}>Standard User</div>
        </div>
      </div>
      <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 10px", background: "#0a1628", border: "1px solid #0f1e2e", borderRadius: 8, cursor: "pointer", color: "#475569" }}>
        <Icon n="logout" s={14} c="#475569" />
        <span style={{ fontSize: 12, fontFamily: "'Outfit',sans-serif" }}>Sign Out</span>
      </button>
    </div>
  </aside>
);

// ══════════════════════════════════════════════
//  DASHBOARD PAGE
// ══════════════════════════════════════════════
const DashboardPage = ({ user }) => {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const maxVal = Math.max(...CHART_DATA.map(b => b.enc + b.dec));

  const STATS = [
    { label: "Total Encryptions", val: "1,284", icon: "lock",   color: "#10b981", sub: "+12% this week" },
    { label: "Total Decryptions", val: "962",   icon: "unlock", color: "#0ea5e9", sub: "+8% this week"  },
    { label: "Files Secured",     val: "347",   icon: "file",   color: "#a78bfa", sub: "23 added today" },
    { label: "Emails Sent",       val: "89",    icon: "mail",   color: "#fbbf24", sub: "4 pending"      },
  ];

  return (
    <div style={{ padding: "32px 36px" }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontFamily: "'Courier New',monospace", fontSize: 11, color: "#334155", letterSpacing: "0.14em", marginBottom: 6 }}>
          {now.toDateString().toUpperCase()} · ALL SYSTEMS OPERATIONAL
        </p>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: "#f1f5f9", fontFamily: "'Outfit',sans-serif" }}>
          {greeting},{" "}
          <span style={{ background: "linear-gradient(135deg,#10b981,#0ea5e9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {user?.name || "Arpita"}
          </span>{" "}👋
        </h2>
        <p style={{ fontSize: 14, color: "#475569", marginTop: 4, fontFamily: "'Outfit',sans-serif" }}>Here's what's happening with your encryption activity.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
        {STATS.map((s, i) => (
          <div key={i} style={{ background: "linear-gradient(145deg,#0d1421,#0a1628)", border: "1px solid #1e2d40", borderRadius: 16, padding: "20px 20px 16px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${s.color},${s.color}44)`, borderRadius: "16px 16px 0 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: s.color + "1a", border: `1px solid ${s.color}33`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon n={s.icon} s={18} c={s.color} />
              </div>
              <div style={{ padding: "3px 8px", borderRadius: 20, background: s.color + "15" }}>
                <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: s.color, fontWeight: 700 }}>↑</span>
              </div>
            </div>
            <div style={{ fontFamily: "'Courier New',monospace", fontSize: 30, fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: 4 }}>{s.val}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4, fontFamily: "'Outfit',sans-serif" }}>{s.label}</div>
            <div style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: s.color + "99" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart + System Status */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, marginBottom: 24 }}>
        <div style={{ background: "#0d1421", border: "1px solid #1e2d40", borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", marginBottom: 4, fontFamily: "'Outfit',sans-serif" }}>WEEKLY OPERATIONS</h3>
              <p style={{ fontFamily: "'Courier New',monospace", fontSize: 11, color: "#334155" }}>Encrypt vs Decrypt · Last 7 days</p>
            </div>
            <div style={{ display: "flex", gap: 14 }}>
              {[{ c: "#10b981", l: "Encrypt" }, { c: "#0ea5e9", l: "Decrypt" }].map((x, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: x.c }} />
                  <span style={{ fontSize: 11, color: "#475569", fontFamily: "'Outfit',sans-serif" }}>{x.l}</span>
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
                  <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#334155", letterSpacing: "0.04em" }}>{b.day.toUpperCase()}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ background: "#0d1421", border: "1px solid #1e2d40", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", fontFamily: "'Outfit',sans-serif" }}>SYSTEM STATUS</h3>
          {SYSTEM_STATUS.map((s, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, fontFamily: "'Outfit',sans-serif" }}>{s.label}</span>
                <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: s.color, fontWeight: 700 }}>{s.status}</span>
              </div>
              <div style={{ height: 4, borderRadius: 4, background: "#1e2d40", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${s.pct}%`, background: s.color, borderRadius: 4 }} />
              </div>
              <div style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#334155", marginTop: 3, textAlign: "right" }}>{s.pct}% uptime</div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Logs */}
      <div style={{ background: "#0d1421", border: "1px solid #1e2d40", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #0f1e2e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", marginBottom: 2, fontFamily: "'Outfit',sans-serif" }}>RECENT ACTIVITY</h3>
            <p style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: "#334155" }}>Live audit trail</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 20, background: "#052e16", border: "1px solid #10b98133" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
            <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: "#10b981", fontWeight: 700 }}>LIVE</span>
          </div>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#060910" }}>
              {["#", "User", "Operation", "Module", "Time", "Status"].map(h => (
                <th key={h} style={{ padding: "10px 20px", textAlign: "left", fontSize: 10, color: "#334155", fontWeight: 700, letterSpacing: "0.12em", borderBottom: "1px solid #0f1e2e", fontFamily: "'Courier New',monospace" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {AUDIT_LOGS.map(log => (
              <tr key={log.id} style={{ borderBottom: "1px solid #0a1628" }}
                onMouseEnter={e => e.currentTarget.style.background = "#0d1e30"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "13px 20px" }}><span style={{ fontFamily: "'Courier New',monospace", fontSize: 11, color: "#1e3a5f" }}>{log.id}</span></td>
                <td style={{ padding: "13px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#10b98120", border: "1px solid #10b98140", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon n="user" s={13} c="#10b981" />
                    </div>
                    <span style={{ fontSize: 13, color: "#94a3b8", fontFamily: "'Outfit',sans-serif" }}>{log.user}</span>
                  </div>
                </td>
                <td style={{ padding: "13px 20px" }}>
                  <span style={{ fontFamily: "'Courier New',monospace", fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 700, background: log.op === "ENCRYPT" ? "#052e16" : "#1c1708", color: log.op === "ENCRYPT" ? "#4ade80" : "#fbbf24" }}>{log.op}</span>
                </td>
                <td style={{ padding: "13px 20px", fontSize: 12, color: "#64748b", fontFamily: "'Outfit',sans-serif" }}>{log.type}</td>
                <td style={{ padding: "13px 20px" }}><span style={{ fontFamily: "'Courier New',monospace", fontSize: 11, color: "#334155" }}>{log.time}</span></td>
                <td style={{ padding: "13px 20px" }}>
                  <span style={{ fontFamily: "'Courier New',monospace", fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 700, background: log.status === "success" ? "#052e16" : "#2d0d0d", color: log.status === "success" ? "#34d399" : "#f87171" }}>{log.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: "12px 24px", borderTop: "1px solid #0f1e2e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: "#334155" }}>Showing {AUDIT_LOGS.length} of {AUDIT_LOGS.length} records</span>
          <button style={{ background: "none", border: "1px solid #1e3a5f", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 12, color: "#64748b", fontFamily: "'Outfit',sans-serif" }}>View all logs →</button>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════
//  TEXT CRYPTO PAGE
// ══════════════════════════════════════════════
const TextCryptoPage = () => {
  const [mode, setMode] = useState("encrypt");
  const [algo, setAlgo] = useState("AES-256-GCM");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const xorEncode = (text, key) => {
    const k = key || "default";
    return btoa(text.split("").map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ k.charCodeAt(i % k.length))).join(""));
  };
  const xorDecode = (b64, key) => {
    try {
      const k = key || "default";
      return atob(b64).split("").map((c, i) => String.fromCharCode(c.charCodeAt(0) ^ k.charCodeAt(i % k.length))).join("");
    } catch { return "Invalid ciphertext"; }
  };
  const rot13 = (t) => t.replace(/[a-zA-Z]/g, c => String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26));

  const process = () => {
    if (!input.trim()) { showToast("Enter some text first."); return; }
    let result = "";
    if (algo === "XOR-Base64") result = mode === "encrypt" ? xorEncode(input, secretKey) : xorDecode(input, secretKey);
    else if (algo === "ChaCha20") result = mode === "encrypt" ? rot13(btoa(input)) : atob(rot13(input));
    else result = mode === "encrypt" ? btoa(input.split("").map((c,i)=>String.fromCharCode(c.charCodeAt(0)+(i%7)+1)).join("")) : input.split("").map((c,i)=>String.fromCharCode(c.charCodeAt(0)-(i%7)-1)).join("");
    setOutput(result);
    showToast(`Text ${mode}ed successfully!`);
  };

  const ALGOS = ["AES-256-GCM", "ChaCha20", "XOR-Base64"];

  return (
    <div style={{ padding: "32px 36px" }}>
      <p style={{ fontFamily: "'Courier New',monospace", fontSize: 11, color: "#334155", letterSpacing: "0.14em", marginBottom: 8 }}>CRYPTIFY · TEXT CRYPTOGRAPHY MODULE</p>
      <h2 style={{ fontSize: 24, fontWeight: 900, color: "#f1f5f9", marginBottom: 4, fontFamily: "'Outfit',sans-serif" }}>Text <span style={{ color: "#10b981" }}>Crypto</span></h2>
      <p style={{ fontSize: 13, color: "#475569", marginBottom: 28, fontFamily: "'Outfit',sans-serif" }}>Encrypt or decrypt plain text using your chosen algorithm and secret key.</p>

      {/* Mode + Algo */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ display: "flex", background: "#0d1421", border: "1px solid #1e2d40", borderRadius: 10, padding: 4, gap: 4 }}>
          {["encrypt", "decrypt"].map(m => (
            <button key={m} onClick={() => { setMode(m); setInput(""); setOutput(""); }} style={{ padding: "8px 24px", borderRadius: 7, border: "none", cursor: "pointer", fontFamily: "'Courier New',monospace", fontSize: 11, fontWeight: 700, letterSpacing: 1, background: mode === m ? (m === "encrypt" ? "linear-gradient(135deg,#065f46,#10b981)" : "linear-gradient(135deg,#1e3a5f,#0ea5e9)") : "transparent", color: mode === m ? "#fff" : "#334155" }}>
              <Icon n={m === "encrypt" ? "lock" : "unlock"} s={12} c={mode === m ? "#fff" : "#334155"} /> {m.toUpperCase()}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: "#334155", alignSelf: "center" }}>ALGORITHM:</span>
          {ALGOS.map(a => (
            <button key={a} onClick={() => setAlgo(a)} style={{ padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "'Courier New',monospace", fontSize: 10, fontWeight: 700, background: algo === a ? "#10b981" : "#0d1421", color: algo === a ? "#000" : "#334155", border: algo === a ? "none" : "1px solid #1e2d40" }}>{a}</button>
          ))}
        </div>
      </div>

      {/* Text Areas */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, marginBottom: 16, alignItems: "center" }}>
        <div style={{ background: "#0d1421", border: "1px solid #1e2d40", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "10px 14px", borderBottom: "1px solid #0f1e2e", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: "#334155", letterSpacing: 2 }}>{mode === "encrypt" ? "PLAINTEXT INPUT" : "CIPHERTEXT INPUT"}</span>
            <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: "#334155" }}>{input.length}/10,000</span>
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={`Paste or type your ${mode === "encrypt" ? "plaintext" : "ciphertext"} here...`}
            style={{ width: "100%", minHeight: 220, background: "transparent", border: "none", outline: "none", color: "#94a3b8", padding: "14px", fontSize: 13, resize: "vertical", fontFamily: "'Outfit',sans-serif", boxSizing: "border-box" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
          <button onClick={process} style={{ width: 48, height: 48, borderRadius: "50%", border: "none", cursor: "pointer", background: output ? "linear-gradient(135deg,#10b981,#0ea5e9)" : "#0d1421", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #1e2d40" }}>
            <Icon n={mode === "encrypt" ? "lock" : "unlock"} s={20} c={output ? "#fff" : "#334155"} />
          </button>
          <button onClick={() => { setInput(output); setOutput(""); setMode(m => m === "encrypt" ? "decrypt" : "encrypt"); }} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #1e2d40", cursor: "pointer", background: "#0d1421", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#334155", fontSize: 16 }}>⇄</span>
          </button>
        </div>

        <div style={{ background: "#0d1421", border: "1px solid #1e2d40", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "10px 14px", borderBottom: "1px solid #0f1e2e", display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: "#334155", letterSpacing: 2 }}>{mode === "encrypt" ? "CIPHERTEXT OUTPUT" : "PLAINTEXT OUTPUT"}</span>
            {output && <button onClick={() => { navigator.clipboard.writeText(output); showToast("Copied!"); }} style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: "#10b981", background: "none", border: "none", cursor: "pointer" }}>COPY</button>}
          </div>
          <div style={{ padding: 14, minHeight: 220, color: output ? "#94a3b8" : "#1e3a5f", fontSize: 13, wordBreak: "break-all", fontFamily: output ? "'Courier New',monospace" : "'Outfit',sans-serif", display: "flex", alignItems: output ? "flex-start" : "center", justifyContent: output ? "flex-start" : "center" }}>
            {output || <div style={{ textAlign: "center" }}><Icon n={mode === "encrypt" ? "lock" : "unlock"} s={32} c="#1e3a5f" /><div style={{ marginTop: 8, fontSize: 12 }}>Start encrypting here</div></div>}
          </div>
        </div>
      </div>

      {/* Key Input */}
      <div style={{ background: "#0d1421", border: "1px solid #1e2d40", borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#fbbf2420", border: "1px solid #fbbf2433", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon n="key" s={16} c="#fbbf24" />
          </div>
          <div>
            <div style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: "#fbbf24", fontWeight: 700 }}>SECRET KEY</div>
            <div style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#334155" }}>Optional passphrase</div>
          </div>
        </div>
        <div style={{ flex: 1, position: "relative" }}>
          <input type={showKey ? "text" : "password"} value={secretKey} onChange={e => setSecretKey(e.target.value)} placeholder="Enter secret key (leave blank for default)" style={{ width: "100%", background: "#060d18", border: "1px solid #0f1e2e", borderRadius: 8, padding: "10px 40px 10px 12px", color: "#94a3b8", fontSize: 13, outline: "none", fontFamily: "'Outfit',sans-serif", boxSizing: "border-box" }} />
          <button onClick={() => setShowKey(p => !p)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>
            <Icon n={showKey ? "eyeoff" : "eye"} s={16} c="#334155" />
          </button>
        </div>
        <button onClick={process} style={{ padding: "10px 24px", background: "linear-gradient(135deg,#065f46,#10b981)", border: "none", borderRadius: 10, color: "#fff", fontFamily: "'Courier New',monospace", fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
          {mode === "encrypt" ? "🔒 ENCRYPT TEXT" : "🔓 DECRYPT TEXT"}
        </button>
        <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#1e3a5f" }}>{algo} · DEFAULT KEY</span>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, right: 24, padding: "12px 20px", borderRadius: 10, background: "#052e16", border: "1px solid #10b98140", color: "#10b981", fontFamily: "'Courier New',monospace", fontSize: 12, zIndex: 9999 }}>
          ✅ {toast}
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════
//  FILE MANAGER PAGE
// ══════════════════════════════════════════════
const FM_EXT_COLOR = { PDF: "#f87171", XLSX: "#4ade80", DOCX: "#60a5fa", ZIP: "#fbbf24", CSV: "#c084fc", JSON: "#34d399", PNG: "#fb923c", TXT: "#94a3b8" };
const FM_ALGOS     = ["AES-256-GCM", "ChaCha20", "XOR-Base64", "RSA-2048"];

const FMStatusBadge = ({ status }) => {
  const cfg = {
    encrypted: { bg: "#052e16", border: "#10b98135", color: "#34d399", icon: "🔒", label: "Encrypted" },
    decrypted: { bg: "#0c2340", border: "#0ea5e935", color: "#38bdf8", icon: "🔓", label: "Decrypted" },
    plain:     { bg: "#2d0d0d", border: "#f8717135", color: "#f87171", icon: "⚠",  label: "Plain"     },
  }[status] || {};
  return (
    <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10, padding: "3px 10px", borderRadius: 20, fontWeight: 700, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

const FileManagerPage = () => {
  const [files, setFiles] = useState(MOCK_FILES);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [toast, setToast] = useState(null);
  // Encrypt modal
  const [encModal, setEncModal] = useState(null);
  const [encAlgo, setEncAlgo] = useState("AES-256-GCM");
  const [encKey, setEncKey] = useState("");
  const [showEncKey, setShowEncKey] = useState(false);
  const [encrypting, setEncrypting] = useState(false);
  const [encProgress, setEncProgress] = useState(0);
  // Decrypt modal
  const [decModal, setDecModal] = useState(null);
  const [decAlgo, setDecAlgo] = useState("AES-256-GCM");
  const [decKey, setDecKey] = useState("");
  const [showDecKey, setShowDecKey] = useState(false);
  const [decrypting, setDecrypting] = useState(false);
  const [decProgress, setDecProgress] = useState(0);
  const fileRef = useRef();

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const addFile = (f) => {
    setFiles(prev => [{ id: Date.now(), name: f.name, size: f.size > 0 ? (f.size/1024/1024).toFixed(1)+" MB" : "0.0 MB", type: (f.name.split(".").pop()||"FILE").toUpperCase(), status: "plain", algo: null, date: new Date().toISOString().split("T")[0], decryptedAt: null }, ...prev]);
    showToast(`"${f.name}" uploaded!`);
  };
  const deleteFile = (id) => { const f = files.find(x=>x.id===id); setFiles(p=>p.filter(x=>x.id!==id)); showToast(`"${f?.name}" deleted.`, "warn"); };

  const openEncModal = (file) => { setEncModal(file); setEncAlgo("AES-256-GCM"); setEncKey(""); setEncProgress(0); setEncrypting(false); setShowEncKey(false); };
  const runEncrypt = async () => {
    if (!encKey.trim()) { showToast("Enter an encryption key.", "error"); return; }
    setEncrypting(true);
    for (let i=1;i<=10;i++) { await new Promise(r=>setTimeout(r,100+Math.random()*80)); setEncProgress(i*10); }
    setEncrypting(false);
    setFiles(p=>p.map(x=>x.id===encModal.id ? {...x,status:"encrypted",algo:encAlgo,decryptedAt:null} : x));
    showToast(`"${encModal.name}" encrypted with ${encAlgo}!`);
    setEncModal(null);
  };

  const openDecModal = (file) => { setDecModal(file); setDecAlgo(file.algo||"AES-256-GCM"); setDecKey(""); setDecProgress(0); setDecrypting(false); setShowDecKey(false); };
  const runDecrypt = async () => {
    if (!decKey.trim()) { showToast("Enter the decryption key.", "error"); return; }
    setDecrypting(true);
    for (let i=1;i<=10;i++) { await new Promise(r=>setTimeout(r,100+Math.random()*80)); setDecProgress(i*10); }
    setDecrypting(false);
    const now = new Date().toLocaleTimeString("en-US",{hour12:false});
    setFiles(p=>p.map(x=>x.id===decModal.id ? {...x,status:"decrypted",decryptedAt:now} : x));
    showToast(`"${decModal.name}" decrypted successfully!`);
    setDecModal(null);
  };

  const encryptedFiles = files.filter(f=>f.status==="encrypted");
  const decryptedFiles = files.filter(f=>f.status==="decrypted");
  const plainFiles     = files.filter(f=>f.status==="plain");
  const filtered = list => list.filter(f=>f.name.toLowerCase().includes(search.toLowerCase()));
  const displayList = activeTab==="encrypted" ? filtered(encryptedFiles) : activeTab==="decrypted" ? filtered(decryptedFiles) : activeTab==="plain" ? filtered(plainFiles) : filtered(files);

  const TABS = [
    { id:"all",       label:"All Files",    count:files.length,          color:"#a78bfa" },
    { id:"encrypted", label:"🔒 Encrypted", count:encryptedFiles.length, color:"#10b981" },
    { id:"decrypted", label:"🔓 Decrypted", count:decryptedFiles.length, color:"#38bdf8" },
    { id:"plain",     label:"⚠ Plain",     count:plainFiles.length,     color:"#f87171" },
  ];

  const FMProgressBar = ({pct,color}) => (
    <div style={{marginBottom:20}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
        <span style={{fontFamily:"'Courier New',monospace",fontSize:10,color}}>Processing… {pct}%</span>
        <span style={{fontFamily:"'Courier New',monospace",fontSize:10,color:"#334155"}}>{pct===100?"✓ Done":"In progress"}</span>
      </div>
      <div style={{height:6,background:"#1e2d40",borderRadius:3,overflow:"hidden"}}>
        <div style={{height:"100%",width:pct+"%",background:`linear-gradient(90deg,${color}88,${color})`,borderRadius:3,transition:"width .15s ease"}} />
      </div>
    </div>
  );

  const FMModal = ({onClose,accentColor,title,icon,children}) => (
    <div style={{position:"fixed",inset:0,background:"#000000bb",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,backdropFilter:"blur(6px)"}}>
      <div style={{background:"linear-gradient(145deg,#0d1421,#0a1628)",border:`1px solid ${accentColor}35`,borderRadius:22,padding:30,width:520,maxWidth:"92vw",boxShadow:`0 0 80px ${accentColor}18`}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
          <div style={{width:46,height:46,borderRadius:14,background:accentColor+"18",border:`1px solid ${accentColor}35`,display:"flex",alignItems:"center",justifyContent:"center"}}>{icon}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:18,fontWeight:900,color:"#f1f5f9",fontFamily:"'Outfit',sans-serif"}}>{title}</div>
            <div style={{fontFamily:"'Courier New',monospace",fontSize:10,color:"#334155",marginTop:2}}>AES-256-GCM · RSA-2048 · TLS 1.3</div>
          </div>
          <button onClick={onClose} style={{background:"#0a1628",border:"1px solid #1e2d40",borderRadius:8,cursor:"pointer",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Icon n="close" s={14} c="#475569" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );

  const FMKeyInput = ({value,onChange,show,onToggle,placeholder,accentColor}) => (
    <div style={{position:"relative"}}>
      <div style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)"}}><Icon n="key" s={15} c={accentColor} /></div>
      <input type={show?"text":"password"} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{width:"100%",background:"#060d18",border:`1px solid ${accentColor}35`,borderRadius:10,padding:"11px 44px 11px 36px",color:"#94a3b8",fontSize:13,outline:"none",fontFamily:"'Outfit',sans-serif",boxSizing:"border-box"}} />
      <button onClick={onToggle} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer"}}>
        <Icon n={show?"eyeoff":"eye"} s={15} c="#334155" />
      </button>
    </div>
  );

  return (
    <div style={{ padding: "32px 36px" }}>
      {/* Header */}
      <p style={{fontFamily:"'Courier New',monospace",fontSize:11,color:"#334155",letterSpacing:"0.14em",marginBottom:8}}>CRYPTIFY · FILE MANAGER</p>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
        <div>
          <h2 style={{fontSize:24,fontWeight:900,color:"#f1f5f9",margin:0,fontFamily:"'Outfit',sans-serif"}}>File <span style={{color:"#a78bfa"}}>Manager</span></h2>
          <p style={{fontSize:13,color:"#475569",marginTop:5,fontFamily:"'Outfit',sans-serif"}}>Upload · Encrypt · Decrypt · Organise your secure files</p>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"6px 14px",borderRadius:20,background:"#052e16",border:"1px solid #10b98133"}}>
          <Icon n="shield" s={13} c="#10b981" />
          <span style={{fontFamily:"'Courier New',monospace",fontSize:10,color:"#10b981",fontWeight:700}}>END-TO-END SECURED</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22,marginTop:22}}>
        {[
          {label:"Total Files", val:files.length,          color:"#a78bfa",icon:"📁",sub:"in vault"},
          {label:"Encrypted",   val:encryptedFiles.length, color:"#10b981",icon:"🔒",sub:"locked & safe"},
          {label:"Decrypted",   val:decryptedFiles.length, color:"#38bdf8",icon:"🔓",sub:"accessible"},
          {label:"Plain / Raw", val:plainFiles.length,     color:"#f87171",icon:"⚠", sub:"needs encryption"},
        ].map((s,i)=>(
          <div key={i} style={{background:"linear-gradient(145deg,#0d1421,#0a1628)",border:"1px solid #1e2d40",borderTop:`2px solid ${s.color}`,borderRadius:14,padding:"16px 20px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:12,right:14,fontSize:22,opacity:0.15}}>{s.icon}</div>
            <div style={{fontFamily:"'Courier New',monospace",fontSize:28,fontWeight:900,color:s.color,lineHeight:1}}>{s.val}</div>
            <div style={{fontSize:12,fontWeight:600,color:"#64748b",marginTop:4}}>{s.label}</div>
            <div style={{fontFamily:"'Courier New',monospace",fontSize:9,color:s.color+"80",marginTop:3}}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Upload */}
      <div onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)}
        onDrop={e=>{e.preventDefault();setDragOver(false);Array.from(e.dataTransfer.files).forEach(addFile);}}
        onClick={()=>fileRef.current.click()}
        style={{border:`2px dashed ${dragOver?"#a78bfa":"#1e2d40"}`,borderRadius:16,padding:"22px 40px",textAlign:"center",marginBottom:22,cursor:"pointer",background:dragOver?"#a78bfa08":"transparent",transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:20}}>
        <input ref={fileRef} type="file" style={{display:"none"}} multiple onChange={e=>{Array.from(e.target.files).forEach(addFile);e.target.value="";}} />
        <div style={{width:46,height:46,borderRadius:14,background:dragOver?"#a78bfa22":"#1e2d40",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}}>
          <Icon n="upload" s={22} c={dragOver?"#a78bfa":"#475569"} />
        </div>
        <div>
          <div style={{fontSize:14,color:dragOver?"#a78bfa":"#94a3b8",fontWeight:600,fontFamily:"'Outfit',sans-serif"}}>
            {dragOver?"Release to upload":<>Drop files here or <span style={{color:"#a78bfa"}}>browse</span></>}
          </div>
          <div style={{fontFamily:"'Courier New',monospace",fontSize:10,color:"#334155",marginTop:3}}>AES-256-GCM · RSA-2048 · TLS 1.3 · All formats</div>
        </div>
      </div>

      {/* Tabs + Search */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,gap:12}}>
        <div style={{display:"flex",gap:4,background:"#0d1421",border:"1px solid #1e2d40",borderRadius:12,padding:5}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)}
              style={{padding:"8px 16px",borderRadius:9,border:activeTab===t.id?`1px solid ${t.color}45`:"1px solid transparent",cursor:"pointer",fontFamily:"'Courier New',monospace",fontSize:10,fontWeight:700,letterSpacing:0.8,background:activeTab===t.id?t.color+"22":"transparent",color:activeTab===t.id?t.color:"#334155",transition:"all .15s",display:"flex",alignItems:"center",gap:6}}>
              {t.label}
              <span style={{background:activeTab===t.id?t.color:"#1e2d40",color:"#000",padding:"1px 7px",borderRadius:10,fontSize:9,fontWeight:900}}>{t.count}</span>
            </button>
          ))}
        </div>
        <div style={{position:"relative",minWidth:220}}>
          <div style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)"}}><Icon n="search" s={13} c="#334155" /></div>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search files…"
            style={{width:"100%",background:"#0d1421",border:"1px solid #1e2d40",borderRadius:10,padding:"9px 12px 9px 32px",color:"#94a3b8",fontSize:12,outline:"none",fontFamily:"'Outfit',sans-serif",boxSizing:"border-box"}} />
        </div>
      </div>

      {/* Divider */}
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
        <div style={{height:1,flex:1,background:"linear-gradient(90deg,#1e2d40,transparent)"}} />
        <span style={{fontFamily:"'Courier New',monospace",fontSize:9,color:"#2d4a6e",letterSpacing:3}}>
          {activeTab==="encrypted"?"🔒 ENCRYPTED FILES — LOCKED & SECURED":activeTab==="decrypted"?"🔓 DECRYPTED FILES — PLAINTEXT ACCESSIBLE":activeTab==="plain"?"⚠ PLAIN FILES — ENCRYPTION RECOMMENDED":"📁 ALL FILES IN VAULT"}
        </span>
        <div style={{height:1,flex:1,background:"linear-gradient(90deg,transparent,#1e2d40)"}} />
      </div>

      {/* Table */}
      <div style={{background:"#0d1421",border:"1px solid #1e2d40",borderRadius:16,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr style={{background:"#060910"}}>
              {["File Name","Type","Size","Date","Algorithm","Status","Actions"].map(h=>(
                <th key={h} style={{padding:"11px 16px",textAlign:"left",fontSize:9,color:"#2d4a6e",fontWeight:700,letterSpacing:"0.14em",borderBottom:"1px solid #0f1e2e",fontFamily:"'Courier New',monospace"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayList.length===0 ? (
              <tr><td colSpan={7}>
                <div style={{padding:"52px",textAlign:"center"}}>
                  <div style={{fontSize:38,marginBottom:12}}>{activeTab==="encrypted"?"🔒":activeTab==="decrypted"?"🔓":activeTab==="plain"?"📄":"📁"}</div>
                  <div style={{fontSize:14,color:"#334155",fontFamily:"'Outfit',sans-serif",fontWeight:600}}>
                    {activeTab==="encrypted"?"No encrypted files":activeTab==="decrypted"?"No decrypted files":activeTab==="plain"?"No plain files":"No files found"}
                  </div>
                  <div style={{fontSize:11,color:"#1e3a5f",marginTop:6,fontFamily:"'Courier New',monospace"}}>
                    {activeTab==="encrypted"?"Encrypt a plain file to see it here":activeTab==="decrypted"?"Decrypt an encrypted file to see it here":"Upload a file to get started"}
                  </div>
                </div>
              </td></tr>
            ) : displayList.map(f => {
              const ec = FM_EXT_COLOR[f.type]||"#94a3b8";
              return (
                <tr key={f.id} style={{borderBottom:"1px solid #0a1628",transition:"background .1s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="#0d1e30"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{padding:"13px 16px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{position:"relative",flexShrink:0}}>
                        <div style={{width:36,height:36,borderRadius:10,background:ec+"18",border:`1px solid ${ec}30`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                          <Icon n="file" s={15} c={ec} />
                        </div>
                        <span style={{position:"absolute",bottom:-4,right:-4,fontSize:10,lineHeight:1}}>
                          {f.status==="encrypted"?"🔒":f.status==="decrypted"?"🔓":""}
                        </span>
                      </div>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,color:"#c8d3e0",fontFamily:"'Outfit',sans-serif"}}>{f.name}</div>
                        {f.status==="decrypted"&&f.decryptedAt&&<div style={{fontFamily:"'Courier New',monospace",fontSize:9,color:"#0ea5e9",marginTop:2}}>🔓 Decrypted at {f.decryptedAt}</div>}
                        {f.status==="encrypted"&&<div style={{fontFamily:"'Courier New',monospace",fontSize:9,color:"#10b981",marginTop:2}}>🔒 Encrypted · {f.algo}</div>}
                      </div>
                    </div>
                  </td>
                  <td style={{padding:"13px 14px"}}><span style={{fontFamily:"'Courier New',monospace",fontSize:10,padding:"2px 8px",borderRadius:6,background:ec+"18",color:ec,border:`1px solid ${ec}28`}}>{f.type}</span></td>
                  <td style={{padding:"13px 14px",fontSize:12,color:"#475569",fontFamily:"'Courier New',monospace"}}>{f.size}</td>
                  <td style={{padding:"13px 14px",fontSize:11,color:"#2d4a6e",fontFamily:"'Courier New',monospace"}}>{f.date}</td>
                  <td style={{padding:"13px 14px"}}>
                    {f.algo ? <span style={{fontFamily:"'Courier New',monospace",fontSize:9,padding:"2px 8px",borderRadius:5,background:"#10b98112",color:"#10b981",border:"1px solid #10b98128"}}>{f.algo}</span>
                            : <span style={{fontSize:11,color:"#1e3a5f"}}>—</span>}
                  </td>
                  <td style={{padding:"13px 14px"}}><FMStatusBadge status={f.status} /></td>
                  <td style={{padding:"13px 14px"}}>
                    <div style={{display:"flex",gap:5,alignItems:"center"}}>
                      {f.status==="plain"&&<button onClick={()=>openEncModal(f)} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 10px",background:"#052e16",border:"1px solid #10b98135",borderRadius:7,color:"#10b981",fontSize:10,cursor:"pointer",fontFamily:"'Courier New',monospace",fontWeight:700,whiteSpace:"nowrap"}}><Icon n="lock" s={11} c="#10b981" /> ENCRYPT</button>}
                      {f.status==="encrypted"&&<button onClick={()=>openDecModal(f)} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 10px",background:"#0c2340",border:"1px solid #0ea5e935",borderRadius:7,color:"#38bdf8",fontSize:10,cursor:"pointer",fontFamily:"'Courier New',monospace",fontWeight:700,whiteSpace:"nowrap"}}><Icon n="unlock" s={11} c="#38bdf8" /> DECRYPT</button>}
                      {f.status==="decrypted"&&<button onClick={()=>openEncModal(f)} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 10px",background:"#052e16",border:"1px solid #10b98135",borderRadius:7,color:"#10b981",fontSize:10,cursor:"pointer",fontFamily:"'Courier New',monospace",fontWeight:700,whiteSpace:"nowrap"}}><Icon n="refresh" s={11} c="#10b981" /> RE-ENC</button>}
                      <button onClick={()=>showToast("Downloading…")} style={{padding:"5px 7px",background:"#0a1628",border:"1px solid #1e2d40",borderRadius:7,cursor:"pointer",display:"flex",alignItems:"center"}}><Icon n="download" s={13} c="#475569" /></button>
                      <button onClick={()=>deleteFile(f.id)} style={{padding:"5px 7px",background:"#2d0d0d",border:"1px solid #f8717128",borderRadius:7,cursor:"pointer",display:"flex",alignItems:"center"}}><Icon n="trash" s={13} c="#f87171" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{padding:"10px 20px",borderTop:"1px solid #0f1e2e",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontFamily:"'Courier New',monospace",fontSize:10,color:"#2d4a6e"}}>Showing {displayList.length} of {files.length} files</span>
          <span style={{fontFamily:"'Courier New',monospace",fontSize:9,color:"#1e3a5f"}}>AES-256-GCM · RSA-2048 · TLS 1.3</span>
        </div>
      </div>

      {/* Encrypt Modal */}
      {encModal&&(
        <FMModal onClose={()=>setEncModal(null)} accentColor="#10b981" title="Encrypt File" icon={<Icon n="lock" s={22} c="#10b981" />}>
          <div style={{background:"#060d18",border:"1px solid #0f1e2e",borderRadius:12,padding:"12px 16px",marginBottom:18,display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:38,height:38,borderRadius:10,background:(FM_EXT_COLOR[encModal.type]||"#94a3b8")+"18",border:`1px solid ${(FM_EXT_COLOR[encModal.type]||"#94a3b8")}30`,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon n="file" s={17} c={FM_EXT_COLOR[encModal.type]||"#94a3b8"} /></div>
            <div><div style={{fontSize:13,fontWeight:700,color:"#94a3b8"}}>{encModal.name}</div><div style={{fontFamily:"'Courier New',monospace",fontSize:10,color:"#334155"}}>{encModal.size} · {encModal.type}</div></div>
            <FMStatusBadge status={encModal.status} />
          </div>
          <div style={{marginBottom:16}}>
            <label style={{fontFamily:"'Courier New',monospace",fontSize:9,color:"#334155",letterSpacing:2,display:"block",marginBottom:8}}>ENCRYPTION ALGORITHM</label>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {FM_ALGOS.map(a=><button key={a} onClick={()=>setEncAlgo(a)} style={{padding:"7px 13px",borderRadius:8,border:encAlgo===a?"none":"1px solid #1e2d40",cursor:"pointer",fontFamily:"'Courier New',monospace",fontSize:10,fontWeight:700,background:encAlgo===a?"#10b981":"#060d18",color:encAlgo===a?"#000":"#334155",transition:"all .15s"}}>{a}</button>)}
            </div>
          </div>
          <div style={{marginBottom:20}}>
            <label style={{fontFamily:"'Courier New',monospace",fontSize:9,color:"#334155",letterSpacing:2,display:"block",marginBottom:8}}>ENCRYPTION KEY</label>
            <FMKeyInput value={encKey} onChange={setEncKey} show={showEncKey} onToggle={()=>setShowEncKey(p=>!p)} placeholder="Enter a strong secret key…" accentColor="#10b981" />
            <div style={{fontFamily:"'Courier New',monospace",fontSize:9,color:"#1e3a5f",marginTop:6}}>⚠ Keep this key safe — required to decrypt later</div>
          </div>
          {encrypting&&<FMProgressBar pct={encProgress} color="#10b981" />}
          <div style={{display:"flex",gap:10}}>
            <button onClick={runEncrypt} disabled={encrypting} style={{flex:1,padding:"12px",background:encrypting?"#1e2d40":"linear-gradient(135deg,#065f46,#10b981)",border:"none",borderRadius:11,color:encrypting?"#334155":"#fff",fontFamily:"'Courier New',monospace",fontSize:11,fontWeight:900,cursor:encrypting?"not-allowed":"pointer",letterSpacing:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <Icon n="lock" s={14} c={encrypting?"#334155":"#fff"} />{encrypting?"ENCRYPTING…":"ENCRYPT FILE"}
            </button>
            <button onClick={()=>setEncModal(null)} style={{padding:"12px 22px",background:"#060d18",border:"1px solid #1e2d40",borderRadius:11,color:"#64748b",fontSize:13,cursor:"pointer"}}>Cancel</button>
          </div>
        </FMModal>
      )}

      {/* Decrypt Modal */}
      {decModal&&(
        <FMModal onClose={()=>setDecModal(null)} accentColor="#0ea5e9" title="Decrypt File" icon={<Icon n="unlock" s={22} c="#38bdf8" />}>
          <div style={{background:"#060d18",border:"1px solid #0ea5e918",borderRadius:12,padding:"12px 16px",marginBottom:18,display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:38,height:38,borderRadius:10,background:(FM_EXT_COLOR[decModal.type]||"#94a3b8")+"18",border:`1px solid ${(FM_EXT_COLOR[decModal.type]||"#94a3b8")}30`,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon n="file" s={17} c={FM_EXT_COLOR[decModal.type]||"#94a3b8"} /></div>
            <div><div style={{fontSize:13,fontWeight:700,color:"#94a3b8"}}>{decModal.name}</div><div style={{fontFamily:"'Courier New',monospace",fontSize:10,color:"#334155"}}>{decModal.size} · Encrypted with {decModal.algo}</div></div>
            <FMStatusBadge status={decModal.status} />
          </div>
          <div style={{marginBottom:16}}>
            <label style={{fontFamily:"'Courier New',monospace",fontSize:9,color:"#334155",letterSpacing:2,display:"block",marginBottom:8}}>DECRYPTION ALGORITHM</label>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {FM_ALGOS.map(a=><button key={a} onClick={()=>setDecAlgo(a)} style={{padding:"7px 13px",borderRadius:8,border:decAlgo===a?"none":"1px solid #1e2d40",cursor:"pointer",fontFamily:"'Courier New',monospace",fontSize:10,fontWeight:700,background:decAlgo===a?"#0ea5e9":"#060d18",color:decAlgo===a?"#000":"#334155",transition:"all .15s"}}>{a}</button>)}
            </div>
          </div>
          <div style={{marginBottom:20}}>
            <label style={{fontFamily:"'Courier New',monospace",fontSize:9,color:"#334155",letterSpacing:2,display:"block",marginBottom:8}}>DECRYPTION KEY</label>
            <FMKeyInput value={decKey} onChange={setDecKey} show={showDecKey} onToggle={()=>setShowDecKey(p=>!p)} placeholder="Enter the secret key used during encryption…" accentColor="#0ea5e9" />
            <div style={{fontFamily:"'Courier New',monospace",fontSize:9,color:"#1e3a5f",marginTop:6}}>ℹ Must match the key used when the file was encrypted</div>
          </div>
          {decrypting&&<FMProgressBar pct={decProgress} color="#0ea5e9" />}
          <div style={{display:"flex",gap:10}}>
            <button onClick={runDecrypt} disabled={decrypting} style={{flex:1,padding:"12px",background:decrypting?"#1e2d40":"linear-gradient(135deg,#1e3a5f,#0ea5e9)",border:"none",borderRadius:11,color:decrypting?"#334155":"#fff",fontFamily:"'Courier New',monospace",fontSize:11,fontWeight:900,cursor:decrypting?"not-allowed":"pointer",letterSpacing:1,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
              <Icon n="unlock" s={14} c={decrypting?"#334155":"#fff"} />{decrypting?"DECRYPTING…":"DECRYPT FILE"}
            </button>
            <button onClick={()=>setDecModal(null)} style={{padding:"12px 22px",background:"#060d18",border:"1px solid #1e2d40",borderRadius:11,color:"#64748b",fontSize:13,cursor:"pointer"}}>Cancel</button>
          </div>
        </FMModal>
      )}

      {toast&&(
        <div style={{position:"fixed",bottom:28,right:28,padding:"13px 22px",borderRadius:12,fontFamily:"'Courier New',monospace",fontSize:12,zIndex:9999,display:"flex",alignItems:"center",gap:10,boxShadow:"0 8px 32px #00000060",
          background:toast.type==="error"?"#2d0d0d":toast.type==="warn"?"#1c1708":"#052e16",
          border:`1px solid ${toast.type==="error"?"#f8717135":toast.type==="warn"?"#fbbf2435":"#10b98135"}`,
          color:toast.type==="error"?"#f87171":toast.type==="warn"?"#fbbf24":"#10b981"}}>
          <span>{toast.type==="error"?"⚠":toast.type==="warn"?"🗑":"✅"}</span>{toast.msg}
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════
//  SECURE EMAIL PAGE
// ══════════════════════════════════════════════

// Cipher helpers
function emailXor(text, key) {
  let out = "";
  for (let i = 0; i < text.length; i++)
    out += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  return out;
}
function emailResolveKey(key, algo) {
  const base = key || "cryptify-default";
  if (algo === "AES-256-GCM") return "AES256GCM::" + base;
  if (algo === "ChaCha20")    return "CHACHA20::"   + base;
  return base;
}
function emailEncrypt(text, key, algo) {
  try { return btoa(unescape(encodeURIComponent(emailXor(text, emailResolveKey(key, algo))))); }
  catch { return null; }
}
function emailDecrypt(cipher, key, algo) {
  try {
    const raw = decodeURIComponent(escape(atob(cipher.trim())));
    return { ok: true, result: emailXor(raw, emailResolveKey(key, algo)) };
  } catch { return { ok: false, result: "Invalid ciphertext — check algorithm and key." }; }
}

// Mock received inbox (pre-populated)
const MOCK_INBOX = [
  { id: "r1", folder: "received", from: "alice@corp.com",  to: "me@corp.com",    subject: "Q4 Financial Summary",    algo: "AES-256-GCM", body: "SGVsbG8h", encryptedBody: "SGVsbG8h", time: "09:12", decrypted: false, decryptedBody: null, read: false },
  { id: "r2", folder: "received", from: "bob@corp.com",    to: "me@corp.com",    subject: "Server Config Update",    algo: "ChaCha20",    body: "dGVzdA==", encryptedBody: "dGVzdA==", time: "10:44", decrypted: false, decryptedBody: null, read: true  },
  { id: "r3", folder: "received", from: "carol@corp.com",  to: "me@corp.com",    subject: "Confidential: Keys",      algo: "XOR-Base64",  body: "a2V5cw==", encryptedBody: "a2V5cw==", time: "11:30", decrypted: false, decryptedBody: null, read: false },
];

// Unified Encrypt + Decrypt panel — works on any email (sent or received)
const EmailCryptoPanel = ({ email, onEncrypted, onDecrypted }) => {
  const [mode, setMode]   = useState("decrypt"); // "encrypt" | "decrypt"
  const [key, setKey]     = useState("");
  const [show, setShow]   = useState(false);
  const [algo, setAlgo]   = useState(email.algo || "AES-256-GCM");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [err, setErr]     = useState("");
  const [done, setDone]   = useState(false);

  const ALGOS = ["AES-256-GCM", "ChaCha20", "XOR-Base64"];
  const isEnc = mode === "encrypt";

  const reset = () => { setOutput(""); setErr(""); setDone(false); };

  const run = () => {
    setErr(""); setDone(false);
    if (isEnc) {
      const src = input.trim() || email.body || "";
      if (!src) { setErr("Nothing to encrypt — paste text or use the email body."); return; }
      const result = emailEncrypt(src, key, algo);
      if (result) { setOutput(result); setDone(true); if (onEncrypted) onEncrypted(result, algo); }
      else        setErr("Encryption failed.");
    } else {
      const src = input.trim() || email.encryptedBody || "";
      if (!src) { setErr("Nothing to decrypt."); return; }
      const { ok, result } = emailDecrypt(src, key, algo);
      if (ok) { setOutput(result); setDone(true); if (onDecrypted) onDecrypted(result); }
      else    setErr(result);
    }
  };

  const modeColor = isEnc ? "#10b981" : "#0ea5e9";
  const modeGrad  = isEnc ? "linear-gradient(135deg,#065f46,#10b981)" : "linear-gradient(135deg,#0c2340,#0ea5e9)";

  return (
    <div style={{ background: "#060d18", border: `1px solid ${modeColor}22`, borderRadius: 14, padding: "16px 18px", marginTop: 14 }}>
      {/* Mode toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ display: "flex", borderRadius: 9, border: "1px solid #1e2d40", overflow: "hidden", flexShrink: 0 }}>
          {[{id:"encrypt",label:"🔒 ENCRYPT",color:"#10b981"},{id:"decrypt",label:"🔓 DECRYPT",color:"#0ea5e9"}].map(m => (
            <button key={m.id} onClick={() => { setMode(m.id); reset(); }} style={{ padding: "6px 14px", border: "none", cursor: "pointer", fontFamily: "'Courier New',monospace", fontSize: 9, fontWeight: 700, background: mode === m.id ? m.color + "22" : "transparent", color: mode === m.id ? m.color : "#334155", borderBottom: mode === m.id ? `2px solid ${m.color}` : "2px solid transparent", transition: "all .15s" }}>
              {m.label}
            </button>
          ))}
        </div>
        <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#2d4a6e", letterSpacing: 1 }}>
          {isEnc ? "ENCRYPT PLAIN TEXT → CIPHERTEXT" : "DECRYPT CIPHERTEXT → PLAIN TEXT"}
        </span>
      </div>

      {/* Input text area */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
          <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#334155", fontWeight: 700, letterSpacing: 1 }}>
            {isEnc ? "PLAIN TEXT (leave blank to use email body)" : "CIPHERTEXT (leave blank to use email body)"}
          </span>
          {(isEnc ? email.body : email.encryptedBody) && (
            <button onClick={() => { setInput(isEnc ? (email.body || "") : (email.encryptedBody || "")); reset(); }}
              style={{ fontFamily: "'Courier New',monospace", fontSize: 8, color: modeColor, background: "none", border: `1px solid ${modeColor}30`, borderRadius: 5, padding: "2px 8px", cursor: "pointer" }}>
              USE EMAIL {isEnc ? "BODY" : "CIPHER"}
            </button>
          )}
        </div>
        <textarea value={input} onChange={e => { setInput(e.target.value); reset(); }}
          placeholder={isEnc ? "Type or paste plain text to encrypt…" : "Paste ciphertext to decrypt…"}
          rows={3}
          style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px", background: "#0d1421", border: "1px solid #1e2d40", borderRadius: 9, outline: "none", fontFamily: "'Courier New',monospace", fontSize: 11, color: "#94a3b8", resize: "vertical" }} />
      </div>

      {/* Controls row: algo + key + button */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
        <select value={algo} onChange={e => { setAlgo(e.target.value); reset(); }}
          style={{ background: "#0d1421", border: "1px solid #1e2d40", borderRadius: 8, padding: "7px 10px", fontFamily: "'Courier New',monospace", fontSize: 10, color: "#64748b", outline: "none", cursor: "pointer" }}>
          {ALGOS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <div style={{ flex: 1, minWidth: 160, position: "relative" }}>
          <input type={show ? "text" : "password"} value={key} onChange={e => { setKey(e.target.value); reset(); }}
            placeholder="Secret key (blank = default)"
            style={{ width: "100%", boxSizing: "border-box", padding: "8px 36px 8px 12px", background: "#0d1421", border: `1px solid ${err ? "#f8717135" : "#1e2d40"}`, borderRadius: 8, outline: "none", fontFamily: "'Courier New',monospace", fontSize: 11, color: "#94a3b8" }} />
          <button onClick={() => setShow(p => !p)} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>
            <Icon n={show ? "eyeoff" : "eye"} s={13} c="#334155" />
          </button>
        </div>
        <button onClick={run} style={{ padding: "8px 20px", borderRadius: 9, border: "none", cursor: "pointer", background: modeGrad, color: "#fff", fontFamily: "'Courier New',monospace", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
          <Icon n={isEnc ? "lock" : "unlock"} s={12} c="#fff" /> {isEnc ? "ENCRYPT" : "DECRYPT"}
        </button>
      </div>

      {err && <div style={{ marginBottom: 10, fontSize: 11, color: "#f87171", fontFamily: "'Courier New',monospace" }}>⚠ {err}</div>}

      {/* Output */}
      {done && output && (
        <div style={{ background: "#060910", border: `1px solid ${modeColor}30`, borderRadius: 10, padding: "12px 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: modeColor, fontWeight: 700, letterSpacing: 1 }}>
              ✓ {isEnc ? "ENCRYPTED OUTPUT" : "DECRYPTED OUTPUT"}
            </span>
            <button onClick={() => navigator.clipboard.writeText(output)}
              style={{ fontFamily: "'Courier New',monospace", fontSize: 8, color: modeColor, background: "none", border: `1px solid ${modeColor}30`, borderRadius: 5, padding: "2px 8px", cursor: "pointer" }}>
              COPY
            </button>
          </div>
          <pre style={{ margin: 0, fontFamily: isEnc ? "'Courier New',monospace" : "'Outfit',sans-serif", fontSize: isEnc ? 10 : 13, color: modeColor + "cc", whiteSpace: "pre-wrap", wordBreak: "break-all", maxHeight: 140, overflowY: "auto", lineHeight: 1.6 }}>{output}</pre>
        </div>
      )}
    </div>
  );
};

const SecureEmailPage = () => {
  const allSeed = MOCK_EMAILS.map((e, i) => ({
    ...e,
    id: "s" + i,
    folder: "sent",
    from: "me@corp.com",
    encryptedBody: btoa("Encrypted content for " + e.subject),
    decrypted: false,
    decryptedBody: null,
  }));

  const [emails, setEmails]     = useState([...allSeed, ...MOCK_INBOX]);
  const [activeTab, setActiveTab] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [composing, setComposing] = useState(false);
  const [toast, setToast]       = useState(null);

  // Compose form state
  const [cTo, setCTo]           = useState("");
  const [cSubject, setCSubject] = useState("");
  const [cBody, setCBody]       = useState("");
  const [cAlgo, setCAlgo]       = useState("AES-256-GCM");
  const [cKey, setCKey]         = useState("");
  const [showCKey, setShowCKey] = useState(false);
  const [cEncBody, setCEncBody] = useState("");
  const [cEncDone, setCEncDone] = useState(false);
  const [cErr, setCErr]         = useState("");

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const sentEmails     = emails.filter(e => e.folder === "sent");
  const receivedEmails = emails.filter(e => e.folder === "received");
  const allEmails      = emails;

  const displayList =
    activeTab === "sent"     ? sentEmails     :
    activeTab === "received" ? receivedEmails :
    allEmails;

  const unreadCount = receivedEmails.filter(e => !e.read).length;

  const TABS = [
    { id: "all",      label: "All Mail",   count: allEmails.length,      color: "#fbbf24" },
    { id: "sent",     label: "📤 Sent",    count: sentEmails.length,     color: "#10b981" },
    { id: "received", label: "📥 Received", count: receivedEmails.length, color: "#0ea5e9", badge: unreadCount },
  ];

  // Encrypt compose body
  const encryptCompose = () => {
    if (!cBody.trim()) { setCErr("Write a message first."); return; }
    const result = emailEncrypt(cBody, cKey, cAlgo);
    if (result) { setCEncBody(result); setCEncDone(true); setCErr(""); }
    else        { setCErr("Encryption failed."); }
  };

  // Send
  const sendEmail = () => {
    if (!cTo.trim() || !cSubject.trim()) { setCErr("Fill To and Subject fields."); return; }
    if (!cEncDone) { setCErr("Encrypt the body before sending."); return; }
    setEmails(prev => [{
      id: "s" + Date.now(),
      folder: "sent",
      from: "me@corp.com",
      to: cTo,
      subject: cSubject,
      algo: cAlgo,
      body: cBody,
      encryptedBody: cEncBody,
      status: "sent",
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      read: true,
      decrypted: false,
      decryptedBody: null,
    }, ...prev]);
    setCTo(""); setCSubject(""); setCBody(""); setCEncBody(""); setCEncDone(false); setCKey(""); setCErr("");
    setComposing(false);
    setActiveTab("sent");
    showToast("Encrypted email sent!");
  };

  // Mark as read + toggle expand
  const toggleExpand = (id) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, read: true } : e));
    setExpandedId(prev => prev === id ? null : id);
  };

  // Encrypt / Decrypt any email inline
  const handleDecrypt = (id, decryptedBody) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, decrypted: true, decryptedBody } : e));
    showToast("Decrypted successfully!");
  };

  const EXT_ALGO_COLOR = { "AES-256-GCM": "#10b981", "ChaCha20": "#0ea5e9", "XOR-Base64": "#a78bfa", "RSA-2048": "#fbbf24" };

  return (
    <div style={{ padding: "32px 36px" }}>
      <p style={{ fontFamily: "'Courier New',monospace", fontSize: 11, color: "#334155", letterSpacing: "0.14em", marginBottom: 8 }}>CRYPTIFY · SECURE EMAIL MODULE</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: "#f1f5f9", marginBottom: 4, fontFamily: "'Outfit',sans-serif" }}>
            Secure <span style={{ color: "#fbbf24" }}>Email</span>
          </h2>
          <p style={{ fontSize: 13, color: "#475569", fontFamily: "'Outfit',sans-serif" }}>
            Send, receive, encrypt and decrypt your emails end-to-end.
          </p>
        </div>
        <button onClick={() => setComposing(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", background: "linear-gradient(135deg,#92400e,#fbbf24)", border: "none", borderRadius: 12, color: "#000", fontFamily: "'Courier New',monospace", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
          <Icon n="plus" s={14} c="#000" /> COMPOSE
        </button>
      </div>

      {/* ── Stats row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { label: "Total Emails", val: emails.length,          color: "#fbbf24", icon: "mail" },
          { label: "Sent",         val: sentEmails.length,      color: "#10b981", icon: "send" },
          { label: "Received",     val: receivedEmails.length,  color: "#0ea5e9", icon: "inbox", badge: unreadCount },
        ].map((s, i) => (
          <div key={i} style={{ background: "linear-gradient(145deg,#0d1421,#0a1628)", border: "1px solid #1e2d40", borderTop: `2px solid ${s.color}`, borderRadius: 14, padding: "14px 18px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 10, right: 14, opacity: 0.1 }}>
              <Icon n={s.icon} s={28} c={s.color} />
            </div>
            <div style={{ fontFamily: "'Courier New',monospace", fontSize: 26, fontWeight: 900, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 11, color: "#64748b", fontFamily: "'Outfit',sans-serif", marginTop: 2 }}>{s.label}</div>
            {s.badge > 0 && (
              <div style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: s.color + "aa", marginTop: 3 }}>{s.badge} unread</div>
            )}
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, background: "#0d1421", border: "1px solid #1e2d40", borderRadius: 12, padding: 5, width: "fit-content" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "8px 18px", borderRadius: 9, border: "none", cursor: "pointer", fontFamily: "'Courier New',monospace", fontSize: 10, fontWeight: 700, letterSpacing: 0.8, background: activeTab === t.id ? t.color + "20" : "transparent", color: activeTab === t.id ? t.color : "#334155", border: activeTab === t.id ? `1px solid ${t.color}45` : "1px solid transparent", transition: "all .15s", display: "flex", alignItems: "center", gap: 6 }}>
            {t.label}
            <span style={{ background: activeTab === t.id ? t.color : "#1e2d40", color: "#000", padding: "1px 7px", borderRadius: 10, fontSize: 9, fontWeight: 900 }}>{t.count}</span>
            {t.badge > 0 && activeTab !== t.id && (
              <span style={{ background: "#ef4444", color: "#fff", padding: "1px 6px", borderRadius: 10, fontSize: 8, fontWeight: 900 }}>{t.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Section label ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg,#1e2d40,transparent)" }} />
        <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#2d4a6e", letterSpacing: 3 }}>
          {activeTab === "sent" ? "📤 SENT — ENCRYPTED OUTBOUND MAIL" : activeTab === "received" ? "📥 RECEIVED — CLICK TO EXPAND & DECRYPT" : "📬 ALL MAIL"}
        </span>
        <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg,transparent,#1e2d40)" }} />
      </div>

      {/* ── Email Cards ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {displayList.length === 0 ? (
          <div style={{ textAlign: "center", padding: "52px", background: "#0d1421", border: "1px solid #1e2d40", borderRadius: 16 }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>{activeTab === "sent" ? "📤" : activeTab === "received" ? "📥" : "📬"}</div>
            <div style={{ fontSize: 14, color: "#334155", fontFamily: "'Outfit',sans-serif" }}>No emails in this folder</div>
          </div>
        ) : displayList.map(email => {
          const isExpanded = expandedId === email.id;
          const isSent     = email.folder === "sent";
          const algoColor  = EXT_ALGO_COLOR[email.algo] || "#fbbf24";

          return (
            <div key={email.id} style={{ background: "#0d1421", border: `1px solid ${isExpanded ? "#fbbf2433" : "#1e2d40"}`, borderRadius: 14, overflow: "hidden", transition: "border-color .2s" }}>
              {/* Row header */}
              <div onClick={() => toggleExpand(email.id)} style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "#0d1e30"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>

                {/* Avatar */}
                <div style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0, background: isSent ? "#10b98118" : "#0ea5e918", border: `1px solid ${isSent ? "#10b98133" : "#0ea5e933"}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <Icon n={isSent ? "send" : "inbox"} s={15} c={isSent ? "#10b981" : "#0ea5e9"} />
                  {!email.read && !isSent && (
                    <div style={{ position: "absolute", top: -2, right: -2, width: 10, height: 10, borderRadius: "50%", background: "#ef4444", border: "2px solid #0d1421" }} />
                  )}
                </div>

                {/* Meta */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: email.read || isSent ? "#94a3b8" : "#f1f5f9", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {email.subject || "(No subject)"}
                    </span>
                    {/* Folder badge */}
                    <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: isSent ? "#052e16" : "#0c2340", color: isSent ? "#10b981" : "#0ea5e9", border: `1px solid ${isSent ? "#10b98130" : "#0ea5e930"}`, flexShrink: 0 }}>
                      {isSent ? "📤 SENT" : "📥 RECEIVED"}
                    </span>
                    {/* Decryption status — shown on all emails */}
                    <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: email.decrypted ? "#0c2340" : "#0a0a14", color: email.decrypted ? "#38bdf8" : "#475569", border: `1px solid ${email.decrypted ? "#0ea5e930" : "#1e2d40"}`, flexShrink: 0 }}>
                      {email.decrypted ? "🔓 DECRYPTED" : "🔒 ENCRYPTED"}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "#334155", fontFamily: "'Outfit',sans-serif" }}>
                      {isSent ? `To: ${email.to}` : `From: ${email.from}`}
                    </span>
                    <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10, padding: "1px 7px", borderRadius: 5, background: algoColor + "15", color: algoColor, border: `1px solid ${algoColor}25` }}>{email.algo}</span>
                    <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: "#2d4a6e" }}>{email.time}</span>
                  </div>
                </div>

                <span style={{ fontSize: 11, color: "#334155", marginLeft: 4 }}>{isExpanded ? "▲" : "▼"}</span>
              </div>

              {/* Expanded body */}
              {isExpanded && (
                <div style={{ borderTop: "1px solid #0f1e2e", padding: "16px 18px" }}>

                  {/* Two info columns: original body + encrypted body */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 4 }}>
                    {/* Original / plain text body */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#475569", fontWeight: 700, letterSpacing: 1 }}>
                          {isSent ? "📝 ORIGINAL BODY" : "📝 RAW BODY"}
                        </span>
                        {email.body && (
                          <button onClick={() => navigator.clipboard.writeText(email.body).then(() => showToast("Copied!"))}
                            style={{ fontFamily: "'Courier New',monospace", fontSize: 8, color: "#475569", background: "none", border: "1px solid #1e2d40", borderRadius: 5, padding: "2px 7px", cursor: "pointer" }}>COPY</button>
                        )}
                      </div>
                      <pre style={{ margin: 0, padding: "10px 12px", borderRadius: 9, background: "#060910", border: "1px solid #1e2d40", fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#475569", whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 90, overflowY: "auto", lineHeight: 1.6 }}>
                        {email.body || <span style={{ color: "#2d4a6e", fontFamily: "'Courier New',monospace", fontSize: 10 }}>—</span>}
                      </pre>
                    </div>

                    {/* Encrypted body */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#10b981", fontWeight: 700, letterSpacing: 1 }}>🔒 ENCRYPTED BODY</span>
                        {email.encryptedBody && (
                          <button onClick={() => navigator.clipboard.writeText(email.encryptedBody).then(() => showToast("Copied!"))}
                            style={{ fontFamily: "'Courier New',monospace", fontSize: 8, color: "#10b981", background: "none", border: "1px solid #10b98130", borderRadius: 5, padding: "2px 7px", cursor: "pointer" }}>COPY</button>
                        )}
                      </div>
                      <pre style={{ margin: 0, padding: "10px 12px", borderRadius: 9, background: "#060910", border: "1px solid #052e16", fontFamily: "'Courier New',monospace", fontSize: 10, color: "#10b981aa", whiteSpace: "pre-wrap", wordBreak: "break-all", maxHeight: 90, overflowY: "auto", lineHeight: 1.6 }}>
                        {email.encryptedBody || <span style={{ color: "#2d4a6e" }}>—</span>}
                      </pre>
                    </div>
                  </div>

                  {/* Previously decrypted result banner */}
                  {email.decrypted && email.decryptedBody && (
                    <div style={{ marginBottom: 4, padding: "10px 14px", background: "#060910", border: "1px solid #0ea5e920", borderRadius: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#0ea5e9", fontWeight: 700, letterSpacing: 1 }}>🔓 LAST DECRYPTED RESULT</span>
                        <button onClick={() => navigator.clipboard.writeText(email.decryptedBody).then(() => showToast("Copied!"))}
                          style={{ fontFamily: "'Courier New',monospace", fontSize: 8, color: "#0ea5e9", background: "none", border: "1px solid #0ea5e930", borderRadius: 5, padding: "2px 7px", cursor: "pointer" }}>COPY</button>
                      </div>
                      <pre style={{ margin: 0, fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#94a3b8", whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: 80, overflowY: "auto", lineHeight: 1.6 }}>{email.decryptedBody}</pre>
                    </div>
                  )}

                  {/* ── Unified Crypto Panel ── always shown for both sent & received */}
                  <EmailCryptoPanel
                    email={email}
                    onEncrypted={(cipher, usedAlgo) => {
                      setEmails(prev => prev.map(e => e.id === email.id ? { ...e, encryptedBody: cipher, algo: usedAlgo } : e));
                      showToast("Body re-encrypted!");
                    }}
                    onDecrypted={(plain) => handleDecrypt(email.id, plain)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════
           COMPOSE MODAL
      ══════════════════════════════════════════════ */}
      {composing && (
        <div style={{ position: "fixed", inset: 0, background: "#000000aa", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "linear-gradient(145deg,#0d1421,#0a1628)", border: "1px solid #fbbf2430", borderRadius: 22, padding: 30, width: 560, maxWidth: "92vw", boxShadow: "0 0 80px #fbbf2410" }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fbbf2415", border: "1px solid #fbbf2430", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon n="mail" s={20} c="#fbbf24" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 17, fontWeight: 900, color: "#f1f5f9", fontFamily: "'Outfit',sans-serif" }}>New Encrypted Email</div>
                <div style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: "#334155", marginTop: 2 }}>End-to-end encrypted · AES-256-GCM · TLS 1.3</div>
              </div>
              <button onClick={() => setComposing(false)} style={{ background: "#0a1628", border: "1px solid #1e2d40", borderRadius: 8, cursor: "pointer", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon n="close" s={14} c="#475569" />
              </button>
            </div>

            {/* To / Subject */}
            {[{ label: "TO", val: cTo, set: setCTo, ph: "recipient@domain.com" }, { label: "SUBJECT", val: cSubject, set: setCSubject, ph: "Email subject" }].map(f => (
              <div key={f.label} style={{ marginBottom: 12 }}>
                <label style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#334155", letterSpacing: 2, display: "block", marginBottom: 6 }}>{f.label}</label>
                <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} style={{ width: "100%", background: "#060d18", border: "1px solid #0f1e2e", borderRadius: 9, padding: "10px 12px", color: "#94a3b8", fontSize: 13, outline: "none", fontFamily: "'Outfit',sans-serif", boxSizing: "border-box" }} />
              </div>
            ))}

            {/* Algorithm */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#334155", letterSpacing: 2, display: "block", marginBottom: 6 }}>ALGORITHM</label>
              <div style={{ display: "flex", gap: 6 }}>
                {["AES-256-GCM","ChaCha20","XOR-Base64"].map(a => (
                  <button key={a} onClick={() => { setCAlgo(a); setCEncDone(false); setCEncBody(""); }} style={{ padding: "6px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "'Courier New',monospace", fontSize: 10, fontWeight: 700, background: cAlgo === a ? "#fbbf24" : "#060d18", color: cAlgo === a ? "#000" : "#334155", border: cAlgo === a ? "none" : "1px solid #1e2d40", transition: "all .15s" }}>{a}</button>
                ))}
              </div>
            </div>

            {/* Secret Key */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#334155", letterSpacing: 2, display: "block", marginBottom: 6 }}>SECRET KEY</label>
              <div style={{ position: "relative" }}>
                <input type={showCKey ? "text" : "password"} value={cKey} onChange={e => { setCKey(e.target.value); setCEncDone(false); setCEncBody(""); }} placeholder="Passphrase (blank = default)"
                  style={{ width: "100%", boxSizing: "border-box", background: "#060d18", border: "1px solid #0f1e2e", borderRadius: 9, padding: "10px 40px 10px 12px", color: "#94a3b8", fontSize: 13, outline: "none", fontFamily: "'Outfit',sans-serif" }} />
                <button onClick={() => setShowCKey(p => !p)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>
                  <Icon n={showCKey ? "eyeoff" : "eye"} s={15} c="#334155" />
                </button>
              </div>
            </div>

            {/* Message body */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#334155", letterSpacing: 2, display: "block", marginBottom: 6 }}>MESSAGE</label>
              <textarea value={cBody} onChange={e => { setCBody(e.target.value); setCEncDone(false); setCEncBody(""); }} placeholder="Write your confidential message…"
                style={{ width: "100%", minHeight: 110, background: "#060d18", border: "1px solid #0f1e2e", borderRadius: 9, padding: "10px 12px", color: "#94a3b8", fontSize: 13, outline: "none", fontFamily: "'Outfit',sans-serif", resize: "vertical", boxSizing: "border-box" }} />
            </div>

            {/* Encrypted body preview */}
            {cEncDone && cEncBody && (
              <div style={{ marginBottom: 14, padding: "10px 14px", background: "#060910", border: "1px solid #10b98130", borderRadius: 10 }}>
                <div style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#10b981", fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>✓ ENCRYPTED BODY READY</div>
                <pre style={{ margin: 0, fontFamily: "'Courier New',monospace", fontSize: 10, color: "#10b981aa", whiteSpace: "pre-wrap", wordBreak: "break-all", maxHeight: 70, overflowY: "auto" }}>{cEncBody}</pre>
              </div>
            )}

            {cErr && <div style={{ marginBottom: 12, fontSize: 11, color: "#f87171", fontFamily: "'Courier New',monospace" }}>⚠ {cErr}</div>}

            {/* Actions */}
            <div style={{ display: "flex", gap: 10 }}>
              {!cEncDone ? (
                <button onClick={encryptCompose} style={{ flex: 1, padding: "11px", background: "linear-gradient(135deg,#065f46,#10b981)", border: "none", borderRadius: 11, color: "#fff", fontFamily: "'Courier New',monospace", fontSize: 11, fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <Icon n="lock" s={14} c="#fff" /> ENCRYPT BODY
                </button>
              ) : (
                <button onClick={sendEmail} style={{ flex: 1, padding: "11px", background: "linear-gradient(135deg,#92400e,#fbbf24)", border: "none", borderRadius: 11, color: "#000", fontFamily: "'Courier New',monospace", fontSize: 11, fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <Icon n="send" s={14} c="#000" /> SEND ENCRYPTED
                </button>
              )}
              <button onClick={() => setComposing(false)} style={{ padding: "11px 22px", background: "#060d18", border: "1px solid #1e2d40", borderRadius: 11, color: "#64748b", fontFamily: "'Outfit',sans-serif", fontSize: 13, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: 28, right: 28, padding: "13px 22px", borderRadius: 12, fontFamily: "'Courier New',monospace", fontSize: 12, zIndex: 9999, display: "flex", alignItems: "center", gap: 10,
          background: toast.type === "error" ? "#2d0d0d" : "#052e16",
          border: `1px solid ${toast.type === "error" ? "#f8717135" : "#10b98135"}`,
          color: toast.type === "error" ? "#f87171" : "#10b981" }}>
          {toast.type === "error" ? "⚠" : "✅"} {toast.msg}
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════
//  DB EXPORT PAGE
// ══════════════════════════════════════════════
const DBExportPage = () => {
  const [host, setHost] = useState("localhost");
  const [port, setPort] = useState("3306");
  const [dbName, setDbName] = useState("cryptify_db");
  const [user, setUser] = useState("root");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [format, setFormat] = useState("sql");
  const [selectedTables, setSelectedTables] = useState(new Set(MOCK_TABLES.map(t => t.name)));
  const [encryptExport, setEncryptExport] = useState(true);
  const [dropTable, setDropTable] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTable, setCurrentTable] = useState("");
  const [done, setDone] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3500); };
  const toggleTable = (name) => setSelectedTables(prev => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n; });

  const runExport = async () => {
    if (!selectedTables.size) { showToast("Select at least one table."); return; }
    setExporting(true); setDone(false); setProgress(0);
    const tables = [...selectedTables];
    for (let i = 0; i < tables.length; i++) {
      setCurrentTable(tables[i]);
      await new Promise(r => setTimeout(r, 500 + Math.random() * 400));
      setProgress(Math.round(((i + 1) / tables.length) * 100));
    }
    setCurrentTable(""); setDone(true); setExporting(false);
    showToast(`Export complete! ${tables.length} tables exported as ${format.toUpperCase()}.`);
  };

  const FORMATS = [
    { id: "sql",  label: "SQL Dump", ext: ".sql",  desc: "Full schema + INSERTs", color: "#10b981" },
    { id: "csv",  label: "CSV",      ext: ".csv",  desc: "One file per table",    color: "#0ea5e9" },
    { id: "json", label: "JSON",     ext: ".json", desc: "Structured array",      color: "#a78bfa" },
    { id: "xlsx", label: "Excel",    ext: ".xlsx", desc: "Multi-sheet workbook",  color: "#fbbf24" },
  ];
  const fmt = FORMATS.find(f => f.id === format);

  return (
    <div style={{ padding: "32px 36px" }}>
      <p style={{ fontFamily: "'Courier New',monospace", fontSize: 11, color: "#334155", letterSpacing: "0.14em", marginBottom: 8 }}>CRYPTIFY · DB EXPORT MODULE</p>
      <h2 style={{ fontSize: 24, fontWeight: 900, color: "#f1f5f9", marginBottom: 4, fontFamily: "'Outfit',sans-serif" }}>DB <span style={{ color: "#0ea5e9" }}>Export</span></h2>
      <p style={{ fontSize: 13, color: "#475569", marginBottom: 28, fontFamily: "'Outfit',sans-serif" }}>Export your MySQL / MariaDB database to SQL, CSV, JSON, or Excel.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Connection */}
          <div style={{ background: "#0d1421", border: "1px solid #1e2d40", borderRadius: 16, padding: 20 }}>
            <div style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: "#334155", letterSpacing: 2, marginBottom: 14 }}>⚡ CONNECTION</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 90px", gap: 10, marginBottom: 10 }}>
              {[{ l: "HOST", v: host, s: setHost }, { l: "PORT", v: port, s: setPort }].map(f => (
                <div key={f.l}>
                  <label style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#334155", letterSpacing: 2, display: "block", marginBottom: 4 }}>{f.l}</label>
                  <input value={f.v} onChange={e => f.s(e.target.value)} style={{ width: "100%", background: "#060d18", border: "1px solid #0f1e2e", borderRadius: 8, padding: "8px 10px", color: "#94a3b8", fontSize: 12, outline: "none", fontFamily: "'Outfit',sans-serif", boxSizing: "border-box" }} />
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#334155", letterSpacing: 2, display: "block", marginBottom: 4 }}>DATABASE</label>
              <input value={dbName} onChange={e => setDbName(e.target.value)} style={{ width: "100%", background: "#060d18", border: "1px solid #0f1e2e", borderRadius: 8, padding: "8px 10px", color: "#94a3b8", fontSize: 12, outline: "none", fontFamily: "'Outfit',sans-serif", boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              <div>
                <label style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#334155", letterSpacing: 2, display: "block", marginBottom: 4 }}>USERNAME</label>
                <input value={user} onChange={e => setUser(e.target.value)} style={{ width: "100%", background: "#060d18", border: "1px solid #0f1e2e", borderRadius: 8, padding: "8px 10px", color: "#94a3b8", fontSize: 12, outline: "none", fontFamily: "'Outfit',sans-serif", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#334155", letterSpacing: 2, display: "block", marginBottom: 4 }}>PASSWORD</label>
                <div style={{ position: "relative" }}>
                  <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={{ width: "100%", background: "#060d18", border: "1px solid #0f1e2e", borderRadius: 8, padding: "8px 34px 8px 10px", color: "#94a3b8", fontSize: 12, outline: "none", fontFamily: "'Outfit',sans-serif", boxSizing: "border-box" }} />
                  <button onClick={() => setShowPw(p => !p)} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>
                    <Icon n={showPw ? "eyeoff" : "eye"} s={14} c="#334155" />
                  </button>
                </div>
              </div>
            </div>
            <div style={{ padding: "8px 12px", background: "#052e1666", border: "1px solid #10b98122", borderRadius: 8, fontFamily: "'Courier New',monospace", fontSize: 10, color: "#10b981" }}>
              ● MySQL 8.0 · {dbName} · {MOCK_TABLES.length} tables detected
            </div>
          </div>

          {/* Format */}
          <div style={{ background: "#0d1421", border: "1px solid #1e2d40", borderRadius: 16, padding: 20 }}>
            <div style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: "#334155", letterSpacing: 2, marginBottom: 14 }}>📦 EXPORT FORMAT</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {FORMATS.map(f => (
                <div key={f.id} onClick={() => setFormat(f.id)} style={{ border: `1px solid ${format === f.id ? f.color : "#1e2d40"}`, borderRadius: 10, padding: "12px 10px", cursor: "pointer", background: format === f.id ? f.color + "12" : "#060d18", position: "relative" }}>
                  <div style={{ fontWeight: 800, fontSize: 13, color: f.color, marginBottom: 2, fontFamily: "'Outfit',sans-serif" }}>{f.label}</div>
                  <div style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#334155" }}>{f.ext}</div>
                  <div style={{ fontSize: 11, color: "#475569", marginTop: 4, fontFamily: "'Outfit',sans-serif" }}>{f.desc}</div>
                  {format === f.id && <span style={{ position: "absolute", top: 8, right: 10, color: f.color, fontWeight: 900, fontSize: 14 }}>✓</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Options */}
          <div style={{ background: "#0d1421", border: "1px solid #1e2d40", borderRadius: 16, padding: 20 }}>
            <div style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: "#334155", letterSpacing: 2, marginBottom: 14 }}>⚙ OPTIONS</div>
            {[
              { label: "Encrypt export (AES-256-GCM)", val: encryptExport, set: setEncryptExport },
              { label: "Include DROP TABLE statements", val: dropTable, set: setDropTable },
            ].map((o, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "'Outfit',sans-serif" }}>{o.label}</span>
                <div onClick={() => o.set(p => !p)} style={{ width: 36, height: 18, borderRadius: 9, background: o.val ? "#10b981" : "#1e2d40", position: "relative", cursor: "pointer", transition: "background .2s" }}>
                  <div style={{ width: 14, height: 14, borderRadius: 7, background: "#fff", position: "absolute", top: 2, left: o.val ? 20 : 2, transition: "left .2s" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Table Selector */}
          <div style={{ background: "#0d1421", border: "1px solid #1e2d40", borderRadius: 16, padding: 20 }}>
            <div style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: "#334155", letterSpacing: 2, marginBottom: 14, display: "flex", justifyContent: "space-between" }}>
              <span>🗂 TABLES ({selectedTables.size}/{MOCK_TABLES.length})</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setSelectedTables(new Set(MOCK_TABLES.map(t => t.name)))} style={{ fontFamily: "'Courier New',monospace", fontSize: 9, padding: "2px 8px", background: "transparent", border: "1px solid #1e2d40", borderRadius: 4, color: "#475569", cursor: "pointer" }}>ALL</button>
                <button onClick={() => setSelectedTables(new Set())} style={{ fontFamily: "'Courier New',monospace", fontSize: 9, padding: "2px 8px", background: "transparent", border: "1px solid #1e2d40", borderRadius: 4, color: "#475569", cursor: "pointer" }}>NONE</button>
              </div>
            </div>
            {MOCK_TABLES.map(t => (
              <div key={t.name} onClick={() => toggleTable(t.name)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid #0a162812", cursor: "pointer" }}>
                <div style={{ width: 16, height: 16, borderRadius: 3, border: `1px solid ${selectedTables.has(t.name) ? "#10b981" : "#1e2d40"}`, background: selectedTables.has(t.name) ? "#10b98120" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#10b981" }}>
                  {selectedTables.has(t.name) ? "✓" : ""}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", fontFamily: "'Outfit',sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
                    {t.name}
                    {t.encrypted && <span style={{ fontSize: 9, background: "#10b98115", color: "#10b981", padding: "1px 5px", borderRadius: 4, fontFamily: "'Courier New',monospace" }}>🔒 enc</span>}
                  </div>
                  <div style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: "#334155" }}>{t.rows.toLocaleString()} rows · {t.size}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Export Panel */}
          <div style={{ background: "#0d1421", border: "1px solid #1e2d40", borderRadius: 16, padding: 20 }}>
            <div style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: "#334155", letterSpacing: 2, marginBottom: 14 }}>🚀 EXPORT</div>

            {exporting && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontFamily: "'Courier New',monospace", fontSize: 11, color: "#94a3b8", marginBottom: 6 }}>
                  Exporting <span style={{ color: "#0ea5e9" }}>{currentTable}</span>… {progress}%
                </div>
                <div style={{ height: 4, background: "#1e2d40", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: progress + "%", background: "linear-gradient(90deg,#065f46,#10b981)", borderRadius: 2, transition: "width .4s" }} />
                </div>
              </div>
            )}

            {done && !exporting && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#052e16", border: "1px solid #10b98130", borderRadius: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 22 }}>✅</span>
                <div>
                  <div style={{ fontWeight: 700, color: "#4ade80", fontFamily: "'Outfit',sans-serif" }}>Export Complete!</div>
                  <div style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: "#334155", marginTop: 2 }}>{selectedTables.size} tables · {fmt?.label}{encryptExport ? " · AES-256-GCM encrypted" : ""}</div>
                </div>
                <button style={{ marginLeft: "auto", padding: "6px 14px", background: "#10b981", border: "none", borderRadius: 6, color: "#000", fontWeight: 700, cursor: "pointer", fontFamily: "'Courier New',monospace", fontSize: 10 }}>⬇ DOWNLOAD</button>
              </div>
            )}

            <div style={{ background: "#060d18", borderRadius: 10, padding: 14, marginBottom: 14 }}>
              {[
                { k: "Format",     v: fmt?.label + " (" + fmt?.ext + ")", c: fmt?.color },
                { k: "Tables",     v: selectedTables.size + " selected" },
                { k: "Encryption", v: encryptExport ? "AES-256-GCM" : "None", c: encryptExport ? "#10b981" : "#64748b" },
                { k: "Est. Size",  v: "~13.5 MB" },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: i < 3 ? 8 : 0 }}>
                  <span style={{ color: "#334155", fontFamily: "'Courier New',monospace" }}>{row.k}</span>
                  <span style={{ color: row.c || "#94a3b8", fontFamily: "'Outfit',sans-serif" }}>{row.v}</span>
                </div>
              ))}
            </div>

            <button onClick={runExport} disabled={exporting} style={{ width: "100%", padding: "13px", borderRadius: 10, border: "none", background: exporting ? "#1e2d40" : "linear-gradient(135deg,#065f46,#10b981)", color: exporting ? "#334155" : "#fff", fontFamily: "'Courier New',monospace", fontSize: 12, fontWeight: 900, cursor: exporting ? "not-allowed" : "pointer", letterSpacing: 2 }}>
              {exporting ? "⏳  EXPORTING…" : "⬇  EXPORT DATABASE"}
            </button>
            <div style={{ textAlign: "center", fontFamily: "'Courier New',monospace", fontSize: 9, color: "#1e3a5f", marginTop: 10 }}>AES-256-GCM · RSA-2048 · TLS 1.3</div>
          </div>
        </div>
      </div>
      {toast && <div style={{ position: "fixed", bottom: 24, right: 24, padding: "12px 20px", borderRadius: 10, background: "#052e16", border: "1px solid #10b98140", color: "#10b981", fontFamily: "'Courier New',monospace", fontSize: 12, zIndex: 9999 }}>✅ {toast}</div>}
    </div>
  );
};

// ══════════════════════════════════════════════
//  REPORTS PAGE
// ══════════════════════════════════════════════
const ReportsPage = () => {
  const [range, setRange] = useState("7d");
  const [activeTab, setActiveTab] = useState("overview");
  const [filterOp, setFilterOp] = useState("ALL");
  const [toast, setToast] = useState(null);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const maxMonthly = Math.max(...MONTHLY_TREND.map(m => m.enc));

  const moduleUsage = [
    { name: "Text Crypto", pct: 42, color: "#10b981" },
    { name: "File Manager", pct: 28, color: "#0ea5e9" },
    { name: "Secure Email", pct: 18, color: "#a78bfa" },
    { name: "DB Export",    pct: 12, color: "#fbbf24" },
  ];

  const filteredLogs = AUDIT_LOGS.filter(l => filterOp === "ALL" || l.op === filterOp);

  return (
    <div style={{ padding: "32px 36px" }}>
      <p style={{ fontFamily: "'Courier New',monospace", fontSize: 11, color: "#334155", letterSpacing: "0.14em", marginBottom: 8 }}>CRYPTIFY · REPORTS & ANALYTICS</p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: "#f1f5f9", marginBottom: 4, fontFamily: "'Outfit',sans-serif" }}>Analytics <span style={{ color: "#a78bfa" }}>Reports</span></h2>
          <p style={{ fontSize: 13, color: "#475569", fontFamily: "'Outfit',sans-serif" }}>FRI MAR 06 2026 · <span style={{ color: "#10b981" }}>● ALL SYSTEMS OPERATIONAL</span></p>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["7d","30d","90d"].map(r => (
            <button key={r} onClick={() => setRange(r)} style={{ padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "'Courier New',monospace", fontSize: 10, background: range === r ? "#a78bfa20" : "#0d1421", color: range === r ? "#a78bfa" : "#334155", border: range === r ? "1px solid #a78bfa60" : "1px solid #1e2d40" }}>{r}</button>
          ))}
          <button onClick={() => showToast("Report exported!")} style={{ padding: "6px 16px", background: "linear-gradient(135deg,#4c1d95,#a78bfa)", border: "none", borderRadius: 8, color: "#fff", fontFamily: "'Courier New',monospace", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>⬇ EXPORT</button>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { l: "Total Encryptions", v: "1,284", d: "+12%",       c: "#10b981" },
          { l: "Total Decryptions", v: "962",   d: "+8%",        c: "#0ea5e9" },
          { l: "Files Secured",     v: "347",   d: "+23 today",  c: "#a78bfa" },
          { l: "Emails Sent",       v: "89",    d: "4 pending",  c: "#fbbf24" },
          { l: "Failed Ops",        v: "14",    d: "-3% week",   c: "#f87171" },
          { l: "Active Users",      v: "4",     d: "online now", c: "#34d399" },
        ].map((k, i) => (
          <div key={i} style={{ background: "#0d1421", border: "1px solid #1e2d40", borderTop: `2px solid ${k.c}`, borderRadius: 12, padding: "14px 12px" }}>
            <div style={{ fontFamily: "'Courier New',monospace", fontSize: 22, fontWeight: 900, color: k.c }}>{k.v}</div>
            <div style={{ fontSize: 11, color: "#475569", marginTop: 2, fontFamily: "'Outfit',sans-serif" }}>{k.l}</div>
            <div style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: k.c + "99", marginTop: 4 }}>{k.d}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {[{ id: "overview", l: "📊 OVERVIEW" }, { id: "logs", l: "📋 AUDIT LOGS" }, { id: "algo", l: "⚙ ALGORITHMS" }].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "'Courier New',monospace", fontSize: 10, background: activeTab === t.id ? "#a78bfa20" : "#0d1421", color: activeTab === t.id ? "#a78bfa" : "#334155", border: activeTab === t.id ? "1px solid #a78bfa50" : "1px solid #1e2d40" }}>{t.l}</button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Monthly Trend */}
          <div style={{ background: "#0d1421", border: "1px solid #1e2d40", borderRadius: 16, padding: 22, gridColumn: "span 2" }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", marginBottom: 18 }}>MONTHLY TREND <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: "#334155" }}>Last 7 months</span></div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 160 }}>
              {MONTHLY_TREND.map((m, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end" }}>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 3, width: "100%" }}>
                    <div style={{ flex: 1, height: Math.round((m.enc / maxMonthly) * 130), background: "linear-gradient(180deg,#10b981,#10b98155)", borderRadius: "4px 4px 0 0", minHeight: 4 }} />
                    <div style={{ flex: 1, height: Math.round((m.dec / maxMonthly) * 130), background: "linear-gradient(180deg,#0ea5e9,#0ea5e955)", borderRadius: "4px 4px 0 0", minHeight: 4 }} />
                  </div>
                  <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#334155" }}>{m.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Module Usage */}
          <div style={{ background: "#0d1421", border: "1px solid #1e2d40", borderRadius: 16, padding: 22 }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", marginBottom: 18 }}>MODULE USAGE</div>
            {moduleUsage.map((m, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "'Outfit',sans-serif" }}>{m.name}</span>
                  <span style={{ fontFamily: "'Courier New',monospace", fontSize: 11, color: m.color, fontWeight: 700 }}>{m.pct}%</span>
                </div>
                <div style={{ height: 6, background: "#1e2d40", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: m.pct + "%", background: m.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>

          {/* System Status */}
          <div style={{ background: "#0d1421", border: "1px solid #1e2d40", borderRadius: 16, padding: 22 }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", marginBottom: 18 }}>SYSTEM STATUS</div>
            {SYSTEM_STATUS.map((s, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: "#94a3b8", fontFamily: "'Outfit',sans-serif" }}>{s.label}</span>
                  <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: s.color, fontWeight: 700 }}>{s.status}</span>
                </div>
                <div style={{ height: 4, background: "#1e2d40", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: s.pct + "%", background: s.color, borderRadius: 2 }} />
                </div>
                <div style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#334155", marginTop: 2, textAlign: "right" }}>{s.pct}% uptime</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "logs" && (
        <div style={{ background: "#0d1421", border: "1px solid #1e2d40", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #0f1e2e", display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: "#334155" }}>FILTER:</span>
            {["ALL","ENCRYPT","DECRYPT"].map(op => (
              <button key={op} onClick={() => setFilterOp(op)} style={{ padding: "4px 10px", borderRadius: 6, border: "none", cursor: "pointer", fontFamily: "'Courier New',monospace", fontSize: 10, background: filterOp === op ? "#a78bfa20" : "#060d18", color: filterOp === op ? "#a78bfa" : "#334155", border: filterOp === op ? "1px solid #a78bfa40" : "1px solid #1e2d40" }}>{op}</button>
            ))}
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#060910" }}>
                {["#","User","Operation","Module","Time","Status"].map(h => (
                  <th key={h} style={{ padding: "10px 18px", textAlign: "left", fontSize: 10, color: "#334155", fontWeight: 700, letterSpacing: "0.12em", borderBottom: "1px solid #0f1e2e", fontFamily: "'Courier New',monospace" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map(log => (
                <tr key={log.id} style={{ borderBottom: "1px solid #0a1628" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#0d1e30"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px 18px" }}><span style={{ fontFamily: "'Courier New',monospace", fontSize: 11, color: "#1e3a5f" }}>{log.id}</span></td>
                  <td style={{ padding: "12px 18px", fontSize: 12, color: "#94a3b8", fontFamily: "'Outfit',sans-serif" }}>{log.user}</td>
                  <td style={{ padding: "12px 18px" }}>
                    <span style={{ fontFamily: "'Courier New',monospace", fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 700, background: log.op === "ENCRYPT" ? "#052e16" : "#1c1708", color: log.op === "ENCRYPT" ? "#4ade80" : "#fbbf24" }}>{log.op}</span>
                  </td>
                  <td style={{ padding: "12px 18px", fontSize: 12, color: "#64748b", fontFamily: "'Outfit',sans-serif" }}>{log.type}</td>
                  <td style={{ padding: "12px 18px" }}><span style={{ fontFamily: "'Courier New',monospace", fontSize: 11, color: "#334155" }}>{log.time}</span></td>
                  <td style={{ padding: "12px 18px" }}>
                    <span style={{ fontFamily: "'Courier New',monospace", fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 700, background: log.status === "success" ? "#052e16" : "#2d0d0d", color: log.status === "success" ? "#34d399" : "#f87171" }}>{log.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "algo" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
          {[
            { algo: "AES-256-GCM", count: 892, pct: 69, color: "#10b981", desc: "Industry-standard symmetric encryption" },
            { algo: "ChaCha20",    count: 254, pct: 20, color: "#0ea5e9", desc: "Stream cipher for high-speed encryption" },
            { algo: "XOR-Base64",  count: 138, pct: 11, color: "#a78bfa", desc: "Lightweight obfuscation layer" },
          ].map((a, i) => (
            <div key={i} style={{ background: "#0d1421", border: `1px solid ${a.color}33`, borderTop: `3px solid ${a.color}`, borderRadius: 14, padding: 20 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: a.color, marginBottom: 4, fontFamily: "'Courier New',monospace" }}>{a.algo}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#f1f5f9", fontFamily: "'Outfit',sans-serif" }}>{a.count.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "#475569", marginBottom: 14, fontFamily: "'Outfit',sans-serif" }}>operations</div>
              <div style={{ height: 6, background: "#1e2d40", borderRadius: 3, overflow: "hidden", marginBottom: 6 }}>
                <div style={{ height: "100%", width: a.pct + "%", background: a.color, borderRadius: 3 }} />
              </div>
              <div style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: a.color, marginBottom: 10 }}>{a.pct}% of total</div>
              <div style={{ fontSize: 11, color: "#334155", fontFamily: "'Outfit',sans-serif" }}>{a.desc}</div>
            </div>
          ))}
        </div>
      )}

      {toast && <div style={{ position: "fixed", bottom: 24, right: 24, padding: "12px 20px", borderRadius: 10, background: "#052e16", border: "1px solid #10b98140", color: "#10b981", fontFamily: "'Courier New',monospace", fontSize: 12, zIndex: 9999 }}>✅ {toast}</div>}
    </div>
  );
};

// ══════════════════════════════════════════════
//  ROOT DASHBOARD (wires everything together)
// ══════════════════════════════════════════════
const Dashboard = ({ user = { name: "Arpita" }, onLogout = () => {} }) => {
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <DashboardPage user={user} />;
      case "text":      return <TextCryptoPage />;
      case "files":     return <FileManagerPage />;
      case "email":     return <SecureEmailPage />;
      case "database":  return <DBExportPage />;
      case "reports":   return <ReportsPage />;
      default:          return <DashboardPage user={user} />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#060910" }}>
      <Sidebar page={page} setPage={setPage} user={user} onLogout={onLogout} />
      <main style={{ flex: 1, overflowY: "auto" }}>
        {renderPage()}
      </main>
    </div>
  );
};

export default Dashboard;
