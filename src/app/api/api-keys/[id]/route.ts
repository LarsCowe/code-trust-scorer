import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { apiKeys } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { updateApiKeySchema } from "@/lib/validations";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// DELETE /api/api-keys/[id] - Delete an API key
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", message: "You must be logged in to delete this API key" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: "Bad Request", message: "Invalid API key ID format" },
        { status: 400 }
      );
    }

    // Check if API key exists and belongs to user
    const apiKey = await db.query.apiKeys.findFirst({
      where: and(eq(apiKeys.id, id), eq(apiKeys.userId, session.user.id)),
    });

    if (!apiKey) {
      return NextResponse.json(
        { error: "Not Found", message: "API key not found" },
        { status: 404 }
      );
    }

    // Delete the API key
    await db.delete(apiKeys).where(eq(apiKeys.id, id));

    return NextResponse.json({ success: true, message: "API key deleted successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete API key";
    return NextResponse.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }
}

// PATCH /api/api-keys/[id] - Update an API key
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", message: "You must be logged in to update this API key" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: "Bad Request", message: "Invalid API key ID format" },
        { status: 400 }
      );
    }

    const body = await request.json() as Record<string, unknown>;
    const result = updateApiKeySchema.safeParse({ ...body, id });
    
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

    const { name, permissions } = result.data;

    // Check if API key exists and belongs to user
    const apiKey = await db.query.apiKeys.findFirst({
      where: and(eq(apiKeys.id, id), eq(apiKeys.userId, session.user.id)),
    });

    if (!apiKey) {
      return NextResponse.json(
        { error: "Not Found", message: "API key not found" },
        { status: 404 }
      );
    }

    // Build update object
    const updateData: Partial<typeof apiKeys.$inferInsert> = {};
    if (name !== undefined) {
      updateData.name = name;
    }
    if (permissions !== undefined) {
      updateData.permissions = permissions;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "Bad Request", message: "No fields to update" },
        { status: 400 }
      );
    }

    // Update the API key
    const [updatedKey] = await db
      .update(apiKeys)
      .set(updateData)
      .where(eq(apiKeys.id, id))
      .returning({
        id: apiKeys.id,
        name: apiKeys.name,
        keyPrefix: apiKeys.keyPrefix,
        permissions: apiKeys.permissions,
        expiresAt: apiKeys.expiresAt,
        createdAt: apiKeys.createdAt,
      });

    return NextResponse.json({ apiKey: updatedKey });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update API key";
    return NextResponse.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }
}
