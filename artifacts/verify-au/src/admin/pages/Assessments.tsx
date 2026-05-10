import { useState } from "react";
import { selfSkillsAssessmentData } from "../../data";

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

function buildSeedFromData(): AssessQ[] {
  const pre: AssessQ[] = selfSkillsAssessmentData.initial.items.map((item, i) => ({
    id: "pre-" + (i + 1),
    type: "PRETEST",
    question: item.question,
    options: item.options,
    correctIndex: item.correctIndex,
    explanation: "",
    sortOrder: i,
    published: true,
  }));
  const post: AssessQ[] = selfSkillsAssessmentData.final.items.map((item, i) => ({
    id: "post-" + (i + 1),
    type: "POSTTEST",
    question: item.question,
    options: item.options,
    correctIndex: item.correctIndex,
    explanation: "",
    sortOrder: i,
    published: true,
  }));
  return [...pre, ...post];
}

const SEED_QUESTIONS: AssessQ[] = buildSeedFromData();

function Modal({ q, onClose }: { q: Partial<AssessQ> | null; onClose: () => void }) {
  const [form, setForm] = useState<Partial<AssessQ>>(q || { options: ["", ""], type: "PRETEST", published: true, sortOrder: 0 });
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "flex-end" }}>
      <div style={{ width: 480, background: "#fff", height: "100vh", padding: "28px", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "#111" }}>{form.id ? "Edit Assessment Question" : "New Assessment Question"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#6b7280" }}>×</button>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Test Type *</label>
          <select value={form.type || "PRETEST"} onChange={(e) => setForm({ ...form, type: e.target.value as AssessQ["type"] })} style={inp}>
            <option value="PRETEST">Initial Assessment (Pre-test)</option>
            <option value="POSTTEST">Final Assessment (Post-test)</option>
          </select>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Question *</label>
          <textarea rows={5} value={form.question || ""} onChange={(e) => setForm({ ...form, question: e.target.value })} style={{ ...inp, resize: "vertical" }} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Options</label>
          {(form.options || []).map((opt, i) => (
            <div key={i} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: i === form.correctIndex ? "#0d9488" : "#9ca3af", minWidth: 18 }}>{i === form.correctIndex ? "✓" : String.fromCharCode(65 + i)}</span>
              <input value={opt} onChange={(e) => { const opts = [...(form.options || [])]; opts[i] = e.target.value; setForm({ ...form, options: opts }); }} style={{ ...inp, flex: 1, borderColor: i === form.correctIndex ? "#0d9488" : "#e8eaed" }} placeholder={`Option ${String.fromCharCode(65 + i)}`} />
              <button onClick={() => { const opts = (form.options || []).filter((_, j) => j !== i); setForm({ ...form, options: opts }); }} style={{ background: "none", border: "1px solid #fecaca", borderRadius: 6, color: "#dc2626", cursor: "pointer", padding: "4px 8px", fontSize: 13 }}>×</button>
            </div>
          ))}
          <button onClick={() => setForm({ ...form, options: [...(form.options || []), ""] })} style={ghostBtn}>+ Add Option</button>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Correct Answer (0-based index)</label>
          <select value={form.correctIndex ?? ""} onChange={(e) => setForm({ ...form, correctIndex: Number(e.target.value) })} style={{ ...inp, maxWidth: 200 }}>
            {(form.options || []).map((opt, i) => (
              <option key={i} value={i}>{i}: {opt.slice(0, 40)}{opt.length > 40 ? "…" : ""}</option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
          <div>
            <label style={lbl}>Sort Order</label>
            <input type="number" value={form.sortOrder ?? 0} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} style={{ ...inp, maxWidth: 80 }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 18 }}>
            <div onClick={() => setForm({ ...form, published: !form.published })} style={{ width: 36, height: 20, borderRadius: 999, background: form.published ? "#0d9488" : "#d1d5db", position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
              <div style={{ position: "absolute", top: 2, left: form.published ? "calc(100% - 18px)" : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
            </div>
            <span style={{ fontSize: "0.78rem", color: "#374151" }}>Published</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={outlineBtn}>Cancel</button>
          <button onClick={onClose} style={primaryBtn}>Save Changes</button>
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
  const pre = questions.filter((q) => q.type === "PRETEST");
  const post = questions.filter((q) => q.type === "POSTTEST");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#111", marginBottom: 2 }}>Assessment Questions</h1>
          <p style={{ fontSize: "0.78rem", color: "#6b7280", margin: 0 }}>{pre.length} initial · {post.length} final · {questions.length} total</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ ...inp, maxWidth: 180, padding: "7px 10px" }}>
            <option value="">All types</option>
            <option value="PRETEST">Initial (Pre-test)</option>
            <option value="POSTTEST">Final (Post-test)</option>
          </select>
          <button onClick={() => { setEditing(null); setIsNew(true); }} style={primaryBtn}>+ New Question</button>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafb" }}>
              {["#", "Type", "Question", "Options", "Correct", "Published", "Actions"].map((h) => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e8eaed" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((q, i) => (
              <tr key={q.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f3f4f6" : "none", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ padding: "10px 14px", fontSize: "0.75rem", color: "#9ca3af", fontWeight: 600 }}>{i + 1}</td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{
                    fontSize: "0.68rem", fontWeight: 800, padding: "3px 8px", borderRadius: 20, letterSpacing: "0.04em",
                    background: q.type === "PRETEST" ? "#fef3c7" : "#f0fdfa",
                    color: q.type === "PRETEST" ? "#92400e" : "#0d9488",
                    border: `1px solid ${q.type === "PRETEST" ? "#fde68a" : "#99f6e4"}`,
                  }}>{q.type === "PRETEST" ? "Initial" : "Final"}</span>
                </td>
                <td style={{ padding: "10px 14px", maxWidth: 460 }}>
                  <div style={{ fontSize: "0.82rem", color: "#111", lineHeight: 1.45 }}>{q.question.slice(0, 110)}{q.question.length > 110 ? "…" : ""}</div>
                </td>
                <td style={{ padding: "10px 14px", fontSize: "0.82rem", color: "#6b7280", textAlign: "center" }}>{q.options.length}</td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{ fontSize: "0.75rem", color: "#0d9488", fontWeight: 700 }}>
                    {String.fromCharCode(65 + q.correctIndex)}
                  </span>
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: q.published ? "#16a34a" : "#9ca3af" }}>{q.published ? "Yes" : "No"}</span>
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setEditing(q)} style={{ background: "none", border: "1px solid #e8eaed", borderRadius: 5, cursor: "pointer", fontSize: 13, color: "#6b7280", padding: "3px 8px" }}>Edit</button>
                    <button style={{ background: "none", border: "1px solid #fecaca", borderRadius: 5, cursor: "pointer", fontSize: 13, color: "#dc2626", padding: "3px 8px" }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: "12px 18px", borderTop: "1px solid #e8eaed", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafafa" }}>
          <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>{filtered.length} questions shown</span>
          <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>Page 1 of 1</span>
        </div>
      </div>
      {(editing !== null || isNew) && <Modal q={editing} onClose={() => { setEditing(null); setIsNew(false); }} />}
    </div>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#374151", marginBottom: 5 };
const inp: React.CSSProperties = { width: "100%", padding: "8px 10px", borderRadius: 7, border: "1.5px solid #e8eaed", fontSize: "0.85rem", outline: "none", background: "#fff", boxSizing: "border-box" };
const primaryBtn: React.CSSProperties = { background: "#0d9488", color: "#fff", border: "none", borderRadius: 7, padding: "8px 16px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" };
const outlineBtn: React.CSSProperties = { background: "#fff", color: "#374151", border: "1px solid #e8eaed", borderRadius: 7, padding: "8px 16px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" };
const ghostBtn: React.CSSProperties = { background: "none", border: "1px dashed #d1d5db", borderRadius: 6, padding: "5px 10px", fontSize: "0.78rem", color: "#6b7280", cursor: "pointer", marginTop: 4 };
