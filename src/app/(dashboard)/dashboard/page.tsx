"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SkeletonDashboard } from "@/components/ui/skeleton";
import { TrustScoreDisplay, TrustScoreBadge } from "@/components/trust-score-display";
import { formatRelativeTime, getScoreColor } from "@/lib/utils";
import {
  Scan,
  AlertCircle,
  AlertTriangle,
  Info,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  FileCode,
} from "lucide-react";

interface Scan {
  id: string;
  language: string;
  fileName: string | null;
  trustScore: number | null;
  status: string;
  linesOfCode: number | null;
  errorCount: number | null;
  warningCount: number | null;
  infoCount: number | null;
  createdAt: string;
}

interface ScansResponse {
  scans: Scan[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

async function fetchScans(): Promise<ScansResponse> {
  const response = await fetch("/api/scans?limit=5");
  if (!response.ok) {
    throw new Error("Failed to fetch scans");
  }
  return response.json() as Promise<ScansResponse>;
}

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["scans", "dashboard"],
    queryFn: fetchScans,
  });

  if (isLoading) {
    return <SkeletonDashboard />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load dashboard data</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  const scans = data?.scans ?? [];
  const totalScans = data?.pagination.total ?? 0;
  
  // Calculate stats
  const completedScans = scans.filter((s) => s.status === "complete");
  const avgScore = completedScans.length > 0
    ? Math.round(completedScans.reduce((acc, s) => acc + (s.trustScore ?? 0), 0) / completedScans.length)
    : null;
  
  const totalErrors = scans.reduce((acc, s) => acc + (s.errorCount ?? 0), 0);
  const totalWarnings = scans.reduce((acc, s) => acc + (s.warningCount ?? 0), 0);
  const totalInfo = scans.reduce((acc, s) => acc + (s.infoCount ?? 0), 0);

  // Calculate trend (compare last 2 scans)
  const scoreTrend = completedScans.length >= 2 
    ? (completedScans[0]?.trustScore ?? 0) - (completedScans[1]?.trustScore ?? 0)
    : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your code analysis results
          </p>
        </div>
        <Button asChild>
          <Link href="/scanner">
            <Scan className="mr-2 h-4 w-4" />
            New Scan
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Trust Score</CardDescription>
          </CardHeader>
          <CardContent>
            {avgScore !== null ? (
              <div className="flex items-center gap-2">
                <span className={`text-3xl font-bold ${getScoreColor(avgScore)}`}>
                  {avgScore}
                </span>
                {scoreTrend !== 0 && (
                  <Badge variant={scoreTrend > 0 ? "success" : scoreTrend < 0 ? "error" : "secondary"}>
                    {scoreTrend > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : 
                     scoreTrend < 0 ? <TrendingDown className="h-3 w-3 mr-1" /> :
                     <Minus className="h-3 w-3 mr-1" />}
                    {scoreTrend > 0 ? "+" : ""}{scoreTrend}
                  </Badge>
                )}
              </div>
            ) : (
              <span className="text-2xl text-muted-foreground">—</span>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Scans</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">{totalScans}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Issues Found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span className="font-semibold">{totalErrors}</span>
              </div>
              <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-semibold">{totalWarnings}</span>
              </div>
              <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <Info className="h-4 w-4" />
                <span className="font-semibold">{totalInfo}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Lines Analyzed</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">
              {scans.reduce((acc, s) => acc + (s.linesOfCode ?? 0), 0).toLocaleString()}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Recent Scans */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Scans</CardTitle>
            <CardDescription>Your latest code analysis results</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/history">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {scans.length === 0 ? (
            <div className="text-center py-8">
              <FileCode className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No scans yet</p>
              <Button asChild>
                <Link href="/scanner">Run Your First Scan</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {scans.map((scan) => (
                <Link
                  key={scan.id}
                  href={`/history/${scan.id}`}
                  className="block p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="hidden sm:block">
                        {scan.trustScore !== null ? (
                          <TrustScoreDisplay score={scan.trustScore} size="sm" showLabel={false} animated={false} />
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-xs text-muted-foreground">N/A</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {scan.fileName ?? `Scan ${scan.id.slice(0, 8)}`}
                          </span>
                          <Badge variant="outline">{scan.language}</Badge>
                          {scan.status === "running" && (
                            <Badge variant="secondary">Running...</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>{scan.linesOfCode} lines</span>
                          {scan.status === "complete" && (
                            <>
                              <span className="text-red-600 dark:text-red-400">
                                {scan.errorCount} errors
                              </span>
                              <span className="text-yellow-600 dark:text-yellow-400">
                                {scan.warningCount} warnings
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="sm:hidden mb-1">
                        {scan.trustScore !== null && (
                          <TrustScoreBadge score={scan.trustScore} />
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatRelativeTime(scan.createdAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
