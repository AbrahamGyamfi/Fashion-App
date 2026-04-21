# Circular Dependency Fix

## Problem
Terraform was encountering a circular dependency error:
```
Error: Cycle: module.nat_instance ... module.networking
```

## Root Cause
The **networking module** was trying to create a route to the NAT instance **inside** the module itself, but:
1. The NAT instance depends on networking module outputs (VPC ID, subnet IDs)
2. The networking module was trying to reference the NAT instance ID
3. This created a circular dependency: networking → nat_instance → networking

## Solution
**Separated concerns** by moving the NAT instance route creation to the root `main.tf`:

### Changes Made

1. **modules/networking/main.tf**
   - Removed the dynamic route block that referenced `var.nat_instance_id`
   - Now only creates routes for NAT Gateway (if enabled)
   - NAT instance routes are handled externally

2. **modules/networking/outputs.tf**
   - Added `private_route_table_ids` output (list of all route tables)
   - Added `private_route_table_id` output (first route table for single AZ)

3. **modules/networking/variables.tf**
   - Removed unused `nat_instance_id` variable

4. **modules/nat-instance/outputs.tf**
   - Added `nat_network_interface_id` output for routing

5. **main.tf** (root)
   - Removed `nat_instance_id = ""` parameter from networking module call
   - Kept the `aws_route.private_nat` resource that creates the route after both modules exist

## How It Works Now

```
1. Networking module creates VPC, subnets, route tables (no NAT routes yet)
   ↓
2. NAT instance module creates NAT instance using networking outputs
   ↓
3. Root main.tf creates route from private route table → NAT instance
```

This breaks the cycle by ensuring:
- Networking module has **no dependency** on NAT instance
- NAT instance depends on networking (one-way dependency)
- Route creation happens **after** both modules are complete

## Verification
Run `terraform plan` to verify the fix:
```bash
cd infrastructure/terraform
terraform plan -var-file="staging.tfvars"
```

The circular dependency error should be resolved.
