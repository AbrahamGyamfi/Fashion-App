variable "project_name" {
  description = "Project name for resource naming"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "database_secrets" {
  description = "Database credentials"
  type        = map(string)
  sensitive   = true
}

variable "redis_secrets" {
  description = "Redis credentials"
  type        = map(string)
  sensitive   = true
}

variable "app_secrets" {
  description = "Application secrets"
  type        = map(string)
  sensitive   = true
}

variable "recovery_window_in_days" {
  description = "Recovery window for deleted secrets"
  type        = number
  default     = 7
}

variable "tags" {
  description = "Additional tags"
  type        = map(string)
  default     = {}
}
