# Output values from Terraform configuration

output "supabase_dev_project_id" {
  description = "Development Supabase project ID"
  value       = module.supabase_dev.project_id
}

output "supabase_dev_project_url" {
  description = "Development Supabase project URL"
  value       = module.supabase_dev.project_url
}

output "supabase_dev_anon_key" {
  description = "Development Supabase anonymous key"
  value       = module.supabase_dev.anon_key
  sensitive   = true
}

output "supabase_prod_project_id" {
  description = "Production Supabase project ID"
  value       = module.supabase_prod.project_id
}

output "supabase_prod_project_url" {
  description = "Production Supabase project URL"
  value       = module.supabase_prod.project_url
}

output "supabase_prod_anon_key" {
  description = "Production Supabase anonymous key"
  value       = module.supabase_prod.anon_key
  sensitive   = true
}

output "github_development_environment_id" {
  description = "GitHub development environment ID"
  value       = module.github_repo.development_environment_id
}

output "github_production_environment_id" {
  description = "GitHub production environment ID"
  value       = module.github_repo.production_environment_id
}

output "vercel_project_id" {
  description = "Vercel project ID"
  value       = module.vercel_project.project_id
}

output "vercel_production_url" {
  description = "Vercel production URL"
  value       = module.vercel_project.production_url
}