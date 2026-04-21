#!/bin/bash

# Generate All 11 GitHub Secrets
# For dynamic tfvars generation (Option 2)

echo "=================================================="
echo "  ShopNow - Complete Secrets Generator"
echo "  (11 secrets for dynamic tfvars)"
echo "=================================================="
echo ""

OUTPUT_FILE="all-secrets-$(date +%Y%m%d-%H%M%S).txt"

cat > "$OUTPUT_FILE" << EOF
================================================
ShopNow GitHub Secrets - Complete List
Generated: $(date)
================================================

Add these to GitHub: Settings → Secrets and variables → Actions

================================================
1. AWS Credentials (Get from AWS Console)
================================================

Name:  AWS_ACCESS_KEY_ID
Value: <PASTE_YOUR_AWS_ACCESS_KEY_HERE>

Name:  AWS_SECRET_ACCESS_KEY
Value: <PASTE_YOUR_AWS_SECRET_KEY_HERE>

================================================
2. Staging Environment Secrets
================================================

Name:  STAGE_DB_PASSWORD
Value: $(openssl rand -base64 24)

Name:  STAGE_REDIS_PASSWORD
Value: $(openssl rand -base64 24)

Name:  STAGE_JWT_SECRET
Value: $(openssl rand -base64 48)

Name:  STAGE_SESSION_SECRET
Value: $(openssl rand -base64 48)

================================================
3. Production Environment Secrets
================================================

Name:  PROD_DB_PASSWORD
Value: $(openssl rand -base64 24)

Name:  PROD_REDIS_PASSWORD
Value: $(openssl rand -base64 24)

Name:  PROD_JWT_SECRET
Value: $(openssl rand -base64 48)

Name:  PROD_SESSION_SECRET
Value: $(openssl rand -base64 48)

================================================
4. SSL Certificate (Get from AWS Certificate Manager)
================================================

Name:  ACM_CERTIFICATE_ARN
Value: <PASTE_YOUR_ACM_CERTIFICATE_ARN_HERE>

How to get:
  aws acm list-certificates --region us-east-1

Or AWS Console → Certificate Manager → Copy ARN

================================================
Setup Checklist
================================================

☐ AWS_ACCESS_KEY_ID
☐ AWS_SECRET_ACCESS_KEY
☐ STAGE_DB_PASSWORD
☐ STAGE_REDIS_PASSWORD
☐ STAGE_JWT_SECRET
☐ STAGE_SESSION_SECRET
☐ PROD_DB_PASSWORD
☐ PROD_REDIS_PASSWORD
☐ PROD_JWT_SECRET
☐ PROD_SESSION_SECRET
☐ ACM_CERTIFICATE_ARN

================================================
Instructions
================================================

1. Get AWS credentials from AWS Console
2. Get ACM certificate ARN from Certificate Manager
3. Go to GitHub: Settings → Secrets and variables → Actions
4. Add all 11 secrets manually
5. Delete this file after setup

================================================
Security Reminder
================================================

✓ Store this file securely (password manager)
✓ Delete after adding secrets to GitHub
✓ Never commit to Git
✓ Never share via email/chat

EOF

echo "✅ All 11 secrets generated and saved to: $OUTPUT_FILE"
echo ""
echo "Next steps:"
echo "  1. Open $OUTPUT_FILE"
echo "  2. Get AWS credentials from AWS Console"
echo "  3. Get ACM certificate ARN from Certificate Manager"
echo "  4. Go to GitHub: Settings → Secrets and variables → Actions"
echo "  5. Add all 11 secrets manually"
echo "  6. Delete $OUTPUT_FILE after setup"
echo ""
echo "📖 See DYNAMIC_TFVARS_SETUP.md for detailed instructions"
echo ""
