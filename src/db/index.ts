import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Cached database instance
let dbInstance: NeonHttpDatabase<typeof schema> | null = null;

/**
 * Get the database connection (lazy initialization)
 * This allows the app to build without DATABASE_URL set
 */
export function getDb(): NeonHttpDatabase<typeof schema> {
  if (dbInstance) {
    return dbInstance;
  }
  
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  
  const sql: NeonQueryFunction<boolean, boolean> = neon(databaseUrl);
  dbInstance = drizzle(sql, { schema });
  return dbInstance;
}

// Export db as a getter for backwards compatibility
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_target, prop) {
    return Reflect.get(getDb(), prop);
  },
});

// Re-export schema for convenience
export * from "./schema";

// Export types
export type Database = NeonHttpDatabase<typeof schema>;
