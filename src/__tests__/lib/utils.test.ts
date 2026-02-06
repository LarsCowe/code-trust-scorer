import { describe, it, expect } from "vitest";
import {
  cn,
  formatDate,
  formatRelativeTime,
  generateId,
  truncate,
  capitalize,
  safeJsonParse,
  getScoreColor,
  getScoreBgColor,
  getSeverityColor,
  getSeverityBgColor,
  formatBytes,
  formatNumber,
} from "@/lib/utils";

describe("Utils", () => {
  describe("cn (class name merge)", () => {
    it("should merge class names", () => {
      const result = cn("foo", "bar");
      expect(result).toBe("foo bar");
    });

    it("should handle conditional classes", () => {
      const result = cn("foo", false && "bar", "baz");
      expect(result).toBe("foo baz");
    });

    it("should merge Tailwind classes correctly", () => {
      const result = cn("px-4", "px-2");
      expect(result).toBe("px-2");
    });

    it("should handle undefined and null", () => {
      const result = cn("foo", undefined, null, "bar");
      expect(result).toBe("foo bar");
    });
  });

  describe("formatDate", () => {
    it("should format a Date object", () => {
      const date = new Date("2024-01-15T10:30:00Z");
      const result = formatDate(date);
      expect(result).toContain("Jan");
      expect(result).toContain("15");
      expect(result).toContain("2024");
    });

    it("should format a date string", () => {
      const result = formatDate("2024-06-20T15:45:00Z");
      expect(result).toContain("Jun");
      expect(result).toContain("20");
    });
  });

  describe("formatRelativeTime", () => {
    it("should return 'just now' for recent times", () => {
      const now = new Date();
      const result = formatRelativeTime(now);
      expect(result).toBe("just now");
    });

    it("should format minutes ago", () => {
      const date = new Date(Date.now() - 5 * 60 * 1000);
      const result = formatRelativeTime(date);
      expect(result).toContain("minute");
    });

    it("should format hours ago", () => {
      const date = new Date(Date.now() - 3 * 60 * 60 * 1000);
      const result = formatRelativeTime(date);
      expect(result).toContain("hour");
    });

    it("should format days ago", () => {
      const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
      const result = formatRelativeTime(date);
      expect(result).toContain("day");
    });

    it("should handle invalid date strings", () => {
      const result = formatRelativeTime("not-a-date");
      expect(result).toBe("Unknown");
    });
  });

  describe("generateId", () => {
    it("should generate an ID of default length", () => {
      const id = generateId();
      expect(id.length).toBe(16);
    });

    it("should generate an ID of specified length", () => {
      const id = generateId(32);
      expect(id.length).toBe(32);
    });

    it("should generate unique IDs", () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it("should only contain alphanumeric characters", () => {
      const id = generateId(100);
      expect(id).toMatch(/^[A-Za-z0-9]+$/);
    });
  });

  describe("truncate", () => {
    it("should return original string if within length", () => {
      const result = truncate("hello", 10);
      expect(result).toBe("hello");
    });

    it("should truncate long strings with ellipsis", () => {
      const result = truncate("hello world", 8);
      expect(result).toBe("hello...");
      expect(result.length).toBe(8);
    });

    it("should handle exact length", () => {
      const result = truncate("hello", 5);
      expect(result).toBe("hello");
    });
  });

  describe("capitalize", () => {
    it("should capitalize first letter", () => {
      const result = capitalize("hello");
      expect(result).toBe("Hello");
    });

    it("should handle empty string", () => {
      const result = capitalize("");
      expect(result).toBe("");
    });

    it("should handle single character", () => {
      const result = capitalize("a");
      expect(result).toBe("A");
    });

    it("should not change already capitalized", () => {
      const result = capitalize("Hello");
      expect(result).toBe("Hello");
    });
  });

  describe("safeJsonParse", () => {
    it("should parse valid JSON", () => {
      const result = safeJsonParse('{"foo": "bar"}', {});
      expect(result).toEqual({ foo: "bar" });
    });

    it("should return fallback for invalid JSON", () => {
      const result = safeJsonParse("not json", { default: true });
      expect(result).toEqual({ default: true });
    });

    it("should handle arrays", () => {
      const result = safeJsonParse("[1, 2, 3]", []);
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe("getScoreColor", () => {
    it("should return green for high scores", () => {
      expect(getScoreColor(90)).toContain("green");
      expect(getScoreColor(80)).toContain("green");
    });

    it("should return yellow for medium-high scores", () => {
      expect(getScoreColor(70)).toContain("yellow");
      expect(getScoreColor(60)).toContain("yellow");
    });

    it("should return orange for medium-low scores", () => {
      expect(getScoreColor(50)).toContain("orange");
      expect(getScoreColor(40)).toContain("orange");
    });

    it("should return red for low scores", () => {
      expect(getScoreColor(30)).toContain("red");
      expect(getScoreColor(0)).toContain("red");
    });
  });

  describe("getScoreBgColor", () => {
    it("should return appropriate background colors", () => {
      expect(getScoreBgColor(90)).toContain("green");
      expect(getScoreBgColor(70)).toContain("yellow");
      expect(getScoreBgColor(50)).toContain("orange");
      expect(getScoreBgColor(20)).toContain("red");
    });
  });

  describe("getSeverityColor", () => {
    it("should return red for error", () => {
      expect(getSeverityColor("error")).toContain("red");
    });

    it("should return yellow for warning", () => {
      expect(getSeverityColor("warning")).toContain("yellow");
    });

    it("should return blue for info", () => {
      expect(getSeverityColor("info")).toContain("blue");
    });
  });

  describe("getSeverityBgColor", () => {
    it("should return appropriate background colors", () => {
      expect(getSeverityBgColor("error")).toContain("red");
      expect(getSeverityBgColor("warning")).toContain("yellow");
      expect(getSeverityBgColor("info")).toContain("blue");
    });
  });

  describe("formatBytes", () => {
    it("should format bytes", () => {
      expect(formatBytes(0)).toBe("0 B");
      expect(formatBytes(500)).toContain("B");
    });

    it("should format kilobytes", () => {
      const result = formatBytes(1024);
      expect(result).toBe("1 KB");
    });

    it("should format megabytes", () => {
      const result = formatBytes(1024 * 1024);
      expect(result).toBe("1 MB");
    });

    it("should format gigabytes", () => {
      const result = formatBytes(1024 * 1024 * 1024);
      expect(result).toBe("1 GB");
    });
  });

  describe("formatNumber", () => {
    it("should format numbers with thousands separators", () => {
      expect(formatNumber(1000)).toBe("1,000");
      expect(formatNumber(1000000)).toBe("1,000,000");
    });

    it("should handle small numbers", () => {
      expect(formatNumber(42)).toBe("42");
    });
  });
});
