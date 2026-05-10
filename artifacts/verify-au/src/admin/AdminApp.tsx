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

const ADMIN_PASSWORD = "admin2026";

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("admin@factcheck.au");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_auth", "1");
      onLogin();
    } else {
      setError("Invalid password. Hint: admin2026");
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f6fa", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}>
      <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e8eaed", padding: "40px 40px", width: 380, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{ width: 36, height: 36, background: "#1e4fa8", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 16, fontWeight: 800 }}>V</span>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1rem", color: "#111" }}>VerifyAU Admin</div>
            <div style={{ fontSize: "0.72rem", color: "#6b7280" }}>Restricted access</div>
          </div>
        </div>
        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111", marginBottom: 6 }}>Sign in to Admin Panel</h2>
        <p style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: 22 }}>Enter your credentials to continue.</p>
        <form onSubmit={submit}>
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inp} required autoFocus />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={lbl}>Password</label>
            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} style={inp} required placeholder="Enter admin password" />
          </div>
          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", borderRadius: 7, padding: "8px 12px", fontSize: "0.8rem", marginBottom: 14 }}>{error}</div>
          )}
          <button type="submit" style={{ width: "100%", background: "#1e4fa8", color: "#fff", border: "none", borderRadius: 8, padding: "10px", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer" }}>
            Sign In →
          </button>
        </form>
        <div style={{ marginTop: 18, textAlign: "center" }}>
          <a href="/" style={{ fontSize: "0.78rem", color: "#6b7280", textDecoration: "none" }}>← Back to site</a>
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
const inp: React.CSSProperties = { width: "100%", padding: "9px 11px", borderRadius: 7, border: "1.5px solid #e8eaed", fontSize: "0.88rem", outline: "none", background: "#fff", boxSizing: "border-box" };
