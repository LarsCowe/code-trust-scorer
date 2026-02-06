"use client";

import * as React from "react";
import { cn, getScoreColor, getScoreBgColor } from "@/lib/utils";

interface TrustScoreDisplayProps {
  score: number;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export function TrustScoreDisplay({
  score,
  size = "md",
  showLabel = true,
  animated = true,
  className,
}: TrustScoreDisplayProps) {
  const [displayScore, setDisplayScore] = React.useState(animated ? 0 : score);

  React.useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      return;
    }

    const duration = 1000;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      current = Math.min(Math.round(increment * frame), score);
      setDisplayScore(current);

      if (frame >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score, animated]);

  const sizeClasses = {
    sm: "h-16 w-16 text-lg",
    md: "h-24 w-24 text-2xl",
    lg: "h-32 w-32 text-3xl",
    xl: "h-40 w-40 text-4xl",
  };

  const labelSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  const radius = {
    sm: 28,
    md: 44,
    lg: 60,
    xl: 76,
  };

  const strokeWidth = {
    sm: 4,
    md: 6,
    lg: 8,
    xl: 10,
  };

  const circumference = 2 * Math.PI * radius[size];
  const progress = ((100 - displayScore) / 100) * circumference;

  const getScoreLabel = (score: number): string => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Good";
    if (score >= 60) return "Fair";
    if (score >= 40) return "Poor";
    return "Critical";
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        <svg
          className="transform -rotate-90 w-full h-full"
          viewBox={`0 0 ${(radius[size] + strokeWidth[size]) * 2} ${(radius[size] + strokeWidth[size]) * 2}`}
        >
          {/* Background circle */}
          <circle
            cx={radius[size] + strokeWidth[size]}
            cy={radius[size] + strokeWidth[size]}
            r={radius[size]}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth[size]}
            className="text-muted"
          />
          {/* Progress circle */}
          <circle
            cx={radius[size] + strokeWidth[size]}
            cy={radius[size] + strokeWidth[size]}
            r={radius[size]}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth[size]}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            className={cn(
              "transition-all duration-500 ease-out",
              displayScore >= 80 && "text-green-500",
              displayScore >= 60 && displayScore < 80 && "text-yellow-500",
              displayScore >= 40 && displayScore < 60 && "text-orange-500",
              displayScore < 40 && "text-red-500"
            )}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("font-bold tabular-nums", getScoreColor(displayScore))}>
            {displayScore}
          </span>
        </div>
      </div>
      {showLabel && (
        <div className="text-center">
          <p className={cn("font-medium", getScoreColor(displayScore))}>
            {getScoreLabel(displayScore)}
          </p>
          <p className={cn("text-muted-foreground", labelSizeClasses[size])}>
            Trust Score
          </p>
        </div>
      )}
    </div>
  );
}

interface TrustScoreBarProps {
  score: number;
  showValue?: boolean;
  height?: "sm" | "md" | "lg";
  className?: string;
}

export function TrustScoreBar({
  score,
  showValue = true,
  height = "md",
  className,
}: TrustScoreBarProps) {
  const heightClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className={cn("w-full", className)}>
      {showValue && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-muted-foreground">Trust Score</span>
          <span className={cn("text-sm font-medium", getScoreColor(score))}>
            {score}%
          </span>
        </div>
      )}
      <div className={cn("w-full bg-muted rounded-full overflow-hidden", heightClasses[height])}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            score >= 80 && "bg-green-500",
            score >= 60 && score < 80 && "bg-yellow-500",
            score >= 40 && score < 60 && "bg-orange-500",
            score < 40 && "bg-red-500"
          )}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

interface TrustScoreBadgeProps {
  score: number;
  className?: string;
}

export function TrustScoreBadge({ score, className }: TrustScoreBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium",
        getScoreBgColor(score),
        getScoreColor(score),
        className
      )}
    >
      <span className="tabular-nums">{score}</span>
      <span className="text-xs opacity-75">/ 100</span>
    </div>
  );
}
