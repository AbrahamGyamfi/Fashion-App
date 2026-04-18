output "file_system_id" {
  description = "ID of the EFS file system"
  value       = aws_efs_file_system.main.id
}

output "efs_id" {
  description = "ID of the EFS file system (alias)"
  value       = aws_efs_file_system.main.id
}

output "dns_name" {
  description = "DNS name of the EFS file system"
  value       = aws_efs_file_system.main.dns_name
}

output "security_group_id" {
  description = "Security group ID for EFS"
  value       = aws_security_group.efs.id
}
