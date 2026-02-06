# CLAUDE.md - Code Trust Scorer

## Project Overview

Code Trust Scorer is a web application for analyzing AI-generated code. It detects:
- Hallucinated APIs (non-existent methods/functions)
- Deprecated methods
- Security vulnerabilities
- Code quality issues

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Database:** Neon Postgres + Drizzle ORM
- **Auth:** NextAuth v5 (beta)
- **Validation:** Zod
- **Testing:** Vitest + React Testing Library

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── (auth)/          # Auth pages (login, signup)
│   ├── (dashboard)/     # Protected dashboard pages
│   └── api/             # API routes
├── components/          # React components
│   └── ui/             # Reusable UI components
├── db/                  # Database schema and client
├── lib/                 # Utilities and services
│   └── analysis/       # Code analysis engine
└── __tests__/          # Test files
```

## Key Files

- `src/lib/analysis/engine.ts` - Core analysis engine
- `src/lib/validations.ts` - Zod schemas
- `src/db/schema.ts` - Drizzle database schema
- `src/lib/auth.ts` - NextAuth configuration

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm test         # Run tests
pnpm lint         # Run ESLint
pnpm db:generate  # Generate Drizzle migrations
pnpm db:push      # Push schema to database
```

## Environment Variables

See `.env.example` for required variables:
- `DATABASE_URL` - Neon Postgres connection string
- `NEXTAUTH_SECRET` - NextAuth secret key
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` - GitHub OAuth (optional)

## Code Standards

- TypeScript strict mode, NO `any` types
- Zod validation on all forms and API inputs
- Error boundaries for error handling
- Loading skeletons (not spinners)
- Try-catch on async operations
- Responsive design (mobile-first)
- Dark mode support
