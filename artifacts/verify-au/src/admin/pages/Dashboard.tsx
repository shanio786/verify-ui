import { getAppStats, getModuleEngagement } from "../adminStore";

const moduleColors = ["#0d9488", "#7c3aed", "#d97706", "#dc2626", "#0891b2"];

export default function Dashboard() {
  const stats = getAppStats();
  const engagement = getModuleEngagement();

  const statCards = [
    { label: "Total Users",        value: stats.totalUsers },
    { label: "Active Students",    value: stats.activeStudents },
    { label: "Active (7 days)",    value: stats.activeLast7Days },
    { label: "Module Completions", value: stats.moduleCompletions },
    { label: "Practice Attempts",  value: stats.practiceAttempts },
    { label: "Assessments Done",   value: stats.assessmentAttempts },
    { label: "Badges Earned",      value: stats.badgesAwarded },
  ];

  return (
    <div>
      <div style={{ marginBottom: 26 }}>
        <h1 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#0f172a", marginBottom: 3 }}>Dashboard</h1>
        <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0 }}>Platform overview — updates as students complete activities.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))", gap: 12, marginBottom: 26 }}>
        {statCards.map((card) => (
          <div key={card.label} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "18px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
            <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
              {card.label}
            </div>
            <div style={{ fontSize: "2.1rem", fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Module engagement */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "22px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)", marginBottom: 20 }}>
        <h2 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0f172a", marginBottom: 18 }}>Module Engagement</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 12 }}>
          {engagement.map((mod, i) => (
            <div key={mod.name} style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: "14px 16px", background: "#fafafa" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <span style={{ width: 24, height: 24, borderRadius: 6, fontSize: "0.62rem", fontWeight: 900, background: moduleColors[i % moduleColors.length], color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f172a", lineHeight: 1.3 }}>{mod.name}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                {[
                  { label: "Completions", value: mod.completions },
                  { label: "Rate", value: mod.completionRate + "%" },
                ].map((s) => (
                  <div key={s.label} style={{ background: "#fff", borderRadius: 6, padding: "7px 10px", border: "1px solid #e2e8f0" }}>
                    <div style={{ fontSize: "0.6rem", color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 2 }}>{s.label}</div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#0f172a" }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ height: 4, borderRadius: 99, background: "#e2e8f0", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${mod.completionRate}%`, background: moduleColors[i % moduleColors.length], borderRadius: 99 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content inventory */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
        <h2 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0f172a", marginBottom: 14 }}>Content Summary</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          {[
            { label: "Learning Modules",       value: "5" },
            { label: "Practice Scenarios",     value: "20" },
            { label: "Initial Assessment Qs",  value: "13" },
            { label: "Final Assessment Qs",    value: "7" },
          ].map((r, i, arr) => (
            <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < arr.length - 2 ? "1px solid #f1f5f9" : "none" }}>
              <span style={{ fontSize: "0.82rem", color: "#64748b" }}>{r.label}</span>
              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0f172a" }}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
