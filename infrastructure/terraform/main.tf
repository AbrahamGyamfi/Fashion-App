terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "shopnow-terraform-state-abrahamgyamfi"
    key            = "staging/terraform.tfstate"  # Safe default, overridden by workflow -backend-config
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "shopnow-terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "ShopNow"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# Data sources
data "aws_caller_identity" "current" {}
data "aws_availability_zones" "available" {
  state = "available"
}

# Local variables
locals {
  account_id = data.aws_caller_identity.current.account_id
  # ALB requires 2 AZs, but we only use 1 AZ for ECS (cost optimization)
  alb_az_count = 2 # For ALB in public subnets
  ecs_az_count = 1 # For ECS in private subnet
  alb_azs      = slice(data.aws_availability_zones.available.names, 0, local.alb_az_count)
  ecs_azs      = slice(data.aws_availability_zones.available.names, 0, local.ecs_az_count)
  project_name = var.project_name

  # Environment-specific configurations
  ecs_desired_count = 1
  ecs_min_capacity  = 1
  ecs_max_capacity  = 2

  # Cost optimizations
  enable_deletion_protection = false
  log_retention_days         = 7

  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# VPC and Networking
module "networking" {
  source = "./modules/networking"

  environment                = var.environment
  vpc_cidr                   = var.vpc_cidr
  public_availability_zones  = local.alb_azs
  private_availability_zones = local.ecs_azs
  use_nat_gateway            = false

  tags = local.common_tags
}

# NAT Instance removed - ECS now runs in public subnet with direct internet access

# EFS for PostgreSQL and Redis data persistence
module "efs" {
  source = "./modules/efs"

  environment        = var.environment
  vpc_id             = module.networking.vpc_id
  vpc_cidr           = var.vpc_cidr
  private_subnet_ids = module.networking.public_subnet_ids

  tags = local.common_tags
}

# Secrets Manager
module "secrets" {
  source = "./modules/secrets"

  project_name = var.project_name
  environment  = var.environment

  database_secrets = {
    username = var.db_username
    password = var.db_password
    host     = "postgres"
    port     = tostring(var.db_port)
    database = var.db_name
  }

  redis_secrets = {
    host     = "redis"
    port     = tostring(var.redis_port)
    password = var.redis_password
  }

  app_secrets = {
    jwt_secret     = var.jwt_secret
    session_secret = var.session_secret
  }

  tags = local.common_tags
}

# Network Load Balancer (works with single AZ)
module "alb" {
  source = "./modules/alb"

  project_name      = var.project_name
  environment       = var.environment
  vpc_id            = module.networking.vpc_id
  public_subnet_ids = module.networking.public_subnet_ids

  certificate_arn = var.acm_certificate_arn
  target_port     = var.container_port

  enable_deletion_protection = local.enable_deletion_protection
  health_check_path          = var.health_check_path

  tags = local.common_tags
}

# ECS Cluster and Backend Services
module "ecs" {
  source = "./modules/ecs"

  project_name = var.project_name
  environment  = var.environment

  vpc_id             = module.networking.vpc_id
  public_subnet_ids  = module.networking.public_subnet_ids

  alb_target_group_arn  = module.alb.target_group_arn
  alb_security_group_id = module.alb.security_group_id

  container_image = "${local.account_id}.dkr.ecr.${var.aws_region}.amazonaws.com/${var.project_name}-backend:${var.image_tag}"
  container_port  = var.container_port

  cpu    = var.ecs_task_cpu
  memory = var.ecs_task_memory

  desired_count = local.ecs_desired_count
  min_capacity  = local.ecs_min_capacity
  max_capacity  = local.ecs_max_capacity

  efs_file_system_id = module.efs.file_system_id

  # Database configuration
  db_name     = var.db_name
  db_username = var.db_username
  db_host     = "localhost"
  db_port     = var.db_port

  # PostgreSQL container configuration
  postgres_container_name = "postgres"
  postgres_image          = "postgres:15-alpine"
  postgres_data_dir       = "/var/lib/postgresql/data/pgdata"

  # Redis configuration
  redis_host = "localhost"
  redis_port = var.redis_port

  # Redis container configuration
  redis_container_name = "redis"
  redis_image          = "redis:7-alpine"
  redis_data_dir       = "/data"

  secrets_arns = {
    database = module.secrets.database_secret_arn
    redis    = module.secrets.redis_secret_arn
    app      = module.secrets.app_secret_arn
  }

  tags = local.common_tags
}

# CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/${var.project_name}-backend-${var.environment}"
  retention_in_days = local.log_retention_days

  tags = local.common_tags
}

resource "aws_cloudwatch_log_group" "postgres" {
  name              = "/ecs/${var.project_name}-postgres-${var.environment}"
  retention_in_days = local.log_retention_days

  tags = local.common_tags
}

resource "aws_cloudwatch_log_group" "redis" {
  name              = "/ecs/${var.project_name}-redis-${var.environment}"
  retention_in_days = local.log_retention_days

  tags = local.common_tags
}

# Amplify for Frontend Hosting
module "amplify" {
  source = "./modules/amplify"

  project_name      = var.project_name
  environment       = var.environment
  github_repository = var.github_repository
  github_token      = var.github_token
  branch_name       = var.amplify_branch_name
  api_url           = "http://${module.alb.alb_dns_name}"

  tags = local.common_tags
}

# ECR Repository for Backend
resource "aws_ecr_repository" "backend" {
  name                 = "${var.project_name}-backend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = local.common_tags
}

resource "aws_ecr_lifecycle_policy" "backend" {
  repository = aws_ecr_repository.backend.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Keep last 10 images"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 10
      }
      action = {
        type = "expire"
      }
    }]
  })
}
