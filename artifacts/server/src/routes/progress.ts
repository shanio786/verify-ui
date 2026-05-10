import { Router } from "express";
import { db, schema } from "../db.js";
import { eq } from "drizzle-orm";
import { requireAuth } from "../auth.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const user = (req as any).user;
  let progress = await db.query.studentProgressTable.findFirst({
    where: eq(schema.studentProgressTable.userId, user.id),
  });
  if (!progress) {
    const [p] = await db.insert(schema.studentProgressTable).values({ userId: user.id }).returning();
    progress = p;
  }
  res.json(progress);
});

router.put("/", requireAuth, async (req, res) => {
  const user = (req as any).user;
  const {
    completedModules, keyCheckPassed, completedPractices,
    practiceResults, recentActivity, lastLearningModule,
    lastPage, pretestScore, pretestTotal, posttestScore, posttestTotal,
  } = req.body;

  const existing = await db.query.studentProgressTable.findFirst({
    where: eq(schema.studentProgressTable.userId, user.id),
  });

  const data: any = { updatedAt: new Date() };
  if (completedModules !== undefined) data.completedModules = completedModules;
  if (keyCheckPassed !== undefined) data.keyCheckPassed = keyCheckPassed;
  if (completedPractices !== undefined) data.completedPractices = completedPractices;
  if (practiceResults !== undefined) data.practiceResults = practiceResults;
  if (recentActivity !== undefined) data.recentActivity = recentActivity;
  if (lastLearningModule !== undefined) data.lastLearningModule = lastLearningModule;
  if (lastPage !== undefined) data.lastPage = lastPage;
  if (pretestScore !== undefined) data.pretestScore = pretestScore;
  if (pretestTotal !== undefined) data.pretestTotal = pretestTotal;
  if (posttestScore !== undefined) data.posttestScore = posttestScore;
  if (posttestTotal !== undefined) data.posttestTotal = posttestTotal;

  if (existing) {
    const [updated] = await db.update(schema.studentProgressTable)
      .set(data)
      .where(eq(schema.studentProgressTable.userId, user.id))
      .returning();
    res.json(updated);
  } else {
    const [created] = await db.insert(schema.studentProgressTable)
      .values({ userId: user.id, ...data })
      .returning();
    res.json(created);
  }
});

export default router;
