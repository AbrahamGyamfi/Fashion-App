output "database_secret_arn" {
  description = "ARN of database secret"
  value       = aws_secretsmanager_secret.database.arn
  sensitive   = true
}

output "redis_secret_arn" {
  description = "ARN of Redis secret"
  value       = aws_secretsmanager_secret.redis.arn
  sensitive   = true
}

output "app_secret_arn" {
  description = "ARN of application secret"
  value       = aws_secretsmanager_secret.app.arn
  sensitive   = true
}

output "database_secret_name" {
  description = "Name of database secret"
  value       = aws_secretsmanager_secret.database.name
}

output "redis_secret_name" {
  description = "Name of Redis secret"
  value       = aws_secretsmanager_secret.redis.name
}

output "app_secret_name" {
  description = "Name of application secret"
  value       = aws_secretsmanager_secret.app.name
}
