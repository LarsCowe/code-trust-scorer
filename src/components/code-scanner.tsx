"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createScanSchema, type CreateScanInput } from "@/lib/validations";
import { Scan, Upload, FileCode, AlertCircle } from "lucide-react";

const languageOptions = [
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "tsx", label: "TypeScript JSX" },
  { value: "jsx", label: "JavaScript JSX" },
  { value: "python", label: "Python" },
];

interface CodeScannerProps {
  onScan: (data: CreateScanInput) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

interface FormErrors {
  code?: string;
  language?: string;
  fileName?: string;
}

export function CodeScanner({ onScan, isLoading = false, className }: CodeScannerProps) {
  const [code, setCode] = React.useState("");
  const [language, setLanguage] = React.useState<string>("typescript");
  const [fileName, setFileName] = React.useState("");
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      setCode(text);
      setFileName(file.name);

      // Auto-detect language from file extension
      const ext = file.name.split(".").pop()?.toLowerCase();
      const langMap: Record<string, string> = {
        ts: "typescript",
        tsx: "tsx",
        js: "javascript",
        jsx: "jsx",
        py: "python",
      };
      if (ext && ext in langMap) {
        setLanguage(langMap[ext] ?? "typescript");
      }
    } catch (err) {
      setSubmitError("Failed to read file. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitError(null);

    const data = {
      code,
      language: language as CreateScanInput["language"],
      fileName: fileName || undefined,
    };

    const result = createScanSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string") {
          fieldErrors[field as keyof FormErrors] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      await onScan(result.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred during scanning";
      setSubmitError(errorMessage);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    try {
      const text = await file.text();
      setCode(text);
      setFileName(file.name);

      const ext = file.name.split(".").pop()?.toLowerCase();
      const langMap: Record<string, string> = {
        ts: "typescript",
        tsx: "tsx",
        js: "javascript",
        jsx: "jsx",
        py: "python",
      };
      if (ext && ext in langMap) {
        setLanguage(langMap[ext] ?? "typescript");
      }
    } catch (err) {
      setSubmitError("Failed to read file. Please try again.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const linesOfCode = code.split("\n").length;
  const characters = code.length;

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scan className="h-5 w-5" />
          Code Scanner
        </CardTitle>
        <CardDescription>
          Paste your code or upload a file to analyze it for trust issues
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {submitError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{submitError}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Language"
              options={languageOptions}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              error={errors.language}
            />
            <div className="flex items-end gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".ts,.tsx,.js,.jsx,.py"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
                leftIcon={<Upload className="h-4 w-4" />}
              >
                Upload File
              </Button>
              {fileName && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <FileCode className="h-4 w-4" />
                  {fileName}
                </div>
              )}
            </div>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="relative"
          >
            <Textarea
              label="Code"
              placeholder="Paste your code here or drag and drop a file..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              error={errors.code}
              className="font-mono min-h-[300px] resize-y"
              maxLength={1000000}
              showCount
            />
            {code && (
              <div className="absolute bottom-2 left-3 text-xs text-muted-foreground">
                {linesOfCode} lines • {characters.toLocaleString()} characters
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={!code.trim()}
              leftIcon={<Scan className="h-4 w-4" />}
            >
              Analyze Code
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
