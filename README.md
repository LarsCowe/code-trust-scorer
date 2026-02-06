# Code Trust Scorer

> Analyze AI-generated code for quality signals and get a trust score before you merge.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

## 🎯 The Problem

84% of developers now use AI coding tools like GitHub Copilot, Cursor, and Claude Code. But here's the catch: **46% don't trust the output**. The #1 frustration cited by developers is dealing with "AI solutions that are almost right, but not quite," which often makes debugging more time-consuming than writing code from scratch.

**Code Trust Scorer** solves this by analyzing AI-generated code and providing:
- A **Trust Score** (0-100) based on 50+ quality signals
- Specific **warnings** about potential issues
- **Recommendations** for improvement

## 🚀 Features

- **Hallucination Detection** - Identifies API calls that don't exist or have wrong signatures
- **Deprecated Method Alerts** - Catches usage of deprecated or removed APIs
- **Security Scanning** - Detects common security anti-patterns in AI output
- **Pattern Analysis** - Recognizes over-abstraction and copy-paste patterns
- **Framework Validation** - Verifies code against latest framework versions
- **Trust Scoring** - Aggregated score with confidence intervals

## 📚 Documentation

### Planning Documents
- [Product Brief](docs/product-brief.md) - Vision, problem statement, and market opportunity
- [Product Requirements Document](docs/prd.md) - Detailed specifications and requirements
- [UX Design](docs/ux-design.md) - User flows, wireframes, and interaction patterns
- [Architecture](docs/architecture.md) - Technical architecture and system design
- [Epics & User Stories](docs/epics.md) - Development roadmap and acceptance criteria

### Reference
- [Glossary](docs/glossary.md) - Definitions of key terms and concepts
- [FAQ](docs/faq.md) - Frequently asked questions

## 🛠 Tech Stack

- **Frontend:** Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui
- **Backend:** Next.js API Routes, tRPC
- **Database:** Neon Postgres with Drizzle ORM
- **Analysis Engine:** Tree-sitter, custom AST analyzers
- **AI/ML:** Embeddings for pattern matching, rule-based detection
- **Infrastructure:** Vercel, GitHub Actions

## 🏃 Quick Start

```bash
# Clone the repository
git clone https://github.com/LarsCowe/code-trust-scorer.git
cd code-trust-scorer

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
pnpm db:push

# Start development server
pnpm dev
```

## 📖 Usage

### VS Code Extension

```bash
# Install from VS Code Marketplace
ext install code-trust-scorer
```

### CLI

```bash
# Install globally
npm install -g @code-trust-scorer/cli

# Analyze a file
cts analyze ./src/component.tsx

# Analyze with verbose output
cts analyze ./src --verbose --format json
```

### API

```typescript
import { analyzeCode } from '@code-trust-scorer/sdk';

const result = await analyzeCode({
  code: `function fetchUser(id) { ... }`,
  language: 'typescript',
  context: {
    framework: 'nextjs',
    version: '16.0.0'
  }
});

console.log(result.trustScore); // 78
console.log(result.warnings);   // [...issues found]
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

This project was inspired by:
- Mitchell Hashimoto's [AI Adoption Journey](https://mitchellh.com/writing/my-ai-adoption-journey)
- The Stack Overflow Developer Survey 2025
- Countless developers frustrated with AI-generated code quality

---

Built with ❤️ by the Code Trust Scorer team
