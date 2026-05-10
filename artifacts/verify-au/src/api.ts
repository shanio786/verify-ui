const BASE = "/api";

function getToken(): string | null {
  return localStorage.getItem("vau_token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers as Record<string, string> || {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface ApiProgress {
  completedModules: number[];
  keyCheckPassed: number[];
  completedPractices: string[];
  practiceResults: Record<string, { q1: boolean; q2: boolean; q3?: boolean }>;
  recentActivity: { text: string; time: string }[];
  lastLearningModule: number | null;
  lastPage: string | null;
  pretestScore: number | null;
  pretestTotal: number | null;
  posttestScore: number | null;
  posttestTotal: number | null;
}

export const api = {
  auth: {
    async register(name: string, email: string, password: string): Promise<{ token: string; user: ApiUser }> {
      return request("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) });
    },
    async login(email: string, password: string): Promise<{ token: string; user: ApiUser }> {
      return request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
    },
    async logout(): Promise<void> {
      await request("/auth/logout", { method: "POST" }).catch(() => {});
      localStorage.removeItem("vau_token");
      localStorage.removeItem("vau_user");
    },
    async me(): Promise<ApiUser | null> {
      if (!getToken()) return null;
      return request<ApiUser>("/auth/me").catch(() => null);
    },
    saveSession(token: string, user: ApiUser) {
      localStorage.setItem("vau_token", token);
      localStorage.setItem("vau_user", JSON.stringify(user));
    },
    loadUser(): ApiUser | null {
      try { const r = localStorage.getItem("vau_user"); return r ? JSON.parse(r) : null; } catch { return null; }
    },
  },

  progress: {
    async get(): Promise<ApiProgress> {
      return request<any>("/progress").then(p => ({
        completedModules: p.completedModules || [],
        keyCheckPassed: p.keyCheckPassed || [],
        completedPractices: p.completedPractices || [],
        practiceResults: p.practiceResults || {},
        recentActivity: p.recentActivity || [],
        lastLearningModule: p.lastLearningModule ?? null,
        lastPage: p.lastPage ?? null,
        pretestScore: p.pretestScore ?? null,
        pretestTotal: p.pretestTotal ?? null,
        posttestScore: p.posttestScore ?? null,
        posttestTotal: p.posttestTotal ?? null,
      }));
    },
    async save(data: Partial<ApiProgress>): Promise<ApiProgress> {
      return request("/progress", { method: "PUT", body: JSON.stringify(data) });
    },
  },

  admin: {
    async getUsers() { return request<any[]>("/admin/users"); },
    async createUser(data: any) { return request("/admin/users", { method: "POST", body: JSON.stringify(data) }); },
    async updateUser(id: number, data: any) { return request(`/admin/users/${id}`, { method: "PUT", body: JSON.stringify(data) }); },
    async deleteUser(id: number) { return request(`/admin/users/${id}`, { method: "DELETE" }); },
    async getWeekly() { return request<any[]>("/admin/weekly"); },
    async createWeekly(data: any) { return request("/admin/weekly", { method: "POST", body: JSON.stringify(data) }); },
    async updateWeekly(id: string, data: any) { return request(`/admin/weekly/${id}`, { method: "PUT", body: JSON.stringify(data) }); },
    async deleteWeekly(id: string) { return request(`/admin/weekly/${id}`, { method: "DELETE" }); },
    async getAuditLogs() { return request<any[]>("/admin/audit-logs"); },
    async addAuditLog(data: any) { return request("/admin/audit-logs", { method: "POST", body: JSON.stringify(data) }); },
    async getStats() { return request<any>("/admin/stats"); },
  },
};
