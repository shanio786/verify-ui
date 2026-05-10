import { useState } from "react";
import { getAllUsers, saveAdminUsers, getAdminUsers, type AdminUser, addAuditLog } from "../adminStore";

const ROLES = ["SUPER ADMIN", "IT TECH", "CONTENT EDITOR", "STUDENT"] as const;
const roleColors: Record<string, string> = {
  "SUPER ADMIN": "#dc2626", "IT TECH": "#1e4fa8", "CONTENT EDITOR": "#d97706", "STUDENT": "#374151",
};

function Modal({ user, onSave, onClose }: { user: Partial<AdminUser>; onSave: (u: AdminUser) => void; onClose: () => void }) {
  const [form, setForm] = useState<Partial<AdminUser>>(user);
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.role) return;
    onSave({ id: form.id || Date.now().toString(), name: form.name, email: form.email, role: form.role as AdminUser["role"], status: form.status || "Active", createdAt: form.createdAt || new Date().toISOString().slice(0, 10), lastLogin: form.lastLogin });
  }
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "flex-end" }}>
      <div style={{ width: 400, background: "#fff", height: "100vh", padding: "28px 28px", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ fontWeight: 700, fontSize: "1rem" }}>{form.id ? "Edit User" : "New User"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#6b7280" }}>×</button>
        </div>
        <form onSubmit={submit}>
          {[{ key: "name", label: "Full Name", type: "text" }, { key: "email", label: "Email", type: "email" }].map((f) => (
            <div key={f.key} style={{ marginBottom: 16 }}>
              <label style={lbl}>{f.label} *</label>
              <input type={f.type} value={(form as Record<string, string>)[f.key] || ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} style={inp} required />
            </div>
          ))}
          <div style={{ marginBottom: 16 }}>
            <label style={lbl}>Role *</label>
            <select value={form.role || ""} onChange={(e) => setForm({ ...form, role: e.target.value as AdminUser["role"] })} style={inp} required>
              <option value="">Select role</option>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 24 }}>
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
  const [showDeleted, setShowDeleted] = useState(false);
  const [editing, setEditing] = useState<Partial<AdminUser> | null>(null);

  function save(u: AdminUser) {
    const admins = getAdminUsers();
    const idx = admins.findIndex((a) => a.id === u.id);
    if (idx >= 0) admins[idx] = u; else admins.push(u);
    saveAdminUsers(admins);
    setUsers(getAllUsers());
    addAuditLog({ actor: "IT Tech", actorEmail: "it@factcheck.au", action: idx >= 0 ? "USER_UPDATED" : "USER_CREATED", entity: `User: ${u.name}`, ip: "100.64.0.6" });
    setEditing(null);
  }

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) && (!filterRole || u.role === filterRole);
  });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#111" }}>Users</h1>
        <button onClick={() => setEditing({})} style={primaryBtn}>+ New User</button>
      </div>
      <div style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        {/* Filters */}
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #e8eaed", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email..." style={{ ...inp, maxWidth: 240, marginBottom: 0 }} />
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} style={{ ...inp, maxWidth: 160, marginBottom: 0 }}>
            <option value="">All Roles</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "#6b7280", cursor: "pointer" }}>
            <input type="checkbox" checked={showDeleted} onChange={(e) => setShowDeleted(e.target.checked)} /> Show Deleted
          </label>
        </div>
        {/* Table */}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              {["Name / Email", "Role", "Status", "Last Login", "Actions"].map((h) => (
                <th key={h} style={{ padding: "10px 18px", textAlign: "left", fontSize: "0.72rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid #e8eaed" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <tr key={u.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                <td style={{ padding: "12px 18px" }}>
                  <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "#111" }}>{u.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{u.email}</div>
                </td>
                <td style={{ padding: "12px 18px" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: roleColors[u.role] || "#374151", letterSpacing: "0.03em" }}>{u.role}</span>
                </td>
                <td style={{ padding: "12px 18px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.8rem" }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: u.status === "Active" ? "#16a34a" : "#9ca3af", display: "inline-block" }} />
                    {u.status}
                  </span>
                </td>
                <td style={{ padding: "12px 18px", fontSize: "0.8rem", color: "#6b7280" }}>{u.lastLogin || "—"}</td>
                <td style={{ padding: "12px 18px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => setEditing(u)} style={{ ...outlineBtn, padding: "4px 10px", fontSize: "0.75rem" }}>Edit</button>
                    <button style={{ ...outlineBtn, padding: "4px 10px", fontSize: "0.75rem" }}>View</button>
                    <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1rem", color: "#dc2626" }}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: "12px 18px", borderTop: "1px solid #e8eaed", display: "flex", justifyContent: "flex-end" }}>
          <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>Page 1 of 1</span>
        </div>
      </div>
      {editing && <Modal user={editing} onSave={save} onClose={() => setEditing(null)} />}
    </div>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#374151", marginBottom: 5 };
const inp: React.CSSProperties = { width: "100%", padding: "8px 10px", borderRadius: 7, border: "1.5px solid #e8eaed", fontSize: "0.85rem", outline: "none", background: "#fff", marginBottom: 0 };
const primaryBtn: React.CSSProperties = { background: "#1e4fa8", color: "#fff", border: "none", borderRadius: 7, padding: "8px 16px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" };
const outlineBtn: React.CSSProperties = { background: "#fff", color: "#374151", border: "1px solid #e8eaed", borderRadius: 7, padding: "8px 16px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" };
