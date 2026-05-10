import { useState } from "react";
import { getAuditLogs } from "../adminStore";

const actionColors: Record<string, string> = {
  PRACTICE_CREATED: "#16a34a", PRACTICE_UPDATED: "#d97706",
  MODULE_CREATED: "#1e4fa8", USER_CREATED: "#7c3aed", WEEKLY_MODULE_SAVED: "#0891b2",
  USER_UPDATED: "#d97706",
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
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#111", marginBottom: 20 }}>Audit Logs</h1>
      <div style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        {/* Filters */}
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #e8eaed", display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input value={filterAction} onChange={(e) => { setFilterAction(e.target.value); setPage(1); }} placeholder="Filter by action…" style={inp} />
          <input value={filterEntity} onChange={(e) => { setFilterEntity(e.target.value); setPage(1); }} placeholder="Entity type…" style={{ ...inp, maxWidth: 180 }} />
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              {["Time", "Actor", "Action", "Entity", "Changes", "IP"].map((h) => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid #e8eaed" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((log, i) => (
              <tr key={log.id} style={{ borderBottom: i < paged.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                <td style={{ padding: "11px 14px", fontSize: "0.78rem", color: "#6b7280", whiteSpace: "nowrap" }}>{log.time}</td>
                <td style={{ padding: "11px 14px" }}>
                  <div style={{ fontWeight: 600, fontSize: "0.82rem", color: "#111" }}>{log.actor}</div>
                  <div style={{ fontSize: "0.72rem", color: "#6b7280" }}>{log.actorEmail}</div>
                </td>
                <td style={{ padding: "11px 14px" }}>
                  <span style={{
                    fontSize: "0.7rem", fontWeight: 700, padding: "3px 8px", borderRadius: 5, letterSpacing: "0.03em",
                    background: (actionColors[log.action] || "#6b7280") + "18",
                    color: actionColors[log.action] || "#6b7280",
                    border: `1px solid ${actionColors[log.action] || "#6b7280"}40`,
                  }}>{log.action}</span>
                </td>
                <td style={{ padding: "11px 14px", fontSize: "0.82rem", color: "#374151" }}>{log.entity}</td>
                <td style={{ padding: "11px 14px", fontSize: "0.82rem", color: "#9ca3af" }}>—</td>
                <td style={{ padding: "11px 14px", fontSize: "0.78rem", color: "#6b7280", fontFamily: "monospace" }}>{log.ip}</td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 32, textAlign: "center", color: "#9ca3af", fontSize: "0.82rem" }}>No audit logs found.</td></tr>
            )}
          </tbody>
        </table>
        <div style={{ padding: "12px 18px", borderTop: "1px solid #e8eaed", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>{filtered.length} entries</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} style={pgBtn}>‹</button>
            <span style={{ fontSize: "0.78rem", color: "#374151", padding: "0 4px" }}>{page}</span>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} style={pgBtn}>›</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inp: React.CSSProperties = { padding: "7px 10px", borderRadius: 7, border: "1.5px solid #e8eaed", fontSize: "0.82rem", outline: "none", background: "#fff", maxWidth: 220 };
const pgBtn: React.CSSProperties = { background: "#fff", border: "1px solid #e8eaed", borderRadius: 6, padding: "3px 10px", fontSize: "0.82rem", cursor: "pointer", color: "#374151" };
