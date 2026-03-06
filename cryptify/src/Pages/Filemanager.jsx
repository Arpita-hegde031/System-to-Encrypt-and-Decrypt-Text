import { useState, useRef } from "react";

// ─── SVG Icon helper ──────────────────────────────────────────────────────────
const Icon = ({ n, s = 16, c = "currentColor" }) => {
  const paths = {
    file:     "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
    lock:     "M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z",
    unlock:   "M13.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75M3.75 21.75h16.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z",
    upload:   "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5",
    download: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3",
    trash:    "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0",
    eye:      "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    eyeoff:   "M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88",
    key:      "M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z",
    shield:   "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
    search:   "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
    close:    "M6 18L18 6M6 6l12 12",
    check:    "M4.5 12.75l6 6 9-13.5",
    refresh:  "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99",
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[n]} />
    </svg>
  );
};

// ─── Initial mock data ────────────────────────────────────────────────────────
const INITIAL_FILES = [
  { id: 1,  name: "financial_report_Q4.pdf",  size: "2.4 MB", type: "PDF",  status: "encrypted", algo: "AES-256-GCM", date: "2026-03-06", decryptedAt: null },
  { id: 2,  name: "employee_data.xlsx",        size: "1.1 MB", type: "XLSX", status: "encrypted", algo: "ChaCha20",    date: "2026-03-05", decryptedAt: null },
  { id: 3,  name: "project_brief.docx",        size: "0.3 MB", type: "DOCX", status: "plain",     algo: null,         date: "2026-03-05", decryptedAt: null },
  { id: 4,  name: "backup_keys.zip",           size: "0.8 MB", type: "ZIP",  status: "encrypted", algo: "AES-256-GCM", date: "2026-03-04", decryptedAt: null },
  { id: 5,  name: "audit_trail_march.csv",     size: "5.2 MB", type: "CSV",  status: "plain",     algo: null,         date: "2026-03-04", decryptedAt: null },
  { id: 6,  name: "server_config.json",        size: "0.1 MB", type: "JSON", status: "encrypted", algo: "XOR-Base64", date: "2026-03-03", decryptedAt: null },
  { id: 7,  name: "client_contracts.pdf",      size: "3.7 MB", type: "PDF",  status: "decrypted", algo: "AES-256-GCM", date: "2026-03-02", decryptedAt: "09:14:32" },
  { id: 8,  name: "system_keys_backup.zip",    size: "0.5 MB", type: "ZIP",  status: "decrypted", algo: "ChaCha20",   date: "2026-03-01", decryptedAt: "14:22:11" },
];

const EXT_COLOR = { PDF: "#f87171", XLSX: "#4ade80", DOCX: "#60a5fa", ZIP: "#fbbf24", CSV: "#c084fc", JSON: "#34d399", PNG: "#fb923c", TXT: "#94a3b8" };
const ALGOS = ["AES-256-GCM", "ChaCha20", "XOR-Base64", "RSA-2048"];

// ─── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
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

// ═════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════
export default function FileManager() {
  const [files, setFiles]               = useState(INITIAL_FILES);
  const [activeTab, setActiveTab]       = useState("all");
  const [search, setSearch]             = useState("");
  const [dragOver, setDragOver]         = useState(false);
  const [toast, setToast]               = useState(null);

  // Encrypt modal state
  const [encModal, setEncModal]         = useState(null);
  const [encAlgo, setEncAlgo]           = useState("AES-256-GCM");
  const [encKey, setEncKey]             = useState("");
  const [showEncKey, setShowEncKey]     = useState(false);
  const [encrypting, setEncrypting]     = useState(false);
  const [encProgress, setEncProgress]   = useState(0);

  // Decrypt modal state
  const [decModal, setDecModal]         = useState(null);
  const [decAlgo, setDecAlgo]           = useState("AES-256-GCM");
  const [decKey, setDecKey]             = useState("");
  const [showDecKey, setShowDecKey]     = useState(false);
  const [decrypting, setDecrypting]     = useState(false);
  const [decProgress, setDecProgress]   = useState(0);

  const fileRef = useRef();

  // ── Helpers ────────────────────────────────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const addFile = (f) => {
    setFiles(prev => [{
      id: Date.now(),
      name: f.name,
      size: f.size > 0 ? (f.size / 1024 / 1024).toFixed(1) + " MB" : "0.0 MB",
      type: (f.name.split(".").pop() || "FILE").toUpperCase(),
      status: "plain",
      algo: null,
      date: new Date().toISOString().split("T")[0],
      decryptedAt: null,
    }, ...prev]);
    showToast(`"${f.name}" uploaded successfully!`);
  };

  const deleteFile = (id) => {
    const f = files.find(x => x.id === id);
    setFiles(prev => prev.filter(x => x.id !== id));
    showToast(`"${f?.name}" deleted.`, "warn");
  };

  // ── Encrypt flow ───────────────────────────────────────────────────────────
  const openEncModal = (file) => {
    setEncModal(file);
    setEncAlgo("AES-256-GCM");
    setEncKey("");
    setEncProgress(0);
    setEncrypting(false);
    setShowEncKey(false);
  };

  const runEncrypt = async () => {
    if (!encKey.trim()) { showToast("Enter an encryption key.", "error"); return; }
    setEncrypting(true);
    for (let i = 1; i <= 10; i++) {
      await new Promise(r => setTimeout(r, 100 + Math.random() * 80));
      setEncProgress(i * 10);
    }
    setEncrypting(false);
    setFiles(prev => prev.map(x => x.id === encModal.id
      ? { ...x, status: "encrypted", algo: encAlgo, decryptedAt: null }
      : x));
    showToast(`"${encModal.name}" encrypted with ${encAlgo}!`);
    setEncModal(null);
  };

  // ── Decrypt flow ───────────────────────────────────────────────────────────
  const openDecModal = (file) => {
    setDecModal(file);
    setDecAlgo(file.algo || "AES-256-GCM");
    setDecKey("");
    setDecProgress(0);
    setDecrypting(false);
    setShowDecKey(false);
  };

  const runDecrypt = async () => {
    if (!decKey.trim()) { showToast("Enter the decryption key.", "error"); return; }
    setDecrypting(true);
    for (let i = 1; i <= 10; i++) {
      await new Promise(r => setTimeout(r, 100 + Math.random() * 80));
      setDecProgress(i * 10);
    }
    setDecrypting(false);
    const now = new Date().toLocaleTimeString("en-US", { hour12: false });
    setFiles(prev => prev.map(x => x.id === decModal.id
      ? { ...x, status: "decrypted", decryptedAt: now }
      : x));
    showToast(`"${decModal.name}" decrypted successfully!`);
    setDecModal(null);
  };

  // ── Filtered file lists ────────────────────────────────────────────────────
  const encryptedFiles = files.filter(f => f.status === "encrypted");
  const decryptedFiles = files.filter(f => f.status === "decrypted");
  const plainFiles     = files.filter(f => f.status === "plain");

  const filtered = (list) =>
    list.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  const displayList =
    activeTab === "encrypted" ? filtered(encryptedFiles) :
    activeTab === "decrypted" ? filtered(decryptedFiles) :
    activeTab === "plain"     ? filtered(plainFiles)     :
    filtered(files);

  // ─── Progress bar helper ───────────────────────────────────────────────────
  const ProgressBar = ({ pct, color }) => (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color }}>Processing… {pct}%</span>
        <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: "#334155" }}>{pct === 100 ? "✓ Done" : "In progress"}</span>
      </div>
      <div style={{ height: 6, background: "#1e2d40", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: pct + "%", background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: 3, transition: "width .15s ease" }} />
      </div>
    </div>
  );

  // ─── File row ──────────────────────────────────────────────────────────────
  const FileRow = ({ f }) => {
    const extColor = EXT_COLOR[f.type] || "#94a3b8";
    return (
      <tr
        style={{ borderBottom: "1px solid #0a1628", transition: "background .1s" }}
        onMouseEnter={e => e.currentTarget.style.background = "#0d1e30"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        {/* File name */}
        <td style={{ padding: "13px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: extColor + "18", border: `1px solid ${extColor}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon n="file" s={16} c={extColor} />
              </div>
              <span style={{ position: "absolute", bottom: -4, right: -4, fontSize: 10, lineHeight: 1 }}>
                {f.status === "encrypted" ? "🔒" : f.status === "decrypted" ? "🔓" : ""}
              </span>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#c8d3e0", fontFamily: "'Outfit',sans-serif" }}>{f.name}</div>
              {f.status === "decrypted" && f.decryptedAt && (
                <div style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#0ea5e9", marginTop: 2 }}>
                  🔓 Decrypted at {f.decryptedAt}
                </div>
              )}
              {f.status === "encrypted" && (
                <div style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#10b981", marginTop: 2 }}>
                  🔒 Encrypted · {f.algo}
                </div>
              )}
            </div>
          </div>
        </td>

        {/* Type */}
        <td style={{ padding: "13px 14px" }}>
          <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10, padding: "2px 8px", borderRadius: 6, background: extColor + "18", color: extColor, border: `1px solid ${extColor}28` }}>{f.type}</span>
        </td>

        {/* Size */}
        <td style={{ padding: "13px 14px", fontSize: 12, color: "#475569", fontFamily: "'Courier New',monospace" }}>{f.size}</td>

        {/* Date */}
        <td style={{ padding: "13px 14px", fontSize: 11, color: "#2d4a6e", fontFamily: "'Courier New',monospace" }}>{f.date}</td>

        {/* Algorithm */}
        <td style={{ padding: "13px 14px" }}>
          {f.algo
            ? <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, padding: "2px 8px", borderRadius: 5, background: "#10b98112", color: "#10b981", border: "1px solid #10b98128" }}>{f.algo}</span>
            : <span style={{ fontSize: 11, color: "#1e3a5f" }}>—</span>
          }
        </td>

        {/* Status */}
        <td style={{ padding: "13px 14px" }}>
          <StatusBadge status={f.status} />
        </td>

        {/* Actions */}
        <td style={{ padding: "13px 14px" }}>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            {f.status === "plain" && (
              <button onClick={() => openEncModal(f)} title="Encrypt" style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 11px", background: "#052e16", border: "1px solid #10b98135", borderRadius: 7, color: "#10b981", fontSize: 10, cursor: "pointer", fontFamily: "'Courier New',monospace", fontWeight: 700, whiteSpace: "nowrap" }}>
                <Icon n="lock" s={11} c="#10b981" /> ENCRYPT
              </button>
            )}
            {f.status === "encrypted" && (
              <button onClick={() => openDecModal(f)} title="Decrypt" style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 11px", background: "#0c2340", border: "1px solid #0ea5e935", borderRadius: 7, color: "#38bdf8", fontSize: 10, cursor: "pointer", fontFamily: "'Courier New',monospace", fontWeight: 700, whiteSpace: "nowrap" }}>
                <Icon n="unlock" s={11} c="#38bdf8" /> DECRYPT
              </button>
            )}
            {f.status === "decrypted" && (
              <button onClick={() => openEncModal(f)} title="Re-encrypt" style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 11px", background: "#052e16", border: "1px solid #10b98135", borderRadius: 7, color: "#10b981", fontSize: 10, cursor: "pointer", fontFamily: "'Courier New',monospace", fontWeight: 700, whiteSpace: "nowrap" }}>
                <Icon n="refresh" s={11} c="#10b981" /> RE-ENC
              </button>
            )}
            <button onClick={() => showToast("Downloading…")} title="Download" style={{ padding: "5px 7px", background: "#0a1628", border: "1px solid #1e2d40", borderRadius: 7, cursor: "pointer", display: "flex", alignItems: "center" }}>
              <Icon n="download" s={13} c="#475569" />
            </button>
            <button onClick={() => deleteFile(f.id)} title="Delete" style={{ padding: "5px 7px", background: "#2d0d0d", border: "1px solid #f8717128", borderRadius: 7, cursor: "pointer", display: "flex", alignItems: "center" }}>
              <Icon n="trash" s={13} c="#f87171" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  // ─── Empty state ───────────────────────────────────────────────────────────
  const EmptyState = ({ tab }) => {
    const cfg = {
      encrypted: { icon: "🔒", msg: "No encrypted files", sub: "Encrypt a plain file to see it here" },
      decrypted: { icon: "🔓", msg: "No decrypted files", sub: "Decrypt an encrypted file to see it here" },
      plain:     { icon: "📄", msg: "No plain files",     sub: "Upload a file to get started" },
      all:       { icon: "📁", msg: "No files found",     sub: "Upload your first file above" },
    }[tab] || {};
    return (
      <tr>
        <td colSpan={7}>
          <div style={{ padding: "52px", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{cfg.icon}</div>
            <div style={{ fontSize: 15, color: "#334155", fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>{cfg.msg}</div>
            <div style={{ fontSize: 12, color: "#1e3a5f", marginTop: 6, fontFamily: "'Courier New',monospace" }}>{cfg.sub}</div>
          </div>
        </td>
      </tr>
    );
  };

  // ─── Modal shell ──────────────────────────────────────────────────────────
  const Modal = ({ onClose, accentColor, title, icon, children }) => (
    <div style={{ position: "fixed", inset: 0, background: "#000000bb", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(6px)" }}>
      <div style={{ background: "linear-gradient(145deg,#0d1421,#0a1628)", border: `1px solid ${accentColor}35`, borderRadius: 22, padding: 30, width: 520, maxWidth: "92vw", boxShadow: `0 0 80px ${accentColor}18` }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <div style={{ width: 46, height: 46, borderRadius: 14, background: accentColor + "18", border: `1px solid ${accentColor}35`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: "#f1f5f9", fontFamily: "'Outfit',sans-serif" }}>{title}</div>
            <div style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: "#334155", marginTop: 2 }}>AES-256-GCM · RSA-2048 · TLS 1.3</div>
          </div>
          <button onClick={onClose} style={{ background: "#0a1628", border: "1px solid #1e2d40", borderRadius: 8, cursor: "pointer", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon n="close" s={14} c="#475569" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );

  // ─── Key input row ─────────────────────────────────────────────────────────
  const KeyInput = ({ value, onChange, show, onToggle, placeholder, accentColor }) => (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
        <Icon n="key" s={15} c={accentColor} />
      </div>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: "100%", background: "#060d18", border: `1px solid ${accentColor}35`, borderRadius: 10, padding: "11px 44px 11px 36px", color: "#94a3b8", fontSize: 13, outline: "none", fontFamily: "'Outfit',sans-serif", boxSizing: "border-box" }}
      />
      <button onClick={onToggle} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>
        <Icon n={show ? "eyeoff" : "eye"} s={15} c="#334155" />
      </button>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  const TABS = [
    { id: "all",       label: "All Files",   count: files.length,          color: "#a78bfa" },
    { id: "encrypted", label: "🔒 Encrypted", count: encryptedFiles.length, color: "#10b981" },
    { id: "decrypted", label: "🔓 Decrypted", count: decryptedFiles.length, color: "#38bdf8" },
    { id: "plain",     label: "⚠ Plain",     count: plainFiles.length,     color: "#f87171" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#060910", padding: "32px 40px", fontFamily: "'Outfit',sans-serif" }}>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ fontFamily: "'Courier New',monospace", fontSize: 11, color: "#334155", letterSpacing: "0.14em", marginBottom: 8 }}>
          CRYPTIFY · FILE MANAGER MODULE
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: "#f1f5f9", margin: 0, lineHeight: 1.1 }}>
              File <span style={{ background: "linear-gradient(135deg,#a78bfa,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Manager</span>
            </h1>
            <p style={{ fontSize: 13, color: "#475569", marginTop: 6 }}>
              Upload · Encrypt · Decrypt · Organise your secure files
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 20, background: "#052e16", border: "1px solid #10b98133" }}>
            <Icon n="shield" s={14} c="#10b981" />
            <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: "#10b981", fontWeight: 700 }}>END-TO-END SECURED</span>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 24 }}>
        {[
          { label: "Total Files",  val: files.length,          color: "#a78bfa", icon: "📁", sub: "in vault" },
          { label: "Encrypted",    val: encryptedFiles.length, color: "#10b981", icon: "🔒", sub: "locked & safe" },
          { label: "Decrypted",    val: decryptedFiles.length, color: "#38bdf8", icon: "🔓", sub: "accessible" },
          { label: "Plain / Raw",  val: plainFiles.length,     color: "#f87171", icon: "⚠",  sub: "needs encryption" },
        ].map((s, i) => (
          <div key={i} style={{ background: "linear-gradient(145deg,#0d1421,#0a1628)", border: "1px solid #1e2d40", borderTop: `2px solid ${s.color}`, borderRadius: 14, padding: "16px 20px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 12, right: 14, fontSize: 22, opacity: 0.15 }}>{s.icon}</div>
            <div style={{ fontFamily: "'Courier New',monospace", fontSize: 28, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginTop: 4 }}>{s.label}</div>
            <div style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: s.color + "80", marginTop: 3 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Upload Drop Zone ── */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) addFile(f); }}
        onClick={() => fileRef.current.click()}
        style={{ border: `2px dashed ${dragOver ? "#a78bfa" : "#1e2d40"}`, borderRadius: 16, padding: "26px 40px", textAlign: "center", marginBottom: 24, cursor: "pointer", background: dragOver ? "#a78bfa08" : "transparent", transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}
      >
        <input ref={fileRef} type="file" style={{ display: "none" }} multiple onChange={e => { Array.from(e.target.files).forEach(addFile); e.target.value = ""; }} />
        <div style={{ width: 48, height: 48, borderRadius: 14, background: dragOver ? "#a78bfa22" : "#1e2d40", display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s" }}>
          <Icon n="upload" s={24} c={dragOver ? "#a78bfa" : "#475569"} />
        </div>
        <div>
          <div style={{ fontSize: 15, color: dragOver ? "#a78bfa" : "#94a3b8", fontWeight: 600 }}>
            {dragOver ? "Release to upload" : <>Drop files here or <span style={{ color: "#a78bfa" }}>browse</span></>}
          </div>
          <div style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: "#334155", marginTop: 3 }}>
            AES-256-GCM · RSA-2048 · TLS 1.3 · All formats supported
          </div>
        </div>
      </div>

      {/* ── Tabs + Search ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12 }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, background: "#0d1421", border: "1px solid #1e2d40", borderRadius: 12, padding: 5 }}>
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{ padding: "8px 16px", borderRadius: 9, border: "none", cursor: "pointer", fontFamily: "'Courier New',monospace", fontSize: 10, fontWeight: 700, letterSpacing: 0.8, background: activeTab === t.id ? t.color + "22" : "transparent", color: activeTab === t.id ? t.color : "#334155", border: activeTab === t.id ? `1px solid ${t.color}45` : "1px solid transparent", transition: "all .15s", display: "flex", alignItems: "center", gap: 6 }}
            >
              {t.label}
              <span style={{ background: activeTab === t.id ? t.color : "#1e2d40", color: activeTab === t.id ? (t.color === "#f87171" ? "#000" : "#000") : "#475569", padding: "1px 7px", borderRadius: 10, fontSize: 9, fontWeight: 900 }}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: "relative", minWidth: 240 }}>
          <div style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)" }}>
            <Icon n="search" s={14} c="#334155" />
          </div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search files…"
            style={{ width: "100%", background: "#0d1421", border: "1px solid #1e2d40", borderRadius: 10, padding: "9px 12px 9px 34px", color: "#94a3b8", fontSize: 12, outline: "none", fontFamily: "'Outfit',sans-serif", boxSizing: "border-box" }}
          />
        </div>
      </div>

      {/* ── Section Divider ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg,#1e2d40,transparent)" }} />
        <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#2d4a6e", letterSpacing: 3 }}>
          {activeTab === "encrypted" ? "🔒 ENCRYPTED FILES — LOCKED & SECURED" :
           activeTab === "decrypted" ? "🔓 DECRYPTED FILES — PLAINTEXT ACCESSIBLE" :
           activeTab === "plain"     ? "⚠ PLAIN FILES — ENCRYPTION RECOMMENDED" :
           "📁 ALL FILES IN VAULT"}
        </span>
        <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg,transparent,#1e2d40)" }} />
      </div>

      {/* ── File Table ── */}
      <div style={{ background: "#0d1421", border: "1px solid #1e2d40", borderRadius: 16, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#060910" }}>
              {["File Name", "Type", "Size", "Date", "Algorithm", "Status", "Actions"].map(h => (
                <th key={h} style={{ padding: "11px 18px", textAlign: "left", fontSize: 9, color: "#2d4a6e", fontWeight: 700, letterSpacing: "0.14em", borderBottom: "1px solid #0f1e2e", fontFamily: "'Courier New',monospace" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayList.length === 0
              ? <EmptyState tab={activeTab} />
              : displayList.map(f => <FileRow key={f.id} f={f} />)
            }
          </tbody>
        </table>

        {/* Table footer */}
        <div style={{ padding: "10px 20px", borderTop: "1px solid #0f1e2e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: "#2d4a6e" }}>
            Showing {displayList.length} of {files.length} files
          </span>
          <span style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#1e3a5f" }}>
            AES-256-GCM · RSA-2048 · TLS 1.3
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
           ENCRYPT MODAL
      ══════════════════════════════════════════════ */}
      {encModal && (
        <Modal onClose={() => setEncModal(null)} accentColor="#10b981" title="Encrypt File" icon={<Icon n="lock" s={22} c="#10b981" />}>

          {/* File card */}
          <div style={{ background: "#060d18", border: "1px solid #0f1e2e", borderRadius: 12, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: (EXT_COLOR[encModal.type] || "#94a3b8") + "18", border: `1px solid ${(EXT_COLOR[encModal.type] || "#94a3b8")}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon n="file" s={17} c={EXT_COLOR[encModal.type] || "#94a3b8"} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8" }}>{encModal.name}</div>
              <div style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: "#334155" }}>{encModal.size} · {encModal.type}</div>
            </div>
            <StatusBadge status={encModal.status} />
          </div>

          {/* Algorithm */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#334155", letterSpacing: 2, display: "block", marginBottom: 8 }}>ENCRYPTION ALGORITHM</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {ALGOS.map(a => (
                <button key={a} onClick={() => setEncAlgo(a)} style={{ padding: "7px 13px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "'Courier New',monospace", fontSize: 10, fontWeight: 700, background: encAlgo === a ? "#10b981" : "#060d18", color: encAlgo === a ? "#000" : "#334155", border: encAlgo === a ? "none" : "1px solid #1e2d40", transition: "all .15s" }}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Key */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#334155", letterSpacing: 2, display: "block", marginBottom: 8 }}>ENCRYPTION KEY</label>
            <KeyInput value={encKey} onChange={setEncKey} show={showEncKey} onToggle={() => setShowEncKey(p => !p)} placeholder="Enter a strong secret key…" accentColor="#10b981" />
            <div style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#1e3a5f", marginTop: 6 }}>
              ⚠ Keep this key safe — it's required to decrypt the file later
            </div>
          </div>

          {/* Progress */}
          {encrypting && <ProgressBar pct={encProgress} color="#10b981" />}

          {/* Actions */}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={runEncrypt} disabled={encrypting} style={{ flex: 1, padding: "12px", background: encrypting ? "#1e2d40" : "linear-gradient(135deg,#065f46,#10b981)", border: "none", borderRadius: 11, color: encrypting ? "#334155" : "#fff", fontFamily: "'Courier New',monospace", fontSize: 11, fontWeight: 900, cursor: encrypting ? "not-allowed" : "pointer", letterSpacing: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Icon n="lock" s={14} c={encrypting ? "#334155" : "#fff"} />
              {encrypting ? "ENCRYPTING…" : "ENCRYPT FILE"}
            </button>
            <button onClick={() => setEncModal(null)} style={{ padding: "12px 22px", background: "#060d18", border: "1px solid #1e2d40", borderRadius: 11, color: "#64748b", fontSize: 13, cursor: "pointer" }}>Cancel</button>
          </div>
        </Modal>
      )}

      {/* ══════════════════════════════════════════════
           DECRYPT MODAL
      ══════════════════════════════════════════════ */}
      {decModal && (
        <Modal onClose={() => setDecModal(null)} accentColor="#0ea5e9" title="Decrypt File" icon={<Icon n="unlock" s={22} c="#38bdf8" />}>

          {/* File card */}
          <div style={{ background: "#060d18", border: "1px solid #0ea5e918", borderRadius: 12, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: (EXT_COLOR[decModal.type] || "#94a3b8") + "18", border: `1px solid ${(EXT_COLOR[decModal.type] || "#94a3b8")}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon n="file" s={17} c={EXT_COLOR[decModal.type] || "#94a3b8"} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8" }}>{decModal.name}</div>
              <div style={{ fontFamily: "'Courier New',monospace", fontSize: 10, color: "#334155" }}>{decModal.size} · Encrypted with {decModal.algo}</div>
            </div>
            <StatusBadge status={decModal.status} />
          </div>

          {/* Algorithm — pre-selected to match how file was encrypted */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#334155", letterSpacing: 2, display: "block", marginBottom: 8 }}>DECRYPTION ALGORITHM</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {ALGOS.map(a => (
                <button key={a} onClick={() => setDecAlgo(a)} style={{ padding: "7px 13px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "'Courier New',monospace", fontSize: 10, fontWeight: 700, background: decAlgo === a ? "#0ea5e9" : "#060d18", color: decAlgo === a ? "#000" : "#334155", border: decAlgo === a ? "none" : "1px solid #1e2d40", transition: "all .15s" }}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Key */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#334155", letterSpacing: 2, display: "block", marginBottom: 8 }}>DECRYPTION KEY</label>
            <KeyInput value={decKey} onChange={setDecKey} show={showDecKey} onToggle={() => setShowDecKey(p => !p)} placeholder="Enter the secret key used during encryption…" accentColor="#0ea5e9" />
            <div style={{ fontFamily: "'Courier New',monospace", fontSize: 9, color: "#1e3a5f", marginTop: 6 }}>
              ℹ This must match the key used when the file was encrypted
            </div>
          </div>

          {/* Progress */}
          {decrypting && <ProgressBar pct={decProgress} color="#0ea5e9" />}

          {/* Actions */}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={runDecrypt} disabled={decrypting} style={{ flex: 1, padding: "12px", background: decrypting ? "#1e2d40" : "linear-gradient(135deg,#1e3a5f,#0ea5e9)", border: "none", borderRadius: 11, color: decrypting ? "#334155" : "#fff", fontFamily: "'Courier New',monospace", fontSize: 11, fontWeight: 900, cursor: decrypting ? "not-allowed" : "pointer", letterSpacing: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Icon n="unlock" s={14} c={decrypting ? "#334155" : "#fff"} />
              {decrypting ? "DECRYPTING…" : "DECRYPT FILE"}
            </button>
            <button onClick={() => setDecModal(null)} style={{ padding: "12px 22px", background: "#060d18", border: "1px solid #1e2d40", borderRadius: 11, color: "#64748b", fontSize: 13, cursor: "pointer" }}>Cancel</button>
          </div>
        </Modal>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div style={{ position: "fixed", bottom: 28, right: 28, padding: "13px 22px", borderRadius: 12, fontFamily: "'Courier New',monospace", fontSize: 12, zIndex: 9999, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 32px #00000060",
          background: toast.type === "error" ? "#2d0d0d" : toast.type === "warn" ? "#1c1708" : "#052e16",
          border: `1px solid ${toast.type === "error" ? "#f8717135" : toast.type === "warn" ? "#fbbf2435" : "#10b98135"}`,
          color: toast.type === "error" ? "#f87171" : toast.type === "warn" ? "#fbbf24" : "#10b981",
        }}>
          <span>{toast.type === "error" ? "⚠" : toast.type === "warn" ? "🗑" : "✅"}</span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
