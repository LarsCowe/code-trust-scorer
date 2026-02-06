# Epics & User Stories

## Code Trust Scorer

**Document Version:** 1.0  
**Last Updated:** 2026-02-06  
**Author:** Product Team  
**Status:** Draft

---

## Table of Contents

1. [Epic Overview](#1-epic-overview)
2. [Epic 1: Core Analysis Engine](#2-epic-1-core-analysis-engine)
3. [Epic 2: User Authentication](#3-epic-2-user-authentication)
4. [Epic 3: Dashboard & Reporting](#4-epic-3-dashboard--reporting)
5. [Epic 4: API Integration](#5-epic-4-api-integration)
6. [Epic 5: Settings & Preferences](#6-epic-5-settings--preferences)
7. [Epic 6: VS Code Extension](#7-epic-6-vs-code-extension)
8. [Sprint Planning](#8-sprint-planning)

---

## 1. Epic Overview

### 1.1 Epic Summary

| Epic | Title | Stories | Points | Priority |
|------|-------|---------|--------|----------|
| E1 | Core Analysis Engine | 12 | 89 | P0 |
| E2 | User Authentication | 10 | 55 | P0 |
| E3 | Dashboard & Reporting | 14 | 76 | P0 |
| E4 | API Integration | 11 | 68 | P1 |
| E5 | Settings & Preferences | 9 | 42 | P1 |
| E6 | VS Code Extension | 10 | 58 | P0 |
| **Total** | | **66** | **388** | |

### 1.2 Epic Dependencies

```
┌─────────────────────────────────────────────────────────────────────┐
│                       EPIC DEPENDENCIES                              │
└─────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────┐
                    │  E1: Analysis   │
                    │    Engine       │
                    └────────┬────────┘
                             │
                             │ depends on
                             ▼
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
   │ E2: Auth    │   │ E3: Dash    │   │ E6: VS Code │
   └──────┬──────┘   └──────┬──────┘   └──────┬──────┘
          │                  │                  │
          │                  │                  │
          ▼                  ▼                  │
   ┌─────────────┐   ┌─────────────┐            │
   │ E5: Settings│   │ E4: API     │◀───────────┘
   └─────────────┘   └─────────────┘
```

### 1.3 Release Plan

| Release | Epics | Target Date | Milestone |
|---------|-------|-------------|-----------|
| Alpha | E1, E2 (partial) | Week 4 | Internal testing |
| Beta | E1, E2, E3, E6 (partial) | Week 10 | Closed beta |
| v1.0 | E1-E6 | Week 17 | Public launch |

---

## 2. Epic 1: Core Analysis Engine

### 2.1 Epic Description

**Goal:** Build the core code analysis engine that can parse TypeScript, JavaScript, and Python code, detect AI-specific issues, and calculate trust scores.

**Business Value:** This is the foundation of the entire product. Without a reliable, accurate analysis engine, there is no value proposition.

**Success Criteria:**
- Analysis completes in <5 seconds for files under 1000 LOC
- Hallucination detection accuracy >85%
- False positive rate <15%
- Support for TypeScript, JavaScript, and Python

### 2.2 User Stories

#### Story E1-1: Parse TypeScript Code

**As a** developer  
**I want to** have my TypeScript code parsed correctly  
**So that** the analyzer can understand my code structure

**Story Points:** 8

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Parser accepts .ts files | Unit test with sample .ts |
| 2 | Parser accepts .tsx files | Unit test with sample .tsx |
| 3 | Parser handles modern syntax (ES2024+) | Test with optional chaining, nullish coalescing |
| 4 | Parser produces valid AST | AST structure validation |
| 5 | Parser handles syntax errors gracefully | Test with malformed code |
| 6 | Parsing completes in <100ms for 1000 LOC | Performance benchmark |

**Technical Notes:**
- Use tree-sitter-typescript for parsing
- Cache parsed ASTs for incremental analysis
- Return structured errors for syntax issues

---

#### Story E1-2: Parse JavaScript Code

**As a** developer  
**I want to** have my JavaScript code parsed correctly  
**So that** I can analyze both JS and TS projects

**Story Points:** 5

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Parser accepts .js files | Unit test with sample .js |
| 2 | Parser accepts .jsx files | Unit test with sample .jsx |
| 3 | Parser handles ESM and CJS | Test with import/require |
| 4 | Parser produces valid AST | AST structure validation |
| 5 | Parser handles dynamic imports | Test with import() |

**Technical Notes:**
- Reuse tree-sitter infrastructure from TypeScript
- Detect module type (ESM vs CJS) automatically

---

#### Story E1-3: Parse Python Code

**As a** Python developer  
**I want to** have my Python code parsed correctly  
**So that** I can get trust scores for Python projects

**Story Points:** 8

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Parser accepts .py files | Unit test with sample .py |
| 2 | Parser handles Python 3.8+ syntax | Test with walrus operator, etc. |
| 3 | Parser handles type hints | Test with typed Python |
| 4 | Parser produces valid AST | AST structure validation |
| 5 | Parser handles indentation correctly | Test with nested blocks |

**Technical Notes:**
- Use tree-sitter-python for parsing
- Support common Python patterns (decorators, comprehensions)

---

#### Story E1-4: Detect Hallucinated APIs

**As a** developer  
**I want to** be alerted when code calls non-existent APIs  
**So that** I can fix AI hallucinations quickly

**Story Points:** 13

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Detect non-existent array methods | Test with Array.flatten() |
| 2 | Detect wrong method signatures | Test with incorrect args |
| 3 | Detect non-existent npm packages | Test with fake imports |
| 4 | Provide suggestions for correct APIs | Verify suggestions |
| 5 | Detection accuracy >85% | Benchmark against test set |
| 6 | False positive rate <15% | Measure false positives |

**Technical Notes:**
- Maintain knowledge base of standard library APIs
- Use npm registry for package validation
- Implement fuzzy matching for suggestions

**Test Cases:**

```typescript
// Should detect: Array.flatten doesn't exist
const flat = array.flatten(); // Suggest: array.flat()

// Should detect: Wrong signature
JSON.parse(obj, null, 2); // parse() doesn't take 3 args

// Should detect: Non-existent lodash method
_.deepMerge(a, b); // Suggest: _.merge() or _.mergeWith()

// Should detect: Non-existent React hook
useLayoutState(initialValue); // Suggest: useState or useLayoutEffect
```

**Definition of Done:**
- [ ] All acceptance criteria met
- [ ] Code coverage >80%
- [ ] Performance benchmarks passing
- [ ] Documentation updated
- [ ] PR reviewed and approved
- [ ] Deployed to staging environment

// Should NOT detect: Valid custom method
myArray.customMethod(); // Could be user-defined
```

---

#### Story E1-5: Detect Deprecated Methods

**As a** developer  
**I want to** be warned about deprecated API usage  
**So that** I can use modern alternatives

**Story Points:** 8

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Detect deprecated React lifecycle | componentWillMount, etc. |
| 2 | Detect deprecated Node.js APIs | url.parse, etc. |
| 3 | Detect deprecated browser APIs | document.write, etc. |
| 4 | Include deprecation version info | Verify metadata |
| 5 | Suggest modern alternatives | Verify suggestions |
| 6 | Link to migration documentation | Verify links work |

**Technical Notes:**
- Maintain deprecation database per library/framework
- Include version information (deprecated since X)
- Update database as libraries evolve

**Test Cases:**

```typescript
// Should warn: Deprecated React lifecycle
componentWillMount() { }
// Suggest: Use useEffect hook or componentDidMount

// Should warn: Deprecated Node.js API
const parsed = require('url').parse(myUrl);
// Suggest: Use new URL() constructor
```

---

#### Story E1-6: Detect Security Vulnerabilities

**As a** developer  
**I want to** be warned about security issues  
**So that** I can write secure code

**Story Points:** 13

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Detect SQL injection patterns | Test with string concat |
| 2 | Detect XSS vulnerabilities | innerHTML, etc. |
| 3 | Detect hardcoded credentials | passwords, API keys |
| 4 | Detect insecure randomness | Math.random for security |
| 5 | Detect path traversal | File path concatenation |
| 6 | Provide remediation guidance | Verify guidance |
| 7 | Severity classification | Critical, High, Medium, Low |

**Technical Notes:**
- Implement pattern matching for common vulnerabilities
- Use taint analysis for data flow issues
- Reference OWASP Top 10

**Test Cases:**

```typescript
// Should detect: SQL injection
const query = `SELECT * FROM users WHERE id = ${userId}`;
// Severity: Critical
// Fix: Use parameterized queries

// Should detect: XSS
element.innerHTML = userInput;
// Severity: High
// Fix: Use textContent or sanitize input

// Should detect: Hardcoded secret
const API_KEY = "sk-1234567890abcdef";
// Severity: Critical
// Fix: Use environment variables
```

---

#### Story E1-7: Calculate Trust Score

**As a** developer  
**I want to** see a single trust score for my code  
**So that** I can quickly assess overall quality

**Story Points:** 8

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Score is 0-100 | Validate range |
| 2 | Score decreases with issues | Test with various issue counts |
| 3 | Severity affects score | Errors > Warnings > Info |
| 4 | Confidence affects weight | High conf > Low conf |
| 5 | Score includes breakdown | By category |
| 6 | Score has confidence interval | ±X points |

**Scoring Algorithm:**

```typescript
function calculateTrustScore(issues: Issue[]): TrustScore {
  let score = 100;
  
  for (const issue of issues) {
    const severityWeight = {
      error: 15,
      warning: 5,
      info: 1,
    }[issue.severity];
    
    const penalty = severityWeight * issue.confidence;
    score -= penalty;
  }
  
  return {
    score: Math.max(0, Math.min(100, score)),
    breakdown: calculateBreakdown(issues),
    confidence: calculateConfidence(issues),
  };
}
```

---

#### Story E1-8: Detect Over-Abstraction

**As a** developer  
**I want to** be warned about overly complex code  
**So that** I can simplify AI-generated patterns

**Story Points:** 5

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Detect excessive nesting | >4 levels deep |
| 2 | Detect unnecessary factories | Simple case over-engineered |
| 3 | Detect unused type parameters | Generic for no reason |
| 4 | Severity is "info" level | Not errors |
| 5 | Suggest simplifications | Provide alternatives |

---

#### Story E1-9: Batch Analysis

**As a** developer or CI system  
**I want to** analyze multiple files at once  
**So that** I can check entire projects

**Story Points:** 8

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Accept directory path | Test with dir input |
| 2 | Respect .gitignore | Don't analyze ignored files |
| 3 | Support glob patterns | *.ts, src/**/*.tsx |
| 4 | Parallel execution | Verify parallelization |
| 5 | Complete in <60s for 100 files | Performance test |
| 6 | Aggregate results | Summary + per-file |

---

#### Story E1-10: Incremental Analysis

**As a** developer  
**I want** only changed code to be analyzed  
**So that** repeated analyses are fast

**Story Points:** 5

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Detect file changes | Compare hash/timestamp |
| 2 | Cache unchanged results | Verify cache hit |
| 3 | 5x faster than full analysis | Benchmark |
| 4 | Manual cache invalidation | Cache clear command |
| 5 | Cache expiry after 24h | Verify expiry |

---

#### Story E1-11: Framework Detection

**As a** developer  
**I want** the analyzer to understand my framework  
**So that** framework-specific issues are caught

**Story Points:** 5

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Detect Next.js projects | Check package.json |
| 2 | Detect React projects | Check dependencies |
| 3 | Detect Node.js projects | Check file patterns |
| 4 | Apply framework rules | Framework-specific checks |
| 5 | Report detected framework | Include in metadata |

---

#### Story E1-12: Rule Engine

**As a** developer  
**I want** a flexible rule engine  
**So that** new rules can be added easily

**Story Points:** 8

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Rules are configurable | Enable/disable |
| 2 | Rules have metadata | ID, severity, description |
| 3 | Rules are composable | Combine multiple checks |
| 4 | Rules support AST patterns | Pattern matching |
| 5 | New rules require no code changes | Config-based |

---

### 2.3 Epic 1 Summary

| Metric | Value |
|--------|-------|
| Total Stories | 12 |
| Total Points | 89 |
| Priority | P0 |
| Dependencies | None |
| Target Completion | Week 6 |

---

## 3. Epic 2: User Authentication

### 3.1 Epic Description

**Goal:** Implement secure user authentication with email/password and OAuth providers, including session management and account security features.

**Business Value:** User accounts enable personalization, team features, and monetization. Secure authentication builds trust.

**Success Criteria:**
- Users can sign up and sign in securely
- GitHub OAuth integration works seamlessly
- Sessions are managed securely
- Password reset flow is reliable

### 3.2 User Stories

#### Story E2-1: Sign Up with Email

**As a** new user  
**I want to** create an account with my email  
**So that** I can access Code Trust Scorer

**Story Points:** 8

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Form validates email format | Invalid email rejected |
| 2 | Password requires 8+ chars | Short password rejected |
| 3 | Password requires letter + number | Weak password rejected |
| 4 | Email verification sent | Check email delivery |
| 5 | Account pending until verified | Can't login before verify |
| 6 | Duplicate email prevented | Error on existing email |

---

#### Story E2-2: Sign Up with GitHub

**As a** developer  
**I want to** sign up using my GitHub account  
**So that** I can get started quickly

**Story Points:** 8

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | "Continue with GitHub" button | Button exists |
| 2 | OAuth redirects correctly | Flow completes |
| 3 | Minimal permissions requested | Only email, profile |
| 4 | Account created automatically | User exists in DB |
| 5 | GitHub username linked | Can see in profile |
| 6 | Email/password can be added later | Settings option |

---

#### Story E2-3: Sign In

**As a** registered user  
**I want to** sign in to my account  
**So that** I can access my projects

**Story Points:** 5

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Email/password login works | Valid creds succeed |
| 2 | GitHub login works | OAuth flow succeeds |
| 3 | "Remember me" extends session | 30-day session |
| 4 | Generic error on failure | No user enumeration |
| 5 | Rate limiting on failures | 5 attempts, then lock |

---

#### Story E2-4: Password Reset

**As a** user who forgot password  
**I want to** reset via email  
**So that** I can regain access

**Story Points:** 5

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Reset link in email | Email contains link |
| 2 | Link expires in 1 hour | Expired link fails |
| 3 | New password required | Can set new password |
| 4 | Old sessions invalidated | Previous sessions end |
| 5 | Confirmation shown | Success message |

---

#### Story E2-5: Email Verification

**As a** user  
**I want to** verify my email  
**So that** I can fully use my account

**Story Points:** 3

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Verification email sent | Check delivery |
| 2 | Click link verifies | Status updates |
| 3 | Can resend verification | Resend button works |
| 4 | Link expires in 24h | Expired link fails |

---

#### Story E2-6: Session Management

**As a** user  
**I want to** manage my sessions  
**So that** I can secure my account

**Story Points:** 5

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | View all sessions | List shows sessions |
| 2 | See device and location | Metadata displayed |
| 3 | Revoke individual sessions | Single logout works |
| 4 | Revoke all other sessions | Mass logout works |
| 5 | Session timeout after 7 days | Auto-expire |
| 6 | Max 10 concurrent sessions | Oldest removed |

---

#### Story E2-7: Sign Out

**As a** user  
**I want to** sign out securely  
**So that** my session is ended

**Story Points:** 2

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Session cookie cleared | Cookie removed |
| 2 | Server session invalidated | Token invalid |
| 3 | Redirect to home | Back to landing |
| 4 | No cached data accessible | Private pages blocked |

---

#### Story E2-8: Account Deletion

**As a** user  
**I want to** delete my account  
**So that** my data is removed

**Story Points:** 5

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Confirmation required | Must type "DELETE" |
| 2 | Password verification | Must enter password |
| 3 | 30-day grace period | Can recover within 30 days |
| 4 | All data deleted after grace | Verify deletion |
| 5 | Email confirmation sent | Deletion notice |

---

#### Story E2-9: Change Password

**As a** user  
**I want to** change my password  
**So that** I can update my security

**Story Points:** 3

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Current password required | Must verify |
| 2 | New password validated | Strength check |
| 3 | Can't reuse last 5 passwords | History checked |
| 4 | All sessions invalidated | Re-login required |

---

#### Story E2-10: Two-Factor Authentication (Future)

**As a** security-conscious user  
**I want to** enable 2FA  
**So that** my account is more secure

**Story Points:** 11

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | TOTP setup with QR code | Can scan in app |
| 2 | Backup codes generated | 10 codes shown |
| 3 | 2FA required on login | Must enter code |
| 4 | Can disable 2FA | With password |
| 5 | Recovery via backup codes | Backup code works |

**Note:** Scheduled for post-MVP.

---

### 3.3 Epic 2 Summary

| Metric | Value |
|--------|-------|
| Total Stories | 10 |
| Total Points | 55 |
| Priority | P0 |
| Dependencies | None |
| Target Completion | Week 8 |

---

## 4. Epic 3: Dashboard & Reporting

### 4.1 Epic Description

**Goal:** Build the web dashboard for viewing analysis results, managing projects, and generating reports.

**Business Value:** The dashboard is how most users interact with Code Trust Scorer. It needs to be fast, intuitive, and provide actionable insights.

**Success Criteria:**
- Dashboard loads in <2 seconds
- Users can view and manage analyses
- Reports can be generated and exported
- Trends are visualized clearly

### 4.2 User Stories

#### Story E3-1: Dashboard Overview

**As a** user  
**I want to** see an overview of my code quality  
**So that** I can quickly assess my status

**Story Points:** 8

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Overall trust score displayed | Large, prominent |
| 2 | Trend chart (7 days) | Visual chart |
| 3 | Issue summary by severity | Counts visible |
| 4 | Recent analyses list | Last 5 analyses |
| 5 | Quick actions available | Run analysis, etc. |
| 6 | Loads in <2 seconds | Performance test |

---

#### Story E3-2: Project List

**As a** user  
**I want to** see all my projects  
**So that** I can navigate to them

**Story Points:** 5

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | List shows all projects | All projects visible |
| 2 | Each shows name and score | Info displayed |
| 3 | Can sort by name, score, date | Sort options work |
| 4 | Can filter by status | Filter options work |
| 5 | Click navigates to project | Navigation works |

---

#### Story E3-3: Project Details

**As a** user  
**I want to** see details for a project  
**So that** I can understand its quality

**Story Points:** 8

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Project name and score shown | Header info |
| 2 | Score breakdown by category | Pie/bar chart |
| 3 | Recent analyses listed | Last 10 |
| 4 | Trend over time | Line chart |
| 5 | Tab navigation (Overview/Analyses/Issues/Settings) | Tabs work |

---

#### Story E3-4: Analysis List

**As a** user  
**I want to** see all analyses for a project  
**So that** I can track history

**Story Points:** 5

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | List shows all analyses | Paginated list |
| 2 | Each shows date, score, file count | Info displayed |
| 3 | Status indicators (complete, failed) | Icons visible |
| 4 | Can filter by date range | Date picker works |
| 5 | Click navigates to details | Navigation works |

---

#### Story E3-5: Analysis Details

**As a** user  
**I want to** see details of an analysis  
**So that** I can review specific issues

**Story Points:** 8

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Summary with score shown | Header info |
| 2 | Files analyzed listed | File tree |
| 3 | Issues grouped by file | Collapsible sections |
| 4 | Click file shows issues | Drill down works |
| 5 | Code snippets with highlighting | Syntax highlighted |

---

#### Story E3-6: Issue List

**As a** user  
**I want to** see all issues for a project  
**So that** I can prioritize fixes

**Story Points:** 5

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | List shows all issues | Paginated list |
| 2 | Can filter by severity | Filter works |
| 3 | Can filter by type | Filter works |
| 4 | Can search by file/message | Search works |
| 5 | Click shows details | Navigation works |

---

#### Story E3-7: Issue Details

**As a** user  
**I want to** see details of an issue  
**So that** I can understand and fix it

**Story Points:** 5

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Full description shown | Text visible |
| 2 | Code snippet with highlight | Highlighted line |
| 3 | Fix suggestion shown | Suggestion visible |
| 4 | Links to documentation | Links work |
| 5 | "Ignore" option available | Can ignore |

---

#### Story E3-8: Create Project

**As a** user  
**I want to** create a new project  
**So that** I can start analyzing code

**Story Points:** 5

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Form for name, description | Fields exist |
| 2 | Optional GitHub repo connection | Can connect |
| 3 | Validation for required fields | Errors shown |
| 4 | Success redirects to project | Navigation works |
| 5 | Cancel returns to list | Cancel works |

---

#### Story E3-9: Delete Project

**As a** user  
**I want to** delete a project  
**So that** I can remove old projects

**Story Points:** 3

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Confirmation dialog shown | Must confirm |
| 2 | Typing project name required | Extra safety |
| 3 | All data deleted | DB cleaned |
| 4 | Redirect to project list | Navigation works |

---

#### Story E3-10: View Trends

**As a** user  
**I want to** see quality trends over time  
**So that** I can track improvement

**Story Points:** 5

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Time range selector | 7d, 30d, 90d, 1y |
| 2 | Trust score line chart | Chart renders |
| 3 | Issue count over time | Secondary chart |
| 4 | Hover shows details | Tooltips work |
| 5 | Export as image | Download works |

---

#### Story E3-11: Compare Branches

**As a** user  
**I want to** compare trust scores between branches  
**So that** I can review PR quality

**Story Points:** 5

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Select base branch | Dropdown works |
| 2 | Select compare branch | Dropdown works |
| 3 | Show score delta | Diff displayed |
| 4 | Show new/resolved issues | Lists shown |
| 5 | Link to file comparisons | Navigation works |

---

#### Story E3-12: Generate Report

**As a** manager  
**I want to** generate quality reports  
**So that** I can share with stakeholders

**Story Points:** 8

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Select date range | Date picker |
| 2 | Select projects | Multi-select |
| 3 | Preview report | In-browser preview |
| 4 | Export as PDF | Download works |
| 5 | Export as CSV | Download works |

---

#### Story E3-13: Team Dashboard

**As a** team admin  
**I want to** see team-wide metrics  
**So that** I can manage quality

**Story Points:** 8

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Team trust score shown | Aggregate score |
| 2 | Per-member breakdown | Bar chart |
| 3 | Per-project breakdown | Bar chart |
| 4 | Trend over time | Line chart |
| 5 | Top issues across team | Ranked list |

---

#### Story E3-14: Responsive Design

**As a** user  
**I want** the dashboard to work on tablet  
**So that** I can check quality on the go

**Story Points:** 5

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Works on 768px+ screens | Tablet viewport |
| 2 | Navigation adapts | Menu collapses |
| 3 | Charts resize | Responsive charts |
| 4 | Touch interactions | Tap works |
| 5 | No horizontal scroll | No overflow |

---

### 4.3 Epic 3 Summary

| Metric | Value |
|--------|-------|
| Total Stories | 14 |
| Total Points | 76 |
| Priority | P0 |
| Dependencies | E1 (Analysis Engine) |
| Target Completion | Week 11 |

---

## 5. Epic 4: API Integration

### 5.1 Epic Description

**Goal:** Build integrations with GitHub for automated analysis, including GitHub App installation, PR status checks, and inline comments.

**Business Value:** Integrations reduce friction and embed Code Trust Scorer into existing workflows, increasing adoption and stickiness.

**Success Criteria:**
- GitHub App can be installed with one click
- PR status checks show trust scores
- Inline comments highlight specific issues
- GitHub Actions integration works

### 5.2 User Stories

#### Story E4-1: GitHub App Installation

**As a** user  
**I want to** install Code Trust Scorer as a GitHub App  
**So that** it can analyze my repositories

**Story Points:** 8

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Install button in dashboard | Button exists |
| 2 | OAuth flow to GitHub | Flow completes |
| 3 | Select repositories | Multi-select UI |
| 4 | Minimal permissions | Only needed scopes |
| 5 | Installation confirmed | Success message |
| 6 | Repos appear in projects | Auto-create projects |

---

#### Story E4-2: PR Status Check

**As a** developer  
**I want** PR status checks to show trust score  
**So that** I can see quality before merging

**Story Points:** 8

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Check runs on PR open | Triggered automatically |
| 2 | Check runs on new commits | Re-triggered |
| 3 | Pass/fail based on threshold | Threshold respected |
| 4 | Score shown in description | Trust Score: XX |
| 5 | Click links to report | Navigation works |
| 6 | Completes in <60 seconds | Performance test |

---

#### Story E4-3: PR Inline Comments

**As a** developer  
**I want** issues highlighted inline on PR  
**So that** I can see problems in context

**Story Points:** 8

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Comment on issue lines | Correct placement |
| 2 | Shows description and severity | Full info |
| 3 | Includes fix suggestion | Suggestion visible |
| 4 | Links to detailed view | Link works |
| 5 | Max 10 comments per PR | No spam |
| 6 | Resolved issues removed | Cleanup works |

---

#### Story E4-4: PR Summary Comment

**As a** developer  
**I want** a summary comment on PRs  
**So that** I can see overall quality

**Story Points:** 5

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Summary posted on first analysis | Comment exists |
| 2 | Shows trust score | Score visible |
| 3 | Shows issue breakdown | Counts by severity |
| 4 | Links to full report | Link works |
| 5 | Updated on re-analysis | Comment edited |

---

#### Story E4-5: GitHub Actions Integration

**As a** DevOps engineer  
**I want** a GitHub Action for CI/CD  
**So that** analysis runs in my pipeline

**Story Points:** 8

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Action in GitHub Marketplace | Published |
| 2 | Simple YAML config | Docs provided |
| 3 | Configurable threshold | Input works |
| 4 | Fail option on low score | Exit code |
| 5 | JSON output available | Output works |
| 6 | Executes in <60s | Performance test |

**Example Usage:**

```yaml
- uses: code-trust-scorer/action@v1
  with:
    threshold: 70
    fail-on-error: true
  env:
    CTS_API_KEY: ${{ secrets.CTS_API_KEY }}
```

---

#### Story E4-6: REST API

**As a** developer  
**I want** a REST API  
**So that** I can integrate with custom tools

**Story Points:** 8

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | API key authentication | Auth works |
| 2 | POST /analyze endpoint | Can submit code |
| 3 | GET /analyses/:id | Can retrieve results |
| 4 | GET /projects | Can list projects |
| 5 | Rate limiting | Limits enforced |
| 6 | OpenAPI spec published | Docs available |

---

#### Story E4-7: Webhooks

**As a** developer  
**I want** webhook notifications  
**So that** I can react to analysis events

**Story Points:** 5

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Configure URL per project | Settings UI |
| 2 | Sent on analysis complete | Event fires |
| 3 | Includes analysis summary | Payload correct |
| 4 | Signature for verification | HMAC included |
| 5 | Retry on failure (3x) | Retries work |

---

#### Story E4-8: Slack Integration

**As a** team member  
**I want** Slack notifications  
**So that** I'm alerted to issues

**Story Points:** 5

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Connect Slack workspace | OAuth works |
| 2 | Select channel for alerts | Channel picker |
| 3 | Notification on threshold breach | Alert sent |
| 4 | Notification on new error | Alert sent |
| 5 | Configurable triggers | Settings work |

---

#### Story E4-9: CLI Tool

**As a** developer  
**I want** a CLI tool  
**So that** I can run analysis locally

**Story Points:** 8

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Install via npm | npm install works |
| 2 | `cts analyze <file>` | Command works |
| 3 | `cts analyze <dir>` | Batch works |
| 4 | Output formats: json, table | Formats work |
| 5 | Exit codes for CI | Codes correct |
| 6 | Config file support | .ctsconfigrc |

---

#### Story E4-10: API Rate Limiting

**As an** operator  
**I want** rate limiting on API  
**So that** abuse is prevented

**Story Points:** 5

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Limits per tier | Free/Pro/Enterprise |
| 2 | Headers show remaining | X-RateLimit headers |
| 3 | 429 on exceeded | Error response |
| 4 | Redis-based counting | Distributed |
| 5 | Configurable limits | Admin settings |

---

#### Story E4-11: API Versioning

**As a** developer  
**I want** API versioning  
**So that** changes don't break my integration

**Story Points:** 3

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Version in URL (/v1/) | Path versioned |
| 2 | Deprecation notices | Headers warn |
| 3 | Old version support (6mo) | Policy documented |
| 4 | Changelog published | Docs available |

---

### 5.3 Epic 4 Summary

| Metric | Value |
|--------|-------|
| Total Stories | 11 |
| Total Points | 68 |
| Priority | P1 |
| Dependencies | E1 (Analysis Engine), E2 (Auth) |
| Target Completion | Week 14 |

---

## 6. Epic 5: Settings & Preferences

### 6.1 Epic Description

**Goal:** Build settings pages for users to configure their experience, manage rules, and handle team settings.

**Business Value:** Customization increases user satisfaction and allows enterprises to enforce their specific policies.

**Success Criteria:**
- Users can customize analysis rules
- Teams can manage members and permissions
- Notification preferences work correctly
- API keys can be managed securely

### 6.2 User Stories

#### Story E5-1: Profile Settings

**As a** user  
**I want to** manage my profile  
**So that** my information is accurate

**Story Points:** 3

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Edit display name | Update works |
| 2 | Upload avatar | Image upload works |
| 3 | View email (read-only) | Email shown |
| 4 | Link/unlink GitHub | OAuth works |

---

#### Story E5-2: Rule Configuration

**As a** developer  
**I want to** customize analysis rules  
**So that** I focus on issues I care about

**Story Points:** 8

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | View all rules | List shows rules |
| 2 | Enable/disable rules | Toggle works |
| 3 | Adjust severity | Dropdown works |
| 4 | Create presets | Save preset |
| 5 | Apply to projects | Preset assignment |
| 6 | Import/export | JSON format |

---

#### Story E5-3: Threshold Configuration

**As a** developer  
**I want to** set trust score thresholds  
**So that** CI fails appropriately

**Story Points:** 3

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Set per-project threshold | Slider/input |
| 2 | Set warning threshold | Secondary level |
| 3 | Threshold persists | Saved to DB |
| 4 | Changes logged | Audit trail |

---

#### Story E5-4: Notification Settings

**As a** user  
**I want to** configure notifications  
**So that** I'm not overwhelmed

**Story Points:** 5

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Email preferences | Toggle categories |
| 2 | Slack preferences | Channel selection |
| 3 | Frequency options | Immediate/daily/weekly |
| 4 | Per-project settings | Granular control |
| 5 | DND hours | Time range |

---

#### Story E5-5: API Key Management

**As a** developer  
**I want to** manage API keys  
**So that** I can integrate securely

**Story Points:** 5

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Create new key | Key generated |
| 2 | View keys (masked) | Partial display |
| 3 | Set expiration | Date picker |
| 4 | Revoke keys | Deletion works |
| 5 | View usage stats | Request counts |
| 6 | Max 10 keys | Limit enforced |

---

#### Story E5-6: Ignore Patterns

**As a** developer  
**I want to** configure ignore patterns  
**So that** generated code is skipped

**Story Points:** 3

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Add glob patterns | Input works |
| 2 | Preview matched files | List shown |
| 3 | Default patterns | node_modules, etc. |
| 4 | Per-project patterns | Project-specific |

---

#### Story E5-7: Team Member Management

**As a** team admin  
**I want to** manage team members  
**So that** access is controlled

**Story Points:** 8

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Invite by email | Invitation sent |
| 2 | Assign roles | Admin/Member/Viewer |
| 3 | Remove members | Removal works |
| 4 | Transfer ownership | Owner change |
| 5 | Bulk invite (CSV) | Multi-invite |

---

#### Story E5-8: Billing Settings (Future)

**As a** user  
**I want to** manage my subscription  
**So that** I can upgrade or downgrade

**Story Points:** 8

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | View current plan | Plan displayed |
| 2 | Upgrade to Pro | Stripe checkout |
| 3 | Downgrade plan | Plan change |
| 4 | View invoices | Invoice list |
| 5 | Update payment method | Card update |

**Note:** Scheduled for post-MVP.

---

#### Story E5-9: Data Export

**As a** user  
**I want to** export my data  
**So that** I have portability

**Story Points:** 5

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Request data export | Button works |
| 2 | Email when ready | Notification sent |
| 3 | Download as ZIP | File downloads |
| 4 | Includes all data | Projects, analyses, settings |
| 5 | Available for 7 days | Expiry enforced |

---

### 6.3 Epic 5 Summary

| Metric | Value |
|--------|-------|
| Total Stories | 9 |
| Total Points | 42 |
| Priority | P1 |
| Dependencies | E2 (Auth), E3 (Dashboard) |
| Target Completion | Week 15 |

---

## 7. Epic 6: VS Code Extension

### 7.1 Epic Description

**Goal:** Build a VS Code extension that provides real-time code analysis, issue highlighting, and quick fixes directly in the editor.

**Business Value:** VS Code is the most popular editor. An excellent extension drives adoption and daily engagement.

**Success Criteria:**
- Extension installs and activates smoothly
- Real-time analysis on file save
- Issues highlighted inline
- Quick fixes available

### 7.2 User Stories

#### Story E6-1: Extension Activation

**As a** developer  
**I want to** install and activate the extension  
**So that** I can start using it

**Story Points:** 5

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Install from marketplace | Install works |
| 2 | Activate on TypeScript/JS/Python | Language trigger |
| 3 | Status bar item appears | CTS: Ready |
| 4 | Login prompt shown | Auth flow starts |
| 5 | Activation <2 seconds | Performance test |

---

#### Story E6-2: Real-Time Analysis

**As a** developer  
**I want** code analyzed on save  
**So that** I see issues immediately

**Story Points:** 8

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Analysis triggers on save | Event fires |
| 2 | Status bar shows "Analyzing..." | Status updates |
| 3 | Results appear in <5 seconds | Performance test |
| 4 | Trust score in status bar | Score visible |
| 5 | Debounce rapid saves | No spam |

---

#### Story E6-3: Issue Highlighting

**As a** developer  
**I want** issues highlighted in code  
**So that** I can see problems visually

**Story Points:** 8

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Squiggly underlines on issues | Decorations visible |
| 2 | Color matches severity | Red/yellow/blue |
| 3 | Hover shows description | Tooltip works |
| 4 | Problems panel populated | Issues listed |
| 5 | Navigate to issue | Click jumps |

---

#### Story E6-4: Quick Fixes

**As a** developer  
**I want** quick fixes for issues  
**So that** I can resolve them easily

**Story Points:** 8

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Lightbulb on fixable issues | Icon appears |
| 2 | "Quick Fix" in context menu | Menu option |
| 3 | Preview before apply | Diff shown |
| 4 | Apply modifies code | Code changed |
| 5 | Undo via Ctrl+Z | Revert works |

---

#### Story E6-5: Side Panel

**As a** developer  
**I want** a panel showing all issues  
**So that** I can see the full picture

**Story Points:** 5

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Panel in sidebar | Tree view |
| 2 | Shows current file issues | Filtered list |
| 3 | Shows project issues | Expandable |
| 4 | Click navigates to issue | Navigation works |
| 5 | Trust score displayed | Score visible |

---

#### Story E6-6: Settings UI

**As a** developer  
**I want** extension settings  
**So that** I can customize behavior

**Story Points:** 3

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Settings in VS Code settings | Integration |
| 2 | Enable/disable auto-analysis | Toggle |
| 3 | Severity filter | Dropdown |
| 4 | API key configuration | Input field |

---

#### Story E6-7: Authentication

**As a** developer  
**I want to** log in from VS Code  
**So that** my analysis syncs

**Story Points:** 5

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | "Login" command | Command palette |
| 2 | Browser OAuth flow | Opens browser |
| 3 | Token stored securely | In secrets API |
| 4 | Session persists | After restart |
| 5 | "Logout" command | Clears session |

---

#### Story E6-8: Offline Mode

**As a** developer  
**I want** basic analysis offline  
**So that** I can work without internet

**Story Points:** 8

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Local analysis available | Works offline |
| 2 | Reduced rule set | Core rules only |
| 3 | Results cached | Persisted |
| 4 | Sync when online | Upload results |
| 5 | Indicator shown | "Offline mode" |

---

#### Story E6-9: Ignore Command

**As a** developer  
**I want to** ignore issues from VS Code  
**So that** I can suppress false positives

**Story Points:** 3

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | "Ignore this issue" command | Context menu |
| 2 | Adds inline comment | Comment inserted |
| 3 | Issue removed from view | Hidden |
| 4 | Sync to server | Persisted |

---

#### Story E6-10: Performance Optimization

**As a** developer  
**I want** the extension to be fast  
**So that** it doesn't slow me down

**Story Points:** 5

**Acceptance Criteria:**

| # | Criteria | Test |
|---|----------|------|
| 1 | Incremental analysis | Only changes |
| 2 | Background processing | Non-blocking |
| 3 | Memory limit <100MB | Resource test |
| 4 | No UI freezes | Responsiveness |
| 5 | Startup <2 seconds | Cold start |

---

### 7.3 Epic 6 Summary

| Metric | Value |
|--------|-------|
| Total Stories | 10 |
| Total Points | 58 |
| Priority | P0 |
| Dependencies | E1 (Analysis Engine), E2 (Auth) |
| Target Completion | Week 12 |

---

## 8. Sprint Planning

### 8.1 Sprint Schedule

| Sprint | Weeks | Focus | Stories |
|--------|-------|-------|---------|
| Sprint 1 | 1-2 | Foundation | E1-1, E1-2, E1-3, E2-1, E2-2 |
| Sprint 2 | 3-4 | Core Analysis | E1-4, E1-5, E1-6, E1-7 |
| Sprint 3 | 5-6 | Analysis Complete | E1-8 to E1-12, E2-3 to E2-5 |
| Sprint 4 | 7-8 | Auth & Dashboard Start | E2-6 to E2-9, E3-1 to E3-3 |
| Sprint 5 | 9-10 | Dashboard & VS Code | E3-4 to E3-8, E6-1 to E6-3 |
| Sprint 6 | 11-12 | VS Code & Reports | E6-4 to E6-7, E3-9 to E3-12 |
| Sprint 7 | 13-14 | API Integration | E4-1 to E4-6 |
| Sprint 8 | 15-16 | Settings & Polish | E5-1 to E5-7, E4-7 to E4-11 |
| Sprint 9 | 17 | Final Polish & Launch | Bug fixes, documentation |

### 8.2 Velocity Assumptions

| Metric | Value |
|--------|-------|
| Team Size | 3 developers |
| Sprint Length | 2 weeks |
| Velocity | 40-50 points/sprint |
| Total Points | 388 |
| Estimated Sprints | 9 |

### 8.3 Risk Buffer

| Risk | Buffer |
|------|--------|
| Technical challenges | +15% |
| Scope changes | +10% |
| External dependencies | +5% |
| **Total Buffer** | **+30%** |

### 8.4 Milestone Dates

| Milestone | Date | Criteria |
|-----------|------|----------|
| Alpha | Week 4 | Core analysis works |
| Closed Beta | Week 10 | Dashboard + VS Code basic |
| Open Beta | Week 14 | Full feature set |
| v1.0 Launch | Week 17 | Production ready |

---

*Document End*

**Revision History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-06 | Product Team | Initial version |

**Approval:**

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Manager | | | |
| Engineering Lead | | | |
| Scrum Master | | | |
