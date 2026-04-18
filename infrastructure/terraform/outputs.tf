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

output "rds_endpoint" {
  description = "RDS endpoint"
  value       = module.rds.db_endpoint
  sensitive   = true
}

output "redis_endpoint" {
  description = "Redis endpoint"
  value       = module.elasticache.redis_endpoint
  sensitive   = true
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

output "cloudwatch_log_group" {
  description = "CloudWatch log group name"
  value       = aws_cloudwatch_log_group.ecs.name
}
