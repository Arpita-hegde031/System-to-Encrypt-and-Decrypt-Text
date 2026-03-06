// src/pages/AuthPage.jsx
import { useState } from "react";
import Icon from "../components/Icon";
import Field from "../components/Field";
import { isValidEmail, hasUppercase, hasDigit, hasSpecial, isStrongPw } from "../utils/validators";
import { BUILT_IN_USERS } from "../utils/mockData";

/* ── Password Requirements bullet list ─────── */
const PasswordReqs = ({ pw }) => {
  const rules = [
    { label: "Minimum 8 characters",            ok: pw.length >= 8 },
    { label: "One uppercase letter (A-Z)",       ok: hasUppercase(pw) },
    { label: "One number (0-9)",                 ok: hasDigit(pw) },
    { label: "One special character (!@#$%^&*)", ok: hasSpecial(pw) },
  ];
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: "8px 0 0 0", display: "flex", flexDirection: "column", gap: 6 }}>
      {rules.map((r, i) => (
        <li key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
            background: pw.length === 0 ? "#334155" : r.ok ? "#10b981" : "#ef4444",
            transition: "background .2s",
          }} />
          <span style={{
            fontSize: 12,
            color: pw.length === 0 ? "#475569" : r.ok ? "#10b981" : "#f87171",
            transition: "color .2s",
          }}>
            {r.label}
          </span>
        </li>
      ))}
    </ul>
  );
};

/* ── Registration success screen ────────────── */
const SuccessScreen = ({ email, onGoToLogin }) => (
  <div style={{ textAlign: "center", padding: "8px 0" }}>
    <div style={{
      width: 68, height: 68, borderRadius: "50%", margin: "0 auto 20px",
      background: "#052e16", border: "2px solid #4ade80",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Icon n="check" s={30} c="#4ade80" />
    </div>
    <h3 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", marginBottom: 8 }}>Account Created!</h3>
    <p style={{ fontSize: 13, color: "#64748b", marginBottom: 10, lineHeight: 1.6 }}>
      Your account has been successfully registered.
    </p>
    <div style={{
      display: "inline-block", padding: "6px 16px", borderRadius: 8,
      background: "#0a0f1a", border: "1px solid #1e3a5f", marginBottom: 20,
    }}>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#10b981" }}>
        {email}
      </span>
    </div>
    <button
      onClick={onGoToLogin}
      style={{
        width: "100%", padding: "13px", borderRadius: 10, border: "none", cursor: "pointer",
        background: "linear-gradient(135deg,#10b981,#0ea5e9)", color: "#fff",
        fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 14,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}
    >
      <Icon n="arrow" s={16} c="#fff" /> PROCEED TO SIGN IN
    </button>
  </div>
);

/* ══════════════════════════════════════════════
   AUTH PAGE — Register (default) + Sign In
══════════════════════════════════════════════ */
const AuthPage = ({ onLogin, registeredUsers, onRegister }) => {
  const [tab, setTab]           = useState("register");
  const [loading, setLoading]   = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  /* ── Register state ── */
  const [registered, setRegistered]   = useState(false);
  const [regEmail, setRegEmail]       = useState("");
  const [r, setR]                     = useState({ name: "", email: "", pw: "", confirm: "" });
  const [rErr, setRErr]               = useState({});
  const [rTouched, setRTouched]       = useState({});
  const [showRPw, setShowRPw]         = useState(false);
  const [showRCp, setShowRCp]         = useState(false);

  /* ── Login state ── */
  const [l, setL]               = useState({ email: "", pw: "" });
  const [lErr, setLErr]         = useState({});
  const [loginError, setLoginError] = useState("");
  const [showLPw, setShowLPw]   = useState(false);

  /* ── Register validation ── */
  const validateRField = (field, val, all) => {
    const v = val ?? all[field];
    const a = all ?? r;
    if (field === "name")    return !v.trim() ? "Full name is required" : v.trim().length < 2 ? "Name too short" : "";
    if (field === "email")   return !v.trim() ? "Email is required" : !isValidEmail(v) ? "Enter a valid email address" : "";
    if (field === "pw") {
      if (!v)              return "Password is required";
      if (v.length < 8)    return "Minimum 8 characters required";
      if (!hasUppercase(v)) return "Must include an uppercase letter";
      if (!hasDigit(v))    return "Must include a number";
      if (!hasSpecial(v))  return "Must include a special character";
      return "";
    }
    if (field === "confirm") return !v ? "Please confirm your password" : v !== a.pw ? "Passwords do not match" : "";
    return "";
  };

  const touchR = (field) => {
    setRTouched(p => ({ ...p, [field]: true }));
    setRErr(p => ({ ...p, [field]: validateRField(field, r[field], r) }));
  };

  const handleRChange = (field, val) => {
    const next = { ...r, [field]: val };
    setR(next);
    if (rTouched[field]) setRErr(p => ({ ...p, [field]: validateRField(field, val, next) }));
    if (field === "pw" && rTouched.confirm)
      setRErr(p => ({ ...p, confirm: next.confirm !== val ? "Passwords do not match" : "" }));
  };

  const submitRegister = () => {
    const fields = ["name", "email", "pw", "confirm"];
    const errs = {};
    fields.forEach(f => { errs[f] = validateRField(f, r[f], r); });
    setRErr(errs);
    setRTouched({ name: true, email: true, pw: true, confirm: true });
    if (Object.values(errs).some(e => e)) { setShakeKey(k => k + 1); return; }

    const newEmail = r.email.trim().toLowerCase();
    const newPw    = r.pw;
    const newName  = r.name.trim();

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onRegister({ email: newEmail, pw: newPw, name: newName }); // save to App state
      setRegEmail(r.email);
      setRegistered(true);
    }, 1200);
  };

  /* ── Login validation ── */
  const validateLogin = () => {
    const errs = {};
    if (!l.email.trim())             errs.email = "Email is required";
    else if (!isValidEmail(l.email)) errs.email = "Enter a valid email address";
    if (!l.pw)                       errs.pw = "Password is required";
    return errs;
  };

  const submitLogin = () => {
    setLoginError("");
    const errs = validateLogin();
    setLErr(errs);
    if (Object.keys(errs).length) { setShakeKey(k => k + 1); return; }

    // Capture values before async timeout (prevents stale closure bug)
    const enteredEmail = l.email.trim().toLowerCase();
    const enteredPw    = l.pw;
    const allUsers     = [...BUILT_IN_USERS, ...registeredUsers];

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const match = allUsers.find(
        u => u.email.toLowerCase() === enteredEmail && u.pw === enteredPw
      );
      if (match) {
        onLogin({ email: match.email, name: match.name });
      } else {
        setLoginError("Invalid email or password. Please try again.");
        setShakeKey(k => k + 1);
      }
    }, 1200);
  };

  const switchTab = (t) => {
    setTab(t);
    setRErr({}); setLErr({});
    setLoginError(""); setLoading(false);
    if (t === "register") setRegistered(false);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#060910",
      position: "relative", overflow: "hidden",
    }}>
      {/* Grid background */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.4,
        backgroundImage: "linear-gradient(#0d1421 1px,transparent 1px),linear-gradient(90deg,#0d1421 1px,transparent 1px)",
        backgroundSize: "44px 44px",
      }} />
      {/* Glow orbs */}
      <div style={{ position: "absolute", top: "5%", left: "5%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,#10b98118 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "5%", right: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,#0ea5e918 0%,transparent 70%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 480, padding: "24px 20px" }}>

        {/* Logo */}
        <div className="fade-up" style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 62, height: 62, borderRadius: 18, marginBottom: 14,
            background: "linear-gradient(135deg,#10b98128,#0ea5e928)",
            border: "1px solid #10b98148",
          }}>
            <Icon n="shield" s={28} c="#10b981" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "0.18em", color: "#f1f5f9", marginBottom: 4 }}>
            CRYPTIFY
          </h1>
          <p className="mono" style={{ fontSize: 10, letterSpacing: "0.25em", color: "#334155" }}>
            SECURE DATA PROTECTION PLATFORM
          </p>
        </div>

        {/* Card with shake on error */}
        <div
          key={`card-${shakeKey}`}
          className={`fade-up${shakeKey > 0 ? " shake" : ""}`}
          style={{ background: "#0d1421", border: "1px solid #1e2d40", borderRadius: 20, padding: 32 }}
        >
          {/* Tab switcher */}
          <div style={{ display: "flex", background: "#060910", borderRadius: 12, padding: 4, marginBottom: 28 }}>
            {[
              { id: "register", label: "REGISTER" },
              { id: "login",    label: "SIGN IN"  },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => switchTab(t.id)}
                style={{
                  flex: 1, padding: "10px", borderRadius: 10, border: "none", cursor: "pointer",
                  fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: "0.06em",
                  background: tab === t.id ? "linear-gradient(135deg,#10b981,#0ea5e9)" : "transparent",
                  color: tab === t.id ? "#fff" : "#475569",
                  transition: "all .25s",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── REGISTER TAB ── */}
          {tab === "register" && (
            registered
              ? <SuccessScreen email={regEmail} onGoToLogin={() => switchTab("login")} />
              : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <Field
                    label="FULL NAME"
                    value={r.name}
                    onChange={e => handleRChange("name", e.target.value)}
                    onBlur={() => touchR("name")}
                    placeholder="John Doe"
                    error={rTouched.name ? rErr.name : ""}
                    suffix={<Icon n="user" s={16} c="#334155" />}
                  />

                  <Field
                    label="EMAIL ADDRESS"
                    type="email"
                    value={r.email}
                    onChange={e => handleRChange("email", e.target.value)}
                    onBlur={() => touchR("email")}
                    placeholder="user@domain.com"
                    error={rTouched.email ? rErr.email : ""}
                    hint={r.email && !rErr.email && rTouched.email ? "✓ Valid email" : ""}
                    suffix={<Icon n="mail" s={16} c="#334155" />}
                  />

                  <div>
                    <Field
                      label="PASSWORD"
                      type={showRPw ? "text" : "password"}
                      value={r.pw}
                      onChange={e => handleRChange("pw", e.target.value)}
                      onBlur={() => touchR("pw")}
                      placeholder="Min. 8 chars · A · 1 · @"
                      error={rTouched.pw && !isStrongPw(r.pw) ? rErr.pw : ""}
                      suffix={
                        <button
                          onClick={() => setShowRPw(!showRPw)}
                          style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}
                        >
                          <Icon n={showRPw ? "eyeoff" : "eye"} s={16} c="#475569" />
                        </button>
                      }
                    />
                    <PasswordReqs pw={r.pw} />
                  </div>

                  <Field
                    label="CONFIRM PASSWORD"
                    type={showRCp ? "text" : "password"}
                    value={r.confirm}
                    onChange={e => handleRChange("confirm", e.target.value)}
                    onBlur={() => touchR("confirm")}
                    placeholder="Re-enter your password"
                    error={rTouched.confirm ? rErr.confirm : ""}
                    hint={r.confirm && r.confirm === r.pw && !rErr.confirm ? "✓ Passwords match" : ""}
                    suffix={
                      <button
                        onClick={() => setShowRCp(!showRCp)}
                        style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}
                      >
                        <Icon n={showRCp ? "eyeoff" : "eye"} s={16} c="#475569" />
                      </button>
                    }
                  />

                  <button
                    onClick={submitRegister}
                    disabled={loading}
                    style={{
                      marginTop: 4, padding: "13px", width: "100%", borderRadius: 10,
                      border: "none", cursor: loading ? "not-allowed" : "pointer",
                      background: loading ? "#1e3a5f" : "linear-gradient(135deg,#10b981,#0ea5e9)",
                      color: loading ? "#475569" : "#fff",
                      fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 14,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}
                  >
                    {loading
                      ? <div className="spin" style={{ width: 18, height: 18, border: "2px solid #47556930", borderTopColor: "#94a3b8", borderRadius: "50%" }} />
                      : <Icon n="key" s={16} c="#fff" />
                    }
                    {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                  </button>

                  <p className="mono" style={{ textAlign: "center", fontSize: 10, color: "#1e3a5f" }}>
                    AES-256-GCM · RSA-2048 · TLS 1.3
                  </p>
                </div>
              )
          )}

          {/* ── LOGIN TAB ── */}
          {tab === "login" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Field
                label="EMAIL ADDRESS"
                type="email"
                value={l.email}
                onChange={e => { setL(p => ({ ...p, email: e.target.value })); setLErr(p => ({ ...p, email: "" })); setLoginError(""); }}
                placeholder="user@domain.com"
                error={lErr.email}
                suffix={<Icon n="mail" s={16} c="#334155" />}
              />

              <Field
                label="PASSWORD"
                type={showLPw ? "text" : "password"}
                value={l.pw}
                onChange={e => { setL(p => ({ ...p, pw: e.target.value })); setLErr(p => ({ ...p, pw: "" })); setLoginError(""); }}
                placeholder="Enter your password"
                error={lErr.pw}
                suffix={
                  <button
                    onClick={() => setShowLPw(!showLPw)}
                    style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}
                  >
                    <Icon n={showLPw ? "eyeoff" : "eye"} s={16} c="#475569" />
                  </button>
                }
              />

              {/* Wrong credentials error */}
              {loginError && (
                <div className="fade-up" style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 14px", borderRadius: 10,
                  background: "#2d0d0d", border: "1px solid #ef444455",
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                    background: "#450a0a", border: "1px solid #ef4444",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon n="x" s={14} c="#ef4444" />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#f87171", marginBottom: 2 }}>
                      Authentication Failed
                    </p>
                    <p style={{ fontSize: 12, color: "#f8717199" }}>{loginError}</p>
                  </div>
                </div>
              )}

              <div style={{ textAlign: "right", marginTop: -4 }}>
                <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#10b981", fontFamily: "'Outfit',sans-serif" }}>
                  Forgot password?
                </button>
              </div>

              <button
                onClick={submitLogin}
                disabled={loading}
                style={{
                  padding: "13px", width: "100%", borderRadius: 10,
                  border: "none", cursor: loading ? "not-allowed" : "pointer",
                  background: loading ? "#1e3a5f" : "linear-gradient(135deg,#10b981,#0ea5e9)",
                  color: loading ? "#475569" : "#fff",
                  fontFamily: "'Outfit',sans-serif", fontWeight: 700, fontSize: 14,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                {loading
                  ? <div className="spin" style={{ width: 18, height: 18, border: "2px solid #47556930", borderTopColor: "#94a3b8", borderRadius: "50%" }} />
                  : <Icon n="lock" s={16} c="#fff" />
                }
                {loading ? "AUTHENTICATING..." : "SIGN IN"}
              </button>

              <p style={{ textAlign: "center", fontSize: 13, color: "#475569" }}>
                Don't have an account?{" "}
                <button
                  onClick={() => switchTab("register")}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#10b981", fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}
                >
                  Register now
                </button>
              </p>

              <p className="mono" style={{ textAlign: "center", fontSize: 10, color: "#1e3a5f" }}>
                AES-256-GCM · RSA-2048 · TLS 1.3
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
