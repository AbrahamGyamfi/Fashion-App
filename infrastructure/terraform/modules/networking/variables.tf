variable "environment" {
  description = "Environment name"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
}

variable "availability_zones" {
  description = "List of availability zones"
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

variable "nat_instance_id" {
  description = "NAT instance ID (required if use_nat_gateway is false)"
  type        = string
  default     = null
}
