# Task Definition for Backend + PostgreSQL + Redis

locals {
  container_definitions = [
    # Container 1: Backend API
    {
      name  = var.backend_container_name
      image = var.container_image

      portMappings = [{
        containerPort = var.container_port
        protocol      = "tcp"
      }]

      environment = [
        { name = "NODE_ENV", value = var.environment },
        { name = "PORT", value = tostring(var.container_port) },
        { name = "AWS_REGION", value = data.aws_region.current.name },
        { name = "DATABASE_URL", value = "postgresql://${var.db_host}:${var.db_port}/${var.db_name}" },
        { name = "REDIS_URL", value = "redis://${var.redis_host}:${var.redis_port}" }
      ]

      secrets = [
        { name = "DB_PASSWORD", valueFrom = "${var.secrets_arns.database}:password::" },
        { name = "REDIS_PASSWORD", valueFrom = "${var.secrets_arns.redis}:password::" },
        { name = "JWT_SECRET", valueFrom = "${var.secrets_arns.app}:jwt_secret::" }
      ]

      dependsOn = [
        { containerName = var.postgres_container_name, condition = "HEALTHY" },
        { containerName = var.redis_container_name, condition = "HEALTHY" }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/${var.project_name}-backend-${var.environment}"
          "awslogs-region"        = data.aws_region.current.name
          "awslogs-stream-prefix" = "backend"
        }
      }

      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:${var.container_port}/api/health || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }
    },

    # Container 2: PostgreSQL
    {
      name  = var.postgres_container_name
      image = var.postgres_image

      portMappings = [{
        containerPort = var.db_port
        protocol      = "tcp"
      }]

      environment = [
        { name = "POSTGRES_DB", value = var.db_name },
        { name = "POSTGRES_USER", value = var.db_username },
        { name = "PGDATA", value = var.postgres_data_dir }
      ]

      secrets = [
        { name = "POSTGRES_PASSWORD", valueFrom = "${var.secrets_arns.database}:password::" }
      ]

      mountPoints = [{
        sourceVolume  = "postgres-data"
        containerPath = "/var/lib/postgresql/data"
        readOnly      = false
      }]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/${var.project_name}-postgres-${var.environment}"
          "awslogs-region"        = data.aws_region.current.name
          "awslogs-stream-prefix" = "postgres"
        }
      }

      healthCheck = {
        command     = ["CMD-SHELL", "pg_isready -U ${var.db_username} -d ${var.db_name} || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }
    },

    # Container 3: Redis
    {
      name  = var.redis_container_name
      image = var.redis_image

      portMappings = [{
        containerPort = var.redis_port
        protocol      = "tcp"
      }]

      command = ["redis-server", "--appendonly", "yes", "--dir", var.redis_data_dir]

      mountPoints = [{
        sourceVolume  = "redis-data"
        containerPath = var.redis_data_dir
        readOnly      = false
      }]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/${var.project_name}-redis-${var.environment}"
          "awslogs-region"        = data.aws_region.current.name
          "awslogs-stream-prefix" = "redis"
        }
      }

      healthCheck = {
        command     = ["CMD-SHELL", "redis-cli ping || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 30
      }
    }
  ]
}

# ECS Task Definition
resource "aws_ecs_task_definition" "main" {
  family                   = "${var.project_name}-${var.environment}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.cpu
  memory                   = var.memory
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  # EFS volume for PostgreSQL data
  volume {
    name = "postgres-data"
    efs_volume_configuration {
      file_system_id     = var.efs_file_system_id
      root_directory     = "/postgres"
      transit_encryption = "ENABLED"
    }
  }

  # EFS volume for Redis data
  volume {
    name = "redis-data"
    efs_volume_configuration {
      file_system_id     = var.efs_file_system_id
      root_directory     = "/redis"
      transit_encryption = "ENABLED"
    }
  }

  container_definitions = jsonencode(local.container_definitions)

  tags = var.tags
}
