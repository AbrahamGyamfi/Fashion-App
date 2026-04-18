variable "project_name" {
  description = "Project name for resource naming"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID where NAT instance will be created"
  type        = string
}

variable "public_subnet_id" {
  description = "Public subnet ID for NAT instance"
  type        = string
}

variable "private_subnet_cidr" {
  description = "CIDR block of private subnet (for security group rules)"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type for NAT instance"
  type        = string
  default     = "t4g.nano"
}

variable "enable_ssh_access" {
  description = "Enable SSH access to NAT instance"
  type        = bool
  default     = false
}

variable "ssh_cidr_blocks" {
  description = "CIDR blocks allowed to SSH into NAT instance"
  type        = list(string)
  default     = null
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}
