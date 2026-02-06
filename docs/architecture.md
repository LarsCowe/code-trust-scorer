# Architecture Document

## Code Trust Scorer

**Document Version:** 1.0  
**Last Updated:** 2026-02-06  
**Author:** Engineering Team  
**Status:** Draft

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Tech Stack](#2-tech-stack)
3. [System Architecture](#3-system-architecture)
4. [Database Schema](#4-database-schema)
5. [API Design](#5-api-design)
6. [File Structure](#6-file-structure)
7. [Security Architecture](#7-security-architecture)
8. [Performance Considerations](#8-performance-considerations)
9. [Deployment Strategy](#9-deployment-strategy)
10. [Monitoring and Observability](#10-monitoring-and-observability)

---

## 1. Architecture Overview

### 1.1 System Overview

Code Trust Scorer is a cloud-native application designed to analyze AI-generated code and provide trust scores. The system consists of multiple interconnected components that work together to provide real-time code analysis across various touchpoints.

### 1.2 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   Web App   │    │   VS Code   │    │   GitHub    │    │    CLI      │  │
│  │  (Next.js)  │    │  Extension  │    │    App      │    │             │  │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘    └──────┬──────┘  │
│         │                  │                  │                  │          │
└─────────┼──────────────────┼──────────────────┼──────────────────┼──────────┘
          │                  │                  │                  │
          ▼                  ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API LAYER                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Next.js API Routes + tRPC                        │   │
│  │                                                                     │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────────┐   │   │
│  │  │   Auth    │  │  Projects │  │ Analyses  │  │  Webhooks     │   │   │
│  │  │  Router   │  │  Router   │  │  Router   │  │   Router      │   │   │
│  │  └───────────┘  └───────────┘  └───────────┘  └───────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SERVICE LAYER                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────────────┐  │   │
│  │  │   Analysis    │  │   Scoring     │  │      Rules            │  │   │
│  │  │   Engine      │  │   Service     │  │      Engine           │  │   │
│  │  └───────────────┘  └───────────────┘  └───────────────────────┘  │   │
│  │                                                                     │   │
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────────────┐  │   │
│  │  │    Parser     │  │  Notification │  │      GitHub           │  │   │
│  │  │   Service     │  │   Service     │  │      Service          │  │   │
│  │  └───────────────┘  └───────────────┘  └───────────────────────┘  │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATA LAYER                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────────┐   │
│  │   Neon Postgres   │  │      Redis        │  │     Blob Storage      │   │
│  │   (Primary DB)    │  │     (Cache)       │  │   (Analysis Results)  │   │
│  └───────────────────┘  └───────────────────┘  └───────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.3 Design Principles

#### 1.3.1 Serverless-First

The architecture leverages serverless computing where possible:
- Vercel for hosting and API routes
- Neon Postgres for serverless database
- Edge functions for low-latency operations

#### 1.3.2 Event-Driven

Key operations are event-driven:
- GitHub webhooks trigger analyses
- File saves in VS Code trigger analyses
- Analysis completion triggers notifications

#### 1.3.3 Separation of Concerns

Clear boundaries between:
- Presentation (clients)
- Business logic (services)
- Data access (repositories)

#### 1.3.4 Horizontal Scalability

All components designed for horizontal scaling:
- Stateless API routes
- Connection pooling for database
- Distributed caching

---

## 2. Tech Stack

### 2.1 Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0 | React framework with App Router |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | v4 | Utility-first styling |
| shadcn/ui | Latest | Component library |
| React Query | v5 | Server state management |
| Zustand | v4 | Client state management |
| Recharts | v2 | Charts and visualizations |

### 2.2 Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js API Routes | 16.0 | API endpoints |
| tRPC | v11 | Type-safe API layer |
| Drizzle ORM | Latest | Database ORM |
| Zod | v3 | Schema validation |
| tree-sitter | Latest | Code parsing |

### 2.3 Database

| Technology | Purpose |
|------------|---------|
| Neon Postgres | Primary database |
| Drizzle ORM | Query building and migrations |
| Redis (Upstash) | Caching and rate limiting |

### 2.4 Infrastructure

| Technology | Purpose |
|------------|---------|
| Vercel | Hosting and deployment |
| GitHub Actions | CI/CD |
| Cloudflare | CDN and DDoS protection |
| Resend | Email delivery |
| Inngest | Background jobs |

### 2.5 Development Tools

| Tool | Purpose |
|------|---------|
| pnpm | Package manager |
| ESLint | Code linting |
| Prettier | Code formatting |
| Vitest | Unit testing |
| Playwright | E2E testing |
| TypeDoc | API documentation |

### 2.6 VS Code Extension

| Technology | Purpose |
|------------|---------|
| VS Code Extension API | Extension framework |
| TypeScript | Development language |
| esbuild | Bundling |
| tree-sitter-wasm | Code parsing |

---

## 3. System Architecture

### 3.1 Component Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                FRONTEND                                       │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                           Next.js App Router                           │  │
│  │                                                                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │  │
│  │  │    Pages     │  │  Components  │  │    Hooks     │  │   Stores   │ │  │
│  │  │              │  │              │  │              │  │            │ │  │
│  │  │ /dashboard   │  │ TrustScore   │  │ useAnalysis  │  │ authStore  │ │  │
│  │  │ /projects    │  │ IssueCard    │  │ useProjects  │  │ uiStore    │ │  │
│  │  │ /analyses    │  │ TrendChart   │  │ useIssues    │  │            │ │  │
│  │  │ /settings    │  │ Dashboard    │  │              │  │            │ │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └────────────┘ │  │
│  │                                                                        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                                   API                                         │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                              tRPC Router                               │  │
│  │                                                                        │  │
│  │  ┌──────────────────────────────────────────────────────────────────┐ │  │
│  │  │                         Routers                                  │ │  │
│  │  │                                                                  │ │  │
│  │  │  auth.router     project.router    analysis.router               │ │  │
│  │  │  ├─ signIn       ├─ list           ├─ create                     │ │  │
│  │  │  ├─ signUp       ├─ get            ├─ get                        │ │  │
│  │  │  ├─ signOut      ├─ create         ├─ list                       │ │  │
│  │  │  └─ getSession   ├─ update         └─ getIssues                  │ │  │
│  │  │                  └─ delete                                       │ │  │
│  │  │                                                                  │ │  │
│  │  │  issue.router    settings.router   webhook.router                │ │  │
│  │  │  ├─ get          ├─ get            ├─ github                     │ │  │
│  │  │  ├─ ignore       ├─ update         └─ handleEvent                │ │  │
│  │  │  └─ fix          └─ getApiKeys                                   │ │  │
│  │  └──────────────────────────────────────────────────────────────────┘ │  │
│  │                                                                        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                                SERVICES                                       │
│                                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐                 │
│  │ AnalysisEngine │  │ ScoringService │  │  RulesEngine   │                 │
│  │                │  │                │  │                │                 │
│  │ - parseCode    │  │ - calculate    │  │ - loadRules    │                 │
│  │ - runAnalysis  │  │ - aggregate    │  │ - executeRule  │                 │
│  │ - detectIssues │  │ - getTrend     │  │ - matchPattern │                 │
│  └────────────────┘  └────────────────┘  └────────────────┘                 │
│                                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐                 │
│  │ ParserService  │  │ GitHubService  │  │ NotifyService  │                 │
│  │                │  │                │  │                │                 │
│  │ - parseTS      │  │ - getContent   │  │ - sendEmail    │                 │
│  │ - parsePython  │  │ - createCheck  │  │ - sendSlack    │                 │
│  │ - getAST       │  │ - addComment   │  │ - sendWebhook  │                 │
│  └────────────────┘  └────────────────┘  └────────────────┘                 │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                              DATA ACCESS                                      │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                          Drizzle ORM                                   │  │
│  │                                                                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │  │
│  │  │    users     │  │   projects   │  │   analyses   │  │   issues   │ │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └────────────┘ │  │
│  │                                                                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │  │
│  │  │   api_keys   │  │   members    │  │   settings   │                 │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘                 │  │
│  │                                                                        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Data Flow: Analysis Request

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ANALYSIS DATA FLOW                                    │
└─────────────────────────────────────────────────────────────────────────────┘

1. Request Initiation
   ┌─────────┐         ┌─────────┐         ┌─────────┐
   │ Client  │───────▶│   API   │───────▶│ Validate│
   │         │  POST   │  Route  │  Zod    │  Input  │
   └─────────┘         └─────────┘         └─────────┘
                                                │
                                                ▼
2. Analysis Processing
   ┌─────────┐         ┌─────────┐         ┌─────────┐
   │  Parse  │◀────────│ Create  │         │  Store  │
   │  Code   │         │ Analysis│───────▶│ Record  │
   └─────────┘         └─────────┘   DB    └─────────┘
        │
        ▼
   ┌─────────┐         ┌─────────┐         ┌─────────┐
   │  Build  │───────▶│  Apply  │───────▶│ Collect │
   │   AST   │         │  Rules  │         │ Issues  │
   └─────────┘         └─────────┘         └─────────┘
                                                │
                                                ▼
3. Score Calculation
   ┌─────────┐         ┌─────────┐         ┌─────────┐
   │ Weight  │───────▶│Calculate│───────▶│ Update  │
   │ Issues  │         │  Score  │         │ Record  │
   └─────────┘         └─────────┘         └─────────┘
                                                │
                                                ▼
4. Response & Notifications
   ┌─────────┐         ┌─────────┐         ┌─────────┐
   │  Send   │◀────────│ Format  │         │ Trigger │
   │Response │         │ Result  │◀────────│ Notify  │
   └─────────┘         └─────────┘         └─────────┘
```

### 3.3 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────┘

Email/Password Login:
┌─────────┐         ┌─────────┐         ┌─────────┐         ┌─────────┐
│  User   │───────▶│  Login  │───────▶│ Verify  │───────▶│ Create  │
│  Input  │  POST   │   API   │  bcrypt │Password │  JWT    │ Session │
└─────────┘         └─────────┘         └─────────┘         └─────────┘
                                                                  │
                                                                  ▼
                                                            ┌─────────┐
                                                            │  Set    │
                                                            │ Cookie  │
                                                            └─────────┘

GitHub OAuth Login:
┌─────────┐         ┌─────────┐         ┌─────────┐         ┌─────────┐
│  User   │───────▶│ GitHub  │───────▶│Exchange │───────▶│ Fetch   │
│  Click  │ Redirect│  OAuth  │  Code   │  Token  │  Token  │ Profile │
└─────────┘         └─────────┘         └─────────┘         └─────────┘
                                                                  │
                                                                  ▼
                                                            ┌─────────┐
                                                            │ Create/ │
                                                            │ Update  │
                                                            │  User   │
                                                            └─────────┘
```

### 3.4 VS Code Extension Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         VS CODE EXTENSION                                     │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                         Extension Host                                 │  │
│  │                                                                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │  │
│  │  │  Activation  │  │  Commands    │  │   Events     │                 │  │
│  │  │              │  │              │  │              │                 │  │
│  │  │ onLanguage   │  │ analyze      │  │ onDidSave    │                 │  │
│  │  │ onCommand    │  │ openDashboard│  │ onDidOpen    │                 │  │
│  │  │              │  │ ignoreIssue  │  │ onDidChange  │                 │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘                 │  │
│  │                                                                        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                      │                                       │
│                                      ▼                                       │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                         Core Services                                  │  │
│  │                                                                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │  │
│  │  │   Analyzer   │  │   Decorator  │  │  API Client  │                 │  │
│  │  │              │  │              │  │              │                 │  │
│  │  │ Local parse  │  │ Highlights   │  │ Remote API   │                 │  │
│  │  │ Rule check   │  │ Diagnostics  │  │ Auth         │                 │  │
│  │  │ Score calc   │  │ CodeLens     │  │ Sync         │                 │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘                 │  │
│  │                                                                        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                      │                                       │
│                                      ▼                                       │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                            UI Components                               │  │
│  │                                                                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                 │  │
│  │  │   Sidebar    │  │  Status Bar  │  │   Webview    │                 │  │
│  │  │    Panel     │  │    Item      │  │    Panel     │                 │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘                 │  │
│  │                                                                        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Database Schema

### 4.1 Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DATABASE SCHEMA                                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌───────────────────┐       ┌───────────────────┐       ┌───────────────────┐
│      users        │       │     projects      │       │    analyses       │
├───────────────────┤       ├───────────────────┤       ├───────────────────┤
│ id          PK    │──┐    │ id          PK    │──┐    │ id          PK    │
│ email             │  │    │ owner_id    FK    │──┘    │ project_id  FK    │──┐
│ password_hash     │  │    │ name              │       │ user_id     FK    │  │
│ name              │  │    │ description       │       │ status            │  │
│ avatar_url        │  └───▶│ repository_url    │       │ trust_score       │  │
│ github_id         │       │ github_install_id │       │ confidence        │  │
│ email_verified    │       │ trust_score       │       │ files_analyzed    │  │
│ plan              │       │ threshold         │       │ lines_analyzed    │  │
│ created_at        │       │ settings (JSONB)  │◀──────│ issue_counts      │  │
│ updated_at        │       │ created_at        │       │ metadata (JSONB)  │  │
│ last_login_at     │       │ updated_at        │       │ created_at        │  │
└───────────────────┘       └───────────────────┘       │ completed_at      │  │
        │                           │                   └───────────────────┘  │
        │                           │                           │              │
        ▼                           ▼                           ▼              │
┌───────────────────┐       ┌───────────────────┐       ┌───────────────────┐  │
│     api_keys      │       │     members       │       │      issues       │  │
├───────────────────┤       ├───────────────────┤       ├───────────────────┤  │
│ id          PK    │       │ id          PK    │       │ id          PK    │  │
│ user_id     FK    │       │ project_id  FK    │       │ analysis_id FK    │◀─┘
│ name              │       │ user_id     FK    │       │ type              │
│ key_hash          │       │ role              │       │ rule_id           │
│ key_prefix        │       │ invited_by  FK    │       │ severity          │
│ permissions       │       │ invited_at        │       │ confidence        │
│ last_used_at      │       │ accepted_at       │       │ message           │
│ expires_at        │       │ created_at        │       │ suggestion        │
│ created_at        │       └───────────────────┘       │ location (JSONB)  │
└───────────────────┘                                   │ code_snippet      │
                                                        │ metadata (JSONB)  │
┌───────────────────┐       ┌───────────────────┐       │ created_at        │
│     sessions      │       │   audit_logs      │       └───────────────────┘
├───────────────────┤       ├───────────────────┤
│ id          PK    │       │ id          PK    │
│ user_id     FK    │       │ user_id     FK    │
│ token_hash        │       │ action            │
│ device            │       │ resource_type     │
│ ip_address        │       │ resource_id       │
│ user_agent        │       │ details (JSONB)   │
│ expires_at        │       │ ip_address        │
│ created_at        │       │ created_at        │
└───────────────────┘       └───────────────────┘
```

### 4.2 Drizzle Schema Definitions

```typescript
// src/db/schema/users.ts
import { pgTable, uuid, varchar, boolean, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const planEnum = pgEnum('plan', ['free', 'pro', 'enterprise']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  passwordHash: varchar('password_hash', { length: 255 }),
  name: varchar('name', { length: 255 }).notNull(),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  githubId: varchar('github_id', { length: 50 }).unique(),
  emailVerified: boolean('email_verified').default(false),
  plan: planEnum('plan').default('free'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  lastLoginAt: timestamp('last_login_at'),
});

// src/db/schema/projects.ts
import { pgTable, uuid, varchar, text, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id').references(() => users.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  repositoryUrl: varchar('repository_url', { length: 500 }),
  githubInstallationId: varchar('github_installation_id', { length: 50 }),
  trustScore: integer('trust_score').default(100),
  threshold: integer('threshold').default(70),
  settings: jsonb('settings').default({}),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// src/db/schema/analyses.ts
import { pgTable, uuid, varchar, integer, numeric, jsonb, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { projects } from './projects';
import { users } from './users';

export const analysisStatusEnum = pgEnum('analysis_status', ['pending', 'running', 'complete', 'failed']);

export const analyses = pgTable('analyses', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').references(() => projects.id).notNull(),
  userId: uuid('user_id').references(() => users.id),
  status: analysisStatusEnum('status').default('pending'),
  trustScore: integer('trust_score'),
  confidence: numeric('confidence', { precision: 3, scale: 2 }),
  filesAnalyzed: integer('files_analyzed').default(0),
  linesAnalyzed: integer('lines_analyzed').default(0),
  issueCounts: jsonb('issue_counts').default({ error: 0, warning: 0, info: 0 }),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow(),
  completedAt: timestamp('completed_at'),
});

// src/db/schema/issues.ts
import { pgTable, uuid, varchar, text, numeric, jsonb, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { analyses } from './analyses';

export const issueTypeEnum = pgEnum('issue_type', [
  'hallucinated-api',
  'deprecated-method',
  'security-vulnerability',
  'quality-issue',
  'style-issue'
]);

export const severityEnum = pgEnum('severity', ['error', 'warning', 'info']);

export const issues = pgTable('issues', {
  id: uuid('id').primaryKey().defaultRandom(),
  analysisId: uuid('analysis_id').references(() => analyses.id).notNull(),
  type: issueTypeEnum('type').notNull(),
  ruleId: varchar('rule_id', { length: 100 }).notNull(),
  severity: severityEnum('severity').notNull(),
  confidence: numeric('confidence', { precision: 3, scale: 2 }).notNull(),
  message: text('message').notNull(),
  suggestion: text('suggestion'),
  location: jsonb('location').notNull(),
  codeSnippet: text('code_snippet'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

### 4.3 Indexes and Performance

```sql
-- Performance indexes
CREATE INDEX idx_analyses_project_created ON analyses(project_id, created_at DESC);
CREATE INDEX idx_analyses_status ON analyses(status) WHERE status IN ('pending', 'running');
CREATE INDEX idx_issues_analysis_severity ON issues(analysis_id, severity);
CREATE INDEX idx_issues_type ON issues(type);
CREATE INDEX idx_projects_owner_active ON projects(owner_id) WHERE trust_score > 0;
CREATE INDEX idx_api_keys_prefix ON api_keys(key_prefix);
CREATE INDEX idx_sessions_user_expires ON sessions(user_id, expires_at);

-- Full text search
CREATE INDEX idx_projects_name_fts ON projects USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- JSON indexes
CREATE INDEX idx_analyses_metadata_source ON analyses((metadata->>'source'));
CREATE INDEX idx_issues_location_file ON issues((location->>'file'));
```

### 4.4 Data Retention and Archival

| Data Type | Hot Storage | Warm Storage | Cold Storage |
|-----------|-------------|--------------|--------------|
| Analysis results | 30 days | 6 months | 2 years |
| Issue details | 30 days | 3 months | 1 year |
| Audit logs | 90 days | 1 year | 7 years |
| Session data | 24 hours | N/A | N/A |

**Archival Strategy:**
- Automatic partition pruning for time-series data
- Weekly VACUUM ANALYZE for table statistics
- Monthly pg_repack for table bloat

### 4.5 Query Optimization Patterns

```sql
-- Efficient pagination with cursor
SELECT * FROM analyses 
WHERE project_id = $1 AND created_at < $2
ORDER BY created_at DESC
LIMIT 20;

-- Materialized view for dashboard aggregates
CREATE MATERIALIZED VIEW project_stats AS
SELECT 
  project_id,
  COUNT(*) as total_analyses,
  AVG(trust_score) as avg_trust_score,
  SUM(files_analyzed) as total_files
FROM analyses
WHERE status = 'complete'
GROUP BY project_id;

-- Refresh strategy: every 5 minutes
REFRESH MATERIALIZED VIEW CONCURRENTLY project_stats;
```

---

## 5. API Design

### 5.1 tRPC Router Structure

```typescript
// src/server/routers/_app.ts
import { router } from '../trpc';
import { authRouter } from './auth';
import { projectRouter } from './project';
import { analysisRouter } from './analysis';
import { issueRouter } from './issue';
import { settingsRouter } from './settings';
import { webhookRouter } from './webhook';

export const appRouter = router({
  auth: authRouter,
  project: projectRouter,
  analysis: analysisRouter,
  issue: issueRouter,
  settings: settingsRouter,
  webhook: webhookRouter,
});

export type AppRouter = typeof appRouter;
```

### 5.2 REST API Endpoints

For external integrations, we also provide REST endpoints:

```
API Base URL: https://api.codetrust.dev/v1

Authentication:
  - Header: Authorization: Bearer <api_key>

Endpoints:

POST   /analyze              # Analyze code
POST   /analyze/batch        # Batch analyze files
GET    /analyses/:id         # Get analysis result
GET    /projects             # List projects
POST   /projects             # Create project
GET    /projects/:id         # Get project
PATCH  /projects/:id         # Update project
DELETE /projects/:id         # Delete project
GET    /projects/:id/analyses # List project analyses
POST   /webhooks/github      # GitHub webhook handler

Rate Limits:
  - Free:       30 requests/minute
  - Pro:        100 requests/minute
  - Enterprise: 1000 requests/minute
```

### 5.2.1 API Error Responses

All errors follow RFC 7807 Problem Details format:

```json
{
  "type": "https://codetrust.dev/errors/validation-failed",
  "title": "Validation Failed",
  "status": 400,
  "detail": "The request body contains invalid data",
  "instance": "/v1/analyze",
  "errors": [
    {
      "field": "code",
      "message": "code is required and must be a string"
    }
  ],
  "traceId": "abc123-def456"
}
```

**Standard Error Codes:**

| HTTP Status | Error Type | Description |
|-------------|------------|-------------|
| 400 | `validation-failed` | Request validation failed |
| 401 | `unauthorized` | Missing or invalid API key |
| 403 | `forbidden` | Valid API key but insufficient permissions |
| 404 | `not-found` | Resource not found |
| 409 | `conflict` | Resource already exists or state conflict |
| 422 | `analysis-failed` | Code analysis could not be completed |
| 429 | `rate-limited` | Rate limit exceeded |
| 500 | `internal-error` | Unexpected server error |
| 503 | `service-unavailable` | Temporary service outage |

**Error Response Examples:**

```json
// 401 Unauthorized
{
  "type": "https://codetrust.dev/errors/unauthorized",
  "title": "Unauthorized",
  "status": 401,
  "detail": "API key is missing or invalid",
  "instance": "/v1/projects"
}

// 429 Rate Limited
{
  "type": "https://codetrust.dev/errors/rate-limited",
  "title": "Rate Limit Exceeded",
  "status": 429,
  "detail": "You have exceeded 30 requests per minute",
  "instance": "/v1/analyze",
  "retryAfter": 32
}

// 422 Analysis Failed
{
  "type": "https://codetrust.dev/errors/analysis-failed",
  "title": "Analysis Failed",
  "status": 422,
  "detail": "Could not parse TypeScript file",
  "instance": "/v1/analyze",
  "errors": [
    {
      "line": 42,
      "message": "Unexpected token at position 156"
    }
  ]
}
```

### 5.3 WebSocket Events

For real-time updates (VS Code extension):

```typescript
// Event types
type SocketEvent =
  | { type: 'analysis:started'; analysisId: string }
  | { type: 'analysis:progress'; analysisId: string; progress: number }
  | { type: 'analysis:complete'; analysisId: string; result: AnalysisResult }
  | { type: 'analysis:failed'; analysisId: string; error: string };

// Connection
ws://api.codetrust.dev/ws?token=<session_token>
```

---

## 6. File Structure

### 6.1 Project Structure

```
code-trust-scorer/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                 # CI pipeline
│   │   ├── deploy.yml             # Deployment
│   │   └── release.yml            # Release automation
│   └── CODEOWNERS
│
├── apps/
│   ├── web/                       # Next.js web application
│   │   ├── src/
│   │   │   ├── app/               # App Router pages
│   │   │   │   ├── (auth)/        # Auth group
│   │   │   │   │   ├── login/
│   │   │   │   │   ├── signup/
│   │   │   │   │   └── layout.tsx
│   │   │   │   ├── (dashboard)/   # Dashboard group
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   ├── projects/
│   │   │   │   │   ├── analyses/
│   │   │   │   │   ├── settings/
│   │   │   │   │   └── layout.tsx
│   │   │   │   ├── api/           # API routes
│   │   │   │   │   ├── trpc/
│   │   │   │   │   ├── webhook/
│   │   │   │   │   └── v1/
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── components/        # React components
│   │   │   │   ├── ui/            # shadcn/ui components
│   │   │   │   ├── dashboard/
│   │   │   │   ├── analysis/
│   │   │   │   └── shared/
│   │   │   ├── hooks/             # Custom hooks
│   │   │   ├── lib/               # Utilities
│   │   │   │   ├── trpc.ts
│   │   │   │   ├── auth.ts
│   │   │   │   └── utils.ts
│   │   │   ├── stores/            # Zustand stores
│   │   │   └── styles/            # Global styles
│   │   ├── public/
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   └── vscode/                    # VS Code extension
│       ├── src/
│       │   ├── extension.ts       # Entry point
│       │   ├── commands/
│       │   ├── providers/
│       │   ├── services/
│       │   └── views/
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── analysis-engine/           # Core analysis engine
│   │   ├── src/
│   │   │   ├── parser/
│   │   │   │   ├── typescript.ts
│   │   │   │   └── python.ts
│   │   │   ├── rules/
│   │   │   │   ├── hallucination/
│   │   │   │   ├── deprecation/
│   │   │   │   ├── security/
│   │   │   │   └── quality/
│   │   │   ├── scoring/
│   │   │   └── index.ts
│   │   ├── tests/
│   │   └── package.json
│   │
│   ├── db/                        # Database package
│   │   ├── src/
│   │   │   ├── schema/
│   │   │   ├── migrations/
│   │   │   └── index.ts
│   │   ├── drizzle.config.ts
│   │   └── package.json
│   │
│   ├── api-client/                # Shared API client
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   └── types.ts
│   │   └── package.json
│   │
│   └── shared/                    # Shared utilities
│       ├── src/
│       │   ├── types/
│       │   └── utils/
│       └── package.json
│
├── docs/                          # Documentation
│   ├── product-brief.md
│   ├── prd.md
│   ├── ux-design.md
│   ├── architecture.md
│   └── epics.md
│
├── scripts/                       # Build/deploy scripts
│   ├── setup.sh
│   └── deploy.sh
│
├── .env.example
├── package.json                   # Root package.json
├── pnpm-workspace.yaml
├── turbo.json                     # Turborepo config
├── tsconfig.json
└── README.md
```

### 6.2 Component Organization

```
components/
├── ui/                        # shadcn/ui base components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   └── ...
│
├── dashboard/                 # Dashboard-specific
│   ├── trust-score-card.tsx
│   ├── trend-chart.tsx
│   ├── recent-analyses.tsx
│   └── quick-actions.tsx
│
├── analysis/                  # Analysis-specific
│   ├── analysis-card.tsx
│   ├── analysis-detail.tsx
│   ├── file-tree.tsx
│   └── issue-list.tsx
│
├── issue/                     # Issue-specific
│   ├── issue-card.tsx
│   ├── issue-detail.tsx
│   ├── severity-badge.tsx
│   └── confidence-indicator.tsx
│
├── project/                   # Project-specific
│   ├── project-card.tsx
│   ├── project-settings.tsx
│   └── member-list.tsx
│
└── shared/                    # Shared components
    ├── header.tsx
    ├── sidebar.tsx
    ├── loading-skeleton.tsx
    ├── empty-state.tsx
    └── error-boundary.tsx
```

---

## 7. Security Architecture

### 7.1 Security Layers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SECURITY ARCHITECTURE                               │
└─────────────────────────────────────────────────────────────────────────────┘

Layer 1: Edge Security
┌─────────────────────────────────────────────────────────────────────────────┐
│  Cloudflare                                                                 │
│  ├─ DDoS Protection                                                        │
│  ├─ WAF (Web Application Firewall)                                         │
│  ├─ Bot Detection                                                          │
│  └─ SSL/TLS Termination                                                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
Layer 2: Application Security
┌─────────────────────────────────────────────────────────────────────────────┐
│  Vercel                                                                     │
│  ├─ HTTPS Enforcement                                                      │
│  ├─ Security Headers (CSP, HSTS, X-Frame-Options)                          │
│  ├─ Input Validation (Zod schemas)                                         │
│  └─ Rate Limiting                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
Layer 3: Authentication & Authorization
┌─────────────────────────────────────────────────────────────────────────────┐
│  Auth Layer                                                                 │
│  ├─ Session Management (JWT)                                               │
│  ├─ API Key Authentication                                                 │
│  ├─ OAuth 2.0 (GitHub)                                                     │
│  └─ RBAC (Role-Based Access Control)                                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
Layer 4: Data Security
┌─────────────────────────────────────────────────────────────────────────────┐
│  Database                                                                   │
│  ├─ Encryption at Rest (AES-256)                                           │
│  ├─ Encryption in Transit (TLS 1.3)                                        │
│  ├─ Connection Pooling                                                     │
│  └─ Parameterized Queries (Drizzle ORM)                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Authentication Implementation

```typescript
// src/server/auth/session.ts
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const SESSION_DURATION = 7 * 24 * 60 * 60; // 7 days

export async function createSession(userId: string): Promise<string> {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${SESSION_DURATION}s`)
    .setIssuedAt()
    .sign(JWT_SECRET);

  cookies().set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/',
  });

  return token;
}

export async function verifySession(): Promise<{ userId: string } | null> {
  const token = cookies().get('session')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { userId: payload.userId as string };
  } catch {
    return null;
  }
}
```

### 7.3 API Key Security

```typescript
// src/server/auth/api-key.ts
import { createHash, randomBytes } from 'crypto';
import { db } from '@/db';
import { apiKeys } from '@/db/schema';
import { eq } from 'drizzle-orm';

const API_KEY_PREFIX = 'cts_';

export async function generateApiKey(userId: string, name: string) {
  const rawKey = `${API_KEY_PREFIX}${randomBytes(24).toString('base64url')}`;
  const keyHash = createHash('sha256').update(rawKey).digest('hex');
  const keyPrefix = rawKey.slice(0, 8);

  await db.insert(apiKeys).values({
    userId,
    name,
    keyHash,
    keyPrefix,
  });

  return rawKey; // Only returned once, never stored
}

export async function verifyApiKey(key: string) {
  if (!key.startsWith(API_KEY_PREFIX)) return null;

  const keyHash = createHash('sha256').update(key).digest('hex');
  const keyPrefix = key.slice(0, 8);

  const [apiKey] = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.keyPrefix, keyPrefix))
    .limit(1);

  if (!apiKey || apiKey.keyHash !== keyHash) return null;
  if (apiKey.expiresAt && apiKey.expiresAt < new Date()) return null;

  // Update last used
  await db
    .update(apiKeys)
    .set({ lastUsedAt: new Date() })
    .where(eq(apiKeys.id, apiKey.id));

  return apiKey;
}
```

### 7.4 Security Headers

```typescript
// next.config.ts
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
  },
];

export default {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

---

## 8. Performance Considerations

### 8.1 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Page Load (LCP) | <2.5s | Lighthouse |
| First Input Delay | <100ms | Core Web Vitals |
| Time to Interactive | <3.5s | Lighthouse |
| API Response (p95) | <500ms | APM |
| Analysis (1k LOC) | <5s | Internal metrics |

### 8.2 Optimization Strategies

#### 8.2.1 Frontend Optimization

```typescript
// Dynamic imports for code splitting
const TrendChart = dynamic(() => import('@/components/trend-chart'), {
  loading: () => <ChartSkeleton />,
});

// Image optimization
import Image from 'next/image';

// Font optimization
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], display: 'swap' });

// Prefetching
<Link href="/dashboard" prefetch={true}>Dashboard</Link>
```

#### 8.2.2 API Optimization

```typescript
// Connection pooling
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});

// Response caching
export async function GET(request: Request) {
  const cached = await redis.get(cacheKey);
  if (cached) {
    return new Response(cached, {
      headers: { 'X-Cache': 'HIT' },
    });
  }
  
  // ... fetch data
  
  await redis.set(cacheKey, JSON.stringify(data), 'EX', 300);
  return Response.json(data);
}
```

#### 8.2.3 Analysis Engine Optimization

```typescript
// Incremental parsing
const changedLines = detectChanges(previousCode, newCode);
const partialAST = incrementalParse(ast, changedLines);

// Parallel rule execution
const results = await Promise.all([
  executeRules(ast, 'hallucination'),
  executeRules(ast, 'deprecation'),
  executeRules(ast, 'security'),
]);

// Rule result caching
const cacheKey = `rule:${ruleId}:${hash(codeSnippet)}`;
const cached = await cache.get(cacheKey);
if (cached) return cached;
```

### 8.3 Caching Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CACHING LAYERS                                      │
└─────────────────────────────────────────────────────────────────────────────┘

Browser Cache (Client)
├─ Static assets: 1 year (immutable)
├─ API responses: 5 minutes (stale-while-revalidate)
└─ User preferences: Local storage

CDN Cache (Cloudflare)
├─ Static pages: 1 hour
├─ API responses: Varies by endpoint
└─ Images: 1 year

Application Cache (Redis)
├─ Session data: 7 days
├─ Analysis results: 24 hours
├─ Rule knowledge base: 1 hour
└─ Rate limit counters: 1 minute

Database Cache (Neon)
├─ Query plan cache: Automatic
└─ Connection pooling: 10 connections
```

---

## 9. Deployment Strategy

### 9.1 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DEPLOYMENT ARCHITECTURE                             │
└─────────────────────────────────────────────────────────────────────────────┘

GitHub Repository
        │
        ├─── Push to main ──────────────────────────┐
        │                                           │
        ├─── Push to staging ───────────────┐       │
        │                                   │       │
        └─── Pull Request ───────┐          │       │
                                 │          │       │
                                 ▼          ▼       ▼
                          ┌─────────────────────────────┐
                          │      GitHub Actions CI      │
                          │                             │
                          │  ├─ Lint                    │
                          │  ├─ Type Check              │
                          │  ├─ Unit Tests              │
                          │  ├─ Integration Tests       │
                          │  └─ Build                   │
                          └─────────────────────────────┘
                                 │          │       │
                                 │          │       │
                                 ▼          ▼       ▼
                          ┌─────────┐ ┌─────────┐ ┌─────────┐
                          │ Preview │ │ Staging │ │  Prod   │
                          │ (PR)    │ │         │ │         │
                          └─────────┘ └─────────┘ └─────────┘
                                 │          │       │
                                 └──────────┴───────┘
                                           │
                                           ▼
                                    ┌─────────────┐
                                    │   Vercel    │
                                    │             │
                                    │ ├─ Edge     │
                                    │ ├─ Functions│
                                    │ └─ CDN      │
                                    └─────────────┘
```

### 9.2 Environment Configuration

| Environment | URL | Purpose |
|-------------|-----|---------|
| Development | localhost:3000 | Local development |
| Preview | *.vercel.app | PR previews |
| Staging | staging.codetrust.dev | Pre-production testing |
| Production | codetrust.dev | Live application |

### 9.3 CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test

  build:
    runs-on: ubuntu-latest
    needs: [lint, typecheck, test]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
```

### 9.4 Database Migrations

```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema/*',
  out: './src/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;

// Migration commands
// pnpm db:generate  - Generate migration
// pnpm db:push      - Push to database
// pnpm db:migrate   - Run migrations
```

---

## 10. Monitoring and Observability

### 10.1 Monitoring Stack

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          OBSERVABILITY STACK                                 │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────────┐
                    │           Application           │
                    │                                 │
                    │  ┌───────┐ ┌───────┐ ┌───────┐ │
                    │  │ Logs  │ │Metrics│ │Traces │ │
                    │  └───┬───┘ └───┬───┘ └───┬───┘ │
                    └──────┼─────────┼─────────┼─────┘
                           │         │         │
                           ▼         ▼         ▼
                    ┌─────────────────────────────────┐
                    │         Vercel Analytics        │
                    │                                 │
                    │  - Web Vitals                   │
                    │  - Function metrics             │
                    │  - Error tracking               │
                    └─────────────────────────────────┘
                                     │
                                     ▼
                    ┌─────────────────────────────────┐
                    │          Axiom / Sentry         │
                    │                                 │
                    │  - Log aggregation              │
                    │  - Error tracking               │
                    │  - Performance monitoring       │
                    └─────────────────────────────────┘
                                     │
                                     ▼
                    ┌─────────────────────────────────┐
                    │          PagerDuty              │
                    │                                 │
                    │  - Alerting                     │
                    │  - On-call management           │
                    │  - Incident response            │
                    └─────────────────────────────────┘
```

### 10.2 Key Metrics

| Category | Metric | Alert Threshold |
|----------|--------|-----------------|
| Availability | Uptime | <99.9% |
| Performance | P95 Latency | >500ms |
| Performance | P99 Latency | >1000ms |
| Errors | Error Rate | >1% |
| Business | Analysis Success Rate | <99% |
| Business | Daily Active Users | <80% of 7-day avg |

### 10.3 Logging Strategy

```typescript
// src/lib/logger.ts
import { Logger } from 'next-axiom';

export const log = new Logger();

// Usage
log.info('Analysis started', {
  analysisId,
  projectId,
  filesCount,
});

log.error('Analysis failed', {
  analysisId,
  error: error.message,
  stack: error.stack,
});

// Structured logging format
{
  "level": "info",
  "message": "Analysis started",
  "timestamp": "2026-02-06T12:00:00Z",
  "context": {
    "analysisId": "abc123",
    "projectId": "proj456",
    "filesCount": 15
  },
  "vercel": {
    "region": "iad1",
    "route": "/api/analyze"
  }
}
```

### 10.4 Health Checks

```typescript
// src/app/api/health/route.ts
import { db } from '@/db';
import { redis } from '@/lib/redis';

export async function GET() {
  const checks = await Promise.allSettled([
    db.execute('SELECT 1'),
    redis.ping(),
  ]);

  const status = checks.every(c => c.status === 'fulfilled')
    ? 'healthy'
    : 'degraded';

  return Response.json({
    status,
    timestamp: new Date().toISOString(),
    checks: {
      database: checks[0].status === 'fulfilled' ? 'ok' : 'fail',
      cache: checks[1].status === 'fulfilled' ? 'ok' : 'fail',
    },
  }, {
    status: status === 'healthy' ? 200 : 503,
  });
}
```

---

*Document End*

**Revision History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-06 | Engineering Team | Initial version |

**Approval:**

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Engineering Lead | | | |
| Infrastructure Lead | | | |
| Security Lead | | | |
