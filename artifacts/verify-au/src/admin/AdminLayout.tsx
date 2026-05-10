import { useState } from "react";

type AdminPage = "dashboard" | "users" | "modules" | "practice" | "assessments" | "weekly" | "analytics" | "auditlogs";

interface Props {
  page: AdminPage;
  setPage: (p: AdminPage) => void;
  children: React.ReactNode;
  onLogout: () => void;
}

const navItems: { id: AdminPage; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "users", label: "Users", icon: "👤" },
  { id: "modules", label: "Modules & Cards", icon: "📚" },
  { id: "practice", label: "Practice Questions", icon: "◎" },
  { id: "assessments", label: "Assessments", icon: "📝" },
  { id: "weekly", label: "Weekly Modules", icon: "📅" },
  { id: "analytics", label: "Analytics", icon: "📊" },
  { id: "auditlogs", label: "Audit Logs", icon: "🔍" },
];

export default function AdminLayout({ page, setPage, children, onLogout }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", background: "#f0f4f8" }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 230 : 0, minWidth: sidebarOpen ? 230 : 0,
        background: "#0f172a",
        display: "flex", flexDirection: "column",
        transition: "width 0.2s, min-width 0.2s", overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 18px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, background: "linear-gradient(135deg,#0d9488,#0891b2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "#fff", fontSize: 15, fontWeight: 900 }}>V</span>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.9rem", color: "#f8fafc", lineHeight: 1.2 }}>VerifyAU</div>
              <div style={{ fontSize: "0.6rem", color: "#94a3b8", lineHeight: 1.1, letterSpacing: "0.06em", textTransform: "uppercase" }}>Content Portal</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setPage(item.id)} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "8px 10px",
              borderRadius: 8, border: "none", cursor: "pointer", textAlign: "left", fontSize: "0.82rem",
              fontWeight: page === item.id ? 700 : 400, marginBottom: 1,
              background: page === item.id ? "rgba(13,148,136,0.18)" : "transparent",
              color: page === item.id ? "#2dd4bf" : "#94a3b8",
              transition: "background 0.15s, color 0.15s",
            }}>
              <span style={{ fontSize: "0.88rem", width: 18, textAlign: "center", opacity: page === item.id ? 1 : 0.7 }}>{item.icon}</span>
              <span>{item.label}</span>
              {page === item.id && <span style={{ marginLeft: "auto", width: 4, height: 4, borderRadius: "50%", background: "#2dd4bf" }} />}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: "14px 10px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={onLogout} style={{
            width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)",
            background: "transparent", color: "#64748b", fontSize: "0.78rem", cursor: "pointer", fontWeight: 500,
            textAlign: "left", display: "flex", alignItems: "center", gap: 8,
          }}>
            <span>←</span> Back to site
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Header */}
        <header style={{
          height: 54, background: "#fff", borderBottom: "1px solid #e2e8f0",
          display: "flex", alignItems: "center", padding: "0 24px", gap: 12, flexShrink: 0,
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
            background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#94a3b8", padding: 4,
            borderRadius: 6, lineHeight: 1,
          }}>☰</button>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ textAlign: "right", lineHeight: 1.3 }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#111" }}>Content Manager</div>
              <div style={{ fontSize: "0.64rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.04em" }}>Admin</div>
            </div>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "linear-gradient(135deg,#0d9488,#0891b2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: "0.78rem", fontWeight: 800,
            }}>CM</div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: "28px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
