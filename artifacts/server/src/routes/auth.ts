import { Router } from "express";
import { z } from "zod";
import { db, schema } from "../db.js";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, createSession, deleteSession, getSessionUser } from "../auth.js";

const router = Router();

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/register", async (req, res) => {
  try {
    const body = registerSchema.parse(req.body);
    const existing = await db.query.usersTable.findFirst({ where: eq(schema.usersTable.email, body.email) });
    if (existing) return res.status(400).json({ error: "Email already registered" });
    const passwordHash = await hashPassword(body.password);
    const [user] = await db.insert(schema.usersTable).values({
      name: body.name, email: body.email, passwordHash, role: "STUDENT", status: "Active",
    }).returning();
    await db.insert(schema.studentProgressTable).values({ userId: user.id });
    const token = await createSession(user.id);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const body = loginSchema.parse(req.body);
    const user = await db.query.usersTable.findFirst({ where: eq(schema.usersTable.email, body.email) });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });
    const ok = await verifyPassword(body.password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid email or password" });
    if (user.status !== "Active") return res.status(403).json({ error: "Account disabled" });
    await db.update(schema.usersTable).set({ lastLogin: new Date() }).where(eq(schema.usersTable.id, user.id));
    const token = await createSession(user.id);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/logout", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token) await deleteSession(token);
  res.json({ ok: true });
});

router.get("/me", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const user = await getSessionUser(token);
  if (!user) return res.status(401).json({ error: "Session expired" });
  res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
});

export default router;
