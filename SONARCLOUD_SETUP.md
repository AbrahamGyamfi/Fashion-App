# SonarCloud Setup Guide

## Overview
This project uses **dual SAST scanning**:
- **Semgrep**: Fast security checks on all PRs (~30 seconds)
- **SonarCloud**: Deep code quality analysis on dev/stage/main branches (~3-5 minutes)

## SonarCloud Configuration

### 1. Create SonarCloud Account
1. Go to https://sonarcloud.io
2. Sign in with GitHub
3. Grant access to your repositories

### 2. Create Organization
1. Click "+" → "Analyze new project"
2. Create organization: `abrahamgyamfi`
3. Import repository: `AbrahamGyamfi/Fashion-App`

### 3. Get Project Key
- Project Key: `AbrahamGyamfi_Fashion-App`
- Organization: `abrahamgyamfi`

### 4. Generate Token
1. Go to Account → Security → Generate Token
2. Name: `GitHub Actions CI/CD`
3. Copy the token (you won't see it again)

### 5. Add GitHub Secret
1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Name: `SONAR_TOKEN`
4. Value: Paste the token from step 4
5. Click "Add secret"

### 6. Configure Project
The `sonar-project.properties` file is already configured with:
- Project key and organization
- Source and test directories
- Exclusions (node_modules, build, coverage)
- Coverage report paths
- Language-specific settings

## How It Works

### On Pull Requests
- ✅ **Semgrep runs** - Fast security scan (30 seconds)
- ❌ **SonarCloud skipped** - Saves time on PRs

### On Push to dev/stage/main
- ✅ **Semgrep runs** - Fast security scan
- ✅ **SonarCloud runs** - Deep quality analysis (3-5 minutes)

## What SonarCloud Analyzes

### Security
- Vulnerabilities (SQL injection, XSS, etc.)
- Security hotspots
- Sensitive data exposure

### Reliability
- Bugs
- Code smells
- Error handling issues

### Maintainability
- Code complexity
- Code duplication
- Technical debt

### Coverage
- Test coverage percentage
- Uncovered lines
- Coverage trends

## Viewing Results

### SonarCloud Dashboard
1. Go to https://sonarcloud.io
2. Select your project: `ShopNow Fashion E-Commerce Platform`
3. View:
   - Overall quality gate status
   - Security vulnerabilities
   - Code smells
   - Technical debt
   - Coverage trends

### GitHub PR Comments
SonarCloud will automatically comment on PRs with:
- Quality gate status (Pass/Fail)
- New issues introduced
- Coverage changes

## Quality Gates

Default quality gate requires:
- ✅ 0 new vulnerabilities
- ✅ 0 new bugs
- ✅ Coverage on new code ≥ 80%
- ✅ Duplicated lines on new code ≤ 3%
- ✅ Maintainability rating ≥ A

## Troubleshooting

### "Project not found" error
- Verify `sonar.projectKey` matches SonarCloud project key
- Verify `sonar.organization` matches SonarCloud organization

### "Invalid token" error
- Regenerate token in SonarCloud
- Update `SONAR_TOKEN` secret in GitHub

### Coverage not showing
- Ensure tests generate `lcov.info` files
- Verify paths in `sonar.javascript.lcov.reportPaths`

## Local Analysis (Optional)

Install SonarScanner locally:
```bash
npm install -g sonarqube-scanner

# Run analysis
sonar-scanner \
  -Dsonar.projectKey=AbrahamGyamfi_Fashion-App \
  -Dsonar.organization=abrahamgyamfi \
  -Dsonar.sources=. \
  -Dsonar.host.url=https://sonarcloud.io \
  -Dsonar.login=YOUR_TOKEN
```

## Cost

- **Public repositories**: FREE ✅
- **Private repositories**: Paid plans starting at $10/month

## Links

- SonarCloud Dashboard: https://sonarcloud.io/project/overview?id=AbrahamGyamfi_Fashion-App
- Documentation: https://docs.sonarcloud.io
- GitHub Action: https://github.com/SonarSource/sonarcloud-github-action
