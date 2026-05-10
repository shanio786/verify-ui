import { useState } from "react";
import { getAllUsers, saveAdminUsers, getAdminUsers, type AdminUser, addAuditLog } from "../adminStore";

const ROLES = ["SUPER ADMIN", "IT TECH", "CONTENT EDITOR", "STUDENT"] as const;

const roleColors: Record<string, { color: string; bg: string; border: string }> = {
  "SUPER ADMIN": { color: "#991b1b", bg: "#fef2f2", border: "#fecaca" },
  "IT TECH":     { color: "#1e40af", bg: "#eff6ff", border: "#bfdbfe" },
  "CONTENT EDITOR": { color: "#92400e", bg: "#fffbeb", border: "#fde68a" },
  "STUDENT":     { color: "#374151", bg: "#f9fafb", border: "#e5e7eb" },
};

function Modal({ user, onSave, onClose }: { user: Partial<AdminUser>; onSave: (u: AdminUser) => void; onClose: () => void }) {
  const [form, setForm] = useState<Partial<AdminUser>>(user);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.role) return;
    onSave({
      id: form.id || Date.now().toString(),
      name: form.name,
      email: form.email,
      role: form.role as AdminUser["role"],
      status: form.status || "Active",
      createdAt: form.createdAt || new Date().toISOString().slice(0, 10),
      lastLogin: form.lastLogin,
    });
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "flex-end" }}>
      <div style={{ width: 400, background: "#fff", height: "100vh", padding: "28px", overflowY: "auto", boxShadow: "-4px 0 20px rgba(0,0,0,0.1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a" }}>{form.id ? "Edit User" : "New User"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#6b7280", lineHeight: 1 }}>×</button>
        </div>
        <form onSubmit={submit}>
          {[
            { key: "name", label: "Full Name", type: "text" },
            { key: "email", label: "Email Address", type: "email" },
          ].map((f) => (
            <div key={f.key} style={{ marginBottom: 16 }}>
              <label style={lbl}>{f.label} *</label>
              <input type={f.type} value={(form as Record<string, string>)[f.key] || ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} style={inp} required />
            </div>
          ))}
          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Role *</label>
            <select value={form.role || ""} onChange={(e) => setForm({ ...form, role: e.target.value as AdminUser["role"] })} style={inp} required>
              <option value="">Select a role</option>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 26 }}>
            <label style={lbl}>Status</label>
            <select value={form.status || "Active"} onChange={(e) => setForm({ ...form, status: e.target.value as AdminUser["status"] })} style={inp}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
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

export default function Users() {
  const [users, setUsers] = useState(getAllUsers);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [editing, setEditing] = useState<Partial<AdminUser> | null>(null);

  function save(u: AdminUser) {
    const admins = getAdminUsers();
    const idx = admins.findIndex((a) => a.id === u.id);
    if (idx >= 0) admins[idx] = u; else admins.push(u);
    saveAdminUsers(admins);
    setUsers(getAllUsers());
    addAuditLog({
      actor: "Platform Admin",
      actorEmail: "admin@verifyau.edu.au",
      action: idx >= 0 ? "USER_UPDATED" : "USER_CREATED",
      entity: `User: ${u.name} (${u.email})`,
      ip: "203.12.160.1",
    });
    setEditing(null);
  }

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
      (!filterRole || u.role === filterRole);
  });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#0f172a", marginBottom: 2 }}>Users</h1>
          <p style={{ fontSize: "0.78rem", color: "#64748b", margin: 0 }}>{users.length} total accounts</p>
        </div>
        <button onClick={() => setEditing({})} style={primaryBtn}>+ New User</button>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #e2e8f0", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            style={{ ...inp, maxWidth: 260, marginBottom: 0, padding: "7px 10px" }}
          />
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} style={{ ...inp, maxWidth: 170, marginBottom: 0, padding: "7px 10px" }}>
            <option value="">All roles</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafb" }}>
              {["Name / Email", "Role", "Status", "Joined", "Last Login", "Actions"].map((h) => (
                <th key={h} style={{ padding: "10px 18px", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #e2e8f0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => {
              const rc = roleColors[u.role] || roleColors["STUDENT"];
              return (
                <tr key={u.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none", background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                  <td style={{ padding: "12px 18px" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#0f172a" }}>{u.name}</div>
                    <div style={{ fontSize: "0.74rem", color: "#64748b" }}>{u.email}</div>
                  </td>
                  <td style={{ padding: "12px 18px" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "3px 8px", borderRadius: 20, letterSpacing: "0.04em", color: rc.color, background: rc.bg, border: `1px solid ${rc.border}` }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: "12px 18px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: u.status === "Active" ? "#166534" : "#6b7280" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: u.status === "Active" ? "#16a34a" : "#9ca3af", display: "inline-block" }} />
                      {u.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 18px", fontSize: "0.8rem", color: "#64748b" }}>{u.createdAt}</td>
                  <td style={{ padding: "12px 18px", fontSize: "0.8rem", color: "#64748b" }}>{u.lastLogin || "—"}</td>
                  <td style={{ padding: "12px 18px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => setEditing(u)} style={{ ...outlineBtn, padding: "4px 12px", fontSize: "0.75rem" }}>Edit</button>
                      <button style={{ background: "none", border: "1px solid #fecaca", borderRadius: 6, cursor: "pointer", fontSize: "0.75rem", color: "#dc2626", padding: "4px 10px" }}>Remove</button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 32, textAlign: "center", color: "#94a3b8", fontSize: "0.82rem" }}>No users match the current filter.</td></tr>
            )}
          </tbody>
        </table>
        <div style={{ padding: "12px 18px", borderTop: "1px solid #e2e8f0", background: "#fafafa", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.78rem", color: "#64748b" }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
          <span style={{ fontSize: "0.78rem", color: "#64748b" }}>Page 1 of 1</span>
        </div>
      </div>
      {editing && <Modal user={editing} onSave={save} onClose={() => setEditing(null)} />}
    </div>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#374151", marginBottom: 5 };
const inp: React.CSSProperties = { width: "100%", padding: "8px 10px", borderRadius: 7, border: "1.5px solid #e2e8f0", fontSize: "0.85rem", outline: "none", background: "#fff", marginBottom: 0, boxSizing: "border-box" };
const primaryBtn: React.CSSProperties = { background: "#0d9488", color: "#fff", border: "none", borderRadius: 7, padding: "8px 18px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" };
const outlineBtn: React.CSSProperties = { background: "#fff", color: "#374151", border: "1px solid #e2e8f0", borderRadius: 7, padding: "8px 16px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" };
