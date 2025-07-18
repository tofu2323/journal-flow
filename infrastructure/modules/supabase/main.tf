# Supabase module for Journal Flow application

terraform {
  required_providers {
    supabase = {
      source  = "supabase/supabase"
      version = "~> 1.0"
    }
  }
}

# Supabase Project
resource "supabase_project" "journal_app" {
  organization_id   = var.supabase_org_id
  name             = "journal-flow-${var.environment}"
  database_password = var.supabase_db_password
  region           = var.supabase_region
  
  # Ignore changes to database_password after creation
  lifecycle {
    ignore_changes = [database_password]
  }
}

# Authentication Settings will be configured manually in Supabase Dashboard
# The Terraform provider has limited support for auth settings
# TODO: Configure auth settings via Supabase Dashboard or API after project creation