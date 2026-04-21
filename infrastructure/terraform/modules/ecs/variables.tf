variable "project_name" {
  description = "Project name for resource naming"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where ECS tasks will run"
  type        = string
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs for ECS tasks"
  type        = list(string)
}

variable "alb_security_group_id" {
  description = "Security group ID of the ALB"
  type        = string
}

variable "alb_target_group_arn" {
  description = "ARN of the ALB target group"
  type        = string
}

variable "container_image" {
  description = "Docker image for the backend container"
  type        = string
}

variable "backend_container_name" {
  description = "Name of the backend container"
  type        = string
  default     = "backend"
}

variable "container_port" {
  description = "Port exposed by the container"
  type        = number
  default     = 3000
}

variable "cpu" {
  description = "CPU units for the task (256, 512, 1024, 2048, 4096)"
  type        = string
  default     = "512"
}

variable "memory" {
  description = "Memory for the task in MB (512, 1024, 2048, 4096, 8192)"
  type        = string
  default     = "1024"
}

variable "desired_count" {
  description = "Desired number of ECS tasks"
  type        = number
  default     = 2
}

variable "min_capacity" {
  description = "Minimum number of tasks for auto-scaling"
  type        = number
  default     = 1
}

variable "max_capacity" {
  description = "Maximum number of tasks for auto-scaling"
  type        = number
  default     = 4
}

variable "secrets_arns" {
  description = "Map of secret ARNs for database, redis, and app"
  type = object({
    database = string
    redis    = string
    app      = string
  })
  sensitive = true
}

variable "efs_file_system_id" {
  description = "EFS file system ID for persistent storage"
  type        = string
}

# Database Configuration
variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "shopnow"
}

variable "db_username" {
  description = "PostgreSQL username"
  type        = string
  default     = "admin"
}

variable "db_host" {
  description = "PostgreSQL host (container name for localhost communication)"
  type        = string
  default     = "localhost"
}

variable "db_port" {
  description = "PostgreSQL port"
  type        = number
  default     = 5432
}

variable "postgres_container_name" {
  description = "Name of the PostgreSQL container"
  type        = string
  default     = "postgres"
}

variable "postgres_image" {
  description = "PostgreSQL Docker image"
  type        = string
  default     = "postgres:15-alpine"
}

variable "postgres_data_dir" {
  description = "PostgreSQL data directory inside container"
  type        = string
  default     = "/var/lib/postgresql/data/pgdata"
}

# Redis Configuration
variable "redis_host" {
  description = "Redis host (container name for localhost communication)"
  type        = string
  default     = "localhost"
}

variable "redis_port" {
  description = "Redis port"
  type        = number
  default     = 6379
}

variable "redis_container_name" {
  description = "Name of the Redis container"
  type        = string
  default     = "redis"
}

variable "redis_image" {
  description = "Redis Docker image"
  type        = string
  default     = "redis:7-alpine"
}

variable "redis_data_dir" {
  description = "Redis data directory inside container"
  type        = string
  default     = "/data"
}

# Auto-scaling Configuration
variable "cpu_target_value" {
  description = "Target CPU utilization percentage for auto-scaling"
  type        = number
  default     = 70
}

variable "memory_target_value" {
  description = "Target memory utilization percentage for auto-scaling"
  type        = number
  default     = 80
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}
