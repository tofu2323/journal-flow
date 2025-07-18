# Variables for Vercel module

variable "project_name" {
  description = "Vercel project name"
  type        = string
  default     = "journal-flow"
}

variable "github_repository" {
  description = "GitHub repository in format 'owner/repo'"
  type        = string
}

variable "supabase_url_prod" {
  description = "Production Supabase URL"
  type        = string
}

variable "supabase_anon_key_prod" {
  description = "Production Supabase anonymous key"
  type        = string
  sensitive   = true
}

variable "supabase_url_dev" {
  description = "Development Supabase URL"
  type        = string
}

variable "supabase_anon_key_dev" {
  description = "Development Supabase anonymous key"
  type        = string
  sensitive   = true
}