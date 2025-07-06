#!/bin/bash

# Vercel Environment Variables Setup Script
# This script helps you add all required environment variables to Vercel

echo "🚀 Vercel Environment Variables Setup"
echo "===================================="
echo ""
echo "This script will help you add environment variables to your Vercel project."
echo "Make sure you're logged in to Vercel CLI first (run: vercel login)"
echo ""

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo "❌ You're not logged in to Vercel CLI"
    echo "Please run: vercel login"
    exit 1
fi

echo "✅ Logged in to Vercel"
echo ""

# Function to add environment variable
add_env_var() {
    local key=$1
    local env_type=$2
    local required=$3
    local description=$4
    
    echo ""
    echo "📝 $key ($description)"
    if [ "$required" = "required" ]; then
        echo "   ⚠️  This variable is REQUIRED"
    else
        echo "   ℹ️  This variable is optional"
    fi
    
    read -p "Enter value for $key (or press Enter to skip): " value
    
    if [ ! -z "$value" ]; then
        # Add to all environments by default
        if [ "$env_type" = "all" ]; then
            vercel env add "$key" production preview development <<< "$value"
        elif [ "$env_type" = "production" ]; then
            vercel env add "$key" production <<< "$value"
        else
            vercel env add "$key" preview development <<< "$value"
        fi
        echo "✅ Added $key"
    else
        if [ "$required" = "required" ]; then
            echo "⚠️  Warning: Skipped required variable $key"
        else
            echo "⏭️  Skipped $key"
        fi
    fi
}

echo "Starting environment variable setup..."
echo "====================================="

# Supabase (Required)
add_env_var "NEXT_PUBLIC_SUPABASE_URL" "all" "required" "Your Supabase project URL"
add_env_var "NEXT_PUBLIC_SUPABASE_ANON_KEY" "all" "required" "Your Supabase anonymous key"
add_env_var "SUPABASE_SERVICE_KEY" "all" "required" "Your Supabase service key (secret)"

# AI Keys (Required for Ask Blipee)
echo ""
echo "🤖 AI Provider Keys"
echo "==================="
add_env_var "DEEPSEEK_API_KEY" "all" "required" "DeepSeek API key (primary AI provider)"
add_env_var "OPENAI_API_KEY" "all" "optional" "OpenAI API key (fallback provider)"
add_env_var "ANTHROPIC_API_KEY" "all" "optional" "Anthropic API key (fallback provider)"

# Security & Monitoring
echo ""
echo "🔐 Security & Monitoring"
echo "======================="
add_env_var "METRICS_AUTH_TOKEN" "production" "optional" "Token for accessing metrics endpoint"
add_env_var "RATE_LIMIT_REDIS_URL" "production" "optional" "Redis URL for rate limiting"

# Email/SMTP (Optional)
echo ""
echo "📧 Email Configuration (Optional)"
echo "================================"
add_env_var "SMTP_HOST" "all" "optional" "SMTP server host"
add_env_var "SMTP_PORT" "all" "optional" "SMTP server port"
add_env_var "SMTP_USER" "all" "optional" "SMTP username"
add_env_var "SMTP_PASS" "all" "optional" "SMTP password"
add_env_var "SMTP_FROM_EMAIL" "all" "optional" "From email address"
add_env_var "SMTP_FROM_NAME" "all" "optional" "From name"

# Development/Preview specific
echo ""
echo "🔧 Development/Preview Environment"
echo "================================="
add_env_var "NEXT_PUBLIC_ENVIRONMENT" "preview" "optional" "Environment name (development/preview)"
add_env_var "NEXT_PUBLIC_ENABLE_DEBUG" "preview" "optional" "Enable debug mode (true/false)"

echo ""
echo "✨ Setup Complete!"
echo "=================="
echo ""
echo "To view your environment variables:"
echo "  vercel env ls"
echo ""
echo "To pull them locally for development:"
echo "  vercel env pull .env.local"
echo ""
echo "Your app will redeploy automatically with the new variables!"