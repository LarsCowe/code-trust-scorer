# Frequently Asked Questions

## Code Trust Scorer

**Last Updated:** 2026-02-06

---

## General Questions

### What is Code Trust Scorer?

Code Trust Scorer is a developer tool that analyzes AI-generated code and provides a trust score based on quality signals. It helps developers make informed decisions about whether to merge AI-assisted code changes by detecting issues like hallucinated APIs, deprecated methods, and security vulnerabilities.

### Who is Code Trust Scorer for?

- **Individual Developers**: Who use AI coding tools and want to verify their output
- **Engineering Teams**: Who need consistent quality standards across AI-assisted development
- **Engineering Managers**: Who want visibility into code quality metrics
- **Security Teams**: Who need to ensure AI code meets security standards

### What programming languages are supported?

Code Trust Scorer currently supports:
- TypeScript (.ts, .tsx)
- JavaScript (.js, .jsx)
- Python (.py)

Additional language support (Go, Rust, Java) is planned for future releases.

### How is Code Trust Scorer different from ESLint or SonarQube?

Traditional linters focus on style and general code quality. Code Trust Scorer specifically targets issues common in AI-generated code:

| Feature | ESLint/SonarQube | Code Trust Scorer |
|---------|------------------|-------------------|
| Hallucinated API detection | ❌ | ✅ |
| AI pattern recognition | ❌ | ✅ |
| Trust scoring | ❌ | ✅ |
| Deprecated method context | Limited | Full |
| Security focus for AI code | Generic | AI-specific |

---

## Trust Scores

### How is the Trust Score calculated?

The Trust Score is calculated on a scale of 0-100 based on:

1. **Issue Count**: More issues = lower score
2. **Issue Severity**: Errors have more impact than warnings
3. **Confidence**: Issues with higher confidence affect score more

Formula:
```
base_score = 100
for each issue:
    penalty = severity_weight × confidence
    base_score -= penalty
trust_score = max(0, min(100, base_score))
```

### What do the score ranges mean?

| Score | Rating | Meaning |
|-------|--------|---------|
| 90-100 | Excellent | Minimal or no issues detected |
| 70-89 | Good | Minor issues that should be reviewed |
| 50-69 | Fair | Significant issues requiring attention |
| 30-49 | Poor | Major problems that must be fixed |
| 0-29 | Critical | Severe issues, do not merge |

### Why did my score drop?

Common reasons for score drops:
- New AI-generated code introduced issues
- Detection rules were updated with better accuracy
- Dependencies added new deprecated patterns
- Previously undetected issues now recognized

Check the analysis details to see specific issues affecting your score.

---

## Privacy & Security

### Is my code stored on your servers?

- **VS Code Extension**: Code is analyzed locally by default. Only metadata (scores, issue counts) is sent to our servers.
- **CI/CD Integration**: Code snippets may be transmitted for analysis but are encrypted in transit and not permanently stored.
- **Enterprise Plan**: Supports fully on-premise deployment for maximum privacy.

### Is my code used to train AI models?

No. We never use customer code to train AI models. Your code is analyzed, scored, and the analysis results are stored, but the code itself is not used for any other purpose.

### What compliance certifications do you have?

- **SOC 2 Type II**: In progress (expected Q3 2026)
- **GDPR Compliant**: Yes
- **CCPA Compliant**: Yes

Enterprise customers can request additional security documentation.

---

## Integrations

### How do I set up GitHub integration?

1. Install the Code Trust Scorer GitHub App from the GitHub Marketplace
2. Select the repositories you want to analyze
3. Configure analysis settings in your dashboard
4. PRs will automatically receive trust score checks

### Can I use Code Trust Scorer in my CI/CD pipeline?

Yes! We provide integrations for:
- GitHub Actions
- GitLab CI
- Jenkins
- CircleCI
- Custom webhooks

See our [CI/CD Integration Guide](./integration-guides/cicd.md) for details.

### Does the VS Code extension work offline?

The VS Code extension can perform basic analysis offline using cached rules. However, for full functionality including:
- Trust score calculation
- API verification against latest signatures
- Team synchronization

An internet connection is required.

---

## Pricing & Plans

### What's included in the Free tier?

- 100 file analyses per month
- VS Code extension (full features)
- GitHub checks (limited to 5 repos)
- 7-day analysis history
- Community support

### What's included in the Pro tier?

- Unlimited file analyses
- Unlimited repositories
- Team dashboard (up to 10 members)
- 90-day analysis history
- Priority email support
- Custom rule configuration

### How does Enterprise pricing work?

Enterprise pricing is based on:
- Number of developers
- Required integrations
- Support level (dedicated vs shared)
- Deployment type (cloud vs on-premise)

Contact sales@codetrust.dev for a custom quote.

---

## Troubleshooting

### Why are there false positives in my analysis?

False positives can occur when:
- Custom or internal APIs look like hallucinations
- Polyfills extend standard APIs
- Type definitions are incomplete

**To reduce false positives:**
1. Add APIs to your project's allowlist
2. Report false positives (helps improve detection)
3. Adjust confidence thresholds in settings

### Analysis is taking too long

Performance tips:
- Exclude `node_modules` and build directories
- Use `.ctsignore` file for large generated files
- Enable incremental analysis for faster subsequent runs

### The VS Code extension isn't working

1. Check extension is enabled for your workspace
2. Verify VS Code version is 1.80+
3. Check output panel for error messages
4. Try reloading the window (Cmd/Ctrl + Shift + P → "Reload Window")

---

## Feature Requests

### How can I request a new feature?

- **GitHub**: Open an issue in our public repository
- **Email**: Send feature requests to feedback@codetrust.dev
- **In-app**: Use the feedback button in the dashboard

### Is [specific language] support coming?

Language support priority is based on user demand. Currently planned:
1. Go (Q3 2026)
2. Rust (Q4 2026)
3. Java (Q1 2027)

Vote for your preferred language on our public roadmap.

---

## Contact

### How do I get support?

| Plan | Support Channel | Response Time |
|------|-----------------|---------------|
| Free | Community forum | Best effort |
| Pro | Email support | <24 hours |
| Enterprise | Dedicated Slack/Teams | <4 hours |

### How do I report a bug?

1. Check if it's a known issue in our status page
2. Open a GitHub issue with reproduction steps
3. Include: CTS version, VS Code version, sample code (if possible)

### Where can I learn more?

- **Documentation**: docs.codetrust.dev
- **Blog**: blog.codetrust.dev
- **Twitter/X**: @CodeTrustDev
- **Discord**: discord.gg/codetrust
