import { useState } from "react";
import { getAuditLogs } from "../adminStore";

const actionColors: Record<string, string> = {
  PRACTICE_CREATED: "#16a34a",
  PRACTICE_UPDATED: "#d97706",
  MODULE_CREATED:   "#0d9488",
  MODULE_UPDATED:   "#0d9488",
  USER_CREATED:     "#7c3aed",
  USER_UPDATED:     "#d97706",
  ASSESSMENT_CREATED: "#0891b2",
  WEEKLY_MODULE_SAVED: "#64748b",
};

export default function AuditLogs() {
  const [logs] = useState(getAuditLogs);
  const [filterAction, setFilterAction] = useState("");
  const [filterEntity, setFilterEntity] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  const filtered = logs.filter((l) =>
    (!filterAction || l.action.toLowerCase().includes(filterAction.toLowerCase())) &&
    (!filterEntity || l.entity.toLowerCase().includes(filterEntity.toLowerCase()))
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>Audit Logs</h1>
        <p style={{ fontSize: "0.78rem", color: "#64748b", margin: 0 }}>Record of all content and user changes.</p>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #e2e8f0", display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input value={filterAction} onChange={(e) => { setFilterAction(e.target.value); setPage(1); }} placeholder="Filter by action..." style={inp} />
          <input value={filterEntity} onChange={(e) => { setFilterEntity(e.target.value); setPage(1); }} placeholder="Filter by entity..." style={{ ...inp, maxWidth: 200 }} />
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafb" }}>
              {["Time", "Actor", "Action", "Entity", "IP Address"].map((h) => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((log, i) => (
              <tr key={log.id} style={{ borderBottom: i < paged.length - 1 ? "1px solid #f1f5f9" : "none", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ padding: "11px 14px", fontSize: "0.77rem", color: "#64748b", whiteSpace: "nowrap" }}>{log.time}</td>
                <td style={{ padding: "11px 14px" }}>
                  <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "#0f172a" }}>{log.actor}</div>
                  <div style={{ fontSize: "0.72rem", color: "#64748b" }}>{log.actorEmail}</div>
                </td>
                <td style={{ padding: "11px 14px" }}>
                  <span style={{
                    fontSize: "0.68rem", fontWeight: 700, padding: "3px 8px", borderRadius: 20, letterSpacing: "0.03em",
                    background: (actionColors[log.action] || "#64748b") + "18",
                    color: actionColors[log.action] || "#64748b",
                    border: `1px solid ${(actionColors[log.action] || "#64748b")}40`,
                  }}>{log.action.replace(/_/g, " ")}</span>
                </td>
                <td style={{ padding: "11px 14px", fontSize: "0.82rem", color: "#374151" }}>{log.entity}</td>
                <td style={{ padding: "11px 14px", fontSize: "0.77rem", color: "#94a3b8", fontFamily: "monospace" }}>{log.ip}</td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr><td colSpan={5} style={{ padding: 32, textAlign: "center", color: "#94a3b8", fontSize: "0.82rem" }}>No records match the current filter.</td></tr>
            )}
          </tbody>
        </table>

        <div style={{ padding: "12px 18px", borderTop: "1px solid #e2e8f0", background: "#fafafa", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.78rem", color: "#64748b" }}>{filtered.length} entries</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} style={pgBtn}>Prev</button>
            <span style={{ fontSize: "0.78rem", color: "#374151", padding: "0 6px" }}>{page} / {totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} style={pgBtn}>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inp: React.CSSProperties = { padding: "7px 10px", borderRadius: 7, border: "1.5px solid #e2e8f0", fontSize: "0.82rem", outline: "none", background: "#fff", maxWidth: 220 };
const pgBtn: React.CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, padding: "4px 12px", fontSize: "0.78rem", cursor: "pointer", color: "#374151" };
