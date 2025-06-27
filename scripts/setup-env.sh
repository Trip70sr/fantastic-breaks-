#!/bin/bash

# Environment Setup Script for Employee Break Protocol App

echo "🚀 Setting up environment variables for Employee Break Protocol App..."

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists. Creating backup..."
    cp .env.local .env.local.backup.$(date +%Y%m%d_%H%M%S)
fi

# Copy example file
if [ -f ".env.example" ]; then
    cp .env.example .env.local
    echo "✅ Created .env.local from .env.example"
else
    echo "❌ .env.example not found. Please create it first."
    exit 1
fi

# Generate NEXTAUTH_SECRET
echo "🔐 Generating NEXTAUTH_SECRET..."
if command -v openssl &> /dev/null; then
    SECRET=$(openssl rand -base64 32)
    # Replace placeholder in .env.local
    sed -i.bak "s/your-super-secret-key-change-this-in-production-min-32-chars/$SECRET/g" .env.local
    echo "✅ Generated NEXTAUTH_SECRET"
else
    echo "⚠️  OpenSSL not found. Please manually set NEXTAUTH_SECRET in .env.local"
fi

echo ""
echo "📝 Next steps:"
echo "1. Edit .env.local and fill in your actual values"
echo "2. Set up SendGrid API key for email functionality"
echo "3. Configure your company information"
echo "4. Set up database connection (optional)"
echo ""
echo "🔗 Useful links:"
echo "- SendGrid API Keys: https://app.sendgrid.com/settings/api_keys"
echo "- Supabase Dashboard: https://app.supabase.com/"
echo "- Google Cloud Console: https://console.cloud.google.com/"
echo ""
echo "✅ Environment setup complete!"
