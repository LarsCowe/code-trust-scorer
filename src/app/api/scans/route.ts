import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { scans, issues as issuesTable } from "@/db/schema";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { createScanSchema, paginationSchema, scanFilterSchema } from "@/lib/validations";
import { analyzeCode } from "@/lib/analysis/engine";

// GET /api/scans - List scans for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", message: "You must be logged in to view scans" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    
    // Parse pagination
    const paginationResult = paginationSchema.safeParse({
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
    });
    
    const { page, limit } = paginationResult.success 
      ? paginationResult.data 
      : { page: 1, limit: 20 };

    // Parse filters
    const filterResult = scanFilterSchema.safeParse({
      status: searchParams.get("status"),
      language: searchParams.get("language"),
      minScore: searchParams.get("minScore"),
      maxScore: searchParams.get("maxScore"),
      fromDate: searchParams.get("fromDate"),
      toDate: searchParams.get("toDate"),
    });
    
    const filters = filterResult.success ? filterResult.data : {};

    // Build query conditions
    const conditions = [eq(scans.userId, session.user.id)];
    
    if (filters.status) {
      conditions.push(eq(scans.status, filters.status));
    }
    if (filters.language) {
      conditions.push(eq(scans.language, filters.language));
    }
    if (filters.minScore !== undefined) {
      conditions.push(gte(scans.trustScore, filters.minScore));
    }
    if (filters.maxScore !== undefined) {
      conditions.push(lte(scans.trustScore, filters.maxScore));
    }
    if (filters.fromDate) {
      conditions.push(gte(scans.createdAt, filters.fromDate));
    }
    if (filters.toDate) {
      conditions.push(lte(scans.createdAt, filters.toDate));
    }

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(scans)
      .where(and(...conditions));
    
    const total = Number(countResult[0]?.count ?? 0);

    // Get scans with pagination
    const offset = (page - 1) * limit;
    const scanResults = await db
      .select({
        id: scans.id,
        language: scans.language,
        fileName: scans.fileName,
        trustScore: scans.trustScore,
        status: scans.status,
        linesOfCode: scans.linesOfCode,
        errorCount: scans.errorCount,
        warningCount: scans.warningCount,
        infoCount: scans.infoCount,
        createdAt: scans.createdAt,
        completedAt: scans.completedAt,
      })
      .from(scans)
      .where(and(...conditions))
      .orderBy(desc(scans.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      scans: scanResults,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch scans";
    return NextResponse.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }
}

// POST /api/scans - Create a new scan
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", message: "You must be logged in to create a scan" },
        { status: 401 }
      );
    }

    const body: unknown = await request.json();
    const result = createScanSchema.safeParse(body);
    
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

    const { code, language, fileName } = result.data;

    // Create the scan record
    const [scan] = await db
      .insert(scans)
      .values({
        userId: session.user.id,
        code,
        language,
        fileName: fileName ?? null,
        status: "running",
        linesOfCode: code.split("\n").length,
      })
      .returning();

    if (!scan) {
      throw new Error("Failed to create scan record");
    }

    // Run the analysis
    const analysisResult = await analyzeCode(code, { language });

    // Insert issues
    if (analysisResult.issues.length > 0) {
      await db.insert(issuesTable).values(
        analysisResult.issues.map((issue) => ({
          scanId: scan.id,
          type: issue.type,
          severity: issue.severity,
          ruleId: issue.ruleId,
          message: issue.message,
          suggestion: issue.suggestion ?? null,
          line: issue.line,
          column: issue.column,
          endLine: issue.endLine ?? null,
          endColumn: issue.endColumn ?? null,
          codeSnippet: issue.codeSnippet ?? null,
          confidence: issue.confidence.toFixed(2),
        }))
      );
    }

    // Update the scan with results
    const [updatedScan] = await db
      .update(scans)
      .set({
        status: "complete",
        trustScore: analysisResult.trustScore,
        confidence: analysisResult.confidence.toFixed(2),
        errorCount: analysisResult.metadata.errorCount,
        warningCount: analysisResult.metadata.warningCount,
        infoCount: analysisResult.metadata.infoCount,
        completedAt: new Date(),
        metadata: {
          framework: analysisResult.metadata.framework,
          analysisTime: analysisResult.analysisTime,
          fileSize: code.length,
        },
      })
      .where(eq(scans.id, scan.id))
      .returning();

    // Fetch the issues for the response
    const scanIssues = await db
      .select()
      .from(issuesTable)
      .where(eq(issuesTable.scanId, scan.id));

    return NextResponse.json({
      scan: updatedScan,
      issues: scanIssues,
      analysis: {
        trustScore: analysisResult.trustScore,
        confidence: analysisResult.confidence,
        linesOfCode: analysisResult.linesOfCode,
        analysisTime: analysisResult.analysisTime,
        metadata: analysisResult.metadata,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create scan";
    return NextResponse.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }
}
