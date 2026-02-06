import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

/**
 * Create a database connection using Neon serverless
 */
function createDatabaseConnection() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }
  
  const sql = neon(databaseUrl);
  return drizzle(sql, { schema });
}

// Export singleton database instance
export const db = createDatabaseConnection();

// Re-export schema for convenience
export * from "./schema";

// Export types
export type Database = typeof db;
