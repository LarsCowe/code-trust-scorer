# Contributing to Code Trust Scorer

Thank you for your interest in contributing to Code Trust Scorer! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

## Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to conduct@codetrust.dev.

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 9+
- Git
- A GitHub account

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/code-trust-scorer.git
   cd code-trust-scorer
   ```
3. Add the upstream remote:
   ```bash
   git remote add upstream https://github.com/LarsCowe/code-trust-scorer.git
   ```

## Development Setup

### Install Dependencies

```bash
pnpm install
```

### Set Up Environment

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

### Start Development Server

```bash
pnpm dev
```

### Run Tests

```bash
pnpm test
```

## Making Changes

### Branch Naming

- `feat/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation changes
- `refactor/description` - Code refactoring
- `test/description` - Test additions or changes

### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

Example:
```
feat(analysis): add Python 3.12 support

- Updated tree-sitter-python to latest version
- Added support for new Python 3.12 syntax features
- Updated test fixtures

Closes #123
```

## Pull Request Process

1. **Create a branch** from `main`
2. **Make your changes** following our coding standards
3. **Write or update tests** as needed
4. **Update documentation** if applicable
5. **Run the test suite** to ensure all tests pass
6. **Push to your fork** and create a pull request
7. **Fill out the PR template** completely
8. **Wait for review** and address any feedback

### PR Requirements

- [ ] Tests pass
- [ ] Lint passes
- [ ] TypeScript compiles without errors
- [ ] Documentation updated (if applicable)
- [ ] PR description explains changes
- [ ] Commits follow conventional commit format

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Prefer `const` over `let`
- Use meaningful variable names
- Add type annotations for function parameters and returns
- Avoid `any` - use `unknown` if type is truly unknown

### React

- Use functional components with hooks
- Extract reusable logic into custom hooks
- Use `useCallback` and `useMemo` appropriately
- Keep components focused and small

### File Organization

```
src/
├── components/     # React components
│   └── ComponentName/
│       ├── index.tsx
│       ├── ComponentName.tsx
│       ├── ComponentName.test.tsx
│       └── styles.ts
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
├── types/          # TypeScript types
└── app/            # Next.js app routes
```

### Imports

Order imports as follows:
1. React and Next.js
2. Third-party libraries
3. Internal modules
4. Types
5. Styles

```typescript
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';

import type { User } from '@/types';

import styles from './styles.module.css';
```

## Testing

### Unit Tests

Use Vitest for unit testing:

```typescript
import { describe, it, expect } from 'vitest';
import { calculateTrustScore } from './scoring';

describe('calculateTrustScore', () => {
  it('returns 100 for code with no issues', () => {
    const result = calculateTrustScore([]);
    expect(result.score).toBe(100);
  });

  it('decreases score for errors', () => {
    const issues = [{ severity: 'error', confidence: 1 }];
    const result = calculateTrustScore(issues);
    expect(result.score).toBeLessThan(100);
  });
});
```

### E2E Tests

Use Playwright for end-to-end testing:

```typescript
import { test, expect } from '@playwright/test';

test('user can create a project', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('text=New Project');
  await page.fill('input[name="name"]', 'Test Project');
  await page.click('button[type="submit"]');
  await expect(page.locator('h1')).toContainText('Test Project');
});
```

### Test Coverage

We aim for >80% test coverage. Run coverage report:

```bash
pnpm test:coverage
```

## Documentation

### Code Comments

- Use JSDoc for public APIs
- Explain "why" not "what"
- Keep comments up to date with code

```typescript
/**
 * Calculates the trust score for analyzed code.
 * 
 * @param issues - Array of detected issues
 * @returns Trust score object with score, breakdown, and confidence
 * 
 * @example
 * ```ts
 * const score = calculateTrustScore(issues);
 * console.log(score.score); // 78
 * ```
 */
export function calculateTrustScore(issues: Issue[]): TrustScore {
  // ...
}
```

### README Updates

If your change affects user-facing features, update the README:
- Add new features to the feature list
- Update usage examples if API changes
- Update screenshots if UI changes

## Questions?

- Open a [Discussion](https://github.com/LarsCowe/code-trust-scorer/discussions) for questions
- Join our [Discord](https://discord.gg/codetrust) for community chat
- Email [dev@codetrust.dev](mailto:dev@codetrust.dev) for private inquiries

Thank you for contributing! 🎉
