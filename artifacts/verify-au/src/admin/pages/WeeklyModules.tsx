import { useState } from "react";
import { getWeeklyModules, saveWeeklyModules, type WeeklyModule, addAuditLog } from "../adminStore";
import { practiceItems } from "../../data";

const MODULE_TAGS = ["Emotional Framing", "Claim Identification", "Selective Evidence", "False Authority", "Misleading Statistics"];

function Modal({ wm, onSave, onClose }: { wm: Partial<WeeklyModule>; onSave: (w: WeeklyModule) => void; onClose: () => void }) {
  const [form, setForm] = useState<Partial<WeeklyModule>>({
    ...wm,
    tags: wm.tags || [],
    linkedQuestions: wm.linkedQuestions || [],
    published: wm.published ?? true,
    sortOrder: wm.sortOrder ?? 0,
    color: wm.color || "#0d9488",
  });

  function toggleTag(tag: string) {
    const tags = form.tags || [];
    setForm({ ...form, tags: tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag] });
  }

  function toggleQ(id: string) {
    const qs = form.linkedQuestions || [];
    setForm({ ...form, linkedQuestions: qs.includes(id) ? qs.filter((q) => q !== id) : [...qs, id] });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.label || !form.title) return;
    onSave({
      id: form.id || Date.now().toString(),
      label: form.label!,
      title: form.title!,
      description: form.description || "",
      context: form.context || "",
      color: form.color || "#0d9488",
      tags: form.tags || [],
      startDate: form.startDate,
      endDate: form.endDate,
      linkedQuestions: form.linkedQuestions || [],
      sortOrder: form.sortOrder ?? 0,
      published: form.published ?? true,
    });
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "flex-end" }}>
      <div style={{ width: 460, background: "#fff", height: "100vh", padding: "28px", overflowY: "auto", boxShadow: "-4px 0 20px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a" }}>{form.id ? "Edit Weekly Module" : "New Weekly Module"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#6b7280", lineHeight: 1 }}>×</button>
        </div>
        <form onSubmit={submit}>
          {[
            { key: "label", label: "Week Label", placeholder: "Week 1 — May 2026" },
            { key: "title", label: "Title", placeholder: "Module title" },
          ].map((f) => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <label style={lbl}>{f.label} *</label>
              <input value={(form as Record<string, string>)[f.key] || ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder} style={inp} required />
            </div>
          ))}
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Description</label>
            <textarea rows={2} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ ...inp, resize: "vertical" }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Context</label>
            <textarea rows={4} value={form.context || ""} onChange={(e) => setForm({ ...form, context: e.target.value })} style={{ ...inp, resize: "vertical" }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Accent Colour</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input type="color" value={form.color || "#0d9488"} onChange={(e) => setForm({ ...form, color: e.target.value })} style={{ width: 40, height: 36, borderRadius: 6, border: "1.5px solid #e2e8f0", cursor: "pointer", padding: 2 }} />
              <input value={form.color || "#0d9488"} onChange={(e) => setForm({ ...form, color: e.target.value })} style={{ ...inp, flex: 1 }} />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Tags</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {MODULE_TAGS.map((tag) => {
                const active = (form.tags || []).includes(tag);
                return (
                  <button key={tag} type="button" onClick={() => toggleTag(tag)} style={{ padding: "4px 10px", borderRadius: 999, fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", border: "1.5px solid", background: active ? "#f0fdfa" : "#fff", color: active ? "#0d9488" : "#6b7280", borderColor: active ? "#0d9488" : "#d1d5db" }}>
                    {tag}{active ? " ×" : ""}
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div>
              <label style={lbl}>Start Date</label>
              <input type="date" value={form.startDate || ""} onChange={(e) => setForm({ ...form, startDate: e.target.value })} style={inp} />
            </div>
            <div>
              <label style={lbl}>End Date</label>
              <input type="date" value={form.endDate || ""} onChange={(e) => setForm({ ...form, endDate: e.target.value })} style={inp} />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Linked Practice Questions</label>
            <div style={{ border: "1.5px solid #e2e8f0", borderRadius: 7, maxHeight: 140, overflowY: "auto", padding: "6px 8px" }}>
              {practiceItems.slice(0, 10).map((p) => (
                <label key={p.id} style={{ display: "flex", alignItems: "flex-start", gap: 6, padding: "3px 0", cursor: "pointer", fontSize: "0.78rem", color: "#374151" }}>
                  <input type="checkbox" checked={(form.linkedQuestions || []).includes(p.id)} onChange={() => toggleQ(p.id)} style={{ marginTop: 2 }} />
                  {p.title.slice(0, 60)}{p.title.length > 60 ? "…" : ""}
                </label>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
            <div>
              <label style={lbl}>Sort Order</label>
              <input type="number" value={form.sortOrder ?? 0} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} style={{ ...inp, maxWidth: 70 }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 18 }}>
              <div onClick={() => setForm({ ...form, published: !form.published })} style={{ width: 36, height: 20, borderRadius: 999, background: form.published ? "#0d9488" : "#d1d5db", position: "relative", cursor: "pointer", transition: "background 0.2s" }}>
                <div style={{ position: "absolute", top: 2, left: form.published ? "calc(100% - 18px)" : 2, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "left 0.2s" }} />
              </div>
              <span style={{ fontSize: "0.78rem", color: "#374151" }}>Published</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button type="button" onClick={onClose} style={outlineBtn}>Cancel</button>
            <button type="submit" style={primaryBtn}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function WeeklyModules() {
  const [modules, setModules] = useState(getWeeklyModules);
  const [editing, setEditing] = useState<Partial<WeeklyModule> | null>(null);
  const [isNew, setIsNew] = useState(false);

  function save(wm: WeeklyModule) {
    const updated = modules.find((m) => m.id === wm.id)
      ? modules.map((m) => m.id === wm.id ? wm : m)
      : [...modules, wm];
    saveWeeklyModules(updated);
    setModules(updated);
    addAuditLog({ actor: "Platform Admin", actorEmail: "admin@verifyau.edu.au", action: "WEEKLY_MODULE_SAVED", entity: `Weekly: ${wm.title}`, ip: "203.12.160.1" });
    setEditing(null);
    setIsNew(false);
  }

  const visible = modules.filter((m) => !m.deleted);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>Weekly Modules</h1>
          <p style={{ fontSize: "0.78rem", color: "#64748b", margin: 0 }}>{visible.length} published week{visible.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => { setEditing({}); setIsNew(true); }} style={primaryBtn}>+ New Week</button>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafb" }}>
              {["Label", "Title", "Tags", "Questions", "Window", "Published", "Actions"].map((h) => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((wm, i) => (
              <tr key={wm.id} style={{ borderBottom: i < visible.length - 1 ? "1px solid #f1f5f9" : "none", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: wm.color, flexShrink: 0, display: "inline-block" }} />
                    <span style={{ fontWeight: 600, fontSize: "0.82rem", color: "#0f172a" }}>{wm.label}</span>
                  </div>
                </td>
                <td style={{ padding: "12px 14px", fontSize: "0.82rem", color: "#374151" }}>{wm.title}</td>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {wm.tags.slice(0, 2).map((t) => (
                      <span key={t} style={{ fontSize: "0.68rem", padding: "2px 7px", borderRadius: 20, background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }}>{t}</span>
                    ))}
                    {wm.tags.length > 2 && <span style={{ fontSize: "0.68rem", color: "#94a3b8" }}>+{wm.tags.length - 2}</span>}
                  </div>
                </td>
                <td style={{ padding: "12px 14px", fontSize: "0.82rem", color: "#374151" }}>{wm.linkedQuestions.length}</td>
                <td style={{ padding: "12px 14px", fontSize: "0.8rem", color: "#64748b" }}>
                  {wm.startDate && wm.endDate ? `${wm.startDate} – ${wm.endDate}` : "—"}
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: wm.published ? "#16a34a" : "#94a3b8" }}>{wm.published ? "Yes" : "No"}</span>
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setEditing(wm)} style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 5, cursor: "pointer", fontSize: "0.75rem", color: "#374151", padding: "3px 10px" }}>Edit</button>
                    <button style={{ background: "none", border: "1px solid #fecaca", borderRadius: 5, cursor: "pointer", fontSize: "0.75rem", color: "#dc2626", padding: "3px 10px" }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={7} style={{ padding: 32, textAlign: "center", color: "#94a3b8", fontSize: "0.82rem" }}>No weekly modules created yet.</td></tr>
            )}
          </tbody>
        </table>
        <div style={{ padding: "12px 18px", borderTop: "1px solid #e2e8f0", background: "#fafafa" }}>
          <span style={{ fontSize: "0.78rem", color: "#64748b" }}>{visible.length} record{visible.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {(editing !== null || isNew) && (
        <Modal wm={editing || {}} onSave={save} onClose={() => { setEditing(null); setIsNew(false); }} />
      )}
    </div>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#374151", marginBottom: 5 };
const inp: React.CSSProperties = { width: "100%", padding: "8px 10px", borderRadius: 7, border: "1.5px solid #e2e8f0", fontSize: "0.85rem", outline: "none", background: "#fff", boxSizing: "border-box" };
const primaryBtn: React.CSSProperties = { background: "#0d9488", color: "#fff", border: "none", borderRadius: 7, padding: "8px 18px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" };
const outlineBtn: React.CSSProperties = { background: "#fff", color: "#374151", border: "1px solid #e2e8f0", borderRadius: 7, padding: "8px 16px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" };
