"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CodeScanner } from "@/components/code-scanner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrustScoreDisplay } from "@/components/trust-score-display";
import { IssueList } from "@/components/issue-card";
import { type CreateScanInput } from "@/lib/validations";
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Clock,
  FileCode,
  ArrowRight,
} from "lucide-react";

interface Issue {
  id: string;
  type: "hallucinated-api" | "deprecated-method" | "security-vulnerability" | "quality-issue" | "style-issue";
  severity: "error" | "warning" | "info";
  message: string;
  suggestion: string | null;
  line: number;
  column: number;
  codeSnippet: string | null;
  ruleId: string;
  confidence: number;
}

interface ScanResult {
  scan: {
    id: string;
    trustScore: number;
    status: string;
    language: string;
    linesOfCode: number;
    errorCount: number;
    warningCount: number;
    infoCount: number;
  };
  issues: Issue[];
  analysis: {
    trustScore: number;
    confidence: number;
    linesOfCode: number;
    analysisTime: number;
    metadata: {
      language: string;
      framework?: string;
      errorCount: number;
      warningCount: number;
      infoCount: number;
    };
  };
}

async function createScan(data: CreateScanInput): Promise<ScanResult> {
  const response = await fetch("/api/scans", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json() as { message?: string };
    throw new Error(error.message ?? "Failed to create scan");
  }

  return response.json() as Promise<ScanResult>;
}

export default function ScannerPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [result, setResult] = React.useState<ScanResult | null>(null);

  const mutation = useMutation({
    mutationFn: createScan,
    onSuccess: (data) => {
      setResult(data);
      void queryClient.invalidateQueries({ queryKey: ["scans"] });
    },
  });

  const handleScan = async (data: CreateScanInput): Promise<void> => {
    setResult(null);
    await mutation.mutateAsync(data);
  };

  const handleViewDetails = () => {
    if (result?.scan.id) {
      router.push(`/history/${result.scan.id}`);
    }
  };

  const handleNewScan = () => {
    setResult(null);
    mutation.reset();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Code Scanner</h1>
        <p className="text-muted-foreground">
          Analyze your code for AI-specific issues and get a trust score
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Scanner Form */}
        <div>
          <CodeScanner
            onScan={handleScan}
            isLoading={mutation.isPending}
          />
        </div>

        {/* Results Panel */}
        <div>
          {mutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Analysis Failed</AlertTitle>
              <AlertDescription>
                {mutation.error instanceof Error
                  ? mutation.error.message
                  : "An error occurred during analysis"}
              </AlertDescription>
            </Alert>
          )}

          {result && (
            <div className="space-y-6 animate-slide-up">
              {/* Score Card */}
              <Card>
                <CardHeader className="pb-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Analysis Complete
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {result.analysis.metadata.framework && (
                          <Badge variant="outline" className="mr-2">
                            {result.analysis.metadata.framework}
                          </Badge>
                        )}
                        <Badge variant="outline">{result.scan.language}</Badge>
                      </CardDescription>
                    </div>
                    <TrustScoreDisplay
                      score={result.scan.trustScore}
                      size="lg"
                      showLabel
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <FileCode className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-2xl font-bold">{result.scan.linesOfCode}</p>
                      <p className="text-xs text-muted-foreground">Lines</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                      <AlertCircle className="h-5 w-5 mx-auto mb-1 text-red-500" />
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {result.scan.errorCount}
                      </p>
                      <p className="text-xs text-muted-foreground">Errors</p>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                      <AlertTriangle className="h-5 w-5 mx-auto mb-1 text-yellow-500" />
                      <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {result.scan.warningCount}
                      </p>
                      <p className="text-xs text-muted-foreground">Warnings</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                      <Info className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {result.scan.infoCount}
                      </p>
                      <p className="text-xs text-muted-foreground">Info</p>
                    </div>
                  </div>

                  {/* Analysis time */}
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                    <Clock className="h-4 w-4" />
                    Analyzed in {result.analysis.analysisTime.toFixed(0)}ms
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button onClick={handleNewScan} variant="outline" className="flex-1">
                      New Scan
                    </Button>
                    <Button onClick={handleViewDetails} className="flex-1">
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Issues List */}
              {result.issues.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Issues Found ({result.issues.length})</CardTitle>
                    <CardDescription>
                      Click an issue to expand and see details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <IssueList
                      issues={result.issues}
                      emptyMessage="No issues found - great job!"
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {!result && !mutation.isPending && !mutation.isError && (
            <Card className="h-full flex items-center justify-center min-h-[400px]">
              <CardContent className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <FileCode className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <CardTitle className="mb-2">Ready to Analyze</CardTitle>
                <CardDescription>
                  Paste your code or upload a file to get started
                </CardDescription>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
