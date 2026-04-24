variable "environment" {
  description = "Environment name"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
}

variable "public_availability_zones" {
  description = "List of availability zones for public subnets"
  type        = list(string)
}

variable "private_availability_zones" {
  description = "List of availability zones for private subnets"
  type        = list(string)
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}

variable "use_nat_gateway" {
  description = "Use NAT Gateway (true) or NAT Instance (false)"
  type        = bool
  default     = false
}
