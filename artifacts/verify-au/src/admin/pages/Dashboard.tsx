import { getAppStats, getModuleEngagement } from "../adminStore";

const moduleColors = ["#0d9488", "#7c3aed", "#d97706", "#dc2626", "#0891b2"];

export default function Dashboard() {
  const stats = getAppStats();
  const engagement = getModuleEngagement();

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: "👥", color: "#0d9488" },
    { label: "Active Students", value: stats.activeStudents, icon: "🎓", color: "#7c3aed" },
    { label: "Active (7 days)", value: stats.activeLast7Days, icon: "🔥", color: "#d97706" },
    { label: "Module Completions", value: stats.moduleCompletions, icon: "✅", color: "#16a34a" },
    { label: "Practice Attempts", value: stats.practiceAttempts, icon: "◎", color: "#0891b2" },
    { label: "Assessments Done", value: stats.assessmentAttempts, icon: "📝", color: "#6d28d9" },
    { label: "Badges Earned", value: stats.badgesAwarded, icon: "🏅", color: "#b45309" },
  ];

  return (
    <div>
      <div style={{ marginBottom: 26 }}>
        <h1 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>Dashboard</h1>
        <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>Live platform overview — data updates as students complete activities.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(185px, 1fr))", gap: 14, marginBottom: 28 }}>
        {statCards.map((card) => (
          <div key={card.label} style={{
            background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12,
            padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            borderTop: `3px solid ${card.color}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{card.label}</div>
              <span style={{ fontSize: "1rem" }}>{card.icon}</span>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Module Progress */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "22px 26px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", marginBottom: 24 }}>
        <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a", marginBottom: 18 }}>Module Engagement</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
          {engagement.map((mod, i) => (
            <div key={mod.name} style={{
              border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 18px",
              background: "#fafafa",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{
                  width: 24, height: 24, borderRadius: 6, fontSize: "0.65rem", fontWeight: 900,
                  background: moduleColors[i % moduleColors.length], color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f172a", lineHeight: 1.3 }}>{mod.name}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { label: "Completions", value: mod.completions },
                  { label: "Rate", value: mod.completionRate + "%" },
                  { label: "Avg Key Check", value: mod.avgScore > 0 ? mod.avgScore + "%" : "—" },
                ].map((s) => (
                  <div key={s.label} style={{ background: "#fff", borderRadius: 6, padding: "8px 10px", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: "0.62rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 2 }}>{s.label}</div>
                    <div style={{ fontSize: "1rem", fontWeight: 800, color: "#0f172a" }}>{s.value}</div>
                  </div>
                ))}
              </div>
              {/* Mini bar */}
              <div style={{ marginTop: 12, height: 4, borderRadius: 99, background: "#e2e8f0", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${mod.completionRate}%`, background: moduleColors[i % moduleColors.length], borderRadius: 99, transition: "width 0.4s" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "18px 22px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a", marginBottom: 12 }}>Content Summary</h3>
          {[
            { label: "Learning Modules", value: "5" },
            { label: "Practice Scenarios", value: "20 AAP" },
            { label: "Initial Assessment Qs", value: "13" },
            { label: "Final Assessment Qs", value: "7" },
          ].map((r) => (
            <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
              <span style={{ fontSize: "0.8rem", color: "#64748b" }}>{r.label}</span>
              <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0f172a" }}>{r.value}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "linear-gradient(135deg,#0d9488,#0891b2)", borderRadius: 12, padding: "18px 22px", color: "#fff" }}>
          <h3 style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 8, opacity: 0.9 }}>Platform Health</h3>
          <div style={{ fontSize: "2.4rem", fontWeight: 900, marginBottom: 4 }}>
            {stats.totalUsers > 0 ? "Online" : "Ready"}
          </div>
          <p style={{ fontSize: "0.78rem", opacity: 0.8, margin: "0 0 14px" }}>All modules and content published and available to students.</p>
          <div style={{ fontSize: "0.75rem", opacity: 0.75 }}>20 scenarios · 5 modules · 20 assessment questions</div>
        </div>
      </div>
    </div>
  );
}
