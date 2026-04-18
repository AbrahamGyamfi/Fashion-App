resource "aws_secretsmanager_secret" "database" {
  name        = "${var.project_name}/database-${var.environment}"
  description = "Database credentials for ${var.project_name}"

  recovery_window_in_days = var.recovery_window_in_days

  tags = merge(var.tags, {
    Name = "${var.project_name}-database-secret-${var.environment}"
  })
}

resource "aws_secretsmanager_secret_version" "database" {
  secret_id     = aws_secretsmanager_secret.database.id
  secret_string = jsonencode(var.database_secrets)
}

resource "aws_secretsmanager_secret" "redis" {
  name        = "${var.project_name}/redis-${var.environment}"
  description = "Redis credentials for ${var.project_name}"

  recovery_window_in_days = var.recovery_window_in_days

  tags = merge(var.tags, {
    Name = "${var.project_name}-redis-secret-${var.environment}"
  })
}

resource "aws_secretsmanager_secret_version" "redis" {
  secret_id     = aws_secretsmanager_secret.redis.id
  secret_string = jsonencode(var.redis_secrets)
}

resource "aws_secretsmanager_secret" "app" {
  name        = "${var.project_name}/app-${var.environment}"
  description = "Application secrets for ${var.project_name}"

  recovery_window_in_days = var.recovery_window_in_days

  tags = merge(var.tags, {
    Name = "${var.project_name}-app-secret-${var.environment}"
  })
}

resource "aws_secretsmanager_secret_version" "app" {
  secret_id     = aws_secretsmanager_secret.app.id
  secret_string = jsonencode(var.app_secrets)
}
