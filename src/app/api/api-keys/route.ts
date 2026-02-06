import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { apiKeys } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { createApiKeySchema } from "@/lib/validations";
import { generateId } from "@/lib/utils";

// Simple hash function for API keys
function hashApiKey(key: string): string {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

// GET /api/api-keys - List API keys for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", message: "You must be logged in to view API keys" },
        { status: 401 }
      );
    }

    const keys = await db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        keyPrefix: apiKeys.keyPrefix,
        permissions: apiKeys.permissions,
        lastUsedAt: apiKeys.lastUsedAt,
        expiresAt: apiKeys.expiresAt,
        createdAt: apiKeys.createdAt,
      })
      .from(apiKeys)
      .where(eq(apiKeys.userId, session.user.id));

    return NextResponse.json({ apiKeys: keys });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch API keys";
    return NextResponse.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }
}

// POST /api/api-keys - Create a new API key
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", message: "You must be logged in to create an API key" },
        { status: 401 }
      );
    }

    // Check existing key count (max 10)
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(apiKeys)
      .where(eq(apiKeys.userId, session.user.id));
    
    const existingCount = Number(countResult[0]?.count ?? 0);
    if (existingCount >= 10) {
      return NextResponse.json(
        { error: "Limit Reached", message: "Maximum of 10 API keys allowed" },
        { status: 400 }
      );
    }

    const body: unknown = await request.json();
    const result = createApiKeySchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { 
          error: "Validation Error", 
          message: "Invalid request body",
          issues: result.error.issues,
        },
        { status: 400 }
      );
    }

    const { name, expiresAt, permissions } = result.data;

    // Generate API key
    const keyValue = `cts_${generateId(32)}`;
    const keyPrefix = keyValue.substring(0, 12);
    const keyHash = hashApiKey(keyValue);

    // Create the API key
    const [apiKey] = await db
      .insert(apiKeys)
      .values({
        userId: session.user.id,
        name,
        keyHash,
        keyPrefix,
        permissions: permissions ?? { read: true, write: true },
        expiresAt: expiresAt ?? null,
      })
      .returning({
        id: apiKeys.id,
        name: apiKeys.name,
        keyPrefix: apiKeys.keyPrefix,
        permissions: apiKeys.permissions,
        expiresAt: apiKeys.expiresAt,
        createdAt: apiKeys.createdAt,
      });

    // Return the full key only on creation (won't be shown again)
    return NextResponse.json({
      apiKey: {
        ...apiKey,
        key: keyValue, // Only returned on creation
      },
      message: "API key created. Save this key - it won't be shown again.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create API key";
    return NextResponse.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }
}
