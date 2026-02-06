"use client";

import * as React from "react";
import { cn, getSeverityColor, getSeverityBgColor } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Lightbulb,
} from "lucide-react";

type IssueType =
  | "hallucinated-api"
  | "deprecated-method"
  | "security-vulnerability"
  | "quality-issue"
  | "style-issue";

type Severity = "error" | "warning" | "info";

interface Issue {
  id: string;
  type: IssueType;
  severity: Severity;
  message: string;
  suggestion?: string | null;
  line: number;
  column: number;
  codeSnippet?: string | null;
  ruleId: string;
  confidence: number;
}

interface IssueCardProps {
  issue: Issue;
  expanded?: boolean;
  onToggleExpand?: () => void;
  showCode?: boolean;
  className?: string;
}

const severityIcons = {
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const issueTypeLabels: Record<IssueType, string> = {
  "hallucinated-api": "Hallucinated API",
  "deprecated-method": "Deprecated Method",
  "security-vulnerability": "Security Issue",
  "quality-issue": "Quality Issue",
  "style-issue": "Style Issue",
};

export function IssueCard({
  issue,
  expanded: controlledExpanded,
  onToggleExpand,
  showCode = true,
  className,
}: IssueCardProps) {
  const [internalExpanded, setInternalExpanded] = React.useState(false);
  const expanded = controlledExpanded ?? internalExpanded;

  const handleToggle = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  const SeverityIcon = severityIcons[issue.severity];
  const confidencePercent = Math.round(Number(issue.confidence) * 100);

  const handleCopyCode = async () => {
    if (issue.codeSnippet) {
      try {
        await navigator.clipboard.writeText(issue.codeSnippet);
      } catch (err) {
        // Clipboard API failed silently
      }
    }
  };

  return (
    <Card
      className={cn(
        "transition-shadow hover:shadow-md",
        issue.severity === "error" && "border-l-4 border-l-red-500",
        issue.severity === "warning" && "border-l-4 border-l-yellow-500",
        issue.severity === "info" && "border-l-4 border-l-blue-500",
        className
      )}
    >
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className={cn(
                "p-2 rounded-lg shrink-0",
                getSeverityBgColor(issue.severity)
              )}
            >
              <SeverityIcon
                className={cn("h-4 w-4", getSeverityColor(issue.severity))}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant={
                    issue.severity === "error"
                      ? "error"
                      : issue.severity === "warning"
                      ? "warning"
                      : "info"
                  }
                >
                  {issue.severity}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {issueTypeLabels[issue.type]}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Line {issue.line}:{issue.column}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium">{issue.message}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggle}
            className="shrink-0"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="p-4 pt-4 space-y-4">
          {/* Confidence */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Confidence:</span>
            <div className="flex items-center gap-1">
              <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full",
                    confidencePercent >= 80 && "bg-green-500",
                    confidencePercent >= 60 && confidencePercent < 80 && "bg-yellow-500",
                    confidencePercent < 60 && "bg-orange-500"
                  )}
                  style={{ width: `${confidencePercent}%` }}
                />
              </div>
              <span className="text-muted-foreground">{confidencePercent}%</span>
            </div>
          </div>

          {/* Code snippet */}
          {showCode && issue.codeSnippet && (
            <div className="relative">
              <div className="absolute right-2 top-2 z-10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyCode}
                  className="h-7 px-2"
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
              <pre className="p-4 bg-muted/50 rounded-lg overflow-x-auto text-sm">
                <code>{issue.codeSnippet}</code>
              </pre>
            </div>
          )}

          {/* Suggestion */}
          {issue.suggestion && (
            <div className="flex gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <Lightbulb className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Suggestion
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                  {issue.suggestion}
                </p>
              </div>
            </div>
          )}

          {/* Rule ID and docs link */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Rule: {issue.ruleId}</span>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs">
              <ExternalLink className="h-3 w-3 mr-1" />
              View documentation
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

interface IssueListProps {
  issues: Issue[];
  emptyMessage?: string;
  className?: string;
}

export function IssueList({
  issues,
  emptyMessage = "No issues found",
  className,
}: IssueListProps) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  if (issues.length === 0) {
    return (
      <div className={cn("text-center py-8 text-muted-foreground", className)}>
        {emptyMessage}
      </div>
    );
  }

  // Sort issues by severity
  const sortedIssues = [...issues].sort((a, b) => {
    const severityOrder: Record<Severity, number> = { error: 0, warning: 1, info: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  return (
    <div className={cn("space-y-3", className)}>
      {sortedIssues.map((issue) => (
        <IssueCard
          key={issue.id}
          issue={issue}
          expanded={expandedId === issue.id}
          onToggleExpand={() =>
            setExpandedId(expandedId === issue.id ? null : issue.id)
          }
        />
      ))}
    </div>
  );
}
