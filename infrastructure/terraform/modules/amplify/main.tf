resource "aws_amplify_app" "frontend" {
  name       = "${var.project_name}-frontend-${var.environment}"
  repository = "https://github.com/${var.github_repository}"
  
  platform = "WEB"

  access_token = var.github_token

  build_spec = <<-EOT
    version: 1
    frontend:
      phases:
        preBuild:
          commands:
            - cd frontend
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: frontend/build
        files:
          - '**/*'
      cache:
        paths:
          - frontend/node_modules/**/*
  EOT

  environment_variables = {
    REACT_APP_API_URL = var.api_url
  }

  custom_rule {
    source = "/<*>"
    target = "/index.html"
    status = "200"
  }

  tags = var.tags
}

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.frontend.id
  branch_name = var.branch_name

  enable_auto_build = true
  
  # Only trigger builds when frontend files change
  enable_pull_request_preview = false

  environment_variables = {
    REACT_APP_API_URL = var.api_url
  }
}
