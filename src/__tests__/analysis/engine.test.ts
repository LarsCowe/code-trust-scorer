import { describe, it, expect } from "vitest";
import { analyzeCode, type AnalysisResult } from "@/lib/analysis/engine";

describe("Analysis Engine", () => {
  describe("analyzeCode", () => {
    it("should return a valid analysis result", async () => {
      const code = `
        const x = 1;
        const y = 2;
        console.log(x + y);
      `;

      const result = await analyzeCode(code, { language: "typescript" });

      expect(result).toHaveProperty("trustScore");
      expect(result).toHaveProperty("confidence");
      expect(result).toHaveProperty("issues");
      expect(result).toHaveProperty("linesOfCode");
      expect(result).toHaveProperty("analysisTime");
      expect(result).toHaveProperty("metadata");
    });

    it("should calculate trust score between 0 and 100", async () => {
      const code = "const x = 1;";
      const result = await analyzeCode(code, { language: "typescript" });

      expect(result.trustScore).toBeGreaterThanOrEqual(0);
      expect(result.trustScore).toBeLessThanOrEqual(100);
    });

    it("should count lines of code correctly", async () => {
      const code = `line1
line2
line3
line4
line5`;
      const result = await analyzeCode(code, { language: "typescript" });

      expect(result.linesOfCode).toBe(5);
    });

    it("should track analysis time", async () => {
      const code = "const x = 1;";
      const result = await analyzeCode(code, { language: "typescript" });

      expect(result.analysisTime).toBeGreaterThan(0);
    });

    it("should include metadata with language", async () => {
      const code = "const x = 1;";
      const result = await analyzeCode(code, { language: "typescript" });

      expect(result.metadata.language).toBe("typescript");
    });
  });

  describe("Hallucinated API Detection", () => {
    it("should detect Array.flatten (non-existent)", async () => {
      const code = `
        const arr = [1, [2, 3]];
        const flat = arr.flatten();
      `;
      const result = await analyzeCode(code, { language: "javascript" });

      const flattenIssue = result.issues.find(
        (i) => i.ruleId === "hallucination/flatten"
      );
      expect(flattenIssue).toBeDefined();
      expect(flattenIssue?.type).toBe("hallucinated-api");
      expect(flattenIssue?.severity).toBe("error");
    });

    it("should detect String.contains (non-existent)", async () => {
      const code = `
        const str = "hello world";
        const hasHello = str.contains("hello");
      `;
      const result = await analyzeCode(code, { language: "javascript" });

      const containsIssue = result.issues.find(
        (i) => i.ruleId === "hallucination/contains"
      );
      expect(containsIssue).toBeDefined();
      expect(containsIssue?.type).toBe("hallucinated-api");
    });

    it("should detect Array.compact (non-existent)", async () => {
      const code = `
        const arr = [1, null, 2, undefined, 3];
        const clean = arr.compact();
      `;
      const result = await analyzeCode(code, { language: "javascript" });

      const compactIssue = result.issues.find(
        (i) => i.ruleId === "hallucination/compact"
      );
      expect(compactIssue).toBeDefined();
    });

    it("should detect Promise.sleep (non-existent)", async () => {
      const code = `
        async function wait() {
          await Promise.sleep(1000);
        }
      `;
      const result = await analyzeCode(code, { language: "javascript" });

      const sleepIssue = result.issues.find(
        (i) => i.ruleId === "hallucination/sleep"
      );
      expect(sleepIssue).toBeDefined();
    });

    it("should detect Math.clamp (non-existent)", async () => {
      const code = `
        const value = Math.clamp(x, 0, 100);
      `;
      const result = await analyzeCode(code, { language: "javascript" });

      const clampIssue = result.issues.find(
        (i) => i.ruleId === "hallucination/clamp"
      );
      expect(clampIssue).toBeDefined();
    });
  });

  describe("Deprecated Method Detection", () => {
    it("should detect componentWillMount (deprecated)", async () => {
      const code = `
        class MyComponent extends React.Component {
          componentWillMount() {
            this.setState({ loaded: true });
          }
        }
      `;
      const result = await analyzeCode(code, { language: "typescript" });

      const deprecatedIssue = result.issues.find(
        (i) => i.ruleId === "deprecated/componentWillMount"
      );
      expect(deprecatedIssue).toBeDefined();
      expect(deprecatedIssue?.type).toBe("deprecated-method");
      expect(deprecatedIssue?.severity).toBe("warning");
    });

    it("should detect componentWillReceiveProps (deprecated)", async () => {
      const code = `
        class MyComponent extends React.Component {
          componentWillReceiveProps(nextProps) {
            if (nextProps.id !== this.props.id) {
              this.fetchData(nextProps.id);
            }
          }
        }
      `;
      const result = await analyzeCode(code, { language: "typescript" });

      const deprecatedIssue = result.issues.find(
        (i) => i.ruleId === "deprecated/componentWillReceiveProps"
      );
      expect(deprecatedIssue).toBeDefined();
    });

    it("should detect document.write (deprecated)", async () => {
      const code = `
        document.write("<h1>Hello World</h1>");
      `;
      const result = await analyzeCode(code, { language: "javascript" });

      const deprecatedIssue = result.issues.find(
        (i) => i.ruleId === "deprecated/document.write"
      );
      expect(deprecatedIssue).toBeDefined();
    });

    it("should detect escape/unescape (deprecated)", async () => {
      const code = `
        const encoded = escape("hello world");
        const decoded = unescape(encoded);
      `;
      const result = await analyzeCode(code, { language: "javascript" });

      const escapeIssue = result.issues.find(
        (i) => i.ruleId === "deprecated/escape"
      );
      const unescapeIssue = result.issues.find(
        (i) => i.ruleId === "deprecated/unescape"
      );
      expect(escapeIssue).toBeDefined();
      expect(unescapeIssue).toBeDefined();
    });
  });

  describe("Security Issue Detection", () => {
    it("should detect eval() usage", async () => {
      const code = `
        const result = eval("2 + 2");
      `;
      const result = await analyzeCode(code, { language: "javascript" });

      const evalIssue = result.issues.find(
        (i) => i.ruleId === "security/no-eval"
      );
      expect(evalIssue).toBeDefined();
      expect(evalIssue?.type).toBe("security-vulnerability");
      expect(evalIssue?.severity).toBe("error");
    });

    it("should detect innerHTML assignment", async () => {
      const code = `
        element.innerHTML = userInput;
      `;
      const result = await analyzeCode(code, { language: "javascript" });

      const innerHTMLIssue = result.issues.find(
        (i) => i.ruleId === "security/no-inner-html"
      );
      expect(innerHTMLIssue).toBeDefined();
      expect(innerHTMLIssue?.type).toBe("security-vulnerability");
    });

    it("should detect new Function() usage", async () => {
      const code = `
        const fn = new Function("a", "b", "return a + b");
      `;
      const result = await analyzeCode(code, { language: "javascript" });

      const newFunctionIssue = result.issues.find(
        (i) => i.ruleId === "security/no-new-function"
      );
      expect(newFunctionIssue).toBeDefined();
    });

    it("should detect hardcoded secrets", async () => {
      const code = `
        const API_KEY = "sk-1234567890abcdef";
        const password = "supersecret123";
      `;
      const result = await analyzeCode(code, { language: "javascript" });

      const secretIssues = result.issues.filter(
        (i) => i.ruleId === "security/no-hardcoded-secrets"
      );
      expect(secretIssues.length).toBeGreaterThan(0);
    });

    it("should detect localStorage with sensitive keys", async () => {
      const code = `
        localStorage.setItem("password", userPassword);
        localStorage.setItem("token", authToken);
      `;
      const result = await analyzeCode(code, { language: "javascript" });

      const localStorageIssues = result.issues.filter(
        (i) => i.ruleId === "security/no-sensitive-localStorage"
      );
      expect(localStorageIssues.length).toBeGreaterThan(0);
    });

    it("should warn about Math.random() for security purposes", async () => {
      const code = `
        const token = Math.random().toString(36);
      `;
      const result = await analyzeCode(code, { language: "javascript" });

      const randomIssue = result.issues.find(
        (i) => i.ruleId === "security/weak-randomness"
      );
      expect(randomIssue).toBeDefined();
      expect(randomIssue?.severity).toBe("info");
    });
  });

  describe("Quality Issue Detection", () => {
    it("should detect console.log statements", async () => {
      const code = `
        function doSomething() {
          console.log("Debug output");
          return 42;
        }
      `;
      const result = await analyzeCode(code, { language: "javascript" });

      const consoleIssue = result.issues.find(
        (i) => i.ruleId === "quality/no-console-log"
      );
      expect(consoleIssue).toBeDefined();
      expect(consoleIssue?.type).toBe("quality-issue");
    });

    it("should detect debugger statements", async () => {
      const code = `
        function debug() {
          debugger;
          doSomething();
        }
      `;
      const result = await analyzeCode(code, { language: "javascript" });

      const debuggerIssue = result.issues.find(
        (i) => i.ruleId === "quality/no-debugger"
      );
      expect(debuggerIssue).toBeDefined();
    });

    it("should detect TODO/FIXME comments", async () => {
      const code = `
        // TODO: refactor this later
        // FIXME: this is broken
        function broken() {}
      `;
      const result = await analyzeCode(code, { language: "javascript" });

      const todoIssues = result.issues.filter(
        (i) => i.ruleId === "quality/no-todo-comments"
      );
      expect(todoIssues.length).toBeGreaterThan(0);
    });

    it("should detect empty catch blocks", async () => {
      const code = `
        try {
          doSomething();
        } catch (e) {}
      `;
      const result = await analyzeCode(code, { language: "javascript" });

      const catchIssue = result.issues.find(
        (i) => i.ruleId === "quality/no-empty-catch"
      );
      expect(catchIssue).toBeDefined();
    });

    it("should detect explicit any types in TypeScript", async () => {
      const code = `
        function process(data: any): any {
          return data;
        }
      `;
      const result = await analyzeCode(code, { language: "typescript" });

      const anyIssues = result.issues.filter(
        (i) => i.ruleId === "quality/no-explicit-any"
      );
      expect(anyIssues.length).toBeGreaterThan(0);
    });

    it("should detect @ts-ignore comments", async () => {
      const code = `
        // @ts-ignore
        const x: number = "not a number";
      `;
      const result = await analyzeCode(code, { language: "typescript" });

      const tsIgnoreIssue = result.issues.find(
        (i) => i.ruleId === "quality/no-ts-ignore"
      );
      expect(tsIgnoreIssue).toBeDefined();
    });
  });

  describe("Trust Score Calculation", () => {
    it("should return high score for clean code", async () => {
      const code = `
        function add(a: number, b: number): number {
          return a + b;
        }
        
        const result = add(1, 2);
      `;
      const result = await analyzeCode(code, { language: "typescript" });

      expect(result.trustScore).toBeGreaterThanOrEqual(80);
    });

    it("should return lower score for code with issues", async () => {
      const code = `
        // TODO: fix this
        function bad() {
          eval("alert('xss')");
          console.log("debug");
          arr.flatten();
        }
      `;
      const result = await analyzeCode(code, { language: "javascript" });

      expect(result.trustScore).toBeLessThan(80);
    });

    it("should penalize errors more than warnings", async () => {
      // Code with only an error
      const errorCode = `eval("code");`;
      const errorResult = await analyzeCode(errorCode, { language: "javascript" });

      // Code with only a warning
      const warningCode = `componentWillMount() {}`;
      const warningResult = await analyzeCode(warningCode, { language: "javascript" });

      // Error should have lower score (higher penalty)
      expect(errorResult.trustScore).toBeLessThan(warningResult.trustScore);
    });

    it("should count issues by severity", async () => {
      const code = `
        eval("bad");
        componentWillMount() {}
        console.log("info");
      `;
      const result = await analyzeCode(code, { language: "javascript" });

      expect(result.metadata.errorCount).toBeGreaterThanOrEqual(1);
      expect(result.metadata.warningCount).toBeGreaterThanOrEqual(1);
      expect(result.metadata.infoCount).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Framework Detection", () => {
    it("should detect React framework", async () => {
      const code = `
        import React from 'react';
        
        function Component() {
          return <div>Hello</div>;
        }
      `;
      const result = await analyzeCode(code, { language: "tsx" });

      expect(result.metadata.framework).toBe("React");
    });

    it("should detect Next.js framework", async () => {
      const code = `
        import { useRouter } from 'next/router';
        import Link from 'next/link';
        
        export default function Page() {
          const router = useRouter();
          return <Link href="/">Home</Link>;
        }
      `;
      const result = await analyzeCode(code, { language: "tsx" });

      expect(result.metadata.framework).toBe("Next.js");
    });

    it("should detect Express framework", async () => {
      const code = `
        import express from 'express';
        
        const app = express();
        app.get('/', (req, res) => res.send('Hello'));
      `;
      const result = await analyzeCode(code, { language: "javascript" });

      expect(result.metadata.framework).toBe("Express");
    });
  });

  describe("Issue Location", () => {
    it("should provide correct line numbers", async () => {
      const code = `line1
line2
console.log("debug");
line4`;
      const result = await analyzeCode(code, { language: "javascript" });

      const consoleIssue = result.issues.find(
        (i) => i.ruleId === "quality/no-console-log"
      );
      expect(consoleIssue?.line).toBe(3);
    });

    it("should include code snippets", async () => {
      const code = `
        function test() {
          eval("malicious");
        }
      `;
      const result = await analyzeCode(code, { language: "javascript" });

      const evalIssue = result.issues.find(
        (i) => i.ruleId === "security/no-eval"
      );
      expect(evalIssue?.codeSnippet).toBeDefined();
      expect(evalIssue?.codeSnippet).toContain("eval");
    });
  });

  describe("Suggestions", () => {
    it("should provide suggestions for hallucinated APIs", async () => {
      const code = `arr.flatten();`;
      const result = await analyzeCode(code, { language: "javascript" });

      const flattenIssue = result.issues.find(
        (i) => i.ruleId === "hallucination/flatten"
      );
      expect(flattenIssue?.suggestion).toBeDefined();
      expect(flattenIssue?.suggestion).toContain("flat");
    });

    it("should provide suggestions for deprecated methods", async () => {
      const code = `componentWillMount() {}`;
      const result = await analyzeCode(code, { language: "javascript" });

      const deprecatedIssue = result.issues.find(
        (i) => i.ruleId === "deprecated/componentWillMount"
      );
      expect(deprecatedIssue?.suggestion).toBeDefined();
    });

    it("should provide suggestions for security issues", async () => {
      const code = `eval("code")`;
      const result = await analyzeCode(code, { language: "javascript" });

      const evalIssue = result.issues.find(
        (i) => i.ruleId === "security/no-eval"
      );
      expect(evalIssue?.suggestion).toBeDefined();
    });
  });
});
