import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import progressRouter from "./routes/progress.js";
import adminRouter from "./routes/admin.js";
import { db, schema } from "./db.js";
import { eq } from "drizzle-orm";
import { hashPassword } from "./auth.js";

const app = express();
const PORT = Number(process.env.API_PORT) || 4000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/api/healthz", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRouter);
app.use("/api/progress", progressRouter);
app.use("/api/admin", adminRouter);

async function seed() {
  const existing = await db.query.usersTable.findFirst({
    where: eq(schema.usersTable.email, "admin@factcheck.au"),
  });
  if (!existing) {
    const adminHash = await hashPassword("admin2026");
    const [admin] = await db.insert(schema.usersTable).values({
      name: "Super Admin", email: "admin@factcheck.au",
      passwordHash: adminHash, role: "SUPER ADMIN", status: "Active",
    }).returning();
    console.log("Seeded admin:", admin.email);

    const itHash = await hashPassword("admin2026");
    await db.insert(schema.usersTable).values({
      name: "IT Tech", email: "it@factcheck.au",
      passwordHash: itHash, role: "IT TECH", status: "Active",
    });

    const s1Hash = await hashPassword("Test1234!");
    const [s1] = await db.insert(schema.usersTable).values({
      name: "Alice Student", email: "student1@example.com",
      passwordHash: s1Hash, role: "STUDENT", status: "Active",
    }).returning();
    await db.insert(schema.studentProgressTable).values({ userId: s1.id });

    const s2Hash = await hashPassword("Test1234!");
    const [s2] = await db.insert(schema.usersTable).values({
      name: "Bob Student", email: "student2@example.com",
      passwordHash: s2Hash, role: "STUDENT", status: "Active",
    }).returning();
    await db.insert(schema.studentProgressTable).values({ userId: s2.id });

    await db.insert(schema.weeklyModulesTable).values([
      {
        id: "wm-1", label: "Week 1 — May 2026",
        title: "2025 Federal Budget: Claims in the Wild",
        description: "Apply your media literacy skills to real statements made during the 2025 Federal Budget response.",
        context: "Following Treasurer Jim Chalmers' Budget night speech, opposition leaders made numerous claims about spending, tax, and economic impact.",
        color: "#5B21B6", tags: ["Emotional Framing", "Claim Identification", "Selective Evidence"],
        linkedQuestions: ["practice-01", "practice-05"], sortOrder: 0, published: true,
        startDate: "2026-05-01", endDate: "2026-05-31",
      },
      {
        id: "wm-2", label: "Week 2 — May 2026",
        title: "Referendum Anniversary: Revisiting the Claims",
        description: "Two years on from the Voice referendum, revisit the most viral claims and assess how they held up.",
        context: "The 2023 Voice to Parliament referendum generated significant online misinformation.",
        color: "#065F46", tags: ["False Authority", "Misleading Statistics"],
        linkedQuestions: ["practice-03", "practice-06"], sortOrder: 1, published: true,
        startDate: "2026-05-08", endDate: "2026-05-31",
      },
    ]);

    console.log("Seed complete.");
  }
}

app.listen(PORT, "0.0.0.0", async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await seed();
  } catch (e) {
    console.error("Seed error:", e);
  }
});
