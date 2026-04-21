# Updated CI/CD Workflow - Branching Strategy

## New Branching Strategy

```
dev → stage → main
 ↓      ↓       ↓
CI    Deploy  Deploy
Only  Staging  Prod
```

---

## Branch Purposes

### `dev` Branch (Development)
**Purpose**: Active development and testing
**Workflow**: CI only (no deployment)
**Triggers**:
- Push to `dev` → Runs CI tests
- No deployment happens

**What runs**:
- ✅ Install dependencies
- ✅ Run tests
- ✅ Security scans (npm audit, Semgrep)
- ✅ Code linting
- ❌ No Docker build
- ❌ No deployment

---

### `stage` Branch (Staging)
**Purpose**: Pre-production testing
**Workflow**: Full CI/CD pipeline
**Triggers**:
- PR merged to `stage` → Runs CI + Build + Deploy to Staging

**What runs**:
- ✅ CI tests
- ✅ Build Docker image
- ✅ Push to ECR
- ✅ Deploy to ECS Staging
- ✅ Health checks

---

### `main` Branch (Production)
**Purpose**: Production environment
**Workflow**: Full CI/CD pipeline
**Triggers**:
- PR merged to `main` → Runs CI + Build + Deploy to Production

**What runs**:
- ✅ CI tests
- ✅ Build Docker image
- ✅ Push to ECR
- ✅ Deploy to ECS Production
- ✅ Health checks
- ✅ Requires manual approval (GitHub Environment protection)

---

## Workflow Diagram

```
Developer
    ↓
Push to dev
    ↓
┌─────────────────┐
│   CI Pipeline   │
│  - Tests        │
│  - Security     │
│  - Linting      │
└─────────────────┘
    ↓
Create PR: dev → stage
    ↓
Code Review
    ↓
Merge to stage
    ↓
┌─────────────────┐
│  Build & Deploy │
│  to Staging     │
└─────────────────┘
    ↓
Test in Staging
    ↓
Create PR: stage → main
    ↓
Code Review
    ↓
Merge to main
    ↓
┌─────────────────┐
│  Build & Deploy │
│  to Production  │
└─────────────────┘
```

---

## GitHub Secrets Required

### Updated Secret Names

**Staging Environment** (4 secrets):
```
STAGE_DB_PASSWORD
STAGE_REDIS_PASSWORD
STAGE_JWT_SECRET
STAGE_SESSION_SECRET
```

**Production Environment** (4 secrets):
```
PROD_DB_PASSWORD
PROD_REDIS_PASSWORD
PROD_JWT_SECRET
PROD_SESSION_SECRET
```

**AWS Credentials** (2 secrets):
```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
```

**Total: 10 secrets** (same as before, just renamed DEV → STAGE)

---

## How to Use the New Workflow

### Step 1: Development (dev branch)
```bash
# Work on dev branch
git checkout dev

# Make changes
git add .
git commit -m "feat: add new feature"

# Push to dev
git push origin dev
```

**Result**: CI runs (tests, security scans) - No deployment

---

### Step 2: Deploy to Staging
```bash
# Create PR from dev to stage
gh pr create --base stage --head dev --title "Deploy to Staging"

# Or via GitHub UI:
# 1. Go to Pull Requests
# 2. Click "New pull request"
# 3. Base: stage ← Compare: dev
# 4. Create pull request
```

**After PR is merged**:
- ✅ CI runs
- ✅ Docker image built
- ✅ Deployed to Staging ECS
- ✅ Health checks run

---

### Step 3: Deploy to Production
```bash
# Test in staging first!
# Then create PR from stage to main
gh pr create --base main --head stage --title "Deploy to Production"

# Or via GitHub UI:
# 1. Go to Pull Requests
# 2. Click "New pull request"
# 3. Base: main ← Compare: stage
# 4. Create pull request
```

**After PR is merged**:
- ✅ CI runs
- ✅ Docker image built
- ✅ Deployed to Production ECS
- ✅ Health checks run
- ⚠️ May require manual approval (if GitHub Environment protection enabled)

---

## Workflow Files

### 1. Application CI/CD (`ci-cd.yml`)

**Triggers**:
```yaml
on:
  push:
    branches: [dev]  # CI only
  pull_request:
    branches: [stage, main]  # CI + Deploy
```

**Jobs**:
1. **ci**: Runs on all pushes and PRs
2. **build**: Runs only when merged to stage or main
3. **deploy**: Runs only when merged to stage or main

---

### 2. Infrastructure Deployment (`infrastructure.yml`)

**Triggers**:
```yaml
on:
  push:
    branches: [stage, main]  # Deploy infrastructure
  pull_request:
    branches: [stage, main]  # Plan only
```

**Environments**:
- `stage` branch → `staging.tfvars`
- `main` branch → `production.tfvars`

---

## Environment Configuration

### Create Terraform Variable Files

**staging.tfvars**:
```hcl
environment = "staging"
db_username = "admin"
db_name     = "shopnow"

# Secrets from GitHub (STAGE_*)
# These are injected by workflow, not in file
```

**production.tfvars**:
```hcl
environment = "production"
db_username = "admin"
db_name     = "shopnow"

# Secrets from GitHub (PROD_*)
# These are injected by workflow, not in file
```

---

## GitHub Environment Protection (Optional)

### Enable for Production
1. Go to **Settings** → **Environments**
2. Click **New environment** → Name: `production`
3. Enable **Required reviewers**
4. Add reviewers (team members who must approve)
5. Enable **Wait timer** (optional delay before deployment)

**Result**: Production deployments require manual approval

---

## Migration from Old Workflow

### Update GitHub Secrets

**Rename DEV secrets to STAGE**:
1. Go to Settings → Secrets and variables → Actions
2. Delete old DEV secrets:
   - `DEV_DB_PASSWORD`
   - `DEV_REDIS_PASSWORD`
   - `DEV_JWT_SECRET`
   - `DEV_SESSION_SECRET`
3. Add new STAGE secrets:
   - `STAGE_DB_PASSWORD`
   - `STAGE_REDIS_PASSWORD`
   - `STAGE_JWT_SECRET`
   - `STAGE_SESSION_SECRET`

**Keep PROD secrets** (no changes needed)

---

### Create stage Branch
```bash
# Create stage branch from main
git checkout main
git pull
git checkout -b stage
git push origin stage

# Protect stage branch
# Go to Settings → Branches → Add rule
# Branch name pattern: stage
# Enable: Require pull request reviews before merging
```

---

## Testing the New Workflow

### Test 1: CI on dev
```bash
git checkout dev
echo "test" >> README.md
git add README.md
git commit -m "test: CI pipeline"
git push origin dev
```

**Expected**: CI runs, no deployment

---

### Test 2: Deploy to Staging
```bash
# Create PR: dev → stage
gh pr create --base stage --head dev --title "Test staging deployment"

# Merge PR
gh pr merge --merge

# Watch deployment
# Go to Actions tab → See "Application CI/CD" workflow
```

**Expected**: CI + Build + Deploy to Staging

---

### Test 3: Deploy to Production
```bash
# Create PR: stage → main
gh pr create --base main --head stage --title "Test production deployment"

# Merge PR (may require approval)
gh pr merge --merge

# Watch deployment
# Go to Actions tab → See "Application CI/CD" workflow
```

**Expected**: CI + Build + Deploy to Production

---

## Rollback Strategy

### Rollback Staging
```bash
# Revert the merge commit
git checkout stage
git revert HEAD
git push origin stage
```

**Result**: Previous version redeploys to staging

---

### Rollback Production
```bash
# Revert the merge commit
git checkout main
git revert HEAD
git push origin main
```

**Result**: Previous version redeploys to production

---

## Monitoring Deployments

### View Workflow Status
```bash
# List recent workflow runs
gh run list

# View specific run
gh run view <run-id>

# Watch live
gh run watch
```

---

### View Deployment Logs
```bash
# ECS service events
aws ecs describe-services \
  --cluster shopnow-staging \
  --services shopnow-staging \
  --query 'services[0].events[0:5]'

# Container logs
aws logs tail /ecs/shopnow-backend-staging --follow
```

---

## Best Practices

### 1. Always Test in Staging First
```
✅ dev → stage → test → main
❌ dev → main (skip staging)
```

### 2. Use Pull Requests
```
✅ Create PR for code review
❌ Direct push to stage/main
```

### 3. Keep Branches in Sync
```bash
# Regularly sync dev with stage
git checkout dev
git merge stage

# Regularly sync stage with main
git checkout stage
git merge main
```

### 4. Tag Production Releases
```bash
# After successful production deployment
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

---

## Troubleshooting

### CI Fails on dev
**Issue**: Tests or security scans fail
**Solution**: Fix issues locally, push again

### Build Fails on stage/main
**Issue**: Docker build fails
**Solution**: Check Dockerfile, test build locally

### Deployment Fails
**Issue**: ECS deployment fails
**Solution**: Check ECS service events, container logs

### Health Check Fails
**Issue**: Application not responding
**Solution**: Check application logs, verify database connectivity

---

## Summary

### Old Workflow
```
dev → CI + Deploy
main → CI + Deploy
```

### New Workflow
```
dev → CI only
stage → CI + Deploy to Staging
main → CI + Deploy to Production
```

### Benefits
- ✅ Safer deployments (test in staging first)
- ✅ Cleaner dev branch (no deployments)
- ✅ Better separation of environments
- ✅ Production approval gates (optional)
- ✅ Easier rollbacks

---

## Quick Reference

| Branch | Push Triggers | PR Triggers | Deployment |
|--------|--------------|-------------|------------|
| `dev` | CI only | - | None |
| `stage` | CI + Deploy | CI only | Staging |
| `main` | CI + Deploy | CI only | Production |

**Secrets Needed**: 10 total (STAGE_* × 4, PROD_* × 4, AWS_* × 2)
