import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { db, schema } from "./db.js";
import { eq } from "drizzle-orm";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: number): Promise<string> {
  const id = uuidv4();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await db.insert(schema.sessionsTable).values({ id, userId, expiresAt });
  return id;
}

export async function getSessionUser(sessionId: string) {
  const session = await db.query.sessionsTable.findFirst({
    where: eq(schema.sessionsTable.id, sessionId),
  });
  if (!session || session.expiresAt < new Date()) return null;
  const user = await db.query.usersTable.findFirst({
    where: eq(schema.usersTable.id, session.userId),
  });
  return user ?? null;
}

export async function deleteSession(sessionId: string) {
  await db.delete(schema.sessionsTable).where(eq(schema.sessionsTable.id, sessionId));
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const user = await getSessionUser(token);
  if (!user) return res.status(401).json({ error: "Session expired" });
  (req as any).user = user;
  next();
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  await requireAuth(req, res, async () => {
    const user = (req as any).user;
    if (user.role === "STUDENT") return res.status(403).json({ error: "Forbidden" });
    next();
  });
}
