variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "shopnow"
}

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, production)"
  type        = string
  default     = "production"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

# Database variables
variable "db_name" {
  description = "Database name"
  type        = string
  default     = "shopnow"
}

variable "db_username" {
  description = "Database master username"
  type        = string
  
  validation {
    condition     = length(var.db_username) >= 3 && length(var.db_username) <= 16
    error_message = "Database username must be between 3 and 16 characters."
  }
}

variable "db_password" {
  description = "Database master password (minimum 16 characters)"
  type        = string
  sensitive   = true
  
  validation {
    condition     = length(var.db_password) >= 16
    error_message = "Database password must be at least 16 characters for security."
  }
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "Allocated storage for RDS in GB"
  type        = number
  default     = 20
}

# Redis variables
variable "redis_node_type" {
  description = "ElastiCache node type"
  type        = string
  default     = "cache.t3.micro"
}

variable "redis_num_nodes" {
  description = "Number of cache nodes"
  type        = number
  default     = 1
}

variable "redis_password" {
  description = "Redis authentication token (minimum 16 characters)"
  type        = string
  sensitive   = true
  
  validation {
    condition     = length(var.redis_password) >= 16
    error_message = "Redis password must be at least 16 characters for security."
  }
}

# ECS variables
variable "ecs_task_cpu" {
  description = "CPU units for ECS task"
  type        = string
  default     = "512"
}

variable "ecs_task_memory" {
  description = "Memory for ECS task in MB"
  type        = string
  default     = "1024"
}

variable "ecs_desired_count" {
  description = "Desired number of ECS tasks"
  type        = number
  default     = 2
}

variable "ecs_min_capacity" {
  description = "Minimum number of ECS tasks"
  type        = number
  default     = 1
}

variable "ecs_max_capacity" {
  description = "Maximum number of ECS tasks"
  type        = number
  default     = 4
}

variable "image_tag" {
  description = "Docker image tag to deploy"
  type        = string
  default     = "latest"
}

# Application secrets
variable "jwt_secret" {
  description = "JWT secret key (minimum 32 characters)"
  type        = string
  sensitive   = true
  
  validation {
    condition     = length(var.jwt_secret) >= 32
    error_message = "JWT secret must be at least 32 characters for security."
  }
}

variable "session_secret" {
  description = "Session secret key (minimum 32 characters)"
  type        = string
  sensitive   = true
  
  validation {
    condition     = length(var.session_secret) >= 32
    error_message = "Session secret must be at least 32 characters for security."
  }
}

# SSL Certificate
variable "acm_certificate_arn" {
  description = "ARN of ACM certificate for HTTPS (required for production)"
  type        = string
  
  validation {
    condition     = can(regex("^arn:aws:acm:[a-z0-9-]+:[0-9]{12}:certificate/[a-z0-9-]+$", var.acm_certificate_arn))
    error_message = "ACM certificate ARN must be a valid AWS ARN format."
  }
}

# Tags
variable "tags" {
  description = "Additional tags for resources"
  type        = map(string)
  default     = {}
}

# Network Configuration
variable "az_count" {
  description = "Number of availability zones to use"
  type        = number
  default     = 2
}

# Port Configuration
variable "container_port" {
  description = "Application container port"
  type        = number
  default     = 3000
}

variable "db_port" {
  description = "PostgreSQL port"
  type        = number
  default     = 5432
}

variable "redis_port" {
  description = "Redis port"
  type        = number
  default     = 6379
}

# ALB Configuration
variable "enable_deletion_protection" {
  description = "Enable deletion protection for ALB"
  type        = bool
  default     = true
}

variable "health_check_path" {
  description = "Health check endpoint path"
  type        = string
  default     = "/api/health"
}

# Container Images
variable "postgres_image" {
  description = "PostgreSQL Docker image"
  type        = string
  default     = "postgres:15-alpine"
}

variable "redis_image" {
  description = "Redis Docker image"
  type        = string
  default     = "redis:7-alpine"
}


# NAT Instance Configuration
variable "nat_instance_type" {
  description = "EC2 instance type for NAT instance"
  type        = string
  default     = "t4g.nano"
}

variable "enable_nat_ssh" {
  description = "Enable SSH access to NAT instance for management"
  type        = bool
  default     = false
}

variable "nat_ssh_cidr_blocks" {
  description = "CIDR blocks allowed to SSH into NAT instance"
  type        = list(string)
  default     = null
}
