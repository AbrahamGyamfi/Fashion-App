output "vpc_id" {
  description = "VPC ID"
  value       = module.networking.vpc_id
}

output "alb_dns_name" {
  description = "ALB DNS name"
  value       = module.alb.alb_dns_name
}

output "alb_zone_id" {
  description = "ALB Zone ID for Route53"
  value       = module.alb.alb_zone_id
}

output "ecs_cluster_name" {
  description = "ECS Cluster name"
  value       = module.ecs.cluster_name
}

output "ecs_service_name" {
  description = "ECS Service name"
  value       = module.ecs.service_name
}

output "ecr_repository_url" {
  description = "ECR Repository URL"
  value       = aws_ecr_repository.backend.repository_url
}

output "database_secret_arn" {
  description = "Database secrets ARN"
  value       = module.secrets.database_secret_arn
  sensitive   = true
}

output "redis_secret_arn" {
  description = "Redis secrets ARN"
  value       = module.secrets.redis_secret_arn
  sensitive   = true
}

output "backend_log_group" {
  description = "Backend CloudWatch log group name"
  value       = aws_cloudwatch_log_group.backend.name
}

output "postgres_log_group" {
  description = "PostgreSQL CloudWatch log group name"
  value       = aws_cloudwatch_log_group.postgres.name
}

output "redis_log_group" {
  description = "Redis CloudWatch log group name"
  value       = aws_cloudwatch_log_group.redis.name
}

output "efs_file_system_id" {
  description = "EFS file system ID"
  value       = module.efs.file_system_id
}

output "amplify_app_id" {
  description = "Amplify App ID"
  value       = module.amplify.app_id
}

output "amplify_default_domain" {
  description = "Amplify default domain"
  value       = module.amplify.default_domain
}

output "amplify_branch_url" {
  description = "Amplify branch URL"
  value       = module.amplify.branch_url
}

output "cloudfront_api_url" {
  description = "CloudFront HTTPS URL for the API (use as REACT_APP_API_URL)"
  value       = "https://${aws_cloudfront_distribution.api.domain_name}"
}
