# Variables for GitHub module

variable "repository_name" {
  description = "GitHub repository name"
  type        = string
}

variable "supabase_access_token" {
  description = "Supabase access token"
  type        = string
  sensitive   = true
}

variable "supabase_org_id" {
  description = "Supabase organization ID"
  type        = string
}

variable "supabase_region" {
  description = "Supabase region"
  type        = string
  default     = "ap-northeast-1"
}

variable "supabase_db_password_dev" {
  description = "Development database password"
  type        = string
  sensitive   = true
}

variable "supabase_db_password_prod" {
  description = "Production database password"
  type        = string
  sensitive   = true
}

variable "supabase_project_ref_dev" {
  description = "Development project reference"
  type        = string
}

variable "supabase_project_ref_prod" {
  description = "Production project reference"
  type        = string
}

variable "production_reviewers" {
  description = "List of GitHub usernames who can approve production deployments"
  type        = list(string)
  default     = []
}