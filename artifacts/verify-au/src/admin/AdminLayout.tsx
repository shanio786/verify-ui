import { useState } from "react";

type AdminPage = "dashboard" | "users" | "modules" | "practice" | "assessments" | "weekly" | "analytics" | "auditlogs";

interface Props {
  page: AdminPage;
  setPage: (p: AdminPage) => void;
  children: React.ReactNode;
  onLogout: () => void;
}

const navItems: { id: AdminPage; label: string; icon: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: "⊡" },
  { id: "users", label: "Users", icon: "👤" },
  { id: "modules", label: "Modules & Cards", icon: "📋" },
  { id: "practice", label: "Practice Questions", icon: "◎" },
  { id: "assessments", label: "Assessments", icon: "📝" },
  { id: "weekly", label: "Weekly Modules", icon: "📅" },
  { id: "analytics", label: "Analytics", icon: "📊" },
  { id: "auditlogs", label: "Audit Logs", icon: "🔍" },
];

export default function AdminLayout({ page, setPage, children, onLogout }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", background: "#f5f6fa" }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 220 : 0, minWidth: sidebarOpen ? 220 : 0, background: "#fff",
        borderRight: "1px solid #e8eaed", display: "flex", flexDirection: "column",
        transition: "width 0.2s, min-width 0.2s", overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid #e8eaed", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, background: "#1e4fa8", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 13, fontWeight: 800 }}>V</span>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "0.82rem", color: "#111", lineHeight: 1.2 }}>VerifyAU</div>
              <div style={{ fontSize: "0.62rem", color: "#6b7280", lineHeight: 1 }}>Admin Panel</div>
            </div>
          </div>
        </div>
        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 10px", overflowY: "auto" }}>
          {navItems.map((item) => (
            <button key={item.id} onClick={() => setPage(item.id)} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "8px 10px",
              borderRadius: 7, border: "none", cursor: "pointer", textAlign: "left", fontSize: "0.82rem",
              fontWeight: page === item.id ? 700 : 500, marginBottom: 2,
              background: page === item.id ? "#eff4ff" : "transparent",
              color: page === item.id ? "#1e4fa8" : "#374151",
            }}>
              <span style={{ fontSize: "0.9rem", width: 18, textAlign: "center" }}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        {/* Bottom */}
        <div style={{ padding: "12px 14px", borderTop: "1px solid #e8eaed" }}>
          <button onClick={onLogout} style={{
            width: "100%", padding: "7px 10px", borderRadius: 7, border: "1px solid #e8eaed",
            background: "#fff", color: "#6b7280", fontSize: "0.78rem", cursor: "pointer", fontWeight: 500,
          }}>← Back to Site</button>
        </div>
      </aside>

      {/* Main area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Header */}
        <header style={{
          height: 52, background: "#fff", borderBottom: "1px solid #e8eaed",
          display: "flex", alignItems: "center", padding: "0 24px", gap: 12, flexShrink: 0,
        }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
            background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#6b7280", padding: 4,
          }}>☰</button>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: "50%", background: "#1e4fa8",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: "0.78rem", fontWeight: 700,
            }}>IT</div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#111" }}>IT Tech</div>
              <div style={{ fontSize: "0.65rem", color: "#6b7280" }}>IT TECH</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: "28px 28px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
