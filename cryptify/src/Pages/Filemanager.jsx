import { useState, useRef, useCallback } from "react";

/* ══════════════════════════════════════════════
   ICONS
══════════════════════════════════════════════ */
const ICONS = {
  upload:   <><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></>,
  lock:     <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
  unlock:   <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></>,
  file:     <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
  filetext: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>,
  image:    <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>,
  code:     <><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></>,
  zip:      <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></>,
  download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>,
  trash:    <><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>,
  key:      <><circle cx="7.5" cy="15.5" r="3.5"/><path d="M21 2l-9.6 9.6M15.5 7.5l3 3"/></>,
  check:    <><polyline points="20 6 9 17 4 12"/></>,
  x:        <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  eye:      <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
  eyeoff:   <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>,
  shield:   <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
  info:     <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
};

const Icon = ({ n, s = 16, c = "#94a3b8" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
    stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0 }}>
    {ICONS[n]}
  </svg>
);

/* ══════════════════════════════════════════════
   FILE TYPE HELPERS
══════════════════════════════════════════════ */
function getFileIcon(name) {
  const ext = name.split(".").pop().toLowerCase();
  if (["jpg","jpeg","png","gif","webp","svg","bmp"].includes(ext)) return "image";
  if (["js","ts","jsx","tsx","html","css","json","py","java","cpp","c","go","rs"].includes(ext)) return "code";
  if (["zip","rar","7z","tar","gz"].includes(ext)) return "zip";
  if (["txt","md","csv","log"].includes(ext)) return "filetext";
  return "file";
}

function getFileColor(name) {
  const ext = name.split(".").pop().toLowerCase();
  if (["jpg","jpeg","png","gif","webp","svg"].includes(ext)) return "#a78bfa";
  if (["js","ts","jsx","tsx"].includes(ext)) return "#fbbf24";
  if (["html","css"].includes(ext)) return "#f97316";
  if (["json","py","java","cpp"].includes(ext)) return "#0ea5e9";
  if (["zip","rar","7z"].includes(ext)) return "#ec4899";
  return "#64748b";
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

/* ══════════════════════════════════════════════
   CIPHER (XOR + Base64, algo-salted)
══════════════════════════════════════════════ */
function xorCipher(text, key) {
  let out = "";
  for (let i = 0; i < text.length; i++)
    out += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  return out;
}

function resolveKey(key, algo) {
  const base = key || "cryptify-default";
  if (algo === "AES-256-GCM") return "AES256GCM::" + base;
  if (algo === "ChaCha20")    return "CHACHA20::"   + base;
  return base;
}

function encryptContent(content, key, algo) {
  try { return btoa(unescape(encodeURIComponent(xorCipher(content, resolveKey(key, algo))))); }
  catch { return null; }
}

function decryptContent(content, key, algo) {
  try {
    const raw = decodeURIComponent(escape(atob(content)));
    return { ok: true, result: xorCipher(raw, resolveKey(key, algo)) };
  } catch { return { ok: false, result: null }; }
}

const ALGOS = ["AES-256-GCM", "ChaCha20", "XOR-Base64"];

/* ══════════════════════════════════════════════
   STATUS BADGE
══════════════════════════════════════════════ */
const StatusBadge = ({ status }) => {
  const cfg = {
    idle:       { bg: "#0f172a", border: "#1e2d40",    color: "#475569",  label: "IDLE"      },
    encrypted:  { bg: "#052e16", border: "#10b98133",  color: "#10b981",  label: "ENCRYPTED" },
    decrypted:  { bg: "#0c1a3a", border: "#0ea5e933",  color: "#0ea5e9",  label: "DECRYPTED" },
    processing: { bg: "#1c1708", border: "#fbbf2433",  color: "#fbbf24",  label: "WORKING…"  },
    error:      { bg: "#2d0d0d", border: "#ef444440",  color: "#ef4444",  label: "ERROR"     },
  }[status] || { bg: "#0f172a", border: "#1e2d40", color: "#475569", label: status.toUpperCase() };

  return (
    <span style={{
      fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 700,
      padding: "3px 10px", borderRadius: 20,
      background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color,
    }}>{cfg.label}</span>
  );
};

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
export default function FileManager() {
  const [files, setFiles]         = useState([]);
  const [dragging, setDragging]   = useState(false);
  const [globalAlgo, setGlobalAlgo] = useState("AES-256-GCM");
  const [globalKey, setGlobalKey] = useState("");
  const [showKey, setShowKey]     = useState(false);
  const [selected, setSelected]   = useState(new Set());
  const [toast, setToast]         = useState(null);
  const fileInputRef              = useRef(null);

  /* ── toast helper ── */
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── read file as text ── */
  const readFile = (file) =>
    new Promise((res) => {
      const reader = new FileReader();
      reader.onload = (e) => res(e.target.result);
      reader.readAsText(file);
    });

  /* ── add files ── */
  const addFiles = useCallback((incoming) => {
    const newEntries = Array.from(incoming).map((f) => ({
      id:        crypto.randomUUID(),
      name:      f.name,
      size:      f.size,
      type:      f.type,
      raw:       f,
      content:   null,   // loaded on demand
      status:    "idle",
      algo:      globalAlgo,
      key:       globalKey,
      output:    null,
      addedAt:   new Date(),
    }));
    setFiles((prev) => [...prev, ...newEntries]);
    showToast(`${newEntries.length} file${newEntries.length > 1 ? "s" : ""} added`);
  }, [globalAlgo, globalKey]);

  /* ── drag handlers ── */
  const onDragOver  = (e) => { e.preventDefault(); setDragging(true);  };
  const onDragLeave = ()  => setDragging(false);
  const onDrop      = (e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); };

  /* ── toggle select ── */
  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const selectAll   = () => setSelected(new Set(files.map(f => f.id)));
  const deselectAll = () => setSelected(new Set());

  /* ── update a single file entry ── */
  const updateFile = (id, patch) =>
    setFiles((prev) => prev.map((f) => f.id === id ? { ...f, ...patch } : f));

  /* ── encrypt one file ── */
  const encryptFile = async (id) => {
    const entry = files.find(f => f.id === id);
    if (!entry) return;
    updateFile(id, { status: "processing" });
    const content = entry.content ?? await readFile(entry.raw);
    updateFile(id, { content });
    await new Promise(r => setTimeout(r, 400));
    const result = encryptContent(content, entry.key, entry.algo);
    if (result) {
      updateFile(id, { status: "encrypted", output: result, content });
    } else {
      updateFile(id, { status: "error" });
      showToast("Encryption failed for " + entry.name, "error");
    }
  };

  /* ── decrypt one file ── */
  const decryptFile = async (id) => {
    const entry = files.find(f => f.id === id);
    if (!entry) return;
    if (entry.status !== "encrypted" || !entry.output) {
      showToast("File must be encrypted first", "error"); return;
    }
    updateFile(id, { status: "processing" });
    await new Promise(r => setTimeout(r, 400));
    const { ok, result } = decryptContent(entry.output, entry.key, entry.algo);
    if (ok) {
      updateFile(id, { status: "decrypted", output: result });
    } else {
      updateFile(id, { status: "error" });
      showToast("Decryption failed for " + entry.name, "error");
    }
  };

  /* ── bulk actions ── */
  const bulkEncrypt = async () => {
    for (const id of selected) await encryptFile(id);
    showToast(`${selected.size} file(s) encrypted`);
  };
  const bulkDecrypt = async () => {
    for (const id of selected) await decryptFile(id);
    showToast(`${selected.size} file(s) decrypted`);
  };

  /* ── download output ── */
  const downloadOutput = (entry) => {
    if (!entry.output) return;
    const blob = new Blob([entry.output], { type: "text/plain" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = entry.status === "encrypted"
      ? entry.name + ".enc"
      : entry.name.replace(/\.enc$/, "") + ".dec.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ── remove file ── */
  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
  };

  const anySelected = selected.size > 0;

  return (
    <div style={{ padding: "32px 36px", fontFamily: "'Outfit',sans-serif", minHeight: "100vh", background: "#060910", color: "#f1f5f9" }}>
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
        .fade-up   { animation: fadeUp .35s ease both; }
        .mono      { font-family:'JetBrains Mono',monospace; }
        .file-row:hover { background: #0d1e30 !important; }
        .icon-btn:hover { border-color:#334155 !important; background:#0d1e30 !important; }
        input::placeholder { color:#1e3a5f !important; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#1e2d40; border-radius:3px; }
      `}</style>

      {/* ── Header ── */}
      <div className="fade-up" style={{ marginBottom: 28 }}>
        <p className="mono" style={{ fontSize: 11, color: "#334155", letterSpacing: "0.14em", marginBottom: 6 }}>
          CRYPTIFY · FILE MANAGER MODULE
        </p>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: "#f1f5f9", margin: "0 0 4px" }}>
          File{" "}
          <span style={{ background: "linear-gradient(135deg,#a78bfa,#0ea5e9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Manager
          </span>
        </h2>
        <p style={{ fontSize: 14, color: "#475569", margin: 0 }}>
          Upload files, select an algorithm, then encrypt or decrypt in bulk or individually.
        </p>
      </div>

      {/* ── Top Controls: Algo + Key ── */}
      <div className="fade-up" style={{ background: "#0d1421", border: "1px solid #1e2d40", borderRadius: 16, padding: "18px 22px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>

        {/* Algorithm */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "#10b98114", border: "1px solid #10b98130", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon n="shield" s={15} c="#10b981" />
          </div>
          <div>
            <p className="mono" style={{ fontSize: 10, color: "#334155", fontWeight: 700, letterSpacing: "0.10em", margin: 0 }}>ALGORITHM</p>
            <p style={{ fontSize: 11, color: "#1e3a5f", margin: 0 }}>Applied to all new files</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {ALGOS.map(a => (
            <button key={a} onClick={() => setGlobalAlgo(a)} style={{
              padding: "6px 14px", borderRadius: 20, cursor: "pointer",
              border: globalAlgo === a ? "none" : "1px solid #1e2d40",
              fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700,
              background: globalAlgo === a ? "linear-gradient(135deg,#a78bfa,#0ea5e9)" : "#0a1628",
              color: globalAlgo === a ? "#fff" : "#334155", transition: "all .2s",
            }}>{a}</button>
          ))}
        </div>

        <div style={{ width: 1, height: 36, background: "#1e2d40", margin: "0 4px", flexShrink: 0 }} />

        {/* Key */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: "#fbbf2414", border: "1px solid #fbbf2430", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon n="key" s={15} c="#fbbf24" />
          </div>
          <p className="mono" style={{ fontSize: 10, color: "#334155", fontWeight: 700, letterSpacing: "0.10em", margin: 0 }}>SECRET KEY</p>
        </div>
        <div style={{ flex: 1, minWidth: 180, position: "relative" }}>
          <input
            type={showKey ? "text" : "password"}
            value={globalKey}
            onChange={e => setGlobalKey(e.target.value)}
            placeholder="Enter passphrase (leave blank for default)"
            style={{
              width: "100%", boxSizing: "border-box", padding: "10px 42px 10px 14px",
              background: "#060910", border: "1px solid #1e2d40", borderRadius: 10, outline: "none",
              fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#94a3b8",
            }}
          />
          <button onClick={() => setShowKey(v => !v)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex" }}>
            <Icon n={showKey ? "eyeoff" : "eye"} s={15} c="#475569" />
          </button>
        </div>

        <p className="mono" style={{ marginLeft: "auto", fontSize: 10, color: "#1e3a5f", flexShrink: 0 }}>
          {globalAlgo} · {globalKey ? "CUSTOM KEY" : "DEFAULT KEY"}
        </p>
      </div>

      {/* ── Drop Zone ── */}
      <div
        className="fade-up"
        onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? "#a78bfa" : "#1e2d40"}`,
          borderRadius: 16, padding: "36px 24px", marginBottom: 20,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
          background: dragging ? "#a78bfa08" : "#0d1421",
          cursor: "pointer", transition: "all .2s",
          boxShadow: dragging ? "0 0 40px #a78bfa18" : "none",
        }}
      >
        <input ref={fileInputRef} type="file" multiple style={{ display: "none" }}
          onChange={e => { addFiles(e.target.files); e.target.value = ""; }} />
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: dragging ? "#a78bfa20" : "#0a1628",
          border: `1px solid ${dragging ? "#a78bfa44" : "#1e2d40"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all .2s",
        }}>
          <Icon n="upload" s={24} c={dragging ? "#a78bfa" : "#334155"} />
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: dragging ? "#a78bfa" : "#64748b", margin: "0 0 4px", transition: "color .2s" }}>
            {dragging ? "Drop files here" : "Click to upload or drag & drop"}
          </p>
          <p className="mono" style={{ fontSize: 11, color: "#1e3a5f", margin: 0 }}>
            Any file type · Multiple files supported
          </p>
        </div>
      </div>

      {/* ── File List ── */}
      {files.length > 0 && (
        <div className="fade-up" style={{ background: "#0d1421", border: "1px solid #1e2d40", borderRadius: 16, overflow: "hidden" }}>

          {/* List Header */}
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #0f1e2e", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
              {/* select all checkbox */}
              <div
                onClick={() => selected.size === files.length ? deselectAll() : selectAll()}
                style={{
                  width: 18, height: 18, borderRadius: 5, border: `1px solid ${selected.size === files.length ? "#a78bfa" : "#1e2d40"}`,
                  background: selected.size === files.length ? "#a78bfa" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0,
                }}
              >
                {selected.size === files.length && <Icon n="check" s={11} c="#fff" />}
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#64748b" }}>
                {files.length} file{files.length !== 1 ? "s" : ""}
              </span>
              {anySelected && (
                <span className="mono" style={{ fontSize: 11, color: "#a78bfa" }}>
                  · {selected.size} selected
                </span>
              )}
            </div>

            {/* Bulk action buttons */}
            {anySelected && (
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={bulkEncrypt} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 16px", borderRadius: 10, border: "none", cursor: "pointer",
                  background: "linear-gradient(135deg,#10b981,#0ea5e9)",
                  fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 12, color: "#fff",
                }}>
                  <Icon n="lock" s={13} c="#fff" /> ENCRYPT SELECTED
                </button>
                <button onClick={bulkDecrypt} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 16px", borderRadius: 10, border: "none", cursor: "pointer",
                  background: "linear-gradient(135deg,#0ea5e9,#a78bfa)",
                  fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 12, color: "#fff",
                }}>
                  <Icon n="unlock" s={13} c="#fff" /> DECRYPT SELECTED
                </button>
              </div>
            )}
          </div>

          {/* Table Head */}
          <div style={{ display: "grid", gridTemplateColumns: "36px 36px 1fr 90px 100px 140px 200px 100px", alignItems: "center", padding: "8px 20px", background: "#060910", borderBottom: "1px solid #0f1e2e" }}>
            {["", "", "FILE", "SIZE", "STATUS", "ALGORITHM", "SECRET KEY", "ACTIONS"].map((h, i) => (
              <span key={i} className="mono" style={{ fontSize: 10, color: "#334155", fontWeight: 700, letterSpacing: "0.10em" }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {files.map((entry, idx) => {
            const isSelected = selected.has(entry.id);
            const color      = getFileColor(entry.name);
            const isProcessing = entry.status === "processing";

            return (
              <div
                key={entry.id}
                className="file-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "36px 36px 1fr 90px 100px 140px 200px 100px",
                  alignItems: "center",
                  padding: "10px 20px",
                  borderBottom: idx < files.length - 1 ? "1px solid #0a1628" : "none",
                  background: isSelected ? "#0d1e2e" : "transparent",
                  transition: "background .15s",
                }}
              >
                {/* Checkbox */}
                <div
                  onClick={() => toggleSelect(entry.id)}
                  style={{
                    width: 18, height: 18, borderRadius: 5,
                    border: `1px solid ${isSelected ? "#a78bfa" : "#1e2d40"}`,
                    background: isSelected ? "#a78bfa" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", flexShrink: 0,
                  }}
                >
                  {isSelected && <Icon n="check" s={11} c="#fff" />}
                </div>

                {/* File icon */}
                <div style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: color + "18", border: `1px solid ${color}33`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon n={getFileIcon(entry.name)} s={14} c={color} />
                </div>

                {/* Name */}
                <div style={{ paddingRight: 12, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {entry.name}
                  </p>
                  <p className="mono" style={{ margin: 0, fontSize: 10, color: "#1e3a5f" }}>
                    {entry.addedAt.toLocaleTimeString()}
                  </p>
                </div>

                {/* Size */}
                <span className="mono" style={{ fontSize: 11, color: "#475569" }}>
                  {formatSize(entry.size)}
                </span>

                {/* Status */}
                <div>
                  {isProcessing
                    ? <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 14, height: 14, border: "2px solid #fbbf2430", borderTopColor: "#fbbf24", borderRadius: "50%", animation: "spin .8s linear infinite" }} />
                        <span className="mono" style={{ fontSize: 10, color: "#fbbf24" }}>WORKING</span>
                      </div>
                    : <StatusBadge status={entry.status} />
                  }
                </div>

                {/* Per-file algo selector */}
                <select
                  value={entry.algo}
                  onChange={e => updateFile(entry.id, { algo: e.target.value, output: null, status: "idle" })}
                  style={{
                    background: "#060910", border: "1px solid #1e2d40", borderRadius: 8,
                    padding: "5px 8px", fontFamily: "'JetBrains Mono',monospace", fontSize: 11,
                    color: "#64748b", cursor: "pointer", outline: "none", width: "100%",
                  }}
                >
                  {ALGOS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>

                {/* Per-file key */}
                <input
                  type="password"
                  value={entry.key}
                  placeholder="Key (blank = default)"
                  onChange={e => updateFile(entry.id, { key: e.target.value, output: null, status: "idle" })}
                  style={{
                    background: "#060910", border: "1px solid #1e2d40", borderRadius: 8,
                    padding: "5px 10px", fontFamily: "'JetBrains Mono',monospace", fontSize: 11,
                    color: "#94a3b8", outline: "none", width: "100%", boxSizing: "border-box",
                  }}
                />

                {/* Actions */}
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    className="icon-btn"
                    title="Encrypt"
                    disabled={isProcessing}
                    onClick={() => encryptFile(entry.id)}
                    style={{
                      width: 30, height: 30, borderRadius: 8, border: "1px solid #1e2d40",
                      background: "#0a1628", cursor: isProcessing ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      opacity: isProcessing ? 0.4 : 1, transition: "all .15s",
                    }}
                  >
                    <Icon n="lock" s={13} c="#10b981" />
                  </button>
                  <button
                    className="icon-btn"
                    title="Decrypt"
                    disabled={isProcessing || entry.status !== "encrypted"}
                    onClick={() => decryptFile(entry.id)}
                    style={{
                      width: 30, height: 30, borderRadius: 8, border: "1px solid #1e2d40",
                      background: "#0a1628", cursor: (isProcessing || entry.status !== "encrypted") ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      opacity: (isProcessing || entry.status !== "encrypted") ? 0.3 : 1, transition: "all .15s",
                    }}
                  >
                    <Icon n="unlock" s={13} c="#0ea5e9" />
                  </button>
                  <button
                    className="icon-btn"
                    title="Download output"
                    disabled={!entry.output}
                    onClick={() => downloadOutput(entry)}
                    style={{
                      width: 30, height: 30, borderRadius: 8, border: "1px solid #1e2d40",
                      background: "#0a1628", cursor: entry.output ? "pointer" : "not-allowed",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      opacity: entry.output ? 1 : 0.3, transition: "all .15s",
                    }}
                  >
                    <Icon n="download" s={13} c="#a78bfa" />
                  </button>
                  <button
                    className="icon-btn"
                    title="Remove"
                    onClick={() => removeFile(entry.id)}
                    style={{
                      width: 30, height: 30, borderRadius: 8, border: "1px solid #1e2d40",
                      background: "#0a1628", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all .15s",
                    }}
                  >
                    <Icon n="trash" s={13} c="#ef4444" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Footer summary */}
          <div style={{ padding: "12px 20px", borderTop: "1px solid #0f1e2e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="mono" style={{ fontSize: 10, color: "#334155" }}>
              {files.filter(f => f.status === "encrypted").length} encrypted ·{" "}
              {files.filter(f => f.status === "decrypted").length} decrypted ·{" "}
              {files.filter(f => f.status === "idle").length} idle
            </span>
            <button
              onClick={() => { setFiles([]); setSelected(new Set()); }}
              style={{
                background: "none", border: "1px solid #2d0d0d", borderRadius: 8,
                padding: "5px 14px", cursor: "pointer", fontSize: 12,
                color: "#ef444466", fontFamily: "'Outfit',sans-serif",
              }}
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {files.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px 0", opacity: 0.4 }}>
          <Icon n="file" s={40} c="#1e3a5f" />
          <p className="mono" style={{ fontSize: 12, color: "#1e3a5f", marginTop: 12 }}>
            NO FILES UPLOADED YET
          </p>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="fade-up" style={{
          position: "fixed", bottom: 28, right: 28,
          padding: "12px 18px", borderRadius: 12,
          background: toast.type === "error" ? "#2d0d0d" : "#052e16",
          border: `1px solid ${toast.type === "error" ? "#ef444440" : "#10b98133"}`,
          display: "flex", alignItems: "center", gap: 10,
          boxShadow: "0 8px 32px #00000066", zIndex: 999,
        }}>
          <Icon n={toast.type === "error" ? "x" : "check"} s={14} c={toast.type === "error" ? "#ef4444" : "#10b981"} />
          <span style={{ fontSize: 13, fontWeight: 600, color: toast.type === "error" ? "#f87171" : "#4ade80" }}>
            {toast.msg}
          </span>
        </div>
      )}
    </div>
  );
}
