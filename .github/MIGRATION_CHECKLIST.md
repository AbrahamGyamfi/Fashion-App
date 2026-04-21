# Quick Migration Checklist

## Update GitHub Secrets (5 minutes)

### Step 1: Rename DEV → STAGE

Go to: Settings → Secrets and variables → Actions

**Delete these 4 secrets**:
- [ ] `DEV_DB_PASSWORD`
- [ ] `DEV_REDIS_PASSWORD`
- [ ] `DEV_JWT_SECRET`
- [ ] `DEV_SESSION_SECRET`

**Add these 4 secrets** (same values, new names):
- [ ] `STAGE_DB_PASSWORD` (use old DEV value)
- [ ] `STAGE_REDIS_PASSWORD` (use old DEV value)
- [ ] `STAGE_JWT_SECRET` (use old DEV value)
- [ ] `STAGE_SESSION_SECRET` (use old DEV value)

**Keep these** (no changes):
- [ ] `AWS_ACCESS_KEY_ID`
- [ ] `AWS_SECRET_ACCESS_KEY`
- [ ] `PROD_DB_PASSWORD`
- [ ] `PROD_REDIS_PASSWORD`
- [ ] `PROD_JWT_SECRET`
- [ ] `PROD_SESSION_SECRET`

---

## Create stage Branch (2 minutes)

```bash
# Create stage branch from main
git checkout main
git pull origin main
git checkout -b stage
git push origin stage
```

---

## Create Terraform Variable Files (3 minutes)

```bash
cd infrastructure/terraform

# Rename dev.tfvars to staging.tfvars
mv dev.tfvars staging.tfvars

# Update environment value
# Edit staging.tfvars and change:
# environment = "dev"  →  environment = "staging"

# Keep production.tfvars as is
```

---

## Protect Branches (2 minutes)

### Protect stage Branch
1. Go to Settings → Branches
2. Click "Add rule"
3. Branch name pattern: `stage`
4. Enable: "Require a pull request before merging"
5. Enable: "Require approvals" (1 approval)
6. Click "Create"

### Protect main Branch (if not already)
1. Same steps as above
2. Branch name pattern: `main`

---

## Test the New Workflow (5 minutes)

### Test 1: CI on dev
```bash
git checkout dev
echo "# Test" >> README.md
git add README.md
git commit -m "test: new CI workflow"
git push origin dev
```

**Expected**: CI runs, no deployment ✅

### Test 2: Deploy to Staging
```bash
# Create PR
gh pr create --base stage --head dev --title "Test: Deploy to staging"

# Merge PR
gh pr merge --merge
```

**Expected**: Deploys to staging ✅

---

## Summary

**Total Time**: ~15 minutes

**Changes**:
- ✅ Renamed DEV secrets to STAGE
- ✅ Created stage branch
- ✅ Renamed dev.tfvars to staging.tfvars
- ✅ Protected stage and main branches
- ✅ Tested new workflow

**New Workflow**:
```
dev → CI only (no deploy)
stage → Deploy to Staging
main → Deploy to Production
```

Done! 🎉
