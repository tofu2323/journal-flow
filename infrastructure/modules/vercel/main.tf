# Vercel module for Journal Flow application

terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.15"
    }
  }
}

# Vercel Project
resource "vercel_project" "journal_app" {
  name      = var.project_name
  framework = "vite"
  
  git_repository = {
    type = "github"
    repo = var.github_repository
  }

  # Environment variables for all deployments
  environment = [
    {
      key    = "NODE_ENV"
      value  = "production"
      target = ["production", "preview"]
    }
  ]

  # Build settings
  build_command    = "npm run build"
  output_directory = "dist"
  install_command  = "npm ci"
}

# Production Environment Variables
resource "vercel_project_environment_variable" "supabase_url_prod" {
  project_id = vercel_project.journal_app.id
  key        = "VITE_SUPABASE_URL"
  value      = var.supabase_url_prod
  target     = ["production"]
}

resource "vercel_project_environment_variable" "supabase_anon_key_prod" {
  project_id = vercel_project.journal_app.id
  key        = "VITE_SUPABASE_ANON_KEY"
  value      = var.supabase_anon_key_prod
  target     = ["production"]
}

# Preview Environment Variables (for PRs)
resource "vercel_project_environment_variable" "supabase_url_dev" {
  project_id = vercel_project.journal_app.id
  key        = "VITE_SUPABASE_URL"
  value      = var.supabase_url_dev
  target     = ["preview"]
}

resource "vercel_project_environment_variable" "supabase_anon_key_dev" {
  project_id = vercel_project.journal_app.id
  key        = "VITE_SUPABASE_ANON_KEY"
  value      = var.supabase_anon_key_dev
  target     = ["preview"]
}