import { useState } from "react";
import { practiceItems, type PracticeItem } from "../../data";

const verdictColors: Record<string, string> = {
  True: "#16a34a", False: "#dc2626", Misleading: "#d97706", Unsupported: "#7c3aed",
};
const moduleNums = ["01", "02", "03", "04", "05"];

function Modal({ item, onClose }: { item: PracticeItem | null; onClose: () => void }) {
  const [form, setForm] = useState<Partial<PracticeItem>>(item || { q1Options: ["", ""], q2Options: ["True", "False", "Misleading", "Unsupported"] });
  if (!form) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "flex-end" }}>
      <div style={{ width: 460, background: "#fff", height: "100vh", padding: "28px", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ fontWeight: 700, fontSize: "1rem" }}>{item ? "Edit Practice Question" : "New Practice Question"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#6b7280" }}>×</button>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Content / Claim *</label>
          <textarea rows={3} value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} style={{ ...inp, resize: "vertical" }} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Basis</label>
          <input value={form.contextText || ""} onChange={(e) => setForm({ ...form, contextText: e.target.value })} style={inp} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Step 1 — Identify Claim</label>
          {(form.q1Options || []).map((opt, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              <input value={opt} onChange={(e) => { const opts = [...(form.q1Options || [])]; opts[i] = e.target.value; setForm({ ...form, q1Options: opts }); }} style={{ ...inp, flex: 1 }} placeholder={`Option ${i}`} />
              <button onClick={() => { const opts = (form.q1Options || []).filter((_, j) => j !== i); setForm({ ...form, q1Options: opts }); }} style={{ background: "none", border: "1px solid #dc2626", borderRadius: 6, color: "#dc2626", cursor: "pointer", padding: "2px 8px", fontSize: 14 }}>×</button>
            </div>
          ))}
          <button onClick={() => setForm({ ...form, q1Options: [...(form.q1Options || []), ""] })} style={ghostBtn}>+ Option</button>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Correct Index (0-based)</label>
          <input type="number" value={form.q1Correct ?? ""} onChange={(e) => setForm({ ...form, q1Correct: Number(e.target.value) })} style={{ ...inp, maxWidth: 80 }} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Explanation</label>
          <textarea rows={3} value={form.explanation || ""} onChange={(e) => setForm({ ...form, explanation: e.target.value })} style={{ ...inp, resize: "vertical" }} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Step 2 — Judge Verdict</label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {["True", "False", "Misleading", "Unsupported"].map((opt) => (
              <div key={opt} style={{ display: "flex", gap: 6 }}>
                <input value={opt} readOnly style={{ ...inp, flex: 1, color: verdictColors[opt] }} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Correct Verdict</label>
          <select value={form.q2Correct || ""} onChange={(e) => setForm({ ...form, q2Correct: e.target.value, q2Verdict: e.target.value })} style={inp}>
            <option value="">Select</option>
            {["True", "False", "Misleading", "Unsupported"].map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div style={{ borderTop: "1px solid #e8eaed", paddingTop: 14, marginBottom: 14 }}>
          <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: 10 }}>Settings</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div>
              <label style={lbl}>Sort Order</label>
              <input type="number" value={0} readOnly style={{ ...inp, maxWidth: 70 }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 18 }}>
              <div style={{ width: 36, height: 20, borderRadius: 999, background: "#1e4fa8", position: "relative", cursor: "pointer" }}>
                <div style={{ position: "absolute", top: 2, right: 2, width: 16, height: 16, borderRadius: "50%", background: "#fff" }} />
              </div>
              <span style={{ fontSize: "0.78rem", color: "#374151" }}>Published</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={outlineBtn}>Cancel</button>
          <button onClick={onClose} style={primaryBtn}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default function PracticeQuestions() {
  const [showDeleted, setShowDeleted] = useState(false);
  const [editing, setEditing] = useState<PracticeItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [filterVerdict, setFilterVerdict] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;

  const filtered = practiceItems.filter((p) => !filterVerdict || p.q2Correct === filterVerdict);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#111" }}>Practice Questions</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "#6b7280", cursor: "pointer" }}>
            <input type="checkbox" checked={showDeleted} onChange={(e) => setShowDeleted(e.target.checked)} /> Hide Deleted
          </label>
          <button onClick={() => { setEditing(null); setIsNew(true); }} style={primaryBtn}>+ New Question</button>
        </div>
      </div>
      <div style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              {["Content (snippet)", "Basis", "Modules (Step 3)", "Published", "Actions"].map((h) => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid #e8eaed" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((item, i) => (
              <tr key={item.id} style={{ borderBottom: i < paged.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                <td style={{ padding: "11px 14px", maxWidth: 400 }}>
                  <div style={{ fontSize: "0.82rem", color: "#111", lineHeight: 1.4 }}>{item.title.slice(0, 80)}{item.title.length > 80 ? "…" : ""}</div>
                </td>
                <td style={{ padding: "11px 14px", maxWidth: 180 }}>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280", lineHeight: 1.4 }}>{item.contextText.slice(0, 45)}…</div>
                </td>
                <td style={{ padding: "11px 14px" }}>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {["04", "05"].map((n) => (
                      <span key={n} style={{ padding: "2px 6px", background: "#eff4ff", color: "#1e4fa8", borderRadius: 4, fontSize: "0.7rem", fontWeight: 700 }}>{n}</span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: "11px 14px" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#16a34a" }}>Yes</span>
                </td>
                <td style={{ padding: "11px 14px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setEditing(item)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 15, color: "#6b7280" }}>✏️</button>
                    <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 15, color: "#dc2626" }}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: "12px 18px", borderTop: "1px solid #e8eaed", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>{filtered.length} total</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} style={{ ...outlineBtn, padding: "4px 10px", fontSize: "0.75rem" }}>‹</button>
            <span style={{ fontSize: "0.78rem", color: "#374151" }}>{page} / {totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} style={{ ...outlineBtn, padding: "4px 10px", fontSize: "0.75rem" }}>›</button>
          </div>
        </div>
      </div>
      {(editing || isNew) && <Modal item={editing} onClose={() => { setEditing(null); setIsNew(false); }} />}
    </div>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#374151", marginBottom: 5 };
const inp: React.CSSProperties = { width: "100%", padding: "8px 10px", borderRadius: 7, border: "1.5px solid #e8eaed", fontSize: "0.85rem", outline: "none", background: "#fff" };
const primaryBtn: React.CSSProperties = { background: "#1e4fa8", color: "#fff", border: "none", borderRadius: 7, padding: "8px 16px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" };
const outlineBtn: React.CSSProperties = { background: "#fff", color: "#374151", border: "1px solid #e8eaed", borderRadius: 7, padding: "8px 16px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" };
const ghostBtn: React.CSSProperties = { background: "none", border: "1px dashed #d1d5db", borderRadius: 6, padding: "5px 10px", fontSize: "0.78rem", color: "#6b7280", cursor: "pointer" };
