"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  hint?: string;
  maxLength?: number;
  showCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, hint, maxLength, showCount = false, id, value, ...props }, ref) => {
    const textareaId = id ?? React.useId();
    const currentLength = typeof value === "string" ? value.length : 0;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            id={textareaId}
            className={cn(
              "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y",
              error && "border-destructive focus-visible:ring-destructive",
              className
            )}
            ref={ref}
            maxLength={maxLength}
            value={value}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
            {...props}
          />
        </div>
        <div className="flex justify-between items-center">
          <div>
            {error && (
              <p
                id={`${textareaId}-error`}
                className="flex items-center gap-1 text-sm text-destructive"
              >
                <AlertCircle className="h-3.5 w-3.5" />
                {error}
              </p>
            )}
            {hint && !error && (
              <p
                id={`${textareaId}-hint`}
                className="text-sm text-muted-foreground"
              >
                {hint}
              </p>
            )}
          </div>
          {showCount && maxLength && (
            <span className={cn(
              "text-xs text-muted-foreground",
              currentLength > maxLength * 0.9 && "text-yellow-600 dark:text-yellow-400",
              currentLength >= maxLength && "text-red-600 dark:text-red-400"
            )}>
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
