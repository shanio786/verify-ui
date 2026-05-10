import { moduleData, practiceItems } from "../data";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "SUPER ADMIN" | "IT TECH" | "CONTENT EDITOR" | "STUDENT";
  status: "Active" | "Inactive";
  createdAt: string;
  lastLogin?: string;
}

export interface AuditLog {
  id: string;
  time: string;
  actor: string;
  actorEmail: string;
  action: string;
  entity: string;
  ip: string;
}

export interface WeeklyModule {
  id: string;
  label: string;
  title: string;
  description: string;
  context: string;
  color: string;
  tags: string[];
  startDate?: string;
  endDate?: string;
  linkedQuestions: string[];
  sortOrder: number;
  published: boolean;
  deleted?: boolean;
}

const ADMIN_USERS_KEY = "admin_users";
const AUDIT_LOG_KEY = "admin_audit_logs";
const WEEKLY_MODULES_KEY = "admin_weekly_modules";
const APP_USERS_KEY = "vau_users";
const APP_STATES_KEY = "vau_states";

function seedUsers(): AdminUser[] {
  return [
    { id: "1", name: "Super Admin", email: "admin@factcheck.au", role: "SUPER ADMIN", status: "Active", createdAt: "2026-01-01", lastLogin: "2026-05-09" },
    { id: "2", name: "IT Tech", email: "it@factcheck.au", role: "IT TECH", status: "Active", createdAt: "2026-01-05", lastLogin: "2026-05-10" },
    { id: "3", name: "Content Editor", email: "editor@factcheck.au", role: "CONTENT EDITOR", status: "Active", createdAt: "2026-02-01", lastLogin: undefined },
    { id: "4", name: "Alice Student", email: "student1@example.com", role: "STUDENT", status: "Active", createdAt: "2026-03-10", lastLogin: "2026-05-07" },
    { id: "5", name: "Bob Student", email: "student2@example.com", role: "STUDENT", status: "Active", createdAt: "2026-04-01", lastLogin: "2026-05-09" },
  ];
}

function seedWeeklyModules(): WeeklyModule[] {
  return [
    {
      id: "wm-1", label: "Week 1 — May 2026", title: "2025 Federal Budget: Claims in the Wild",
      description: "Apply your media literacy skills to real statements made during the 2025 Federal Budget response.",
      context: "Following Treasurer Jim Chalmers' Budget night speech on 13 May 2025, opposition leaders and government ministers made numerous claims about spending, tax, and economic impact.",
      color: "#5B21B6", tags: ["Emotional Framing", "Claim Identification", "Selective Evidence"],
      linkedQuestions: ["practice-01", "practice-05"], sortOrder: 0, published: true,
    },
    {
      id: "wm-2", label: "Week 2 — May 2026", title: "Referendum Anniversary: Revisiting the Claims",
      description: "Two years on from the Voice referendum, revisit the most viral claims and assess how they held up.",
      context: "The 2023 Voice to Parliament referendum generated significant online misinformation. This week examines key claims from both sides.",
      color: "#065F46", tags: ["False Authority", "Misleading Statistics"],
      linkedQuestions: ["practice-03", "practice-06"], sortOrder: 1, published: true,
    },
  ];
}

function seedAuditLogs(): AuditLog[] {
  const logs: AuditLog[] = [];
  const now = new Date("2026-05-09T18:41:00");
  const actions = ["PRACTICE_CREATED", "PRACTICE_UPDATED", "MODULE_CREATED", "USER_CREATED"];
  const entities = practiceItems.slice(0, 12).map((p, i) => ({ name: `PracticeQuestion #${36 - i}`, action: i === 2 ? "PRACTICE_UPDATED" : "PRACTICE_CREATED" }));
  entities.forEach((e, i) => {
    const t = new Date(now.getTime() - i * 3 * 60000);
    logs.push({
      id: String(i + 1), time: t.toLocaleString("en-AU", { month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }),
      actor: "Super Admin", actorEmail: "admin@factcheck.au",
      action: e.action, entity: e.name, ip: "100.64.0.6",
    });
  });
  return logs;
}

export function getAdminUsers(): AdminUser[] {
  const stored = localStorage.getItem(ADMIN_USERS_KEY);
  if (stored) return JSON.parse(stored);
  const users = seedUsers();
  localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
  return users;
}

export function getAllUsers(): AdminUser[] {
  const admins = getAdminUsers();
  const appUsersRaw = localStorage.getItem(APP_USERS_KEY);
  if (!appUsersRaw) return admins;
  try {
    const appUsers: { name: string; email: string }[] = JSON.parse(appUsersRaw);
    const existingEmails = new Set(admins.map((u) => u.email));
    const extra: AdminUser[] = appUsers
      .filter((u) => !existingEmails.has(u.email))
      .map((u, i) => ({
        id: "app-" + i, name: u.name, email: u.email, role: "STUDENT", status: "Active",
        createdAt: new Date().toISOString().slice(0, 10), lastLogin: undefined,
      }));
    return [...admins, ...extra];
  } catch { return admins; }
}

export function saveAdminUsers(users: AdminUser[]) {
  localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
}

export function getAuditLogs(): AuditLog[] {
  const stored = localStorage.getItem(AUDIT_LOG_KEY);
  if (stored) return JSON.parse(stored);
  const logs = seedAuditLogs();
  localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs));
  return logs;
}

export function addAuditLog(log: Omit<AuditLog, "id" | "time">) {
  const logs = getAuditLogs();
  const newLog: AuditLog = {
    ...log, id: Date.now().toString(),
    time: new Date().toLocaleString("en-AU", { month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }),
  };
  logs.unshift(newLog);
  localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(logs));
}

export function getWeeklyModules(): WeeklyModule[] {
  const stored = localStorage.getItem(WEEKLY_MODULES_KEY);
  if (stored) return JSON.parse(stored);
  const wm = seedWeeklyModules();
  localStorage.setItem(WEEKLY_MODULES_KEY, JSON.stringify(wm));
  return wm;
}

export function saveWeeklyModules(wms: WeeklyModule[]) {
  localStorage.setItem(WEEKLY_MODULES_KEY, JSON.stringify(wms));
}

export function getAppStats() {
  const users = getAllUsers();
  const statesRaw = localStorage.getItem(APP_STATES_KEY);
  let practiceAttempts = 0, moduleCompletions = 0, assessmentAttempts = 0, badgesAwarded = 0;
  if (statesRaw) {
    try {
      const states: Record<string, { completedPractices?: string[]; completedModules?: number[]; selfAssessments?: { initial?: { completed?: boolean }; final?: { completed?: boolean } } }> = JSON.parse(statesRaw);
      Object.values(states).forEach((s) => {
        practiceAttempts += s.completedPractices?.length ?? 0;
        moduleCompletions += s.completedModules?.length ?? 0;
        if (s.selfAssessments?.initial?.completed) assessmentAttempts++;
        if (s.selfAssessments?.final?.completed) assessmentAttempts++;
        const badges = [
          (s.completedPractices?.length ?? 0) >= 1,
          (s.completedModules?.length ?? 0) === moduleData.length,
          (s.completedModules?.length ?? 0) >= 3,
          s.selfAssessments?.initial?.completed && s.selfAssessments?.final?.completed,
        ].filter(Boolean).length;
        badgesAwarded += badges;
      });
    } catch {}
  }
  const activeStudents = users.filter((u) => u.role === "STUDENT" && u.status === "Active").length;
  const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const activeLast7 = users.filter((u) => u.lastLogin && new Date(u.lastLogin) >= sevenDaysAgo).length;
  return { totalUsers: users.length, activeStudents, activeLast7Days: activeLast7, moduleCompletions, practiceAttempts, assessmentAttempts, badgesAwarded };
}

export function getModuleEngagement() {
  const statesRaw = localStorage.getItem(APP_STATES_KEY);
  return moduleData.map((mod, idx) => {
    let completions = 0, keyCheckAttempts = 0;
    if (statesRaw) {
      try {
        const states: Record<string, { completedModules?: number[] }> = JSON.parse(statesRaw);
        Object.values(states).forEach((s) => {
          if (s.completedModules?.includes(idx)) completions++;
        });
      } catch {}
    }
    const totalUsers = getAllUsers().filter((u) => u.role === "STUDENT").length || 1;
    return { name: mod.title, label: mod.label, completions, completionRate: Math.round((completions / totalUsers) * 100), keyCheckAttempts, passRate: completions > 0 ? 48 : 0, avgScore: completions > 0 ? 48 : 0 };
  });
}
