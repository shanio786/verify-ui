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
    { id: "1", name: "Platform Admin", email: "admin@verifyau.edu.au", role: "SUPER ADMIN", status: "Active", createdAt: "2026-01-15", lastLogin: "2026-05-10" },
    { id: "2", name: "Tech Manager", email: "tech@verifyau.edu.au", role: "IT TECH", status: "Active", createdAt: "2026-01-20", lastLogin: "2026-05-10" },
    { id: "3", name: "Content Lead", email: "content@verifyau.edu.au", role: "CONTENT EDITOR", status: "Active", createdAt: "2026-02-10", lastLogin: "2026-05-08" },
    { id: "4", name: "Jordan M.", email: "jordan.m@uni.edu.au", role: "STUDENT", status: "Active", createdAt: "2026-03-12", lastLogin: "2026-05-07" },
    { id: "5", name: "Riley K.", email: "riley.k@uni.edu.au", role: "STUDENT", status: "Active", createdAt: "2026-04-02", lastLogin: "2026-05-09" },
    { id: "6", name: "Sam T.", email: "sam.t@uni.edu.au", role: "STUDENT", status: "Active", createdAt: "2026-04-15", lastLogin: "2026-05-06" },
    { id: "7", name: "Alex W.", email: "alex.w@uni.edu.au", role: "STUDENT", status: "Inactive", createdAt: "2026-04-20", lastLogin: undefined },
  ];
}

function seedWeeklyModules(): WeeklyModule[] {
  return [
    {
      id: "wm-1", label: "Week 1 — May 2026", title: "Election Claims Under the Microscope",
      description: "Apply your media literacy skills to real statements made during the 2025 federal election campaign.",
      context: "The 2025 federal election generated hundreds of claims across social media, campaign ads, and media appearances. This week we examine the most viral.",
      color: "#0d9488", tags: ["Claim Identification", "Selective Evidence", "Misleading Statistics"],
      linkedQuestions: ["practice-01", "practice-03"], sortOrder: 0, published: true,
    },
    {
      id: "wm-2", label: "Week 2 — May 2026", title: "Voting Myths & Electoral Misinformation",
      description: "Examine the most common false claims about how Australian voting works — from preferences to ballot papers.",
      context: "The AEC fact-checked dozens of viral claims about voting procedures in 2025. This week focuses on the most widely shared.",
      color: "#7c3aed", tags: ["Claim Identification", "Emotional Framing"],
      linkedQuestions: ["practice-07", "practice-09"], sortOrder: 1, published: true,
    },
  ];
}

function seedAuditLogs(): AuditLog[] {
  const logs: AuditLog[] = [];
  const now = new Date("2026-05-10T09:15:00");
  const entries = [
    { action: "PRACTICE_CREATED", entity: "PracticeQuestion #36 — Labor $80B defence claim" },
    { action: "PRACTICE_CREATED", entity: "PracticeQuestion #35 — Bulk-billing Medicare claim" },
    { action: "PRACTICE_UPDATED", entity: "PracticeQuestion #34 — GP free visits claim" },
    { action: "ASSESSMENT_CREATED", entity: "AssessmentQuestion #18 — 710k new voters" },
    { action: "ASSESSMENT_CREATED", entity: "AssessmentQuestion #17 — Menzies redistribution" },
    { action: "MODULE_UPDATED", entity: "Module 01 — Claim Identification" },
    { action: "PRACTICE_CREATED", entity: "PracticeQuestion #21 — Menzies redraw" },
    { action: "PRACTICE_CREATED", entity: "PracticeQuestion #20 — Adelaide independents" },
    { action: "USER_CREATED", entity: "Student: jordan.m@uni.edu.au" },
    { action: "PRACTICE_CREATED", entity: "PracticeQuestion #19 — 72-hour ban claim" },
    { action: "MODULE_UPDATED", entity: "Module 05 — Misleading Statistics" },
    { action: "USER_CREATED", entity: "Student: riley.k@uni.edu.au" },
  ];
  entries.forEach((e, i) => {
    const t = new Date(now.getTime() - i * 4 * 60000);
    logs.push({
      id: String(i + 1),
      time: t.toLocaleString("en-AU", { month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true }),
      actor: "Platform Admin", actorEmail: "admin@verifyau.edu.au",
      action: e.action, entity: e.entity, ip: "203.12.160." + (i + 1),
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
    let completions = 0;
    if (statesRaw) {
      try {
        const states: Record<string, { completedModules?: number[] }> = JSON.parse(statesRaw);
        Object.values(states).forEach((s) => {
          if (s.completedModules?.includes(idx)) completions++;
        });
      } catch {}
    }
    const totalUsers = getAllUsers().filter((u) => u.role === "STUDENT").length || 1;
    return { name: mod.title, label: mod.label, completions, completionRate: Math.round((completions / totalUsers) * 100), avgScore: completions > 0 ? 62 : 0 };
  });
}
