import { describe, it, expect } from "vitest";
import {
  signUpSchema,
  signInSchema,
  createScanSchema,
  createApiKeySchema,
  updateProfileSchema,
  paginationSchema,
  scanFilterSchema,
} from "@/lib/validations";

describe("Validation Schemas", () => {
  describe("signUpSchema", () => {
    it("should accept valid signup data", () => {
      const result = signUpSchema.safeParse({
        email: "test@example.com",
        name: "John Doe",
        password: "Password123",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const result = signUpSchema.safeParse({
        email: "not-an-email",
        name: "John Doe",
        password: "Password123",
      });
      expect(result.success).toBe(false);
    });

    it("should reject short password", () => {
      const result = signUpSchema.safeParse({
        email: "test@example.com",
        name: "John Doe",
        password: "Short1",
      });
      expect(result.success).toBe(false);
    });

    it("should reject password without uppercase", () => {
      const result = signUpSchema.safeParse({
        email: "test@example.com",
        name: "John Doe",
        password: "password123",
      });
      expect(result.success).toBe(false);
    });

    it("should reject password without lowercase", () => {
      const result = signUpSchema.safeParse({
        email: "test@example.com",
        name: "John Doe",
        password: "PASSWORD123",
      });
      expect(result.success).toBe(false);
    });

    it("should reject password without number", () => {
      const result = signUpSchema.safeParse({
        email: "test@example.com",
        name: "John Doe",
        password: "PasswordOnly",
      });
      expect(result.success).toBe(false);
    });

    it("should reject empty name", () => {
      const result = signUpSchema.safeParse({
        email: "test@example.com",
        name: "",
        password: "Password123",
      });
      expect(result.success).toBe(false);
    });

    it("should reject name with invalid characters", () => {
      const result = signUpSchema.safeParse({
        email: "test@example.com",
        name: "John123",
        password: "Password123",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("signInSchema", () => {
    it("should accept valid signin data", () => {
      const result = signInSchema.safeParse({
        email: "test@example.com",
        password: "anypassword",
      });
      expect(result.success).toBe(true);
    });

    it("should reject empty email", () => {
      const result = signInSchema.safeParse({
        email: "",
        password: "password",
      });
      expect(result.success).toBe(false);
    });

    it("should reject invalid email format", () => {
      const result = signInSchema.safeParse({
        email: "invalid",
        password: "password",
      });
      expect(result.success).toBe(false);
    });

    it("should reject empty password", () => {
      const result = signInSchema.safeParse({
        email: "test@example.com",
        password: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("createScanSchema", () => {
    it("should accept valid scan data", () => {
      const result = createScanSchema.safeParse({
        code: "const x = 1;",
        language: "typescript",
      });
      expect(result.success).toBe(true);
    });

    it("should accept scan with optional fileName", () => {
      const result = createScanSchema.safeParse({
        code: "const x = 1;",
        language: "typescript",
        fileName: "test.ts",
      });
      expect(result.success).toBe(true);
    });

    it("should reject empty code", () => {
      const result = createScanSchema.safeParse({
        code: "",
        language: "typescript",
      });
      expect(result.success).toBe(false);
    });

    it("should accept all valid languages", () => {
      const languages = ["typescript", "javascript", "python", "tsx", "jsx"];
      for (const language of languages) {
        const result = createScanSchema.safeParse({
          code: "code",
          language,
        });
        expect(result.success).toBe(true);
      }
    });

    it("should use default language if not provided", () => {
      const result = createScanSchema.safeParse({
        code: "const x = 1;",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.language).toBe("typescript");
      }
    });
  });

  describe("createApiKeySchema", () => {
    it("should accept valid API key data", () => {
      const result = createApiKeySchema.safeParse({
        name: "My API Key",
      });
      expect(result.success).toBe(true);
    });

    it("should accept API key with expiration", () => {
      const result = createApiKeySchema.safeParse({
        name: "My API Key",
        expiresAt: new Date("2025-01-01"),
      });
      expect(result.success).toBe(true);
    });

    it("should accept API key with permissions", () => {
      const result = createApiKeySchema.safeParse({
        name: "My API Key",
        permissions: {
          read: true,
          write: false,
          admin: false,
        },
      });
      expect(result.success).toBe(true);
    });

    it("should reject empty name", () => {
      const result = createApiKeySchema.safeParse({
        name: "",
      });
      expect(result.success).toBe(false);
    });

    it("should reject name that is too long", () => {
      const result = createApiKeySchema.safeParse({
        name: "a".repeat(300),
      });
      expect(result.success).toBe(false);
    });
  });

  describe("updateProfileSchema", () => {
    it("should accept valid profile update", () => {
      const result = updateProfileSchema.safeParse({
        name: "New Name",
      });
      expect(result.success).toBe(true);
    });

    it("should accept avatar URL", () => {
      const result = updateProfileSchema.safeParse({
        avatarUrl: "https://example.com/avatar.jpg",
      });
      expect(result.success).toBe(true);
    });

    it("should accept null avatar URL", () => {
      const result = updateProfileSchema.safeParse({
        avatarUrl: null,
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid avatar URL", () => {
      const result = updateProfileSchema.safeParse({
        avatarUrl: "not-a-url",
      });
      expect(result.success).toBe(false);
    });

    it("should accept empty update", () => {
      const result = updateProfileSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe("paginationSchema", () => {
    it("should accept valid pagination", () => {
      const result = paginationSchema.safeParse({
        page: 1,
        limit: 20,
      });
      expect(result.success).toBe(true);
    });

    it("should coerce string numbers", () => {
      const result = paginationSchema.safeParse({
        page: "2",
        limit: "50",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(2);
        expect(result.data.limit).toBe(50);
      }
    });

    it("should use defaults for missing values", () => {
      const result = paginationSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(20);
      }
    });

    it("should reject page less than 1", () => {
      const result = paginationSchema.safeParse({
        page: 0,
      });
      expect(result.success).toBe(false);
    });

    it("should reject limit greater than 100", () => {
      const result = paginationSchema.safeParse({
        limit: 150,
      });
      expect(result.success).toBe(false);
    });
  });

  describe("scanFilterSchema", () => {
    it("should accept valid filters", () => {
      const result = scanFilterSchema.safeParse({
        status: "complete",
        language: "typescript",
        minScore: 50,
        maxScore: 100,
      });
      expect(result.success).toBe(true);
    });

    it("should accept empty filters", () => {
      const result = scanFilterSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("should accept date filters", () => {
      const result = scanFilterSchema.safeParse({
        fromDate: new Date("2024-01-01"),
        toDate: new Date("2024-12-31"),
      });
      expect(result.success).toBe(true);
    });

    it("should coerce score values", () => {
      const result = scanFilterSchema.safeParse({
        minScore: "30",
        maxScore: "90",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.minScore).toBe(30);
        expect(result.data.maxScore).toBe(90);
      }
    });

    it("should reject invalid status", () => {
      const result = scanFilterSchema.safeParse({
        status: "invalid-status",
      });
      expect(result.success).toBe(false);
    });

    it("should reject invalid language", () => {
      const result = scanFilterSchema.safeParse({
        language: "invalid-language",
      });
      expect(result.success).toBe(false);
    });

    it("should reject score out of range", () => {
      const result = scanFilterSchema.safeParse({
        minScore: -10,
      });
      expect(result.success).toBe(false);
    });
  });
});
