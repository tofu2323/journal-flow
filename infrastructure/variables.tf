# Input variables for Terraform configuration

variable "supabase_access_token" {
  description = "Supabase access token for API authentication"
  type        = string
  sensitive   = true
}

variable "supabase_org_id" {
  description = "Supabase organization ID"
  type        = string
}

variable "supabase_region" {
  description = "Supabase project region"
  type        = string
  default     = "ap-northeast-1"
}

variable "supabase_db_password_dev" {
  description = "Database password for development environment"
  type        = string
  sensitive   = true
}

variable "supabase_db_password_prod" {
  description = "Database password for production environment"
  type        = string
  sensitive   = true
}

variable "github_token" {
  description = "GitHub personal access token"
  type        = string
  sensitive   = true
}

variable "github_repository_name" {
  description = "GitHub repository name"
  type        = string
  default     = "journal-flow"
}

variable "production_reviewers" {
  description = "List of GitHub usernames who can approve production deployments"
  type        = list(string)
  default     = []
}