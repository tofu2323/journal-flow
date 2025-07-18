# Main Terraform configuration for Journal Flow Cloud Sync
terraform {
  required_version = ">= 1.0"
  required_providers {
    supabase = {
      source  = "supabase/supabase"
      version = "~> 1.0"
    }
    github = {
      source  = "integrations/github"
      version = "~> 5.0"
    }
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.15"
    }
  }

  # Backend configuration for state management
  # Uncomment and configure for production use
  # backend "s3" {
  #   bucket = "your-terraform-state-bucket"
  #   key    = "journal-flow/terraform.tfstate"
  #   region = "ap-northeast-1"
  # }
}

# Configure the Supabase Provider
provider "supabase" {
  access_token = var.supabase_access_token
}

# Configure the GitHub Provider
provider "github" {
  token = var.github_token
}

# Configure the Vercel Provider
provider "vercel" {
  api_token = var.vercel_api_token
}

# Development Environment
module "supabase_dev" {
  source = "./modules/supabase"

  environment          = "dev"
  supabase_org_id      = var.supabase_org_id
  supabase_region      = var.supabase_region
  supabase_db_password = var.supabase_db_password_dev
}

# Production Environment
module "supabase_prod" {
  source = "./modules/supabase"

  environment          = "prod"
  supabase_org_id      = var.supabase_org_id
  supabase_region      = var.supabase_region
  supabase_db_password = var.supabase_db_password_prod
}

# GitHub Repository Management
module "github_repo" {
  source = "./modules/github"

  repository_name             = var.github_repository_name
  supabase_access_token      = var.supabase_access_token
  supabase_org_id            = var.supabase_org_id
  supabase_region            = var.supabase_region
  supabase_db_password_dev   = var.supabase_db_password_dev
  supabase_db_password_prod  = var.supabase_db_password_prod
  supabase_project_ref_dev   = module.supabase_dev.project_id
  supabase_project_ref_prod  = module.supabase_prod.project_id
  production_reviewers       = var.production_reviewers
  vercel_api_token           = var.vercel_api_token
  vercel_org_id              = module.vercel_project.project_id
  vercel_project_id          = module.vercel_project.project_id
}

# Vercel Project Management
module "vercel_project" {
  source = "./modules/vercel"

  project_name           = "journal-flow"
  github_repository      = "${var.github_repository_owner}/${var.github_repository_name}"
  supabase_url_prod      = module.supabase_prod.project_url
  supabase_anon_key_prod = module.supabase_prod.anon_key
  supabase_url_dev       = module.supabase_dev.project_url
  supabase_anon_key_dev  = module.supabase_dev.anon_key
}