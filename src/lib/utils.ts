import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a date to a human-readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/**
 * Format a date to a relative time string
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  
  // Handle invalid dates gracefully
  if (isNaN(d.getTime())) {
    return "Unknown";
  }
  
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) {
    return "just now";
  }
  if (diffMin < 60) {
    return `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  }
  if (diffHour < 24) {
    return `${diffHour} hour${diffHour === 1 ? "" : "s"} ago`;
  }
  if (diffDay < 7) {
    return `${diffDay} day${diffDay === 1 ? "" : "s"} ago`;
  }
  return formatDate(d);
}

/**
 * Generate a random ID
 */
export function generateId(length: number = 16): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Truncate a string to a maximum length
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - 3) + "...";
}

/**
 * Capitalize the first letter of a string
 */
export function capitalize(str: string): string {
  if (str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Sleep for a specified number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Safely parse JSON with a fallback value
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Get the severity color for a trust score
 */
export function getScoreColor(score: number): string {
  if (score >= 80) {
    return "text-green-600 dark:text-green-400";
  }
  if (score >= 60) {
    return "text-yellow-600 dark:text-yellow-400";
  }
  if (score >= 40) {
    return "text-orange-600 dark:text-orange-400";
  }
  return "text-red-600 dark:text-red-400";
}

/**
 * Get the background color for a trust score
 */
export function getScoreBgColor(score: number): string {
  if (score >= 80) {
    return "bg-green-100 dark:bg-green-900/30";
  }
  if (score >= 60) {
    return "bg-yellow-100 dark:bg-yellow-900/30";
  }
  if (score >= 40) {
    return "bg-orange-100 dark:bg-orange-900/30";
  }
  return "bg-red-100 dark:bg-red-900/30";
}

/**
 * Get severity color
 */
export function getSeverityColor(severity: "error" | "warning" | "info"): string {
  switch (severity) {
    case "error":
      return "text-red-600 dark:text-red-400";
    case "warning":
      return "text-yellow-600 dark:text-yellow-400";
    case "info":
      return "text-blue-600 dark:text-blue-400";
  }
}

/**
 * Get severity background color
 */
export function getSeverityBgColor(severity: "error" | "warning" | "info"): string {
  switch (severity) {
    case "error":
      return "bg-red-100 dark:bg-red-900/30";
    case "warning":
      return "bg-yellow-100 dark:bg-yellow-900/30";
    case "info":
      return "bg-blue-100 dark:bg-blue-900/30";
  }
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return "0 B";
  }
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format a number with thousands separators
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}
