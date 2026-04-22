# GitHub Secrets Setup Guide

## ❌ Current Error
```
Error: Invalid value for variable
Database password must be at least 16 characters for security.
Redis password must be at least 16 characters for security.
```

## Required GitHub Secrets

You need to set these secrets in your GitHub repository before the pipeline can deploy.

### For Staging Environment

| Secret Name | Minimum Length | Example Generator |
|------------|----------------|-------------------|
| `STAGE_DB_PASSWORD` | 16 characters | Use command below |
| `STAGE_REDIS_PASSWORD` | 16 characters | Use command below |
| `STAGE_JWT_SECRET` | 32 characters | Use command below |
| `STAGE_SESSION_SECRET` | 32 characters | Use command below |

### For Production Environment (Future)

| Secret Name | Minimum Length |
|------------|----------------|
| `PROD_DB_PASSWORD` | 16 characters |
| `PROD_REDIS_PASSWORD` | 16 characters |
| `PROD_JWT_SECRET` | 32 characters |
| `PROD_SESSION_SECRET` | 32 characters |

---

## How to Set GitHub Secrets

### Step 1: Generate Secure Passwords

**On Windows (PowerShell):**
```powershell
# Generate 16-character password for DB
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 16 | ForEach-Object {[char]$_})

# Generate 16-character password for Redis
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 16 | ForEach-Object {[char]$_})

# Generate 32-character JWT secret
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Generate 32-character Session secret
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**On Linux/Mac:**
```bash
# Generate 16-character password for DB
openssl rand -base64 16

# Generate 16-character password for Redis
openssl rand -base64 16

# Generate 32-character JWT secret
openssl rand -base64 32

# Generate 32-character Session secret
openssl rand -base64 32
```

**Online Generator (Alternative):**
- Visit: https://www.random.org/passwords/
- Set length to 16 for passwords, 32 for secrets
- Generate and copy

---

### Step 2: Add Secrets to GitHub

1. **Go to your repository:**
   ```
   https://github.com/AbrahamGyamfi/Fashion-App
   ```

2. **Navigate to Settings:**
   - Click on **Settings** tab
   - In the left sidebar, click **Secrets and variables**
   - Click **Actions**

3. **Add each secret:**
   - Click **New repository secret**
   - Enter the name (e.g., `STAGE_DB_PASSWORD`)
   - Paste the generated value
   - Click **Add secret**

4. **Repeat for all 4 staging secrets:**
   - `STAGE_DB_PASSWORD` (16+ chars)
   - `STAGE_REDIS_PASSWORD` (16+ chars)
   - `STAGE_JWT_SECRET` (32+ chars)
   - `STAGE_SESSION_SECRET` (32+ chars)

---

### Step 3: Verify Secrets Are Set

After adding all secrets, you should see them listed (values will be hidden):

```
✅ STAGE_DB_PASSWORD
✅ STAGE_REDIS_PASSWORD
✅ STAGE_JWT_SECRET
✅ STAGE_SESSION_SECRET
```

---

### Step 4: Re-run the Pipeline

Once secrets are set:

1. **Go to Actions tab:**
   ```
   https://github.com/AbrahamGyamfi/Fashion-App/actions
   ```

2. **Find the failed workflow:**
   - Click on "Infrastructure Deployment"
   - Click on the failed run

3. **Re-run the workflow:**
   - Click **Re-run all jobs** button
   - Or push a new commit to trigger it again

---

## Quick Setup Script (PowerShell)

Save this as `generate-secrets.ps1` and run it:

```powershell
Write-Host "=== GitHub Secrets Generator ===" -ForegroundColor Cyan
Write-Host ""

$dbPassword = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 20 | ForEach-Object {[char]$_})
$redisPassword = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 20 | ForEach-Object {[char]$_})
$jwtSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 40 | ForEach-Object {[char]$_})
$sessionSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 40 | ForEach-Object {[char]$_})

Write-Host "STAGE_DB_PASSWORD:" -ForegroundColor Green
Write-Host $dbPassword
Write-Host ""

Write-Host "STAGE_REDIS_PASSWORD:" -ForegroundColor Green
Write-Host $redisPassword
Write-Host ""

Write-Host "STAGE_JWT_SECRET:" -ForegroundColor Green
Write-Host $jwtSecret
Write-Host ""

Write-Host "STAGE_SESSION_SECRET:" -ForegroundColor Green
Write-Host $sessionSecret
Write-Host ""

Write-Host "=== Copy these values to GitHub Secrets ===" -ForegroundColor Yellow
Write-Host "Go to: https://github.com/AbrahamGyamfi/Fashion-App/settings/secrets/actions" -ForegroundColor Cyan
```

---

## Security Best Practices

✅ **DO:**
- Use different passwords for each environment (staging vs production)
- Store secrets only in GitHub Secrets (never commit to code)
- Use strong, randomly generated passwords
- Rotate secrets periodically

❌ **DON'T:**
- Use simple passwords like "password123"
- Reuse passwords across environments
- Share secrets in plain text (Slack, email, etc.)
- Commit secrets to version control

---

## Troubleshooting

### "Secret not found" error
- Make sure secret names match exactly (case-sensitive)
- Verify you're in the correct repository
- Check that secrets are under "Actions" not "Dependabot"

### "Invalid value for variable" error
- Ensure passwords are at least 16 characters
- Ensure JWT/Session secrets are at least 32 characters
- No special characters that might break shell commands

### Pipeline still fails after adding secrets
- Re-run the workflow (don't just push a new commit)
- Check the workflow file uses correct secret names
- Verify secrets are set in the repository (not organization level)

---

## Next Steps After Setting Secrets

1. ✅ Set all 4 staging secrets
2. ✅ Re-run the GitHub Actions workflow
3. ✅ Wait for Terraform to deploy (~10-15 minutes)
4. ✅ Check outputs for ALB DNS name
5. ✅ Test the deployed application

---

## Example Values (DO NOT USE THESE - GENERATE YOUR OWN)

```
STAGE_DB_PASSWORD: aB3dE5fG7hI9jK1lM3nO5pQ7rS9tU1vW
STAGE_REDIS_PASSWORD: xY2zA4bC6dE8fG0hI2jK4lM6nO8pQ0rS
STAGE_JWT_SECRET: tU4vW6xY8zA0bC2dE4fG6hI8jK0lM2nO4pQ6rS8tU0vW2xY4zA6bC8dE0fG2hI4jK6lM8nO0pQ2rS4tU6vW8xY0zA
STAGE_SESSION_SECRET: 2bC4dE6fG8hI0jK2lM4nO6pQ8rS0tU2vW4xY6zA8bC0dE2fG4hI6jK8lM0nO2pQ4rS6tU8vW0xY2zA4bC6dE8fG0hI
```

**⚠️ IMPORTANT: Generate your own unique secrets!**
