# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please report it responsibly.

### How to Report

**Do NOT create a public GitHub issue for security vulnerabilities.**

Instead, please email us at: **security@codetrust.dev**

Include the following in your report:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fixes (optional)

### What to Expect

1. **Acknowledgment**: We will acknowledge receipt within 24 hours
2. **Initial Assessment**: We will provide an initial assessment within 72 hours
3. **Regular Updates**: We will keep you informed of our progress
4. **Resolution**: We aim to resolve critical issues within 7 days
5. **Credit**: We will credit you in our security advisory (unless you prefer to remain anonymous)

### Scope

The following are in scope for security reports:

- Code Trust Scorer web application
- Code Trust Scorer VS Code extension
- Code Trust Scorer CLI
- Code Trust Scorer API
- Authentication and authorization systems
- Data storage and transmission

The following are **out of scope**:

- Third-party dependencies (report to the respective maintainers)
- Social engineering attacks
- Physical attacks
- Denial of Service attacks

## Security Best Practices

When using Code Trust Scorer:

1. **API Keys**: Keep your API keys secret. Never commit them to source control.
2. **Webhooks**: Verify webhook signatures to ensure requests are from Code Trust Scorer.
3. **OAuth**: Only grant necessary permissions when connecting GitHub.
4. **Updates**: Keep the VS Code extension updated to receive security patches.

## Security Features

Code Trust Scorer includes the following security features:

- **Encryption**: All data is encrypted at rest (AES-256) and in transit (TLS 1.3)
- **Authentication**: Secure session management with JWT tokens
- **Authorization**: Role-based access control (RBAC)
- **Rate Limiting**: Protection against brute force attacks
- **Audit Logging**: All security-relevant actions are logged
- **Input Validation**: All user inputs are validated and sanitized

## Bug Bounty

We currently do not have a formal bug bounty program. However, we appreciate responsible disclosure and may offer recognition or rewards at our discretion.

## Contact

For security-related inquiries: security@codetrust.dev
For general support: support@codetrust.dev
