# GitHub Secrets Setup - Dynamic tfvars (Option 2)

## Overview

The pipeline will **automatically generate** `.tfvars` files from GitHub Secrets.
You don't need to commit any `.tfvars` files!

---

## GitHub Secrets Required (11 Total)

### 1. AWS Credentials (2 secrets)

#### AWS_ACCESS_KEY_ID
```
Name:  AWS_ACCESS_KEY_ID
Value: <from AWS Console>
```

#### AWS_SECRET_ACCESS_KEY
```
Name:  AWS_SECRET_ACCESS_KEY
Value: <from AWS Console>
```

---

### 2. Staging Environment (4 secrets)

#### STAGE_DB_PASSWORD
```
Name:  STAGE_DB_PASSWORD
Value: <16+ characters>
Example: MyStageDBPass2024!
```

#### STAGE_REDIS_PASSWORD
```
Name:  STAGE_REDIS_PASSWORD
Value: <16+ characters>
Example: MyStageRedisPass2024!
```

#### STAGE_JWT_SECRET
```
Name:  STAGE_JWT_SECRET
Value: <32+ characters>
Example: MyStageJWTSecret12345678901234567890
```

#### STAGE_SESSION_SECRET
```
Name:  STAGE_SESSION_SECRET
Value: <32+ characters>
Example: MyStageSessionSecret1234567890123456
```

---

### 3. Production Environment (4 secrets)

#### PROD_DB_PASSWORD
```
Name:  PROD_DB_PASSWORD
Value: <16+ characters>
Example: MyProdDBPass2024!
```

#### PROD_REDIS_PASSWORD
```
Name:  PROD_REDIS_PASSWORD
Value: <16+ characters>
Example: MyProdRedisPass2024!
```

#### PROD_JWT_SECRET
```
Name:  PROD_JWT_SECRET
Value: <32+ characters>
Example: MyProdJWTSecret123456789012345678901
```

#### PROD_SESSION_SECRET
```
Name:  PROD_SESSION_SECRET
Value: <32+ characters>
Example: MyProdSessionSecret12345678901234567
```

---

### 4. SSL Certificate (1 secret)

#### ACM_CERTIFICATE_ARN
```
Name:  ACM_CERTIFICATE_ARN
Value: <ARN from AWS Certificate Manager>
Example: arn:aws:acm:us-east-1:123456789012:certificate/abc-123-def-456
```

**How to get**:
```bash
aws acm list-certificates --region us-east-1
```

Or AWS Console → Certificate Manager → Copy ARN

---

## Quick Setup Checklist

```
☐ 1.  AWS_ACCESS_KEY_ID
☐ 2.  AWS_SECRET_ACCESS_KEY
☐ 3.  STAGE_DB_PASSWORD
☐ 4.  STAGE_REDIS_PASSWORD
☐ 5.  STAGE_JWT_SECRET
☐ 6.  STAGE_SESSION_SECRET
☐ 7.  PROD_DB_PASSWORD
☐ 8.  PROD_REDIS_PASSWORD
☐ 9.  PROD_JWT_SECRET
☐ 10. PROD_SESSION_SECRET
☐ 11. ACM_CERTIFICATE_ARN
```

---

## How to Add Secrets to GitHub

### Step 1: Go to Repository Settings
1. Open your repository: `https://github.com/YOUR_USERNAME/Polly_Ochestrator`
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions** (left sidebar)

### Step 2: Add Each Secret
For each of the 11 secrets:
1. Click **"New repository secret"**
2. Enter the **Name** (exactly as shown above)
3. Enter the **Value**
4. Click **"Add secret"**

---

## Generate Secrets Script

Save this as `generate-all-secrets.sh`:

```bash
#!/bin/bash

echo "=================================================="
echo "  GitHub Secrets Generator (11 secrets)"
echo "=================================================="
echo ""

cat > my-secrets.txt << EOF
# Copy these to GitHub: Settings → Secrets and variables → Actions

AWS_ACCESS_KEY_ID=<GET_FROM_AWS_CONSOLE>
AWS_SECRET_ACCESS_KEY=<GET_FROM_AWS_CONSOLE>

STAGE_DB_PASSWORD=$(openssl rand -base64 24)
STAGE_REDIS_PASSWORD=$(openssl rand -base64 24)
STAGE_JWT_SECRET=$(openssl rand -base64 48)
STAGE_SESSION_SECRET=$(openssl rand -base64 48)

PROD_DB_PASSWORD=$(openssl rand -base64 24)
PROD_REDIS_PASSWORD=$(openssl rand -base64 24)
PROD_JWT_SECRET=$(openssl rand -base64 48)
PROD_SESSION_SECRET=$(openssl rand -base64 48)

ACM_CERTIFICATE_ARN=<GET_FROM_AWS_CERTIFICATE_MANAGER>
EOF

echo "✅ Secrets generated in: my-secrets.txt"
echo ""
cat my-secrets.txt
```

**Run it**:
```bash
chmod +x generate-all-secrets.sh
./generate-all-secrets.sh
```

---

## How Dynamic Generation Works

### When Pipeline Runs

**Step 1: Pipeline creates .tfvars file**
```yaml
- name: Create tfvars File
  run: |
    cat > staging.tfvars << EOF
    environment = "staging"
    db_username = "admin"
    ecs_task_cpu = "512"
    acm_certificate_arn = "${{ secrets.ACM_CERTIFICATE_ARN }}"
    # ... all config
    EOF
```

**Step 2: Terraform uses it**
```yaml
- name: Terraform Plan
  run: terraform plan -var-file="staging.tfvars"
  env:
    TF_VAR_db_password: ${{ secrets.STAGE_DB_PASSWORD }}
```

**Step 3: File is deleted after workflow**
(Temporary, never committed)

---

## Environment-Specific Configuration

### Staging (Auto-configured)
- CPU: 512 (0.5 vCPU)
- Memory: 1024 MB (1 GB)
- Deletion protection: false

### Production (Auto-configured)
- CPU: 1024 (1 vCPU)
- Memory: 2048 MB (2 GB)
- Deletion protection: true

**No files to maintain!** Pipeline adjusts automatically.

---

## Verification

### After Adding All Secrets

Go to: Settings → Secrets and variables → Actions

You should see:
```
Repository secrets (11)

ACM_CERTIFICATE_ARN
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
PROD_DB_PASSWORD
PROD_JWT_SECRET
PROD_REDIS_PASSWORD
PROD_SESSION_SECRET
STAGE_DB_PASSWORD
STAGE_JWT_SECRET
STAGE_REDIS_PASSWORD
STAGE_SESSION_SECRET
```

---

## Test the Setup

### Push to dev (CI only)
```bash
git checkout dev
git add .
git commit -m "test: dynamic tfvars"
git push origin dev
```

**Expected**: CI runs, no deployment

### Create PR to stage (Deploy to staging)
```bash
gh pr create --base stage --head dev --title "Deploy to staging"
gh pr merge --merge
```

**Expected**: 
- Pipeline generates `staging.tfvars`
- Deploys to staging
- File deleted after workflow

---

## Benefits

✅ **No files to commit** - Everything in secrets
✅ **Single source of truth** - All config in GitHub
✅ **Easy updates** - Just change secrets
✅ **Environment-specific** - Auto-adjusts per environment
✅ **Secure** - Even ACM ARN in secrets

---

## Summary

**Total Secrets**: 11
- AWS: 2
- Staging: 4
- Production: 4
- Certificate: 1

**Files to Commit**: 0 (pipeline generates everything)

**Time to Setup**: ~15 minutes

You're all set! 🚀
