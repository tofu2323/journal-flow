# GitHub repository management module

terraform {
  required_providers {
    github = {
      source  = "integrations/github"
      version = "~> 5.0"
    }
  }
}

# Repository environments
resource "github_repository_environment" "development" {
  repository  = var.repository_name
  environment = "development"
  
  deployment_branch_policy {
    protected_branches     = false
    custom_branch_policies = true
  }
}

resource "github_repository_environment" "production" {
  repository  = var.repository_name
  environment = "production"
  
  deployment_branch_policy {
    protected_branches     = true
    custom_branch_policies = false
  }
  
  # Manual approval for production deployments can be configured later via GitHub UI
}

# Repository secrets
resource "github_actions_secret" "supabase_access_token" {
  repository      = var.repository_name
  secret_name     = "SUPABASE_ACCESS_TOKEN"
  plaintext_value = var.supabase_access_token
}

resource "github_actions_secret" "supabase_org_id" {
  repository      = var.repository_name
  secret_name     = "SUPABASE_ORG_ID"
  plaintext_value = var.supabase_org_id
}

resource "github_actions_secret" "supabase_db_password_dev" {
  repository      = var.repository_name
  secret_name     = "SUPABASE_DB_PASSWORD_DEV"
  plaintext_value = var.supabase_db_password_dev
}

resource "github_actions_secret" "supabase_db_password_prod" {
  repository      = var.repository_name
  secret_name     = "SUPABASE_DB_PASSWORD_PROD"
  plaintext_value = var.supabase_db_password_prod
}

# Environment-specific secrets
resource "github_actions_environment_secret" "supabase_project_ref_dev" {
  repository      = var.repository_name
  environment     = github_repository_environment.development.environment
  secret_name     = "SUPABASE_PROJECT_REF"
  plaintext_value = var.supabase_project_ref_dev
}

resource "github_actions_environment_secret" "supabase_project_ref_prod" {
  repository      = var.repository_name
  environment     = github_repository_environment.production.environment
  secret_name     = "SUPABASE_PROJECT_REF"
  plaintext_value = var.supabase_project_ref_prod
}

# Repository variables
resource "github_actions_variable" "supabase_region" {
  repository    = var.repository_name
  variable_name = "SUPABASE_REGION"
  value         = var.supabase_region
}