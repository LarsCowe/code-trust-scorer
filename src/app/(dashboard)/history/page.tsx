"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { SkeletonTable } from "@/components/ui/skeleton";
import { TrustScoreBadge } from "@/components/trust-score-display";
import { formatRelativeTime, formatDate } from "@/lib/utils";
import {
  Scan,
  FileCode,
  AlertCircle,
  AlertTriangle,
  Info,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Eye,
} from "lucide-react";

interface ScanItem {
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
  completedAt: string | null;
}

interface ScansResponse {
  scans: ScanItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const languageOptions = [
  { value: "", label: "All Languages" },
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "tsx", label: "TypeScript JSX" },
  { value: "jsx", label: "JavaScript JSX" },
  { value: "python", label: "Python" },
];

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "complete", label: "Complete" },
  { value: "running", label: "Running" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];

async function fetchScans(
  page: number,
  limit: number,
  language?: string,
  status?: string
): Promise<ScansResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (language) {
    params.set("language", language);
  }
  if (status) {
    params.set("status", status);
  }

  const response = await fetch(`/api/scans?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch scans");
  }
  return response.json() as Promise<ScansResponse>;
}

export default function HistoryPage() {
  const [page, setPage] = React.useState(1);
  const [language, setLanguage] = React.useState("");
  const [status, setStatus] = React.useState("");
  const limit = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ["scans", "history", page, limit, language, status],
    queryFn: () => fetchScans(page, limit, language, status),
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this scan?")) {
      return;
    }

    try {
      const response = await fetch(`/api/scans/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete scan");
      }

      // Refresh the data
      window.location.reload();
    } catch (err) {
      alert("Failed to delete scan. Please try again.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Scan History</h1>
          <p className="text-muted-foreground">
            View and manage your past code analyses
          </p>
        </div>
        <Button asChild>
          <Link href="/scanner">
            <Scan className="mr-2 h-4 w-4" />
            New Scan
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-48">
              <Select
                options={languageOptions}
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  setPage(1);
                }}
                placeholder="Filter by language"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                options={statusOptions}
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                placeholder="Filter by status"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Scans</CardTitle>
          <CardDescription>
            {data?.pagination.total ?? 0} total scans
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SkeletonTable rows={5} columns={6} />
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-destructive">Failed to load scans</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : data?.scans.length === 0 ? (
            <div className="text-center py-12">
              <FileCode className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No scans found</p>
              <Button asChild>
                <Link href="/scanner">Run Your First Scan</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">File</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Language</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Score</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Issues</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.scans.map((scan) => (
                      <tr key={scan.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <span className="font-medium">
                            {scan.fileName ?? `Scan ${scan.id.slice(0, 8)}`}
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {scan.linesOfCode} lines
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{scan.language}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          {scan.trustScore !== null ? (
                            <TrustScoreBadge score={scan.trustScore} />
                          ) : (
                            <Badge variant="secondary">{scan.status}</Badge>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                              <AlertCircle className="h-3.5 w-3.5" />
                              {scan.errorCount ?? 0}
                            </span>
                            <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                              <AlertTriangle className="h-3.5 w-3.5" />
                              {scan.warningCount ?? 0}
                            </span>
                            <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                              <Info className="h-3.5 w-3.5" />
                              {scan.infoCount ?? 0}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {formatRelativeTime(scan.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/history/${scan.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(scan.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {data?.scans.map((scan) => (
                  <div
                    key={scan.id}
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {scan.fileName ?? `Scan ${scan.id.slice(0, 8)}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {scan.linesOfCode} lines • {formatRelativeTime(scan.createdAt)}
                        </p>
                      </div>
                      {scan.trustScore !== null ? (
                        <TrustScoreBadge score={scan.trustScore} />
                      ) : (
                        <Badge variant="secondary">{scan.status}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{scan.language}</Badge>
                      <div className="flex items-center gap-2 ml-auto">
                        <span className="text-xs text-red-600">{scan.errorCount} errors</span>
                        <span className="text-xs text-yellow-600">{scan.warningCount} warnings</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/history/${scan.id}`}>View Details</Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(scan.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {data && data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {data.pagination.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page >= data.pagination.totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
