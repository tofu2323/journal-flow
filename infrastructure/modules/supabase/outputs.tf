# Outputs for Supabase module

output "project_id" {
  description = "Supabase project ID"
  value       = supabase_project.journal_app.id
}

# Note: API URL, anon key, and service role key are not directly available
# from the Terraform provider. These need to be retrieved from Supabase Dashboard
# or API after project creation.

# Placeholder outputs for CI/CD compatibility
output "project_url" {
  description = "Supabase project URL (to be configured manually)"
  value       = "https://${supabase_project.journal_app.id}.supabase.co"
}

output "anon_key" {
  description = "Supabase anonymous key (to be retrieved manually)"
  value       = "anon-key-to-be-retrieved-from-dashboard"
  sensitive   = true
}

output "service_role_key" {
  description = "Supabase service role key (to be retrieved manually)"
  value       = "service-role-key-to-be-retrieved-from-dashboard"
  sensitive   = true
}