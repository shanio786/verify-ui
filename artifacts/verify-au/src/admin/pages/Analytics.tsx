import { getAppStats, getModuleEngagement, getAllUsers } from "../adminStore";

const moduleColors = ["#16a34a", "#d97706", "#dc2626", "#7c3aed", "#0891b2"];

function BarCell({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: "#e8eaed", borderRadius: 999, maxWidth: 100 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: "#1e4fa8", borderRadius: 999 }} />
      </div>
      <span style={{ fontSize: "0.75rem", color: "#6b7280", minWidth: 28 }}>{pct}%</span>
    </div>
  );
}

export default function Analytics() {
  const stats = getAppStats();
  const engagement = getModuleEngagement();
  const users = getAllUsers();
  const students = users.filter((u) => u.role === "STUDENT");

  const pretestDone = stats.assessmentAttempts > 0 ? 1 : 0;
  const bothDone = 0;
  const avgGrowth = 0;

  return (
    <div>
      <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#111", marginBottom: 22 }}>Analytics</h1>

      {/* Pretest → Posttest Growth */}
      <div style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 10, padding: "20px 24px", marginBottom: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <h2 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#111", marginBottom: 16 }}>Pretest → Posttest Growth</h2>
        <div style={{ display: "flex", gap: 32, marginBottom: 20 }}>
          {[
            { label: "Students with Pretest", value: pretestDone },
            { label: "Completed Both", value: bothDone },
            { label: "Average Growth", value: avgGrowth + " %" },
          ].map((s) => (
            <div key={s.label}>
              <div style={{ fontSize: "0.7rem", color: "#6b7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: "1.55rem", fontWeight: 700, color: "#111" }}>{s.value}</div>
            </div>
          ))}
        </div>
        {bothDone === 0 && (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#9ca3af" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
            <div style={{ fontSize: "0.82rem" }}>No paired pre/post results yet</div>
          </div>
        )}
      </div>

      {/* Per-Module Engagement */}
      <div style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 10, padding: "20px 24px", marginBottom: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <h2 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#111", marginBottom: 16 }}>Per-Module Engagement</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Module", "Completions", "Completion Rate", "Key Check Attempts", "Pass Rate", "Avg Score"].map((h) => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid #e8eaed" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {engagement.map((mod, i) => (
              <tr key={mod.name} style={{ borderBottom: i < engagement.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                <td style={{ padding: "10px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 22, height: 22, borderRadius: 5, background: moduleColors[i % moduleColors.length], color: "#fff", fontSize: "0.62rem", fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span style={{ fontSize: "0.82rem", color: "#111", fontWeight: 500 }}>{mod.name}</span>
                  </div>
                </td>
                <td style={{ padding: "10px 12px", fontSize: "0.82rem", color: "#374151" }}>{mod.completions}</td>
                <td style={{ padding: "10px 12px" }}><BarCell value={mod.completionRate} max={100} /></td>
                <td style={{ padding: "10px 12px", fontSize: "0.82rem", color: "#374151" }}>{mod.keyCheckAttempts}</td>
                <td style={{ padding: "10px 12px" }}>
                  {mod.passRate > 0 ? (
                    <span style={{ fontSize: "0.78rem", fontWeight: 700, color: mod.passRate < 50 ? "#dc2626" : "#16a34a" }}>{mod.passRate}%</span>
                  ) : <span style={{ color: "#9ca3af", fontSize: "0.78rem" }}>—</span>}
                </td>
                <td style={{ padding: "10px 12px", fontSize: "0.82rem", color: mod.avgScore > 0 ? "#374151" : "#9ca3af" }}>
                  {mod.avgScore > 0 ? mod.avgScore + "%" : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Progress Drill-down */}
      <div style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 10, padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <h2 style={{ fontSize: "0.92rem", fontWeight: 700, color: "#111", marginBottom: 16 }}>Student Progress Drill-down</h2>
        <div style={{ marginBottom: 14 }}>
          <input placeholder="Search students by name or email..." style={{ padding: "8px 12px", borderRadius: 7, border: "1.5px solid #e8eaed", fontSize: "0.82rem", width: 280, outline: "none" }} />
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Student", "Modules Done", "Practice Score", "Pre-test", "Post-test"].map((h) => (
                <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid #e8eaed" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.slice(0, 5).map((student, i) => (
              <tr key={student.id} style={{ borderBottom: i < Math.min(students.length, 5) - 1 ? "1px solid #f3f4f6" : "none" }}>
                <td style={{ padding: "10px 12px" }}>
                  <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "#111" }}>{student.name}</div>
                  <div style={{ fontSize: "0.72rem", color: "#6b7280" }}>{student.email}</div>
                </td>
                <td style={{ padding: "10px 12px", fontSize: "0.82rem", color: "#374151" }}>—</td>
                <td style={{ padding: "10px 12px", fontSize: "0.82rem", color: "#374151" }}>—</td>
                <td style={{ padding: "10px 12px", fontSize: "0.78rem", color: "#9ca3af" }}>—</td>
                <td style={{ padding: "10px 12px", fontSize: "0.78rem", color: "#9ca3af" }}>—</td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr><td colSpan={5} style={{ padding: 24, textAlign: "center", color: "#9ca3af", fontSize: "0.82rem" }}>No students found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
