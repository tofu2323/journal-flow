#!/bin/bash
set -e

echo "🚀 Starting Supabase local development setup..."
supabase start

echo "🔄 Resetting database to test migrations..."
supabase db reset

echo "🧪 Running database tests..."
# Add your database tests here
echo "Database tests would run here"

echo "📝 Generating TypeScript types..."
supabase gen types typescript --local > schema.gen.ts

echo "🔍 Checking if generated types are up to date..."
if ! git diff --ignore-space-at-eol --exit-code --quiet schema.gen.ts; then
  echo "❌ Detected uncommitted changes after build. See status below:"
  git diff schema.gen.ts
  echo "Please run 'supabase gen types typescript --local > src/types/supabase.ts' and commit the changes."
  exit 1
fi

echo "✅ All migration validations passed!"

echo "🛑 Stopping Supabase..."
supabase stop

echo "✨ Migration validation completed successfully!"