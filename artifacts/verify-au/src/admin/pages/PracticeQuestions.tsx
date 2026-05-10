import { useState } from "react";
import { practiceItems, type PracticeItem } from "../../data";

const moduleLabels: Record<number, string> = { 0: "01", 1: "02", 2: "03", 3: "04", 4: "05" };
const moduleColors: Record<number, string> = {
  0: "#0d9488", 1: "#7c3aed", 2: "#d97706", 3: "#dc2626", 4: "#0891b2",
};

function stripHtml(s: string) {
  return s.replace(/<[^>]*>/g, "");
}

function Modal({ item, onClose }: { item: PracticeItem | null; onClose: () => void }) {
  const [form, setForm] = useState<Partial<PracticeItem>>(
    item || { q1Options: ["", "", "", ""], q2Options: ["True", "False", "Misleading", "Unsupported"] }
  );
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "flex-end" }}>
      <div style={{ width: 500, background: "#fff", height: "100vh", padding: "28px 28px", overflowY: "auto", boxShadow: "-4px 0 20px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "#111" }}>{item ? "Edit Practice Question" : "New Practice Question"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#6b7280", lineHeight: 1 }}>×</button>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Claim / Content *</label>
          <textarea rows={3} value={stripHtml(form.postText || "")} onChange={(e) => setForm({ ...form, postText: e.target.value, title: e.target.value })} style={{ ...inp, resize: "vertical" }} placeholder="The actual claim or statement being fact-checked" />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Basis (AAP fact-check topic)</label>
          <input value={form.contextText || ""} onChange={(e) => setForm({ ...form, contextText: e.target.value })} style={inp} placeholder="Short description of the fact-check" />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Step 1 — Identify Verifiable Claim</label>
          <div style={{ background: "#f8fafb", borderRadius: 7, padding: "10px 12px", marginBottom: 8 }}>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginBottom: 8 }}>{form.q1 || "What is the specific, verifiable claim?"}</div>
            {(form.q1Options || []).map((opt, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 700, color: i === form.q1Correct ? "#0d9488" : "#9ca3af", minWidth: 16 }}>{i === form.q1Correct ? "✓" : String.fromCharCode(65 + i)}</span>
                <input value={opt} onChange={(e) => { const opts = [...(form.q1Options || [])]; opts[i] = e.target.value; setForm({ ...form, q1Options: opts }); }} style={{ ...inp, flex: 1, borderColor: i === form.q1Correct ? "#0d9488" : "#e8eaed", fontSize: "0.82rem" }} />
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
              <label style={{ ...lbl, margin: 0 }}>Correct:</label>
              <select value={form.q1Correct ?? 0} onChange={(e) => setForm({ ...form, q1Correct: Number(e.target.value) })} style={{ ...inp, maxWidth: 80, padding: "4px 8px" }}>
                {(form.q1Options || []).map((_, i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Step 2 — Judge the Claim</label>
          <div style={{ background: "#f8fafb", borderRadius: 7, padding: "10px 12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 8 }}>
              {["True", "False", "Misleading", "Unsupported"].map((opt) => (
                <div key={opt} style={{ padding: "6px 10px", borderRadius: 6, background: form.q2Correct === opt ? "#f0fdfa" : "#fff", border: `1.5px solid ${form.q2Correct === opt ? "#0d9488" : "#e8eaed"}`, fontSize: "0.82rem", color: form.q2Correct === opt ? "#0d9488" : "#374151", fontWeight: form.q2Correct === opt ? 700 : 500, cursor: "pointer", textAlign: "center" }} onClick={() => setForm({ ...form, q2Correct: opt, q2Verdict: opt })}>
                  {opt}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>AAP Explanation</label>
          <textarea rows={3} value={form.explanation || ""} onChange={(e) => setForm({ ...form, explanation: e.target.value })} style={{ ...inp, resize: "vertical" }} />
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 10, borderTop: "1px solid #f3f4f6" }}>
          <button onClick={onClose} style={outlineBtn}>Cancel</button>
          <button onClick={onClose} style={primaryBtn}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default function PracticeQuestions() {
  const [editing, setEditing] = useState<PracticeItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [filterVerdict, setFilterVerdict] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;

  const filtered = practiceItems.filter((p) => !filterVerdict || p.q2Verdict === filterVerdict);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const verdictCounts = practiceItems.reduce((acc, p) => {
    acc[p.q2Verdict] = (acc[p.q2Verdict] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#111", marginBottom: 2 }}>Practice Questions</h1>
          <p style={{ fontSize: "0.78rem", color: "#6b7280", margin: 0 }}>{practiceItems.length} AAP FactCheck scenarios</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <select value={filterVerdict} onChange={(e) => { setFilterVerdict(e.target.value); setPage(1); }} style={{ ...inp, maxWidth: 170, padding: "7px 10px" }}>
            <option value="">All verdicts</option>
            {["True", "False", "Misleading", "Unsupported"].map((v) => (
              <option key={v} value={v}>{v} ({verdictCounts[v] || 0})</option>
            ))}
          </select>
          <button onClick={() => { setEditing(null); setIsNew(true); }} style={primaryBtn}>+ New Question</button>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafb" }}>
              {["#", "Claim", "Basis", "Verdict", "Mechanisms", "Actions"].map((h) => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e8eaed" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((item, i) => {
              const absIdx = (page - 1) * PER_PAGE + i + 1;
              const VERDICTS: Record<string, string> = { True: "#16a34a", False: "#dc2626", Misleading: "#d97706", Unsupported: "#7c3aed" };
              const isStd = item.q2Verdict in VERDICTS;
              return (
                <tr key={item.id} style={{ borderBottom: i < paged.length - 1 ? "1px solid #f3f4f6" : "none", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ padding: "10px 14px", fontSize: "0.75rem", color: "#9ca3af", fontWeight: 600 }}>{absIdx}</td>
                  <td style={{ padding: "10px 14px", maxWidth: 380 }}>
                    <div style={{ fontSize: "0.82rem", color: "#111", lineHeight: 1.4 }}>
                      {stripHtml(item.postText).slice(0, 90)}{stripHtml(item.postText).length > 90 ? "…" : ""}
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px", maxWidth: 160 }}>
                    <div style={{ fontSize: "0.74rem", color: "#6b7280", lineHeight: 1.4 }}>{item.contextText.slice(0, 40)}{item.contextText.length > 40 ? "…" : ""}</div>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    {isStd ? (
                      <span style={{ fontSize: "0.7rem", fontWeight: 800, padding: "3px 8px", borderRadius: 20, color: VERDICTS[item.q2Verdict], background: VERDICTS[item.q2Verdict] + "18", border: `1px solid ${VERDICTS[item.q2Verdict]}55` }}>{item.q2Verdict}</span>
                    ) : (
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "3px 8px", borderRadius: 20, color: "#64748b", background: "#f1f5f9", border: "1px solid #e2e8f0" }}>Method Q</span>
                    )}
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                      {(item.mechanisms || []).map((m) => (
                        <span key={m} style={{ padding: "2px 7px", background: (moduleColors[m] || "#0d9488") + "15", color: moduleColors[m] || "#0d9488", borderRadius: 20, fontSize: "0.68rem", fontWeight: 700, border: `1px solid ${(moduleColors[m] || "#0d9488")}40` }}>
                          {moduleLabels[m] || String(m + 1).padStart(2, "0")}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => setEditing(item)} style={{ background: "none", border: "1px solid #e8eaed", borderRadius: 5, cursor: "pointer", fontSize: "0.75rem", color: "#374151", padding: "3px 10px", fontWeight: 500 }}>Edit</button>
                      <button style={{ background: "none", border: "1px solid #fecaca", borderRadius: 5, cursor: "pointer", fontSize: "0.75rem", color: "#dc2626", padding: "3px 10px", fontWeight: 500 }}>Del</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ padding: "12px 18px", borderTop: "1px solid #e8eaed", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafafa" }}>
          <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>{filtered.length} total · page {page} of {totalPages}</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} style={{ ...outlineBtn, padding: "4px 12px", fontSize: "0.75rem", opacity: page === 1 ? 0.5 : 1 }}>← Prev</button>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} style={{ ...outlineBtn, padding: "4px 12px", fontSize: "0.75rem", opacity: page === totalPages ? 0.5 : 1 }}>Next →</button>
          </div>
        </div>
      </div>
      {(editing || isNew) && <Modal item={editing} onClose={() => { setEditing(null); setIsNew(false); }} />}
    </div>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#374151", marginBottom: 4 };
const inp: React.CSSProperties = { width: "100%", padding: "8px 10px", borderRadius: 7, border: "1.5px solid #e8eaed", fontSize: "0.85rem", outline: "none", background: "#fff", boxSizing: "border-box" };
const primaryBtn: React.CSSProperties = { background: "#0d9488", color: "#fff", border: "none", borderRadius: 7, padding: "8px 18px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" };
const outlineBtn: React.CSSProperties = { background: "#fff", color: "#374151", border: "1px solid #e8eaed", borderRadius: 7, padding: "8px 16px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" };
