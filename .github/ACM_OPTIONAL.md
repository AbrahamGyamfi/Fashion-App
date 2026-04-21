# ACM Certificate - Now Optional

## Changes Made

ACM certificate is now **optional** instead of required. You can deploy without HTTPS initially.

---

## What Changed

### 1. Workflow - Removed ACM Requirement
**Before**:
```yaml
acm_certificate_arn = "${{ secrets.ACM_CERTIFICATE_ARN }}"
```

**After**:
```yaml
# ACM certificate line removed from tfvars generation
```

---

### 2. Terraform Variable - Made Optional
**Before**:
```hcl
variable "acm_certificate_arn" {
  description = "ARN of ACM certificate for HTTPS (required for production)"
  type        = string
  # No default - required!
}
```

**After**:
```hcl
variable "acm_certificate_arn" {
  description = "ARN of ACM certificate for HTTPS (optional)"
  type        = string
  default     = ""  # Empty string = no HTTPS
  
  validation {
    condition     = var.acm_certificate_arn == "" || can(regex("^arn:aws:acm:...", var.acm_certificate_arn))
    error_message = "Must be empty or valid ARN"
  }
}
```

---

### 3. ALB Module - Conditional HTTPS
**Before**:
```hcl
# HTTP always redirects to HTTPS
resource "aws_lb_listener" "http" {
  default_action {
    type = "redirect"  # Always redirect
  }
}

# HTTPS listener always created
resource "aws_lb_listener" "https" {
  certificate_arn = var.certificate_arn  # Required!
}
```

**After**:
```hcl
# HTTP forwards directly if no certificate
resource "aws_lb_listener" "http" {
  default_action {
    type = var.certificate_arn != "" ? "redirect" : "forward"
    # If certificate exists → redirect to HTTPS
    # If no certificate → forward to backend
  }
}

# HTTPS listener only created if certificate provided
resource "aws_lb_listener" "https" {
  count = var.certificate_arn != "" ? 1 : 0  # Conditional!
  # Only created when certificate_arn is not empty
}
```

---

## GitHub Secrets Required

### Now Only 10 Secrets (Not 11)

**AWS (2)**:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

**Staging (4)**:
- `STAGE_DB_PASSWORD`
- `STAGE_REDIS_PASSWORD`
- `STAGE_JWT_SECRET`
- `STAGE_SESSION_SECRET`

**Production (4)**:
- `PROD_DB_PASSWORD`
- `PROD_REDIS_PASSWORD`
- `PROD_JWT_SECRET`
- `PROD_SESSION_SECRET`

**~~Certificate (1)~~**: ❌ Not needed anymore!
- ~~`ACM_CERTIFICATE_ARN`~~

---

## How It Works Now

### Without Certificate (HTTP Only)
```
User → ALB (HTTP :80) → Backend ECS
```

**Behavior**:
- ALB listens on port 80 (HTTP)
- Forwards traffic directly to backend
- No HTTPS listener created
- No SSL/TLS encryption

---

### With Certificate (HTTPS)
```
User → ALB (HTTPS :443) → Backend ECS
       ↑
HTTP :80 redirects here
```

**Behavior**:
- ALB listens on port 80 (HTTP) → redirects to 443
- ALB listens on port 443 (HTTPS) → forwards to backend
- SSL/TLS encryption enabled

---

## When to Add Certificate

### Start Without (Recommended for Testing)
```
✅ Deploy without certificate
✅ Test application over HTTP
✅ Verify everything works
```

### Add Later (For Production)
1. **Create certificate in AWS Certificate Manager**
   ```bash
   aws acm request-certificate \
     --domain-name yourdomain.com \
     --validation-method DNS
   ```

2. **Add to Terraform**
   ```hcl
   # In main.tf
   module "alb" {
     certificate_arn = "arn:aws:acm:us-east-1:123456789012:certificate/abc-123"
   }
   ```

3. **Redeploy**
   ```bash
   terraform apply
   ```

---

## Security Considerations

### HTTP Only (Current Setup)
```
⚠️  No encryption in transit
⚠️  Passwords visible in network traffic
⚠️  Suitable for: Development, testing, internal apps
❌  NOT suitable for: Production with sensitive data
```

### HTTPS (With Certificate)
```
✅ Encrypted in transit
✅ Passwords protected
✅ Browser shows padlock
✅ Suitable for: Production
```

---

## Adding Certificate Later

### Step 1: Get Certificate ARN
```bash
aws acm list-certificates --region us-east-1
```

### Step 2: Update Terraform
```hcl
# infrastructure/terraform/main.tf
module "alb" {
  source = "./modules/alb"
  
  # Add this line
  certificate_arn = "arn:aws:acm:us-east-1:123456789012:certificate/abc-123"
  
  # ... other config
}
```

### Step 3: Apply Changes
```bash
cd infrastructure/terraform
terraform plan
terraform apply
```

**Result**: ALB will automatically:
- Create HTTPS listener on port 443
- Redirect HTTP (port 80) to HTTPS
- Enable SSL/TLS encryption

---

## Testing

### Test HTTP Access
```bash
# Get ALB DNS name
ALB_DNS=$(aws elbv2 describe-load-balancers \
  --names shopnow-alb-staging \
  --query 'LoadBalancers[0].DNSName' \
  --output text)

# Test HTTP endpoint
curl http://$ALB_DNS/api/health
```

**Expected**: Direct response from backend

---

### Test HTTPS (After Adding Certificate)
```bash
# Test HTTPS endpoint
curl https://$ALB_DNS/api/health

# Test HTTP redirect
curl -I http://$ALB_DNS/api/health
# Should return: HTTP/1.1 301 Moved Permanently
# Location: https://...
```

---

## Summary

### Before
- ❌ ACM certificate required
- ❌ 11 GitHub Secrets needed
- ❌ Can't deploy without HTTPS

### After
- ✅ ACM certificate optional
- ✅ Only 10 GitHub Secrets needed
- ✅ Can deploy with HTTP only
- ✅ Add HTTPS later when ready

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
```

**Total: 10 secrets** (ACM certificate removed!)

You can now deploy without HTTPS and add it later! 🚀
