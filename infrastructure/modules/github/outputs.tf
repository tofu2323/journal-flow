# Outputs for GitHub module

output "development_environment_id" {
  description = "Development environment ID"
  value       = github_repository_environment.development.id
}

output "production_environment_id" {
  description = "Production environment ID"
  value       = github_repository_environment.production.id
}