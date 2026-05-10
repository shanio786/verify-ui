import { getAppStats, getModuleEngagement, getAllUsers } from "../adminStore";

const moduleColors = ["#0d9488", "#7c3aed", "#d97706", "#dc2626", "#0891b2"];

function Bar({ pct }: { pct: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 5, background: "#e2e8f0", borderRadius: 999, maxWidth: 110 }}>
        <div style={{ width: `${Math.min(100, pct)}%`, height: "100%", background: "#0d9488", borderRadius: 999 }} />
      </div>
      <span style={{ fontSize: "0.75rem", color: "#64748b", minWidth: 32 }}>{pct}%</span>
    </div>
  );
}

export default function Analytics() {
  const stats = getAppStats();
  const engagement = getModuleEngagement();
  const users = getAllUsers();
  const students = users.filter((u) => u.role === "STUDENT");

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>Analytics</h1>
        <p style={{ fontSize: "0.78rem", color: "#64748b", margin: 0 }}>Engagement and completion data across all students.</p>
      </div>

      {/* Summary row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total Users", value: stats.totalUsers },
          { label: "Active Students", value: stats.activeStudents },
          { label: "Practice Attempts", value: stats.practiceAttempts },
          { label: "Module Completions", value: stats.moduleCompletions },
          { label: "Assessments Done", value: stats.assessmentAttempts },
        ].map((s) => (
          <div key={s.label} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 18px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: "1.9rem", fontWeight: 800, color: "#0f172a" }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Assessment Growth */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "20px 24px", marginBottom: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
        <h2 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Initial vs Final Assessment</h2>
        <div style={{ display: "flex", gap: 40, marginBottom: 16 }}>
          {[
            { label: "Completed Initial", value: stats.assessmentAttempts > 0 ? 1 : 0 },
            { label: "Completed Both", value: 0 },
            { label: "Average Score Growth", value: "—" },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0f172a" }}>{s.value}</div>
            </div>
          ))}
        </div>
        {stats.assessmentAttempts === 0 && (
          <div style={{ padding: "24px 0", textAlign: "center", color: "#94a3b8", fontSize: "0.82rem", borderTop: "1px solid #f1f5f9" }}>
            No assessment results recorded yet.
          </div>
        )}
      </div>

      {/* Per-module engagement */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "20px 24px", marginBottom: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
        <h2 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Module Completion Rates</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Module", "Completions", "Rate"].map((h) => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid #e2e8f0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {engagement.map((mod, i) => (
              <tr key={mod.name} style={{ borderBottom: i < engagement.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                <td style={{ padding: "10px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 22, height: 22, borderRadius: 5, background: moduleColors[i % moduleColors.length], color: "#fff", fontSize: "0.62rem", fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span style={{ fontSize: "0.82rem", color: "#0f172a", fontWeight: 500 }}>{mod.name}</span>
                  </div>
                </td>
                <td style={{ padding: "10px 12px", fontSize: "0.82rem", color: "#374151" }}>{mod.completions}</td>
                <td style={{ padding: "10px 12px" }}><Bar pct={mod.completionRate} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student list */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
        <h2 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Student Overview</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Student", "Modules Done", "Practice Done", "Initial Assessment", "Final Assessment"].map((h) => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid #e2e8f0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 28, textAlign: "center", color: "#94a3b8", fontSize: "0.82rem" }}>No students enrolled yet.</td></tr>
            ) : students.map((s, i) => (
              <tr key={s.id} style={{ borderBottom: i < students.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                <td style={{ padding: "10px 12px" }}>
                  <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "#0f172a" }}>{s.name}</div>
                  <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{s.email}</div>
                </td>
                <td style={{ padding: "10px 12px", fontSize: "0.82rem", color: "#94a3b8" }}>—</td>
                <td style={{ padding: "10px 12px", fontSize: "0.82rem", color: "#94a3b8" }}>—</td>
                <td style={{ padding: "10px 12px", fontSize: "0.82rem", color: "#94a3b8" }}>—</td>
                <td style={{ padding: "10px 12px", fontSize: "0.82rem", color: "#94a3b8" }}>—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
