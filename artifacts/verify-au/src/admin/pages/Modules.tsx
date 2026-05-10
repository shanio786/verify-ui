import { useState } from "react";
import { moduleData, type Module, type FlashCard } from "../../data";

const moduleColors = ["#16a34a", "#d97706", "#dc2626", "#7c3aed", "#0891b2"];

interface EditCard { t: string; p: string; au: string; reflect: string; }

function CardModal({ card, onSave, onClose }: { card: EditCard; onSave: (c: EditCard) => void; onClose: () => void }) {
  const [form, setForm] = useState(card);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "flex-end" }}>
      <div style={{ width: 440, background: "#fff", height: "100vh", padding: "28px", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ fontWeight: 700, fontSize: "1rem" }}>Edit Card</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#6b7280" }}>×</button>
        </div>
        {[
          { key: "t", label: "Title", rows: 1 },
          { key: "p", label: "Body", rows: 3 },
          { key: "au", label: "AU Example", rows: 3 },
          { key: "reflect", label: "Key Check", rows: 2 },
        ].map((f) => (
          <div key={f.key} style={{ marginBottom: 14 }}>
            <label style={lbl}>{f.label} *</label>
            <textarea rows={f.rows} value={(form as Record<string, string>)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} style={{ ...inp, resize: "vertical" }} />
          </div>
        ))}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 10 }}>
          <button onClick={onClose} style={outlineBtn}>Cancel</button>
          <button onClick={() => onSave(form)} style={primaryBtn}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default function Modules() {
  const [mods, setMods] = useState<Module[]>(moduleData);
  const [expanded, setExpanded] = useState<number[]>([0]);
  const [editingCard, setEditingCard] = useState<{ modIdx: number; cardIdx: number; card: EditCard } | null>(null);

  function toggleExpand(i: number) {
    setExpanded((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
  }

  function saveCard(modIdx: number, cardIdx: number, card: EditCard) {
    const updated = mods.map((m, mi) => mi === modIdx ? { ...m, cards: m.cards.map((c, ci) => ci === cardIdx ? card : c) } : m);
    setMods(updated);
    setEditingCard(null);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#111" }}>Modules & Cards</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "#6b7280", cursor: "pointer" }}>
            <input type="checkbox" /> Hide Deleted
          </label>
          <button style={primaryBtn}>+ New Module</button>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              {["Num", "Name", "", "Cards", "Published", "Actions"].map((h) => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid #e8eaed" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mods.map((mod, mi) => {
              const isExpanded = expanded.includes(mi);
              const color = moduleColors[mi % moduleColors.length];
              return (
                <>
                  <tr key={mod.title} style={{ borderBottom: "1px solid #e8eaed", background: "#fff" }}>
                    <td style={{ padding: "12px 14px", width: 60 }}>
                      <button onClick={() => toggleExpand(mi)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: "#6b7280", marginRight: 6 }}>
                        {isExpanded ? "▼" : "▶"}
                      </button>
                      <span style={{ display: "inline-flex", width: 22, height: 22, borderRadius: 5, background: color, color: "#fff", fontSize: "0.65rem", fontWeight: 800, alignItems: "center", justifyContent: "center" }}>
                        {String(mi + 1).padStart(2, "0")}
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", fontWeight: 600, fontSize: "0.88rem", color: "#111" }} colSpan={2}>{mod.title}</td>
                    <td style={{ padding: "12px 14px", fontSize: "0.82rem", color: "#374151" }}>{mod.cards.length}</td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#16a34a" }}>Yes</span>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 15, color: "#6b7280" }}>✏️</button>
                        <button style={{ ...outlineBtn, padding: "3px 8px", fontSize: "0.72rem" }}>+ Card</button>
                        <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 15, color: "#dc2626" }}>🗑</button>
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={mod.title + "-cards"} style={{ background: "#f9fafb" }}>
                      <td colSpan={6} style={{ padding: "0 14px 14px 50px" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
                          <thead>
                            <tr>
                              {["#", "Title", "Key Check", "Actions"].map((h) => (
                                <th key={h} style={{ padding: "6px 12px", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", borderBottom: "1px solid #e8eaed" }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {mod.cards.map((card, ci) => (
                              <tr key={ci} style={{ borderBottom: ci < mod.cards.length - 1 ? "1px solid #e8eaed" : "none" }}>
                                <td style={{ padding: "7px 12px", fontSize: "0.8rem", color: "#6b7280", width: 30 }}>{ci}</td>
                                <td style={{ padding: "7px 12px", fontSize: "0.82rem", color: "#111", fontWeight: 500 }}>{card.t}</td>
                                <td style={{ padding: "7px 12px", fontSize: "0.8rem", color: "#6b7280" }}>{card.reflect}</td>
                                <td style={{ padding: "7px 12px" }}>
                                  <div style={{ display: "flex", gap: 6 }}>
                                    <button onClick={() => setEditingCard({ modIdx: mi, cardIdx: ci, card })} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#6b7280" }}>✏️</button>
                                    <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#dc2626" }}>🗑</button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
        <div style={{ padding: "12px 18px", borderTop: "1px solid #e8eaed", display: "flex", justifyContent: "flex-end" }}>
          <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>Page 1 of 1</span>
        </div>
      </div>
      {editingCard && (
        <CardModal card={editingCard.card} onSave={(c) => saveCard(editingCard.modIdx, editingCard.cardIdx, c)} onClose={() => setEditingCard(null)} />
      )}
    </div>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#374151", marginBottom: 5 };
const inp: React.CSSProperties = { width: "100%", padding: "8px 10px", borderRadius: 7, border: "1.5px solid #e8eaed", fontSize: "0.85rem", outline: "none", background: "#fff" };
const primaryBtn: React.CSSProperties = { background: "#1e4fa8", color: "#fff", border: "none", borderRadius: 7, padding: "8px 16px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" };
const outlineBtn: React.CSSProperties = { background: "#fff", color: "#374151", border: "1px solid #e8eaed", borderRadius: 7, padding: "8px 16px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" };
