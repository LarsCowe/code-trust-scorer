# Glossary of Terms

## Code Trust Scorer

**Last Updated:** 2026-02-06

---

## A

### Abstract Syntax Tree (AST)
A tree representation of the syntactic structure of source code. Used by Code Trust Scorer to analyze code patterns and detect issues.

### AI-Generated Code
Code produced by AI coding assistants like GitHub Copilot, Cursor, or Claude. The primary focus of Code Trust Scorer's analysis.

### Analysis
The process of examining code for issues, calculating trust scores, and generating recommendations.

### API Hallucination
When AI generates calls to APIs, methods, or functions that don't actually exist. Example: `array.flatten()` instead of `array.flat()`.

---

## C

### CI/CD (Continuous Integration/Continuous Deployment)
Automated processes for testing and deploying code. Code Trust Scorer integrates with CI/CD pipelines via GitHub Actions.

### Confidence Score
A percentage (0-100%) indicating how certain the system is about a detected issue. Higher confidence means higher certainty.

### Conventional Commits
A specification for adding human and machine-readable meaning to commit messages (e.g., `feat:`, `fix:`, `docs:`).

---

## D

### Deprecated Method
A method or API that is no longer recommended for use and may be removed in future versions. AI models often suggest deprecated patterns due to training data age.

### Detection Rule
A specific check performed by the analysis engine. Each rule has an ID, severity, and implementation.

---

## F

### False Positive
When the system incorrectly identifies code as problematic when it's actually correct. A key quality metric for Code Trust Scorer.

### Free Tier
The no-cost plan for individual developers, limited to 100 file analyses per month.

---

## H

### Hallucination
In the context of AI, when a model generates information that is plausible-sounding but factually incorrect. See "API Hallucination."

### Harness Engineering
A term coined by Mitchell Hashimoto describing the practice of building verification systems around AI-generated code.

---

## I

### Issue
A problem detected in code by the analysis engine. Issues have a type, severity, confidence score, and suggested fix.

### Issue Severity
The importance level of a detected issue:
- **Error**: Critical issue that must be fixed
- **Warning**: Significant issue that should be addressed
- **Info**: Minor issue or suggestion

---

## L

### LOC (Lines of Code)
A metric for measuring code size. Used in performance benchmarks and pricing tiers.

---

## P

### Pro Tier
The paid plan at $39/user/month with unlimited analyses and team features.

### Project
A collection of code (typically a repository) registered for analysis in Code Trust Scorer.

---

## R

### Rule Engine
The component that executes detection rules against parsed code and collects issues.

---

## S

### SSO (Single Sign-On)
Enterprise authentication feature allowing users to log in with their organization's identity provider.

### Static Analysis
Examining code without executing it. Code Trust Scorer uses static analysis to detect issues.

---

## T

### Trust Score
A composite score from 0-100 indicating overall code quality and reliability. Higher scores indicate more trustworthy code.

**Score Ranges:**
- **90-100**: Excellent - minimal or no issues
- **70-89**: Good - minor issues present
- **50-69**: Fair - review recommended
- **30-49**: Poor - significant issues
- **0-29**: Critical - major problems detected

### tree-sitter
A parser generator tool used by Code Trust Scorer to parse source code into ASTs.

### tRPC
A TypeScript-first RPC framework used for the Code Trust Scorer API.

---

## V

### VS Code Extension
The Visual Studio Code integration that provides real-time code analysis as developers write code.

---

## W

### Webhook
An HTTP callback that notifies external systems of events. Used for GitHub integration and CI/CD pipelines.

---

## Acronyms Quick Reference

| Acronym | Full Term |
|---------|-----------|
| API | Application Programming Interface |
| AST | Abstract Syntax Tree |
| CI/CD | Continuous Integration/Continuous Deployment |
| CTS | Code Trust Scorer |
| LOC | Lines of Code |
| PR | Pull Request |
| RBAC | Role-Based Access Control |
| SSO | Single Sign-On |
| tRPC | TypeScript Remote Procedure Call |
| UX | User Experience |
| WCAG | Web Content Accessibility Guidelines |
