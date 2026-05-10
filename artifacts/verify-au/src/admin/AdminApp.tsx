import { useState } from "react";
import AdminLayout from "./AdminLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Modules from "./pages/Modules";
import PracticeQuestions from "./pages/PracticeQuestions";
import Assessments from "./pages/Assessments";
import WeeklyModules from "./pages/WeeklyModules";
import Analytics from "./pages/Analytics";
import AuditLogs from "./pages/AuditLogs";

type AdminPage = "dashboard" | "users" | "modules" | "practice" | "assessments" | "weekly" | "analytics" | "auditlogs";

const ADMIN_PASSWORD = "verify2026";

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("admin@verifyau.edu.au");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "1");
      onLogin();
    } else {
      setError("Incorrect password.");
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0f172a 0%,#1e293b 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "44px 40px", width: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{ width: 40, height: 40, background: "linear-gradient(135deg,#0d9488,#0891b2)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 18, fontWeight: 900 }}>V</span>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.05rem", color: "#0f172a" }}>VerifyAU</div>
            <div style={{ fontSize: "0.7rem", color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase" }}>Content Portal</div>
          </div>
        </div>

        <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>Administrator Sign In</h2>
        <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: 24 }}>Restricted — authorised staff only.</p>

        <form onSubmit={submit}>
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Email address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inp} required autoFocus />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>Password</label>
            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} style={inp} required placeholder="Enter password" />
          </div>
          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", borderRadius: 8, padding: "9px 13px", fontSize: "0.8rem", marginBottom: 16 }}>{error}</div>
          )}
          <button type="submit" style={{ width: "100%", background: "linear-gradient(135deg,#0d9488,#0891b2)", color: "#fff", border: "none", borderRadius: 10, padding: "11px", fontSize: "0.92rem", fontWeight: 700, cursor: "pointer", letterSpacing: "0.01em" }}>
            Sign In →
          </button>
        </form>
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <a href="/" style={{ fontSize: "0.78rem", color: "#94a3b8", textDecoration: "none" }}>← Return to student platform</a>
        </div>
      </div>
    </div>
  );
}

export default function AdminApp() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("admin_auth") === "1");
  const [page, setPage] = useState<AdminPage>("dashboard");

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  function logout() {
    sessionStorage.removeItem("admin_auth");
    window.location.href = "/";
  }

  const pages: Record<AdminPage, React.ReactNode> = {
    dashboard: <Dashboard />,
    users: <Users />,
    modules: <Modules />,
    practice: <PracticeQuestions />,
    assessments: <Assessments />,
    weekly: <WeeklyModules />,
    analytics: <Analytics />,
    auditlogs: <AuditLogs />,
  };

  return (
    <AdminLayout page={page} setPage={setPage} onLogout={logout}>
      {pages[page]}
    </AdminLayout>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#374151", marginBottom: 5 };
const inp: React.CSSProperties = { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: "0.88rem", outline: "none", background: "#fff", boxSizing: "border-box" };
