# 🛡️ Sentinel CLI

> **AI-Powered Code Guardian** — Automated code review with security scanning, dependency analysis, accessibility checks, and multi-LLM integration.

[![npm version](https://img.shields.io/npm/v/sentinel-cli.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/sentinel-cli)
[![npm downloads](https://img.shields.io/npm/dm/sentinel-cli.svg?style=flat-square&color=green)](https://www.npmjs.com/package/sentinel-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=flat-square)](https://nodejs.org/)
[![GitHub stars](https://img.shields.io/github/stars/KunjShah95/Sentinel-CLI?style=flat-square)](https://github.com/KunjShah95/Sentinel-CLI)
[![GitHub issues](https://img.shields.io/github/issues/KunjShah95/Sentinel-CLI?style=flat-square)](https://github.com/KunjShah95/Sentinel-CLI/issues)

<p align="center">
  <img src="https://raw.githubusercontent.com/KunjShah95/Sentinel-CLI/main/assets/banner.png" alt="Sentinel CLI Banner" width="800" />
</p>

<p align="center">
  <b>🔒 Security</b> • <b>📦 Dependencies</b> • <b>♿ Accessibility</b> • <b>🐛 Bugs</b> • <b>⚡ Performance</b> • <b>🤖 AI-Powered</b>
</p>

---

## ✨ Features

| Category | Features |
|----------|----------|
| 🔒 **Security Analysis** | SQL injection, XSS, CSRF, exposed secrets (API keys, tokens), dangerous functions (`eval`, `innerHTML`) |
| 📦 **Dependency Scanning** | Vulnerable package detection (npm, pip, gem), deprecated package warnings, license compliance |
| ♿ **Accessibility (a11y)** | WCAG compliance checks, image alt text, form labels, ARIA validation, keyboard accessibility |
| 📊 **Code Quality** | Cyclomatic complexity, code duplication, maintainability metrics, dead code detection |
| 🐛 **Bug Detection** | Runtime errors, logical flaws, null pointer issues, type mismatches |
| ⚡ **Performance** | Memory leaks, inefficient algorithms, N+1 queries, expensive operations |
| 🤖 **AI-Powered Review** | Multi-LLM support (OpenAI, Groq, Gemini, OpenRouter), confidence scoring, intelligent merging |
| 🔗 **Git Integration** | Analyze commits, branches, staged files, PR diffs |
| 🎣 **Pre-commit Hooks** | Block bad code before it enters your repo |
| 📝 **Multiple Outputs** | Console (rich text), JSON, HTML, Markdown |
| 💬 **Sentinel Console** | Interactive AI assistant for quick Q&A |

---

## 🚀 Quick Start

### NPM Installation

```bash
# Install globally
npm install -g sentinel-cli

# Or run directly with npx
npx sentinel-cli analyze --staged
```

### Docker

```bash
# Build the Docker image
docker build -t sentinel-cli .

# Run analysis on current directory
docker run --rm -v $(pwd):/workspace sentinel-cli analyze --format console

# Using Docker Compose
docker-compose run sentinel analyze --staged
```

---

## 📦 Installation

### From npm (Recommended)

```bash
# Global installation
npm install -g sentinel-cli

# Local project installation
npm install --save-dev sentinel-cli
```

### From Source

```bash
git clone https://github.com/KunjShah95/Sentinel-CLI.git
cd Sentinel-CLI
npm install
npm link
```

---

## 🎯 Usage

### Basic Commands

```bash
# Analyze specific files
sentinel analyze file1.js src/file2.js

# Analyze staged changes (perfect for pre-commit)
sentinel analyze --staged

# Analyze a specific branch
sentinel analyze --branch feature/login

# Analyze a specific commit
sentinel analyze --commit abc1234

# Output to different formats
sentinel analyze --format json --output report.json
sentinel analyze --format html --output report.html
sentinel analyze --format markdown --output report.md
```

### Interactive Setup

```bash
# Configure Sentinel interactively
sentinel setup
```

### Install Pre-commit Hooks

```bash
# Automatically review code before commits
sentinel install-hooks
```

### Repository Statistics

```bash
# Show repo stats and issue counts
sentinel stats
```

### AI Chat Console

```bash
# Launch interactive AI assistant
sentinel chat

# Single prompt
sentinel chat "Summarize the security issues in src/auth.js"
```

### Manage AI Models

```bash
# View and configure AI providers
sentinel models

# Enable/disable providers
sentinel models --enable openai-default,groq-default --disable gemini-default

# Change models
sentinel models --model openai-default=gpt-4o-mini

# Set API key environment variables
sentinel models --env openai-default=OPENAI_API_KEY
```

---

## 🔧 Configuration

### Interactive Setup

```bash
sentinel setup
```

### Manual Configuration

Create `.codereviewrc.json` in your project root:

```json
{
  "analysis": {
    "enabledAnalyzers": [
      "security",
      "quality",
      "bugs",
      "performance",
      "dependency",
      "accessibility"
    ],
    "ignoredFiles": ["node_modules/**", "dist/**", "*.min.js"]
  },
  "ai": {
    "enabled": true,
    "providers": [
      {
        "id": "openai-default",
        "provider": "openai",
        "model": "gpt-4o-mini",
        "weight": 0.34,
        "apiKeyEnv": "OPENAI_API_KEY",
        "enabled": true
      },
      {
        "id": "groq-default",
        "provider": "groq",
        "model": "llama3-70b-8192",
        "weight": 0.22,
        "apiKeyEnv": "GROQ_API_KEY",
        "enabled": true
      },
      {
        "id": "gemini-default",
        "provider": "gemini",
        "model": "gemini-1.5-flash",
        "weight": 0.22,
        "apiKeyEnv": "GEMINI_API_KEY",
        "enabled": true
      },
      {
        "id": "openrouter-default",
        "provider": "openrouter",
        "model": "google/gemini-pro-1.5",
        "weight": 0.22,
        "apiKeyEnv": "OPENROUTER_API_KEY",
        "enabled": false
      }
    ],
    "cache": {
      "enabled": true,
      "path": ".codereview-cache.json",
      "ttlMinutes": 1440
    }
  },
  "integrations": {
    "precommit": {
      "blocking": true
    }
  },
  "output": {
    "format": "console"
  }
}
```

---

## 🔐 Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Set your API keys
OPENAI_API_KEY=your-openai-key
GROQ_API_KEY=your-groq-key
GEMINI_API_KEY=your-gemini-key
OPENROUTER_API_KEY=your-openrouter-key
ANTHROPIC_API_KEY=your-anthropic-key
```

| Provider | Environment Variable | Notes |
|----------|---------------------|-------|
| OpenAI | `OPENAI_API_KEY` | GPT-4o / GPT-4o-mini recommended |
| Groq | `GROQ_API_KEY` | Low-latency Llama 3 |
| Google Gemini | `GEMINI_API_KEY` | Gemini 1.5 Flash/Pro |
| OpenRouter | `OPENROUTER_API_KEY` | Access to many models |
| Anthropic | `ANTHROPIC_API_KEY` | Claude models |

> ⚠️ **IMPORTANT SECURITY NOTICE**
> 
> **Always store your API keys in a `.env` file only!** Never:
> - ❌ Hardcode API keys directly in source code
> - ❌ Commit `.env` files to version control
> - ❌ Store API keys in configuration files (`.codereviewrc.json`)
> - ❌ Share API keys in plain text (emails, chat, etc.)
> 
> **Best Practices:**
> - ✅ Copy `.env.example` to `.env` and add your keys there
> - ✅ Use environment-specific `.env.local` files
> - ✅ Use `apiKeyEnv` in config to reference environment variables
> - ✅ Rotate keys if accidentally exposed
> 
> The `.env` file is already included in `.gitignore` to prevent accidental commits.

---

## 🐳 Docker

### Build

```bash
# Production build
docker build -t sentinel-cli:latest .

# Development build
docker build --target development -t sentinel-cli:dev .
```

### Run

```bash
# Analyze current directory
docker run --rm -v $(pwd):/workspace sentinel-cli analyze

# With environment variables
docker run --rm \
  -e OPENAI_API_KEY="your-key" \
  -v $(pwd):/workspace \
  sentinel-cli analyze --format json
```

### Docker Compose

```bash
# Run production service
docker-compose run sentinel analyze --staged

# Run development service
docker-compose up sentinel-dev

# Run CI analysis
docker-compose run sentinel-ci
```

---

## 🏗️ CI/CD Integration

### GitHub Actions

A workflow is included at `.github/workflows/ci.yml`:

```yaml
name: Code Review

on:
  pull_request:
    branches: [main]

jobs:
  sentinel-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install -g sentinel-cli
      - run: sentinel analyze --format json --output report.json
      - name: Check for critical issues
        run: |
          if grep -q '"severity": "critical"' report.json; then
            echo "Critical issues found!"
            exit 1
          fi
```

### Pre-commit Hook

```bash
# Install the pre-commit hook
sentinel install-hooks

# Or manually add to .git/hooks/pre-commit:
#!/bin/sh
sentinel analyze --staged --format console
if [ $? -ne 0 ]; then
  echo "Code review failed. Fix issues before committing."
  exit 1
fi
```

---

## 🎨 Banner Customization

```bash
# Default Sentinel banner
sentinel

# Custom text, font, and gradient
sentinel --banner-message "CODE REVIEW" \
         --banner-font Slant \
         --banner-gradient rainbow \
         --banner-width 100

# Disable colors
sentinel --no-banner-color
```

**Available Gradients:** `aqua` (default), `fire`, `rainbow`, `aurora`, `mono`

**Available Fonts:** Any [figlet font](http://www.figlet.org/examples.html) (Standard, Slant, Ghost, etc.)

---

## 📊 Analyzers

### Security Analyzer
- SQL injection detection
- XSS vulnerability scanning
- Exposed secrets (API keys, tokens, passwords)
- Dangerous functions (`eval`, `innerHTML`, `document.write`)
- Language-specific rules (JS/TS, Python, Java, PHP)

### Dependency Analyzer (NEW!)
- Vulnerable package detection (known CVEs)
- Deprecated package warnings
- Unpinned version detection
- License compliance checks
- Supports: npm, pip, gem, cargo, go modules

### Accessibility Analyzer (NEW!)
- Missing alt text detection
- Form label validation
- ARIA attribute checking
- Semantic HTML verification
- Keyboard accessibility
- Color contrast warnings
- WCAG 2.1 compliance

### Quality Analyzer
- Cyclomatic complexity calculation
- Code duplication detection
- Maintainability index
- Dead code detection
- Naming convention checks

### Bug Analyzer
- Null pointer risks
- Type mismatch detection
- Logic error patterns
- Async/await issues
- Resource leak detection

### Performance Analyzer
- Memory leak detection
- N+1 query patterns
- Expensive operations
- Bundle size impacts
- Algorithm complexity

---

## 🏛️ Architecture

```
sentinel-cli/
├── src/
│   ├── cli.js              # Main CLI entry point
│   ├── bot.js              # Core orchestrator
│   ├── analyzers/          # Analysis modules
│   │   ├── securityAnalyzer.js
│   │   ├── qualityAnalyzer.js
│   │   ├── bugAnalyzer.js
│   │   ├── performanceAnalyzer.js
│   │   ├── dependencyAnalyzer.js
│   │   ├── accessibilityAnalyzer.js
│   │   └── aiAnalyzer.js
│   ├── llm/                # LLM integration
│   │   └── llmOrchestrator.js
│   ├── git/                # Git utilities
│   ├── config/             # Configuration
│   └── output/             # Report generators
├── Dockerfile              # Multi-stage Docker build
├── docker-compose.yml      # Docker Compose services
└── .github/workflows/      # CI/CD workflows
```

---

## 📝 Publishing to npm

1. **Update version:**
   ```bash
   npm version patch  # or minor, major
   ```

2. **Login to npm:**
   ```bash
   npm login
   ```

3. **Publish:**
   ```bash
   npm publish --access public
   ```

4. **Verify:**
   ```bash
   npx sentinel-cli --version
   ```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## �‍💻 Author

**Kunj Shah**

- GitHub: [@KunjShah95](https://github.com/KunjShah95)
- npm: [kunjshah](https://www.npmjs.com/~kunjshah)

---

## �🙏 Acknowledgments

- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- [Chalk](https://github.com/chalk/chalk) - Terminal styling
- [Figlet](https://github.com/patorjk/figlet.js) - ASCII art
- [Simple-git](https://github.com/steveukx/git-js) - Git operations
- [Inquirer](https://github.com/SBoudrias/Inquirer.js) - Interactive prompts

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/KunjShah95">Kunj Shah</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/sentinel-cli">
    <img src="https://img.shields.io/npm/v/sentinel-cli?style=for-the-badge&logo=npm" alt="npm" />
  </a>
  <a href="https://github.com/KunjShah95/Sentinel-CLI">
    <img src="https://img.shields.io/github/stars/KunjShah95/Sentinel-CLI?style=for-the-badge&logo=github" alt="GitHub stars" />
  </a>
</p>
