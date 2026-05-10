import { useState } from "react";

interface AssessQ {
  id: string;
  type: "PRETEST" | "POSTTEST";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sortOrder: number;
  published: boolean;
}

const SEED_QUESTIONS: AssessQ[] = [
  { id: "a1", type: "PRETEST", question: 'A politician states: "Under our opponents, hospital waiting times have doubled in 2 years." Which part is a verifiable claim?', options: ["Our opponents are bad for healthcare.", "Hospital waiting times have doubled in 2 years.", "The healthcare system is in crisis.", "Waiting times are the most important issue."], correctIndex: 1, explanation: "The verifiable claim is the specific measurable assertion — checkable against health department data.", sortOrder: 0, published: true },
  { id: "a2", type: "PRETEST", question: 'A TV ad features an Olympic athlete saying "This housing policy will destroy our economy." What tactic is used?', options: ["False authority", "Emotional framing", "Selective evidence", "Misleading statistics"], correctIndex: 0, explanation: "An athlete has no economic expertise; this is false authority.", sortOrder: 1, published: true },
  { id: "a3", type: "PRETEST", question: 'A message says writing \'no suitable candidate to meet my will\' on a blank ballot can force a new election. This is mainly:', options: ["True — it triggers a constitutional process.", "False — blank ballots are counted as informal.", "Misleading — it overstates the effect.", "Unsupported — no evidence given."], correctIndex: 1, explanation: "Writing on a ballot makes it informal; no mechanism forces a new election this way.", sortOrder: 2, published: true },
  { id: "a4", type: "PRETEST", question: 'A report says "Renewable costs dropped 40% last year" but omits that the prior year saw a 60% spike. The concern is:', options: ["The figures are completely invented.", "Selective evidence — missing context changes meaning.", "Emotional framing — designed to provoke anger.", "False authority — no source is named."], correctIndex: 1, explanation: "Showing only part of a trend is classic selective evidence / cherry-picking.", sortOrder: 3, published: true },
  { id: "a5", type: "PRETEST", question: '"Unemployment is up 200% under this government." In absolute terms it went from 2% to 6%. The concern is:', options: ["The raw percentage change is accurate.", "Misleading statistics — percentage change hides small base.", "Emotional framing — language is designed to cause fear.", "False authority — no economist is quoted."], correctIndex: 1, explanation: "A 200% relative change from 2% to 6% sounds dramatic but the absolute level is still low.", sortOrder: 4, published: true },
  { id: "a6", type: "POSTTEST", question: 'A campaign ad says Australia\'s inflation has been consistently higher than any major advanced economy under Labor. AAP rated this claim:', options: ["True", "False", "Misleading", "Unsupported"], correctIndex: 1, explanation: "AAP Fact Check found this false — Australia's inflation compared favourably with peer economies.", sortOrder: 0, published: true },
  { id: "a7", type: "POSTTEST", question: 'A post says Australian law bans election results from being published for 72 hours after polls close. This claim is:', options: ["True", "False", "Misleading", "Unsupported"], correctIndex: 1, explanation: "No such ban exists — the AEC publishes results as they are counted.", sortOrder: 1, published: true },
  { id: "a8", type: "POSTTEST", question: 'Peter Dutton\'s \'$1300 power bill increase\' figure was judged by AAP as:', options: ["True", "False", "Misleading", "Unsupported"], correctIndex: 2, explanation: "AAP found the figure was based on selective assumptions that overstated the impact.", sortOrder: 2, published: true },
];

function Modal({ q, onClose }: { q: Partial<AssessQ> | null; onClose: () => void }) {
  const [form, setForm] = useState<Partial<AssessQ>>(q || { options: ["", ""], type: "PRETEST", published: true, sortOrder: 0 });
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "flex-end" }}>
      <div style={{ width: 460, background: "#fff", height: "100vh", padding: "28px", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ fontWeight: 700, fontSize: "1rem" }}>{form.id ? "Edit Assessment Question" : "New Assessment Question"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#6b7280" }}>×</button>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Test Type *</label>
          <select value={form.type || "PRETEST"} onChange={(e) => setForm({ ...form, type: e.target.value as AssessQ["type"] })} style={inp}>
            <option value="PRETEST">Pre-test</option>
            <option value="POSTTEST">Post-test</option>
          </select>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Question *</label>
          <textarea rows={4} value={form.question || ""} onChange={(e) => setForm({ ...form, question: e.target.value })} style={{ ...inp, resize: "vertical" }} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Options</label>
          {(form.options || []).map((opt, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              <input value={opt} onChange={(e) => { const opts = [...(form.options || [])]; opts[i] = e.target.value; setForm({ ...form, options: opts }); }} style={{ ...inp, flex: 1 }} placeholder={`Option ${i}`} />
              <button onClick={() => { const opts = (form.options || []).filter((_, j) => j !== i); setForm({ ...form, options: opts }); }} style={{ background: "none", border: "1px solid #dc2626", borderRadius: 6, color: "#dc2626", cursor: "pointer", padding: "2px 8px", fontSize: 14 }}>×</button>
            </div>
          ))}
          <button onClick={() => setForm({ ...form, options: [...(form.options || []), ""] })} style={ghostBtn}>+ Option</button>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Correct Index (0-based)</label>
          <input type="number" value={form.correctIndex ?? ""} onChange={(e) => setForm({ ...form, correctIndex: Number(e.target.value) })} style={{ ...inp, maxWidth: 80 }} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Explanation</label>
          <textarea rows={3} value={form.explanation || ""} onChange={(e) => setForm({ ...form, explanation: e.target.value })} style={{ ...inp, resize: "vertical" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
          <div>
            <label style={lbl}>Sort Order</label>
            <input type="number" value={form.sortOrder ?? 0} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} style={{ ...inp, maxWidth: 70 }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 18 }}>
            <div onClick={() => setForm({ ...form, published: !form.published })} style={{ width: 36, height: 20, borderRadius: 999, background: form.published ? "#1e4fa8" : "#d1d5db", position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
              <div style={{ position: "absolute", top: 2, left: form.published ? "calc(100% - 18px)" : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
            </div>
            <span style={{ fontSize: "0.78rem", color: "#374151" }}>Published</span>
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

export default function Assessments() {
  const [questions] = useState<AssessQ[]>(SEED_QUESTIONS);
  const [editing, setEditing] = useState<Partial<AssessQ> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [filterType, setFilterType] = useState("");

  const filtered = questions.filter((q) => !filterType || q.type === filterType);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#111" }}>Assessment Questions</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ ...inp, maxWidth: 150 }}>
            <option value="">Filter by type</option>
            <option value="PRETEST">Pre-test</option>
            <option value="POSTTEST">Post-test</option>
          </select>
          <button onClick={() => { setEditing(null); setIsNew(true); }} style={primaryBtn}>+ New Question</button>
        </div>
      </div>
      <div style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              {["Type", "Question", "Options", "Published", "Actions"].map((h) => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid #e8eaed" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((q, i) => (
              <tr key={q.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                <td style={{ padding: "11px 14px" }}>
                  <span style={{
                    fontSize: "0.7rem", fontWeight: 800, padding: "3px 7px", borderRadius: 5, letterSpacing: "0.04em",
                    background: q.type === "PRETEST" ? "#fff7ed" : "#f5f3ff",
                    color: q.type === "PRETEST" ? "#c2410c" : "#6d28d9",
                    border: `1px solid ${q.type === "PRETEST" ? "#fed7aa" : "#ddd6fe"}`,
                  }}>{q.type}</span>
                </td>
                <td style={{ padding: "11px 14px", maxWidth: 480 }}>
                  <div style={{ fontSize: "0.82rem", color: "#111", lineHeight: 1.4 }}>{q.question.slice(0, 100)}{q.question.length > 100 ? "…" : ""}</div>
                </td>
                <td style={{ padding: "11px 14px", fontSize: "0.82rem", color: "#374151" }}>{q.options.length}</td>
                <td style={{ padding: "11px 14px" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: q.published ? "#16a34a" : "#9ca3af" }}>{q.published ? "Yes" : "No"}</span>
                </td>
                <td style={{ padding: "11px 14px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setEditing(q)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 15, color: "#6b7280" }}>✏️</button>
                    <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 15, color: "#dc2626" }}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: "12px 18px", borderTop: "1px solid #e8eaed", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>{filtered.length} questions</span>
          <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>Page 1 of 1</span>
        </div>
      </div>
      {(editing !== null || isNew) && <Modal q={editing} onClose={() => { setEditing(null); setIsNew(false); }} />}
    </div>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#374151", marginBottom: 5 };
const inp: React.CSSProperties = { width: "100%", padding: "8px 10px", borderRadius: 7, border: "1.5px solid #e8eaed", fontSize: "0.85rem", outline: "none", background: "#fff" };
const primaryBtn: React.CSSProperties = { background: "#1e4fa8", color: "#fff", border: "none", borderRadius: 7, padding: "8px 16px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" };
const outlineBtn: React.CSSProperties = { background: "#fff", color: "#374151", border: "1px solid #e8eaed", borderRadius: 7, padding: "8px 16px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" };
const ghostBtn: React.CSSProperties = { background: "none", border: "1px dashed #d1d5db", borderRadius: 6, padding: "5px 10px", fontSize: "0.78rem", color: "#6b7280", cursor: "pointer" };
