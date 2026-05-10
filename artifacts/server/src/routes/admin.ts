import { Router } from "express";
import { db, schema } from "../db.js";
import { eq, desc } from "drizzle-orm";
import { requireAdmin, requireAuth, hashPassword } from "../auth.js";
import { z } from "zod";

const router = Router();

router.get("/users", requireAdmin, async (req, res) => {
  const users = await db.select({
    id: schema.usersTable.id,
    name: schema.usersTable.name,
    email: schema.usersTable.email,
    role: schema.usersTable.role,
    status: schema.usersTable.status,
    createdAt: schema.usersTable.createdAt,
    lastLogin: schema.usersTable.lastLogin,
  }).from(schema.usersTable);
  res.json(users);
});

router.post("/users", requireAdmin, async (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;
    const passwordHash = await hashPassword(password || "ChangeMe123!");
    const [user] = await db.insert(schema.usersTable)
      .values({ name, email, passwordHash, role: role || "STUDENT", status: status || "Active" })
      .returning();
    res.json(user);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.put("/users/:id", requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, role, status, password } = req.body;
  const data: any = {};
  if (name) data.name = name;
  if (email) data.email = email;
  if (role) data.role = role;
  if (status) data.status = status;
  if (password) data.passwordHash = await hashPassword(password);
  const [user] = await db.update(schema.usersTable).set(data).where(eq(schema.usersTable.id, id)).returning();
  res.json(user);
});

router.delete("/users/:id", requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id);
  await db.update(schema.usersTable).set({ status: "Inactive" }).where(eq(schema.usersTable.id, id));
  res.json({ ok: true });
});

router.get("/weekly", requireAdmin, async (req, res) => {
  const modules = await db.select().from(schema.weeklyModulesTable)
    .where(eq(schema.weeklyModulesTable.deleted, false))
    .orderBy(schema.weeklyModulesTable.sortOrder);
  res.json(modules);
});

router.post("/weekly", requireAdmin, async (req, res) => {
  try {
    const { id, label, title, description, context, color, tags, startDate, endDate, linkedQuestions, sortOrder, published } = req.body;
    const [mod] = await db.insert(schema.weeklyModulesTable)
      .values({ id, label, title, description, context: context || "", color: color || "#1e3a5f", tags: tags || [], startDate, endDate, linkedQuestions: linkedQuestions || [], sortOrder: sortOrder ?? 0, published: published ?? false })
      .returning();
    res.json(mod);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.put("/weekly/:id", requireAdmin, async (req, res) => {
  const { label, title, description, context, color, tags, startDate, endDate, linkedQuestions, sortOrder, published } = req.body;
  const data: any = {};
  if (label !== undefined) data.label = label;
  if (title !== undefined) data.title = title;
  if (description !== undefined) data.description = description;
  if (context !== undefined) data.context = context;
  if (color !== undefined) data.color = color;
  if (tags !== undefined) data.tags = tags;
  if (startDate !== undefined) data.startDate = startDate;
  if (endDate !== undefined) data.endDate = endDate;
  if (linkedQuestions !== undefined) data.linkedQuestions = linkedQuestions;
  if (sortOrder !== undefined) data.sortOrder = sortOrder;
  if (published !== undefined) data.published = published;
  const [mod] = await db.update(schema.weeklyModulesTable).set(data).where(eq(schema.weeklyModulesTable.id, req.params.id)).returning();
  res.json(mod);
});

router.delete("/weekly/:id", requireAdmin, async (req, res) => {
  await db.update(schema.weeklyModulesTable).set({ deleted: true }).where(eq(schema.weeklyModulesTable.id, req.params.id));
  res.json({ ok: true });
});

router.get("/audit-logs", requireAdmin, async (req, res) => {
  const logs = await db.select().from(schema.auditLogsTable).orderBy(desc(schema.auditLogsTable.time)).limit(100);
  res.json(logs);
});

router.post("/audit-logs", requireAdmin, async (req, res) => {
  const { actor, actorEmail, action, entity, ip } = req.body;
  const [log] = await db.insert(schema.auditLogsTable).values({ actor, actorEmail, action, entity, ip: ip || "" }).returning();
  res.json(log);
});

router.get("/stats", requireAdmin, async (req, res) => {
  const users = await db.select().from(schema.usersTable);
  const progress = await db.select().from(schema.studentProgressTable);
  const students = users.filter(u => u.role === "STUDENT");
  const activeStudents = students.filter(u => u.status === "Active").length;
  const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const activeLast7 = users.filter(u => u.lastLogin && u.lastLogin >= sevenDaysAgo).length;
  let practiceAttempts = 0, moduleCompletions = 0, assessmentAttempts = 0;
  progress.forEach(p => {
    practiceAttempts += ((p.completedPractices as string[]) || []).length;
    moduleCompletions += ((p.completedModules as number[]) || []).length;
    if (p.pretestScore !== null) assessmentAttempts++;
    if (p.posttestScore !== null) assessmentAttempts++;
  });
  res.json({ totalUsers: users.length, activeStudents, activeLast7Days: activeLast7, moduleCompletions, practiceAttempts, assessmentAttempts });
});

export default router;
