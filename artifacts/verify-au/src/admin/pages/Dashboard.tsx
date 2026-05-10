import { getAppStats, getModuleEngagement } from "../adminStore";

const moduleColors = ["#16a34a", "#d97706", "#dc2626", "#7c3aed", "#0891b2"];

export default function Dashboard() {
  const stats = getAppStats();
  const engagement = getModuleEngagement();

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: "👥" },
    { label: "Active Students", value: stats.activeStudents, icon: "🎓" },
    { label: "Active Last 7 Days", value: stats.activeLast7Days, icon: "🔥" },
    { label: "Module Completions", value: stats.moduleCompletions, icon: "📋" },
    { label: "Practice Attempts", value: stats.practiceAttempts, icon: "◎" },
    { label: "Assessment Attempts", value: stats.assessmentAttempts, icon: "📝" },
    { label: "Badges Awarded", value: stats.badgesAwarded, icon: "🏆" },
  ];

  return (
    <div>
      <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#111", marginBottom: 22 }}>Dashboard</h1>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
        {statCards.map((card) => (
          <div key={card.label} style={{
            background: "#fff", border: "1px solid #e8eaed", borderRadius: 10,
            padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}>
            <div style={{ fontSize: "0.72rem", color: "#6b7280", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {card.label}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "1.1rem" }}>{card.icon}</span>
              <span style={{ fontSize: "1.65rem", fontWeight: 700, color: "#111" }}>{card.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Module Progress */}
      <div style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 10, padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#111", marginBottom: 18 }}>Module Progress</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
          {engagement.map((mod, i) => (
            <div key={mod.name} style={{
              border: "1px solid #e8eaed", borderRadius: 8, padding: "14px 16px",
              borderLeft: `4px solid ${moduleColors[i % moduleColors.length]}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 5, fontSize: "0.65rem", fontWeight: 800,
                  background: moduleColors[i % moduleColors.length], color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111" }}>{mod.name}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {[
                  { label: "Completions", value: mod.completions },
                  { label: "Rate", value: mod.completionRate + " %" },
                  { label: "Avg Key Check", value: mod.avgScore > 0 ? mod.avgScore + " %" : "—" },
                ].map((s) => (
                  <div key={s.label}>
                    <div style={{ fontSize: "0.65rem", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase" }}>{s.label}</div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#111" }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
