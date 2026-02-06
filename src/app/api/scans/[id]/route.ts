import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { scans, issues } from "@/db/schema";
import { eq, and } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/scans/[id] - Get a single scan with issues
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", message: "You must be logged in to view this scan" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: "Bad Request", message: "Invalid scan ID format" },
        { status: 400 }
      );
    }

    // Get the scan
    const scan = await db.query.scans.findFirst({
      where: and(eq(scans.id, id), eq(scans.userId, session.user.id)),
    });

    if (!scan) {
      return NextResponse.json(
        { error: "Not Found", message: "Scan not found" },
        { status: 404 }
      );
    }

    // Get the issues for this scan
    const scanIssues = await db
      .select()
      .from(issues)
      .where(eq(issues.scanId, id));

    return NextResponse.json({
      scan,
      issues: scanIssues,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch scan";
    return NextResponse.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }
}

// DELETE /api/scans/[id] - Delete a scan
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", message: "You must be logged in to delete this scan" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: "Bad Request", message: "Invalid scan ID format" },
        { status: 400 }
      );
    }

    // Check if scan exists and belongs to user
    const scan = await db.query.scans.findFirst({
      where: and(eq(scans.id, id), eq(scans.userId, session.user.id)),
    });

    if (!scan) {
      return NextResponse.json(
        { error: "Not Found", message: "Scan not found" },
        { status: 404 }
      );
    }

    // Delete the scan (issues will be cascade deleted)
    await db.delete(scans).where(eq(scans.id, id));

    return NextResponse.json({ success: true, message: "Scan deleted successfully" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete scan";
    return NextResponse.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }
}
