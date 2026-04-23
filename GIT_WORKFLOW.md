# Git Workflow & Branch Strategy

## Branch Structure

```
main (production)
  ↑
stage (staging)
  ↑
dev (development)
  ↑
feature/* (feature branches)
```

## Branch Protection Rules

### Protected Branches
- ✅ `main` - Production environment
- ✅ `stage` - Staging environment  
- ✅ `dev` - Development environment

### Rules Applied
1. **No Direct Pushes** - All changes via Pull Requests only
2. **Require PR Reviews** - At least 1 approval required
3. **Status Checks Must Pass** - CI tests must pass before merge
4. **Up-to-date Branch** - Must be up-to-date with base branch

## Workflow

### 1. Create Feature Branch
```bash
git checkout dev
git pull origin dev
git checkout -b feature/your-feature-name
```

### 2. Make Changes & Commit
```bash
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
```

### 3. Create Pull Request
- **From:** `feature/your-feature-name`
- **To:** `dev`
- **Title:** Clear description of changes
- **Description:** What, why, and how

### 4. CI Pipeline Runs
```
✅ Backend Tests
✅ Frontend Tests
✅ Security Scans
✅ Linting
✅ Build Test
```

### 5. Code Review
- Request review from team member
- Address feedback
- Get approval

### 6. Merge to Dev
- Squash and merge
- Delete feature branch
- CI runs again (no deployment)

### 7. Promote to Stage
```bash
# Create PR: dev → stage
```
- CI runs all checks
- **On merge:** Deploys to staging environment
- Amplify creates preview URL

### 8. Promote to Production
```bash
# Create PR: stage → main
```
- Final review
- **On merge:** Deploys to production

## Deployment Triggers

| Branch | PR Created | PR Merged | Direct Push |
|--------|-----------|-----------|-------------|
| `dev` | ✅ CI only | ✅ CI only | ❌ Blocked |
| `stage` | ✅ CI only | ✅ CI + Deploy Staging | ❌ Blocked |
| `main` | ✅ CI only | ✅ CI + Deploy Production | ❌ Blocked |

## Commit Message Convention

```
<type>: <description>

[optional body]
[optional footer]
```

### Types
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance

### Examples
```bash
feat: add user authentication
fix: resolve cart calculation bug
docs: update API documentation
test: add unit tests for products API
```

## Setting Up Branch Protection (GitHub)

1. Go to **Settings** → **Branches**
2. Add rule for `main`, `stage`, `dev`
3. Enable:
   - ✅ Require pull request before merging
   - ✅ Require approvals (1)
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Do not allow bypassing the above settings

## Emergency Hotfix

For critical production issues:

```bash
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue
# Make fix
git push origin hotfix/critical-issue
# Create PR: hotfix → main (expedited review)
# After merge to main, also merge to stage and dev
```

## Best Practices

1. **Keep PRs Small** - Easier to review
2. **Write Tests** - All new features need tests
3. **Update Documentation** - Keep README current
4. **Descriptive Commits** - Clear commit messages
5. **Review Thoroughly** - Don't rush approvals
6. **Delete Branches** - Clean up after merge
7. **Stay Updated** - Pull latest before creating branch

## CI/CD Pipeline Flow

```
Feature Branch Push
    ↓
CI Checks (tests, lint, security)
    ↓
Create PR to dev
    ↓
Code Review + Approval
    ↓
Merge to dev (no deployment)
    ↓
Create PR to stage
    ↓
Merge to stage → Deploy to Staging
    ↓
Test in staging
    ↓
Create PR to main
    ↓
Merge to main → Deploy to Production
```

## Rollback Strategy

If deployment fails:

1. **Immediate:** Revert PR in GitHub
2. **Create revert PR** automatically
3. **Merge revert PR** to rollback
4. **Fix issue** in new feature branch
5. **Re-deploy** through normal flow
