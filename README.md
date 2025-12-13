# 🛡️ Sentinel CLI

> **Run AI-powered code review + security & dependency checks locally or in CI, using your own OpenAI/Groq/Gemini API keys.**

[![npm version](https://img.shields.io/npm/v/sentinel-cli.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/sentinel-cli)
[![npm downloads](https://img.shields.io/npm/dm/sentinel-cli.svg?style=flat-square&color=green)](https://www.npmjs.com/package/sentinel-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=flat-square)](https://nodejs.org/)
[![GitHub stars](https://img.shields.io/github/stars/KunjShah95/Sentinel-CLI?style=flat-square)](https://github.com/KunjShah95/Sentinel-CLI)
[![GitHub issues](https://img.shields.io/github/issues/KunjShah95/Sentinel-CLI?style=flat-square)](https://github.com/KunjShah95/Sentinel-CLI/issues)

<p align="center">
  <b>🔒 Security</b> • <b>📦 Dependencies</b> • <b>♿ Accessibility</b> • <b>🐛 Bugs</b> • <b>⚡ Performance</b> • <b>🤖 AI-Powered</b>
</p>

---

## 🎯 What is Sentinel CLI?

Sentinel CLI is a **local-first, developer-owned** code review tool that combines:

- **AI-powered code analysis** using your own API keys (OpenAI, Groq, Gemini, Anthropic)
- **Security scanning** (SQL injection, XSS, exposed secrets, dangerous functions)
- **Dependency analysis** (vulnerable packages, deprecated deps, license issues)
- **Accessibility checking** (WCAG compliance, ARIA validation, semantic HTML)

Unlike hosted SaaS solutions, Sentinel runs **entirely on your machine or CI pipeline** — your code never leaves your infrastructure.

---

## ⚡ Quickstart in 30 Seconds

```bash
# Install globally
npm install -g sentinel-cli

# Analyze your current directory
sentinel analyze

# Analyze staged changes (perfect for pre-commit)
sentinel analyze --staged

# Get JSON output for CI
sentinel analyze --format json --output report.json
```

**Sample Output:**
```
🛡️ SENTINEL — AI-Powered Code Guardian

✔ Analyzing 12 files...

┌─────────────────────────────────────────────────────────────┐
│  CRITICAL  │ Hardcoded API key detected                    │
│  File: src/config.js:45                                     │
│  → Move to environment variables                            │
├─────────────────────────────────────────────────────────────┤
│  HIGH      │ SQL injection vulnerability                   │
│  File: src/db/queries.js:23                                 │
│  → Use parameterized queries                                │
├─────────────────────────────────────────────────────────────┤
│  MEDIUM    │ Missing alt text on image                     │
│  File: src/components/Hero.jsx:12                           │
│  → Add descriptive alt attribute                            │
└─────────────────────────────────────────────────────────────┘

Summary: 1 critical, 2 high, 5 medium, 12 low issues found
```

---

## 🆚 Why Sentinel CLI vs Hosted Tools?

| Feature | Sentinel CLI | CodeRabbit | GitHub Copilot | SonarCloud |
|---------|-------------|------------|----------------|------------|
| **Local/Self-hosted** | ✅ Yes | ❌ SaaS only | ❌ SaaS only | ⚠️ Partial |
| **Your own AI keys** | ✅ OpenAI/Groq/Gemini | ❌ Their API | ❌ Their API | ❌ N/A |
| **Code stays private** | ✅ 100% local | ❌ Sent to cloud | ❌ Sent to cloud | ❌ Sent to cloud |
| **Security scanning** | ✅ Built-in | ⚠️ Limited | ❌ No | ✅ Yes |
| **Dependency checks** | ✅ npm/pip/gem | ❌ No | ❌ No | ✅ Yes |
| **Accessibility (a11y)** | ✅ WCAG checks | ❌ No | ❌ No | ❌ No |
| **Pre-commit hooks** | ✅ Yes | ❌ PR only | ❌ No | ❌ No |
| **Offline capable** | ✅ Static analysis | ❌ No | ❌ No | ❌ No |
| **Free & Open Source** | ✅ MIT License | ❌ Paid | ❌ Paid | ⚠️ Freemium |
| **Multi-LLM support** | ✅ 5 providers | ❌ 1 provider | ❌ 1 provider | ❌ N/A |

---

## ✨ Features

| Category | What It Does |
|----------|--------------|
| 🔒 **Security Analysis** | SQL injection, XSS, CSRF, exposed secrets (API keys, tokens, passwords), dangerous functions (`eval`, `innerHTML`, `document.write`) |
| 📦 **Dependency Scanning** | Vulnerable package detection (known CVEs), deprecated packages, unpinned versions, license compliance |
| ♿ **Accessibility (a11y)** | Missing alt text, form labels, ARIA validation, semantic HTML, keyboard accessibility, color contrast |
| 📊 **Code Quality** | Cyclomatic complexity, code duplication, maintainability index, dead code detection |
| 🐛 **Bug Detection** | Null pointer risks, type mismatches, logic errors, async/await issues, resource leaks |
| ⚡ **Performance** | Memory leaks, N+1 queries, expensive operations, bundle size impacts |
| 🤖 **AI Review** | Multi-LLM analysis with confidence scoring and intelligent issue merging |

---

## 🔧 Configuration Examples

### Using Different AI Providers

**OpenAI (GPT-4o-mini):**
```bash
export OPENAI_API_KEY="sk-..."
sentinel analyze --format console
```

**Groq (Llama 3 - fastest):**
```bash
export GROQ_API_KEY="gsk_..."
sentinel analyze --format console
```

**Google Gemini:**
```bash
export GEMINI_API_KEY="AI..."
sentinel analyze --format console
```

**Multiple providers (ensemble mode):**
```bash
export OPENAI_API_KEY="sk-..."
export GROQ_API_KEY="gsk_..."
export GEMINI_API_KEY="AI..."
sentinel analyze  # Uses all available providers, merges results
```

### Running Specific Checks Only

```bash
# Security checks only
sentinel analyze --analyzers security

# Dependencies only
sentinel analyze --analyzers dependency

# Accessibility only
sentinel analyze --analyzers accessibility

# Multiple specific analyzers
sentinel analyze --analyzers security,dependency,accessibility

# Everything except AI (faster, no API calls)
sentinel analyze --analyzers security,quality,bugs,performance,dependency,accessibility
```

### Configuration File

Create `.codereviewrc.json` in your project root:

```json
{
  "analysis": {
    "enabledAnalyzers": ["security", "quality", "bugs", "performance", "dependency", "accessibility"],
    "ignoredFiles": ["node_modules/**", "dist/**", "*.min.js", "coverage/**"]
  },
  "ai": {
    "enabled": true,
    "providers": [
      {
        "id": "openai",
        "provider": "openai",
        "model": "gpt-4o-mini",
        "enabled": true
      },
      {
        "id": "groq",
        "provider": "groq",
        "model": "llama3-70b-8192",
        "enabled": true
      }
    ]
  },
  "output": {
    "format": "console",
    "minSeverity": "low"
  }
}
```

---

## 🚀 CI/CD Integration

### GitHub Actions Workflow

Create `.github/workflows/sentinel.yml`:

```yaml
name: Sentinel Code Review

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

jobs:
  code-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Sentinel CLI
        run: npm install -g sentinel-cli

      - name: Run Security Scan
        run: sentinel analyze --analyzers security --format json --output security-report.json
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}

      - name: Run Full Analysis
        run: sentinel analyze --format json --output full-report.json
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}

      - name: Check for Critical Issues
        run: |
          if grep -q '"severity":"critical"' full-report.json; then
            echo "❌ Critical issues found!"
            cat full-report.json | jq '.issues[] | select(.severity=="critical")'
            exit 1
          fi
          echo "✅ No critical issues found"

      - name: Upload Report
        uses: actions/upload-artifact@v4
        with:
          name: sentinel-report
          path: |
            security-report.json
            full-report.json
```

### Pre-commit Hook (with Husky)

```bash
# Install husky
npm install --save-dev husky
npx husky init

# Add sentinel to pre-commit
echo 'sentinel analyze --staged --format console' > .husky/pre-commit
```

Or manually add to `.git/hooks/pre-commit`:

```bash
#!/bin/sh
echo "🛡️ Running Sentinel pre-commit check..."
sentinel analyze --staged --format console

if [ $? -ne 0 ]; then
  echo "❌ Code review failed. Please fix issues before committing."
  exit 1
fi

echo "✅ Code review passed!"
```

### GitLab CI

```yaml
sentinel-review:
  image: node:20-alpine
  stage: test
  script:
    - npm install -g sentinel-cli
    - sentinel analyze --format json --output report.json
  artifacts:
    reports:
      codequality: report.json
  only:
    - merge_requests
```

---

## ♿ Accessibility Checks Explained

Sentinel checks for **WCAG 2.1 Level AA** compliance issues:

| Check | What It Detects | Why It Matters |
|-------|-----------------|----------------|
| **Missing alt text** | `<img>` without `alt` attribute | Screen readers can't describe images |
| **Empty alt on meaningful images** | `alt=""` on non-decorative images | Important content is hidden |
| **Form labels** | `<input>` without associated `<label>` | Users can't identify form fields |
| **ARIA validation** | Invalid or redundant ARIA attributes | Breaks assistive technology |
| **Semantic HTML** | Missing `<main>`, `<nav>`, `<header>` landmarks | Navigation is difficult |
| **Heading hierarchy** | Skipped heading levels (h1 → h3) | Document structure is unclear |
| **Keyboard accessibility** | `tabindex > 0`, removed focus outlines | Keyboard users can't navigate |
| **Link purpose** | `<a>` without `href`, vague link text | Users don't know where links go |
| **Color contrast** | Very light text colors | Low vision users can't read |

**Example a11y issue:**

```
MEDIUM | Missing form label
File: src/components/LoginForm.jsx:45
Code: <input type="email" placeholder="Email" />
Fix:  Add <label for="email">Email</label> or aria-label="Email"
```

---

## 🔒 Security & Dependency Scanning

### What Sentinel Detects Today

| Category | Detections |
|----------|------------|
| **Secrets** | API keys, tokens, passwords, private keys in code |
| **Injection** | SQL injection, command injection, XSS, CSRF patterns |
| **Dangerous Functions** | `eval()`, `innerHTML`, `document.write()`, `dangerouslySetInnerHTML` |
| **Vulnerable Dependencies** | Known CVEs in npm/pip/gem packages |
| **Deprecated Packages** | Packages marked as deprecated on registries |
| **Unpinned Versions** | `*` or missing versions in requirements.txt |
| **License Issues** | GPL in commercial projects, license mismatches |

### Supported Languages/Frameworks

| Language | Security | Dependencies | Tested |
|----------|----------|--------------|--------|
| JavaScript/TypeScript | ✅ Full | ✅ npm | ✅ |
| Python | ✅ Full | ✅ pip/requirements.txt | ✅ |
| Java | ✅ Basic | ⚠️ Partial | ⚠️ |
| PHP | ✅ Basic | ❌ Coming soon | ⚠️ |
| Ruby | ✅ Basic | ✅ Gemfile | ⚠️ |
| Go | ⚠️ Partial | ⚠️ go.mod | 🔜 |
| Rust | ⚠️ Partial | ⚠️ Cargo.toml | 🔜 |

### ⚠️ Limitations & Safety

> **Important:** Sentinel CLI is a **code review assistant**, not a replacement for comprehensive security tools.

- **AI can miss issues**: LLMs may not catch all vulnerabilities. Always use alongside dedicated SAST/DAST tools for production security.
- **Static analysis only**: No runtime detection, dynamic analysis, or penetration testing.
- **CVE database**: Uses curated known-vulnerable package list, not real-time CVE feeds (yet).
- **Not certified**: This tool is not SOC2/ISO27001 certified for compliance requirements.

**Recommended security stack:**
```
Sentinel CLI (this tool)     → AI code review + basic security
+
npm audit / safety / bundler-audit → Dependency CVE scanning
+
Snyk / Dependabot            → Real-time vulnerability alerts
+
SonarQube / Semgrep          → Deep SAST analysis
```

---

## 📦 Installation

### From npm (Recommended)

```bash
# Global installation
npm install -g sentinel-cli

# Or use npx (no install)
npx sentinel-cli analyze --staged
```

### From Source

```bash
git clone https://github.com/KunjShah95/Sentinel-CLI.git
cd Sentinel-CLI
npm install
npm link
sentinel --help
```

### Docker

```bash
# Build image
docker build -t sentinel-cli .

# Run analysis
docker run --rm -v $(pwd):/workspace sentinel-cli analyze

# With API keys
docker run --rm \
  -e OPENAI_API_KEY="$OPENAI_API_KEY" \
  -v $(pwd):/workspace \
  sentinel-cli analyze --format json
```

---

## 🎮 All Commands

```bash
# Core analysis
sentinel analyze [files...]           # Analyze files or current directory
sentinel analyze --staged             # Analyze git staged changes
sentinel analyze --branch feature/x   # Analyze branch diff
sentinel analyze --commit abc123      # Analyze specific commit

# Output formats
sentinel analyze --format console     # Rich terminal output (default)
sentinel analyze --format json        # JSON for CI/CD
sentinel analyze --format html        # HTML report
sentinel analyze --format markdown    # Markdown report

# Configuration
sentinel setup                        # Interactive configuration wizard
sentinel models                       # Manage AI providers
sentinel models --enable openai       # Enable specific provider
sentinel install-hooks                # Install git pre-commit hooks

# Utilities
sentinel stats                        # Show repository statistics
sentinel chat                         # Interactive AI assistant
sentinel chat "Explain this code"     # One-shot AI query
```

---

## 🌟 Why I Built Sentinel CLI

Hey! I'm **Kunj Shah**, a developer passionate about AI/ML and developer tools.

I built Sentinel CLI because I was frustrated with:
- **Hosted AI code reviewers** that require sending code to third-party servers
- **Fragmented tooling** — separate tools for security, dependencies, accessibility
- **Expensive SaaS** that charges per seat/repo for basic code review

I wanted something that:
- ✅ Runs **100% locally** — my code never leaves my machine
- ✅ Uses **my own API keys** — I control costs and data
- ✅ Combines **multiple analysis types** in one tool
- ✅ Works in **CI/CD and pre-commit hooks**
- ✅ Is **free and open source**

Sentinel CLI is that tool. I hope it helps you ship better, more secure code faster!

---

## 🤝 Contributing

I'd love your help making Sentinel better! Here are some ways to contribute:

### Good First Issues

- [ ] Add more security patterns for PHP/Ruby
- [ ] Improve Python type checking rules
- [ ] Add Cargo.toml (Rust) dependency parsing
- [ ] Create VS Code extension
- [ ] Add SARIF output format for GitHub Security tab
- [ ] Improve accessibility checker with more WCAG rules
- [ ] Add go.mod dependency analysis

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Setup

```bash
git clone https://github.com/KunjShah95/Sentinel-CLI.git
cd Sentinel-CLI
npm install
npm run dev        # Run with hot reload
npm run lint       # Check code style
npm run test       # Run tests
```

---

## 🗺️ Roadmap

- [ ] **v1.3** — Real-time CVE database integration (npm audit, Safety DB)
- [ ] **v1.4** — VS Code extension with inline annotations
- [ ] **v1.5** — GitHub/GitLab PR comment integration
- [ ] **v2.0** — Custom rule engine (YAML-based)
- [ ] **v2.1** — Monorepo support with incremental analysis
- [ ] **Future** — SARIF output, Slack/Discord notifications, Web dashboard

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

Free to use, modify, and distribute. Attribution appreciated but not required.

---

## 🙏 Acknowledgments

Built with amazing open source tools:
- [Commander.js](https://github.com/tj/commander.js) — CLI framework
- [Chalk](https://github.com/chalk/chalk) — Terminal styling
- [Figlet](https://github.com/patorjk/figlet.js) — ASCII art banners
- [Simple-git](https://github.com/steveukx/git-js) — Git operations
- [Inquirer](https://github.com/SBoudrias/Inquirer.js) — Interactive prompts

---

## 👨‍💻 Author

**Kunj Shah**

- 🐙 GitHub: [@KunjShah95](https://github.com/KunjShah95)
- 📦 npm: [kunjshah](https://www.npmjs.com/~kunjshah)
- 💼 LinkedIn: [Connect with me](https://linkedin.com/in/kunjshah95)

---

<p align="center">
  <a href="https://www.npmjs.com/package/sentinel-cli">
    <img src="https://img.shields.io/npm/v/sentinel-cli?style=for-the-badge&logo=npm&color=red" alt="npm" />
  </a>
  &nbsp;
  <a href="https://github.com/KunjShah95/Sentinel-CLI/stargazers">
    <img src="https://img.shields.io/github/stars/KunjShah95/Sentinel-CLI?style=for-the-badge&logo=github&color=yellow" alt="GitHub stars" />
  </a>
  &nbsp;
  <a href="https://github.com/KunjShah95/Sentinel-CLI/fork">
    <img src="https://img.shields.io/github/forks/KunjShah95/Sentinel-CLI?style=for-the-badge&logo=github&color=blue" alt="GitHub forks" />
  </a>
</p>

<p align="center">
  Made with ❤️ by <a href="https://github.com/KunjShah95">Kunj Shah</a>
</p>

<p align="center">
  <b>⭐ Star this repo if Sentinel helps you ship better code!</b>
</p>
