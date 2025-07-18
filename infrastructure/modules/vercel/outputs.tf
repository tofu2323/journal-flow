# Outputs for Vercel module

output "project_id" {
  description = "Vercel project ID"
  value       = vercel_project.journal_app.id
}

output "project_name" {
  description = "Vercel project name"
  value       = vercel_project.journal_app.name
}

output "production_url" {
  description = "Production deployment URL"
  value       = "https://${vercel_project.journal_app.name}.vercel.app"
}