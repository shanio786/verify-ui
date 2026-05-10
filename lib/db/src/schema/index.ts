import { pgTable, text, serial, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("STUDENT"),
  status: text("status").notNull().default("Active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastLogin: timestamp("last_login"),
});

export const sessionsTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const studentProgressTable = pgTable("student_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id).unique(),
  completedModules: jsonb("completed_modules").notNull().default([]),
  keyCheckPassed: jsonb("key_check_passed").notNull().default([]),
  completedPractices: jsonb("completed_practices").notNull().default([]),
  practiceResults: jsonb("practice_results").notNull().default({}),
  recentActivity: jsonb("recent_activity").notNull().default([]),
  lastLearningModule: integer("last_learning_module"),
  lastPage: text("last_page"),
  pretestScore: integer("pretest_score"),
  pretestTotal: integer("pretest_total"),
  posttestScore: integer("post_test_score"),
  posttestTotal: integer("post_test_total"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const weeklyModulesTable = pgTable("weekly_modules", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  context: text("context").notNull().default(""),
  color: text("color").notNull().default("#1e3a5f"),
  tags: jsonb("tags").notNull().default([]),
  startDate: text("start_date"),
  endDate: text("end_date"),
  linkedQuestions: jsonb("linked_questions").notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  published: boolean("published").notNull().default(false),
  deleted: boolean("deleted").notNull().default(false),
});

export const auditLogsTable = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  time: timestamp("time").notNull().defaultNow(),
  actor: text("actor").notNull(),
  actorEmail: text("actor_email").notNull(),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  ip: text("ip").notNull().default(""),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true, lastLogin: true });
export const insertProgressSchema = createInsertSchema(studentProgressTable).omit({ id: true, updatedAt: true });

export type User = typeof usersTable.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Session = typeof sessionsTable.$inferSelect;
export type StudentProgress = typeof studentProgressTable.$inferSelect;
export type WeeklyModule = typeof weeklyModulesTable.$inferSelect;
export type AuditLog = typeof auditLogsTable.$inferSelect;
