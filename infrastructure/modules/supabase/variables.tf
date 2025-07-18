# Variables for Supabase module

variable "environment" {
  description = "Environment name (dev, prod)"
  type        = string
  
  validation {
    condition     = contains(["dev", "prod"], var.environment)
    error_message = "Environment must be either 'dev' or 'prod'."
  }
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

variable "supabase_db_password" {
  description = "Database password for this environment"
  type        = string
  sensitive   = true
}

variable "site_url" {
  description = "Site URL for authentication redirects"
  type        = string
  default     = null
}

variable "additional_redirect_urls" {
  description = "Additional redirect URLs for authentication"
  type        = list(string)
  default     = []
}