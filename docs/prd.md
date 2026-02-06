# Product Requirements Document (PRD)

## Code Trust Scorer

**Document Version:** 1.0  
**Last Updated:** 2026-02-06  
**Author:** Product Team  
**Status:** Draft

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [User Personas](#2-user-personas)
3. [User Stories](#3-user-stories)
4. [Functional Requirements](#4-functional-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [API Specifications](#6-api-specifications)
7. [Data Models](#7-data-models)
8. [Security Requirements](#8-security-requirements)
9. [Success Metrics](#9-success-metrics)
10. [Appendices](#10-appendices)

---

## 1. Introduction

### 1.1 Purpose

This Product Requirements Document (PRD) defines the detailed requirements for Code Trust Scorer, a developer tool that analyzes AI-generated code and provides trust scores based on quality signals.

### 1.2 Scope

This document covers:
- User personas and their needs
- Detailed user stories with acceptance criteria
- Functional and non-functional requirements
- API specifications and data models
- Security requirements

### 1.3 Definitions and Acronyms

| Term | Definition |
|------|------------|
| CTS | Code Trust Scorer |
| LOC | Lines of Code |
| AST | Abstract Syntax Tree |
| API | Application Programming Interface |
| CI/CD | Continuous Integration / Continuous Deployment |
| SSO | Single Sign-On |
| RBAC | Role-Based Access Control |
| PII | Personally Identifiable Information |

### 1.4 References

- Product Brief: Code Trust Scorer
- UX Design Document
- Architecture Document
- Epics and User Stories Document

---

## 2. User Personas

### 2.1 Primary Personas

#### 2.1.1 Alex — The AI-First Developer

**Profile:**

| Attribute | Value |
|-----------|-------|
| Age | 28 |
| Location | San Francisco, CA |
| Experience | 5 years |
| Role | Senior Frontend Developer |
| Company Size | 50 employees (startup) |
| Tech Stack | TypeScript, React, Next.js |

**Background:**
Alex is a senior frontend developer at a fast-growing startup. They've fully embraced AI coding tools and use Cursor as their primary IDE. About 60% of their code is now AI-assisted. They're productive but increasingly concerned about code quality.

**Daily Workflow:**

1. 8:00 AM - Review overnight PRs from teammates
2. 9:00 AM - Morning standup
3. 9:30 AM - Start coding with Cursor
4. 12:00 PM - Lunch break
5. 1:00 PM - More coding, PR reviews
6. 4:00 PM - Testing and debugging
7. 6:00 PM - End of day commits

**Technology Usage:**

| Tool | Usage Frequency | Satisfaction |
|------|-----------------|--------------|
| Cursor | Daily | High |
| VS Code | Sometimes | Medium |
| GitHub | Daily | High |
| Vercel | Daily | High |
| Slack | Hourly | Medium |
| ChatGPT | Daily | Medium |

**Pain Points:**

1. **Trust Issues:** "I've been burned multiple times by AI suggesting APIs that don't exist. Now I Google every method I'm not 100% sure about."

2. **Time Waste:** "I spent 3 hours last week debugging code that 'looked right' but had subtle issues. The AI had used a deprecated React pattern."

3. **Review Burden:** "When I review PRs from junior devs using AI, I have to be extra careful. There's no way to know what's AI-generated vs hand-written."

4. **Inconsistency:** "Sometimes AI gives me perfect code. Sometimes it's garbage. There's no way to predict which it will be."

**Goals:**

1. Continue using AI tools without sacrificing code quality
2. Spend less time manually verifying AI output
3. Learn from AI mistakes to improve prompts
4. Build confidence that merged code is production-ready

**Quote:**
> "I want to trust AI like I trust my linter. Give me a red squiggle when something's wrong."

**Feature Priorities:**

| Feature | Priority |
|---------|----------|
| VS Code real-time analysis | Must Have |
| Hallucinated API detection | Must Have |
| Trust score display | Must Have |
| Quick fix suggestions | Nice to Have |
| Analysis history | Nice to Have |

---

#### 2.1.2 Sarah — The Engineering Manager

**Profile:**

| Attribute | Value |
|-----------|-------|
| Age | 38 |
| Location | Austin, TX |
| Experience | 12 years |
| Role | Engineering Manager |
| Company Size | 350 employees (scale-up) |
| Reports | 8 developers |

**Background:**
Sarah manages a team of 8 developers at a growing scale-up. Half her team has enthusiastically adopted AI tools, while the other half is skeptical. She needs to balance innovation with quality standards.

**Daily Workflow:**

1. 7:30 AM - Review dashboards and metrics
2. 8:00 AM - Check overnight incidents
3. 9:00 AM - Team standup
4. 10:00 AM - 1:1s with team members
5. 12:00 PM - Lunch
6. 1:00 PM - Strategy meetings
7. 3:00 PM - PR reviews and code quality checks
8. 5:00 PM - Planning and documentation

**Technology Usage:**

| Tool | Usage Frequency | Satisfaction |
|------|-----------------|--------------|
| GitHub | Daily | Medium |
| Jira | Daily | Low |
| Slack | Hourly | Medium |
| Datadog | Daily | High |
| PagerDuty | Weekly | Medium |
| Google Sheets | Weekly | Low |

**Pain Points:**

1. **No Visibility:** "I have no idea which bugs are caused by AI code vs human code. I can't make data-driven decisions about AI tool policies."

2. **Team Conflict:** "My senior devs complain that AI-heavy PRs take longer to review. Junior devs feel judged for using AI."

3. **Quality Variance:** "Some team members produce great AI-assisted code. Others produce garbage. I can't figure out why."

4. **Metrics Gap:** "I track code coverage, PR cycle time, and bug rates. But I don't have AI-specific metrics."

**Goals:**

1. Establish clear, fair AI usage guidelines
2. Get visibility into AI code quality
3. Reduce team friction around AI tools
4. Maintain or improve quality metrics

**Quote:**
> "I need objective data, not opinions. Show me the numbers."

**Feature Priorities:**

| Feature | Priority |
|---------|----------|
| Team dashboard | Must Have |
| Quality trends over time | Must Have |
| Per-developer metrics | Must Have |
| CI/CD integration | Must Have |
| Custom thresholds | Nice to Have |
| Slack notifications | Nice to Have |

---

#### 2.1.3 Marcus — The Security-Conscious CISO

**Profile:**

| Attribute | Value |
|-----------|-------|
| Age | 45 |
| Location | New York, NY |
| Experience | 20 years |
| Role | Chief Information Security Officer |
| Company Size | 2,000 employees (enterprise) |
| Team | 15 security professionals |

**Background:**
Marcus is responsible for security across a large enterprise. AI coding tools have been adopted by engineering without formal security review. He's concerned about the security implications but lacks tools to quantify the risk.

**Daily Workflow:**

1. 6:30 AM - Review overnight security alerts
2. 8:00 AM - Security team standup
3. 9:00 AM - Executive meetings
4. 11:00 AM - Vendor evaluations
5. 1:00 PM - Policy review and updates
6. 3:00 PM - Incident response (if needed)
7. 5:00 PM - Reporting and documentation

**Technology Usage:**

| Tool | Usage Frequency | Satisfaction |
|------|-----------------|--------------|
| Snyk | Daily | High |
| Splunk | Daily | Medium |
| Okta | Daily | High |
| Jira | Weekly | Low |
| Power BI | Weekly | Medium |

**Pain Points:**

1. **Blind Spot:** "AI code is a massive blind spot. We have no idea what security risks are being introduced."

2. **No Audit Trail:** "If we have a breach, I can't trace it back to AI-generated code. There's no provenance."

3. **Compliance Concerns:** "Our SOC 2 auditors are asking about AI code. I don't have good answers."

4. **Manual Review Bottleneck:** "My team can't manually review all AI-generated code. We need automation."

**Goals:**

1. Quantify security risk from AI code
2. Establish compliant AI code policies
3. Automate security review of AI output
4. Generate audit-ready reports

**Quote:**
> "Every line of AI code is a potential vulnerability until proven otherwise."

**Feature Priorities:**

| Feature | Priority |
|---------|----------|
| Security vulnerability detection | Must Have |
| Audit logging | Must Have |
| Compliance reports | Must Have |
| SSO integration | Must Have |
| Risk scoring | Must Have |
| SIEM integration | Nice to Have |

---

### 2.2 Secondary Personas

#### 2.2.1 Jordan — The Indie Hacker

**Profile:**

| Attribute | Value |
|-----------|-------|
| Age | 32 |
| Location | Remote (Portugal) |
| Experience | 7 years |
| Role | Solo Founder |
| Company Size | 1 (self) |
| Tech Stack | Next.js, Supabase, Vercel |

**Background:**
Jordan is building a SaaS product as a solo founder. They use AI tools heavily to move fast and compensate for not having a team. Quality matters, but speed is the priority.

**Pain Points:**
- No one to review their code
- Can't afford to spend time debugging
- Worried about shipping bugs to customers
- Budget-conscious, prefers free tools

**Goals:**
- Quick validation of AI code
- Catch critical issues before deploy
- Keep costs near zero
- Simple, fast workflow

**Feature Priorities:**

| Feature | Priority |
|---------|----------|
| Free tier | Must Have |
| VS Code extension | Must Have |
| Fast analysis | Must Have |
| Simple UI | Must Have |

---

#### 2.2.2 Taylor — The DevOps Engineer

**Profile:**

| Attribute | Value |
|-----------|-------|
| Age | 34 |
| Location | Seattle, WA |
| Experience | 9 years |
| Role | Senior DevOps Engineer |
| Company Size | 150 employees |
| Focus | CI/CD, infrastructure |

**Background:**
Taylor manages the CI/CD pipeline and deployment infrastructure. They want to add automated quality gates for AI-generated code without slowing down deployments.

**Pain Points:**
- Adding new tools to pipeline is risky
- Developers complain about slow pipelines
- Need clear pass/fail criteria
- Integration complexity

**Goals:**
- Easy CI/CD integration
- Fast execution time
- Clear documentation
- Configurable thresholds

**Feature Priorities:**

| Feature | Priority |
|---------|----------|
| GitHub Actions integration | Must Have |
| Fast execution (<30s) | Must Have |
| YAML configuration | Must Have |
| Exit codes for pass/fail | Must Have |
| Detailed logs | Nice to Have |

---

#### 2.2.3 Priya — The Junior Developer

**Profile:**

| Attribute | Value |
|-----------|-------|
| Age | 24 |
| Location | Bangalore, India |
| Experience | 1 year |
| Role | Junior Frontend Developer |
| Company Size | 80 employees |
| Learning | TypeScript, React |

**Background:**
Priya recently graduated and heavily relies on AI tools to be productive. They're eager to learn but sometimes can't tell good code from bad code.

**Pain Points:**
- Not experienced enough to spot AI issues
- Embarrassed when AI code fails review
- Wants to learn, not just accept AI suggestions
- Feels judged for using AI

**Goals:**
- Learn from AI mistakes
- Improve code quality
- Build confidence
- Impress senior developers

**Feature Priorities:**

| Feature | Priority |
|---------|----------|
| Explanations for issues | Must Have |
| Learning resources | Nice to Have |
| Improvement suggestions | Must Have |
| Progress tracking | Nice to Have |

---

### 2.3 Persona Summary Matrix

| Persona | Primary Need | Willingness to Pay | Decision Authority |
|---------|-------------|-------------------|-------------------|
| Alex | Real-time verification | $20-40/month | Self/team |
| Sarah | Team visibility | $200-500/month | Team/dept budget |
| Marcus | Security & compliance | $2000+/month | Enterprise budget |
| Jordan | Quick free validation | $0-15/month | Self |
| Taylor | CI/CD integration | $100-300/month | Infrastructure budget |
| Priya | Learning & improvement | $0-10/month | Self (limited) |

---

## 3. User Stories

### 3.1 Epic 1: Core Analysis Engine

#### User Story 1.1: Analyze TypeScript File

**As a** developer using AI coding tools  
**I want to** analyze my TypeScript files for AI-specific issues  
**So that** I can catch problems before they reach production

**Acceptance Criteria:**

- [ ] System accepts TypeScript (.ts, .tsx) files up to 50,000 lines
- [ ] Analysis completes within 5 seconds for files under 1,000 lines
- [ ] System detects hallucinated API calls with >85% accuracy
- [ ] System detects deprecated method usage
- [ ] System identifies common security vulnerabilities
- [ ] Results include issue location (line, column)
- [ ] Results include severity level (error, warning, info)
- [ ] Results include confidence score (0-100)

**Technical Notes:**
- Use tree-sitter for TypeScript parsing
- Maintain API knowledge base for validation
- Cache parsing results for performance

---

#### User Story 1.2: Analyze Python File

**As a** Python developer using AI coding tools  
**I want to** analyze my Python files for AI-specific issues  
**So that** I can catch problems in Python code

**Acceptance Criteria:**

- [ ] System accepts Python (.py) files up to 50,000 lines
- [ ] Analysis completes within 5 seconds for files under 1,000 lines
- [ ] System detects hallucinated Python API calls
- [ ] System detects deprecated Python patterns
- [ ] System identifies Python-specific security issues
- [ ] Results format matches TypeScript analysis

**Technical Notes:**
- Use tree-sitter-python for parsing
- Support Python 3.8+ syntax
- Include common library signatures

---

#### User Story 1.3: Calculate Trust Score

**As a** developer  
**I want to** see a single trust score for my code  
**So that** I can quickly assess overall code quality

**Acceptance Criteria:**

- [ ] Trust score is calculated on scale 0-100
- [ ] Score considers: issue count, severity, confidence
- [ ] Score includes breakdown by category
- [ ] Score includes confidence interval
- [ ] Score is recalculated on code changes
- [ ] Historical scores are tracked

**Scoring Algorithm:**

```
base_score = 100
for issue in issues:
    penalty = severity_weight[issue.severity] * issue.confidence
    base_score -= penalty

trust_score = max(0, min(100, base_score))
```

**Severity Weights:**
- Error: 15 points
- Warning: 5 points
- Info: 1 point

---

#### User Story 1.4: Detect Hallucinated APIs

**As a** developer  
**I want to** be alerted when AI generates non-existent API calls  
**So that** I don't waste time debugging fake methods

**Acceptance Criteria:**

- [ ] System detects calls to non-existent methods
- [ ] System detects incorrect method signatures
- [ ] System detects non-existent npm packages
- [ ] System suggests correct alternatives when available
- [ ] Detection accuracy >85%
- [ ] False positive rate <15%

**Examples to Detect:**

```typescript
// Hallucinated: Array.flatten() doesn't exist
array.flatten() // Should suggest: array.flat()

// Hallucinated: Object.entries() wrong return type assumption
Object.entries(obj).map(x => x.key) // key doesn't exist

// Hallucinated: non-existent lodash method
_.deepClone(obj) // Should suggest: _.cloneDeep()
```

**Edge Cases:**

| Edge Case | Expected Behavior |
|-----------|-------------------|
| Method exists in newer version | Warning with version info |
| Method name is typo | Suggest correct spelling with Levenshtein distance |
| Custom user-defined method | No false positive (check scope) |
| Polyfilled method | Check for polyfill presence |
| Monkey-patched prototype | Detect prototype extension patterns |
| Dynamic method calls (e.g., `obj[methodName]()`) | Skip or low-confidence warning |
| Third-party library with incomplete types | Lower confidence, suggest checking docs |

---

#### User Story 1.5: Detect Deprecated Methods

**As a** developer  
**I want to** be warned about deprecated API usage  
**So that** I can use modern alternatives

**Acceptance Criteria:**

- [ ] System detects deprecated React patterns
- [ ] System detects deprecated Node.js APIs
- [ ] System detects deprecated browser APIs
- [ ] Warning includes deprecation version
- [ ] Warning includes recommended alternative
- [ ] Warning includes migration guide link

**Examples to Detect:**

```typescript
// Deprecated React lifecycle
componentWillMount() { }
componentWillReceiveProps(props) { }
componentWillUpdate() { }

// Deprecated Node.js
require('url').parse(url) // Deprecated
Buffer.allocUnsafe() // Security concern

// Deprecated browser
document.write()
```

---

#### User Story 1.6: Detect Security Vulnerabilities

**As a** developer  
**I want to** be warned about security issues in AI code  
**So that** I can fix them before deployment

**Acceptance Criteria:**

- [ ] System detects SQL injection patterns
- [ ] System detects XSS vulnerabilities
- [ ] System detects insecure randomness
- [ ] System detects hardcoded credentials
- [ ] System detects prototype pollution risks
- [ ] System detects path traversal issues
- [ ] Each issue includes remediation guidance

**Examples to Detect:**

```typescript
// SQL Injection
const query = `SELECT * FROM users WHERE id = ${userId}`;

// XSS
element.innerHTML = userInput;

// Insecure randomness
const token = Math.random().toString(36);

// Hardcoded credentials
const password = "admin123";

// Path traversal
const file = fs.readFileSync(`./uploads/${filename}`);
```

---

#### User Story 1.7: Batch Analysis

**As a** developer or CI/CD system  
**I want to** analyze multiple files at once  
**So that** I can check entire projects efficiently

**Acceptance Criteria:**

- [ ] System accepts directory path as input
- [ ] System respects .gitignore patterns
- [ ] System supports glob patterns for file selection
- [ ] System runs analysis in parallel for speed
- [ ] Batch analysis completes within 60 seconds for 100 files
- [ ] Results are aggregated into summary report
- [ ] Individual file results are accessible

---

#### User Story 1.8: Incremental Analysis

**As a** developer  
**I want** analysis to only check changed code  
**So that** repeated analyses are fast

**Acceptance Criteria:**

- [ ] System detects which files have changed since last analysis
- [ ] Only changed files are fully re-analyzed
- [ ] Unchanged file results are cached
- [ ] Incremental analysis is 5x faster than full analysis
- [ ] Cache can be invalidated manually
- [ ] Cache expires after 24 hours

---

### 3.2 Epic 2: User Authentication

#### User Story 2.1: Sign Up with Email

**As a** new user  
**I want to** create an account with my email  
**So that** I can access Code Trust Scorer features

**Acceptance Criteria:**

- [ ] User can enter email and password
- [ ] Password must be at least 8 characters
- [ ] Password must include letter and number
- [ ] Email verification is required
- [ ] Verification email sent within 30 seconds
- [ ] User can resend verification email
- [ ] Account created in "pending" state until verified

---

#### User Story 2.2: Sign Up with GitHub

**As a** developer  
**I want to** sign up using my GitHub account  
**So that** I can get started quickly

**Acceptance Criteria:**

- [ ] "Continue with GitHub" button on signup page
- [ ] OAuth flow redirects to GitHub
- [ ] System requests minimal permissions (email, profile)
- [ ] Account created automatically on success
- [ ] GitHub username linked to account
- [ ] User can later add email/password login

---

#### User Story 2.3: Sign In

**As a** registered user  
**I want to** sign in to my account  
**So that** I can access my projects and history

**Acceptance Criteria:**

- [ ] User can sign in with email/password
- [ ] User can sign in with GitHub
- [ ] "Remember me" option for 30-day session
- [ ] Failed login shows generic error (security)
- [ ] Account locked after 5 failed attempts
- [ ] Unlock via email link

---

#### User Story 2.4: Password Reset

**As a** user who forgot my password  
**I want to** reset my password via email  
**So that** I can regain access to my account

**Acceptance Criteria:**

- [ ] "Forgot password" link on login page
- [ ] User enters email address
- [ ] Reset email sent within 30 seconds
- [ ] Reset link expires after 1 hour
- [ ] User can set new password
- [ ] Previous sessions invalidated on reset

---

#### User Story 2.5: Enterprise SSO

**As an** enterprise administrator  
**I want to** configure SSO for my organization  
**So that** users can sign in with corporate credentials

**Acceptance Criteria:**

- [ ] Support for SAML 2.0
- [ ] Support for OIDC
- [ ] Admin can configure SSO settings
- [ ] Admin can upload IdP metadata
- [ ] Users auto-provisioned on first SSO login
- [ ] Users can be deactivated from IdP
- [ ] Bypass SSO option for admins

---

#### User Story 2.6: Session Management

**As a** user  
**I want to** manage my active sessions  
**So that** I can secure my account

**Acceptance Criteria:**

- [ ] User can view all active sessions
- [ ] Session shows device, location, last active
- [ ] User can revoke individual sessions
- [ ] User can revoke all other sessions
- [ ] Session timeout after 7 days inactive
- [ ] Maximum 10 concurrent sessions

---

### 3.3 Epic 3: Dashboard & Reporting

#### User Story 3.1: View Project Dashboard

**As a** developer  
**I want to** see an overview of my project's trust scores  
**So that** I can quickly assess code quality

**Acceptance Criteria:**

- [ ] Dashboard shows overall project trust score
- [ ] Dashboard shows trust score trend (7 days)
- [ ] Dashboard shows issue count by severity
- [ ] Dashboard shows recent analyses
- [ ] Dashboard refreshes automatically
- [ ] Dashboard loads within 2 seconds

**Dashboard Components:**

```
┌─────────────────────────────────────────────────────────┐
│  Project: my-saas-app                    Trust Score: 78│
├─────────────────────────────────────────────────────────┤
│  [Trust Score Trend Chart - 7 days]                     │
│  ▁▂▃▄▅▆▇█ 72 → 78                                       │
├─────────────────────────────────────────────────────────┤
│  Issues: 12 Errors | 34 Warnings | 89 Info              │
├─────────────────────────────────────────────────────────┤
│  Recent Analyses:                                       │
│  • src/app/page.tsx - Score: 85 - 2 min ago            │
│  • src/lib/api.ts - Score: 62 - 15 min ago             │
│  • src/components/Button.tsx - Score: 94 - 1 hour ago  │
└─────────────────────────────────────────────────────────┘
```

---

#### User Story 3.2: View File Analysis Details

**As a** developer  
**I want to** see detailed analysis results for a file  
**So that** I can understand and fix specific issues

**Acceptance Criteria:**

- [ ] View shows file path and trust score
- [ ] View shows all detected issues
- [ ] Issues grouped by severity
- [ ] Each issue shows line number and message
- [ ] Each issue shows confidence score
- [ ] Each issue has "fix" and "ignore" actions
- [ ] Code preview with highlighted issues

---

#### User Story 3.3: View Issue Details

**As a** developer  
**I want to** see detailed information about an issue  
**So that** I can understand how to fix it

**Acceptance Criteria:**

- [ ] Issue details show full description
- [ ] Issue shows affected code snippet
- [ ] Issue shows why it's a problem
- [ ] Issue shows how to fix it
- [ ] Issue shows related documentation links
- [ ] Issue shows similar examples

---

#### User Story 3.4: Generate Team Report

**As a** engineering manager  
**I want to** generate a report on team code quality  
**So that** I can share with stakeholders

**Acceptance Criteria:**

- [ ] Report shows team-wide trust score
- [ ] Report shows per-member breakdown
- [ ] Report shows trends over time
- [ ] Report shows top issue categories
- [ ] Report exportable as PDF
- [ ] Report exportable as CSV
- [ ] Report can be scheduled weekly

---

#### User Story 3.5: View Historical Trends

**As a** developer or manager  
**I want to** see how trust scores change over time  
**So that** I can track improvement

**Acceptance Criteria:**

- [ ] Chart shows trust score over selected period
- [ ] Periods: 7 days, 30 days, 90 days, 1 year
- [ ] Chart shows issue count over time
- [ ] Can filter by issue type
- [ ] Can compare multiple projects
- [ ] Data exportable as CSV

---

#### User Story 3.6: Compare Branches

**As a** developer  
**I want to** compare trust scores between branches  
**So that** I can see if a PR improves or degrades quality

**Acceptance Criteria:**

- [ ] Select base branch and compare branch
- [ ] Show trust score delta
- [ ] Show new issues introduced
- [ ] Show issues resolved
- [ ] Highlight files with biggest changes
- [ ] Link to specific file comparisons

---

### 3.4 Epic 4: API Integration

#### User Story 4.1: GitHub App Installation

**As a** developer  
**I want to** install Code Trust Scorer as a GitHub App  
**So that** it can analyze my repositories

**Acceptance Criteria:**

- [ ] "Install GitHub App" button in dashboard
- [ ] OAuth flow for GitHub authorization
- [ ] User selects repositories to enable
- [ ] App requests minimal required permissions
- [ ] Installation confirmed in dashboard
- [ ] Repositories appear in project list

**Required GitHub Permissions:**

| Permission | Reason |
|------------|--------|
| Contents: Read | Access code for analysis |
| Pull Requests: Write | Add status checks, comments |
| Checks: Write | Report analysis results |
| Metadata: Read | Repository information |

---

#### User Story 4.2: PR Status Check

**As a** developer  
**I want** PR status checks to show trust score  
**So that** I can see quality before merging

**Acceptance Criteria:**

- [ ] Status check runs automatically on PR open
- [ ] Status check runs on new commits
- [ ] Status shows pass/fail based on threshold
- [ ] Status shows trust score in description
- [ ] Clicking status links to full report
- [ ] Status check completes within 60 seconds

**Status Check Display:**

```
✅ Code Trust Scorer — Trust Score: 85 (threshold: 70)
❌ Code Trust Scorer — Trust Score: 58 (threshold: 70) — 3 errors found
```

---

#### User Story 4.3: PR Comments

**As a** developer  
**I want** Code Trust Scorer to comment on specific issues  
**So that** I can see problems inline

**Acceptance Criteria:**

- [ ] Comment added on lines with issues
- [ ] Comment shows issue description
- [ ] Comment shows severity and confidence
- [ ] Comment includes fix suggestion if available
- [ ] Comments updated on new analysis
- [ ] Resolved issues have comments removed
- [ ] Maximum 10 comments per PR (to avoid spam)

**Comment Format:**

```markdown
🔴 **Code Trust Scorer: Hallucinated API**

`Array.flatten()` does not exist. Did you mean `Array.flat()`?

**Confidence:** 95%

[View Details](https://codetrust.dev/issue/123)
```

---

#### User Story 4.4: GitHub Actions Integration

**As a** DevOps engineer  
**I want to** add Code Trust Scorer to my GitHub Actions workflow  
**So that** analysis runs in CI/CD

**Acceptance Criteria:**

- [ ] Published action in GitHub Marketplace
- [ ] Simple YAML configuration
- [ ] Configurable trust score threshold
- [ ] Configurable fail behavior
- [ ] Outputs analysis results as JSON
- [ ] Fast execution (under 60 seconds)

**Example Workflow:**

```yaml
name: Code Quality
on: [push, pull_request]

jobs:
  trust-score:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: code-trust-scorer/action@v1
        with:
          threshold: 70
          fail-on-error: true
        env:
          CTS_API_KEY: ${{ secrets.CTS_API_KEY }}
```

---

#### User Story 4.5: REST API Access

**As a** developer  
**I want to** access Code Trust Scorer via REST API  
**So that** I can integrate with custom tools

**Acceptance Criteria:**

- [ ] API requires authentication via API key
- [ ] POST /api/analyze endpoint for analysis
- [ ] GET /api/results/:id endpoint for results
- [ ] GET /api/projects endpoint for listing
- [ ] Rate limiting: 100 requests/minute
- [ ] OpenAPI specification published

---

#### User Story 4.6: Webhook Notifications

**As a** developer  
**I want to** receive webhook notifications on analysis  
**So that** I can integrate with external systems

**Acceptance Criteria:**

- [ ] Configurable webhook URL per project
- [ ] Webhook sent on analysis complete
- [ ] Webhook includes analysis summary
- [ ] Webhook includes trust score
- [ ] Webhook signature for verification
- [ ] Retry on failure (3 attempts)

**Webhook Payload:**

```json
{
  "event": "analysis.complete",
  "timestamp": "2026-02-06T12:00:00Z",
  "project": {
    "id": "proj_123",
    "name": "my-saas-app"
  },
  "analysis": {
    "id": "analysis_456",
    "trustScore": 78,
    "issueCount": {
      "error": 3,
      "warning": 12,
      "info": 24
    }
  },
  "signature": "sha256=..."
}
```

---

### 3.5 Epic 5: Settings & Preferences

#### User Story 5.1: Configure Analysis Rules

**As a** developer  
**I want to** customize which rules are enabled  
**So that** I can focus on issues I care about

**Acceptance Criteria:**

- [ ] View all available rules
- [ ] Enable/disable individual rules
- [ ] Adjust severity of rules
- [ ] Create rule presets
- [ ] Apply presets to projects
- [ ] Export/import rule configurations

**Rule Categories:**

| Category | Example Rules |
|----------|---------------|
| Hallucination | invalid-api, wrong-signature |
| Deprecation | deprecated-method, deprecated-syntax |
| Security | sql-injection, xss, hardcoded-secret |
| Quality | over-abstraction, dead-code |

---

#### User Story 5.2: Set Trust Score Threshold

**As a** developer or manager  
**I want to** set the minimum trust score threshold  
**So that** CI/CD fails when quality is too low

**Acceptance Criteria:**

- [ ] Threshold configurable 0-100
- [ ] Default threshold is 70
- [ ] Threshold can be set per-project
- [ ] Threshold can be set per-branch
- [ ] Warning threshold option (e.g., warn at 80, fail at 60)
- [ ] Threshold changes logged for audit

---

#### User Story 5.3: Configure Notifications

**As a** developer  
**I want to** configure when I receive notifications  
**So that** I'm not overwhelmed with alerts

**Acceptance Criteria:**

- [ ] Email notification preferences
- [ ] Slack notification preferences
- [ ] Notification triggers: analysis complete, threshold breach, new issue type
- [ ] Notification frequency: immediate, daily digest, weekly digest
- [ ] Per-project notification settings
- [ ] "Do not disturb" hours

---

#### User Story 5.4: Manage API Keys

**As a** developer  
**I want to** create and manage API keys  
**So that** I can integrate with external tools

**Acceptance Criteria:**

- [ ] Create new API key with description
- [ ] View list of API keys (masked)
- [ ] Revoke API keys
- [ ] Set expiration date for keys
- [ ] View key usage stats
- [ ] Maximum 10 keys per user

---

#### User Story 5.5: Ignore Patterns

**As a** developer  
**I want to** configure files/patterns to ignore  
**So that** I can skip generated or vendored code

**Acceptance Criteria:**

- [ ] Configure ignore patterns per project
- [ ] Support glob patterns
- [ ] Pre-configured for common patterns (node_modules, etc.)
- [ ] Preview which files match pattern
- [ ] Inline ignore comments supported

**Inline Ignore Comment:**

```typescript
// cts-ignore-next-line
const query = `SELECT * FROM users WHERE id = ${id}`;

/* cts-ignore-start */
// This entire block is ignored
legacy_unsafe_code();
/* cts-ignore-end */
```

---

#### User Story 5.6: Team Management

**As a** team admin  
**I want to** manage team members and permissions  
**So that** I can control access

**Acceptance Criteria:**

- [ ] Invite team members by email
- [ ] Assign roles: Admin, Member, Viewer
- [ ] Remove team members
- [ ] Transfer project ownership
- [ ] View team member activity
- [ ] Bulk invite via CSV

**Role Permissions:**

| Permission | Admin | Member | Viewer |
|------------|-------|--------|--------|
| View analyses | ✅ | ✅ | ✅ |
| Run analyses | ✅ | ✅ | ❌ |
| Configure rules | ✅ | ✅ | ❌ |
| Manage team | ✅ | ❌ | ❌ |
| Billing | ✅ | ❌ | ❌ |

---

## 4. Functional Requirements

### 4.1 Analysis Engine Requirements

#### FR-AE-001: Language Support

| Requirement | Description |
|-------------|-------------|
| ID | FR-AE-001 |
| Priority | P0 |
| Description | System shall support analysis of TypeScript, JavaScript, and Python |
| Rationale | Cover the most common languages for AI-assisted development |
| Acceptance | All three languages parse without errors |

#### FR-AE-002: Parsing Performance

| Requirement | Description |
|-------------|-------------|
| ID | FR-AE-002 |
| Priority | P0 |
| Description | System shall parse files within 100ms per 1000 lines |
| Rationale | Real-time analysis requires fast parsing |
| Acceptance | Benchmark shows <100ms for 1000-line files |

#### FR-AE-003: Issue Detection

| Requirement | Description |
|-------------|-------------|
| ID | FR-AE-003 |
| Priority | P0 |
| Description | System shall detect hallucinated APIs with >85% accuracy |
| Rationale | Core value proposition requires high accuracy |
| Acceptance | Test suite shows >85% true positive rate |

#### FR-AE-004: Trust Score Calculation

| Requirement | Description |
|-------------|-------------|
| ID | FR-AE-004 |
| Priority | P0 |
| Description | System shall calculate trust score 0-100 for all analyses |
| Rationale | Trust score is the primary user-facing metric |
| Acceptance | All analyses return valid trust score |

#### FR-AE-005: Confidence Scoring

| Requirement | Description |
|-------------|-------------|
| ID | FR-AE-005 |
| Priority | P1 |
| Description | Each detected issue shall include a confidence score |
| Rationale | Users need to know how certain the detection is |
| Acceptance | All issues have confidence 0-100 |

### 4.2 User Interface Requirements

#### FR-UI-001: Dashboard Load Time

| Requirement | Description |
|-------------|-------------|
| ID | FR-UI-001 |
| Priority | P0 |
| Description | Dashboard shall load within 2 seconds |
| Rationale | User experience requires fast load times |
| Acceptance | 95th percentile load time <2s |

#### FR-UI-002: Responsive Design

| Requirement | Description |
|-------------|-------------|
| ID | FR-UI-002 |
| Priority | P1 |
| Description | UI shall be usable on screens ≥1024px wide |
| Rationale | Support laptop and desktop users |
| Acceptance | All features accessible on 1024px viewport |

#### FR-UI-003: Accessibility

| Requirement | Description |
|-------------|-------------|
| ID | FR-UI-003 |
| Priority | P1 |
| Description | UI shall meet WCAG 2.1 AA standards |
| Rationale | Ensure accessibility for all users |
| Acceptance | Automated and manual accessibility tests pass |

### 4.3 Integration Requirements

#### FR-INT-001: GitHub Integration

| Requirement | Description |
|-------------|-------------|
| ID | FR-INT-001 |
| Priority | P0 |
| Description | System shall integrate with GitHub via GitHub App |
| Rationale | GitHub is the primary code hosting platform |
| Acceptance | Installation flow works, status checks appear |

#### FR-INT-002: VS Code Extension

| Requirement | Description |
|-------------|-------------|
| ID | FR-INT-002 |
| Priority | P0 |
| Description | System shall provide VS Code extension |
| Rationale | VS Code is the most popular editor |
| Acceptance | Extension installable from marketplace |

#### FR-INT-003: API Availability

| Requirement | Description |
|-------------|-------------|
| ID | FR-INT-003 |
| Priority | P1 |
| Description | System shall provide REST API for integrations |
| Rationale | Enable custom tooling and automation |
| Acceptance | API endpoints documented and functional |

---

## 5. Non-Functional Requirements

### 5.1 Performance Requirements

#### NFR-PERF-001: Analysis Speed

| Requirement | Description |
|-------------|-------------|
| ID | NFR-PERF-001 |
| Description | Analysis shall complete within 5 seconds for files <1000 LOC |
| Measurement | 95th percentile analysis time |
| Target | <5 seconds |

#### NFR-PERF-002: API Response Time

| Requirement | Description |
|-------------|-------------|
| ID | NFR-PERF-002 |
| Description | API endpoints shall respond within 500ms |
| Measurement | 95th percentile response time |
| Target | <500ms |

#### NFR-PERF-003: Concurrent Users

| Requirement | Description |
|-------------|-------------|
| ID | NFR-PERF-003 |
| Description | System shall support 1000 concurrent users |
| Measurement | Load test with 1000 simulated users |
| Target | No degradation in response time |

### 5.2 Reliability Requirements

#### NFR-REL-001: Uptime

| Requirement | Description |
|-------------|-------------|
| ID | NFR-REL-001 |
| Description | System shall maintain 99.9% uptime |
| Measurement | Monthly uptime percentage |
| Target | 99.9% (43.8 minutes downtime/month max) |

#### NFR-REL-002: Data Durability

| Requirement | Description |
|-------------|-------------|
| ID | NFR-REL-002 |
| Description | Analysis results shall be stored durably |
| Measurement | Data loss incidents |
| Target | Zero data loss |

#### NFR-REL-003: Backup Recovery

| Requirement | Description |
|-------------|-------------|
| ID | NFR-REL-003 |
| Description | System shall recover from backups within 4 hours |
| Measurement | Recovery time objective (RTO) |
| Target | <4 hours |

### 5.3 Security Requirements

#### NFR-SEC-001: Encryption at Rest

| Requirement | Description |
|-------------|-------------|
| ID | NFR-SEC-001 |
| Description | All stored data shall be encrypted at rest |
| Standard | AES-256 |
| Verification | Security audit |

#### NFR-SEC-002: Encryption in Transit

| Requirement | Description |
|-------------|-------------|
| ID | NFR-SEC-002 |
| Description | All network traffic shall use TLS 1.3 |
| Standard | TLS 1.3 |
| Verification | SSL Labs A+ rating |

#### NFR-SEC-003: Authentication

| Requirement | Description |
|-------------|-------------|
| ID | NFR-SEC-003 |
| Description | System shall use secure authentication |
| Standards | bcrypt for passwords, JWT for sessions |
| Verification | Security audit |

### 5.4 Scalability Requirements

#### NFR-SCALE-001: Horizontal Scaling

| Requirement | Description |
|-------------|-------------|
| ID | NFR-SCALE-001 |
| Description | System shall scale horizontally |
| Approach | Containerized, stateless services |
| Verification | Load test with scaled instances |

#### NFR-SCALE-002: Database Scaling

| Requirement | Description |
|-------------|-------------|
| ID | NFR-SCALE-002 |
| Description | Database shall handle 10M analyses |
| Approach | Neon Postgres with connection pooling |
| Verification | Performance test with synthetic data |

### 5.5 Maintainability Requirements

#### NFR-MAINT-001: Code Quality

| Requirement | Description |
|-------------|-------------|
| ID | NFR-MAINT-001 |
| Description | Codebase shall maintain >80% test coverage |
| Measurement | Automated coverage reports |
| Target | >80% |

#### NFR-MAINT-002: Documentation

| Requirement | Description |
|-------------|-------------|
| ID | NFR-MAINT-002 |
| Description | All APIs shall be documented |
| Standard | OpenAPI 3.0 |
| Verification | Documentation review |

---

## 6. API Specifications

### 6.1 API Overview

The Code Trust Scorer API provides programmatic access to analysis functionality. All endpoints require authentication via API key.

**Base URL:** `https://api.codetrust.dev/v1`

**Authentication:**
```
Authorization: Bearer <api_key>
```

### 6.2 Endpoints

#### 6.2.1 POST /analyze

Analyze code and return trust score with issues.

**Request:**

```http
POST /v1/analyze
Content-Type: application/json
Authorization: Bearer cts_abc123

{
  "code": "const result = array.flatten();",
  "language": "typescript",
  "filename": "example.ts",
  "context": {
    "framework": "nextjs",
    "version": "16.0.0"
  }
}
```

**Response:**

```json
{
  "id": "analysis_789xyz",
  "trustScore": 72,
  "confidence": 0.95,
  "issues": [
    {
      "id": "issue_001",
      "type": "hallucinated-api",
      "severity": "error",
      "message": "Array.flatten() does not exist",
      "suggestion": "Use Array.flat() instead",
      "location": {
        "line": 1,
        "column": 16,
        "length": 7
      },
      "confidence": 0.98
    }
  ],
  "metadata": {
    "language": "typescript",
    "linesAnalyzed": 1,
    "analysisTimeMs": 127
  }
}
```

**Error Response:**

```json
{
  "error": {
    "code": "INVALID_LANGUAGE",
    "message": "Unsupported language: rust",
    "details": {
      "supportedLanguages": ["typescript", "javascript", "python"]
    }
  }
}
```

#### 6.2.2 POST /analyze/batch

Analyze multiple files in a batch.

**Request:**

```http
POST /v1/analyze/batch
Content-Type: application/json
Authorization: Bearer cts_abc123

{
  "files": [
    {
      "path": "src/app/page.tsx",
      "code": "..."
    },
    {
      "path": "src/lib/api.ts",
      "code": "..."
    }
  ],
  "context": {
    "framework": "nextjs"
  }
}
```

**Response:**

```json
{
  "id": "batch_123abc",
  "overallTrustScore": 78,
  "results": [
    {
      "path": "src/app/page.tsx",
      "trustScore": 85,
      "issueCount": 2
    },
    {
      "path": "src/lib/api.ts",
      "trustScore": 71,
      "issueCount": 5
    }
  ],
  "summary": {
    "filesAnalyzed": 2,
    "totalIssues": 7,
    "analysisTimeMs": 340
  }
}
```

#### 6.2.3 GET /analyses/:id

Retrieve a previous analysis result.

**Request:**

```http
GET /v1/analyses/analysis_789xyz
Authorization: Bearer cts_abc123
```

**Response:**

```json
{
  "id": "analysis_789xyz",
  "status": "complete",
  "trustScore": 72,
  "createdAt": "2026-02-06T12:00:00Z",
  "issues": [...]
}
```

#### 6.2.4 GET /projects

List all projects for the authenticated user.

**Request:**

```http
GET /v1/projects
Authorization: Bearer cts_abc123
```

**Response:**

```json
{
  "projects": [
    {
      "id": "proj_123",
      "name": "my-saas-app",
      "trustScore": 78,
      "lastAnalysis": "2026-02-06T12:00:00Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "perPage": 20
  }
}
```

#### 6.2.5 POST /projects

Create a new project.

**Request:**

```http
POST /v1/projects
Content-Type: application/json
Authorization: Bearer cts_abc123

{
  "name": "new-project",
  "description": "My new SaaS project",
  "repository": "https://github.com/user/new-project"
}
```

**Response:**

```json
{
  "id": "proj_456",
  "name": "new-project",
  "createdAt": "2026-02-06T12:00:00Z"
}
```

### 6.3 Rate Limits

| Endpoint | Rate Limit |
|----------|------------|
| POST /analyze | 60/minute |
| POST /analyze/batch | 10/minute |
| GET endpoints | 100/minute |
| POST endpoints | 30/minute |

Rate limit headers:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1707220800
```

### 6.4 Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Invalid or missing API key |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| RATE_LIMITED | 429 | Rate limit exceeded |
| INVALID_INPUT | 400 | Invalid request body |
| INVALID_LANGUAGE | 400 | Unsupported language |
| FILE_TOO_LARGE | 400 | File exceeds size limit |
| INTERNAL_ERROR | 500 | Server error |

---

## 7. Data Models

### 7.1 Entity Relationship Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    User     │────<│  Project    │────<│  Analysis   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   ApiKey    │     │   Member    │     │    Issue    │
└─────────────┘     └─────────────┘     └─────────────┘
```

### 7.2 User Model

```typescript
interface User {
  id: string;              // UUID
  email: string;           // Unique email address
  passwordHash?: string;   // bcrypt hash (null for OAuth)
  name: string;            // Display name
  avatarUrl?: string;      // Profile picture URL
  githubId?: string;       // GitHub user ID (for OAuth)
  emailVerified: boolean;  // Email verification status
  plan: Plan;              // Subscription plan
  createdAt: Date;         // Account creation timestamp
  updatedAt: Date;         // Last update timestamp
  lastLoginAt?: Date;      // Last login timestamp
}

enum Plan {
  FREE = 'free',
  PRO = 'pro',
  ENTERPRISE = 'enterprise'
}
```

### 7.3 Project Model

```typescript
interface Project {
  id: string;                // UUID
  ownerId: string;           // User ID of owner
  name: string;              // Project name
  description?: string;      // Optional description
  repositoryUrl?: string;    // GitHub repository URL
  githubInstallationId?: string; // GitHub App installation
  trustScore: number;        // Current trust score (0-100)
  threshold: number;         // Minimum trust score threshold
  settings: ProjectSettings; // Project-specific settings
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectSettings {
  enabledRules: string[];          // List of enabled rule IDs
  ignoredPatterns: string[];       // Glob patterns to ignore
  notificationWebhook?: string;    // Webhook URL
  slackChannel?: string;           // Slack notification channel
}
```

### 7.4 Analysis Model

```typescript
interface Analysis {
  id: string;              // UUID
  projectId: string;       // Project ID
  userId: string;          // User who triggered analysis
  status: AnalysisStatus;  // Current status
  trustScore: number;      // Calculated trust score
  confidence: number;      // Confidence in score (0-1)
  filesAnalyzed: number;   // Number of files analyzed
  linesAnalyzed: number;   // Total lines of code
  issueCount: IssueCounts; // Issue counts by severity
  metadata: AnalysisMetadata;
  createdAt: Date;
  completedAt?: Date;
}

enum AnalysisStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETE = 'complete',
  FAILED = 'failed'
}

interface IssueCounts {
  error: number;
  warning: number;
  info: number;
}

interface AnalysisMetadata {
  source: 'api' | 'vscode' | 'github' | 'cli';
  branch?: string;
  commit?: string;
  prNumber?: number;
  analysisTimeMs: number;
}
```

### 7.5 Issue Model

```typescript
interface Issue {
  id: string;              // UUID
  analysisId: string;      // Parent analysis ID
  type: IssueType;         // Issue category
  ruleId: string;          // Specific rule that triggered
  severity: Severity;      // Error, warning, or info
  confidence: number;      // Confidence score (0-1)
  message: string;         // Human-readable message
  suggestion?: string;     // Fix suggestion
  location: Location;      // Code location
  codeSnippet?: string;    // Affected code
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

enum IssueType {
  HALLUCINATED_API = 'hallucinated-api',
  DEPRECATED_METHOD = 'deprecated-method',
  SECURITY_VULNERABILITY = 'security-vulnerability',
  QUALITY_ISSUE = 'quality-issue',
  STYLE_ISSUE = 'style-issue'
}

enum Severity {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

interface Location {
  file: string;
  line: number;
  column: number;
  endLine?: number;
  endColumn?: number;
}
```

### 7.6 ApiKey Model

```typescript
interface ApiKey {
  id: string;              // UUID
  userId: string;          // Owner user ID
  name: string;            // Key description
  keyHash: string;         // SHA-256 hash of key
  keyPrefix: string;       // First 8 chars for identification
  permissions: Permission[];
  lastUsedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
}

enum Permission {
  READ = 'read',
  WRITE = 'write',
  ADMIN = 'admin'
}
```

### 7.7 Database Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  github_id VARCHAR(50) UNIQUE,
  email_verified BOOLEAN DEFAULT FALSE,
  plan VARCHAR(20) DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  repository_url VARCHAR(500),
  github_installation_id VARCHAR(50),
  trust_score INTEGER DEFAULT 100,
  threshold INTEGER DEFAULT 70,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Analyses table
CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'pending',
  trust_score INTEGER,
  confidence DECIMAL(3,2),
  files_analyzed INTEGER DEFAULT 0,
  lines_analyzed INTEGER DEFAULT 0,
  issue_counts JSONB DEFAULT '{"error":0,"warning":0,"info":0}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Issues table
CREATE TABLE issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  rule_id VARCHAR(100) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  confidence DECIMAL(3,2) NOT NULL,
  message TEXT NOT NULL,
  suggestion TEXT,
  location JSONB NOT NULL,
  code_snippet TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- API Keys table
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  key_hash VARCHAR(64) NOT NULL,
  key_prefix VARCHAR(10) NOT NULL,
  permissions TEXT[] DEFAULT ARRAY['read'],
  last_used_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_projects_owner ON projects(owner_id);
CREATE INDEX idx_analyses_project ON analyses(project_id);
CREATE INDEX idx_analyses_created ON analyses(created_at DESC);
CREATE INDEX idx_issues_analysis ON issues(analysis_id);
CREATE INDEX idx_issues_severity ON issues(severity);
CREATE INDEX idx_api_keys_user ON api_keys(user_id);
CREATE INDEX idx_api_keys_prefix ON api_keys(key_prefix);
```

---

## 8. Security Requirements

### 8.1 Authentication Security

#### 8.1.1 Password Requirements

| Requirement | Value |
|-------------|-------|
| Minimum length | 8 characters |
| Required characters | Letter and number |
| Hash algorithm | bcrypt (cost factor 12) |
| Password history | Last 5 passwords stored |

#### 8.1.2 Session Management

| Requirement | Value |
|-------------|-------|
| Session token | JWT (HS256) |
| Token expiry | 7 days |
| Refresh mechanism | Silent refresh before expiry |
| Concurrent sessions | Maximum 10 |
| Session storage | HttpOnly, Secure cookies |

#### 8.1.3 OAuth Security

| Requirement | Value |
|-------------|-------|
| State parameter | Required, cryptographically random |
| PKCE | Required for all OAuth flows |
| Token storage | Encrypted at rest |

### 8.2 API Security

#### 8.2.1 API Key Management

| Requirement | Value |
|-------------|-------|
| Key format | `cts_` prefix + 32 random chars |
| Storage | SHA-256 hash only |
| Transmission | Bearer token in header |
| Rotation | User-initiated, no forced rotation |

#### 8.2.2 Rate Limiting

| Tier | Requests/minute |
|------|-----------------|
| Free | 30 |
| Pro | 100 |
| Enterprise | 1000 |

#### 8.2.3 Input Validation

- All inputs sanitized before processing
- Maximum request body size: 10MB
- Maximum code length: 500,000 characters
- File path validation against traversal attacks

### 8.3 Data Security

#### 8.3.1 Encryption

| Data State | Encryption |
|------------|------------|
| At rest | AES-256 |
| In transit | TLS 1.3 |
| Backups | AES-256 |

#### 8.3.2 Data Retention

| Data Type | Retention Period |
|-----------|------------------|
| Analysis results | 90 days (free), 1 year (pro/enterprise) |
| Code snippets | 7 days |
| Audit logs | 1 year |
| Deleted accounts | 30 days grace period |

#### 8.3.3 Code Handling

- Code is never stored permanently
- Code is analyzed in isolated environments
- Code is deleted immediately after analysis
- Enterprise: option to never send code to cloud

### 8.4 Compliance

#### 8.4.1 GDPR Compliance

- [ ] Data processing agreement available
- [ ] Right to access personal data
- [ ] Right to data portability
- [ ] Right to deletion (with 30-day window)
- [ ] Privacy policy published
- [ ] Cookie consent implemented

#### 8.4.2 SOC 2 Readiness

- [ ] Access controls documented
- [ ] Audit logging enabled
- [ ] Incident response plan
- [ ] Vendor risk management
- [ ] Change management process

### 8.5 Security Monitoring

| Capability | Implementation |
|------------|----------------|
| Intrusion detection | Cloud provider WAF |
| DDoS protection | Cloudflare |
| Vulnerability scanning | Weekly automated scans |
| Penetration testing | Annual third-party audit |
| Incident alerting | PagerDuty integration |

---

## 9. Success Metrics

### 9.1 Product Metrics

| Metric | Definition | Target (6 months) |
|--------|------------|-------------------|
| DAU | Daily active users | 5,000 |
| WAU | Weekly active users | 15,000 |
| MAU | Monthly active users | 30,000 |
| DAU/MAU | Engagement ratio | 17% |
| Analyses/user/week | Usage intensity | 50 |
| Issues found | Total issues detected | 1,000,000 |

### 9.2 Quality Metrics

| Metric | Definition | Target |
|--------|------------|--------|
| False positive rate | Issues marked wrong | <10% |
| Detection accuracy | True positives / Total | >85% |
| Analysis success rate | Completed analyses | >99% |
| User satisfaction | NPS score | >40 |

### 9.3 Business Metrics

| Metric | Definition | Target (Y1) |
|--------|------------|-------------|
| MRR | Monthly recurring revenue | $100,000 |
| ARR | Annual recurring revenue | $1,200,000 |
| Paying customers | Total paid accounts | 2,500 |
| Conversion rate | Free to paid | 5% |
| Churn rate | Monthly cancellations | <3% |
| LTV | Lifetime value | $400 |
| CAC | Customer acquisition cost | $80 |

### 9.4 Technical Metrics

| Metric | Definition | Target |
|--------|------------|--------|
| Uptime | Service availability | 99.9% |
| API latency (p95) | 95th percentile response | <500ms |
| Analysis time (p95) | 95th percentile analysis | <5s |
| Error rate | Failed requests | <0.1% |

---

## 10. Appendices

### 10.1 Appendix A: Rule Catalog

| Rule ID | Type | Severity | Description |
|---------|------|----------|-------------|
| CTS001 | hallucinated-api | error | Non-existent method call |
| CTS002 | hallucinated-api | error | Wrong method signature |
| CTS003 | hallucinated-api | warning | Potentially wrong import |
| CTS010 | deprecated-method | warning | Deprecated React lifecycle |
| CTS011 | deprecated-method | warning | Deprecated Node.js API |
| CTS012 | deprecated-method | info | Deprecated browser API |
| CTS020 | security | error | SQL injection risk |
| CTS021 | security | error | XSS vulnerability |
| CTS022 | security | error | Hardcoded credentials |
| CTS023 | security | warning | Insecure randomness |
| CTS030 | quality | info | Over-abstraction detected |
| CTS031 | quality | info | Dead code detected |

### 10.2 Appendix B: Supported Frameworks

| Framework | Version | Support Level |
|-----------|---------|---------------|
| React | 18.x, 19.x | Full |
| Next.js | 14.x, 15.x, 16.x | Full |
| Node.js | 18.x, 20.x, 22.x | Full |
| Express | 4.x | Full |
| Fastify | 4.x | Partial |
| Hono | 4.x | Partial |
| Django | 4.x, 5.x | Full |
| FastAPI | 0.100+ | Full |
| Flask | 2.x, 3.x | Partial |

### 10.3 Appendix C: API Error Reference

| Error Code | HTTP | Description | Resolution |
|------------|------|-------------|------------|
| E001 | 400 | Invalid JSON body | Check request format |
| E002 | 400 | Missing required field | Add required field |
| E003 | 400 | Invalid language | Use supported language |
| E004 | 400 | Code too large | Reduce file size |
| E101 | 401 | Invalid API key | Check key validity |
| E102 | 401 | Expired API key | Generate new key |
| E103 | 403 | Insufficient permissions | Upgrade plan |
| E201 | 404 | Analysis not found | Check analysis ID |
| E202 | 404 | Project not found | Check project ID |
| E301 | 429 | Rate limit exceeded | Wait and retry |
| E501 | 500 | Internal error | Contact support |

### 10.4 Appendix D: Glossary

| Term | Definition |
|------|------------|
| Trust Score | Composite quality score from 0-100 |
| Hallucinated API | API call generated by AI that doesn't exist |
| Confidence Score | How certain the system is about a detection |
| False Positive | An issue incorrectly flagged by the analyzer |
| Quick Fix | An automated suggestion to resolve an issue |
| Rule | A specific check performed during analysis |
| Threshold | Minimum trust score required to pass |

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
| QA Lead | | | |
