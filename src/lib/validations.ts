import { z } from "zod";

// Auth schemas
export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name contains invalid characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required"),
});

export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
});

export const newPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Scan schemas
export const createScanSchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .max(1_000_000, "Code must be less than 1MB"),
  language: z
    .enum(["typescript", "javascript", "python", "tsx", "jsx"])
    .default("typescript"),
  fileName: z
    .string()
    .max(255, "File name must be less than 255 characters")
    .optional(),
});

export const updateScanSchema = z.object({
  id: z.string().uuid("Invalid scan ID"),
  status: z.enum(["pending", "running", "complete", "failed"]).optional(),
  trustScore: z.number().min(0).max(100).optional(),
});

// Issue schemas
export const createIssueSchema = z.object({
  scanId: z.string().uuid("Invalid scan ID"),
  type: z.enum([
    "hallucinated-api",
    "deprecated-method",
    "security-vulnerability",
    "quality-issue",
    "style-issue",
  ]),
  severity: z.enum(["error", "warning", "info"]),
  ruleId: z.string().min(1).max(100),
  message: z.string().min(1).max(1000),
  suggestion: z.string().max(2000).optional(),
  line: z.number().int().min(1),
  column: z.number().int().min(0),
  endLine: z.number().int().min(1).optional(),
  endColumn: z.number().int().min(0).optional(),
  codeSnippet: z.string().max(1000).optional(),
  confidence: z.number().min(0).max(1),
});

// API Key schemas
export const createApiKeySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
  expiresAt: z.date().optional(),
  permissions: z.object({
    read: z.boolean().default(true),
    write: z.boolean().default(true),
    admin: z.boolean().default(false),
  }).optional(),
});

export const updateApiKeySchema = z.object({
  id: z.string().uuid("Invalid API key ID"),
  name: z.string().min(1).max(255).optional(),
  permissions: z.object({
    read: z.boolean(),
    write: z.boolean(),
    admin: z.boolean().optional(),
  }).optional(),
});

// User settings schemas
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters")
    .optional(),
  avatarUrl: z
    .string()
    .url("Invalid URL")
    .max(500)
    .optional()
    .nullable(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Query/Filter schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const scanFilterSchema = z.object({
  status: z.enum(["pending", "running", "complete", "failed"]).optional(),
  language: z.enum(["typescript", "javascript", "python", "tsx", "jsx"]).optional(),
  minScore: z.coerce.number().int().min(0).max(100).optional(),
  maxScore: z.coerce.number().int().min(0).max(100).optional(),
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
});

export const issueFilterSchema = z.object({
  type: z.enum([
    "hallucinated-api",
    "deprecated-method",
    "security-vulnerability",
    "quality-issue",
    "style-issue",
  ]).optional(),
  severity: z.enum(["error", "warning", "info"]).optional(),
  scanId: z.string().uuid().optional(),
});

// Type exports
export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type NewPasswordInput = z.infer<typeof newPasswordSchema>;
export type CreateScanInput = z.infer<typeof createScanSchema>;
export type UpdateScanInput = z.infer<typeof updateScanSchema>;
export type CreateIssueInput = z.infer<typeof createIssueSchema>;
export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;
export type UpdateApiKeyInput = z.infer<typeof updateApiKeySchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type ScanFilterInput = z.infer<typeof scanFilterSchema>;
export type IssueFilterInput = z.infer<typeof issueFilterSchema>;
