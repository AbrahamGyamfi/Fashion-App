resource "aws_amplify_app" "frontend" {
  name       = "${var.project_name}-frontend-${var.environment}"
  repository = "https://github.com/${var.github_repository}"
  
  platform = "WEB"

  access_token = var.github_token

  # Use amplify.yml from repository instead of inline build_spec
  # build_spec is commented out to use the file in the repo

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
