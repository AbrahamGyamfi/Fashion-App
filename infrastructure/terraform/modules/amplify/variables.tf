variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "github_repository" {
  type        = string
  description = "GitHub repository URL (e.g., https://github.com/user/repo)"
}

variable "github_token" {
  type        = string
  sensitive   = true
  description = "GitHub personal access token for Amplify"
}

variable "branch_name" {
  type        = string
  description = "Git branch to deploy"
}

variable "api_url" {
  type        = string
  description = "Backend API URL (ALB DNS)"
}

variable "tags" {
  type    = map(string)
  default = {}
}
