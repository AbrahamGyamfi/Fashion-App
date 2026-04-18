output "nat_instance_id" {
  description = "ID of the NAT instance"
  value       = aws_instance.nat_instance.id
}

output "nat_instance_private_ip" {
  description = "Private IP address of NAT instance"
  value       = aws_instance.nat_instance.private_ip
}

output "nat_instance_public_ip" {
  description = "Public IP address (Elastic IP) of NAT instance"
  value       = aws_eip.nat_instance.public_ip
}

output "nat_instance_eip_id" {
  description = "Allocation ID of the Elastic IP"
  value       = aws_eip.nat_instance.id
}

output "nat_security_group_id" {
  description = "Security group ID of NAT instance"
  value       = aws_security_group.nat_instance.id
}

output "nat_instance_arn" {
  description = "ARN of the NAT instance"
  value       = aws_instance.nat_instance.arn
}
