import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  pgEnum,
  jsonb,
  numeric,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const planEnum = pgEnum("plan", ["free", "pro", "enterprise"]);
export const scanStatusEnum = pgEnum("scan_status", ["pending", "running", "complete", "failed"]);
export const issueTypeEnum = pgEnum("issue_type", [
  "hallucinated-api",
  "deprecated-method",
  "security-vulnerability",
  "quality-issue",
  "style-issue",
]);
export const severityEnum = pgEnum("severity", ["error", "warning", "info"]);

// Users table
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }),
    avatarUrl: varchar("avatar_url", { length: 500 }),
    githubId: varchar("github_id", { length: 50 }).unique(),
    emailVerified: boolean("email_verified").default(false),
    plan: planEnum("plan").default("free").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    lastLoginAt: timestamp("last_login_at"),
  },
  (table) => [
    index("users_email_idx").on(table.email),
    index("users_github_id_idx").on(table.githubId),
  ]
);

// Scans table
export const scans = pgTable(
  "scans",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    code: text("code").notNull(),
    language: varchar("language", { length: 50 }).notNull(),
    fileName: varchar("file_name", { length: 255 }),
    trustScore: integer("trust_score"),
    confidence: numeric("confidence", { precision: 5, scale: 2 }),
    status: scanStatusEnum("status").default("pending").notNull(),
    linesOfCode: integer("lines_of_code").default(0),
    errorCount: integer("error_count").default(0),
    warningCount: integer("warning_count").default(0),
    infoCount: integer("info_count").default(0),
    metadata: jsonb("metadata").$type<ScanMetadata>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    completedAt: timestamp("completed_at"),
  },
  (table) => [
    index("scans_user_id_idx").on(table.userId),
    index("scans_created_at_idx").on(table.createdAt),
    index("scans_status_idx").on(table.status),
  ]
);

// Issues table
export const issues = pgTable(
  "issues",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    scanId: uuid("scan_id")
      .references(() => scans.id, { onDelete: "cascade" })
      .notNull(),
    type: issueTypeEnum("type").notNull(),
    severity: severityEnum("severity").notNull(),
    ruleId: varchar("rule_id", { length: 100 }).notNull(),
    message: text("message").notNull(),
    suggestion: text("suggestion"),
    line: integer("line").notNull(),
    column: integer("column").notNull(),
    endLine: integer("end_line"),
    endColumn: integer("end_column"),
    codeSnippet: text("code_snippet"),
    confidence: numeric("confidence", { precision: 5, scale: 2 }).notNull(),
    metadata: jsonb("metadata").$type<IssueMetadata>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("issues_scan_id_idx").on(table.scanId),
    index("issues_severity_idx").on(table.severity),
    index("issues_type_idx").on(table.type),
  ]
);

// API Keys table
export const apiKeys = pgTable(
  "api_keys",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    keyHash: varchar("key_hash", { length: 255 }).notNull(),
    keyPrefix: varchar("key_prefix", { length: 12 }).notNull(),
    permissions: jsonb("permissions").$type<ApiKeyPermissions>().default({ read: true, write: true }),
    lastUsedAt: timestamp("last_used_at"),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("api_keys_user_id_idx").on(table.userId),
    index("api_keys_key_prefix_idx").on(table.keyPrefix),
  ]
);

// Sessions table for NextAuth
export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    sessionToken: varchar("session_token", { length: 255 }).unique().notNull(),
    expires: timestamp("expires").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("sessions_user_id_idx").on(table.userId),
    index("sessions_token_idx").on(table.sessionToken),
  ]
);

// Verification tokens for magic link auth
export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).unique().notNull(),
    expires: timestamp("expires").notNull(),
  },
  (table) => [
    index("verification_tokens_identifier_idx").on(table.identifier),
    index("verification_tokens_token_idx").on(table.token),
  ]
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  scans: many(scans),
  apiKeys: many(apiKeys),
  sessions: many(sessions),
}));

export const scansRelations = relations(scans, ({ one, many }) => ({
  user: one(users, {
    fields: [scans.userId],
    references: [users.id],
  }),
  issues: many(issues),
}));

export const issuesRelations = relations(issues, ({ one }) => ({
  scan: one(scans, {
    fields: [issues.scanId],
    references: [scans.id],
  }),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, {
    fields: [apiKeys.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

// Type definitions for JSONB columns
export interface ScanMetadata {
  source?: string;
  framework?: string;
  nodeVersion?: string;
  analysisTime?: number;
  fileSize?: number;
}

export interface IssueMetadata {
  documentation?: string;
  fixAvailable?: boolean;
  relatedRules?: string[];
  context?: string;
}

export interface ApiKeyPermissions {
  read: boolean;
  write: boolean;
  admin?: boolean;
}

// Type exports for use in the application
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Scan = typeof scans.$inferSelect;
export type NewScan = typeof scans.$inferInsert;
export type Issue = typeof issues.$inferSelect;
export type NewIssue = typeof issues.$inferInsert;
export type ApiKey = typeof apiKeys.$inferSelect;
export type NewApiKey = typeof apiKeys.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type NewVerificationToken = typeof verificationTokens.$inferInsert;
